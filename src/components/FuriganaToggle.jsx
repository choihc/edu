import { palette } from "../theme.js";

/**
 * 후리가나 켜기·끄기 버튼. 스펙 JN4-032.
 *
 * @param {Object} props
 * @param {boolean} props.enabled
 * @param {() => void} props.onToggle
 */
export default function FuriganaToggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      style={{
        border: `1px solid ${enabled ? palette.blue : palette.line}`,
        background: enabled ? "rgba(49,95,130,0.12)" : "rgba(255,250,241,0.76)",
        color: enabled ? palette.blue : palette.muted,
        borderRadius: 8,
        padding: "8px 12px",
        fontWeight: 800,
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      후리가나 {enabled ? "켜짐" : "꺼짐"}
    </button>
  );
}
