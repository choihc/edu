---
title: AI Native 발표 슬라이드 — 디자인 스펙
date: 2026-05-19
status: draft (rev 3)
owner: Hyeoncheol Choi
audience: 사내 개발팀 (FE/BE 시니어 포함)
duration: 25분 (±5분)
deliverable: React 라우트 `/ai-native` (단일 SPA 슬라이드 모드) + PDF/HTML 다운로드
revision: rev 1 (초안) → rev 2 (1차 리뷰 반영) → rev 3 (2차 리뷰 반영 — kind 8개로 통일, ACT 페이싱 표, 상수 단일 출처, sources 부록 위치 확정, §10 등급 동결)
---

# AI Native 발표 슬라이드 — 디자인 스펙

## 1. Executive Summary

사내 개발팀 대상 **약 25분 분량(±5분, 26장)** 의 발표 슬라이드를 React 라우트 `/ai-native` 로 구현한다. 핵심 메시지는 **"AI Native는 도구의 교체가 아니라 운영체계의 교체다"** 라는 도발적 주장이며, 이를 **Anthropic 1차 자료(2025–2026 최신)** 로 실증하고, 본인 팀이 운영 중인 **Superpowers spec/plan 워크플로 + 멀티에이전트 페르소나** 로 사내 사례 차별화를 만든다.

도발 메시지에 대한 반증 데이터(AI 그룹 학습 격차 -17%p 등)는 ACT 1 마지막에 "반증 직시" 슬라이드(슬라이드 7)로 정면 노출하여 체리피킹 비판을 차단한다.

데이터 모델은 **8개 공통 kind + variant** 로 통합(`hero` · `quote` · `stats-grid` · `list-rows` · `cards-grid` · `compare-rows` · `references` · `closing`). 모델 버전·핵심 메트릭은 `aiNativeSlides.js` 상단 상수로 분리하여 1포인트 수정을 보장한다.

기존 `Presentation.jsx`(스펙매니저 발표)의 슬라이드 패턴과 **인디고/슬레이트 palette**, 키보드 네비게이션, PDF/HTML export 기능을 그대로 계승한다.

### 1.1 핵심 상수 (단일 출처)

스펙·슬라이드·검증 기준 모두 아래 표를 참조한다. 변경 시 이 표만 수정한다.

| 키 | 값 | 사용처 |
|---|---|---|
| `TOTAL_SLIDES` | 26 | §3, §4, §9 |
| `TARGET_MINUTES` | 25 (±5) | §3, §9 (리허설) |
| `SONNET` | `4.6` (출시 2026.02) | 슬라이드 3, 24 |
| `OPUS` | `4.7` (출시 2026.04) | 슬라이드 3, 24 |
| `KIND_COUNT` | 8 (공통 kind) | §5.1, §6.1, §6.2, §9 |

---

## 2. 목표와 비목표

### 2.1 목표

1. **메시지 전달**: "AI Native = 운영체계 재설계" 라는 단일 결론을 5막 구조로 누적 설득.
2. **실증 기반**: 모든 정량 데이터는 **Anthropic 1차 자료**로 출처를 명시. (검증 부록 → §7.3)
3. **반증 직시**: 도발 메시지의 반증 데이터를 본문 흐름 안에서 정면 처리 → 청중 신뢰도 확보.
4. **사내 차별화**: Superpowers spec/plan + 멀티에이전트 페르소나를 핵심 사례로.
5. **운영 일관성**: 기존 `Presentation.jsx` 패턴(palette, kind, 키 네비, export) 계승.

### 2.2 비목표

- AI/ML 모델 학습 알고리즘 강의
- 벤더 비교 (Copilot vs Claude 등)
- 인터랙티브 데모 (라이브 코딩, 실시간 평가)
- 다국어 지원

---

## 3. 대상과 톤

| 항목 | 설정 |
|---|---|
| **대상** | 사내 개발팀(FE/BE 시니어 포함, AI 도구 경험 다양) |
| **분량** | 20~30분 (26장) |
| **톤** | 도발적 주장 + 실증 + 반증 직시 |
| **언어** | 한국어, 기술 용어는 한영 병기 |
| **디자인** | `Presentation.jsx`(스펙매니저)의 인디고/슬레이트 톤 그대로 계승 |

---

## 4. 슬라이드 구성 (5막 26장)

총 26장 / 평균 25분(±5분). 슬라이드당 평균 약 58초.

### 4.0 ACT별 페이싱 (재계산)

평균이 아닌 ACT별로 분배한다. 정보 밀도가 높은 ACT 1·3·4에 더 많은 시간을 할당.

| ACT | 슬라이드 수 | 목표 시간 | 슬라이드 평균 | 비고 |
|---|---|---|---|---|
| 0 | 2 | 1분 | 30초 | 도입 짧게 |
| 1 | 5 | 5.5분 | 66초 | 슬라이드 4·7은 80초씩, 5·6은 50초 |
| 2 | 5 | 4.5분 | 54초 | 9번 정량 슬라이드만 70초 |
| 3 | 7 | 8분 | 69초 | 15·16·17 70~80초, 나머지 60초 |
| 4 | 4 | 4.5분 | 67초 | 사례 흐름 강조 |
| 5 | 3 | 1.5분 | 30초 | closing 30초 + Q&A 본격 |
| **합계** | **26** | **25분** | — | §9 리허설 기준과 일치 |

### ACT 0. Hook (2장)

| # | kind/variant | 메시지 / 데이터 |
|---|---|---|
| 1 | `hero` (title) | "AI Native: 도구의 교체가 아니라 운영체계의 교체" |
| 2 | `quote` | "AI 기능을 붙이는 것은 AI Native가 아니다. PDLC 전체를 다시 설계하는 것이다." |

### ACT 1. 왜 지금 — 패러다임 (5장)

| # | kind/variant | 메시지 / 데이터 |
|---|---|---|
| 3 | `cards-grid` (variant: `paradigm`) | Software 1.0 → 2.0 → 3.0 (Karpathy) + Claude 모델 진화 타임라인 (Sonnet 4.6@2026.02, Opus 4.7@2026.04) |
| 4 | `stats-grid` | **Anthropic 내부 데이터** + **한계 디스클레이머 1줄**: 일일 업무 28%→59% / +50% 생산성 / PR merge +67% / 14% 파워유저 +100% / 연속 tool call 9.8→21.2 / 인간 turn 6.2→4.1 |
| 5 | `list-rows` (변화 비교) | **Anthropic 6개월 추적**: 기능 구현 14%→37% / 코드 설계·계획 1%→10% / 27% "Claude 없으면 안 했을 일" |
| 6 | `list-rows` (definition) | AI Native 4가지 조건: ① AI가 일할 구조 설계 ② 평가·관찰성 내장 ③ 피드백 루프 ④ 인간은 검증·책임 |
| 7 | `list-rows` (variant: `counterevidence`) | **[신설 — 반증 직시]** "그런데 이런 데이터도 있다": AI 그룹 학습 격차 -17%p(50% vs 67%, p=0.01), 디버깅 능력 가장 큰 감소 / Bloomberg "Productivity Panic 2026.02" / Anthropic 자기 데이터의 일반화 한계 → "그래서 운영체계 재설계가 필요하다"로 연결 |

### ACT 2. 페르소나별 변화 (5장)

| # | kind/variant | 메시지 / 데이터 |
|---|---|---|
| 8 | `cards-grid` (variant: `personas`) | 5개 페르소나 카드(기획자/개발자/디자이너/조직장/경영진) — 관심사·역할 변화·KPI |
| 9 | `stats-grid` (variant: `persona-quant`) | **개발자 FE 심층** — 디버깅 55% / 코드 이해 42% / 구현 37% (Anthropic). 역할: 코드 작성자 → AI 시스템 오케스트레이터 |
| 10 | `list-rows` (variant: `persona-qual`) | **기획자** — 기능 명세자 → AI 행동 설계자. **디스클레이머**: "1차 자료에 직군 분해 없음, 발표자 정성 사례" |
| 11 | `list-rows` (variant: `persona-qual`) | **디자이너** — 화면 설계자 → Human-AI Interaction 설계자. 동일 디스클레이머 |
| 12 | `compare-rows` (before→after) | **Economic Index 2026.03 Learning Curves**: 고숙련자 성공률 +10%p / 개발자 Opus 사용률 34% — "학습 곡선이 KPI" |

### ACT 3. 5단계 사이클 — 본체 (7장)

`컨텍스트 → 실행 → 검증(2장) → 반영 → 학습`

| # | kind/variant | 메시지 / 데이터 |
|---|---|---|
| 13 | `cards-grid` (variant: `cycle-overview`) | 5단계 다이어그램 (루프 시각화) |
| 14 | `list-rows` (cycle-step) | **컨텍스트** — MCP + Spec Kit + Superpowers spec/plan. 사내 위치: `docs/superpowers/specs/`·`plans/` |
| 15 | `list-rows` (cycle-step) | **실행** — Anthropic "Building Effective Agents" 5패턴. **다이어그램 위주, 발표자가 입으로 3개만 deep-dive** |
| 16 | `list-rows` (cycle-step) | **검증 1/2** — Eval-Driven Development. 3-grader 조합(코드+모델+휴먼) / 20~50 task로 시작. Anthropic Demystifying Evals 2026.01 |
| 17 | `compare-rows` (variant: `eval-metric`) | **검증 2/2** — `pass@k` vs `pass^k` 비교 + 타입/린트/단위/E2E + 골든셋·LLM-as-judge 매핑 |
| 18 | `list-rows` (cycle-step) | **반영** — 전수 리뷰 불가능. Evaluator-Optimizer 자동 게이트 + 위험 가중 리뷰 |
| 19 | `list-rows` (cycle-step) | **학습** — failure mode 라이브러리 자산화. (반증 데이터 처방은 슬라이드 7에서 이미 직시했으므로 여기서는 우리 워크플로의 처방만 강조) |

### ACT 4. 본인 사례 (4장)

| # | kind/variant | 메시지 / 데이터 |
|---|---|---|
| 20 | `hero` (variant: `case-intro`) | "실증: Claude Code + Superpowers 기반 사내 워크플로" |
| 21 | `cards-grid` (variant: `case-flow`) | spec → plan → impl → review (brainstorming · writing-plans · subagent-driven-development · spec-document-reviewer). 실제 `docs/superpowers/` 디렉터리 |
| 22 | `cards-grid` (variant: `case-multiagent`) | PM · 디자이너 · 개발 3인조. **슬라이드 내 "/multi-agent 발표 열기" 라이브 링크 버튼** |
| 23 | `list-rows` (case-lessons) | 운영 교훈 3가지: ① spec 라이브러리=자산 ② 리뷰어 페르소나 강제 ③ 피드백 루프=메모리 시스템 |

### ACT 5. 시작 가이드 + 마무리 (3장)

| # | kind/variant | 메시지 / 데이터 |
|---|---|---|
| 24 | `list-rows` (variant: `roadmap-org`) | **조직 액션 중심 로드맵**: ① 누가 = spec owner 지정(이번 주) ② 언제 = Eval 첫 베이스라인(이번 분기) ③ 측정 = pass^k 95% + failure mode 누적 건수(**초기 베이스라인 측정 후 plan 단계에서 N 확정**, 슬라이드에는 "베이스라인 측정 후 결정" 노출) ※ 도구·기술 수단은 본문에서 이미 다룸: 컨텍스트(13) / 실행(15) / 검증(16·17) / 반영(18) / 학습(19) |
| 25 | `references` | Anthropic 1차 자료 + Karpathy + Hamel Husain + OWASP + EU AI Act + NIST AI RMF (URL 모두 명시) |
| 26 | `closing` | "AI Native는 도구의 교체가 아니라 운영체계의 교체다." — Q&A 시작 질문 3개 포함 |

---

## 5. 데이터 모델

### 5.1 통합 슬라이드 스키마 (8개 공통 kind)

19개 1회용 kind에서 **8개 공통 kind + variant**로 통합하여 재사용성을 확보한다. `closing`은 마지막 슬라이드(Q&A 시작 질문) 전용 단일 인스턴스로 `hero`·`quote`와는 다른 레이아웃이므로 독립 kind로 유지한다.

```js
// 공통 베이스 필드
type SlideBase = {
  eyebrow?: string;           // 우상단 카테고리 텍스트
  title?: string;
  subtitle?: string;
  variant?: string;           // 카테고리 내 세부 분기
  accent?: "indigo"|"pink"|"emerald"|"amber"|"violet"|"sky";
  source?: SourceRef;         // 정량 데이터 슬라이드 필수
  speakerNote?: string;       // 화면 미노출, 발표자 노트
};

type SourceRef = {
  label: string;              // "Anthropic Economic Index"
  url?: string;
  year?: string;              // "2026.03"
  disclaimer?: string;        // 일반화 한계 등 디스클레이머
};

// 8개 공통 kind
const slides: Slide[] = [
  // 1. hero — 타이틀/도입/사례 시작
  { kind: "hero", variant: "title"|"case-intro", eyebrow, title, subtitle?, tagline?, desc? },

  // 2. quote — 인용/한 줄 메시지
  { kind: "quote", quote, attribution? },

  // 3. stats-grid — 정량 데이터 카드
  { kind: "stats-grid", source, stats: [{value, label, delta?}] },

  // 4. list-rows — 항목 리스트 (definition, cycle-step, persona, lessons, roadmap)
  //    variant 로 레이아웃 분기: "definition" | "counterevidence" | "cycle-step"
  //                            | "persona-qual" | "case-lessons" | "roadmap-org"
  { kind: "list-rows", variant, rows: [{label, body, badge?, source?}] },

  // 5. cards-grid — 카드 격자 (paradigm, personas, cycle-overview, case-flow, case-multiagent)
  { kind: "cards-grid", variant, cards: [{title, body, accent?, icon?, link?}] },

  // 6. compare-rows — 비교/변화 (before vs after, metric table)
  { kind: "compare-rows", variant, headers: [string], rows: [[string]] },

  // 7. references — 참고자료/closing
  { kind: "references", groups: [{label, items: [{title, url}]}] },

  // 8. closing — 마지막 슬라이드 (단일 인스턴스, 마무리 메시지 + Q&A 질문)
  { kind: "closing", message, qaQuestions: [string] },
];
```

> 결과적으로 **공통 kind 8개**(hero, quote, stats-grid, list-rows, cards-grid, compare-rows, references, closing). 19개 1회용 컴포넌트 대비 11개 감소로 재사용성과 유지비용이 크게 개선된다. (`KIND_COUNT = 8`, §1.1 핵심 상수)

### 5.2 디자인 토큰 — Presentation.jsx (스펙매니저) 톤 계승

`src/Presentation.jsx` 의 `palette` 객체를 **그대로 import 하지 않고 복제하지도 않는다**. 대신 `src/presentationPalette.js` 신규 모듈로 추출하여 두 발표가 공유하도록 한다. 단, 이번 spec 범위에서는 **AiNativePresentation.jsx 내부에 동일 키로 복제**해 우선 사용하고, 추출 리팩터링은 별도 후속 작업으로 남긴다(범위 폭주 방지).

복제할 핵심 토큰 (Presentation.jsx 와 동일 값):

```js
const palette = {
  bg, ink, text, muted, line, paper, soft,
  indigo, indigoLight, pink, pinkLight,
  emerald, emeraldLight, amber, amberLight,
  violet, violetLight, sky, skyLight,
};
```

후속 리팩터링 단서: §11 비결정 사항에 "palette 공유 모듈 추출" 명시.

---

## 6. 컴포넌트 구조

```
src/
├── AiNativePresentation.jsx        # 신규 — 라우트 메인 컴포넌트 (네비/Shell)
├── aiNativeSlides.js               # 신규 — slides[] 데이터 분리 (1000줄 방지)
├── App.jsx                         # 수정 — /ai-native 라우트 + 홈 카드
├── main.jsx                        # 수정 — Router 등록
└── downloadUtils.js                # 수정 — presentationDownloads.aiNative 엔트리
```

### 6.1 책임 경계

- **`AiNativePresentation.jsx`**: SlideShell(헤더·푸터·카운터·네비), kind별 렌더러 8종, 키보드/터치 이벤트, export 모드 분기
- **`aiNativeSlides.js`**: 26장 슬라이드 데이터 + 모델 버전 상수(`MODELS = { sonnet: "4.6", opus: "4.7" }`)
- **`App.jsx`**: 홈 카드 1개 추가 (`accent: palette.indigo`), 다운로드 분기는 기존 패턴 그대로
- **`downloadUtils.js`**: `presentationDownloads.aiNative = { pdf: "/ai-native?export=print", html: "/ai-native?export=static", filename: "ai-native-presentation.html" }`

### 6.2 기존 패턴 준수

- 키 입력: `ArrowRight | Space | PageDown` → next, `ArrowLeft | PageUp` → prev (Presentation.jsx:920)
- export 모드: `runExportMode` 활용 (모든 슬라이드 펼친 단일 페이지 인쇄)
- `data-export-hidden` 으로 다운로드 버튼은 export 시 숨김
- 홈 카드 다운로드 분기: `if (filename) downloadStaticHtml(html, filename) else window.open(html, ...)` — 기존 App.jsx:476–479 와 동일

---

## 7. 인용·출처 정책

### 7.1 1차 자료 (Anthropic) 매핑

| 데이터 | 출처 | 사용 슬라이드 |
|---|---|---|
| 일일 업무 28%→59% / +50% 생산성 / PR merge +67% / tool call 9.8→21.2 / 인간 turn 6.2→4.1 / 파워유저 14% | How AI Is Transforming Work at Anthropic | 4 |
| 기능 구현 14%→37% / 코드 설계 1%→10% / 27% Claude 없으면 안 했을 일 / 디버깅 55% / 코드 이해 42% | 위 자료 | 5, 9 |
| 고숙련자 성공률 +10%p / 개발자 Opus 34% / Comp/Math 35% | Economic Index 2026.03 Learning Curves | 12 |
| 5가지 에이전트 워크플로 패턴 | Building Effective Agents 2024.12 | 15 |
| 3-grader 조합 / pass@k vs pass^k / 20~50 task | Demystifying Evals for AI Agents 2026.01 | 16, 17 |
| AI 그룹 -17%p (50% vs 67%, p=0.01) / 디버깅 능력 감소 | How AI Assistance Impacts the Formation of Coding Skills | 7 |
| Sonnet 4.6 (2026.02) / Opus 4.7 (2026.04) | Anthropic 공식 모델 페이지 | 3, 24 |

### 7.2 보조 자료

| 자료 | 용도 | 사용 슬라이드 |
|---|---|---|
| Karpathy "Software 2.0/3.0" | 패러다임 정의 | 3 |
| Bloomberg "Productivity Panic of 2026" (2026.02) | 반증 직시 | 7 |
| OWASP LLM Top 10 v2 (2025) | 리스크 (발표자 노트) | 16, 25 |
| EU AI Act / NIST AI RMF | 거버넌스 (발표자 노트) | 24, 25 |
| Hamel Husain "Your AI Product Needs Evals" | EDD 개념 | 16 |

### 7.3 [신설] 자료 실재성 검증 체크리스트

구현 착수 **전** 모든 1차/보조 자료에 대해 아래 4필드를 확보하고 **`docs/superpowers/specs/2026-05-19-ai-native-sources.md` 단일 파일**에 기록한다(자동 검증 가능 형태). **하나라도 미검증 시 해당 슬라이드는 정량 표시 대신 정성 메시지로 대체**한다.

| 필드 | 형식 | 예시 |
|---|---|---|
| URL | 공식 페이지 우선 | https://www.anthropic.com/research/economic-index-march-2026-report |
| 접근일 | YYYY-MM-DD | 2026-05-19 |
| 인용 원문 발췌 | 영문/한글 원문 1~2문장 | "high-tenure users show 10 percentage point higher success rates…" |
| 발췌 위치 | 섹션/단락 또는 페이지 | "Learning Curve Findings" 단락 |

> 이 부록은 **본 spec과 동일 commit**에 포함되거나, 늦어도 plan 문서 작성 전에 완료되어야 한다.

### 7.4 출처 표기 규칙

- `stats-grid`, `compare-rows`, `list-rows`(variant `counterevidence`·`cycle-step`·`persona-quant`)에는 **`source` 필드 필수**.
- 빌드 시 lint 체크: 위 kind/variant에 `source`가 없으면 console.warn 출력 (개발 편의).
- references 슬라이드(25)에 모든 URL을 클릭 가능한 형태로 노출.

---

## 8. 다운로드 동작

기존 패턴 그대로:

- **PDF 저장**: `openPdfPrintView(presentationDownloads.aiNative.pdf)` — print-friendly 모드(`?export=print`)로 새 창
- **HTML 다운로드**: `filename` 필드 존재 → `downloadStaticHtml(html, filename)` 호출 (`ai-native-presentation.html`)

홈 카드의 분기 로직은 기존 App.jsx:476–479 그대로 사용한다.

---

## 9. 검증 기준 (수용 조건)

객관적으로 측정 가능한 기준만 남긴다.

| 항목 | 통과 조건 |
|---|---|
| 라우팅 | `/ai-native` 접근 시 슬라이드 1번이 첫 화면 (수동 확인) |
| 슬라이드 수 | 26장 정확히 (Act 0: 2, Act 1: 5, Act 2: 5, Act 3: 7, Act 4: 4, Act 5: 3) |
| 네비게이션 | ← → Space PageDown PageUp 키 + 네비 버튼 클릭 모두 동작 |
| 출처 표기 | `stats-grid`, `compare-rows`, 정량 `list-rows` **100%** `source` 필드 존재 (자동 검증 스크립트 또는 dev 모드 warn) |
| 1차 자료 검증 | §7.3 체크리스트 모든 항목 4필드 완비 (sources 부록 commit 확인) |
| 홈 노출 | `/` 메뉴 카드에 신규 카드 1개 추가, 색은 `palette.indigo` |
| 다운로드 | PDF 저장 → 새 창 인쇄 다이얼로그 / HTML 다운로드 → 파일명 `ai-native-presentation.html` |
| 디자인 일관성 | palette 키 100% 일치 (Presentation.jsx의 palette 객체와 키 diff = 0) |
| 인쇄 | export 모드에서 26장 모두 펼쳐짐, `data-export-hidden` 요소 미노출 (인쇄 미리보기 확인) |
| 한국어 검수 | 검수자 2인 sign-off (작성자 + 1인 peer) |
| **사전 동료 청취** | Act 4(본인 사례) 부분만 동료 1인에게 사전 청취 — "본인 팀 자랑"으로 들리는지 confirm/adjust 라운드 1회 |
| 빌드 | `npm run build` 0 warning 0 error |
| 리허설 시간 | 1회 리허설에서 `TARGET_MINUTES` 25분 ±5분 내 완주 |

---

## 10. 리스크와 완화

등급은 평가 시점 그대로 동결한다. 완화로 인해 잔여 리스크가 낮아진 경우 "잔여" 컬럼에 별도 표기.

| 리스크 | 평가 등급 | 완화 | 잔여 |
|---|---|---|---|
| 1차 자료 실재성 미검증 → 발표 전체 신뢰 붕괴 | Critical | §7.3 체크리스트 100% 완비. 미검증 자료는 정성 메시지로 대체 | Low (검증 후) |
| 슬라이드 분량 초과 (26 → 30+) | Warning | Act별 슬라이드 수 고정. 추가 메시지는 `speakerNote`에만 | Low |
| **사내 정치 — "본인 팀 자랑 발표" 인식** | Warning | Act 4 마지막(슬라이드 23)을 "교훈의 일반화" 톤으로. 슬라이드 22는 라이브 링크로 기존 자료 공유 → "자산 공유" 메시지 강조. **사전 동료 1인 청취 1회 필수**(§9 추가) | Medium |
| **Anthropic 데이터 일반화 한계** | Warning | 슬라이드 4 하단에 "Anthropic 자체 데이터(LLM 회사 직원·자기 도구 측정)의 일반화 한계" 1줄 디스클레이머 + 슬라이드 7(반증 직시) 정면 노출 | Low |
| 본인 사례 노출 과다 | Warning | Act 4(4장) 한정. "운영 교훈" 슬라이드(23)로 결론 일반화 | Low |
| 모델 버전 노후화 (Opus 4.7 이후 새 모델 등장) | Info | §1.1 상수 표 단일 출처 + `aiNativeSlides.js` 상단 `MODELS` 상수 분리 | Low |
| 반증 데이터(슬라이드 7) 처리 톤 | Warning | "그런데" → "그래서 운영체계 재설계가 필요하다" 연결을 슬라이드 7 마지막 줄로 명시. 단순 폭로가 아닌 본문 흐름 연결 | Low |
| ACT 3 페이싱 (15·16·17 분할 후에도 정보 과밀 가능) | Warning | 슬라이드 15는 **다이어그램 위주**, 발표자가 3개만 deep-dive. Eval은 2장(16·17)으로 분할 완료 + §4.0 ACT별 페이싱 표 | Low |
| **ACT 1 페이싱 (5장 5.5분)** | Warning | §4.0 ACT 1 행에서 슬라이드 4·7은 80초씩 길게, 5·6은 50초씩 짧게 — 평균 66초 유지 | Low |
| Palette 호환 (Presentation.jsx와 키 diff) | Critical | §5.2 복제 + §9 검증 기준 "키 diff = 0" 초기 1회 검증. **drift 위험**: 두 발표가 동시에 palette 수정 시 어긋날 수 있음 → 후속 작업으로 `presentationPalette.js` 공유 모듈 추출(§11) | Medium |
| 인용 데이터 해석 편향 | Warning | references 슬라이드에 URL 모두 노출 + 슬라이드 7로 반증 균형 | Low |

---

## 11. 비결정 사항 (이번 spec 범위 외 / 후속 결정)

- **palette 공유 모듈 추출** (`src/presentationPalette.js`) — 이번 작업 범위 폭주 방지를 위해 후속 작업. 본 작업은 복제로 시작.
- 슬라이드 번호 URL 동기화 (`/ai-native/3` 등) — 이번 범위 외, 일단 단일 URL.
- 모바일 반응형 — 데스크탑 우선, 모바일 열람 가능 정도 (Layout breakdown만 방지).
- export HTML 인쇄 사이즈 — 기존 Presentation.jsx와 동일(`@page` 동일).
- references 슬라이드 URL 클릭 동작 — 데스크탑 발표에서는 클릭 불필요, 인쇄·HTML 다운로드 시에는 URL 텍스트 표시 (이번 spec에서 결정).
- 발표자 노트 표시 모드 — `speakerNote` 필드만 데이터에 보유, 화면 노출 모드는 후속.
- 다크 모드 — 후속.
- 영문 버전 — out of scope.
- 인터랙티브 demo — out of scope.

---

## 12. 다음 단계

1. 본 spec rev 3 → 사용자 최종 검토 게이트
2. 승인 후 **`writing-plans` 스킬**로 구현 계획 작성 (`docs/superpowers/plans/2026-05-19-ai-native-presentation-plan.md`)
3. plan 작성과 **동시 또는 직후**에 §7.3 자료 검증 체크리스트(`docs/superpowers/specs/2026-05-19-ai-native-sources.md`) 완비
4. **`subagent-driven-development`** 로 구현 진행
5. 구현 중간/완료 시 §9 모든 항목 통과 확인 (한국어 검수 2인 sign-off + 사전 동료 청취 포함)
6. 리허설 1회 후 §9 시간 기준(25분 ±5분) 통과 확인 → 통과 못 하면 슬라이드 추가 압축

---

## 부록 A. 리뷰 1라운드 반영 내역

| 이슈 | 등급 | 반영 위치 |
|---|---|---|
| C1 인용 자료 실재성 검증 절차 부재 | Critical | §7.3 신설 (4필드 체크리스트) + §9 검증 기준 |
| C2 슬라이드 17(학습) 반증 처리 미흡 | Critical | 슬라이드 7 신설 (반증 직시), 총 26장 |
| C3 검증 기준 객관성 부족 + 리허설 시간 누락 | Critical | §9 전면 재작성 (12개 기준 모두 객관 측정 가능) |
| C4 palette 호환 미정 | Critical | §5.2 결정 (Presentation.jsx 톤 복제 + 후속 추출) |
| W1 ACT 3 페이싱 (Eval 과밀) | Warning | 슬라이드 16·17로 2분할, 슬라이드 15는 다이어그램 위주 |
| W2 슬라이드 9·10 정량 빈약 | Warning | variant `persona-qual` 명명 + 디스클레이머 슬라이드 내 노출 |
| W3 19개 kind 과잉 | Warning | 7개 공통 kind + variant로 통합 (§5.1) |
| W4 source 필드 스키마 미정 | Warning | `SourceRef` 타입 정의 (§5.1) + 필수 kind/variant 명시 |
| W5 사내 정치 + 일반화 리스크 누락 | Warning | §10 리스크 표에 2건 추가 + 슬라이드 4 디스클레이머 |
| W6 다운로드 분기 명확화 | Warning | §6.2 와 §8 에 `filename` 분기 명시 |
| W7 ACT 5 로드맵 중복 | Warning | 슬라이드 24를 "조직 액션(누가/언제/측정)" 중심으로 재배치 |
| W8 슬라이드 21 라이브 링크 | Warning | 슬라이드 22에 라이브 링크 버튼 추가 |
| I1 슬라이드 데이터 위치 | Info | `aiNativeSlides.js`로 분리 (§6) |
| I2 URL 슬라이드 동기화 | Info | §11 후속 결정 |
| I3 모바일 반응형 | Info | §11 데스크탑 우선 |
| I4 발표자 노트 표시 모드 | Info | §11 — 데이터 필드는 보유, 화면 모드는 후속 |
| I5 다크 모드 | Info | §11 후속 |
| I6 references 슬라이드 클릭 동작 | Info | §11 — 데스크탑 발표 클릭 불필요, 인쇄에는 URL 텍스트 |

## 부록 B. rev 2 → rev 3 변경 내역 (2차 리뷰 반영)

| 이슈 | 등급 | 반영 |
|---|---|---|
| §5.1 kind 개수 모순 (7 vs 8) | New Critical | "8개 공통 kind"로 통일 + §1.1 상수 표 + closing 독립 사유 명시 |
| ACT 1 페이싱 재계산 누락 | New Critical | §4.0 ACT별 페이싱 표 추가 — ACT 1 = 5장 5.5분 |
| §1 Executive Summary 핵심 수치 누락 | New Warning | "25분 ±5, 26장" + §1.1 핵심 상수 표 추가 |
| §7.3 부록 위치 모호 (OR 선택지) | New Warning | `2026-05-19-ai-native-sources.md` 단일 파일로 못박음 |
| §10 등급 변경 표기 ("Critical → Info") | New Warning | 등급 동결 + "잔여" 컬럼 추가 + Palette를 Critical 그대로 유지 |
| 부록 A Info 6건 뭉뚱그림 | New Warning | I1~I6으로 분리 |
| 모델 버전 본문 하드코딩 | New Warning | §1.1 핵심 상수 표를 단일 출처로 — 본문은 참조 |
| 슬라이드 24 N 미정 | New Warning | "베이스라인 측정 후 plan 단계 확정", 슬라이드 노출은 "베이스라인 측정 후 결정" |
| §12 sign-off 단계 누락 | New Info | §12 5·6 단계로 sign-off 게이트 추가 |
| 슬라이드 22 라이브 링크 export 동작 | New Info | (rev 4 작업 시 §8에 추가 예정) |
| W5 청중 사전 검증 메커니즘 부재 | Still Open | §9 검증 기준에 "사전 동료 청취" 행 추가 |
| W7 로드맵 본문 매핑 불명확 | Still Open | 슬라이드 24 행에 본문 슬라이드 번호 매핑 추가 (13/15/16·17/18/19) |
| C4 palette 강등 사유 | Still Open | §10에서 등급을 Critical로 동결, 후속 추출 후속 작업으로 명시 |
