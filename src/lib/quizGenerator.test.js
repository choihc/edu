import { describe, it, expect } from "vitest";
import { DIRECTIONS, confusableIds, buildRecallQuestion, pickDirection } from "./quizGenerator.js";
import { VOCABULARY, findById } from "../data/vocabulary.js";

/** 테스트용 어휘. 실제 데이터와 같은 형태를 쓴다. */
function item(word, reading, meaning) {
  return {
    id: `${word}|${reading}`,
    word,
    reading,
    meaning,
    sinoKorean: `${word[0]} = 테스트 훈`,
    hint: "테스트 힌트",
    example: `${word}です。`,
    exampleKr: "테스트 해석",
    row: "あ",
  };
}

const 遠い = item("遠い", "とおい", "멀다");
const 通る = item("通る", "とおる", "지나다");
const 都合 = item("都合", "つごう", "사정");
const 都会 = item("都会", "とかい", "도시");
const 皿 = item("皿", "さら", "접시");
const 雲 = item("雲", "くも", "구름");
const 春 = item("春", "はる", "봄");

const POOL = [遠い, 通る, 都合, 都会, 皿, 雲, 春];

/** 항상 첫 번째를 고르는 결정적 난수 */
const ZERO = () => 0;

describe("혼동 후보 (JN4-027)", () => {
  it("한자를 공유하는 항목을 후보로 본다", () => {
    expect(confusableIds(都合, POOL)).toContain(都会.id);
  });

  it("읽기가 비슷한 항목을 후보로 본다", () => {
    expect(confusableIds(遠い, POOL)).toContain(通る.id);
  });

  it("자기 자신은 후보에 넣지 않는다", () => {
    expect(confusableIds(遠い, POOL)).not.toContain(遠い.id);
  });

  it("닮은 구석이 없으면 후보가 비어 있다", () => {
    expect(confusableIds(皿, [皿, 春])).toEqual([]);
  });
});

describe("네 지선다 구성 (JN4-007, JN4-027, AC-3)", () => {
  it("세 가지 회상 방향을 제공한다", () => {
    expect(DIRECTIONS).toEqual(["readingFromWord", "meaningFromWord", "wordFromMeaning"]);
  });

  for (const direction of ["readingFromWord", "meaningFromWord", "wordFromMeaning"]) {
    it(`${direction}: 선택지가 4개이고 중복이 없다`, () => {
      const question = buildRecallQuestion(遠い, POOL, direction, ZERO);
      expect(question.choices).toHaveLength(4);
      expect(new Set(question.choices).size).toBe(4);
    });

    it(`${direction}: 정답이 정확히 하나 들어 있다`, () => {
      const question = buildRecallQuestion(遠い, POOL, direction, ZERO);
      const expected = { readingFromWord: "とおい", meaningFromWord: "멀다", wordFromMeaning: "遠い" }[direction];
      expect(question.choices[question.answerIndex]).toBe(expected);
      expect(question.choices.filter((choice) => choice === expected)).toHaveLength(1);
    });
  }

  it("질문에는 대상만 드러나고 정답은 드러나지 않는다", () => {
    const reading = buildRecallQuestion(遠い, POOL, "readingFromWord", ZERO);
    expect(reading.subject).toBe("遠い");
    expect(`${reading.prompt}${reading.subject}`).not.toContain("とおい");

    const word = buildRecallQuestion(遠い, POOL, "wordFromMeaning", ZERO);
    expect(word.subject).toBe("멀다");
    expect(`${word.prompt}${word.subject}`).not.toContain("遠い");
  });

  it("혼동 후보가 있으면 오답으로 우선 쓴다 (JN4-027)", () => {
    const question = buildRecallQuestion(遠い, POOL, "readingFromWord", ZERO);
    expect(question.choices).toContain("とおる");
  });

  it("혼동 후보가 부족하면 나머지 어휘로 네 개를 채운다 (JN4-027)", () => {
    const question = buildRecallQuestion(皿, [皿, 春, 雲, 都会], "meaningFromWord", ZERO);
    expect(question.choices).toHaveLength(4);
    expect(new Set(question.choices).size).toBe(4);
  });

  it("같은 난수를 주면 같은 결과가 나온다", () => {
    const a = buildRecallQuestion(遠い, POOL, "readingFromWord", ZERO);
    const b = buildRecallQuestion(遠い, POOL, "readingFromWord", ZERO);
    expect(a).toEqual(b);
  });

  it("난수를 바꾸면 정답 위치가 달라질 수 있다", () => {
    const positions = new Set();
    for (const value of [0, 0.3, 0.6, 0.99]) {
      positions.add(buildRecallQuestion(遠い, POOL, "readingFromWord", () => value).answerIndex);
    }
    expect(positions.size).toBeGreaterThan(1);
  });

  it("대상 항목을 그대로 함께 돌려준다", () => {
    expect(buildRecallQuestion(遠い, POOL, "readingFromWord", ZERO).item).toBe(遠い);
  });

  it("pickDirection은 항상 세 방향 중 하나를 준다", () => {
    for (const value of [0, 0.34, 0.67, 0.999]) {
      expect(DIRECTIONS).toContain(pickDirection(() => value));
    }
  });

  it("실제 어휘 103개 전부에 대해 네 지선다를 만들 수 있다", () => {
    for (const vocab of VOCABULARY) {
      for (const direction of DIRECTIONS) {
        const question = buildRecallQuestion(vocab, VOCABULARY, direction, ZERO);
        expect(question.choices, `${vocab.word} · ${direction}`).toHaveLength(4);
        expect(new Set(question.choices).size, `${vocab.word} · ${direction}`).toBe(4);
        expect(findById(question.item.id)).toBeDefined();
      }
    }
  });
});
