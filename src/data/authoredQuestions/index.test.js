import { describe, it, expect } from "vitest";
import { AUTHORED_QUESTIONS, AUTHORED_TYPES, BLANK, ENTRIES, authoredByType } from "./index.js";
import { MARKER } from "../../lib/questionBuilders.js";
import { VOCABULARY, findById } from "../vocabulary.js";

const TYPE_LABEL = { context: "문맥상 어휘", synonym: "유의 표현", usage: "용법" };

function count(text, needle) {
  return text.split(needle).length - 1;
}

describe("창작 문항 은행 (JN4-019~JN4-021, AC-7)", () => {
  it("세 유형이 각각 어휘 수만큼 있다", () => {
    for (const typeId of AUTHORED_TYPES) {
      expect(authoredByType(typeId), TYPE_LABEL[typeId]).toHaveLength(VOCABULARY.length);
    }
  });

  it("모든 어휘가 세 유형에 한 번씩 등장한다", () => {
    const missing = [];
    for (const vocab of VOCABULARY) {
      for (const typeId of AUTHORED_TYPES) {
        const found = authoredByType(typeId).filter((question) => question.vocabId === vocab.id);
        if (found.length !== 1) missing.push(`${vocab.word}(${TYPE_LABEL[typeId]}) → ${found.length}개`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("모든 항목이 실제 어휘를 가리킨다", () => {
    for (const entry of ENTRIES) {
      expect(findById(entry.v), entry.v).toBeDefined();
    }
  });

  it("문항 식별자가 중복되지 않는다", () => {
    const ids = AUTHORED_QUESTIONS.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("모든 문항의 선택지가 4개이고 중복이 없다", () => {
    for (const question of AUTHORED_QUESTIONS) {
      expect(question.choices, question.id).toHaveLength(4);
      expect(new Set(question.choices).size, question.id).toBe(4);
    }
  });

  it("정답 인덱스가 0~3 범위이고 지시문·해설이 비어 있지 않다", () => {
    for (const question of AUTHORED_QUESTIONS) {
      expect(question.answerIndex, question.id).toBeGreaterThanOrEqual(0);
      expect(question.answerIndex, question.id).toBeLessThanOrEqual(3);
      expect(question.prompt, question.id).toBeTruthy();
      expect(question.explanation, question.id).toBeTruthy();
    }
  });

  it("문맥상 어휘 문항에 빈칸 표식이 정확히 하나 있다 (JN4-019)", () => {
    for (const question of authoredByType("context")) {
      expect(count(question.sentence, BLANK), question.id).toBe(1);
    }
  });

  it("문맥상 어휘 문항의 선택지에 정답 어휘가 들어 있다 (JN4-019)", () => {
    for (const question of authoredByType("context")) {
      const vocab = findById(question.vocabId);
      expect(question.choices[question.answerIndex], question.id).toBe(vocab.word);
    }
  });

  it("유의 표현 문항은 밑줄 친 부분이 있는 문장을 제시한다 (JN4-020)", () => {
    for (const question of authoredByType("synonym")) {
      expect(count(question.sentence, MARKER), question.id).toBe(2);
      const vocab = findById(question.vocabId);
      expect(question.sentence, question.id).toContain(`${MARKER}${vocab.word}${MARKER}`);
    }
  });

  it("용법 문항은 대상 어휘를 제시하고 네 선택지 모두 문장이다 (JN4-021)", () => {
    for (const question of authoredByType("usage")) {
      const vocab = findById(question.vocabId);
      expect(question.subject, question.id).toBe(vocab.word);
      for (const choice of question.choices) {
        expect(choice, question.id).toMatch(/[。？]$/);
      }
    }
  });

  it("용법 문항은 네 선택지 모두 대상 어휘를 쓴다 (JN4-021)", () => {
    // 실제 시험처럼 네 문장이 모두 대상 어휘를 쓰고, 그중 하나만 쓰임이 바르다.
    // 동사·형용사는 활용하므로 사전형이 아니라 한자를 기준으로 확인한다.
    for (const question of authoredByType("usage")) {
      const vocab = findById(question.vocabId);
      const kanji = [...vocab.word].filter((char) => /[一-鿿]/.test(char));
      for (const choice of question.choices) {
        for (const char of kanji) {
          expect(choice, `${question.id} · ${char}`).toContain(char);
        }
      }
    }
  });

  it("용법 문항의 정답 문장은 대상 어휘를 사전형 그대로 담는다 (JN4-021)", () => {
    for (const question of authoredByType("usage")) {
      const vocab = findById(question.vocabId);
      expect(question.choices[question.answerIndex], question.id).toContain(vocab.word);
    }
  });
});
