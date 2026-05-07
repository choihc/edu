import { useEffect, useState, useCallback } from "react";

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

const slides = [
  // 1. 타이틀
  {
    kind: "title",
    eyebrow: "내부 도구 소개",
    title: "스펙매니저",
    subtitle: "spec-manager",
    tagline: "AI 네이티브 스펙 협업 플랫폼",
    desc: "Wiki · Jira · URL 등 흩어진 기술 문서를 한 곳에 모으고,\n직군별 시니어 관점의 AI 리뷰와 실시간 AI 채팅으로 협업을 가속합니다.",
  },

  // 2. 한 줄 요약
  {
    kind: "quote",
    eyebrow: "한 줄 요약",
    quote:
      "기획 / 개발 / QA 전 직군의 시니어가 밤새 리뷰해준 결과를\n10초 만에 얻고, 이어서 AI와 대화하며 의문점을 해결하는\n스펙 협업 도구",
    stat: { value: "700+", label: "실제 업무에 활용 중인 스펙" },
  },

  // 3. 왜 만들었나
  {
    kind: "problems",
    eyebrow: "왜 만들었나",
    title: "실무에서 반복되던 문제 → 스펙매니저의 해결",
    rows: [
      { p: "스펙이 Confluence · Jira · README · Figma · URL에 흩어져 있다", s: "하나의 스펙에 복수 소스를 묶어서 관리" },
      { p: "리뷰해 줄 시니어가 부족 / 내 직군 외 관점이 비어 있다", s: "7개 직군 시니어 페르소나 AI 리뷰 자동 생성" },
      { p: "궁금한 게 생기면 작성자를 기다려야 한다", s: "스펙 문맥을 AI에 주입한 상태로 실시간 채팅" },
      { p: "개정 스펙에서 무엇이 바뀌었는지 추적 어렵다", s: "이전 버전 vs 현재 버전 동시 리뷰, 변경 감지 알림" },
      { p: "구현이 스펙과 따로 노는지 확인 어렵다", s: "GitHub 레포 연결 후 코드 기반 구현 검증 리뷰" },
    ],
  },

  // 4. 주요 기능 개요
  {
    kind: "featureGrid",
    eyebrow: "주요 기능",
    title: "7가지 핵심 기능",
    features: [
      { icon: "🗂", title: "다중 소스 스펙 구성", desc: "Wiki · Jira · URL · Figma — 하나의 스펙에 여러 소스 묶음", color: palette.indigo, bg: palette.indigoLight },
      { icon: "🧑‍⚖️", title: "직군별 AI 리뷰", desc: "기획 / FE / BE / iOS / Android / Desktop / QA — 7개 페르소나", color: palette.pink, bg: palette.pinkLight },
      { icon: "💬", title: "AI 채팅", desc: "원본 · 리뷰 · 이전 버전 · 노트 · 위키를 자동 컨텍스트 주입", color: palette.emerald, bg: palette.emeraldLight, highlight: true },
      { icon: "📝", title: "팀 노트 & 댓글", desc: "이미지 첨부 · 비동기 토론 · 읽음 추적(레드닷)", color: palette.amber, bg: palette.amberLight },
      { icon: "🔗", title: "스펙 공유", desc: "토큰 초대 링크 · view / participate / owner 권한", color: palette.violet, bg: palette.violetLight, highlight: true },
      { icon: "🐙", title: "GitHub 코드 리뷰", desc: "AI가 관련 소스 자동 선택 → 스펙↔구현 일치 검증", color: palette.sky, bg: palette.skyLight },
    ],
  },

  // 5. 7개 직군 AI 리뷰
  {
    kind: "personas",
    eyebrow: "핵심 기능",
    title: "7개 직군 시니어 페르소나 AI 리뷰",
    note: "버튼 한 번으로 — 각 리뷰는 높음 / 중간 / 낮음 심각도로 태깅되고 스트리밍 실시간 출력",
    items: [
      { emoji: "🎯", role: "기획 (PM/PO)", focus: "비즈니스 목표 · 요구사항 완성도 · 사용자 가치 · 엣지케이스", color: palette.indigo, bg: palette.indigoLight },
      { emoji: "🎨", role: "FE", focus: "UI/UX 일관성 · 상태 관리 · 성능 · 접근성", color: palette.pink, bg: palette.pinkLight },
      { emoji: "⚙️", role: "BE", focus: "API 설계 · 데이터 모델 · 확장성 · 장애 전파", color: palette.emerald, bg: palette.emeraldLight },
      { emoji: "📱", role: "iOS / Android", focus: "플랫폼 가이드라인 · 백그라운드 동작 · 메모리·배터리", color: palette.amber, bg: palette.amberLight },
      { emoji: "💻", role: "Desktop", focus: "OS별 동작 · 업데이트 채널 · 리소스 점유", color: palette.violet, bg: palette.violetLight },
      { emoji: "🧪", role: "QA", focus: "테스트 가능성 · 경계값 · 회귀 리스크 · 재현 시나리오", color: palette.sky, bg: palette.skyLight },
    ],
  },

  // 6. 사용자 플로우
  {
    kind: "flows",
    eyebrow: "사용자 플로우 (시연)",
    title: "3가지 대표 시나리오",
    flows: [
      {
        tag: "Flow A",
        title: "Wiki 스펙 → 전방위 리뷰 → 공유",
        color: palette.indigo,
        bg: palette.indigoLight,
        steps: [
          "Confluence URL을 붙여넣어 스펙 생성",
          "메타데이터 자동 수집 (제목·본문·이미지)",
          "저장 후 직군별 리뷰 버튼 클릭",
          "FE · QA 관점 심각도별 이슈 리포트 생성",
          "궁금한 지점 [[섹션]] 인용하며 AI 채팅",
          "팀원 초대 링크로 공유",
        ],
      },
      {
        tag: "Flow B",
        title: "Jira 이슈 기반 요구사항 명세",
        color: palette.emerald,
        bg: palette.emeraldLight,
        steps: [
          "Jira 이슈 키 입력 → 이슈 메타 자동 로드",
          "스펙 설명 + 첨부 + 댓글 병합",
          "AI가 수락 기준(AC) 누락 여부 점검",
          "리뷰 결과를 Jira 댓글로 역전송",
        ],
      },
      {
        tag: "Flow C",
        title: "구현 검증 (스펙 ↔ 코드)",
        color: palette.amber,
        bg: palette.amberLight,
        steps: [
          "GitHub 레포 · 브랜치 연결",
          "FE 리뷰 선택 → AI가 관련 소스 자동 선정",
          "예: \"X 컴포넌트 스펙이 components/Y.tsx와 불일치\"",
        ],
      },
    ],
  },

  // 7. AI-Native 1 (게이트웨이 · 페르소나 · 컨텍스트 · 스트리밍)
  {
    kind: "aiNative",
    eyebrow: "AI-Native (1/2)",
    title: "AI가 설계의 중심에 있는 도구",
    note: "\"AI 기능이 하나 붙은 도구\"가 아닙니다.",
    items: [
      {
        n: "5.1", icon: "🔀", title: "이중 AI 게이트웨이 + 자동 폴백",
        body: "상용 API(aac-api, GPT·Claude·Gemini) + NAMC Open Models(gemma-4-31B-it). 실패 시 상용 API로 자동 폴백. AI_MODEL 환경변수로 교체 가능.",
      },
      {
        n: "5.2", icon: "🎭", title: "7개 페르소나 프롬프트 시스템",
        body: "systemPrompt + outputFormat 쌍을 DB(prompt_configs)에 저장. 운영 중 수정 가능, 이력(prompt_history) 보존. 심각도 아이콘·섹션 구조 고정.",
      },
      {
        n: "5.3", icon: "🧩", title: "멀티 소스 자동 컨텍스트 주입",
        body: "Wiki 원문 + 현재 리뷰 + 이전 버전 + 선택 노트 + 참고 위키 + Jira 최신 댓글 3개를 한 프롬프트에 조립. 프롬프트 인젝션 방어 경고 구분선 자동 삽입.",
      },
      {
        n: "5.4", icon: "📡", title: "스트리밍 기반 실시간 UX",
        body: "ReadableStream 청크 출력 → 긴 리뷰도 첫 줄 즉시 표시. Vercel AI SDK(ai@6, @ai-sdk/react)의 useChat + createUIMessageStream. onFinish에서 DB 저장.",
      },
    ],
  },

  // 8. AI-Native 2 (Vision · GitHub · 위키 · 추천 · PE · Dev Loop)
  {
    kind: "aiNative",
    eyebrow: "AI-Native (2/2)",
    title: "AI는 기능 이상의 운영 철학",
    items: [
      {
        n: "5.5", icon: "🖼", title: "Vision 지원",
        body: "채팅 이미지 붙여넣기 → S3 업로드 → 호출 직전 바이너리 로드 → ImagePart 변환. 와이어프레임·에러 스크린샷 직접 질의.",
      },
      {
        n: "5.6 · 5.7", icon: "🧭", title: "관련 파일 / 위키 AI 자동 선정",
        body: "스펙 내용 → 관련 소스 파일 후보를 AI가 추출해 리뷰에 동봉. 위키 본문에서 검색 키워드 추출 → Confluence 결과를 AI가 관련도 재정렬.",
      },
      {
        n: "5.8 · 5.9", icon: "✨", title: "AI 질문 추천 + PE 내재화",
        body: "처음/답변 후 \"다음 질문 3개\"를 NAMC가 JSON 스키마로 생성. \"모르는 건 모른다\" 원칙, 700자 길이 제한 등 가드레일 프롬프트 내장.",
      },
      {
        n: "5.10", icon: "🔁", title: "AI-Native Dev Loop",
        body: "SDD(Spec-Driven Development) + TDD. docs/superpowers/{specs,plans}를 먼저 작성 → AI 에이전트가 그걸 근거로 구현. PR 전 시니어 서브에이전트 리뷰 라운드 필수.",
      },
    ],
  },

  // 9. 기술 스택
  {
    kind: "stack",
    eyebrow: "기술 스택",
    title: "Tech Stack",
    groups: [
      { label: "Frontend", items: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS"], color: palette.indigo, bg: palette.indigoLight },
      { label: "State", items: ["TanStack React Query"], color: palette.pink, bg: palette.pinkLight },
      { label: "Backend", items: ["Next.js Route Handlers", "Drizzle ORM"], color: palette.emerald, bg: palette.emeraldLight },
      { label: "DB", items: ["MySQL (Vitess 호환)"], color: palette.amber, bg: palette.amberLight },
      { label: "AI SDK", items: ["ai v6", "@ai-sdk/openai", "@ai-sdk/react"], color: palette.violet, bg: palette.violetLight },
      { label: "AI Gateway", items: ["사내 상용 API (OpenAI 호환)", "NAMC Open Models"], color: palette.sky, bg: palette.skyLight },
      { label: "Auth", items: ["JWT (jose)", "bcryptjs", "세션 쿠키"], color: palette.indigo, bg: palette.indigoLight },
      { label: "Storage", items: ["NCloud Object Storage", "AWS S3"], color: palette.pink, bg: palette.pinkLight },
      { label: "Markdown", items: ["react-markdown", "remark-gfm", "rehype-highlight", "rehype-raw"], color: palette.emerald, bg: palette.emeraldLight },
    ],
  },

  // 10. 아키텍처 특이사항
  {
    kind: "architecture",
    eyebrow: "아키텍처 특이사항",
    title: "설계에서 신경 쓴 포인트",
    items: [
      { icon: "🗄", title: "복수 소스 테이블 설계", desc: "specs 1:N spec_sources, sourceType으로 Wiki/Jira/URL 구분. 레거시 specs.wikiUrl 폴백 유지." },
      { icon: "🔑", title: "사용자별 토큰 우선 정책", desc: "본인 Jira·Wiki·GitHub 토큰을 우선 사용 → 없으면 팀 공용 환경변수로 폴백. 감사 추적 가능." },
      { icon: "🛡", title: "SSRF 다층 방어 (URL 소스)", desc: "URL 검증 → DNS 후 IP 대역 검증 → 사설/특수 대역 차단 → redirect 3회 제한 → 5분 쿨다운." },
      { icon: "🔴", title: "읽음 추적", desc: "note_read_status(spec_id, user_id, last_read_at) 복합 PK. 행이 없거나 last_read_at < created_at이면 레드닷." },
      { icon: "📦", title: "JSON 컬럼 활용", desc: "Vitess 호환성 + 유연성. summaryHtml · imageUrls · jiraIssueData · repoSettings 등 JSON 저장." },
    ],
  },

  // 11. 로드맵 & 운영
  {
    kind: "closing",
    eyebrow: "로드맵 · 마무리",
    title: "다음 단계",
    roadmap: [
      "Claude Code · Cursor · Windsurf 등 AI 개발툴에서 Skill / MCP 로 스펙 fetch · 리뷰 조회 · 노트 추가 (IDE 안에서 스펙매니저 사용)",
      "Tool Use / Function Calling 기반 에이전트형 리뷰 (Jira 상태 변경까지 자동)",
      "RAG / 임베딩 기반 사내 스펙 크로스 검색",
      "리뷰 결과 피드백 루프 (👍/👎 → 프롬프트 개선)",
      "Slack / 메일 연동 변경 알림",
    ],
    ops: [
      "관리자 페이지: 사용자 관리, 프롬프트 편집(이력 포함)",
      "마이그레이션: Drizzle 기반 (npm run db:migrate)",
      "시드: seed:prompts · seed:review-configs · db:seed-admin",
      "Dockerfile 규칙: 신규 환경변수는 ARG/ENV 쌍 필수",
    ],
  },
];

function Chrome({ idx, total, slide, children, onPrev, onNext, onGoto }) {
  return (
    <div style={{
      fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
      background: palette.bg,
      minHeight: "100vh",
      color: palette.text,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Top bar */}
      <div style={{
        borderBottom: `1px solid ${palette.border}`,
        background: palette.surface,
        padding: "12px 28px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>📘</span>
          <strong style={{ fontSize: 15, color: palette.text }}>스펙매니저 소개</strong>
          <span style={{
            background: palette.indigoLight,
            color: palette.indigo,
            border: `1px solid ${palette.indigo}40`,
            fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 600,
          }}>
            발표 자료
          </span>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
          <a
            href="#/"
            style={{ fontSize: 13, color: palette.textMuted, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = palette.indigo)}
            onMouseLeave={e => (e.currentTarget.style.color = palette.textMuted)}
          >
            ← 메인으로
          </a>
          <div style={{ fontSize: 13, color: palette.textMuted, fontVariantNumeric: "tabular-nums" }}>
            {idx + 1} / {total}
          </div>
        </div>
      </div>

      {/* Slide area */}
      <div style={{ flex: 1, display: "flex", alignItems: "stretch", justifyContent: "center", padding: "32px 28px" }}>
        <div style={{
          width: "100%",
          maxWidth: 1100,
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 20,
          boxShadow: "0 10px 40px rgba(15,23,42,0.06)",
          padding: "48px 56px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}>
          {children}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{
        borderTop: `1px solid ${palette.border}`,
        background: palette.surface,
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <button
          onClick={onPrev}
          disabled={idx === 0}
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: 10,
            padding: "10px 18px",
            fontSize: 14, fontWeight: 600,
            color: idx === 0 ? palette.textFaint : palette.text,
            cursor: idx === 0 ? "not-allowed" : "pointer",
            opacity: idx === 0 ? 0.6 : 1,
          }}
        >
          ← 이전
        </button>

        <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 6 }}>
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => onGoto(i)}
              style={{
                width: i === idx ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                background: i === idx ? palette.indigo : palette.border,
                cursor: "pointer",
                transition: "all 0.2s",
                padding: 0,
              }}
              aria-label={`슬라이드 ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={idx === total - 1}
          style={{
            background: idx === total - 1 ? palette.surface : palette.indigo,
            border: `1px solid ${idx === total - 1 ? palette.border : palette.indigo}`,
            borderRadius: 10,
            padding: "10px 18px",
            fontSize: 14, fontWeight: 600,
            color: idx === total - 1 ? palette.textFaint : "#fff",
            cursor: idx === total - 1 ? "not-allowed" : "pointer",
            opacity: idx === total - 1 ? 0.6 : 1,
          }}
        >
          다음 →
        </button>
      </div>
    </div>
  );
}

function Eyebrow({ children, color = palette.indigo }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 700, letterSpacing: 2,
      color, textTransform: "uppercase", marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

function TitleSlide({ s }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
        <h1 style={{ margin: 0, fontSize: 64, fontWeight: 800, letterSpacing: "-1.5px", color: palette.text }}>
          {s.title}
        </h1>
        <span style={{ fontSize: 22, color: palette.textMuted, fontFamily: "ui-monospace, monospace" }}>
          {s.subtitle}
        </span>
      </div>
      <div style={{
        display: "inline-block",
        background: "linear-gradient(90deg, #eef2ff 0%, #fdf2f8 50%, #ecfdf5 100%)",
        border: `1px solid ${palette.border}`,
        padding: "10px 18px", borderRadius: 24,
        fontSize: 16, fontWeight: 700, color: palette.indigo,
        marginBottom: 28, alignSelf: "flex-start",
      }}>
        {s.tagline}
      </div>
      <p style={{
        margin: 0, fontSize: 19, lineHeight: 1.8, color: palette.textSub, whiteSpace: "pre-line", maxWidth: 820,
      }}>
        {s.desc}
      </p>
      <div style={{ marginTop: 40, display: "flex", gap: 10, fontSize: 13, color: palette.textFaint }}>
        <span>←/→ 키로 이동</span>
        <span>·</span>
        <span>숫자 키 1-9로 점프</span>
      </div>
    </div>
  );
}

function QuoteSlide({ s }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <div style={{
        fontSize: 60, lineHeight: 1, color: palette.indigo, marginBottom: 4,
      }}>"</div>
      <p style={{
        margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.55,
        color: palette.text, whiteSpace: "pre-line",
      }}>
        {s.quote}
      </p>
      <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{
          background: palette.indigoLight,
          border: `1px solid ${palette.indigo}40`,
          borderRadius: 16,
          padding: "18px 24px",
          display: "flex", alignItems: "baseline", gap: 12,
        }}>
          <span style={{ fontSize: 42, fontWeight: 800, color: palette.indigo, letterSpacing: "-1px" }}>
            {s.stat.value}
          </span>
          <span style={{ fontSize: 15, color: palette.textSub, fontWeight: 600 }}>
            {s.stat.label}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProblemsSlide({ s }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Eyebrow color={palette.pink}>{s.eyebrow}</Eyebrow>
      <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: palette.text, marginBottom: 24 }}>
        {s.title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {s.rows.map((r, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center",
          }}>
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12,
              padding: "14px 18px", fontSize: 15, color: palette.textSub, lineHeight: 1.6,
            }}>
              {r.p}
            </div>
            <div style={{ color: palette.textFaint, fontSize: 20 }}>→</div>
            <div style={{
              background: palette.emeraldLight, border: `1px solid ${palette.emerald}40`, borderRadius: 12,
              padding: "14px 18px", fontSize: 15, color: palette.textSub, lineHeight: 1.6, fontWeight: 500,
            }}>
              {r.s}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureGridSlide({ s }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: palette.text, marginBottom: 24 }}>
        {s.title}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {s.features.map((f, i) => (
          <div key={i} style={{
            background: f.highlight ? f.bg : palette.surface,
            border: `1px solid ${f.highlight ? f.color + "55" : palette.border}`,
            borderRadius: 14,
            padding: "20px 22px",
            boxShadow: f.highlight ? `0 4px 20px ${f.color}20` : "0 1px 2px rgba(15,23,42,0.04)",
            position: "relative",
          }}>
            {f.highlight && (
              <span style={{
                position: "absolute", top: 12, right: 12,
                background: f.color, color: "#fff",
                fontSize: 10, padding: "3px 8px", borderRadius: 12, fontWeight: 700, letterSpacing: 0.5,
              }}>
                핵심
              </span>
            )}
            <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: palette.text, marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: palette.textMuted, lineHeight: 1.65 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonasSlide({ s }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Eyebrow color={palette.pink}>{s.eyebrow}</Eyebrow>
      <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: palette.text, marginBottom: 10 }}>
        {s.title}
      </h2>
      <p style={{ margin: "0 0 22px", fontSize: 14, color: palette.textMuted }}>{s.note}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {s.items.map((p, i) => (
          <div key={i} style={{
            background: p.bg, border: `1px solid ${p.color}40`, borderRadius: 12,
            padding: "16px 18px", display: "flex", alignItems: "flex-start", gap: 14,
          }}>
            <span style={{ fontSize: 32, lineHeight: 1 }}>{p.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: p.color, marginBottom: 4 }}>{p.role}</div>
              <div style={{ fontSize: 13, color: palette.textSub, lineHeight: 1.65 }}>{p.focus}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {["높음", "중간", "낮음"].map((sev, i) => {
          const c = [palette.pink, palette.amber, palette.emerald][i];
          return (
            <span key={sev} style={{
              background: `${c}15`, border: `1px solid ${c}40`, color: c,
              fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
            }}>
              심각도 · {sev}
            </span>
          );
        })}
        <span style={{
          background: palette.surface, border: `1px dashed ${palette.borderStrong || palette.border}`,
          color: palette.textMuted, fontSize: 12, padding: "4px 12px", borderRadius: 20,
        }}>
          스트리밍 실시간 출력
        </span>
      </div>
    </div>
  );
}

function FlowsSlide({ s }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Eyebrow color={palette.emerald}>{s.eyebrow}</Eyebrow>
      <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: palette.text, marginBottom: 20 }}>
        {s.title}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {s.flows.map((f, i) => (
          <div key={i} style={{
            background: f.bg, border: `1px solid ${f.color}40`, borderRadius: 14,
            padding: "18px 20px",
          }}>
            <div style={{
              display: "inline-block", background: f.color, color: "#fff",
              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12, letterSpacing: 0.5,
              marginBottom: 10,
            }}>
              {f.tag}
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: f.color, marginBottom: 12, lineHeight: 1.4 }}>
              {f.title}
            </div>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {f.steps.map((st, j) => (
                <li key={j} style={{ display: "flex", gap: 10, fontSize: 13, color: palette.textSub, lineHeight: 1.55 }}>
                  <span style={{
                    flexShrink: 0, width: 20, height: 20, borderRadius: "50%",
                    background: "#fff", border: `1px solid ${f.color}50`,
                    color: f.color, fontSize: 11, fontWeight: 700,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {j + 1}
                  </span>
                  <span>{st}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiNativeSlide({ s }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Eyebrow color={palette.violet}>{s.eyebrow}</Eyebrow>
      <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: palette.text, marginBottom: 6 }}>
        {s.title}
      </h2>
      {s.note && (
        <p style={{ margin: "0 0 22px", fontSize: 14, color: palette.textMuted, fontStyle: "italic" }}>
          {s.note}
        </p>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {s.items.map((it, i) => (
          <div key={i} style={{
            background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12,
            padding: "18px 20px", boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 26 }}>{it.icon}</span>
              <span style={{
                fontSize: 11, fontWeight: 700, color: palette.violet,
                background: palette.violetLight, padding: "3px 8px", borderRadius: 10, letterSpacing: 0.5,
              }}>
                {it.n}
              </span>
              <strong style={{ fontSize: 15, color: palette.text }}>{it.title}</strong>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: palette.textSub, lineHeight: 1.7 }}>
              {it.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackSlide({ s }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Eyebrow color={palette.sky}>{s.eyebrow}</Eyebrow>
      <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: palette.text, marginBottom: 24 }}>
        {s.title}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {s.groups.map((g, i) => (
          <div key={i} style={{
            background: g.bg, border: `1px solid ${g.color}35`, borderRadius: 12,
            padding: "16px 18px",
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, letterSpacing: 1.5,
              color: g.color, textTransform: "uppercase", marginBottom: 10,
            }}>
              {g.label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {g.items.map((it, j) => (
                <div key={j} style={{ fontSize: 14, color: palette.text, fontWeight: 500 }}>
                  {it}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchitectureSlide({ s }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Eyebrow color={palette.amber}>{s.eyebrow}</Eyebrow>
      <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: palette.text, marginBottom: 24 }}>
        {s.title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {s.items.map((it, i) => (
          <div key={i} style={{
            background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12,
            padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 16,
            boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
          }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>{it.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: palette.text, marginBottom: 4 }}>{it.title}</div>
              <div style={{ fontSize: 13, color: palette.textSub, lineHeight: 1.7 }}>{it.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClosingSlide({ s }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: palette.text, marginBottom: 24 }}>
        {s.title}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{
          background: palette.indigoLight, border: `1px solid ${palette.indigo}40`,
          borderRadius: 14, padding: "20px 22px",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: palette.indigo, marginBottom: 12, letterSpacing: 1 }}>
            🚀 ROADMAP
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {s.roadmap.map((r, i) => (
              <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: palette.textSub, lineHeight: 1.6 }}>
                <span style={{ color: palette.indigo, fontWeight: 700 }}>→</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{
          background: palette.emeraldLight, border: `1px solid ${palette.emerald}40`,
          borderRadius: 14, padding: "20px 22px",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: palette.emerald, marginBottom: 12, letterSpacing: 1 }}>
            🛠 OPERATIONS
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {s.ops.map((r, i) => (
              <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: palette.textSub, lineHeight: 1.6 }}>
                <span style={{ color: palette.emerald, fontWeight: 700 }}>✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{
        marginTop: "auto", paddingTop: 32, display: "flex", alignItems: "center", gap: 18,
        borderTop: `1px dashed ${palette.border}`,
      }}>
        <div style={{ fontSize: 40 }}>🙌</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: palette.text, marginBottom: 4 }}>감사합니다</div>
          <div style={{ fontSize: 13, color: palette.textMuted }}>
            기능 제안 / 버그 제보 — 내부 이슈 트래커 <code style={{
              background: palette.surface, padding: "2px 6px", borderRadius: 4, fontSize: 12,
              border: `1px solid ${palette.border}`,
            }}>spec-manager</code> 프로젝트
          </div>
        </div>
      </div>
    </div>
  );
}

function renderSlide(slide) {
  switch (slide.kind) {
    case "title": return <TitleSlide s={slide} />;
    case "quote": return <QuoteSlide s={slide} />;
    case "problems": return <ProblemsSlide s={slide} />;
    case "featureGrid": return <FeatureGridSlide s={slide} />;
    case "personas": return <PersonasSlide s={slide} />;
    case "flows": return <FlowsSlide s={slide} />;
    case "aiNative": return <AiNativeSlide s={slide} />;
    case "stack": return <StackSlide s={slide} />;
    case "architecture": return <ArchitectureSlide s={slide} />;
    case "closing": return <ClosingSlide s={slide} />;
    default: return null;
  }
}

export default function Presentation() {
  const [idx, setIdx] = useState(() => {
    const m = window.location.hash.match(/^#\/spec-manager\/(\d+)/);
    if (m) {
      const n = parseInt(m[1], 10) - 1;
      return Math.max(0, Math.min(slides.length - 1, n));
    }
    return 0;
  });

  const goto = useCallback((i) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    setIdx(clamped);
    const newHash = clamped === 0 ? "#/spec-manager" : `#/spec-manager/${clamped + 1}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, "", newHash);
    }
  }, []);

  const next = useCallback(() => goto(idx + 1), [idx, goto]);
  const prev = useCallback(() => goto(idx - 1), [idx, goto]);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
      else if (e.key === "Home") { e.preventDefault(); goto(0); }
      else if (e.key === "End") { e.preventDefault(); goto(slides.length - 1); }
      else if (/^[1-9]$/.test(e.key)) {
        const n = parseInt(e.key, 10) - 1;
        if (n < slides.length) { e.preventDefault(); goto(n); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, goto]);

  return (
    <Chrome
      idx={idx}
      total={slides.length}
      slide={slides[idx]}
      onPrev={prev}
      onNext={next}
      onGoto={goto}
    >
      {renderSlide(slides[idx])}
    </Chrome>
  );
}
