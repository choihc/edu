import { describe, it, expect } from "vitest";
import { FURIGANA_KEY, loadFurigana, saveFurigana } from "./settingsStore.js";

function createStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
}

describe("후리가나 설정 저장 (JN4-033, JN4-035, AC-15)", () => {
  it("저장된 값이 없으면 꺼짐이 기본값이다 (JN4-033)", () => {
    expect(loadFurigana(createStorage())).toBe(false);
  });

  it("켠 설정을 저장하고 다시 읽는다 (JN4-035)", () => {
    const storage = createStorage();
    saveFurigana(storage, true);
    expect(loadFurigana(storage)).toBe(true);
  });

  it("끈 설정도 저장하고 다시 읽는다 (JN4-035)", () => {
    const storage = createStorage({ [FURIGANA_KEY]: "on" });
    saveFurigana(storage, false);
    expect(loadFurigana(storage)).toBe(false);
  });

  it("알 수 없는 값이 저장돼 있으면 꺼짐으로 본다", () => {
    expect(loadFurigana(createStorage({ [FURIGANA_KEY]: "이상한값" }))).toBe(false);
  });

  it("저장소가 없거나 예외를 던져도 앱이 죽지 않는다", () => {
    expect(loadFurigana(null)).toBe(false);
    expect(() => saveFurigana(null, true)).not.toThrow();

    const failing = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
      removeItem: () => {},
    };
    expect(loadFurigana(failing)).toBe(false);
    expect(() => saveFurigana(failing, true)).not.toThrow();
  });
});
