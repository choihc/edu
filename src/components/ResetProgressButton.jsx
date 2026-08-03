import { useState } from "react";
import { palette } from "../theme.js";

/**
 * 학습 진도 초기화 버튼. 스펙 JN4-038, JN4-040.
 *
 * 지운 진도는 되살릴 수 없으므로 한 번 눌러 바로 지우지 않고, 확인·취소를 한 단계 더 묻는다.
 * 지우는 일 자체는 이 컴포넌트가 하지 않고 onConfirm을 부른다. 무엇을 지울지는 화면이 정한다.
 *
 * @param {Object} props
 * @param {() => void} props.onConfirm 사용자가 확인을 누른 경우 호출된다
 */
export default function ResetProgressButton({ onConfirm }) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <button
        type="button"
        onClick={() => setAsking(true)}
        style={{
          border: `1px solid ${palette.line}`,
          background: "rgba(255,250,241,0.76)",
          color: palette.muted,
          borderRadius: 8,
          padding: "8px 12px",
          fontWeight: 800,
          fontSize: 13,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        진도 초기화
      </button>
    );
  }

  return (
    <div
      data-testid="reset-confirm"
      style={{
        border: `1px solid ${palette.red}`,
        background: "rgba(184,58,47,0.08)",
        borderRadius: 8,
        padding: "14px 16px",
      }}
    >
      <p style={{ margin: 0, color: palette.text, fontSize: 14, lineHeight: 1.7 }}>
        저장된 학습 진도를 모두 지웁니다. 어휘 전체가 미학습 상태로 돌아가며,{" "}
        <strong style={{ color: palette.red }}>되돌릴 수 없습니다.</strong>
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
        <button
          type="button"
          onClick={() => {
            setAsking(false);
            onConfirm();
          }}
          style={{
            border: "none",
            background: palette.red,
            color: "#fff",
            borderRadius: 8,
            padding: "10px 16px",
            fontWeight: 800,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          네, 지우기
        </button>
        <button
          type="button"
          onClick={() => setAsking(false)}
          style={{
            border: `1px solid ${palette.line}`,
            background: palette.paper,
            color: palette.muted,
            borderRadius: 8,
            padding: "10px 16px",
            fontWeight: 800,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          취소
        </button>
      </div>
    </div>
  );
}
