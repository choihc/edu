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

function QuoteSlide({ s }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "0 10%", textAlign: "center" }}>
      {s.eyebrow && (
        <div style={{ color: palette.indigo, fontWeight: 800, letterSpacing: "0.08em", fontSize: 14, marginBottom: 22 }}>
          {s.eyebrow}
        </div>
      )}
      <blockquote style={{
        fontSize: "clamp(28px, 3.4vw, 44px)",
        lineHeight: 1.4,
        color: palette.text,
        margin: 0,
        fontWeight: 700,
        letterSpacing: "-0.01em",
      }}>
        "{s.quote}"
      </blockquote>
      {s.attribution && (
        <div style={{ marginTop: 28, color: palette.textMuted, fontSize: 16, fontWeight: 700 }}>
          — {s.attribution}
        </div>
      )}
    </div>
  );
}

function StatsGridSlide({ s }) {
  const stats = s.stats ?? [];
  return (
    <div style={{ padding: "48px 8%", display: "flex", flexDirection: "column", height: "100%" }}>
      <SlideHeader eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
        gap: 18,
        marginTop: 36,
        flex: 1,
        alignContent: "center",
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            background: palette.indigoLight,
            border: `1px solid ${palette.border}`,
            borderRadius: 12,
            padding: 22,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>
            <div style={{ fontSize: "clamp(28px, 2.6vw, 38px)", color: palette.indigo, fontWeight: 900, letterSpacing: "-0.02em" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 14, color: palette.textSub, fontWeight: 700 }}>{stat.label}</div>
            {stat.delta && (
              <div style={{ fontSize: 12, color: palette.emerald, fontWeight: 700 }}>{stat.delta}</div>
            )}
          </div>
        ))}
      </div>
      <SourceFooter source={s.source} />
    </div>
  );
}

function ListRowsSlide({ s }) {
  const rows = s.rows ?? [];
  const v = s.variant;
  const accentByVariant = {
    counterevidence: palette.amber,
    definition: palette.indigo,
    "cycle-step": palette.emerald,
    "persona-qual": palette.pink,
    "case-lessons": palette.violet,
    "roadmap-org": palette.sky,
  };
  const accent = accentByVariant[v] ?? palette.indigo;

  return (
    <div style={{ padding: "48px 8%", display: "flex", flexDirection: "column", height: "100%" }}>
      <SlideHeader eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} accent={accent} />
      {s.intro && (
        <p style={{ color: palette.textMuted, fontSize: 16, lineHeight: 1.7, margin: "8px 0 18px", maxWidth: 880 }}>
          {s.intro}
        </p>
      )}
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {rows.map((row, i) => (
          <div key={i} style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderLeft: `4px solid ${accent}`,
            borderRadius: 10,
            padding: "14px 18px",
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
          }}>
            {row.badge && (
              <span style={{
                background: `${accent}1f`,
                color: accent,
                borderRadius: 999,
                padding: "2px 10px",
                fontSize: 11,
                fontWeight: 800,
                whiteSpace: "nowrap",
                marginTop: 2,
              }}>
                {row.badge}
              </span>
            )}
            <div style={{ flex: 1 }}>
              {row.label && (
                <div style={{ fontWeight: 800, color: palette.text, fontSize: 16, marginBottom: row.body ? 6 : 0 }}>
                  {row.label}
                </div>
              )}
              {row.body && (
                <div style={{ color: palette.textSub, fontSize: 15, lineHeight: 1.7 }}>{row.body}</div>
              )}
              {row.source && (
                <div style={{ marginTop: 6, color: palette.textFaint, fontSize: 12 }}>
                  ↳ {row.source.label}{row.source.year ? ` · ${row.source.year}` : ""}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {s.outro && (
        <p style={{ color: palette.textMuted, fontSize: 14, lineHeight: 1.7, marginTop: 18, fontStyle: "italic" }}>
          {s.outro}
        </p>
      )}
      <SourceFooter source={s.source} />
    </div>
  );
}

function CardsGridSlide({ s }) {
  const cards = s.cards ?? [];
  const columns = cards.length <= 3 ? cards.length : 3;
  return (
    <div style={{ padding: "48px 8%", display: "flex", flexDirection: "column", height: "100%" }}>
      <SlideHeader eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 16,
        marginTop: 32,
        flex: 1,
        alignContent: "center",
      }}>
        {cards.map((card, i) => {
          const accent = card.accent ? palette[card.accent] ?? palette.indigo : palette.indigo;
          return (
            <div key={i} style={{
              background: palette.surface,
              border: `1px solid ${palette.border}`,
              borderTop: `4px solid ${accent}`,
              borderRadius: 10,
              padding: 22,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}>
              {card.icon && <div style={{ fontSize: 26 }}>{card.icon}</div>}
              <div style={{ fontWeight: 900, color: accent, fontSize: 12, letterSpacing: "0.06em" }}>
                {card.tag ?? ""}
              </div>
              <div style={{ fontWeight: 800, color: palette.text, fontSize: 18, lineHeight: 1.4 }}>
                {card.title}
              </div>
              {card.body && (
                <div style={{ color: palette.textSub, fontSize: 14, lineHeight: 1.7 }}>{card.body}</div>
              )}
              {card.link && (
                <a href={card.link.href} style={{
                  marginTop: "auto",
                  color: accent,
                  fontWeight: 800,
                  fontSize: 13,
                  textDecoration: "none",
                }}>
                  {card.link.label} →
                </a>
              )}
            </div>
          );
        })}
      </div>
      <SourceFooter source={s.source} />
    </div>
  );
}

function CompareRowsSlide({ s }) {
  const headers = s.headers ?? [];
  const rows = s.rows ?? [];
  return (
    <div style={{ padding: "48px 8%", display: "flex", flexDirection: "column", height: "100%" }}>
      <SlideHeader eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
      <div style={{ marginTop: 32, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  background: palette.indigoLight,
                  color: palette.indigo,
                  fontWeight: 900,
                  borderBottom: `2px solid ${palette.indigo}`,
                  fontSize: 14,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: "12px 14px",
                    borderBottom: `1px solid ${palette.border}`,
                    color: j === 0 ? palette.text : palette.textSub,
                    fontWeight: j === 0 ? 800 : 500,
                  }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SourceFooter source={s.source} />
    </div>
  );
}

function ReferencesSlide({ s }) {
  const groups = s.groups ?? [];
  return (
    <div style={{ padding: "48px 8%", display: "flex", flexDirection: "column", height: "100%" }}>
      <SlideHeader eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 18,
        marginTop: 28,
      }}>
        {groups.map((group, i) => (
          <div key={i} style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: 10,
            padding: 18,
          }}>
            <div style={{ fontWeight: 900, color: palette.indigo, fontSize: 13, letterSpacing: "0.06em", marginBottom: 12 }}>
              {group.label}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {(group.items ?? []).map((item, j) => (
                <li key={j}>
                  <a href={item.url ?? "#"} target="_blank" rel="noopener noreferrer" style={{
                    color: palette.textSub,
                    textDecoration: "none",
                    fontSize: 14,
                    lineHeight: 1.5,
                    borderBottom: `1px dashed ${palette.border}`,
                    paddingBottom: 2,
                  }}>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClosingSlide({ s }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "0 10%", textAlign: "center" }}>
      <h2 style={{ fontSize: "clamp(36px, 4.5vw, 60px)", lineHeight: 1.2, color: palette.text, margin: 0, letterSpacing: "-0.01em" }}>
        {s.message}
      </h2>
      {s.qaQuestions && s.qaQuestions.length > 0 && (
        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <div style={{ color: palette.textMuted, fontWeight: 800, fontSize: 14, letterSpacing: "0.08em" }}>
            Q&amp;A 시작 질문
          </div>
          {s.qaQuestions.map((q, i) => (
            <div key={i} style={{
              background: palette.indigoLight,
              border: `1px solid ${palette.indigo}33`,
              color: palette.indigo,
              borderRadius: 999,
              padding: "10px 22px",
              fontWeight: 700,
              fontSize: 15,
            }}>
              {q}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SlideHeader({ eyebrow, title, subtitle, accent }) {
  return (
    <div>
      {eyebrow && (
        <div style={{ color: accent ?? palette.indigo, fontWeight: 800, letterSpacing: "0.08em", fontSize: 13, marginBottom: 10 }}>
          {eyebrow}
        </div>
      )}
      {title && (
        <h2 style={{ fontSize: "clamp(26px, 2.6vw, 38px)", lineHeight: 1.25, color: palette.text, margin: 0, letterSpacing: "-0.01em" }}>
          {title}
        </h2>
      )}
      {subtitle && (
        <div style={{ fontSize: 16, color: palette.textSub, marginTop: 8 }}>{subtitle}</div>
      )}
    </div>
  );
}

function SourceFooter({ source }) {
  if (!source) return null;
  return (
    <div style={{
      marginTop: 22,
      color: palette.textFaint,
      fontSize: 12,
      borderTop: `1px dashed ${palette.border}`,
      paddingTop: 10,
    }}>
      <strong style={{ color: palette.textMuted, fontWeight: 800 }}>출처</strong>{" · "}
      {source.label}
      {source.year ? ` (${source.year})` : ""}
      {source.disclaimer ? ` · ${source.disclaimer}` : ""}
    </div>
  );
}

// 나머지 kind 미구현 시 fallback
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
    case "quote": return <QuoteSlide s={slide} />;
    case "stats-grid": return <StatsGridSlide s={slide} />;
    case "list-rows": return <ListRowsSlide s={slide} />;
    case "cards-grid": return <CardsGridSlide s={slide} />;
    case "compare-rows": return <CompareRowsSlide s={slide} />;
    case "references": return <ReferencesSlide s={slide} />;
    case "closing": return <ClosingSlide s={slide} />;
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

      <main style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", minHeight: 0 }}>
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
