import { describe, it, expect } from "vitest";
import { MARKER, buildReadingQuestions, buildOrthographyQuestions } from "./questionBuilders.js";
import { VOCABULARY } from "../data/vocabulary.js";

const ZERO = () => 0;

/** 밑줄 표식이 감싼 부분을 뽑는다. */
function underlined(sentence) {
  const [, inner] = sentence.split(MARKER);
  return inner;
}

describe.each([
  ["한자 읽기", "reading", buildReadingQuestions],
  ["표기", "orthography", buildOrthographyQuestions],
])("%s 문항 생성 (JN4-017, JN4-018)", (_label, typeId, build) => {
  const questions = build(VOCABULARY, ZERO);

  it("어휘 수만큼 문항을 만든다", () => {
    expect(questions).toHaveLength(103);
  });

  it("문항 식별자가 중복되지 않는다", () => {
    expect(new Set(questions.map((question) => question.id)).size).toBe(103);
  });

  it("유형 식별자가 올바르다", () => {
    for (const question of questions) expect(question.typeId).toBe(typeId);
  });

  it("선택지가 4개이고 중복이 없다", () => {
    for (const question of questions) {
      expect(question.choices, question.id).toHaveLength(4);
      expect(new Set(question.choices).size, question.id).toBe(4);
    }
  });

  it("정답 인덱스가 0~3 범위다", () => {
    for (const question of questions) {
      expect(question.answerIndex, question.id).toBeGreaterThanOrEqual(0);
      expect(question.answerIndex, question.id).toBeLessThanOrEqual(3);
    }
  });

  it("지시문과 해설이 비어 있지 않다", () => {
    for (const question of questions) {
      expect(question.prompt, question.id).toBeTruthy();
      expect(question.explanation, question.id).toBeTruthy();
    }
  });

  it("밑줄 표식이 문장에 정확히 두 번 들어간다", () => {
    for (const question of questions) {
      expect(question.sentence.split(MARKER).length - 1, question.id).toBe(2);
    }
  });
});

describe("한자 읽기 문항 (JN4-017)", () => {
  const questions = buildReadingQuestions(VOCABULARY, ZERO);

  it("문장에 한자 표기를 밑줄로 보여 주고 읽기를 정답으로 삼는다", () => {
    for (const [index, question] of questions.entries()) {
      const vocab = VOCABULARY[index];
      expect(underlined(question.sentence), vocab.word).toBe(vocab.word);
      expect(question.choices[question.answerIndex], vocab.word).toBe(vocab.reading);
    }
  });

  it("문장에 정답 읽기가 미리 드러나지 않는다", () => {
    for (const [index, question] of questions.entries()) {
      const vocab = VOCABULARY[index];
      if (vocab.word === vocab.reading) continue;
      expect(question.sentence, vocab.word).not.toContain(vocab.reading);
    }
  });

  it("선택지가 모두 히라가나다", () => {
    for (const question of questions) {
      for (const choice of question.choices) {
        expect(choice, question.id).toMatch(/^[ぁ-ゖー]+$/);
      }
    }
  });
});

describe("표기 문항 (JN4-018)", () => {
  const questions = buildOrthographyQuestions(VOCABULARY, ZERO);

  it("문장에 히라가나 읽기를 밑줄로 보여 주고 표기를 정답으로 삼는다", () => {
    for (const [index, question] of questions.entries()) {
      const vocab = VOCABULARY[index];
      expect(underlined(question.sentence), vocab.word).toBe(vocab.reading);
      expect(question.choices[question.answerIndex], vocab.word).toBe(vocab.word);
    }
  });

  it("문장에 정답 표기가 미리 드러나지 않는다", () => {
    for (const [index, question] of questions.entries()) {
      const vocab = VOCABULARY[index];
      if (vocab.word === vocab.reading) continue;
      expect(question.sentence, vocab.word).not.toContain(vocab.word);
    }
  });
});
