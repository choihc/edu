import { describe, it, expect, beforeEach } from "vitest";
import { STORAGE_KEY, SCHEMA_VERSION, loadProgress, saveProgress } from "./progressStore.js";

/** localStorage와 같은 최소 인터페이스를 가진 테스트용 저장소 */
function createStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    _dump: () => Object.fromEntries(map),
  };
}

const PROGRESS = {
  "青い|あおい": { stage: 2, dueAt: 1_700_000_000_000 },
  "赤い|あかい": { stage: 0, dueAt: null },
};

describe("진도 저장·복원 (JN4-013~JN4-015, AC-6)", () => {
  let storage;
  beforeEach(() => {
    storage = createStorage();
  });

  it("저장한 진도를 그대로 다시 읽는다 (JN4-013, JN4-014)", () => {
    saveProgress(storage, PROGRESS);
    expect(loadProgress(storage)).toEqual(PROGRESS);
  });

  it("스키마 버전을 함께 저장한다 (JN4-U10)", () => {
    saveProgress(storage, PROGRESS);
    const stored = JSON.parse(storage.getItem(STORAGE_KEY));
    expect(stored.version).toBe(SCHEMA_VERSION);
    expect(stored.cards).toEqual(PROGRESS);
  });

  it("저장된 값이 없으면 빈 진도로 시작한다", () => {
    expect(loadProgress(storage)).toEqual({});
  });

  it("JSON이 깨져 있으면 오류 없이 빈 진도로 시작한다 (JN4-015)", () => {
    const broken = createStorage({ [STORAGE_KEY]: "{이건 JSON이 아니다" });
    expect(loadProgress(broken)).toEqual({});
  });

  it("스키마 버전이 다르면 빈 진도로 시작한다 (JN4-015)", () => {
    const old = createStorage({
      [STORAGE_KEY]: JSON.stringify({ version: SCHEMA_VERSION + 1, cards: PROGRESS }),
    });
    expect(loadProgress(old)).toEqual({});
  });

  it("cards가 객체가 아니면 빈 진도로 시작한다 (JN4-015)", () => {
    const bad = createStorage({
      [STORAGE_KEY]: JSON.stringify({ version: SCHEMA_VERSION, cards: "문자열" }),
    });
    expect(loadProgress(bad)).toEqual({});
  });

  it("형태가 맞지 않는 카드만 걸러내고 나머지는 살린다 (JN4-015)", () => {
    const mixed = createStorage({
      [STORAGE_KEY]: JSON.stringify({
        version: SCHEMA_VERSION,
        cards: {
          정상: { stage: 1, dueAt: 100 },
          "단계없음": { dueAt: 100 },
          "단계가문자열": { stage: "1", dueAt: 100 },
          "시각이문자열": { stage: 1, dueAt: "100" },
          "미학습정상": { stage: 0, dueAt: null },
        },
      }),
    });
    expect(loadProgress(mixed)).toEqual({
      정상: { stage: 1, dueAt: 100 },
      미학습정상: { stage: 0, dueAt: null },
    });
  });

  it("저장이 실패해도 예외를 밖으로 던지지 않는다", () => {
    const failing = {
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
      removeItem: () => {},
    };
    expect(() => saveProgress(failing, PROGRESS)).not.toThrow();
  });

  it("읽기가 실패해도 예외를 밖으로 던지지 않고 빈 진도를 준다", () => {
    const failing = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {},
      removeItem: () => {},
    };
    expect(loadProgress(failing)).toEqual({});
  });

  it("저장소가 없어도 동작한다", () => {
    expect(loadProgress(null)).toEqual({});
    expect(() => saveProgress(null, PROGRESS)).not.toThrow();
  });
});
