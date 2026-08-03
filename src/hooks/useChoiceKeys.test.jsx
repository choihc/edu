import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useChoiceKeys } from "./useChoiceKeys.js";

function Probe({ onSelect, onSubmit, enabled = true }) {
  useChoiceKeys({ onSelect, onSubmit, enabled });
  return (
    <div>
      <input aria-label="메모" />
      <textarea aria-label="긴 메모" />
    </div>
  );
}

describe("선택지 키보드 조작 (JN4-U08, AC-9)", () => {
  let user;
  let onSelect;
  let onSubmit;

  beforeEach(() => {
    user = userEvent.setup();
    onSelect = vi.fn();
    onSubmit = vi.fn();
  });

  it("숫자키 1~4가 각 선택지 위치를 고른다", async () => {
    render(<Probe onSelect={onSelect} onSubmit={onSubmit} />);
    await user.keyboard("1234");
    expect(onSelect.mock.calls).toEqual([[0], [1], [2], [3]]);
  });

  it("5 이상의 숫자키는 무시한다", async () => {
    render(<Probe onSelect={onSelect} onSubmit={onSubmit} />);
    await user.keyboard("509");
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("Enter가 제출을 부른다", async () => {
    render(<Probe onSelect={onSelect} onSubmit={onSubmit} />);
    await user.keyboard("{Enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("enabled가 false면 아무것도 부르지 않는다", async () => {
    render(<Probe onSelect={onSelect} onSubmit={onSubmit} enabled={false} />);
    await user.keyboard("1{Enter}");
    expect(onSelect).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("입력 요소에 포커스가 있으면 가로채지 않는다", async () => {
    render(<Probe onSelect={onSelect} onSubmit={onSubmit} />);
    await user.click(screen.getByLabelText("메모"));
    await user.keyboard("1");
    expect(onSelect).not.toHaveBeenCalled();

    await user.click(screen.getByLabelText("긴 메모"));
    await user.keyboard("2");
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("보조키를 함께 누르면 가로채지 않는다", async () => {
    render(<Probe onSelect={onSelect} onSubmit={onSubmit} />);
    await user.keyboard("{Meta>}1{/Meta}");
    await user.keyboard("{Control>}2{/Control}");
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("onSubmit을 주지 않아도 오류가 나지 않는다", async () => {
    render(<Probe onSelect={onSelect} />);
    await user.keyboard("{Enter}");
    expect(onSelect).not.toHaveBeenCalled();
  });
});
