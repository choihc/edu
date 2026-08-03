import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import StudyPage from "./StudyPage.jsx";
import { VOCABULARY } from "../data/vocabulary.js";
import { STORAGE_KEY, SCHEMA_VERSION, loadProgress } from "../lib/progressStore.js";
import { DAY, MINUTE } from "../lib/srs.js";

const NOW = 1_700_000_000_000;

function createStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
}

/** 어휘 전체를 먼 미래로 예약해 복습 대상도 미학습 항목도 없게 만든다. */
function allScheduledStorage(dueAt) {
  const cards = {};
  for (const item of VOCABULARY) cards[item.id] = { stage: 2, dueAt };
  return createStorage({ [STORAGE_KEY]: JSON.stringify({ version: SCHEMA_VERSION, cards }) });
}

function renderStudy(storage) {
  return render(
    <MemoryRouter>
      <StudyPage getNow={() => NOW} storage={storage} rand={() => 0} />
    </MemoryRouter>
  );
}

/** rand가 0으로 고정되면 첫 항목은 어휘 목록의 첫 번째, 방향은 표기→읽기다. */
const FIRST = VOCABULARY[0];

describe("학습 화면 (S1, AC-4)", () => {
  let storage;
  let user;

  beforeEach(() => {
    storage = createStorage();
    user = userEvent.setup();
  });

  it("첫 학습 카드로 미학습 항목을 제시한다 (JN4-012)", () => {
    renderStudy(storage);
    expect(screen.getByTestId("card-subject")).toHaveTextContent(FIRST.word);
  });

  it("제출 전에는 한국식 음훈·기억 힌트·예문을 보여 주지 않는다 (JN4-005, AC-4)", () => {
    renderStudy(storage);
    expect(screen.queryByText(FIRST.sinoKorean)).not.toBeInTheDocument();
    expect(screen.queryByText(FIRST.hint)).not.toBeInTheDocument();
    expect(screen.queryByText(FIRST.example)).not.toBeInTheDocument();
  });

  it("선택지가 4개이고 모두 button 요소다 (AC-3, AC-9)", () => {
    renderStudy(storage);
    const choices = within(screen.getByTestId("choices")).getAllByRole("button");
    expect(choices).toHaveLength(4);
  });

  it("정답을 고르면 정답 표시와 학습 정보를 보여 준다 (JN4-008, AC-4)", async () => {
    renderStudy(storage);
    await user.click(screen.getByRole("button", { name: FIRST.reading }));

    expect(screen.getByTestId("verdict")).toHaveTextContent("정답");
    expect(screen.getByText(FIRST.sinoKorean)).toBeInTheDocument();
    expect(screen.getByText(FIRST.hint)).toBeInTheDocument();
    expect(screen.getByText(FIRST.example)).toBeInTheDocument();
    expect(screen.getByText(FIRST.exampleKr)).toBeInTheDocument();
  });

  it("오답을 고르면 오답 표시와 정답을 함께 보여 준다 (JN4-008)", async () => {
    renderStudy(storage);
    const wrong = within(screen.getByTestId("choices"))
      .getAllByRole("button")
      .find((button) => button.dataset.choice !== FIRST.reading);
    await user.click(wrong);

    expect(screen.getByTestId("verdict")).toHaveTextContent("오답");
    expect(screen.getByTestId("answer")).toHaveTextContent(FIRST.reading);
  });

  it("정답하면 간격 단계 1과 하루 뒤 복습을 저장한다 (JN4-010, JN4-013)", async () => {
    renderStudy(storage);
    await user.click(screen.getByRole("button", { name: FIRST.reading }));

    expect(loadProgress(storage)[FIRST.id]).toEqual({ stage: 1, dueAt: NOW + DAY });
  });

  it("오답하면 간격 단계 0과 10분 뒤 복습을 저장한다 (JN4-011, JN4-013)", async () => {
    renderStudy(storage);
    const wrong = within(screen.getByTestId("choices"))
      .getAllByRole("button")
      .find((button) => button.dataset.choice !== FIRST.reading);
    await user.click(wrong);

    expect(loadProgress(storage)[FIRST.id]).toEqual({ stage: 0, dueAt: NOW + 10 * MINUTE });
  });

  it("이미 답한 뒤에는 다른 선택지를 눌러도 결과가 바뀌지 않는다", async () => {
    renderStudy(storage);
    await user.click(screen.getByRole("button", { name: FIRST.reading }));
    const wrong = within(screen.getByTestId("choices"))
      .getAllByRole("button")
      .find((button) => button.dataset.choice !== FIRST.reading);
    await user.click(wrong);

    expect(screen.getByTestId("verdict")).toHaveTextContent("정답");
    expect(loadProgress(storage)[FIRST.id]).toEqual({ stage: 1, dueAt: NOW + DAY });
  });

  it("다음 카드로 넘어가면 새 문제를 보여 준다", async () => {
    renderStudy(storage);
    await user.click(screen.getByRole("button", { name: FIRST.reading }));
    await user.click(screen.getByRole("button", { name: /다음/ }));

    expect(screen.getByTestId("card-subject")).not.toHaveTextContent(FIRST.word);
    expect(screen.queryByTestId("verdict")).not.toBeInTheDocument();
  });

  it("저장된 진도를 이어받는다 (JN4-014)", () => {
    const saved = createStorage({
      [STORAGE_KEY]: JSON.stringify({
        version: SCHEMA_VERSION,
        cards: { [FIRST.id]: { stage: 3, dueAt: NOW + 7 * DAY } },
      }),
    });
    renderStudy(saved);
    expect(screen.getByTestId("card-subject")).not.toHaveTextContent(FIRST.word);
    expect(screen.getByTestId("progress")).toHaveTextContent("1");
  });

  it("학습한 항목 수와 전체 수를 보여 준다 (JN4-028)", () => {
    renderStudy(storage);
    const progress = screen.getByTestId("progress");
    expect(progress).toHaveTextContent("0");
    expect(progress).toHaveTextContent("103");
  });

  it("복습·미학습 대상이 없으면 빈 상태와 다음 복습 시각을 보여 준다 (JN4-024)", () => {
    renderStudy(allScheduledStorage(NOW + 3 * DAY));
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("next-due")).toBeInTheDocument();
    expect(screen.queryByTestId("choices")).not.toBeInTheDocument();
  });

  it("숫자키 1~4로 선택지를 고를 수 있다 (JN4-U08, AC-9)", async () => {
    renderStudy(storage);
    const first = within(screen.getByTestId("choices")).getAllByRole("button")[0].dataset.choice;
    await user.keyboard("1");

    expect(screen.getByTestId("verdict")).toBeInTheDocument();
    expect(screen.getByTestId("answer")).toHaveTextContent(FIRST.reading);
    // 1번 선택지가 정답이었는지에 따라 판정이 갈린다.
    expect(screen.getByTestId("verdict")).toHaveTextContent(first === FIRST.reading ? "정답" : "오답");
  });

  it("답한 뒤 Enter로 다음 카드로 넘어간다 (JN4-U08, AC-9)", async () => {
    renderStudy(storage);
    await user.click(screen.getByRole("button", { name: FIRST.reading }));
    await user.keyboard("{Enter}");

    expect(screen.queryByTestId("verdict")).not.toBeInTheDocument();
    expect(screen.getByTestId("card-subject")).not.toHaveTextContent(FIRST.word);
  });

  it("아직 답하지 않았으면 Enter는 아무 일도 하지 않는다", async () => {
    renderStudy(storage);
    await user.keyboard("{Enter}");
    expect(screen.getByTestId("card-subject")).toHaveTextContent(FIRST.word);
    expect(screen.queryByTestId("verdict")).not.toBeInTheDocument();
  });

  it("저장값이 깨져 있어도 오류 없이 학습을 시작한다 (JN4-015)", () => {
    const broken = createStorage({ [STORAGE_KEY]: "깨진 값" });
    renderStudy(broken);
    expect(screen.getByTestId("card-subject")).toHaveTextContent(FIRST.word);
  });
});
