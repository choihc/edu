import { describe, it, expect } from "vitest";
import { VOCABULARY, findById } from "./vocabulary.js";

/** 스펙 §5 학습 데이터 요건의 행별 개수 */
const ROW_COUNTS = { あ: 26, か: 24, さ: 13, た: 13, な: 8, は: 10, ま: 2, や: 6, ら: 1 };
const FIELDS = ["id", "word", "reading", "meaning", "sinoKorean", "hint", "example", "exampleKr", "row"];

describe("어휘 데이터 (JN4-002, JN4-003, AC-2)", () => {
  it("103개다", () => {
    expect(VOCABULARY).toHaveLength(103);
  });

  it("행별 개수가 1차 목록과 일치한다", () => {
    const counted = {};
    for (const item of VOCABULARY) counted[item.row] = (counted[item.row] ?? 0) + 1;
    expect(counted).toEqual(ROW_COUNTS);
  });

  it("모든 항목이 필수 필드를 빈 값 없이 가진다", () => {
    for (const item of VOCABULARY) {
      for (const field of FIELDS) {
        expect(item[field], `${item.word} · ${field}`).toBeTruthy();
      }
    }
  });

  it("식별자가 중복되지 않는다", () => {
    expect(new Set(VOCABULARY.map((item) => item.id)).size).toBe(103);
  });

  it("식별자가 표기와 읽기를 결합한 형식이다 (JN4-U10)", () => {
    for (const item of VOCABULARY) {
      expect(item.id).toBe(`${item.word}|${item.reading}`);
    }
  });

  it("읽기가 히라가나로만 이루어진다", () => {
    for (const item of VOCABULARY) {
      expect(item.reading, item.word).toMatch(/^[ぁ-ゖー]+$/);
    }
  });

  it("예문에 해당 표기가 그대로 들어 있다", () => {
    for (const item of VOCABULARY) {
      expect(item.example, item.word).toContain(item.word);
    }
  });

  it("예문이 일본어 문장 부호로 끝난다", () => {
    for (const item of VOCABULARY) {
      expect(item.example, item.word).toMatch(/[。？]$/);
    }
  });

  it("한국식 음훈이 표기의 모든 한자를 다룬다", () => {
    for (const item of VOCABULARY) {
      const kanji = [...item.word].filter((char) => /[一-鿿]/.test(char));
      for (const char of kanji) {
        expect(item.sinoKorean, `${item.word} · ${char}`).toContain(char);
      }
    }
  });

  it("findById가 항목을 찾고, 없는 식별자에는 undefined를 준다", () => {
    expect(findById("青い|あおい")?.meaning).toBe("파랗다");
    expect(findById("없는어휘|なし")).toBeUndefined();
  });
});
