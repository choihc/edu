// src/AiNativePresentation.jsx
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { runExportMode } from "./downloadUtils.js";
import { slides, PRESENTATION_META } from "./aiNativeSlides.js";

// palette: Presentation.jsx 의 palette 객체와 동일 키·값 복제
// (spec §5.2 결정. 공유 모듈 추출은 후속 작업으로 분리)
const palette = {
  bg: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  text: "#0f172a",
  textSub: "#334155",
  textMuted: "#64748b",
  textFaint: "#94a3b8",
  indigo: "#4f46e5",
  indigoLight: "#eef2ff",
  pink: "#db2777",
  pinkLight: "#fdf2f8",
  emerald: "#059669",
  emeraldLight: "#ecfdf5",
  amber: "#d97706",
  amberLight: "#fffbeb",
  violet: "#7c3aed",
  violetLight: "#f5f3ff",
  sky: "#0284c7",
  skyLight: "#f0f9ff",
};

// ─── kind별 렌더러 (Chunk 2에서 채움) ───────────────────────
function HeroSlide({ s }) {
  // variant: "title" (기본) | "case-intro" (Act 4 도입) — eyebrow 색만 분기
  const eyebrowColor = s.variant === "case-intro" ? palette.amber : palette.indigo;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 8%", textAlign: "center" }}>
      {s.eyebrow && (
        <div style={{ color: eyebrowColor, fontWeight: 800, letterSpacing: "0.08em", fontSize: 14, marginBottom: 18 }}>
          {s.eyebrow}
        </div>
      )}
      <h1 style={{ fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.1, color: palette.text, margin: 0, letterSpacing: "-0.01em" }}>
        {s.title}
      </h1>
      {s.subtitle && (
        <div style={{ fontSize: "clamp(18px, 2vw, 26px)", color: palette.textSub, marginTop: 18 }}>
          {s.subtitle}
        </div>
      )}
      {s.tagline && (
        <div style={{ fontSize: 16, color: palette.textMuted, marginTop: 12 }}>{s.tagline}</div>
      )}
      {s.desc && (
        <p style={{ color: palette.textMuted, fontSize: 16, lineHeight: 1.8, maxWidth: 720, marginTop: 22 }}>
          {s.desc}
        </p>
      )}
    </div>
  );
}

// 나머지 7개 kind는 Chunk 2(T5)에서 구현 — 임시 placeholder
function NotImplementedSlide({ s }) {
  return (
    <div style={{ padding: 60, color: palette.textMuted }}>
      <code style={{ background: palette.indigoLight, color: palette.indigo, padding: "4px 10px", borderRadius: 6 }}>
        kind="{s.kind}" variant="{s.variant ?? ""}"
      </code>
      <div style={{ marginTop: 20, fontSize: 14 }}>Chunk 2에서 구현 예정.</div>
    </div>
  );
}

function renderSlide(slide) {
  switch (slide.kind) {
    case "hero": return <HeroSlide s={slide} />;
    // 나머지 7개 kind: Chunk 2(T5)에서 추가
    default: return <NotImplementedSlide s={slide} />;
  }
}

// ─── Shell (헤더/푸터/카운터/네비) ───────────────────────────
function SlideShell({ idx, total, slide, children, onPrev, onNext }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: palette.bg,
      color: palette.text,
      fontFamily: "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      <header style={{
        padding: "18px 32px",
        borderBottom: `1px solid ${palette.border}`,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <a href="/" style={{ color: palette.textMuted, textDecoration: "none", fontWeight: 800, fontSize: 13 }}>
          ← 메뉴로
        </a>
        <div style={{ marginLeft: "auto", color: palette.textFaint, fontSize: 13, fontWeight: 700 }}>
          {idx + 1} / {total}
        </div>
      </header>

      <main style={{ flex: 1, position: "relative" }}>
        {children}
      </main>

      <footer data-export-hidden style={{
        padding: "14px 32px",
        borderTop: `1px solid ${palette.border}`,
        display: "flex",
        gap: 8,
        justifyContent: "center",
      }}>
        <button onClick={onPrev} disabled={idx === 0} style={navBtnStyle(idx === 0)}>← 이전</button>
        <button onClick={onNext} disabled={idx === total - 1} style={navBtnStyle(idx === total - 1)}>다음 →</button>
      </footer>
    </div>
  );
}

const navBtnStyle = (disabled) => ({
  border: `1px solid ${palette.border}`,
  background: palette.surface,
  color: disabled ? palette.textFaint : palette.text,
  borderRadius: 8,
  padding: "10px 18px",
  fontWeight: 800,
  fontSize: 14,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
});

// ─── Export 모드 (인쇄/HTML 다운로드) ───────────────────────
// React StrictMode에서 useEffect가 2회 실행되어 인쇄 다이얼로그가 2회 뜨는 것을 방지하기 위한
// 모듈 레벨 1회 가드.
let exportModeTriggered = false;

function ExportDeck() {
  useEffect(() => {
    if (exportModeTriggered) return;
    exportModeTriggered = true;
    runExportMode({ filename: "ai-native-presentation.html", delay: 900 });
  }, []);

  return (
    <div style={{
      fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
      background: palette.bg,
      color: palette.text,
      padding: "32px",
    }}>
      {/* 인쇄 시 footer/네비 등 [data-export-hidden] 요소 숨김 + 페이지 분할 */}
      <style>{`
        @page { size: A4 landscape; margin: 12mm; }
        @media print {
          [data-export-hidden] { display: none !important; }
          section { page-break-after: always; }
        }
      `}</style>
      {slides.map((s, i) => (
        <section key={i} style={{
          minHeight: "60vh",
          marginBottom: 48,
          pageBreakAfter: "always",
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 12,
          padding: 32,
        }}>
          <div style={{ color: palette.textFaint, fontSize: 12, fontWeight: 800, marginBottom: 16 }}>
            {i + 1} / {slides.length}
          </div>
          {renderSlide(s)}
        </section>
      ))}
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────
export default function AiNativePresentation() {
  const { slide } = useParams();
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);

  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const isExportView = params.get("print") === "1" || params.get("export") === "html";

  useEffect(() => {
    const nextIdx = slide && /^\d+$/.test(slide) ? Number(slide) - 1 : 0;
    setIdx(Math.max(0, Math.min(slides.length - 1, nextIdx)));
  }, [slide]);

  const goto = useCallback((i) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    setIdx(clamped);
    const nextPath = clamped === 0 ? "/ai-native" : `/ai-native/${clamped + 1}`;
    const currentPath = idx === 0 ? "/ai-native" : `/ai-native/${idx + 1}`;
    if (nextPath !== currentPath) navigate(nextPath);
  }, [idx, navigate]);

  const next = useCallback(() => goto(idx + 1), [idx, goto]);
  const prev = useCallback(() => goto(idx - 1), [idx, goto]);

  useEffect(() => {
    if (isExportView) return;
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
      else if (e.key === "Home") { e.preventDefault(); goto(0); }
      else if (e.key === "End") { e.preventDefault(); goto(slides.length - 1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, goto, isExportView]);

  if (isExportView) return <ExportDeck />;

  return (
    <SlideShell idx={idx} total={slides.length} slide={slides[idx]} onPrev={prev} onNext={next}>
      {renderSlide(slides[idx])}
    </SlideShell>
  );
}

export { palette };  // Chunk 2의 kind 렌더러가 동일 파일 내부에서 참조
