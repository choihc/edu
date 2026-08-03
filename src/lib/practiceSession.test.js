import { describe, it, expect } from "vitest";
import { PRACTICE_TYPES, SESSION_SIZE, getBank, startSession, scoreSession } from "./practiceSession.js";
import { VOCABULARY } from "../data/vocabulary.js";

const ZERO = () => 0;

describe("실전 연습 회차 (JN4-016, JN4-022, JN4-023)", () => {
  it("다섯 유형을 스펙 순서대로 제공한다 (JN4-017~JN4-021)", () => {
    expect(PRACTICE_TYPES.map((type) => type.id)).toEqual([
      "reading",
      "orthography",
      "context",
      "synonym",
      "usage",
    ]);
    for (const type of PRACTICE_TYPES) expect(type.label).toBeTruthy();
  });

  it("유형별 문항 은행이 어휘 수만큼 있다 (AC-7)", () => {
    for (const type of PRACTICE_TYPES) {
      expect(getBank(type.id), type.label).toHaveLength(VOCABULARY.length);
    }
  });

  it("알 수 없는 유형에는 빈 은행을 준다", () => {
    expect(getBank("없는유형")).toEqual([]);
  });

  it("회차는 10문항이고 중복이 없다 (JN4-016)", () => {
    for (const type of PRACTICE_TYPES) {
      const session = startSession(type.id, ZERO);
      expect(session, type.label).toHaveLength(SESSION_SIZE);
      expect(new Set(session.map((q) => q.id)).size, type.label).toBe(SESSION_SIZE);
    }
  });

  it("회차 문항은 모두 선택한 유형이다", () => {
    for (const type of PRACTICE_TYPES) {
      for (const question of startSession(type.id, ZERO)) {
        expect(question.typeId).toBe(type.id);
      }
    }
  });

  it("난수를 바꾸면 다른 문항 묶음이 나올 수 있다", () => {
    const first = startSession("reading", () => 0).map((q) => q.id);
    const second = startSession("reading", () => 0.7).map((q) => q.id);
    expect(first).not.toEqual(second);
  });

  it("정답 수를 정확히 센다 (JN4-022)", () => {
    const questions = startSession("reading", ZERO);
    const answers = {};
    questions.forEach((question, index) => {
      answers[question.id] = index < 7 ? question.answerIndex : (question.answerIndex + 1) % 4;
    });

    const result = scoreSession(questions, answers);
    expect(result.total).toBe(10);
    expect(result.correct).toBe(7);
  });

  it("미응답은 오답으로 집계하고 미응답으로 표시한다 (JN4-023)", () => {
    const questions = startSession("context", ZERO);
    const answers = { [questions[0].id]: questions[0].answerIndex };

    const result = scoreSession(questions, answers);
    expect(result.correct).toBe(1);
    expect(result.results[0]).toMatchObject({ selected: questions[0].answerIndex, isCorrect: true, isUnanswered: false });
    expect(result.results[1]).toMatchObject({ selected: null, isCorrect: false, isUnanswered: true });
    expect(result.results.filter((r) => r.isUnanswered)).toHaveLength(9);
  });

  it("결과에는 문항이 순서대로 함께 담긴다 (JN4-022)", () => {
    const questions = startSession("usage", ZERO);
    const result = scoreSession(questions, {});
    expect(result.results.map((r) => r.question.id)).toEqual(questions.map((q) => q.id));
  });

  it("아무것도 답하지 않으면 정답이 0이다 (JN4-023)", () => {
    const questions = startSession("synonym", ZERO);
    expect(scoreSession(questions, {}).correct).toBe(0);
  });
});
