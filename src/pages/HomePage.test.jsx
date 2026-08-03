import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage.jsx";
import { STORAGE_KEY, SCHEMA_VERSION } from "../lib/progressStore.js";
import { VOCABULARY } from "../data/vocabulary.js";
import { PRACTICE_TYPES } from "../lib/practiceSession.js";

/** 제거한 기존 콘텐츠의 이름들. 홈에 하나라도 남아 있으면 JN4-001 위반이다. */
const REMOVED_CONTENT = [
  "식물과 에너지",
  "코딩과 AI",
  "일본어 단어 암기",
  "멀티에이전트",
  "스펙매니저",
  "AI Native",
];

function createStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
}

function renderHome(storage = createStorage()) {
  render(
    <MemoryRouter>
      <HomePage storage={storage} />
    </MemoryRouter>
  );
}

describe("홈 화면 (JN4-001, JN4-028, AC-1)", () => {
  it("학습과 실전 연습 진입점을 보여 준다", () => {
    renderHome();
    expect(screen.getByRole("link", { name: /어휘 학습/ })).toHaveAttribute("href", "/study");
    expect(screen.getByRole("link", { name: /실전 연습/ })).toHaveAttribute("href", "/practice");
  });

  it("기존 콘텐츠의 이름이 화면에 없다 (JN4-001)", () => {
    renderHome();
    for (const name of REMOVED_CONTENT) {
      expect(screen.queryByText(new RegExp(name)), name).not.toBeInTheDocument();
    }
  });

  it("현재 학습 진도를 보여 준다 (JN4-028)", () => {
    const storage = createStorage({
      [STORAGE_KEY]: JSON.stringify({
        version: SCHEMA_VERSION,
        cards: {
          [VOCABULARY[0].id]: { stage: 2, dueAt: 100 },
          [VOCABULARY[1].id]: { stage: 1, dueAt: 200 },
          [VOCABULARY[2].id]: { stage: 0, dueAt: 300 },
        },
      }),
    });
    renderHome(storage);

    const progress = screen.getByTestId("home-progress");
    expect(progress).toHaveTextContent("2");
    expect(progress).toHaveTextContent("103");
  });

  it("진도가 없으면 0으로 보여 준다", () => {
    renderHome();
    expect(screen.getByTestId("home-progress")).toHaveTextContent("0");
  });

  it("다섯 연습 유형을 모두 안내한다 (JN4-017~JN4-021)", () => {
    renderHome();
    for (const type of PRACTICE_TYPES) {
      expect(screen.getByText(type.label), type.label).toBeInTheDocument();
    }
  });
});
