import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage.jsx";
import { STORAGE_KEY, SCHEMA_VERSION, loadProgress } from "../lib/progressStore.js";
import { FURIGANA_KEY, loadFurigana } from "../lib/settingsStore.js";
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

/** 진도가 담긴 저장소를 만든다. 카드 두 개는 학습 완료(단계 1 이상), 하나는 미학습이다. */
function storageWithProgress(extra = {}) {
  return createStorage({
    ...extra,
    [STORAGE_KEY]: JSON.stringify({
      version: SCHEMA_VERSION,
      cards: {
        [VOCABULARY[0].id]: { stage: 2, dueAt: 100 },
        [VOCABULARY[1].id]: { stage: 1, dueAt: 200 },
        [VOCABULARY[2].id]: { stage: 0, dueAt: 300 },
      },
    }),
  });
}

describe("학습 진도 초기화 (JN4-037~JN4-041, AC-16, AC-17)", () => {
  it("저장된 진도가 없으면 초기화 버튼을 보여 주지 않는다 (JN4-037)", () => {
    renderHome();
    expect(screen.queryByRole("button", { name: /초기화/ })).not.toBeInTheDocument();
  });

  it("저장된 진도가 있으면 초기화 버튼을 보여 준다 (JN4-037)", () => {
    renderHome(storageWithProgress());
    expect(screen.getByRole("button", { name: /초기화/ })).toBeInTheDocument();
  });

  it("버튼을 한 번 누르면 바로 지우지 않고 확인과 취소를 묻는다 (JN4-038)", async () => {
    const user = userEvent.setup();
    const storage = storageWithProgress();
    renderHome(storage);

    await user.click(screen.getByRole("button", { name: /초기화/ }));

    expect(screen.getByTestId("reset-confirm")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /지우기/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /취소/ })).toBeInTheDocument();
    // 아직 확인하지 않았으므로 진도는 그대로다.
    expect(Object.keys(loadProgress(storage))).toHaveLength(3);
  });

  it("확인을 누르면 저장된 진도를 지우고 표시를 0으로 갱신한다 (JN4-039, AC-16)", async () => {
    const user = userEvent.setup();
    const storage = storageWithProgress();
    renderHome(storage);

    await user.click(screen.getByRole("button", { name: /초기화/ }));
    await user.click(screen.getByRole("button", { name: /지우기/ }));

    expect(loadProgress(storage)).toEqual({});
    expect(screen.getByTestId("home-progress")).toHaveTextContent("103개 중 0개 · 0%");
  });

  it("초기화한 뒤에는 초기화 버튼과 확인 영역이 사라진다 (JN4-037, JN4-039)", async () => {
    const user = userEvent.setup();
    renderHome(storageWithProgress());

    await user.click(screen.getByRole("button", { name: /초기화/ }));
    await user.click(screen.getByRole("button", { name: /지우기/ }));

    expect(screen.queryByTestId("reset-confirm")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /초기화/ })).not.toBeInTheDocument();
  });

  it("취소를 누르면 진도를 그대로 유지한다 (JN4-040, AC-16)", async () => {
    const user = userEvent.setup();
    const storage = storageWithProgress();
    renderHome(storage);

    await user.click(screen.getByRole("button", { name: /초기화/ }));
    await user.click(screen.getByRole("button", { name: /취소/ }));

    expect(Object.keys(loadProgress(storage))).toHaveLength(3);
    expect(screen.queryByTestId("reset-confirm")).not.toBeInTheDocument();
    expect(screen.getByTestId("home-progress")).toHaveTextContent("103개 중 2개");
  });

  it("초기화해도 후리가나 설정은 남는다 (JN4-041, AC-17)", async () => {
    const user = userEvent.setup();
    const storage = storageWithProgress({ [FURIGANA_KEY]: "on" });
    renderHome(storage);

    await user.click(screen.getByRole("button", { name: /초기화/ }));
    await user.click(screen.getByRole("button", { name: /지우기/ }));

    expect(loadFurigana(storage)).toBe(true);
  });
});
