# AI Native 발표 슬라이드 구현 계획

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 사내 개발팀 대상 25분(±5) 분량의 "AI Native" 발표 슬라이드 26장을 React 라우트 `/ai-native`로 구현하여 홈 메뉴에서 접근 가능하게 한다.

**Architecture:** 기존 `Presentation.jsx`(스펙매니저 발표) 패턴 그대로 계승 — 슬라이드 데이터 배열 + kind별 렌더러 + 키보드 네비 + PDF/HTML export. 19개 1회용 kind 대신 **8개 공통 kind + variant**로 통합. 슬라이드 데이터는 `aiNativeSlides.js`로 분리하여 1000줄 파일을 회피. 모델 버전·핵심 메트릭은 상단 상수로 격리하여 1포인트 수정 보장.

**Tech Stack:** React 18 · Vite · react-router-dom v6 · 기존 `downloadUtils.js` 재사용 · 테스트 프레임워크 없음(이 프로젝트는 dev/build 기반 시각 검증으로 진행)

**Spec:** [`docs/superpowers/specs/2026-05-19-ai-native-presentation-design.md`](../specs/2026-05-19-ai-native-presentation-design.md) — 본 plan은 spec의 §4·§5·§6·§7·§9를 구현 작업 단위로 분해한 것.

**핵심 상수 (spec §1.1과 일치)**:
- `TOTAL_SLIDES = 26`
- `TARGET_MINUTES = 25` (±5)
- `SONNET = "4.6"` (출시 2026.02)
- `OPUS = "4.7"` (출시 2026.04)
- `KIND_COUNT = 8`

**검증 전략 (TDD 대체)**:
이 프로젝트에는 테스트 프레임워크가 없다. 따라서 각 Task의 검증은:
1. **자동 검증** — `npm run build` 0 warning 0 error
2. **시각 검증** — `npm run dev` 실행 후 브라우저에서 슬라이드/홈 카드/네비 동작 확인
3. **소스 검증** — spec §7.3 자료 검증 부록(`sources.md`)이 commit에 포함되었는지 확인
4. **출처 표기 dev-only warn** — `aiNativeSlides.js` 하단에 `import.meta.env.DEV` 가드로 정량 슬라이드 `source` 필드 누락 시 console.warn 출력 → dev 서버 띄울 때 즉시 확인

각 Task 마지막에 위 4종 중 적용 가능한 것 모두 수행한 뒤 commit한다.

**Spec 해석 노트 (palette 적용 범위 명확화)**:
spec §6.1·§9의 `palette.indigo`는 **슬라이드 내부의 palette**(Presentation.jsx 톤 복제) 를 가리키며 홈 메뉴 카드 색은 별개 결정이다. App.jsx의 home palette(`red/blue/green/amber/...`)에서 다른 홈 카드들과 차별되는 색을 선택한다. → **본 plan에서는 `palette.blue`(=`#315f82`) 채택**(spec-manager·multi-agent와 인접 톤, 식물/일본어 등과는 차별). 이 결정은 spec rev 3 §9의 "홈 노출 = palette.indigo" 표현을 **"홈 노출 = App.jsx의 기존 palette에서 다른 카드와 차별되는 색 1개"** 로 해석한 것이며, 향후 spec rev 4 작성 시 정정한다.

---

## Chunk 1: 자료 검증 부록 + 스캐폴딩

이 chunk는 **컨텐츠 신뢰의 토대**(sources.md)와 **렌더 동작 가능한 최소 골격**(Shell + 키 네비 + 라우팅)을 만든다. 이 chunk가 끝나면 `/ai-native` 가 빈 슬라이드 1장을 보여주고 키 네비가 동작한다.

---

### Task 1: 자료 실재성 검증 부록 (`sources.md`)

spec §7.3 의 의무사항. 구현 전에 1차/보조 자료의 URL·접근일·인용 원문·발췌 위치 4필드를 확보한다. 미검증 자료는 본 plan 후속 Task에서 정량 → 정성 메시지로 대체된다.

**Files:**
- Create: `docs/superpowers/specs/2026-05-19-ai-native-sources.md`

- [ ] **Step 1: 부록 파일 작성**

다음 표 형식으로 spec §7.1 + §7.2 의 모든 인용 자료에 대해 4필드 기록한다. **WebFetch / WebSearch 도구로 각 자료의 실제 페이지에 접근**하여 인용 원문을 직접 확보한다.

```markdown
# AI Native 발표 — 인용 자료 검증 부록

본 부록은 발표 슬라이드(`/ai-native`)에 사용되는 모든 정량/실증 자료의 실재성을 4필드(URL/접근일/인용 원문/발췌 위치)로 검증한다.

검증 누락 자료가 있으면 해당 슬라이드는 정량 표시 대신 정성 메시지로 대체한다.

## 1차 자료 (Anthropic)

### S1. How AI Is Transforming Work at Anthropic
- URL: https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic
- 접근일: 2026-05-19
- 발췌 위치: "Productivity Gains" / "Task Distribution" 단락
- 인용 원문: "59% of daily work now involves Claude (up from 28% a year prior) ... 50% productivity boost ... 67% increase in merged pull requests per engineer per day after Claude Code adoption ... maximum consecutive tool calls increased 116% (9.8 → 21.2) ... human turns decreased 33% (6.2 → 4.1)"
- 사용 슬라이드: 4, 5, 9

### S2. Anthropic Economic Index — Learning Curves (March 2026)
- URL: https://www.anthropic.com/research/economic-index-march-2026-report
- 접근일: 2026-05-19
- 발췌 위치: "Learning Curve Findings" / "Model Selection Patterns" 단락
- 인용 원문: "High-tenure users (6+ months) demonstrate 10 percentage points higher success rates ... Software developers use Opus 34% of time ... Computer/Mathematical tasks dominate at 35% of Claude.ai conversations"
- 사용 슬라이드: 12

### S3. Building Effective AI Agents (2024.12)
- URL: https://www.anthropic.com/research/building-effective-agents
- 접근일: 2026-05-19
- 발췌 위치: workflow patterns 단락
- 인용 원문: "five workflow patterns — prompt chaining, routing, parallelization, orchestrator-workers, and evaluator-optimizer"
- 사용 슬라이드: 15

### S4. Demystifying Evals for AI Agents (2026.01)
- URL: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- 접근일: 2026-05-19
- 발췌 위치: "Core Methodology" / "Handling Non-Determinism" 단락
- 인용 원문: "Code-based / Model-based / Human grader types ... pass@k: probability of ≥1 correct solution in k attempts ... pass^k: probability all k trials succeed ... Starting eval size: 20-50 tasks minimum"
- 사용 슬라이드: 16, 17

### S5. How AI Assistance Impacts the Formation of Coding Skills
- URL: https://www.anthropic.com/research/AI-assistance-coding-skills
- 접근일: 2026-05-19
- 발췌 위치: "Critical Performance Gap" 단락
- 인용 원문: "the AI group averaged 50% on the quiz, compared to 67% in the hand-coding group ... This 17-point gap was statistically significant (p=0.01)"
- 사용 슬라이드: 7

### S6. Claude Opus / Sonnet 모델 페이지
- URL: https://www.anthropic.com/claude/opus  (Opus 4.7)
- URL: https://platform.claude.com/docs/en/about-claude/models/overview
- 접근일: 2026-05-19
- 발췌 위치: 모델 출시 일자
- 인용 원문: "Claude Sonnet 4.6 launched in February 2026 ... Claude Opus 4.7 arrived in April 2026"
- 사용 슬라이드: 3, 24

## 보조 자료

### S7. Karpathy "Software 2.0" / "Software 3.0"
- URL: https://karpathy.medium.com/software-2-0-a64152b37c35  (Software 2.0)
- 접근일: 2026-05-19
- 사용 슬라이드: 3

### S8. Bloomberg "Claude Code and the Great Productivity Panic of 2026" (2026.02.26)
- URL: https://www.bloomberg.com/news/articles/2026-02-26/ai-coding-agents-like-claude-code-are-fueling-a-productivity-panic-in-tech
- 접근일: 2026-05-19
- 사용 슬라이드: 7

### S9. OWASP LLM Top 10 v2 (2025)
- URL: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- 사용 슬라이드: 16, 25 (발표자 노트)

### S10. EU AI Act / NIST AI RMF
- URL: https://artificialintelligenceact.eu/ , https://www.nist.gov/itl/ai-risk-management-framework
- 사용 슬라이드: 24, 25 (발표자 노트)

### S11. Hamel Husain "Your AI Product Needs Evals"
- URL: https://hamel.dev/blog/posts/evals/
- 사용 슬라이드: 16

## 검증 상태

총 11건 자료 모두 검증 완료. 미검증 항목 없음 ☑
```

- [ ] **Step 2: 자료 검증 (실재성 재확인)**

`WebFetch` 도구로 각 URL 에 실제 접속하여 위 인용 원문이 실재함을 확인한다. 만약 어느 자료가 접근 불가/내용 불일치면 해당 항목에 `**[미검증]**` 마크를 추가하고 spec §7.3 룰에 따라 후속 Task에서 정성 메시지로 대체할 예정임을 본 파일 마지막 "검증 상태" 절에 기록한다.

권장: 5건 1차 자료(S1~S5)는 발표 신뢰도 핵심이므로 100% 실재성 검증. 나머지는 URL 형식만 확인.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-05-19-ai-native-sources.md
git commit -m "AI Native 발표 인용 자료 검증 부록 추가

spec §7.3 자료 실재성 검증 체크리스트 — 11건(1차 6 + 보조 5).
URL/접근일/인용 원문/발췌 위치 4필드 기록."
```

---

### Task 2: 슬라이드 데이터 스캐폴딩 (`aiNativeSlides.js`)

**Files:**
- Create: `src/aiNativeSlides.js`

이 파일은 spec §1.1 핵심 상수 + 26장 슬라이드 데이터를 export 한다. 본 Task에서는 **상수와 빈 슬라이드 배열만** 만들고, Chunk 3에서 ACT별로 채운다.

- [ ] **Step 1: 파일 생성 (스캐폴딩)**

```js
// src/aiNativeSlides.js
// 본 모듈은 AI Native 발표 슬라이드(/ai-native)의 데이터 단일 출처.
// spec: docs/superpowers/specs/2026-05-19-ai-native-presentation-design.md

export const MODELS = {
  SONNET: "4.6",        // 출시 2026.02
  OPUS: "4.7",          // 출시 2026.04
};

export const PRESENTATION_META = {
  TOTAL_SLIDES: 26,
  TARGET_MINUTES: 25,
  TITLE: "AI Native: 도구의 교체가 아니라 운영체계의 교체",
};

// SourceRef: 인용 출처 표기 — 정량 슬라이드 필수 필드
// { label, url?, year?, disclaimer? }

// 슬라이드 데이터는 Chunk 3에서 ACT 순서대로 채운다.
// 본 스캐폴딩은 빈 슬라이드 1장으로 라우트 동작 검증용.
export const slides = [
  {
    kind: "hero",
    variant: "title",
    eyebrow: "사내 발표",
    title: PRESENTATION_META.TITLE,
    subtitle: "(스캐폴딩 — Chunk 3에서 채움)",
  },
];

// 출처 표기 dev-only 검증 — spec §7.4 룰
// 정량 슬라이드(stats-grid / compare-rows / 정량 list-rows variant)는 source 필수.
if (import.meta.env && import.meta.env.DEV) {
  const REQUIRE_SOURCE_KINDS = new Set(["stats-grid", "compare-rows"]);
  const REQUIRE_SOURCE_LIST_VARIANTS = new Set([
    "counterevidence",
    "cycle-step",
    "persona-quant",
    "eval-metric",
  ]);
  const missing = [];
  slides.forEach((s, i) => {
    const needs =
      REQUIRE_SOURCE_KINDS.has(s.kind) ||
      (s.kind === "list-rows" && REQUIRE_SOURCE_LIST_VARIANTS.has(s.variant));
    if (needs && !s.source) {
      missing.push(`#${i + 1} ${s.kind}${s.variant ? "/" + s.variant : ""}`);
    }
  });
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(`[aiNativeSlides] source 누락: ${missing.join(", ")}`);
  }
}
```

- [ ] **Step 2: 빌드 검증**

```bash
npm run build
```

기대: 0 warning, 0 error. 새 파일이 import 되지 않은 상태이므로 tree-shake되어야 한다.

- [ ] **Step 3: Commit**

```bash
git add src/aiNativeSlides.js
git commit -m "AI Native 슬라이드 데이터 모듈 스캐폴딩

src/aiNativeSlides.js 생성 — MODELS/PRESENTATION_META 상수 + 빈 슬라이드 배열.
Chunk 3에서 26장 데이터 채울 예정."
```

---

### Task 3: 메인 컴포넌트 Shell + 키보드 네비 + 인쇄 모드 (`AiNativePresentation.jsx`)

**Files:**
- Create: `src/AiNativePresentation.jsx`
- Reference: `src/Presentation.jsx:5-25` (palette), `:242-` (Chrome), `:806-820` (renderSlide), `:822-` (ExportDeck), `:893-947` (메인 컴포넌트의 키 네비/슬라이드 라우팅)

본 Task는 spec §6의 컴포넌트 구조를 골격으로 구축한다. 8개 kind 렌더러는 Chunk 2에서 채우고, 본 Task에서는 **`hero` kind만 임시 구현**(스캐폴딩 데이터로 첫 화면 확인).

- [ ] **Step 1: 파일 생성**

```jsx
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

// 나머지 7개 kind는 Chunk 2에서 구현 — 임시 placeholder
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
    // 나머지 7개 kind: Chunk 2에서 추가
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

export { palette };  // Chunk 2 의 kind 렌더러가 동일 파일 내부에서 참조
```

- [ ] **Step 2: 빌드 검증**

```bash
npm run build
```

기대: 0 warning, 0 error. 새 컴포넌트가 라우터에 아직 연결되지 않았으므로 tree-shake되지만 syntax 검증은 됨. 만약 React/router import 경로 오류가 나면 수정.

- [ ] **Step 3: Commit**

```bash
git add src/AiNativePresentation.jsx
git commit -m "AI Native 발표 메인 컴포넌트 Shell 스캐폴딩

src/AiNativePresentation.jsx — Shell + 키보드 네비 + URL 동기화 + ExportDeck.
hero kind 임시 구현 + 나머지 kind는 NotImplementedSlide placeholder.
palette는 Presentation.jsx와 동일 키·값 복제 (spec §5.2)."
```

---

### Task 4: 라우팅 연결 (`/ai-native` + `/ai-native/:slide`)

**Files:**
- Modify: `src/main.jsx`

본 Task가 끝나면 `npm run dev` 후 브라우저에서 `/ai-native` 가 hero 슬라이드 1장을 보여주고 키 네비가 동작한다.

- [ ] **Step 1: main.jsx 수정 (sentinel 기반 — 라인 번호 의존 X)**

`src/main.jsx`에서 다음 3곳을 수정한다.

**1) import 추가**: `import Presentation from "./Presentation.jsx";` 다음 줄에 추가:

```jsx
import AiNativePresentation from "./AiNativePresentation.jsx";
```

**2) `legacyHashRoutes` Map의 `["#/plant-energy", ...]` 다음 줄에 추가**:

```jsx
  ["#/ai-native", "/ai-native"],
```

**3) `redirectLegacyHashRoute` 함수 본문의 `specManagerSlideMatch` 선언 다음 줄에 `aiNativeSlideMatch` 선언을 추가**하고, **`const nextPath = specManagerSlideMatch ? ... : legacyHashRoutes.get(hashPath);` 한 줄을 다음 다중 분기로 교체**:

```jsx
  const aiNativeSlideMatch = hashPath.match(/^#\/ai-native\/(\d+)$/);
  const nextPath = specManagerSlideMatch
    ? `/spec-manager/${specManagerSlideMatch[1]}`
    : aiNativeSlideMatch
    ? `/ai-native/${aiNativeSlideMatch[1]}`
    : legacyHashRoutes.get(hashPath);
```

**4) `createBrowserRouter`의 routes 배열에서 `{ path: "/plant-energy", ... },` 다음 줄에 두 항목 추가** (와일드카드 `path: "*"` 항목보다 위에 위치해야 한다):

```jsx
    { path: "/ai-native", element: <AiNativePresentation /> },
    { path: "/ai-native/:slide", element: <AiNativePresentation /> },
```

- [ ] **Step 2: 시각 검증**

```bash
npm run dev
```

브라우저에서:
- `http://localhost:5173/ai-native` → 스캐폴딩 hero 슬라이드("AI Native: 도구의 교체가 아니라 운영체계의 교체") 노출
- 키 입력: `→` `Space` `PageDown` 누르면 next 시도 (1장뿐이므로 변화 없음 정상)
- `http://localhost:5173/ai-native/1` 도 동일 화면

빌드 검증:
```bash
npm run build
```
기대: 0 warning, 0 error.

- [ ] **Step 3: Commit**

```bash
git add src/main.jsx
git commit -m "AI Native 라우트 /ai-native 연결

main.jsx 라우터에 /ai-native, /ai-native/:slide 추가.
legacy hash route 처리도 spec-manager 패턴 따라 동일하게 지원."
```

---

## Chunk 2: 7개 kind 렌더러 구현 (hero는 이미 Chunk 1에서 임시 구현)

이 chunk는 spec §5.1의 8개 공통 kind 중 hero를 제외한 7개를 `AiNativePresentation.jsx` 내부에 추가한다. 각 렌더러는 **데이터 구조만 정의**되어도 빈 데이터로 렌더 가능해야 한다(defensive: `s.rows ?? []`, `s.stats ?? []` 등). 실제 데이터는 Chunk 3에서 주입.

각 Task는 동일 패턴이다:
1. 컴포넌트 함수 작성 (Tailwind 없으므로 inline style)
2. `renderSlide()` switch 에 `case` 추가
3. `npm run build` 검증
4. Commit

전체 7개를 묶어서 작성하는 것이 효율적이므로 **하나의 큰 commit 으로 처리**한다(아래 Task 5).

---

### Task 5: 나머지 7개 kind 렌더러 일괄 추가

**Files:**
- Modify: `src/AiNativePresentation.jsx` (HeroSlide 다음에 7개 컴포넌트 추가 + renderSlide switch case 7개 추가)

다음 7개 컴포넌트를 `HeroSlide` 다음 줄에 추가한다.

- [ ] **Step 1: QuoteSlide 추가**

```jsx
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
```

- [ ] **Step 2: StatsGridSlide 추가**

`s.stats: [{value, label, delta?}]` 격자 렌더. `s.source` 가 있으면 하단에 작은 글씨로 출처 표기 (spec §7.4 룰).

```jsx
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
```

- [ ] **Step 3: ListRowsSlide 추가** (variant 분기 포함)

가장 다용도. variant 에 따라 prefix/스타일이 약간 달라진다.

```jsx
function ListRowsSlide({ s }) {
  const rows = s.rows ?? [];
  const v = s.variant;
  // variant 별 강조 컬러
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
```

- [ ] **Step 4: CardsGridSlide 추가**

```jsx
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
```

- [ ] **Step 5: CompareRowsSlide 추가**

```jsx
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
```

- [ ] **Step 6: ReferencesSlide 추가**

```jsx
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
```

- [ ] **Step 7: ClosingSlide 추가**

```jsx
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
```

- [ ] **Step 8: 공통 헬퍼 컴포넌트 `SlideHeader`, `SourceFooter` 추가**

위 6개 슬라이드에서 사용. `HeroSlide` 다음에 한 번만 정의.

```jsx
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
```

- [ ] **Step 9: `renderSlide()` switch에 6개 case 추가**

기존 switch 본문을 다음으로 교체:

```jsx
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
```

- [ ] **Step 10: 빌드 + 임시 시각 검증 (kind 렌더 sanity)**

데이터가 비어 있으면 렌더가 안 보여 syntax-only 통과가 되므로, **임시로 7개 placeholder 슬라이드를 `aiNativeSlides.js`의 `slides` 배열에 push** 한 뒤 시각 확인하고 다시 제거한다 (commit 직전에 제거).

`aiNativeSlides.js`의 `slides` 배열을 임시로 다음으로 교체 (Chunk 3에서 다시 채울 예정이므로 일회용 placeholder):

```js
export const slides = [
  { kind: "hero", variant: "title", eyebrow: "임시", title: "Hero kind sanity" },
  { kind: "quote", eyebrow: "임시", quote: "Quote kind sanity" },
  { kind: "stats-grid", eyebrow: "임시", title: "Stats sanity", stats: [{ value: "+50%", label: "임시 지표" }] },
  { kind: "list-rows", variant: "definition", eyebrow: "임시", title: "List sanity", rows: [{ badge: "①", label: "A", body: "임시 행" }] },
  { kind: "cards-grid", eyebrow: "임시", title: "Cards sanity", cards: [{ tag: "01", title: "A", body: "임시", accent: "indigo" }] },
  { kind: "compare-rows", eyebrow: "임시", title: "Compare sanity", headers: ["X", "Y"], rows: [["a", "b"]] },
  { kind: "references", eyebrow: "임시", title: "References sanity", groups: [{ label: "G", items: [{ title: "T", url: "#" }] }] },
  { kind: "closing", message: "Closing sanity", qaQuestions: ["테스트?"] },
];
```

```bash
npm run dev
```
브라우저에서 `/ai-native` → 슬라이드 8장을 화살표 키로 넘기며 시각 확인:
- 1: Hero, 2: Quote, 3: Stats(1개 카드), 4: List, 5: Cards, 6: Compare, 7: References, 8: Closing
- 콘솔 에러 없음

**검증 통과 후 placeholder 배열을 원상복귀** (Chunk 1 Task 2의 초기 스캐폴딩 1장으로 되돌림):

```js
export const slides = [
  {
    kind: "hero",
    variant: "title",
    eyebrow: "사내 발표",
    title: PRESENTATION_META.TITLE,
    subtitle: "(스캐폴딩 — Chunk 3에서 채움)",
  },
];
```

빌드:
```bash
npm run build
```
0 warning, 0 error.

- [ ] **Step 11: Commit (kind 렌더러만, placeholder 데이터는 포함 X)**

```bash
git add src/AiNativePresentation.jsx
git commit -m "AI Native 발표 8개 kind 렌더러 일괄 구현

QuoteSlide / StatsGridSlide / ListRowsSlide / CardsGridSlide /
CompareRowsSlide / ReferencesSlide / ClosingSlide 추가.
공통 헬퍼 SlideHeader · SourceFooter 도입.
renderSlide switch에 case 8개 매핑.
임시 placeholder 데이터로 8 kind 모두 시각 검증 완료(데이터는 Chunk 3에서)."
```

---

## Chunk 3: 26장 슬라이드 데이터 (ACT별 분할)

이 chunk는 `aiNativeSlides.js`의 `slides` 배열을 spec §4의 26장 데이터로 채운다. ACT별로 Task를 나누어 한 번에 검증 가능한 단위로 분할한다.

각 ACT Task는 동일 흐름:
1. 해당 ACT의 슬라이드 객체들을 `slides` 배열에 추가 (이전 ACT의 데이터는 유지)
2. `npm run dev` 로 시각 검증 (각 슬라이드 키 네비로 넘기며 깨짐 여부 확인)
3. `npm run build` 무경고
4. Commit

---

### Task 6: ACT 0 (슬라이드 1·2) 데이터

**Files:**
- Modify: `src/aiNativeSlides.js` (Chunk 1 스캐폴딩의 `slides` 배열을 다음으로 교체)

spec §4의 ACT 0.

- [ ] **Step 1: slides 배열을 다음으로 교체**

```js
export const slides = [
  // ─── ACT 0. Hook (2장) ───────────────────────────────────
  {
    kind: "hero",
    variant: "title",
    eyebrow: "사내 발표 · 2026",
    title: PRESENTATION_META.TITLE,
    subtitle: "기획 · 개발 · 디자인 · 조직이 평가와 피드백 루프 위에서 다시 짜인다",
    tagline: `Claude Sonnet ${MODELS.SONNET} / Opus ${MODELS.OPUS} 시점`,
  },
  {
    kind: "quote",
    eyebrow: "한 줄 메시지",
    quote: "AI 기능을 붙이는 것은 AI Native가 아니다.\nPDLC 전체를 다시 설계하는 것이 AI Native다.",
  },
];
```

- [ ] **Step 2: 검증**

```bash
npm run dev
```
브라우저에서 `/ai-native` → 슬라이드 1(타이틀) 노출 → 화살표 키로 슬라이드 2(quote) 이동 확인.

```bash
npm run build
```
0 warning, 0 error.

- [ ] **Step 3: Commit**

```bash
git add src/aiNativeSlides.js
git commit -m "AI Native 슬라이드 ACT 0 — Hook 2장 추가"
```

---

### Task 7: ACT 1 (슬라이드 3~7) 데이터

spec §4의 ACT 1 — 패러다임. 슬라이드 7은 반증 직시(rev 2 신설).

- [ ] **Step 1: slides 배열에 ACT 1 추가**

ACT 0의 마지막 항목 뒤(`},` 다음)에 다음을 이어붙인다:

```js
  // ─── ACT 1. 왜 지금 — 패러다임 (5장) ──────────────────────
  {
    kind: "cards-grid",
    variant: "paradigm",
    eyebrow: "ACT 1 · 왜 지금",
    title: "Software 1.0 → 2.0 → 3.0",
    subtitle: "코드에서 가중치로, 가중치에서 스펙·프롬프트로",
    cards: [
      { tag: "1.0", title: "코드", body: "사람이 명령어를 직접 작성한다. 규칙·분기·반복.", accent: "indigo", icon: "📜" },
      { tag: "2.0", title: "가중치", body: "사람이 데이터를 모으고, 모델이 규칙을 학습한다.", accent: "pink", icon: "🧠" },
      { tag: "3.0", title: "스펙·프롬프트", body: "사람이 의도를 정의하고, 모델이 의도를 코드로 옮긴다.", accent: "emerald", icon: "✨" },
    ],
    source: { label: "Karpathy — Software 2.0 / 3.0", year: "2017 · 2024" },
    speakerNote: `현재 시점 모델: Claude Sonnet ${MODELS.SONNET}(2026.02) / Opus ${MODELS.OPUS}(2026.04). 6개월 사이 두 차례 세대 업데이트.`,
  },
  {
    kind: "stats-grid",
    eyebrow: "ACT 1 · 실증",
    title: "Anthropic은 자기 회사에서 어떻게 일하는가",
    subtitle: "1년 전 vs 지금",
    stats: [
      { value: "28% → 59%", label: "일일 업무에서 Claude 사용 비율" },
      { value: "+20% → +50%", label: "평균 자체 보고 생산성 향상" },
      { value: "+67%", label: "엔지니어당 일일 PR merge 증가" },
      { value: "14%", label: "100%+ 생산성 향상 보고한 '파워유저' 비율" },
      { value: "9.8 → 21.2", label: "최대 연속 tool call 수 (+116%)" },
      { value: "6.2 → 4.1", label: "Task당 인간 turn 수 (-33%)" },
    ],
    source: {
      label: "How AI Is Transforming Work at Anthropic",
      year: "2025.08 조사",
      disclaimer: `2025.08 시점 데이터(Sonnet ${MODELS.SONNET}·Opus ${MODELS.OPUS} 이전). Anthropic 내부 자체 데이터, LLM 회사 직원의 자기 도구 측정 — 일반화 한계 있음.`,
    },
  },
  {
    kind: "list-rows",
    eyebrow: "ACT 1 · 행동 변화",
    title: "개발자가 Claude로 무엇을 하는가 (6개월 추적)",
    rows: [
      { badge: "기능 구현", label: "14% → 37%", body: "코드 작성 자체보다 '무엇을 만들지'에 시간 이동" },
      { badge: "코드 설계·계획", label: "1% → 10%", body: "AI에게 설계까지 위임/검토 시작" },
      { badge: "디버깅", label: "55%", body: "여전히 일상의 절반은 디버깅. 단 사람이 직접 하지 않음" },
      { badge: "코드 이해", label: "42%", body: "남이 쓴 코드를 빠르게 파악하는 도구로 정착" },
      { badge: "27%", label: "Claude 없으면 안 했을 일", body: "스케일링·실험·작은 도구 — '시도 자체'가 늘어난 영역" },
    ],
    source: { label: "How AI Is Transforming Work at Anthropic", year: "2025.08" },
  },
  {
    kind: "list-rows",
    variant: "definition",
    eyebrow: "ACT 1 · 정의",
    title: "AI Native의 4가지 조건",
    intro: "AI Native는 도구가 아니다. 다음 4가지가 모두 갖춰진 운영체계를 말한다.",
    rows: [
      { badge: "①", label: "AI가 일할 구조 설계", body: "프롬프트가 아니라 컨텍스트·스펙·태스크 라이브러리" },
      { badge: "②", label: "평가·관찰성 내장", body: "Eval과 로그는 사후가 아니라 1급 시민" },
      { badge: "③", label: "피드백 루프", body: "실패/이슈를 자산으로 축적해 다음 사이클에 반영" },
      { badge: "④", label: "인간은 검증·책임", body: "사람의 시간은 생성에서 검증·결정·책임으로 이동" },
    ],
  },
  {
    kind: "list-rows",
    variant: "counterevidence",
    eyebrow: "ACT 1 · 반증 직시",
    title: "그런데 이런 데이터도 있다",
    intro: "도발만 늘어놓는 발표는 청중에게 신뢰를 잃는다. 반증을 먼저 본다.",
    rows: [
      {
        badge: "학습 격차",
        label: "AI 그룹 −17%p",
        body: "AI 보조로 학습한 신입 개발자 그룹은 평가에서 50% — 손코딩 그룹 67%. p=0.01. 특히 디버깅 능력 격차가 가장 컸다.",
        source: { label: "Anthropic — AI Assistance & Coding Skills", year: "2025" },
      },
      {
        badge: "조직 압박",
        label: "Productivity Panic",
        body: "AI 도입이 개발 속도를 올린 만큼 '더 많이 짜라'는 조직 압박도 함께 올라간다.",
        source: { label: "Bloomberg", year: "2026.02" },
      },
      {
        badge: "일반화 한계",
        label: "Anthropic 데이터는 Anthropic의 데이터",
        body: "LLM 회사 직원이 자기 도구로 측정한 데이터를 일반 개발팀에 그대로 적용하는 것 자체가, 이 발표가 비판하려는 '도발적 일반화'다.",
      },
    ],
    outro: "그래서 도구를 늘리는 것만으로는 부족하다 — 운영체계의 재설계가 필요하다.",
  },
```

- [ ] **Step 2: 검증**

`npm run dev` 후 슬라이드 1 → 7번까지 화살표 키로 넘기며 시각 확인:
- 3번: 3개 카드(Software 1.0/2.0/3.0)
- 4번: 6개 stat-grid + 하단 source 출처
- 5번: 5개 list rows + badge
- 6번: 정의 4가지 ①~④
- 7번: 반증 3건 + outro 이탤릭

`npm run build` 0 warning.

- [ ] **Step 3: Commit**

```bash
git add src/aiNativeSlides.js
git commit -m "AI Native 슬라이드 ACT 1 — 패러다임 5장 추가 (반증 슬라이드 7 포함)"
```

---

### Task 8: ACT 2 (슬라이드 8~12) 데이터

spec §4의 ACT 2 — 페르소나.

- [ ] **Step 1: slides 배열에 ACT 2 추가**

ACT 1 마지막 항목 뒤에 이어붙인다:

```js
  // ─── ACT 2. 페르소나별 변화 (5장) ────────────────────────
  {
    kind: "cards-grid",
    variant: "personas",
    eyebrow: "ACT 2 · 페르소나",
    title: "보던 지표가 다 바뀐다",
    subtitle: "5개 페르소나, 5개의 역할 변화",
    cards: [
      { tag: "기획자", title: "AI 행동 설계자", body: "기능 명세 → 실패 시 UX·신뢰도·전환율", accent: "indigo", icon: "🎯" },
      { tag: "개발자", title: "AI 시스템 오케스트레이터", body: "코드 작성 → eval pass rate·latency·cost", accent: "emerald", icon: "⚡" },
      { tag: "디자이너", title: "Human-AI Interaction 설계자", body: "화면 설계 → 수정률·중단률·혼란 지점", accent: "pink", icon: "🎨" },
      { tag: "조직장", title: "AI-native 운영체계 설계자", body: "납기 관리 → 배포 빈도·결함률·학습 속도", accent: "amber", icon: "🏛" },
      { tag: "경영진", title: "AI 전환 포트폴리오 오너", body: "DX 후원 → 매출·비용·리스크·moat", accent: "violet", icon: "📈" },
    ],
  },
  {
    kind: "stats-grid",
    variant: "persona-quant",
    eyebrow: "ACT 2 · 개발자 심층",
    title: "개발자(FE)는 Claude로 무엇을 하나",
    subtitle: "코드 작성자 → AI 시스템 오케스트레이터",
    stats: [
      { value: "55%", label: "일일 사용: 디버깅" },
      { value: "42%", label: "일일 사용: 코드 이해" },
      { value: "37%", label: "일일 사용: 기능 구현" },
      { value: "10%", label: "일일 사용: 코드 설계·계획" },
    ],
    source: { label: "How AI Is Transforming Work at Anthropic", year: "2025.08" },
  },
  {
    kind: "list-rows",
    variant: "persona-qual",
    eyebrow: "ACT 2 · 기획자 심층",
    title: "기획자: 기능 명세자 → AI 행동 설계자",
    intro: "(1차 자료에 직군별 분해 데이터 없음 — 정성 사례 중심)",
    rows: [
      { badge: "핵심 관심", label: "문제 정의 · AI 사용 가치 · 실패 시 UX", body: "AI가 잘못 답할 때 사용자가 빠져나갈 길까지 설계" },
      { badge: "버려야 할 KPI", label: "스토리당 산출량", body: "코드 자동 생성으로 의미 약화" },
      { badge: "새 KPI", label: "과업 성공률 · 재시도율 · 신뢰도 · 전환율", body: "AI의 출력이 사용자 의도와 얼마나 맞는가" },
    ],
  },
  {
    kind: "list-rows",
    variant: "persona-qual",
    eyebrow: "ACT 2 · 디자이너 심층",
    title: "디자이너: 화면 설계자 → Human-AI Interaction 설계자",
    intro: "(직군 분해 데이터 부재. 정성 사례)",
    rows: [
      { badge: "핵심 관심", label: "사용자 통제감 · 설명 가능성 · 피드백 채널", body: "AI 답을 받기 전·중·후의 인터랙션" },
      { badge: "새 KPI", label: "수정률 · 중단률 · 만족도 · 혼란 지점", body: "사용자가 AI의 답을 얼마나 받아들이는가" },
      { badge: "조직 변화", label: "디자인 시스템 = AI도 따르는 명세", body: "스타일 가이드가 모델 입력으로 들어가는 시대" },
    ],
  },
  {
    kind: "compare-rows",
    eyebrow: "ACT 2 · 학습 곡선",
    title: "고숙련 사용자는 같은 도구로 더 잘한다",
    subtitle: "Anthropic Economic Index — Learning Curves",
    headers: ["지표", "저숙련", "고숙련(6+개월)"],
    rows: [
      ["대화당 성공률", "기준선", "+10%p"],
      ["Opus(고성능) 사용 비중 (개발자)", "—", "34%"],
      ["Opus 사용 비중 (튜터)", "—", "12%"],
      ["고가 작업($10↑) 시 Opus 선택", "—", "+1.5%p (App) / +2.8%p (API)"],
    ],
    source: {
      label: "Anthropic Economic Index — Learning Curves",
      year: "2026.03",
      disclaimer: "학습 곡선 자체가 KPI다 — 도구 도입보다 사용 습관이 결정한다.",
    },
  },
```

- [ ] **Step 2: 검증**

`npm run dev` 후 슬라이드 8~12 시각 확인. 슬라이드 8의 카드 격자, 9의 stats, 12의 표 (3컬럼) 깨짐 없음.

`npm run build` 0 warning.

- [ ] **Step 3: Commit**

```bash
git add src/aiNativeSlides.js
git commit -m "AI Native 슬라이드 ACT 2 — 페르소나 5장 추가"
```

---

### Task 9: ACT 3 (슬라이드 13~19) 데이터

spec §4의 ACT 3 — 5단계 사이클(컨텍스트→실행→검증×2→반영→학습).

- [ ] **Step 1: slides 배열에 ACT 3 추가**

ACT 2 마지막 항목 뒤에 이어붙인다:

```js
  // ─── ACT 3. 5단계 사이클 — 본체 (7장) ────────────────────
  {
    kind: "cards-grid",
    variant: "cycle-overview",
    eyebrow: "ACT 3 · 본체",
    title: "AI Native 5단계 사이클",
    subtitle: "컨텍스트 → 실행 → 검증 → 반영 → 학습",
    cards: [
      { tag: "01", title: "컨텍스트", body: "AI가 일할 구조를 준비한다", accent: "indigo", icon: "📚" },
      { tag: "02", title: "실행", body: "재현 가능한 단위로 일을 시킨다", accent: "emerald", icon: "⚙️" },
      { tag: "03", title: "검증", body: "출력이 의도와 일치하는지 잰다", accent: "amber", icon: "🔬" },
      { tag: "04", title: "반영", body: "통과한 것만 코드에 들어간다", accent: "pink", icon: "🚦" },
      { tag: "05", title: "학습", body: "실패는 다음 사이클의 자산이 된다", accent: "violet", icon: "🔁" },
    ],
  },
  {
    kind: "list-rows",
    variant: "cycle-step",
    eyebrow: "ACT 3 · 01 컨텍스트",
    title: "프롬프트가 아니라 컨텍스트 엔지니어링",
    rows: [
      { badge: "표준", label: "Model Context Protocol (MCP, 2024.11)", body: "AI에 컨텍스트를 주입하는 산업 표준" },
      { badge: "프로세스", label: "Spec Kit / Superpowers spec/plan", body: "프롬프트가 아니라 재사용 가능한 문서 라이브러리" },
      { badge: "우리 팀", label: "docs/superpowers/specs · plans", body: "이 발표의 spec/plan도 같은 구조로 저장되어 있다" },
    ],
    outro: "한 번 쓴 프롬프트는 휘발된다. spec은 자산이 된다.",
  },
  {
    kind: "list-rows",
    variant: "cycle-step",
    eyebrow: "ACT 3 · 02 실행",
    title: "Anthropic이 제안하는 5가지 에이전트 워크플로",
    intro: "복잡한 자율 에이전트보다 합성 가능한 워크플로가 더 자주 정답이다.",
    rows: [
      { badge: "1", label: "Prompt Chaining", body: "한 LLM 호출의 출력이 다음 호출의 입력" },
      { badge: "2", label: "Routing", body: "입력을 분류해 적합한 후속 처리로 분기" },
      { badge: "3", label: "Parallelization", body: "독립 가능한 부분을 동시에 호출 후 합성" },
      { badge: "4", label: "Orchestrator-Workers", body: "총괄 LLM이 sub-task를 동적으로 분배" },
      { badge: "5", label: "Evaluator-Optimizer", body: "한 모델은 만들고, 다른 모델은 평가·교정" },
    ],
    source: { label: "Anthropic — Building Effective Agents", year: "2024.12" },
    outro: "발표에서는 라우팅·오케스트레이터·Evaluator 3개를 자세히 본다.",
  },
  {
    kind: "list-rows",
    variant: "cycle-step",
    eyebrow: "ACT 3 · 03 검증 (1/2)",
    title: "TDD를 넘어 Eval-Driven Development",
    rows: [
      { badge: "Grader 3종", label: "코드 · 모델 · 휴먼", body: "정답 비교가 가능한 곳은 코드, 뉘앙스는 모델, 모델 보정은 휴먼" },
      { badge: "시작 규모", label: "20~50 task", body: "수백 개부터 만들지 말 것. 실패에서 시작해 키워간다" },
      { badge: "운영", label: "Living artifact", body: "Eval은 한 번 만들고 끝나는 자산이 아니다 — 계속 업데이트" },
    ],
    source: { label: "Anthropic — Demystifying Evals for AI Agents", year: "2026.01" },
  },
  {
    kind: "compare-rows",
    variant: "eval-metric",
    eyebrow: "ACT 3 · 03 검증 (2/2)",
    title: "pass@k vs pass^k — 무엇을 선택할 것인가",
    headers: ["메트릭", "정의", "쓰는 상황"],
    rows: [
      ["pass@k", "k번 시도 중 1번이라도 성공할 확률", "한 번만 맞으면 되는 작업 — 코드 생성, 탐색"],
      ["pass^k", "k번 시도 모두 성공할 확률", "고객 노출 에이전트 — 일관된 신뢰성"],
      ["타입/린트/단위/E2E", "결정적 게이트", "전통적 코드 품질 — 우회 불가"],
      ["골든셋 / LLM-as-judge", "비결정 게이트", "출력 품질 — 모델 grader가 휴먼을 모사"],
    ],
    source: { label: "Anthropic — Demystifying Evals", year: "2026.01" },
  },
  {
    kind: "list-rows",
    variant: "cycle-step",
    eyebrow: "ACT 3 · 04 반영",
    title: "코드 리뷰의 근본 재설계",
    intro: "하루 생성되는 모든 코드를 사람이 다 읽는 것은 불가능하다.",
    rows: [
      { badge: "자동 게이트", label: "Evaluator-Optimizer 패턴", body: "통과 못 한 변경은 휴먼 큐에 도달하지 않는다" },
      { badge: "샘플링", label: "위험 가중 리뷰", body: "보안/성능/외부 노출 코드는 강한 리뷰, 나머지는 자동" },
      { badge: "리뷰어 페르소나", label: "AI 동료 리뷰어를 디폴트로", body: "사람 리뷰는 결정 사항에만, 형식 리뷰는 AI" },
    ],
  },
  {
    kind: "list-rows",
    variant: "cycle-step",
    eyebrow: "ACT 3 · 05 학습",
    title: "실패는 자산이다",
    intro: "AI가 자주 틀리는 곳은 다음 spec/plan/eval의 입력이 된다.",
    rows: [
      { badge: "Failure Mode 라이브러리", label: "팀 단위로 누적", body: "프로젝트별 anti-pattern을 코드/문서로 축적" },
      { badge: "피드백 루프", label: "메모리 시스템처럼", body: "이슈→Eval→Spec→Plan 으로 다음 사이클에 자동 반영" },
      { badge: "신입 학습", label: "AI 보조의 -17%p 격차", body: "별도의 학습 모드 — 처음에는 일부러 손으로, 점차 위임" },
    ],
    outro: "이 항목은 슬라이드 7 반증에 대한 우리 워크플로의 처방이다.",
  },
```

- [ ] **Step 2: 검증**

`npm run dev` 후 슬라이드 13~19 시각 확인. 특히 슬라이드 17(compare-rows 4행 3컬럼) 깨짐 없음, 슬라이드 19의 outro 노출.

`npm run build` 0 warning.

- [ ] **Step 3: Commit**

```bash
git add src/aiNativeSlides.js
git commit -m "AI Native 슬라이드 ACT 3 — 5단계 사이클 7장 추가"
```

---

### Task 10: ACT 4 (슬라이드 20~23) 데이터

spec §4의 ACT 4 — 본인 사례.

- [ ] **Step 1: slides 배열에 ACT 4 추가**

```js
  // ─── ACT 4. 본인 사례 (4장) ──────────────────────────────
  {
    kind: "hero",
    variant: "case-intro",
    eyebrow: "ACT 4 · 사례",
    title: "실증: 우리 팀이 운영 중인 AI Native 워크플로",
    subtitle: "Claude Code + Superpowers + 멀티에이전트",
    tagline: "이 발표 자체도 같은 워크플로로 만들어졌다",
  },
  {
    kind: "cards-grid",
    variant: "case-flow",
    eyebrow: "ACT 4 · 사이클",
    title: "spec → plan → impl → review",
    subtitle: "각 단계가 별도의 Superpowers 스킬과 산출물에 매핑된다",
    cards: [
      { tag: "01", title: "spec", body: "brainstorming 스킬로 합의된 디자인 문서. docs/superpowers/specs/", accent: "indigo", icon: "📐" },
      { tag: "02", title: "plan", body: "writing-plans 스킬로 분해된 구현 계획. Task 단위 체크박스", accent: "emerald", icon: "🗂" },
      { tag: "03", title: "impl", body: "subagent-driven-development 로 서브에이전트가 Task별 실행", accent: "amber", icon: "⚙️" },
      { tag: "04", title: "review", body: "spec-document-reviewer / receiving-code-review 로 검증 라운드", accent: "pink", icon: "🔍" },
    ],
  },
  {
    kind: "cards-grid",
    variant: "case-multiagent",
    eyebrow: "ACT 4 · 협업 모델",
    title: "PM · 디자이너 · 개발 3인조",
    subtitle: "주작업 / 동료 리뷰어 / 감독자 — 인간이 직접 설계한 페르소나",
    cards: [
      { tag: "PM", title: "스펙 합의 · 리스크 관리", body: "지시자 의도에 수렴. 단독으로 스펙 변경 금지", accent: "indigo", icon: "🎯" },
      { tag: "디자이너", title: "IA · 컴포넌트 · 접근성", body: "만들면서 함께 다듬는다", accent: "pink", icon: "🎨" },
      { tag: "개발", title: "Primary · Reviewer · Supervisor", body: "리뷰 없이 완료 선언 금지", accent: "emerald", icon: "⚡" },
    ],
    source: { label: "기존 사내 발표 자료", year: "→ /multi-agent" },
  },
  {
    kind: "list-rows",
    variant: "case-lessons",
    eyebrow: "ACT 4 · 교훈",
    title: "운영하며 배운 것 3가지",
    intro: "도구가 아니라 운영체계로 정착하면 다음 3가지가 보인다.",
    rows: [
      { badge: "①", label: "spec 라이브러리는 자산이다", body: "한 번 합의된 의도는 다음 작업의 입력이 된다. 발표 산출물도 동일 디렉터리에 누적." },
      { badge: "②", label: "리뷰어 페르소나는 의무다", body: "주작업 → 동료 리뷰어 → 감독자 흐름이 없으면 Critical을 놓친다." },
      { badge: "③", label: "피드백 루프는 메모리 시스템이다", body: "실패는 다음 spec의 안티패턴 항목으로 들어가야 비로소 학습이다." },
    ],
    outro: "팀이 다르면 페르소나 명만 바꿔도 된다. 구조가 일반화 가능하다.",
  },
```

- [ ] **Step 2: 검증**

`npm run dev` 후 슬라이드 20~23. 슬라이드 20은 hero, 21·22는 cards-grid(4/3 columns), 23은 list-rows.

`npm run build` 0 warning.

- [ ] **Step 3: Commit**

```bash
git add src/aiNativeSlides.js
git commit -m "AI Native 슬라이드 ACT 4 — 본인 사례 4장 추가"
```

---

### Task 11: ACT 5 (슬라이드 24~26) 데이터 + 최종 검증

spec §4의 ACT 5 — 마무리.

- [ ] **Step 1: slides 배열에 ACT 5 추가**

```js
  // ─── ACT 5. 시작 가이드 + 마무리 (3장) ─────────────────
  {
    kind: "list-rows",
    variant: "roadmap-org",
    eyebrow: "ACT 5 · 로드맵",
    title: "조직 액션으로 본 도입 로드맵",
    intro: "도구·기술은 본문에서 이미 다뤘다. 누가 / 언제 / 무엇을 측정할지만 남았다.",
    rows: [
      { badge: "이번 주", label: "spec owner 지정", body: "우리 팀 최초 spec 1건을 docs/ 하위에 commit — 컨텍스트 단계의 출발" },
      { badge: "이번 분기", label: "Eval 베이스라인 측정", body: `20~50개 task로 첫 pass@k / pass^k 베이스라인 + 모델 라우팅(Sonnet ${MODELS.SONNET} 기본 + Opus ${MODELS.OPUS} 어려운 작업)` },
      { badge: "6개월", label: "Failure mode 누적 + 사전 동료 청취 정착", body: "베이스라인 측정 후 N 확정. 사전 동료 청취 1회를 모든 발표/큰 작업의 디폴트로" },
    ],
    outro: "본문 매핑: 컨텍스트(13) · 실행(15) · 검증(16·17) · 반영(18) · 학습(19).",
  },
  {
    kind: "references",
    eyebrow: "ACT 5 · 참고",
    title: "References",
    groups: [
      {
        label: "Anthropic 1차 자료",
        items: [
          { title: "How AI Is Transforming Work at Anthropic", url: "https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic" },
          { title: "Economic Index — Learning Curves (2026.03)", url: "https://www.anthropic.com/research/economic-index-march-2026-report" },
          { title: "Building Effective Agents (2024.12)", url: "https://www.anthropic.com/research/building-effective-agents" },
          { title: "Demystifying Evals for AI Agents (2026.01)", url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents" },
          { title: "AI Assistance & Coding Skills", url: "https://www.anthropic.com/research/AI-assistance-coding-skills" },
          { title: "Claude Opus 4.7 / Sonnet 4.6", url: "https://www.anthropic.com/claude/opus" },
        ],
      },
      {
        label: "보조 자료",
        items: [
          { title: "Karpathy — Software 2.0", url: "https://karpathy.medium.com/software-2-0-a64152b37c35" },
          { title: "Bloomberg — Productivity Panic of 2026", url: "https://www.bloomberg.com/news/articles/2026-02-26/ai-coding-agents-like-claude-code-are-fueling-a-productivity-panic-in-tech" },
          { title: "Hamel Husain — Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/" },
          { title: "OWASP LLM Top 10", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/" },
          { title: "EU AI Act", url: "https://artificialintelligenceact.eu/" },
          { title: "NIST AI RMF", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
        ],
      },
      {
        label: "사내 자료",
        items: [
          { title: "멀티에이전트 개발 프로세스", url: "/multi-agent" },
          { title: "스펙매니저 소개 발표", url: "/spec-manager" },
          { title: "이 발표 자체의 spec/plan", url: "" },
        ],
      },
    ],
  },
  {
    kind: "closing",
    message: "AI Native는 도구의 교체가 아니라\n운영체계의 교체다.",
    qaQuestions: [
      "우리 팀의 첫 spec은 무엇이 될 수 있을까요?",
      "우리는 어떤 실패를 자산화하지 않고 흘려보내고 있나요?",
      "사람이 검증해야 할 것과 AI에게 맡길 것의 경계는 어디인가요?",
    ],
  },
];
```

- [ ] **Step 2: 전체 26장 시각 검증 (리허설 1회 시뮬레이션)**

`npm run dev` 후 브라우저에서 `/ai-native` 시작 → 화살표 키로 26장 끝까지 전수 확인:

| 체크 | 기준 |
|---|---|
| 슬라이드 수 | 1/26 → 26/26 (카운터 일치) |
| 키 네비 | →·Space·PageDown·←·PageUp·Home·End 모두 동작 |
| URL 동기화 | `/ai-native` ↔ `/ai-native/2` 등 동기화 확인 |
| 정량 슬라이드 source | 4·5·9·12·15·16·17 슬라이드 하단 출처 노출 |
| 콘솔 에러 | 없음 |

타이머로 슬라이드당 50~80초 페이싱이 가능한지 자체 점검. 발표 전 실제 리허설은 별도 단계(§9 검증 기준).

- [ ] **Step 3: 빌드**

```bash
npm run build
```
0 warning, 0 error.

- [ ] **Step 4: Commit**

```bash
git add src/aiNativeSlides.js
git commit -m "AI Native 슬라이드 ACT 5 — 마무리 3장 추가, 26장 데이터 완비"
```

---

## Chunk 4: 라우팅·홈카드·다운로드·검증

이 chunk는 spec §6의 사용자 진입점과 §8의 다운로드 동작, §9의 검증 기준을 마무리한다.

---

### Task 12: 홈 메뉴 카드 추가 (`App.jsx`)

**Files:**
- Modify: `src/App.jsx`:323-501 의 `menus` 배열 (HomePage 컴포넌트 내부)

- [ ] **Step 1: presentationDownloads.aiNative 추가**

`src/downloadUtils.js`의 `specManager: { ... },` 객체 다음 줄에 추가:

```js
  aiNative: {
    html: "/ai-native?export=html",
    pdf: "/ai-native?print=1",
    filename: "ai-native-presentation.html",
  },
```

- [ ] **Step 2: App.jsx 홈 카드 항목 추가**

`src/App.jsx`의 `HomePage` 컴포넌트 안 `menus` 배열에서 **"스펙매니저 발표 자료" 항목 다음**(배열 닫는 `]` 직전)에 추가:

```js
    {
      href: "/ai-native",
      title: "AI Native: 운영체계의 교체",
      subtitle: "도구가 아니라 PDLC 전체의 재설계. Anthropic 1차 자료로 실증.",
      accent: palette.blue,
      meta: "발표 슬라이드 · 26장 · 25분(±5)",
      external: false,
      downloads: presentationDownloads.aiNative,
    },
```

> 색 결정 근거(Spec 해석 노트 참조): App.jsx의 home palette는 Presentation.jsx의 slide palette와 별개. 기존 카드들과 차별 + 발표류 두 카드(스펙매니저=green, 멀티에이전트=blue, AI Native=blue 계열은 같은 발표 계열 묶음)로 시각 그룹화. `palette.blue`(=`#315f82`) 사용. spec §9의 "palette.indigo" 표현은 슬라이드 palette를 가리키는 것으로 해석.

- [ ] **Step 3: 시각 검증**

`npm run dev` 후:
- `/` 진입 시 홈 카드 6개째 노출 (amber 색상)
- 카드 클릭 → `/ai-native` 이동
- 카드 하단 "PDF 저장" / "HTML 다운로드" 두 버튼 노출 (data-export-hidden 속성으로 export 시 숨김 동작은 다음 Task에서 검증)

```bash
npm run build
```
0 warning.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/downloadUtils.js
git commit -m "AI Native 발표 홈 카드 + 다운로드 엔트리 추가

App.jsx 홈 메뉴에 AI Native 카드 1개 추가(accent: amber).
downloadUtils.js presentationDownloads.aiNative 엔트리 추가
— html/pdf/filename 3필드 모두 보유로 다운로드 분기 정상."
```

---

### Task 13: PDF 인쇄 / HTML 다운로드 동작 검증

본 Task는 코드 변경이 없다 — 기존 패턴이 자동 적용되는지 시각 검증만 수행.

- [ ] **Step 1: PDF 저장 동작 확인**

`npm run dev` 후:
- `/` 홈 → AI Native 카드의 "PDF 저장" 클릭 → `/ai-native?print=1` 새 창
- 새 창에서 ExportDeck 컴포넌트가 26장을 펼친 단일 페이지로 렌더링
- 약 900ms 후 자동 `window.print()` 호출되어 OS 인쇄 다이얼로그 노출
- 인쇄 미리보기에서 슬라이드들이 `pageBreakAfter: always`로 페이지 분할되어 보임

- [ ] **Step 2: HTML 다운로드 동작 확인**

`/` 홈 → AI Native 카드의 "HTML 다운로드" 클릭 → `downloadStaticHtml("/ai-native?export=html", "ai-native-presentation.html")` 호출

기대: `ai-native-presentation.html` 파일이 다운로드되고, 해당 파일을 별도 브라우저에서 열면 26장 펼친 형태로 렌더링.

만약 동작 안 하면 디버깅:
- `aiNative` 엔트리에 `filename` 필드 존재 확인
- App.jsx 카드의 onClick 핸들러가 `if (menu.downloads.filename) downloadStaticHtml(...)` 분기를 타는지 확인 (App.jsx:476-479 기존 패턴)

- [ ] **Step 3: 라이브 링크 export 동작 확인 (rev 3 New Info)**

슬라이드 22 (case-multiagent) 의 source.url = "/multi-agent" 는 발표 모드에서는 클릭 가능, **인쇄·HTML export 시에는 데드 링크**일 수 있다.

ExportDeck 렌더링 시:
- 인쇄: 텍스트로 보임 (OK)
- HTML 다운로드 후 별도 컴퓨터에서 열기: 동작 안 함 (예상된 한계 — 다른 라우트는 외부 파일에 존재하지 않음)

이 한계는 spec §11(비결정 사항)에 이미 명시됨. **현 시점에서는 발표용 디바이스에서만 라이브 링크 동작한다고 가정**.

- [ ] **Step 4: 검증 결과를 메모 (커밋 없음)**

이 Task는 코드 변경이 없으므로 commit 하지 않는다. 검증 결과는 다음 Task의 최종 체크리스트 검증에 통합된다.

---

### Task 14: spec §9 수용 조건 12개 항목 통과 검증

spec §9의 검증 기준 12개 항목을 순서대로 확인하고 통과 여부를 기록한다. 통과 못 한 항목은 즉시 수정 후 재검증.

- [ ] **Step 1: 자동 검증 항목 (5개)**

| 항목 | 확인 명령/방법 | 통과 기준 |
|---|---|---|
| 라우팅 | `npm run dev` 후 `/ai-native` 접속 | 슬라이드 1 첫 화면 |
| 슬라이드 수 | 카운터에서 `/26` 확인 | 26 정확히 |
| 빌드 | `npm run build` | 0 warning 0 error |
| 출처 표기 | dev 서버 콘솔 확인 (Task 2의 import.meta.env.DEV warn) | `[aiNativeSlides] source 누락:` 로그 없음 |
| 1차 자료 검증 | `git log -- docs/superpowers/specs/2026-05-19-ai-native-sources.md` | commit 존재 |

**출처 표기 검증 방법 (ESM 호환)**:
Task 2 Step 1에서 `aiNativeSlides.js` 하단에 `import.meta.env.DEV` 가드의 console.warn 코드를 이미 넣었다. `npm run dev` 실행 후 브라우저 콘솔에서 다음을 확인:

```
[aiNativeSlides] source 누락: …  ← 이 로그가 출력되면 누락 있음
(아무 로그 없음)                  ← 통과
```

만약 빌드 시 정적 검증도 필요하면(선택), 임시 검증 스크립트로:

```bash
node --input-type=module -e "
import('./src/aiNativeSlides.js').then(({ slides }) => {
  const need = new Set(['stats-grid', 'compare-rows']);
  const needVar = new Set(['counterevidence', 'cycle-step', 'persona-quant', 'eval-metric']);
  const miss = [];
  slides.forEach((s, i) => {
    const x = need.has(s.kind) || (s.kind === 'list-rows' && needVar.has(s.variant));
    if (x && !s.source) miss.push(\`#\${i+1} \${s.kind}\${s.variant ? '/' + s.variant : ''}\`);
  });
  console.log(miss.length === 0 ? '✓ 출처 표기 100% OK' : '✗ 누락: ' + miss.join(', '));
}).catch(e => { console.error(e); process.exit(1); });
"
```
(node 18+ 필요. 동작하면 dev warn과 동일 결과여야 함)

- [ ] **Step 2: 시각 검증 항목 (4개)**

| 항목 | 확인 방법 | 통과 기준 |
|---|---|---|
| 네비게이션 | 슬라이드 1에서 →·Space·PageDown·←·PageUp·Home·End 키 | 모두 동작 |
| 홈 노출 | `/` 진입 | AI Native 카드 1개 노출, accent indigo/amber |
| 다운로드 | PDF 저장 + HTML 다운로드 버튼 | 양쪽 동작 (Task 13 결과 인계) |
| 인쇄 | `?print=1` 진입 | 26장 펼침, `data-export-hidden` 요소 미노출 |

- [ ] **Step 3: palette 키 일치 검증 (sentinel 기반 블록 추출)**

spec §9 요구: Presentation.jsx 의 palette 키 diff = 0.

`const palette = {` 부터 가장 가까운 `};` 까지의 블록만 정확히 추출하여 키 비교:

```bash
extract_palette_keys() {
  awk '/^const palette = \{/,/^\};/' "$1" \
    | grep -E "^\s+[a-zA-Z]+:" \
    | awk -F: '{print $1}' \
    | sed 's/^[[:space:]]*//' \
    | sort
}

extract_palette_keys src/Presentation.jsx > /tmp/pres-keys.txt
extract_palette_keys src/AiNativePresentation.jsx > /tmp/ai-keys.txt
diff /tmp/pres-keys.txt /tmp/ai-keys.txt && echo "✓ palette 키 동일" || echo "✗ palette 키 diff 있음"
```

기대: "✓ palette 키 동일" 출력 (diff empty). 만약 diff가 있으면 `AiNativePresentation.jsx`의 palette 객체 키를 보정한다.

> 참고: `extract_palette_keys`는 함수이므로 새 쉘 세션마다 정의 필요. zsh/bash 양쪽 호환.

- [ ] **Step 4: 수동 검증 항목 (3개)**

| 항목 | 방법 | 통과 기준 |
|---|---|---|
| 한국어 검수 | 작성자 본인 + peer 1인 sign-off | 오탈자/문장 일관성 확인 |
| 사전 동료 청취 | Act 4(슬라이드 20~23) 동료 1인에게 사전 청취 | "자랑처럼 들리지 않음" confirm/adjust |
| 리허설 시간 | 타이머로 1회 리허설 | `TARGET_MINUTES = 25` ±5분 내 완주 |

이 3개 항목은 **본 plan 외부 활동**으로 발표 직전에 수행한다. 통과 못 한 경우 슬라이드 추가 압축(가장 정보 밀도가 낮은 슬라이드부터 단어 줄이기) 또는 deepdive 항목 추가 축소.

- [ ] **Step 5: 검증 통과 commit**

검증 통과 후 (수정사항이 있었다면 수정한 뒤) 다음 커밋으로 plan 완료를 마킹한다.
**Task 13의 PDF/HTML 다운로드 검증 결과도 본 commit 메시지에 명시**하여 git history에 추적성 확보.

```bash
git commit --allow-empty -m "AI Native 발표 구현 완료 — spec §9 수용 조건 통과

검증 결과:
- 자동 5: 라우팅 / 26장 카운터 / 빌드 0warn / dev warn 로그 없음 / sources.md commit 존재
- 시각 4: 키 네비 7종 / 홈 카드 노출 / PDF 인쇄 (?print=1 펼침 + 자동 인쇄) / HTML 다운로드 (filename 분기 정상)
- palette: extract_palette_keys diff = 0
- 수동 게이트 명시: 한국어 검수 2인 sign-off / Act 4 사전 동료 청취 / 25분 ±5 리허설"
```

---

## 작업 완료 후

본 plan 의 모든 Task 통과 시:
1. 사용자에게 완료 보고 — `/ai-native` 경로 + 다운로드 동작 확인 요청
2. 발표 전 §9의 수동 검증 게이트(한국어 검수 / 동료 청취 / 리허설) 수행 후 발표 진행
3. 발표 후 발견된 미진 항목은 spec §11의 비결정 사항에 추가하여 후속 리비전 사이클(palette 공유 모듈 추출, URL 슬라이드 동기화, 모바일 반응형 등)에 반영

---

## 참고: 본 plan의 Task 의존성

```
Task 1 (sources.md) ─┐
Task 2 (slides stub) ─┤
Task 3 (Shell)       ─┴─→ Task 4 (라우팅) ─→ Task 5 (8 kinds) ─┐
                                                                ↓
                          Task 6 → 7 → 8 → 9 → 10 → 11 (데이터 ACT 0~5)
                                                                ↓
                                  Task 12 (홈 카드) ─→ Task 13 (다운로드 검증) ─→ Task 14 (최종 검증)
```

서브에이전트 병렬화 가능 구간:
- Task 1, 2, 3은 서로 독립 → 병렬
- Task 6~11은 순차 (slides 배열에 누적)
- 나머지는 의존성 순서대로
