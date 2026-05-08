import { useState } from "react";

const personas = {
  pm: {
    id: "pm",
    label: "PM 에이전트",
    emoji: "🎯",
    color: "#4f46e5",
    bg: "#eef2ff",
    border: "#6366f1",
    tag: "기획 · 총지휘",
    desc: "10년 이상 경력의 프로덕트 매니저. 스펙 합의·우선순위·리스크 관리에 능함.",
    responsibilities: [
      "지시자와 대화하여 스펙 명확히 정리",
      "하위 태스크 분해 및 에이전트 배정",
      "이슈 상시 기록·추적 (블로커/결함/스펙공백)",
      "결과물 최종 스펙 검수",
      "미해결 이슈 포함 요약 보고",
    ],
    principle: '"모든 결정은 스펙과 지시자 의도에 수렴해야 한다."',
  },
  designer: {
    id: "designer",
    label: "디자이너 에이전트",
    emoji: "🎨",
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#ec4899",
    tag: "UI/UX 시니어",
    desc: "10년 이상 경력의 프로덕트 디자이너. IA, 접근성, 인터랙션, 디자인시스템 전문.",
    responsibilities: [
      "정보구조(IA) 및 화면 흐름 설계",
      "컴포넌트 계층·상태·반응형 명세",
      "디자인 토큰·컬러·타이포 일관성",
      "구현 중 UI 지속 리뷰 및 피드백",
      "엣지케이스(빈/에러/로딩) 점검",
    ],
    principle: '"다 만들고 리뷰"가 아닌 "만들면서 함께 다듬는다".',
  },
  primary: {
    id: "primary",
    label: "주작업 개발자",
    emoji: "⚡",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#10b981",
    tag: "Primary Developer",
    desc: "실제 구현 담당. 탐색→검색→분석→수정→검증 사이클 준수.",
    responsibilities: [
      "탐색 → 검색 → 분석 → 수정 → 검증 사이클",
      "최소 Diff 지향 구현",
      "매 컴포넌트/함수 구현 후 리뷰어에게 제출",
      "Critical 이슈 수정 후 재리뷰",
      "스코프 밖 파일 편집 금지",
    ],
    principle: '"리뷰어 리뷰 없이 단독 완료 선언 금지."',
  },
  reviewer: {
    id: "reviewer",
    label: "동료 리뷰어",
    emoji: "🔍",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#f59e0b",
    tag: "Peer Reviewer",
    desc: "주작업자와 대등한 시니어. 매 구현 직후 코드 리뷰 수행.",
    responsibilities: [
      "버그·보안·성능·타입 안전성 리뷰",
      "네이밍·중복·단일책임 원칙 점검",
      "Critical / Warning / Info 3단계 분류",
      "파일명:라인 형식으로 위치 명시",
      "PR 생성 전 별도 리뷰 라운드 수행",
    ],
    principle: '"Critical 이슈는 반드시 수정 후 재리뷰."',
  },
  supervisor: {
    id: "supervisor",
    label: "감독자",
    emoji: "🏛",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#a78bfa",
    tag: "Supervisor",
    desc: "상위 시니어. 이견 조정, 아키텍처 설계 정합성, 최종 승인.",
    responsibilities: [
      "주작업자·리뷰어 이견 최종 조정",
      "아키텍처·설계 정합성 감독",
      "장기 유지보수성 관점 검토",
      "각 Task 시작(계약확인) 체크포인트",
      "최종 머지 승인",
    ],
    principle: '"Task 시작과 끝 체크포인트에서 반드시 개입."',
  },
};

const workTypes = [
  { type: "새 기능 기획", combo: ["pm", "designer"], note: "개발자는 자문만" },
  { type: "UI/UX 개선", combo: ["pm", "designer", "primary", "reviewer", "supervisor"], note: "" },
  { type: "백엔드 / API / DB", combo: ["pm", "primary", "reviewer", "supervisor"], note: "" },
  { type: "풀스택 기능", combo: ["pm", "designer", "primary", "reviewer", "supervisor"], note: "레이어별 주작업자 분담 가능" },
  { type: "버그 수정 (단순)", combo: ["primary", "reviewer", "supervisor"], note: "감독자 최종 확인만" },
  { type: "리팩터 / 아키텍처", combo: ["pm", "primary", "reviewer", "supervisor"], note: "필요 시 디자이너 추가" },
  { type: "스펙 불명확", combo: ["pm"], note: "지시자와 대화 후 조합 확장" },
];

const flowSteps = [
  { step: "01", label: "접수", icon: "📥", desc: "PM이 지시자 요청 접수 → 스펙 정리 → 필요 페르소나 결정", agent: "pm" },
  { step: "02", label: "계획", icon: "📋", desc: "PM 주도 태스크 분해. 파일 소유권 + TS 인터페이스 계약 명시. 지시자 승인 후 착수.", agent: "pm" },
  { step: "03", label: "구현", icon: "⚙️", desc: "각 페르소나 하위 태스크 수행. 3인조 협동 원칙 준수. 디자이너 상시 리뷰.", agent: "primary" },
  { step: "04", label: "통합 검증", icon: "✅", desc: "PM이 tsc --noEmit, 전체 테스트, 빌드 실행. 레이어 경계 통합 이슈 재지시.", agent: "pm" },
  { step: "05", label: "보고", icon: "📊", desc: "PM이 지시자에게 요약 보고. 발견 이슈 및 미해결 항목 반드시 포함.", agent: "pm" },
];

const colorMap = {
  pm: "#4f46e5",
  designer: "#db2777",
  primary: "#059669",
  reviewer: "#d97706",
  supervisor: "#7c3aed",
};

// Light theme palette
const palette = {
  bg: "#f8fafc",           // page background
  surface: "#ffffff",      // card background
  surfaceAlt: "#f1f5f9",   // tabs / subtle background
  surfaceMuted: "#f8fafc", // info blocks
  border: "#e2e8f0",       // default border
  borderStrong: "#cbd5e1", // stronger border
  text: "#0f172a",         // primary text
  textSub: "#334155",      // secondary text
  textMuted: "#64748b",    // muted text
  textFaint: "#94a3b8",    // very muted
};

function PersonaTag({ id }) {
  const p = personas[id];
  return (
    <span style={{
      background: `${colorMap[id]}18`,
      border: `1px solid ${colorMap[id]}55`,
      color: colorMap[id],
      fontSize: 13,
      padding: "4px 12px",
      borderRadius: 20,
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
    }}>
      {p.emoji} {p.label.replace(" 에이전트", "")}
    </span>
  );
}

function PersonaCard({ persona, expanded, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: expanded ? persona.bg : palette.surface,
        border: `1px solid ${expanded ? persona.border : palette.border}`,
        borderRadius: 14,
        padding: "22px 24px",
        cursor: "pointer",
        transition: "all 0.25s",
        boxShadow: expanded ? `0 8px 32px ${persona.color}25` : "0 1px 2px rgba(15,23,42,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span style={{ fontSize: 30 }}>{persona.emoji}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: expanded ? persona.color : palette.text }}>{persona.label}</div>
          <div style={{ fontSize: 13, color: persona.color, fontWeight: 600 }}>{persona.tag}</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 14, color: palette.textFaint }}>{expanded ? "▲" : "▼"}</div>
      </div>
      <p style={{ fontSize: 14, color: palette.textMuted, lineHeight: 1.7, margin: 0 }}>{persona.desc}</p>
      {expanded && (
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 14 }}>
            {persona.responsibilities.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: persona.color, marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: palette.textSub, lineHeight: 1.7 }}>{r}</span>
              </div>
            ))}
          </div>
          <div style={{
            background: `${persona.color}15`,
            border: `1px solid ${persona.color}35`,
            borderRadius: 8,
            padding: "12px 16px",
            fontSize: 14,
            color: persona.color,
            fontStyle: "italic",
            lineHeight: 1.7,
          }}>
            {persona.principle}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [hoveredWork, setHoveredWork] = useState(null);

  const tabs = [
    { id: "overview", label: "전체 구조" },
    { id: "personas", label: "페르소나" },
    { id: "workflow", label: "실행 플로우" },
    { id: "combo", label: "작업 조합" },
    { id: "pr", label: "PR 프로세스" },
  ];

  return (
    <div style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", background: palette.bg, minHeight: "100vh", color: palette.text }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #eef2ff 0%, #fdf2f8 50%, #ecfdf5 100%)",
        borderBottom: `1px solid ${palette.border}`,
        padding: "24px 28px",
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>🤖</span>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", color: palette.text }}>
              멀티에이전트 개발 프로세스
            </h1>
            <span style={{ background: "#6366f118", border: "1px solid #6366f140", color: "#4f46e5", fontSize: 13, padding: "3px 12px", borderRadius: 20, fontWeight: 600 }}>
              CLAUDE.md
            </span>
            <a
              href="/spec-manager"
              style={{
                marginLeft: "auto",
                background: "#4f46e5", color: "#fff",
                fontSize: 13, padding: "6px 14px", borderRadius: 20,
                fontWeight: 600, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 6,
                boxShadow: "0 2px 8px rgba(79,70,229,0.25)",
              }}
            >
              📘 스펙매니저 발표 자료 →
            </a>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: palette.textMuted }}>
            시니어 페르소나 에이전트들의 협업으로 비자명한 작업을 수행한다
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: palette.surface, borderBottom: `1px solid ${palette.border}`, padding: "0 28px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", gap: 2 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "15px 20px", fontSize: 15, fontWeight: 600,
                color: activeTab === t.id ? "#4f46e5" : palette.textMuted,
                borderBottom: activeTab === t.id ? "2px solid #6366f1" : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px" }}>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            {/* PM 중심 */}
            <div
              onClick={() => { setSelectedPersona("pm"); setActiveTab("personas"); }}
              style={{
                background: "#eef2ff", border: "2px solid #6366f160", borderRadius: 16,
                padding: "24px 30px", marginBottom: 16, cursor: "pointer",
                boxShadow: "0 4px 24px #6366f118", display: "flex", alignItems: "center", gap: 20,
              }}
            >
              <span style={{ fontSize: 48 }}>🎯</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 22, color: "#4f46e5", marginBottom: 6 }}>PM 에이전트 — 프로젝트 총지휘자</div>
                <div style={{ fontSize: 14, color: palette.textSub, lineHeight: 1.8 }}>
                  메인 세션이 맡는 역할. 스펙 합의 → 태스크 분해 → 에이전트 배정 → 이슈 추적 → 최종 보고.
                  모든 페르소나 조합에 항상 포함된다.
                </div>
              </div>
              <div style={{ fontSize: 13, color: palette.textFaint }}>클릭하여 상세 →</div>
            </div>

            {/* 나머지 4 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {["designer", "primary", "reviewer", "supervisor"].map(id => {
                const p = personas[id];
                return (
                  <div
                    key={id}
                    onClick={() => { setSelectedPersona(id); setActiveTab("personas"); }}
                    style={{
                      background: palette.surface, border: `1px solid ${palette.border}`,
                      borderRadius: 12, padding: "18px 20px", cursor: "pointer",
                      transition: "all 0.2s", display: "flex", alignItems: "flex-start", gap: 14,
                      boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = p.color + "80";
                      e.currentTarget.style.background = p.bg;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = palette.border;
                      e.currentTarget.style.background = palette.surface;
                    }}
                  >
                    <span style={{ fontSize: 34 }}>{p.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: palette.text, marginBottom: 3 }}>{p.label}</div>
                      <div style={{ fontSize: 13, color: p.color, fontWeight: 600, marginBottom: 8 }}>{p.tag}</div>
                      <div style={{ fontSize: 13, color: palette.textMuted, lineHeight: 1.7 }}>{p.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 원칙 3개 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { icon: "🔄", title: "병렬 호출", desc: "독립 태스크는 서브에이전트를 병렬 호출하여 효율 극대화" },
                { icon: "📝", title: "계약 기반", desc: "파일 소유권 + TypeScript 인터페이스 계약을 태스크마다 명시" },
                { icon: "🛡", title: "직접 검증", desc: "메인 세션은 서브에이전트 결과를 맹신하지 않고 실제 diff 직접 검증" },
              ].map(c => (
                <div key={c.title} style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}>
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{c.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: palette.text, marginBottom: 6 }}>{c.title}</div>
                  <div style={{ fontSize: 14, color: palette.textMuted, lineHeight: 1.7 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PERSONAS ── */}
        {activeTab === "personas" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {Object.values(personas).map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersona(selectedPersona === p.id ? null : p.id)}
                  style={{
                    background: selectedPersona === p.id ? p.bg : palette.surface,
                    border: `1px solid ${selectedPersona === p.id ? p.border : palette.border}`,
                    borderRadius: 10, padding: "10px 18px", cursor: "pointer",
                    color: selectedPersona === p.id ? p.color : palette.textSub,
                    fontWeight: 600, fontSize: 14, transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <span>{p.emoji}</span> {p.label}
                </button>
              ))}
              {selectedPersona && (
                <button
                  onClick={() => setSelectedPersona(null)}
                  style={{ background: "none", border: `1px solid ${palette.borderStrong}`, borderRadius: 10, padding: "10px 16px", cursor: "pointer", color: palette.textMuted, fontSize: 14 }}
                >
                  전체 보기
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.values(personas)
                .filter(p => !selectedPersona || p.id === selectedPersona)
                .map(p => (
                  <PersonaCard
                    key={p.id}
                    persona={p}
                    expanded={selectedPersona === p.id}
                    onClick={() => setSelectedPersona(selectedPersona === p.id ? null : p.id)}
                  />
                ))}
            </div>

            {/* 3인조 사이클 */}
            <div style={{ marginTop: 20, background: "#ecfdf5", border: "1px solid #10b98140", borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#059669", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                ⚡ 개발자 3인조 협동 사이클
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "주작업자 구현", color: "#059669" },
                  { label: "→", color: palette.textFaint },
                  { label: "리뷰어 리뷰", color: "#d97706" },
                  { label: "→", color: palette.textFaint },
                  { label: "이견 시 감독자 결정", color: "#7c3aed" },
                  { label: "→", color: palette.textFaint },
                  { label: "다음 단계 진행", color: "#4f46e5" },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: item.label === "→" ? "none" : `${item.color}15`,
                      border: item.label === "→" ? "none" : `1px solid ${item.color}40`,
                      color: item.color,
                      padding: item.label === "→" ? "0" : "8px 16px",
                      borderRadius: 8, fontSize: 14, fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── WORKFLOW ── */}
        {activeTab === "workflow" && (
          <div>
            {flowSteps.map((s, i) => (
              <div
                key={s.step}
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{ display: "flex", gap: 18, marginBottom: 4 }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 64, flexShrink: 0 }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: "50%",
                    background: hoveredStep === i ? colorMap[s.agent] : palette.surface,
                    border: `2px solid ${hoveredStep === i ? colorMap[s.agent] : palette.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, transition: "all 0.3s",
                    boxShadow: hoveredStep === i ? `0 0 18px ${colorMap[s.agent]}40` : "0 1px 2px rgba(15,23,42,0.04)",
                  }}>
                    {s.icon}
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div style={{ width: 2, height: 40, background: palette.border, margin: "4px 0" }} />
                  )}
                </div>
                <div style={{
                  flex: 1, background: palette.surface,
                  border: `1px solid ${hoveredStep === i ? colorMap[s.agent] + "60" : palette.border}`,
                  borderRadius: 12, padding: "16px 20px", marginBottom: 4,
                  transition: "all 0.3s",
                  boxShadow: hoveredStep === i ? `0 4px 20px ${colorMap[s.agent]}20` : "0 1px 2px rgba(15,23,42,0.04)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: palette.textFaint, fontWeight: 700, letterSpacing: 2 }}>STEP {s.step}</span>
                    <span style={{ fontWeight: 700, fontSize: 17, color: palette.text }}>{s.label}</span>
                    <span style={{
                      background: `${colorMap[s.agent]}18`, border: `1px solid ${colorMap[s.agent]}40`,
                      color: colorMap[s.agent], fontSize: 13, padding: "3px 12px", borderRadius: 20, fontWeight: 600, marginLeft: "auto",
                    }}>
                      {personas[s.agent].emoji} {personas[s.agent].label}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: palette.textSub, lineHeight: 1.8 }}>{s.desc}</p>
                </div>
              </div>
            ))}

            {/* 이슈 분기 */}
            <div style={{ marginTop: 24, background: "#eef2ff", border: "1px solid #6366f140", borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#4f46e5", marginBottom: 16 }}>
                ⚠️ PM 상시 이슈 관리 분기
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { label: "즉시 해결", color: "#059669", bg: "#ecfdf5", icon: "⚡", desc: "해당 페르소나에 재지시" },
                  { label: "후속 과제", color: "#d97706", bg: "#fffbeb", icon: "📌", desc: "스코프 밖 → 별도 메모 후 보고에 포함" },
                  { label: "에스컬레이션", color: "#dc2626", bg: "#fef2f2", icon: "🚨", desc: "지시자 판단 필요 → 즉시 질문" },
                ].map(b => (
                  <div key={b.label} style={{ background: b.bg, border: `1px solid ${b.color}35`, borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{b.icon}</div>
                    <div style={{ fontWeight: 700, color: b.color, fontSize: 15, marginBottom: 6 }}>{b.label}</div>
                    <div style={{ fontSize: 13, color: palette.textMuted, lineHeight: 1.6 }}>{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── COMBO ── */}
        {activeTab === "combo" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              {workTypes.map((w, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredWork(i)}
                  onMouseLeave={() => setHoveredWork(null)}
                  style={{
                    background: hoveredWork === i ? "#eef2ff" : palette.surface,
                    border: `1px solid ${hoveredWork === i ? "#6366f160" : palette.border}`,
                    borderRadius: 12, padding: "18px 20px",
                    transition: "all 0.2s", cursor: "default",
                    boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 16, color: palette.text, marginBottom: 12 }}>{w.type}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: w.note ? 10 : 0 }}>
                    {w.combo.map(id => <PersonaTag key={id} id={id} />)}
                  </div>
                  {w.note && (
                    <div style={{ fontSize: 13, color: palette.textMuted, marginTop: 10 }}>
                      💡 {w.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12, padding: "14px 18px" }}>
              <span style={{ fontSize: 14, color: palette.textSub }}>
                💡 <strong style={{ color: "#4f46e5" }}>PM은 항상 포함</strong>됩니다. 작업 성격에 따라 필요한 페르소나만 선택적으로 구성합니다.
              </span>
            </div>
          </div>
        )}

        {/* ── PR ── */}
        {activeTab === "pr" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                step: "1단계", label: "서브에이전트 코드리뷰", icon: "🔍", color: "#d97706", bg: "#fffbeb",
                items: [
                  "잠재적 버그 및 엣지케이스 (null/undefined, 경계값)",
                  "보안 취약점 (XSS, 인젝션, 민감정보 노출)",
                  "성능 이슈 (불필요한 리렌더링, 메모리 누수, N+1)",
                  "타입 안전성 (any 사용, 타입 단언 남용)",
                  "코드 품질 (네이밍, 중복, 단일책임 원칙)",
                  "유지보수성 (매직넘버, 하드코딩, 과도한 결합)",
                ],
              },
              {
                step: "2단계", label: "리뷰 결과 검토 및 수정", icon: "✏️", color: "#4f46e5", bg: "#eef2ff",
                items: [
                  "Critical — 반드시 수정",
                  "Warning — 수정 여부 판단",
                  "Info — 참고만, 수정 불필요",
                ],
              },
              {
                step: "3단계", label: "개발자 확인 후 PR 생성", icon: "🚀", color: "#059669", bg: "#ecfdf5",
                items: [
                  "리포트 작성 (Critical / Warning / Info 항목별)",
                  "개발자의 명시적 응답 대기",
                  "승인 → PR 생성",
                  "재리뷰 → 1단계부터 반복 (라운드 횟수 표기)",
                  "취소 → PR 생성 중단",
                ],
              },
            ].map((s) => (
              <div key={s.step} style={{ background: palette.surface, border: `1px solid ${s.color}35`, borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: "50%",
                    background: s.bg, border: `2px solid ${s.color}60`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: palette.textFaint, fontWeight: 700, letterSpacing: 1 }}>{s.step}</div>
                    <div style={{ fontWeight: 700, fontSize: 17, color: palette.text }}>{s.label}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {s.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, marginTop: 8, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: palette.textSub, lineHeight: 1.7 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ background: "#fffbeb", border: "1px solid #f59e0b40", borderRadius: 12, padding: "14px 18px" }}>
              <span style={{ fontSize: 14, color: palette.textSub }}>
                📌 구현 중 리뷰어가 참여했더라도{" "}
                <strong style={{ color: "#d97706" }}>PR 단계에서 별도 리뷰 라운드를 한 번 더 수행</strong>합니다.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
