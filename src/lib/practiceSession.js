/**
 * 실전 연습 한 회차의 구성과 채점. 스펙 JN4-016, JN4-022, JN4-023, JN4-025, JN4-029.
 *
 * 이 모듈은 진도를 건드리지 않는다. 실전 연습 결과는 학습 카드의 복습 예약과
 * 무관하다는 것이 스펙의 요구(JN4-029)이기 때문이다.
 */

import { VOCABULARY } from "../data/vocabulary.js";
import { AUTHORED_TYPES, authoredByType } from "../data/authoredQuestions/index.js";
import { buildOrthographyQuestions, buildReadingQuestions } from "./questionBuilders.js";
import { shuffle } from "./random.js";

/** @typedef {import("./questionBuilders.js").PracticeQuestion} PracticeQuestion */

/** 스펙 JN4-017~JN4-021의 다섯 유형 */
export const PRACTICE_TYPES = [
  { id: "reading", label: "한자 읽기", description: "밑줄 친 한자를 히라가나로 어떻게 읽는지 고릅니다." },
  { id: "orthography", label: "표기", description: "밑줄 친 히라가나를 어떤 한자로 쓰는지 고릅니다." },
  { id: "context", label: "문맥상 어휘", description: "빈칸에 들어갈 가장 알맞은 말을 고릅니다." },
  { id: "synonym", label: "유의 표현", description: "밑줄 친 부분과 뜻이 가장 가까운 문장을 고릅니다." },
  { id: "usage", label: "용법", description: "제시한 말이 알맞게 쓰인 문장을 고릅니다." },
];

/** 한 회차의 문항 수 (JN4-016) */
export const SESSION_SIZE = 10;

/**
 * 문항 은행. 읽기·표기는 어휘 데이터에서 만들고, 나머지 셋은 창작 문항을 쓴다.
 * 생성 순서를 고정하려면 만들 때 결정적인 난수를 쓴다. 회차를 뽑을 때 다시 섞으므로
 * 여기서 무작위를 쓸 필요가 없다.
 */
const FIXED = () => 0;
const BANKS = {
  reading: buildReadingQuestions(VOCABULARY, FIXED),
  orthography: buildOrthographyQuestions(VOCABULARY, FIXED),
  ...Object.fromEntries(AUTHORED_TYPES.map((typeId) => [typeId, authoredByType(typeId)])),
};

/**
 * @param {string} typeId
 * @returns {PracticeQuestion[]}
 */
export function getBank(typeId) {
  return BANKS[typeId] ?? [];
}

/**
 * 문항 은행에서 중복 없이 10문항을 뽑는다 (JN4-016).
 * @param {string} typeId
 * @param {() => number} rand
 * @returns {PracticeQuestion[]}
 */
export function startSession(typeId, rand) {
  return shuffle(getBank(typeId), rand).slice(0, SESSION_SIZE);
}

/**
 * 회차를 채점한다. 답하지 않은 문항은 오답으로 세고 미응답으로 표시한다 (JN4-023).
 *
 * @param {PracticeQuestion[]} questions
 * @param {Record<string, number|undefined>} answers 문항 식별자 → 고른 선택지 위치
 * @returns {{ total: number, correct: number, results: Array<{ question: PracticeQuestion, selected: number|null, isCorrect: boolean, isUnanswered: boolean }> }}
 */
export function scoreSession(questions, answers) {
  const results = questions.map((question) => {
    const picked = answers[question.id];
    const isUnanswered = picked === undefined || picked === null;
    return {
      question,
      selected: isUnanswered ? null : picked,
      isCorrect: !isUnanswered && picked === question.answerIndex,
      isUnanswered,
    };
  });

  return {
    total: questions.length,
    correct: results.filter((result) => result.isCorrect).length,
    results,
  };
}
