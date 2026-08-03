/**
 * 직접 창작한 실전 연습 문항. 스펙 JN4-019(문맥상 어휘), JN4-020(유의 표현), JN4-021(용법).
 *
 * 세 유형은 어휘 데이터만으로 만들 수 없어 문장을 사람이 쓴다.
 * 모든 문장과 선택지는 새로 쓴 것이며 공식 기출을 옮기지 않는다 (JN4-026).
 *
 * 원본 자료(AuthoredEntry)는 행별 파일에 나눠 두고, 여기서 화면이 쓸 문항 형태로 펼친다.
 *
 * @typedef {Object} AuthoredSlot
 * @property {string} [s] 문제 문장. 유형에 따라 쓰임이 다르다.
 * @property {string} [a] 정답 문장. 유의 표현·용법에서 쓴다.
 * @property {string[]} x 오답 3개
 * @property {string} e 한국어 해설
 *
 * @typedef {Object} AuthoredEntry
 * @property {string} v   어휘 식별자 ("표기|읽기")
 * @property {AuthoredSlot} ctx 문맥상 어휘: s에 빈칸 BLANK가 하나, x는 오답 어휘 3개
 * @property {AuthoredSlot} syn 유의 표현: s에 대상 어휘가 든 원문, a는 바꿔 쓴 문장, x는 오답 문장 3개
 * @property {AuthoredSlot} use 용법: a는 어휘를 바르게 쓴 문장, x는 어색하게 쓴 문장 3개
 */

import { findById } from "../vocabulary.js";
import { MARKER } from "../../lib/questionBuilders.js";
import { ROW_A } from "./rowA.js";
import { ROW_KA } from "./rowKa.js";
import { ROW_SA_TA } from "./rowSaTa.js";
import { ROW_NA_HA } from "./rowNaHa.js";
import { ROW_MA_YA_RA } from "./rowMaYaRa.js";

/** 문맥상 어휘 문항의 빈칸 표식 */
export const BLANK = "（　）";

export const AUTHORED_TYPES = ["context", "synonym", "usage"];

const PROMPT = {
  context: "（　）에 들어갈 가장 알맞은 말을 고르세요.",
  synonym: "밑줄 친 부분과 뜻이 가장 가까운 문장을 고르세요.",
  usage: "다음 말이 가장 알맞게 쓰인 문장을 고르세요.",
};

/** @type {AuthoredEntry[]} */
export const ENTRIES = [...ROW_A, ...ROW_KA, ...ROW_SA_TA, ...ROW_NA_HA, ...ROW_MA_YA_RA];

/**
 * 선택지를 만든다. 정답은 항상 첫 자리에 오지 않도록 어휘 식별자로 자리를 흩는다.
 * 무작위 대신 결정적인 자리 배치를 쓰는 이유는, 같은 문항이 늘 같은 모습이어야
 * 해설과 함께 다시 보기 좋고 테스트도 안정적이기 때문이다.
 */
function placeAnswer(answer, distractors, seed) {
  const position = seed % 4;
  const choices = [...distractors];
  choices.splice(position, 0, answer);
  return { choices, answerIndex: position };
}

/** 문자열을 작은 정수로 접는다. 정답 자리를 문항마다 다르게 하기 위한 용도다. */
function fold(text) {
  let total = 0;
  for (let i = 0; i < text.length; i += 1) total = (total + text.charCodeAt(i) * (i + 1)) % 997;
  return total;
}

function expand(entry) {
  const vocab = findById(entry.v);
  if (!vocab) throw new Error(`알 수 없는 어휘 식별자입니다: ${entry.v}`);

  const questions = [];

  {
    const { choices, answerIndex } = placeAnswer(vocab.word, entry.ctx.x, fold(`context${entry.v}`));
    questions.push({
      id: `context:${entry.v}`,
      typeId: "context",
      vocabId: entry.v,
      subject: "",
      sentence: entry.ctx.s,
      prompt: PROMPT.context,
      choices,
      answerIndex,
      explanation: entry.ctx.e,
    });
  }

  {
    if (!entry.syn.s.includes(vocab.word)) {
      throw new Error(`유의 표현 원문에 "${vocab.word}"이(가) 없습니다: ${entry.syn.s}`);
    }
    const index = entry.syn.s.indexOf(vocab.word);
    const sentence =
      entry.syn.s.slice(0, index) +
      `${MARKER}${vocab.word}${MARKER}` +
      entry.syn.s.slice(index + vocab.word.length);
    const { choices, answerIndex } = placeAnswer(entry.syn.a, entry.syn.x, fold(`synonym${entry.v}`));
    questions.push({
      id: `synonym:${entry.v}`,
      typeId: "synonym",
      vocabId: entry.v,
      subject: "",
      sentence,
      prompt: PROMPT.synonym,
      choices,
      answerIndex,
      explanation: entry.syn.e,
    });
  }

  {
    const { choices, answerIndex } = placeAnswer(entry.use.a, entry.use.x, fold(`usage${entry.v}`));
    questions.push({
      id: `usage:${entry.v}`,
      typeId: "usage",
      vocabId: entry.v,
      subject: vocab.word,
      sentence: "",
      prompt: PROMPT.usage,
      choices,
      answerIndex,
      explanation: entry.use.e,
    });
  }

  return questions;
}

/** @type {import("../../lib/questionBuilders.js").PracticeQuestion[]} */
export const AUTHORED_QUESTIONS = ENTRIES.flatMap(expand);

const BY_TYPE = new Map(
  AUTHORED_TYPES.map((typeId) => [typeId, AUTHORED_QUESTIONS.filter((q) => q.typeId === typeId)])
);

/**
 * @param {"context"|"synonym"|"usage"} typeId
 * @returns {import("../../lib/questionBuilders.js").PracticeQuestion[]}
 */
export function authoredByType(typeId) {
  return BY_TYPE.get(typeId) ?? [];
}
