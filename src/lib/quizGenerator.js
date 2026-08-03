/**
 * 학습 카드의 네 지선다 구성. 스펙 JN4-007, JN4-027.
 *
 * 무작위는 rand 인자로 주입받는다. 화면에서는 Math.random을 넘기고,
 * 테스트에서는 고정값을 넘겨 같은 결과를 재현한다.
 */

/** @typedef {import("../data/vocabulary.js").VocabularyItem} VocabularyItem */

/**
 * @typedef {Object} RecallQuestion
 * @property {"readingFromWord"|"meaningFromWord"|"wordFromMeaning"} direction
 * @property {string} prompt      화면에 보여 줄 질문. 정답은 담지 않는다.
 * @property {string} subject     질문의 대상이 되는 문자열 (크게 보여 줄 부분)
 * @property {string[]} choices   선택지 4개
 * @property {number} answerIndex 정답 위치
 * @property {VocabularyItem} item
 */

/** 회상 방향 세 가지 */
export const DIRECTIONS = ["readingFromWord", "meaningFromWord", "wordFromMeaning"];

const DIRECTION_LABEL = {
  readingFromWord: "이 단어의 읽기는 무엇일까요?",
  meaningFromWord: "이 단어의 뜻은 무엇일까요?",
  wordFromMeaning: "이 뜻에 해당하는 단어는 무엇일까요?",
};

const KANJI = /[一-鿿]/;

/** 회상 방향에 따라 정답으로 쓸 값을 고른다. */
function valueFor(item, direction) {
  if (direction === "readingFromWord") return item.reading;
  if (direction === "meaningFromWord") return item.meaning;
  return item.word;
}

/** 질문에서 크게 보여 줄 대상. 정답과 겹치지 않아야 한다. */
function subjectFor(item, direction) {
  return direction === "wordFromMeaning" ? item.meaning : item.word;
}

/** 읽기가 헷갈릴 만한지 판단한다. 같은 읽기이거나 앞 두 음절이 같으면 후보로 본다. */
function hasSimilarReading(a, b) {
  if (a === b) return true;
  if (a.length < 2 || b.length < 2) return false;
  return a.slice(0, 2) === b.slice(0, 2);
}

/** rand를 쓰는 Fisher-Yates 섞기. 원본은 건드리지 않는다. */
function shuffle(list, rand) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 오답으로 쓰기 좋은 항목들. 한자를 공유하거나 읽기가 비슷한 항목이다.
 * @param {VocabularyItem} item
 * @param {VocabularyItem[]} pool
 * @returns {string[]}
 */
export function confusableIds(item, pool) {
  const kanji = new Set([...item.word].filter((char) => KANJI.test(char)));
  return pool
    .filter((other) => {
      if (other.id === item.id) return false;
      if ([...other.word].some((char) => kanji.has(char))) return true;
      return hasSimilarReading(item.reading, other.reading);
    })
    .map((other) => other.id);
}

/**
 * 네 지선다 한 문항을 만든다. 오답은 혼동 후보를 먼저 쓰고 부족하면 나머지에서 채운다.
 *
 * pool에는 정답을 뺀 서로 다른 값이 3개 이상 있어야 한다. 학습 어휘 103개는 이를 항상 만족한다.
 *
 * @param {VocabularyItem} item
 * @param {VocabularyItem[]} pool
 * @param {"readingFromWord"|"meaningFromWord"|"wordFromMeaning"} direction
 * @param {() => number} rand
 * @returns {RecallQuestion}
 */
export function buildRecallQuestion(item, pool, direction, rand) {
  const answer = valueFor(item, direction);
  const confusable = new Set(confusableIds(item, pool));
  const others = pool.filter((candidate) => candidate.id !== item.id);

  const ordered = [
    ...shuffle(others.filter((candidate) => confusable.has(candidate.id)), rand),
    ...shuffle(others.filter((candidate) => !confusable.has(candidate.id)), rand),
  ];

  const used = new Set([answer]);
  const distractors = [];
  for (const candidate of ordered) {
    if (distractors.length === 3) break;
    const value = valueFor(candidate, direction);
    if (used.has(value)) continue;
    used.add(value);
    distractors.push(value);
  }

  const choices = shuffle([answer, ...distractors], rand);
  return {
    direction,
    prompt: DIRECTION_LABEL[direction],
    subject: subjectFor(item, direction),
    choices,
    answerIndex: choices.indexOf(answer),
    item,
  };
}

/**
 * 회상 방향 하나를 고른다.
 * @param {() => number} rand
 * @returns {string}
 */
export function pickDirection(rand) {
  return DIRECTIONS[Math.floor(rand() * DIRECTIONS.length)];
}
