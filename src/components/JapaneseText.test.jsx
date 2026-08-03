import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import JapaneseText from "./JapaneseText.jsx";
import { MARKER } from "../lib/questionBuilders.js";

function rubyPairs(container) {
  return [...container.querySelectorAll("ruby")].map((ruby) => ({
    base: [...ruby.childNodes].filter((node) => node.nodeName !== "RT").map((node) => node.textContent).join(""),
    reading: ruby.querySelector("rt")?.textContent,
  }));
}

describe("일본어 본문 표시 (JN4-032~JN4-034)", () => {
  it("후리가나가 꺼져 있으면 ruby 없이 원문만 보여 준다 (JN4-033)", () => {
    const { container } = render(<JapaneseText text="今日は空が青い。" furigana={false} />);
    expect(container.querySelectorAll("ruby")).toHaveLength(0);
    expect(container.textContent).toBe("今日は空が青い。");
  });

  it("후리가나를 켜면 한자에만 읽기를 얹고 보내는 가나는 그대로 둔다 (JN4-032)", () => {
    // 후리가나는 관례대로 한자 위에만 놓는다. 青い의 い는 아래 그대로 남는다.
    const { container } = render(<JapaneseText text="今日は空が青い。" furigana />);
    expect(rubyPairs(container)).toEqual([
      { base: "今日", reading: "きょう" },
      { base: "空", reading: "そら" },
      { base: "青", reading: "あお" },
    ]);
  });

  it("후리가나를 켜도 원문 글자는 그대로 남는다", () => {
    const { container } = render(<JapaneseText text="毎朝バスに乗る。" furigana />);
    const withoutReadings = [...container.querySelectorAll("rt")].reduce(
      (text, rt) => text.replace(rt.textContent, ""),
      container.textContent
    );
    expect(withoutReadings).toBe("毎朝バスに乗る。");
  });

  it("밑줄 표식을 밑줄로 그리고 표식 문자는 보여 주지 않는다", () => {
    const { container } = render(<JapaneseText text={`空が${MARKER}青い${MARKER}。`} furigana={false} />);
    expect(container.textContent).toBe("空が青い。");
    expect(screen.getByTestId("underlined")).toHaveTextContent("青い");
  });

  it("밑줄 대상은 후리가나에서 제외한다 (JN4-034)", () => {
    const { container } = render(
      <JapaneseText text={`今日は空が${MARKER}青い${MARKER}。`} furigana excludeUnderlined />
    );
    const bases = rubyPairs(container).map((pair) => pair.base);
    expect(bases).toContain("今日");
    expect(bases).toContain("空");
    expect(bases).not.toContain("青");
    expect(container.textContent).not.toContain("あお");
  });

  it("제외하지 않으면 밑줄 대상에도 후리가나를 붙인다", () => {
    const { container } = render(<JapaneseText text={`空が${MARKER}青い${MARKER}。`} furigana />);
    expect(rubyPairs(container).map((pair) => pair.base)).toContain("青");
  });

  it("사전에 없는 한자는 읽기 없이 그대로 둔다", () => {
    const { container } = render(<JapaneseText text="鯨が見える。" furigana />);
    expect(container.textContent).toContain("鯨");
    expect(rubyPairs(container).map((pair) => pair.base)).not.toContain("鯨");
  });
});
