/**
 * 어휘 데이터에서 바로 만들어 낼 수 있는 실전 연습 문항.
 * 스펙 JN4-017(한자 읽기), JN4-018(표기).
 *
 * 문장은 어휘의 예문을 쓴다. 예문은 모두 새로 쓴 것이므로 기출 복제에 해당하지 않는다 (JN4-026).
 */

import { confusableIds } from "./quizGenerator.js";
import { shuffle } from "./random.js";

/** @typedef {import("../data/vocabulary.js").VocabularyItem} VocabularyItem */

/**
 * @typedef {Object} PracticeQuestion
 * @property {string} id
 * @property {"reading"|"orthography"|"context"|"synonym"|"usage"} typeId
 * @property {string} sentence     밑줄 대상을 MARKER로 감싼 문장
 * @property {string} prompt       한국어 지시문
 * @property {string[]} choices    선택지 4개
 * @property {number} answerIndex
 * @property {string} explanation  한국어 해설
 */

/** 밑줄 대상을 감싸는 표식. 화면에서 밑줄로 그려 준다. */
export const MARKER = "＿";

/** 앞에서부터 처음 만나는 하나만 바꾼다. */
function replaceFirst(text, target, replacement) {
  const index = text.indexOf(target);
  if (index === -1) throw new Error(`예문에 "${target}"이(가) 없습니다: ${text}`);
  return text.slice(0, index) + replacement + text.slice(index + target.length);
}

/**
 * 오답 세 개를 고른다. 혼동 후보를 먼저 쓰고 부족하면 나머지에서 채운다 (JN4-027).
 * @param {VocabularyItem} item
 * @param {VocabularyItem[]} pool
 * @param {(item: VocabularyItem) => string} valueOf
 * @param {() => number} rand
 */
function pickDistractors(item, pool, valueOf, rand) {
  const confusable = new Set(confusableIds(item, pool));
  const others = pool.filter((candidate) => candidate.id !== item.id);
  const ordered = [
    ...shuffle(others.filter((candidate) => confusable.has(candidate.id)), rand),
    ...shuffle(others.filter((candidate) => !confusable.has(candidate.id)), rand),
  ];

  const used = new Set([valueOf(item)]);
  const picked = [];
  for (const candidate of ordered) {
    if (picked.length === 3) break;
    const value = valueOf(candidate);
    if (used.has(value)) continue;
    used.add(value);
    picked.push(value);
  }
  return picked;
}

function assemble({ id, typeId, sentence, prompt, answer, distractors, explanation, rand }) {
  const choices = shuffle([answer, ...distractors], rand);
  return { id, typeId, sentence, prompt, choices, answerIndex: choices.indexOf(answer), explanation };
}

/**
 * 한자 표기를 밑줄로 보여 주고 읽기를 묻는다 (JN4-017).
 * @param {VocabularyItem[]} vocabulary
 * @param {() => number} rand
 * @returns {PracticeQuestion[]}
 */
export function buildReadingQuestions(vocabulary, rand) {
  return vocabulary.map((item) =>
    assemble({
      id: `reading:${item.id}`,
      typeId: "reading",
      sentence: replaceFirst(item.example, item.word, `${MARKER}${item.word}${MARKER}`),
      prompt: "밑줄 친 말의 읽기로 알맞은 것을 고르세요.",
      answer: item.reading,
      distractors: pickDistractors(item, vocabulary, (candidate) => candidate.reading, rand),
      explanation: `「${item.word}」의 읽기는 ${item.reading}, 뜻은 '${item.meaning}'입니다.`,
      rand,
    })
  );
}

/**
 * 히라가나 읽기를 밑줄로 보여 주고 한자 표기를 묻는다 (JN4-018).
 * @param {VocabularyItem[]} vocabulary
 * @param {() => number} rand
 * @returns {PracticeQuestion[]}
 */
export function buildOrthographyQuestions(vocabulary, rand) {
  return vocabulary.map((item) =>
    assemble({
      id: `orthography:${item.id}`,
      typeId: "orthography",
      sentence: replaceFirst(item.example, item.word, `${MARKER}${item.reading}${MARKER}`),
      prompt: "밑줄 친 말을 한자로 바르게 쓴 것을 고르세요.",
      answer: item.word,
      distractors: pickDistractors(item, vocabulary, (candidate) => candidate.word, rand),
      explanation: `「${item.reading}」의 표기는 ${item.word}, 뜻은 '${item.meaning}'입니다.`,
      rand,
    })
  );
}
