import { useState } from "react";
import { Link } from "react-router-dom";
import ResetProgressButton from "../components/ResetProgressButton.jsx";
import { allIds } from "../data/vocabulary.js";
import { clearProgress, loadProgress } from "../lib/progressStore.js";
import { learnedCount } from "../lib/srs.js";
import { PRACTICE_TYPES } from "../lib/practiceSession.js";
import { mainStyle, palette, shellStyle } from "../theme.js";

function defaultStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

/**
 * 홈 화면. N4 학습 경험의 진입점만 둔다 (JN4-001).
 * 현재 학습 진도를 보여 주고 (JN4-028), 진도 초기화 수단을 제공한다 (JN4-037~JN4-041).
 */
export default function HomePage({ storage }) {
  const store = storage ?? defaultStorage();
  const ids = allIds();

  // 초기화하면 화면의 진도 표시도 함께 갱신해야 하므로 진도를 상태로 들고 있는다.
  const [progress, setProgress] = useState(() => loadProgress(store));

  const learned = learnedCount(ids, progress);
  const percent = Math.round((learned / ids.length) * 100);
  const hasSavedProgress = Object.keys(progress).length > 0;

  const handleReset = () => {
    clearProgress(store);
    setProgress({});
  };

  return (
    <div style={shellStyle}>
      <main style={mainStyle}>
        <header style={{ marginBottom: 34 }}>
          <p style={{ color: palette.red, fontWeight: 900, margin: "0 0 12px", fontSize: 14 }}>
            JLPT N4 · 문자 · 어휘
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(32px, 8vw, 56px)",
              lineHeight: 1.1,
              color: palette.ink,
            }}
          >
            한자와 어휘를
            <br />
            떠올리며 외웁니다
          </h1>
          <p style={{ margin: "18px 0 0", color: palette.muted, fontSize: 16, lineHeight: 1.8 }}>
            먼저 답을 떠올리고 바로 정답을 확인하는 방식으로 어휘 {ids.length}개를 익힙니다.
            <br />
            맞힌 항목은 점점 긴 간격으로, 틀린 항목은 곧 다시 나옵니다.
          </p>
        </header>

        <section
          data-testid="home-progress"
          style={{
            background: palette.paper,
            border: `1px solid ${palette.line}`,
            borderRadius: 10,
            padding: "20px 22px",
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <span style={{ color: palette.muted, fontSize: 14, fontWeight: 800 }}>학습 진도</span>
            <span style={{ color: palette.ink, fontWeight: 900, fontSize: 18 }}>
              {ids.length}개 중 {learned}개 · {percent}%
            </span>
          </div>
          <div
            style={{
              marginTop: 14,
              height: 8,
              borderRadius: 999,
              background: palette.soft,
              overflow: "hidden",
            }}
          >
            <div style={{ width: `${percent}%`, height: "100%", background: palette.blue }} />
          </div>
          {hasSavedProgress && (
            <div style={{ marginTop: 16 }}>
              <ResetProgressButton onConfirm={handleReset} />
            </div>
          )}
        </section>

        <section style={{ display: "grid", gap: 14 }}>
          <EntryCard
            to="/study"
            accent={palette.blue}
            meta="네 지선다 · 간격 반복"
            title="어휘 학습"
            body="단어를 보고 읽기와 뜻을 떠올립니다. 답을 고르면 한국식 음훈과 기억 힌트, 예문을 함께 확인할 수 있습니다."
          />
          <EntryCard
            to="/practice"
            accent={palette.red}
            meta="다섯 유형 · 회차당 10문항"
            title="실전 연습"
            body="시험과 같은 다섯 가지 문제 유형으로 연습합니다. 한 회차를 다 풀고 한 번에 채점합니다."
          >
            <ul style={{ margin: "14px 0 0", paddingLeft: 18, color: palette.muted, lineHeight: 1.9 }}>
              {PRACTICE_TYPES.map((type) => (
                <li key={type.id}>{type.label}</li>
              ))}
            </ul>
          </EntryCard>
        </section>
      </main>
    </div>
  );
}

function EntryCard({ to, accent, meta, title, body, children }) {
  return (
    <div
      style={{
        background: palette.paper,
        border: `1px solid ${palette.line}`,
        borderTop: `6px solid ${accent}`,
        borderRadius: 10,
        padding: "24px 22px",
        boxShadow: "0 12px 34px rgba(38,33,27,0.08)",
      }}
    >
      <div style={{ color: accent, fontSize: 13, fontWeight: 900, marginBottom: 12 }}>{meta}</div>
      <h2 style={{ margin: 0, fontSize: 25, color: palette.ink }}>{title}</h2>
      <p style={{ margin: "12px 0 0", color: palette.muted, lineHeight: 1.8, fontSize: 15 }}>{body}</p>
      {children}
      <Link
        to={to}
        style={{
          display: "inline-block",
          marginTop: 20,
          color: accent,
          fontWeight: 900,
          textDecoration: "none",
        }}
      >
        {title} 시작하기 →
      </Link>
    </div>
  );
}
