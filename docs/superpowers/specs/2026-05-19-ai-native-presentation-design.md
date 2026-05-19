---
title: AI Native 발표 슬라이드 — 디자인 스펙
date: 2026-05-19
status: draft
owner: Hyeoncheol Choi
audience: 사내 개발팀 (FE/BE 시니어 포함)
duration: 20~30분
deliverable: React 라우트 `/ai-native` (단일 SPA 슬라이드 모드) + PDF/HTML 다운로드
---

# AI Native 발표 슬라이드 — 디자인 스펙

## 1. Executive Summary

사내 개발팀 대상 20~30분 분량의 발표 슬라이드를 React 라우트 `/ai-native` 로 구현한다. 핵심 메시지는 **"AI Native는 도구의 교체가 아니라 운영체계의 교체다"** 라는 도발적 주장이며, 이를 **Anthropic 1차 자료(2025–2026 최신)** 로 실증하고, 본인 팀이 운영 중인 **Superpowers spec/plan 워크플로 + 멀티에이전트 페르소나** 로 사내 사례 차별화를 만든다.

기존 `Presentation.jsx`의 슬라이드 패턴(데이터 배열 + `kind`별 렌더러 + 키보드 네비게이션 + PDF/HTML export) 을 그대로 계승하여 일관된 운영 비용을 유지한다.

---

## 2. 목표와 비목표

### 2.1 목표

1. **메시지 전달**: "AI Native = 운영체계 재설계" 라는 단일 결론을 5막 구조로 누적 설득한다.
2. **실증 기반**: 모든 정량 데이터는 **Anthropic 1차 자료**로 출처를 명시한다 (Anthropic Economic Index, How AI Is Transforming Work at Anthropic, 2026 Agentic Coding Trends Report, Demystifying Evals 등).
3. **사내 차별화**: 본인 팀이 실제로 운영 중인 Superpowers spec/plan + 멀티에이전트 협업 프로세스를 핵심 사례로 제시한다.
4. **운영 일관성**: 기존 `Presentation.jsx`, `MultiAgentProcess.jsx` 와 디자인 토큰·네비게이션·다운로드 기능을 동일 패턴으로 맞춘다.

### 2.2 비목표

- AI/ML 모델 학습 알고리즘 강의 (튜토리얼 아님)
- 특정 벤더 비교 (Copilot vs Claude 등) — Anthropic 1차 자료로만 구성
- 인터랙티브 데모 (라이브 코딩, 실시간 평가 등) — 정적 슬라이드만
- 다국어 지원 — 한국어 단일

---

## 3. 대상과 톤

| 항목 | 설정 |
|---|---|
| **대상** | 사내 개발팀(FE/BE 시니어 포함, AI 도구 경험 다양) |
| **분량** | 20~30분 (25장 내외) |
| **톤** | 도발적 주장 + 실증 ("AI 기능을 붙이는 것은 AI Native가 아니다") |
| **언어** | 한국어, 기술 용어는 한영 병기 |
| **디자인** | `Presentation.jsx` 톤 계승 (모던·컬러풀, 슬라이드 모드, 키보드 네비) |

---

## 4. 슬라이드 구성 (5막 25장)

### ACT 0. Hook (2장)

| # | kind | 메시지 / 데이터 |
|---|---|---|
| 1 | `title` | "AI Native: 도구의 교체가 아니라 운영체계의 교체" / 부제: 기획·개발·디자인·조직이 평가와 피드백 루프 위에서 다시 짜인다 |
| 2 | `quote` | "AI 기능을 붙이는 것은 AI Native가 아니다. PDLC 전체를 다시 설계하는 것이다." |

### ACT 1. 왜 지금 — 패러다임 (4장)

| # | kind | 메시지 / 데이터 |
|---|---|---|
| 3 | `paradigm-shift` | Software 1.0(코드) → 2.0(가중치) → 3.0(프롬프트/스펙) — Karpathy. 부가: Claude 모델 진화 타임라인 (Sonnet 4.6 @2026.02, Opus 4.7 @2026.04) |
| 4 | `claude-stat-grid` | **Anthropic 내부 데이터**: ① 일일 업무 28% → 59% Claude 사용 ② 평균 +50% 생산성 (1년 전 +20%) ③ PR merge +67% ④ 14% 파워유저 +100% 생산성 ⑤ 연속 tool call 9.8 → 21.2 회 ⑥ 인간 turn 6.2 → 4.1 |
| 5 | `claude-shift` | **개발자 행동 변화 (Anthropic 6개월 추적)**: 기능 구현 14% → 37%, 코드 설계/계획 1% → 10%, 27% 업무는 "Claude 없으면 안 했을 일" |
| 6 | `definition` | AI Native 4가지 조건: ① AI가 일할 구조 설계 ② 평가·관찰성 내장 ③ 피드백 루프 ④ 인간은 검증·책임 |

### ACT 2. 무엇이 달라지는가 — 페르소나 (5장)

| # | kind | 메시지 / 데이터 |
|---|---|---|
| 7 | `personas-grid` | 5개 페르소나 카드(기획자/개발자/디자이너/조직장/경영진) — 핵심 관심사, 역할 변화, 봐야 할 지표 |
| 8 | `persona-deep` | **개발자 FE 심층** — 디버깅 55% / 코드 이해 42% / 구현 37% (Anthropic 데이터). 역할 변화: 코드 작성자 → AI 시스템 오케스트레이터. KPI: eval pass rate / latency / cost / 오류율 |
| 9 | `persona-deep` | **기획자 심층** — 기능 명세자 → AI 행동 설계자. KPI: 과업 성공률 / 재시도율 / 신뢰도 / 전환율 |
| 10 | `persona-deep` | **디자이너 심층** — 화면 설계자 → Human-AI Interaction 설계자. KPI: 수정률 / 중단률 / 만족도 / 혼란 지점 |
| 11 | `metric-table` | **Economic Index 인용 (2026.03 Learning Curves)**: 고숙련 사용자 성공률 +10%p / Opus 사용률 (개발자 34%, 튜터 12%) → "학습 곡선이 KPI다" |

### ACT 3. 5단계 사이클 — 발표의 본체 (7장)

`컨텍스트 → 실행 → 검증 → 반영 → 학습`

| # | kind | 메시지 / 데이터 |
|---|---|---|
| 12 | `cycle-overview` | 5단계 다이어그램 (원형 루프 시각화) |
| 13 | `cycle-step` | **컨텍스트**: 프롬프트가 아니라 **컨텍스트 엔지니어링**. MCP(2024.11) + GitHub Spec Kit + Superpowers spec/plan = "AI가 일할 구조" = spec 라이브러리. **사내 위치**: `docs/superpowers/specs/`, `docs/superpowers/plans/` |
| 14 | `cycle-step` | **실행**: Anthropic **"Building Effective Agents" 5패턴** — Prompt Chaining / Routing / Parallelization / Orchestrator-Workers / Evaluator-Optimizer |
| 15 | `cycle-step` | **검증**: TDD를 넘어 **Eval-Driven Development**. **Anthropic Demystifying Evals(2026.01) 프레임**: ① 코드 grader + 모델 grader + 휴먼 grader 3종 ② pass@k vs pass^k ③ 20~50 task로 시작 ④ 타입/린트/단위/E2E + 골든셋·LLM-as-judge |
| 16 | `cycle-step` | **반영**: 코드 리뷰의 근본 재설계 — "하루 생성 코드 전수 리뷰는 불가능". Evaluator-Optimizer 자동 게이트 + 샘플링 + 위험 가중 리뷰 |
| 17 | `cycle-step` | **학습**: **Anthropic AI Coding Skills 연구** — AI 그룹 지식 격차 -17%p (50% vs 67%, p=0.01) / 디버깅 능력 감소가 가장 큼. 처방: ① 학습 모드 분리 ② failure mode 라이브러리 자산화 ③ 팀 피드백 루프 |
| 18 | `risk` | 리스크 정면 응시: ① **"Productivity Panic"(Bloomberg 2026.02)** — 빌드 압박 가속 ② 멘토십·온보딩 기회 감소 ③ OWASP LLM Top 10 (Prompt Injection, Insecure Output) ④ EU AI Act 2025 단계 시행 ⑤ NIST AI RMF |

### ACT 4. 본인 사례 — Superpowers + 멀티에이전트 (4장, 핵심 차별점)

| # | kind | 메시지 / 데이터 |
|---|---|---|
| 19 | `case-intro` | "실증: 본인 팀이 운영 중인 AI Native 워크플로 — Claude Code + Superpowers" |
| 20 | `case-flow` | **spec → plan → impl → review 사이클**. `brainstorming` → `writing-plans` → `subagent-driven-development` → `spec-document-reviewer`. 실제 `docs/superpowers/specs/`·`plans/` 디렉터리를 자산으로 운영 |
| 21 | `case-multiagent` | **멀티에이전트 페르소나 운영**: PM · 디자이너 · 개발 3인조 (주작업/리뷰어/감독자). 기존 `/multi-agent` 발표와 연결 → 사내 자산 |
| 22 | `case-lessons` | 운영하며 배운 것 3가지: ① **spec 라이브러리가 자산** (지식이 산출물로 축적) ② **리뷰어 페르소나 강제** (Critical 이슈 재리뷰 의무) ③ **피드백 루프 = 메모리 시스템** (failure mode 누적) |

### ACT 5. 시작 가이드 + 마무리 (3장)

| # | kind | 메시지 / 데이터 |
|---|---|---|
| 23 | `roadmap` | 3단계 도입 로드맵: **이번 주** — spec 라이브러리 시작 / **이번 분기** — Eval 베이스라인 + 모델 라우팅(Sonnet 4.6 기본 + Opus 4.7 어려운 작업) / **6개월** — 팀 단위 failure mode 자산화 + AI 행동 가이드라인 |
| 24 | `references` | Anthropic 1차 자료 + Karpathy Software 3.0 + Hamel Husain Evals + OWASP LLM Top 10 + EU AI Act + NIST AI RMF |
| 25 | `closing` | "AI Native는 도구의 교체가 아니라 운영체계의 교체다." — Q&A |

---

## 5. 데이터 모델

### 5.1 슬라이드 데이터 (`src/AiNativePresentation.jsx`)

```js
const slides = [
  { kind: "title", eyebrow, title, subtitle, tagline, desc },
  { kind: "quote", eyebrow, quote, attribution? },
  { kind: "paradigm-shift", eyebrow, title, stages: [{label, body, accent}], timeline: [{date, model, note}] },
  { kind: "claude-stat-grid", eyebrow, title, source, stats: [{value, label, delta?}] },
  { kind: "claude-shift", eyebrow, title, source, rows: [{label, from, to, note?}] },
  { kind: "definition", eyebrow, title, items: [{n, title, body}] },
  { kind: "personas-grid", eyebrow, title, personas: [{role, concern, shift, kpis}] },
  { kind: "persona-deep", eyebrow, role, shift, kpis, data?: [{label, value, source}] },
  { kind: "metric-table", eyebrow, title, source, rows: [[before, after, note]] },
  { kind: "cycle-overview", eyebrow, title, steps: [{n, label, oneLiner}] },
  { kind: "cycle-step", eyebrow, n, label, points: [string], source?, sideNote? },
  { kind: "risk", eyebrow, title, items: [{title, body, source}] },
  { kind: "case-intro", eyebrow, title, body },
  { kind: "case-flow", eyebrow, title, nodes: [{label, tool, dir?}] },
  { kind: "case-multiagent", eyebrow, title, personas: [{role, emoji, focus}], link },
  { kind: "case-lessons", eyebrow, title, lessons: [{title, body}] },
  { kind: "roadmap", eyebrow, title, phases: [{when, items: [string]}] },
  { kind: "references", eyebrow, title, groups: [{label, items: [{title, url}]}] },
  { kind: "closing", eyebrow, title, cta },
];
```

### 5.2 디자인 토큰 (Presentation.jsx 와 호환)

```js
const palette = {
  bg: "#f7f3ea", ink: "#161616", text: "#26211b", muted: "#70675b",
  line: "#ded5c8", paper: "#fffaf1", soft: "#efe7da",
  indigo: "#4f46e5", indigoLight: "#eef2ff",
  pink: "#db2777",  pinkLight: "#fdf2f8",
  emerald: "#059669", emeraldLight: "#ecfdf5",
  amber: "#d97706", amberLight: "#fffbeb",
  violet: "#7c3aed", violetLight: "#f5f3ff",
  sky: "#0284c7", skyLight: "#e0f2fe",
  red: "#b83a2f", blue: "#315f82", green: "#46725f",
};
```

---

## 6. 컴포넌트 구조

```
src/
├── AiNativePresentation.jsx          # 신규 — 메인 라우트 컴포넌트
│   ├── slides[]                      # 데이터 배열
│   ├── useKeyboardNav()              # ← → Space PageDown
│   ├── SlideShell                    # 공통 레이아웃 (헤더/푸터/카운터/네비)
│   └── 각 kind별 렌더러 (TitleSlide, QuoteSlide, ParadigmShiftSlide, …)
├── App.jsx                           # 수정 — `/ai-native` 라우트 + 홈 카드 추가
├── main.jsx                          # 수정 — Router 등록
└── downloadUtils.js                  # 수정 — presentationDownloads.aiNative 엔트리 추가
```

### 6.1 책임 경계

- **`AiNativePresentation.jsx`**: 슬라이드 데이터, kind별 렌더러, 키보드/터치 네비, 인쇄 모드 분기
- **`App.jsx`**: 홈 메뉴 카드 1개 추가 (`/ai-native`, 색 `palette.indigo` 또는 `amber`)
- **`downloadUtils.js`**: `presentationDownloads.aiNative = { pdf, html, filename }` 엔트리 추가

### 6.2 기존 패턴 준수 사항

- 키 입력: `ArrowRight | Space | PageDown` → next, `ArrowLeft | PageUp` → prev (Presentation.jsx:920)
- export 모드: `runExportMode` 활용 (모든 슬라이드 펼친 단일 페이지 인쇄)
- `data-export-hidden` 속성으로 다운로드 버튼은 export 시 숨김

---

## 7. 인용·출처 정책

모든 정량 데이터는 슬라이드 하단 또는 카드 내 `source` 필드에 출처를 명시한다.

### 7.1 1차 자료 (Anthropic)

| 자료 | 출처 |
|---|---|
| 일일 업무 59% / +50% 생산성 / PR merge +67% | How AI Is Transforming Work at Anthropic |
| 기능 구현 14%→37% / 설계·계획 1%→10% / 연속 tool call 9.8→21.2 | 위 자료 |
| 고숙련자 성공률 +10%p / 개발자 Opus 사용률 34% | Anthropic Economic Index 2026.03 Learning Curves |
| Computer/Math 35% 점유 | 위 자료 |
| 5가지 에이전트 워크플로 패턴 | Anthropic "Building Effective Agents" 2024.12 |
| 3-grader 조합 / pass@k vs pass^k / 20–50 task | Anthropic "Demystifying Evals for AI Agents" 2026.01 |
| AI 그룹 지식 -17%p / 디버깅 능력 감소 | Anthropic "How AI Assistance Impacts the Formation of Coding Skills" |
| Sonnet 4.6, Opus 4.7 모델 전략 | Anthropic 공식 모델 페이지 |

### 7.2 보조 자료

| 자료 | 용도 |
|---|---|
| Karpathy "Software 2.0/3.0" | 패러다임 정의 |
| Bloomberg "Claude Code and the Great Productivity Panic of 2026" | 리스크 슬라이드 |
| OWASP LLM Top 10 v2 (2025) | 보안 리스크 |
| EU AI Act / NIST AI RMF | 거버넌스 |
| Hamel Husain "Your AI Product Needs Evals" | EDD 개념 |

---

## 8. 다운로드 동작

기존 패턴 그대로:

- **PDF 저장**: `openPdfPrintView(presentationDownloads.aiNative.pdf)` — print-friendly 모드로 새 창 → 사용자가 OS 다이얼로그로 PDF 저장
- **HTML 다운로드**: `downloadStaticHtml(presentationDownloads.aiNative.html, filename)` — 단일 HTML 파일 다운로드

`html` 빌드는 export 시점에 모든 슬라이드를 펼친 정적 페이지로 직렬화.

---

## 9. 검증 기준 (수용 조건)

| 항목 | 기준 |
|---|---|
| 라우팅 | `/ai-native` 접근 시 슬라이드 1번이 첫 화면 |
| 네비게이션 | 키보드(← → Space PageDown PageUp), 클릭 모두 동작 |
| 슬라이드 수 | 25장 (Act 0~5) |
| 출처 표기 | 정량 데이터 모든 슬라이드 하단에 `source` 노출 |
| 홈 노출 | `/` 의 메뉴 카드에 "AI Native: 운영체계의 교체" 카드 1개 추가 |
| 다운로드 | PDF 저장, HTML 다운로드 버튼 동작 |
| 디자인 일관성 | Presentation.jsx 의 palette, 폰트 패밀리, 그림자, 곡률 동일 |
| 인쇄 | export 모드에서 모든 슬라이드 펼쳐짐, `data-export-hidden` 요소 숨김 |
| 한국어 검수 | 오탈자, 문장 일관성 (존댓말 발표 톤) |
| 빌드 | `npm run build` 무경고 통과 |

---

## 10. 리스크와 완화

| 리스크 | 영향 | 완화 |
|---|---|---|
| Anthropic 데이터 표기 누락 | 신뢰도 저하 | 정량 슬라이드 모두 `source` 필드 필수화 (검증 기준 포함) |
| 슬라이드 분량 초과 (25장 → 30+) | 발표 시간 초과 | Act별 슬라이드 수 고정. 추가 메시지는 발표자 노트에 별도 보관 |
| 본인 사례 노출이 너무 과해 자랑처럼 보임 | 메시지 흐림 | Act 4 (4장)로 한정, "운영하며 배운 것"으로 결론을 일반화 |
| 모델 버전 정보의 단기 변동 (Opus 4.7 이후 새 모델 등장 시) | 자료 노후화 | 슬라이드 3, 23의 모델 명을 `slides` 배열 상단 상수로 분리하여 1포인트 수정 가능 |
| 인용 데이터 해석 편향 | 도발적 톤이 과장 비판 받을 수 있음 | 출처 URL을 마지막 references 슬라이드에 모두 노출, 도발 슬라이드 다음에는 반드시 실증 슬라이드 배치 |

---

## 11. 비결정 사항 (이번 spec 범위 외)

- 발표자 노트(speaker notes) 분리 표시 여부 — 일단 슬라이드 본문에 포함하되 화면에는 미노출
- 다국어 영문 버전 — out of scope
- 인터랙티브 demo (e.g. Eval 시뮬레이션) — out of scope

---

## 12. 다음 단계

1. 본 spec 문서 → spec-document-reviewer 리뷰 루프 → 사용자 최종 검토
2. 승인 후 `writing-plans` 스킬로 구현 계획 문서 작성 (`docs/superpowers/plans/2026-05-19-ai-native-presentation-plan.md`)
3. `subagent-driven-development` 로 구현 진행
