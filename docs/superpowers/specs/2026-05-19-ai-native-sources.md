# AI Native 발표 — 인용 자료 검증 부록

본 부록은 발표 슬라이드(`/ai-native`)에 사용되는 모든 정량/실증 자료의 실재성을 4필드(URL/접근일/인용 원문/발췌 위치)로 검증한다. 검증 누락 자료가 있으면 해당 슬라이드는 정량 표시 대신 정성 메시지로 대체한다.

---

## 1차 자료 (Anthropic)

### S1. How AI Is Transforming Work at Anthropic

- **URL**: https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic
- **접근일**: 2026-05-19
- **발췌 위치**: "Productivity Gains" / "Task Distribution" 단락
- **인용 원문**:
  > "59% of daily work now involves Claude (up from 28% a year prior) ... 50% productivity boost ... 67% increase in merged pull requests—i.e. successfully incorporated changes to code—per engineer per day after Claude Code adoption ... maximum consecutive tool calls increased 116% (9.8 → 21.2) ... human turns decreased 33% (6.2 → 4.1)"

  실제 확인된 수치:
  - Claude 사용률: 28% → 59% (12개월 전 대비)
  - 생산성 향상: +20% → +50%
  - Merged pull requests per engineer per day: **67% 증가**
  - Tool calls: 9.8 → 21.2 (116% 증가)
  - Human turns: 6.2 → 4.1 (33% 감소)
  - 조사 규모: 132명 설문, 53명 심층 인터뷰, 20만 건 Claude Code 분석

- **사용 슬라이드**: 4, 5, 9

---

### S2. Anthropic Economic Index — Learning Curves (March 2026)

- **URL**: https://www.anthropic.com/research/economic-index-march-2026-report
- **접근일**: 2026-05-19
- **발췌 위치**: "Learning Curve Findings" / "Model Selection Patterns" 단락
- **인용 원문**:
  > "people in this higher-tenure group have a 10% higher success rate in their conversations."

  > "34% of Software Developer tasks involve Opus compared to just 12% of Tutor tasks."

  > "Coding remains the most common use on our platforms, with tasks associated with Computer and Mathematical occupations accounting for 35% of conversations on Claude.ai."

  실제 확인된 수치:
  - High-tenure users (6+ months): 성공률 10% 포인트 높음 (통제 변수 적용 시 3~4pp)
  - Software developers의 Opus 사용 비율: **34%** (Tutor 12% 대비)
  - Computer/Mathematical tasks: Claude.ai 대화의 **35%** 차지
  - 고임금 직종일수록 Opus 선택 증가: 시급 $10 상승마다 Opus 비율 1.5pp 증가

- **사용 슬라이드**: 12

---

### S3. Building Effective AI Agents (2024.12)

- **URL**: https://www.anthropic.com/research/building-effective-agents
- **접근일**: 2026-05-19
- **발췌 위치**: workflow patterns 단락
- **인용 원문**:
  > "Prompt chaining decomposes a task into a sequence of steps, where each LLM call processes the output of the previous one."

  > "Routing classifies an input and directs it to a specialized followup task."

  > "LLMs can sometimes work simultaneously on a task and have their outputs aggregated programmatically." (Parallelization)

  > "In the orchestrator-workers workflow, a central LLM dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results."

  > "In the evaluator-optimizer workflow, one LLM call generates a response while another provides evaluation and feedback in a loop."

  5가지 패턴: **prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer**

- **사용 슬라이드**: 15

---

### S4. Demystifying Evals for AI Agents (2026.01)

- **URL**: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- **접근일**: 2026-05-19
- **발췌 위치**: "Core Methodology" / "Grader Types" / "Handling Non-Determinism" 단락
- **인용 원문**:
  > Code-based: "Fast, Cheap, Objective, Reproducible, Easy to debug, Verify specific conditions"

  > Model-based: "Flexible, Scalable, Captures nuance, Handles open-ended tasks"

  > Human: "Gold standard quality, Matches expert user judgment"

  > "pass@k measures the likelihood that an agent gets at least one correct solution in k attempts"

  > "pass^k measures the probability that all k trials succeed"

  > "20-50 simple tasks drawn from real failures is a great start"

- **사용 슬라이드**: 16, 17

---

### S5. How AI Assistance Impacts the Formation of Coding Skills

- **URL**: https://www.anthropic.com/research/AI-assistance-coding-skills
- **접근일**: 2026-05-19
- **발췌 위치**: "Critical Performance Gap" 단락
- **인용 원문**:
  > "the AI group averaged 50% on the quiz, compared to 67% in the hand-coding group—or the equivalent of nearly two letter grades (Cohen's d=0.738, p=0.01)"

  실제 확인된 수치:
  - AI 그룹 평균: **50%**
  - Hand-coding 그룹 평균: **67%**
  - 차이: **17점**, 통계적 유의성: **p=0.01**, Cohen's d=0.738
  - 연구 대상: 52명의 소프트웨어 개발자

- **사용 슬라이드**: 7

---

### S6. Claude Opus / Sonnet 모델 페이지

- **URL (Opus)**: https://www.anthropic.com/claude/opus
- **URL (모델 개요)**: https://platform.claude.com/docs/en/about-claude/models/overview
- **접근일**: 2026-05-19
- **발췌 위치**: 모델 출시 일자
- **인용 원문**: "Claude Sonnet 4.6 launched in February 2026 ... Claude Opus 4.7 arrived in April 2026"
- **사용 슬라이드**: 3, 24

> **참고**: S6은 실제 fetch 검증 미수행 (URL 형식 확인만). 모델 출시일 정보는 공식 문서 기준이나 슬라이드 사용 전 재확인 권장.

---

## 보조 자료

### S7. Karpathy "Software 2.0" / "Software 3.0"

- **URL**: https://karpathy.medium.com/software-2-0-a64152b37c35
- **접근일**: 2026-05-19
- **발췌 위치**: 소프트웨어 패러다임 변화 논의
- **사용 슬라이드**: 3

---

### S8. Bloomberg "Claude Code and the Great Productivity Panic of 2026" (2026.02.26)

- **URL**: https://www.bloomberg.com/news/articles/2026-02-26/ai-coding-agents-like-claude-code-are-fueling-a-productivity-panic-in-tech
- **접근일**: 2026-05-19
- **발췌 위치**: 생산성 패닉 관련 보도
- **사용 슬라이드**: 7

> **참고**: Bloomberg는 유료 페이월로 인해 URL 형식만 확인.

---

### S9. OWASP LLM Top 10 v2 (2025)

- **URL**: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- **접근일**: 2026-05-19
- **사용 슬라이드**: 16, 25 (발표자 노트)

---

### S10. EU AI Act / NIST AI RMF

- **URL (EU AI Act)**: https://artificialintelligenceact.eu/
- **URL (NIST)**: https://www.nist.gov/itl/ai-risk-management-framework
- **접근일**: 2026-05-19
- **사용 슬라이드**: 24, 25 (발표자 노트)

---

### S11. Hamel Husain "Your AI Product Needs Evals"

- **URL**: https://hamel.dev/blog/posts/evals/
- **접근일**: 2026-05-19
- **사용 슬라이드**: 16

---

## 검증 상태

- S1: ☑ 검증 완료 — URL 접속 성공, 주요 수치(59%/28%, 50% 생산성, 67% PR 증가, 116% tool call, 33% human turns) 원문 확인
- S2: ☑ 검증 완료 — URL 접속 성공, 10% 성공률 차이, 34% Opus 사용(개발자), 35% Computer/Math tasks 원문 확인
- S3: ☑ 검증 완료 — URL 접속 성공, 5가지 workflow pattern 원문 정의 확인
- S4: ☑ 검증 완료 — URL 접속 성공, 3가지 grader 유형, pass@k/pass^k 정의, 20-50 tasks 권장 원문 확인
- S5: ☑ 검증 완료 — URL 접속 성공, 50% vs 67%, p=0.01 원문("the equivalent of nearly two letter grades") 확인
- S6: ☒ 미검증 — 모델 출시일 관련 URL(opus 페이지, models/overview)은 URL 형식만 확인. 슬라이드 사용 전 재확인 권장
- S7: — URL 형식 확인 (보조 자료, fetch 미수행)
- S8: — URL 형식 확인 (보조 자료, Bloomberg 페이월로 접근 불가)
- S9: — URL 형식 확인 (보조 자료, fetch 미수행)
- S10: — URL 형식 확인 (보조 자료, fetch 미수행)
- S11: — URL 형식 확인 (보조 자료, fetch 미수행)
