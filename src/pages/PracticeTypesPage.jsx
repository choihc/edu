import { Link } from "react-router-dom";
import { PRACTICE_TYPES, SESSION_SIZE, getBank } from "../lib/practiceSession.js";
import { mainStyle, palette, shellStyle } from "../theme.js";

/** 실전 연습 유형 선택 화면. 스펙 S3의 진입 지점이다. */
export default function PracticeTypesPage() {
  return (
    <div style={shellStyle}>
      <main style={mainStyle}>
        <header style={{ marginBottom: 26 }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              color: palette.muted,
              textDecoration: "none",
              border: `1px solid ${palette.line}`,
              background: "rgba(255,250,241,0.76)",
              padding: "8px 12px",
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            홈으로
          </Link>
          <h1 style={{ margin: "18px 0 6px", fontSize: "clamp(26px, 5vw, 36px)", color: palette.ink }}>
            실전 연습
          </h1>
          <p style={{ margin: 0, color: palette.muted, fontSize: 15, lineHeight: 1.8 }}>
            유형을 고르면 {SESSION_SIZE}문항이 한 회차로 나옵니다. 다 풀고 한 번에 채점합니다.
          </p>
        </header>

        <section style={{ display: "grid", gap: 12 }}>
          {PRACTICE_TYPES.map((type, index) => (
            <Link
              key={type.id}
              to={`/practice/${type.id}`}
              style={{
                display: "block",
                background: palette.paper,
                border: `1px solid ${palette.line}`,
                borderLeft: `5px solid ${palette.red}`,
                borderRadius: 10,
                padding: "20px 20px",
                textDecoration: "none",
                color: palette.text,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ color: palette.red, fontWeight: 900, fontSize: 14 }}>
                  もんだい{index + 1}
                </span>
                <h2 style={{ margin: 0, fontSize: 21, color: palette.ink }}>{type.label}</h2>
                <span style={{ marginLeft: "auto", color: palette.muted, fontSize: 13, fontWeight: 800 }}>
                  {getBank(type.id).length}문항
                </span>
              </div>
              <p style={{ margin: "10px 0 0", color: palette.muted, fontSize: 15, lineHeight: 1.7 }}>
                {type.description}
              </p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
