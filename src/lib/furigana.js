/**
 * 일본어 문장에 후리가나를 붙이기 위한 문장 분해. 스펙 JN4-032, JN4-036.
 *
 * 한자 하나에 읽기 하나를 짝지을 수 없기 때문에(行く는 いく, 行う는 おこなう) 사전은
 * 한자만이 아니라 보내는 가나까지 포함한 '단어 표기'를 키로 삼는다. 문장은 사전에 대해
 * 긴 항목부터 맞춰 나눈다. 千人(せんにん)이 人(ひと)보다 먼저 걸리는 것도 같은 이유다.
 */

import { VOCABULARY } from "../data/vocabulary.js";
import { ENTRIES } from "../data/authoredQuestions/index.js";

const KANJI = /[一-鿿]/;

/**
 * @typedef {{ text: string, reading?: string }} Segment
 *   reading이 있으면 text 위에 그 읽기를 얹어 보여 준다.
 */

/** 사전을 길이 내림차순으로 정리한다. 같은 사전을 여러 번 쓰므로 결과를 재활용한다. */
const sortedCache = new WeakMap();
function sortedEntries(dictionary) {
  const cached = sortedCache.get(dictionary);
  if (cached) return cached;

  /** @type {Map<number, Map<string, string>>} 길이 → (표기 → 읽기) */
  const byLength = new Map();
  let maxLength = 0;
  for (const [word, reading] of Object.entries(dictionary)) {
    if (!byLength.has(word.length)) byLength.set(word.length, new Map());
    byLength.get(word.length).set(word, reading);
    if (word.length > maxLength) maxLength = word.length;
  }

  const result = { byLength, maxLength };
  sortedCache.set(dictionary, result);
  return result;
}

/**
 * 문장을 후리가나 조각으로 나눈다. 사전에 없는 한자는 읽기 없이 그대로 남긴다.
 *
 * @param {string} text
 * @param {Record<string, string>} dictionary
 * @returns {Segment[]}
 */
export function annotate(text, dictionary) {
  const { byLength, maxLength } = sortedEntries(dictionary);
  /** @type {Segment[]} */
  const segments = [];
  let kana = "";

  const flushKana = () => {
    if (kana) {
      segments.push({ text: kana });
      kana = "";
    }
  };

  let index = 0;
  while (index < text.length) {
    const char = text[index];

    if (!KANJI.test(char)) {
      kana += char;
      index += 1;
      continue;
    }

    let matched = null;
    for (let length = Math.min(maxLength, text.length - index); length >= 1; length -= 1) {
      const candidate = text.slice(index, index + length);
      const reading = byLength.get(length)?.get(candidate);
      if (reading !== undefined) {
        matched = { text: candidate, reading };
        break;
      }
    }

    flushKana();
    if (matched) {
      segments.push(matched);
      index += matched.text.length;
    } else {
      segments.push({ text: char });
      index += 1;
    }
  }

  flushKana();
  return segments;
}

/**
 * 화면에서 후리가나를 붙이는 일본어 문장 전부. 해설은 한국어 산문이라 제외한다.
 * @returns {string[]}
 */
export function displayedSentences() {
  const sentences = new Set();

  for (const item of VOCABULARY) {
    sentences.add(item.word);
    sentences.add(item.example);
  }
  for (const entry of ENTRIES) {
    sentences.add(entry.ctx.s);
    for (const choice of entry.ctx.x) sentences.add(choice);
    sentences.add(entry.syn.s);
    sentences.add(entry.syn.a);
    for (const choice of entry.syn.x) sentences.add(choice);
    sentences.add(entry.use.a);
    for (const choice of entry.use.x) sentences.add(choice);
  }

  return [...sentences];
}

/**
 * 읽기가 붙지 않은 한자 덩어리를 찾아낸다. 사전을 채우는 작업의 길잡이이자
 * 수용 조건 AC-13을 지키는 안전망이다.
 *
 * @param {string[]} sentences
 * @param {Record<string, string>} dictionary
 * @returns {string[]} "<빠진 덩어리> ← <나온 문장>" 형태의 문자열 목록
 */
export function missingReadings(sentences, dictionary) {
  const found = new Map();

  for (const sentence of sentences) {
    let run = "";
    for (const segment of annotate(sentence, dictionary)) {
      const isBareKanji = segment.reading === undefined && KANJI.test(segment.text);
      if (isBareKanji) {
        run += segment.text;
        continue;
      }
      if (run && !found.has(run)) found.set(run, sentence);
      run = "";
    }
    if (run && !found.has(run)) found.set(run, sentence);
  }

  return [...found.entries()].map(([run, sentence]) => `${run} ← ${sentence}`).sort();
}
