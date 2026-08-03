import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PracticePage from "./PracticePage.jsx";
import { STORAGE_KEY, SCHEMA_VERSION } from "../lib/progressStore.js";
import { startSession } from "../lib/practiceSession.js";
import { loadFurigana } from "../lib/settingsStore.js";

const ZERO = () => 0;

function createStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    _dump: () => Object.fromEntries(map),
  };
}

function renderPractice(typeId, storage = createStorage()) {
  render(
    <MemoryRouter initialEntries={[`/practice/${typeId}`]}>
      <Routes>
        <Route path="/practice/:typeId" element={<PracticePage rand={ZERO} storage={storage} />} />
      </Routes>
    </MemoryRouter>
  );
  return storage;
}

function questionCards() {
  return screen.getAllByTestId("practice-question");
}

/** 회차의 모든 문항에 정답을 고른다. */
async function answerAll(user, questions, { skipFrom = Infinity } = {}) {
  const cards = questionCards();
  for (const [index, card] of cards.entries()) {
    if (index >= skipFrom) continue;
    const buttons = within(card).getAllByRole("button");
    await user.click(buttons[questions[index].answerIndex]);
  }
}

describe("실전 연습 화면 (S3, AC-8)", () => {
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("선택한 유형의 문항 10개를 한 화면에 보여 준다 (JN4-016)", () => {
    renderPractice("reading");
    expect(questionCards()).toHaveLength(10);
  });

  it("유형마다 다른 문항이 나온다 (JN4-017~JN4-021)", () => {
    renderPractice("context");
    const expected = startSession("context", ZERO);
    expect(questionCards()[0]).toHaveTextContent(expected[0].sentence.slice(0, 6));
  });

  it("알 수 없는 유형에는 안내를 보여 준다", () => {
    renderPractice("없는유형");
    expect(screen.getByTestId("unknown-type")).toBeInTheDocument();
  });

  it("제출 전에는 정답과 해설을 보여 주지 않는다", () => {
    renderPractice("reading");
    const expected = startSession("reading", ZERO);
    expect(screen.queryByText(expected[0].explanation)).not.toBeInTheDocument();
  });

  it("제출하면 정답 수와 문항별 정오답·해설을 보여 준다 (JN4-022)", async () => {
    const questions = startSession("reading", ZERO);
    renderPractice("reading");
    await answerAll(user, questions);
    await user.click(screen.getByRole("button", { name: /채점/ }));

    expect(screen.getByTestId("score")).toHaveTextContent("10");
    expect(screen.getByText(questions[0].explanation)).toBeInTheDocument();
    expect(within(questionCards()[0]).getByTestId("result-mark")).toHaveTextContent("정답");
  });

  it("답하지 않은 문항은 오답으로 세고 미응답으로 표시한다 (JN4-023)", async () => {
    const questions = startSession("orthography", ZERO);
    renderPractice("orthography");
    await answerAll(user, questions, { skipFrom: 4 });
    await user.click(screen.getByRole("button", { name: /채점/ }));

    expect(screen.getByTestId("score")).toHaveTextContent("4");
    expect(within(questionCards()[9]).getByTestId("result-mark")).toHaveTextContent("미응답");
  });

  it("제출 후에는 선택지를 누를 수 없다 (JN4-025)", async () => {
    const questions = startSession("synonym", ZERO);
    renderPractice("synonym");
    await answerAll(user, questions);
    await user.click(screen.getByRole("button", { name: /채점/ }));

    for (const button of within(questionCards()[0]).getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
  });

  it("제출 전에는 채점 버튼만 있고 다시 풀기 버튼은 없다", () => {
    renderPractice("usage");
    expect(screen.getByRole("button", { name: /채점/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /다시 풀기/ })).not.toBeInTheDocument();
  });

  it("채점 뒤에는 새 회차를 시작할 수 있다 (JN4-025)", async () => {
    const questions = startSession("usage", ZERO);
    renderPractice("usage");
    await answerAll(user, questions);
    await user.click(screen.getByRole("button", { name: /채점/ }));

    await user.click(screen.getByRole("button", { name: /다시 풀기/ }));
    expect(screen.queryByTestId("score")).not.toBeInTheDocument();
    expect(questionCards()).toHaveLength(10);
  });

  it("실전 연습은 학습 진도를 바꾸지 않는다 (JN4-029)", async () => {
    const saved = JSON.stringify({ version: SCHEMA_VERSION, cards: { "青い|あおい": { stage: 2, dueAt: 100 } } });
    const storage = createStorage({ [STORAGE_KEY]: saved });
    const questions = startSession("reading", ZERO);
    renderPractice("reading", storage);
    await answerAll(user, questions);
    await user.click(screen.getByRole("button", { name: /채점/ }));

    expect(storage._dump()[STORAGE_KEY]).toBe(saved);
  });

  it("Enter로 채점할 수 있다 (JN4-U08, AC-9)", async () => {
    const questions = startSession("reading", ZERO);
    renderPractice("reading");
    await answerAll(user, questions);
    await user.keyboard("{Enter}");

    expect(screen.getByTestId("score")).toHaveTextContent("10");
  });

  it("채점 뒤의 Enter는 새 회차를 시작하지 않는다 (JN4-025)", async () => {
    const questions = startSession("reading", ZERO);
    renderPractice("reading");
    await answerAll(user, questions);
    await user.keyboard("{Enter}");
    await user.keyboard("{Enter}");

    expect(screen.getByTestId("score")).toBeInTheDocument();
  });

  it("후리가나는 처음에 꺼져 있다 (JN4-033)", () => {
    renderPractice("synonym");
    expect(document.querySelectorAll("ruby")).toHaveLength(0);
  });

  it("후리가나 버튼을 누르면 문장에 읽기가 붙는다 (JN4-032)", async () => {
    const storage = createStorage();
    renderPractice("synonym", storage);
    await user.click(screen.getByRole("button", { name: /후리가나/ }));

    expect(document.querySelectorAll("ruby").length).toBeGreaterThan(0);
    expect(loadFurigana(storage)).toBe(true);
  });

  it("한자 읽기 유형은 후리가나를 켜도 밑줄 대상의 읽기를 보여 주지 않는다 (JN4-034, AC-14)", async () => {
    const questions = startSession("reading", ZERO);
    renderPractice("reading");
    await user.click(screen.getByRole("button", { name: /후리가나/ }));

    const answer = questions[0].choices[questions[0].answerIndex];
    const underlined = within(questionCards()[0]).getByTestId("underlined");
    expect(underlined.querySelectorAll("ruby")).toHaveLength(0);
    expect(underlined.textContent).not.toContain(answer);
  });

  it("표기 유형은 밑줄 대상이 이미 히라가나라 후리가나가 붙지 않는다 (JN4-018)", async () => {
    renderPractice("orthography");
    await user.click(screen.getByRole("button", { name: /후리가나/ }));

    const underlined = within(questionCards()[0]).getByTestId("underlined");
    expect(underlined.querySelectorAll("ruby")).toHaveLength(0);
  });

  it("모든 선택지가 button 요소다 (AC-9)", () => {
    renderPractice("context");
    for (const card of questionCards()) {
      expect(within(card).getAllByRole("button")).toHaveLength(4);
    }
  });
});
