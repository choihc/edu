import { describe, it, expect } from "vitest";
import { annotate, displayedSentences, missingReadings } from "./furigana.js";
import { READINGS } from "../data/kanjiReadings.js";
import { VOCABULARY } from "../data/vocabulary.js";

const DICT = { 今日: "きょう", 空: "そら", 青い: "あおい", 行く: "いく", 行う: "おこなう", 千人: "せんにん", 人: "ひと" };

describe("문장 분해와 후리가나 붙이기 (JN4-032, JN4-036)", () => {
  it("한자 덩어리에 읽기를 붙이고 가나는 그대로 둔다", () => {
    expect(annotate("今日は空が青い。", DICT)).toEqual([
      { text: "今日", reading: "きょう" },
      { text: "は" },
      { text: "空", reading: "そら" },
      { text: "が" },
      { text: "青い", reading: "あおい" },
      { text: "。" },
    ]);
  });

  it("한자가 없는 문장은 조각 하나로 둔다", () => {
    expect(annotate("これはとてもきれいです。", DICT)).toEqual([{ text: "これはとてもきれいです。" }]);
  });

  it("보내는 가나까지 붙은 긴 항목을 먼저 맞춘다", () => {
    // 行く와 行う는 같은 한자를 쓰지만 읽기가 다르다. 보내는 가나로 구분해야 한다.
    expect(annotate("駅へ行く。", { ...DICT, 駅: "えき" })).toEqual([
      { text: "駅", reading: "えき" },
      { text: "へ" },
      { text: "行く", reading: "いく" },
      { text: "。" },
    ]);
    expect(annotate("試験を行う。", { ...DICT, 試験: "しけん" })).toEqual([
      { text: "試験", reading: "しけん" },
      { text: "を" },
      { text: "行う", reading: "おこなう" },
      { text: "。" },
    ]);
  });

  it("더 긴 항목이 있으면 짧은 항목보다 먼저 맞춘다", () => {
    expect(annotate("千人が来た。", { ...DICT, 来た: "きた" })).toEqual([
      { text: "千人", reading: "せんにん" },
      { text: "が" },
      { text: "来た", reading: "きた" },
      { text: "。" },
    ]);
  });

  it("사전에 없는 한자는 읽기 없이 남긴다", () => {
    expect(annotate("鯨が見える。", DICT)).toEqual([{ text: "鯨" }, { text: "が" }, { text: "見" }, { text: "える。" }]);
  });

  it("이어지는 가나 조각을 하나로 합친다", () => {
    const segments = annotate("空がとてもきれいだ。", DICT);
    expect(segments).toEqual([{ text: "空", reading: "そら" }, { text: "がとてもきれいだ。" }]);
  });
});

describe("후리가나 사전 커버리지 (JN4-036, AC-13)", () => {
  it("화면에 쓰이는 일본어 문장을 모두 모은다", () => {
    const sentences = displayedSentences();
    expect(sentences.length).toBeGreaterThan(1000);
    expect(sentences.every((sentence) => typeof sentence === "string" && sentence.length > 0)).toBe(true);
  });

  it("읽기가 붙지 않은 한자가 하나도 없다", () => {
    const missing = missingReadings(displayedSentences(), READINGS);
    expect(missing).toEqual([]);
  });

  it("사전의 읽기는 모두 히라가나다", () => {
    for (const [word, reading] of Object.entries(READINGS)) {
      expect(reading, word).toMatch(/^[ぁ-ゖー]+$/);
    }
  });

  it("사전 항목에는 한자가 하나 이상 들어 있다", () => {
    for (const word of Object.keys(READINGS)) {
      expect(word, word).toMatch(/[一-鿿]/);
    }
  });

  it("어휘 103개를 사전으로 읽으면 어휘 데이터의 읽기와 일치한다", () => {
    // 사전의 읽기가 맞는지 실제로 확인하는 검사다. 어휘 데이터의 읽기를 정답으로 삼아
    // 사전이 만들어 낸 읽기와 맞춰 본다. 어긋나면 사전 쪽이 틀린 것이다.
    const mismatched = [];
    for (const item of VOCABULARY) {
      const composed = annotate(item.word, READINGS)
        .map((segment) => segment.reading ?? segment.text)
        .join("");
      if (composed !== item.reading) mismatched.push(`${item.word}: 사전 ${composed} ≠ 어휘 ${item.reading}`);
    }
    expect(mismatched).toEqual([]);
  });
});
