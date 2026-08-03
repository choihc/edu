import { useEffect, useRef } from "react";

/** 글자를 입력하는 요소에 포커스가 있으면 단축키를 가로채지 않는다. */
function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable === true;
}

/**
 * 선택지를 숫자키 1~4로 고르고 Enter로 제출하는 단축키. 스펙 JN4-U08, 수용 조건 AC-9.
 *
 * 콜백은 ref에 담아 두고 이벤트 핸들러는 한 번만 붙인다. 부모가 렌더될 때마다
 * 새 함수를 넘겨도 리스너를 다시 등록하지 않기 위해서다.
 *
 * @param {Object} options
 * @param {(index: number) => void} options.onSelect
 * @param {() => void} [options.onSubmit]
 * @param {boolean} [options.enabled]
 */
export function useChoiceKeys({ onSelect, onSubmit, enabled = true }) {
  const handlers = useRef({ onSelect, onSubmit });
  handlers.current = { onSelect, onSubmit };

  useEffect(() => {
    if (!enabled) return undefined;

    const handleKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      if (event.key === "Enter") {
        const { onSubmit: submit } = handlers.current;
        if (!submit) return;
        event.preventDefault();
        submit();
        return;
      }

      const position = Number(event.key);
      if (!Number.isInteger(position) || position < 1 || position > 4) return;
      const { onSelect: select } = handlers.current;
      if (!select) return;
      event.preventDefault();
      select(position - 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);
}
