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
          { title: "이 발표 자체의 spec/plan", url: "#" },
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
