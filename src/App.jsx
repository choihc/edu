import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { downloadStaticHtml, openPdfPrintView, presentationDownloads } from "./downloadUtils.js";

const palette = {
  bg: "#f7f3ea",
  ink: "#161616",
  text: "#26211b",
  muted: "#70675b",
  line: "#ded5c8",
  paper: "#fffaf1",
  soft: "#efe7da",
  red: "#b83a2f",
  blue: "#315f82",
  green: "#46725f",
  amber: "#a66a1f",
};

const wordGroups = [
  {
    id: "noboru",
    title: "오르다 4형제",
    hint: "어디로, 무엇이, 어떤 감정이 올라가는지로 구분합니다.",
    words: [
      {
        jp: "登る",
        reading: "のぼる",
        kr: "오르다, 등산하다",
        memory: "산, 계단, 나무처럼 몸으로 올라가면 登る입니다.",
        example: "山に登る。",
        exampleKr: "산에 오르다.",
      },
      {
        jp: "上る",
        reading: "のぼる",
        kr: "올라가다, 상행하다",
        memory: "위쪽 방향, 수도로 올라감, 숫자가 오름처럼 일반적인 상승입니다.",
        example: "階段を上る。",
        exampleKr: "계단을 올라가다.",
      },
      {
        jp: "昇る",
        reading: "のぼる",
        kr: "뜨다, 떠오르다, 승진하다",
        memory: "해, 달, 지위처럼 자연스럽게 위로 떠오르면 昇る입니다.",
        example: "日が昇る。",
        exampleKr: "해가 뜨다.",
      },
      {
        jp: "昂る",
        reading: "たかぶる",
        kr: "흥분하다, 감정이 고조되다",
        memory: "몸이 아니라 마음의 온도가 올라갑니다.",
        example: "気持ちが昂る。",
        exampleKr: "기분이 고조되다.",
      },
    ],
  },
  {
    id: "conditionals",
    title: "조건 표현",
    hint: "앞말이 어떤 조건으로 이어지는지 감각을 잡으면 쉽습니다.",
    words: [
      {
        jp: "くれば",
        reading: "来れば",
        kr: "오면",
        memory: "来る의 조건형입니다. 누군가 오면 어떤 일이 일어납니다.",
        example: "友だちが来れば楽しい。",
        exampleKr: "친구가 오면 즐겁다.",
      },
      {
        jp: "すれば",
        reading: "すれば",
        kr: "하면",
        memory: "する의 조건형입니다. 행동을 하면 결과가 따라옵니다.",
        example: "練習すれば上手になる。",
        exampleKr: "연습하면 잘하게 된다.",
      },
      {
        jp: "たら",
        reading: "たら",
        kr: "하면, 했더니, 하면 어떨까",
        memory: "가정, 계기, 제안까지 넓게 쓰는 생활형 조건입니다.",
        example: "困ったら聞いてください。",
        exampleKr: "곤란하면 물어봐 주세요.",
      },
    ],
  },
  {
    id: "strength",
    title: "강함과 약함",
    hint: "강한 상태, 약한 상태, 억지로 시키는 힘을 나눕니다.",
    words: [
      {
        jp: "強い",
        reading: "つよい",
        kr: "강하다",
        memory: "힘, 성격, 맛, 바람이 강할 때 씁니다.",
        example: "風が強い。",
        exampleKr: "바람이 강하다.",
      },
      {
        jp: "弱い",
        reading: "よわい",
        kr: "약하다",
        memory: "힘이 약하거나 어떤 것에 취약할 때 씁니다.",
        example: "寒さに弱い。",
        exampleKr: "추위에 약하다.",
      },
      {
        jp: "勇士",
        reading: "ゆうし",
        kr: "용사, 용맹한 사람",
        memory: "勇은 용기, 士는 사람입니다. 용기를 가진 사람입니다.",
        example: "勇士たちが集まる。",
        exampleKr: "용사들이 모이다.",
      },
      {
        jp: "脆い",
        reading: "もろい",
        kr: "부서지기 쉽다, 취약하다",
        memory: "강하지 않은 정도를 넘어 쉽게 깨지는 느낌입니다.",
        example: "この壁は脆い。",
        exampleKr: "이 벽은 약해서 부서지기 쉽다.",
      },
      {
        jp: "強いる",
        reading: "しいる",
        kr: "강요하다",
        memory: "강한 힘으로 상대에게 시키는 동사입니다.",
        example: "無理を強いる。",
        exampleKr: "무리를 강요하다.",
      },
      {
        jp: "強いられる",
        reading: "しいられる",
        kr: "강요당하다",
        memory: "強いる의 수동형입니다. 내가 억지로 하게 됩니다.",
        example: "選択を強いられる。",
        exampleKr: "선택을 강요당하다.",
      },
    ],
  },
  {
    id: "feelings",
    title: "기쁨 표현",
    hint: "행동으로 기뻐하는지, 감정 상태인지 구분합니다.",
    words: [
      {
        jp: "喜んで",
        reading: "よろこんで",
        kr: "기꺼이, 기뻐하며",
        memory: "부탁을 받았을 때 '기꺼이요'라는 응답으로 자주 씁니다.",
        example: "喜んで手伝います。",
        exampleKr: "기꺼이 도와드리겠습니다.",
      },
      {
        jp: "喜ぶ",
        reading: "よろこぶ",
        kr: "기뻐하다",
        memory: "기쁜 반응을 행동으로 드러내는 동사입니다.",
        example: "合格して喜ぶ。",
        exampleKr: "합격해서 기뻐하다.",
      },
      {
        jp: "嬉しい",
        reading: "うれしい",
        kr: "기쁘다",
        memory: "마음속 감정 상태를 말하는 형용사입니다.",
        example: "会えて嬉しい。",
        exampleKr: "만나서 기쁘다.",
      },
    ],
  },
  {
    id: "verbs",
    title: "짝으로 외우는 동사",
    hint: "자동사, 타동사, 가능/사역 느낌을 함께 묶습니다.",
    words: [
      {
        jp: "生かされる",
        reading: "いかされる",
        kr: "살려지다, 활용되다, 살게 되다",
        memory: "生かす가 살리다/활용하다라면, 生かされる는 그 힘을 받는 쪽입니다.",
        example: "経験が生かされる。",
        exampleKr: "경험이 활용되다.",
      },
      {
        jp: "曲がる",
        reading: "まがる",
        kr: "구부러지다, 방향을 틀다",
        memory: "스스로 휘거나 길이 꺾이면 曲がる입니다.",
        example: "角を右に曲がる。",
        exampleKr: "모퉁이를 오른쪽으로 돌다.",
      },
      {
        jp: "曲げる",
        reading: "まげる",
        kr: "구부리다",
        memory: "내가 무언가를 휘게 만들면 曲げる입니다.",
        example: "針金を曲げる。",
        exampleKr: "철사를 구부리다.",
      },
      {
        jp: "見る",
        reading: "みる",
        kr: "보다",
        memory: "내가 의식적으로 눈을 두고 보는 행동입니다.",
        example: "映画を見る。",
        exampleKr: "영화를 보다.",
      },
      {
        jp: "見える",
        reading: "みえる",
        kr: "보이다",
        memory: "내가 보려고 하지 않아도 시야에 들어옵니다.",
        example: "海が見える。",
        exampleKr: "바다가 보이다.",
      },
      {
        jp: "見せる",
        reading: "みせる",
        kr: "보여주다",
        memory: "상대가 볼 수 있게 만드는 동사입니다.",
        example: "写真を見せる。",
        exampleKr: "사진을 보여주다.",
      },
      {
        jp: "聞く",
        reading: "きく",
        kr: "듣다, 묻다",
        memory: "귀로 듣거나 질문해서 알아낼 때 씁니다.",
        example: "音楽を聞く。",
        exampleKr: "음악을 듣다.",
      },
      {
        jp: "聞こえる",
        reading: "きこえる",
        kr: "들리다",
        memory: "의식하지 않아도 소리가 귀에 들어오는 상태입니다.",
        example: "声が聞こえる。",
        exampleKr: "목소리가 들리다.",
      },
      {
        jp: "聞かせる",
        reading: "きかせる",
        kr: "들려주다",
        memory: "상대가 듣게 만드는 사역 표현입니다.",
        example: "話を聞かせる。",
        exampleKr: "이야기를 들려주다.",
      },
    ],
  },
];

const comparisonSets = [
  {
    title: "見る / 見える / 見せる",
    rows: [
      ["見る", "내가 본다", "映画を見る"],
      ["見える", "저절로 보인다", "山が見える"],
      ["見せる", "남에게 보여준다", "写真を見せる"],
    ],
  },
  {
    title: "聞く / 聞こえる / 聞かせる",
    rows: [
      ["聞く", "내가 듣거나 묻는다", "音楽を聞く"],
      ["聞こえる", "저절로 들린다", "声が聞こえる"],
      ["聞かせる", "남에게 들려준다", "話を聞かせる"],
    ],
  },
  {
    title: "曲がる / 曲げる",
    rows: [
      ["曲がる", "스스로 꺾인다", "道が曲がる"],
      ["曲げる", "내가 꺾는다", "針金を曲げる"],
    ],
  },
];

function BackLink({ href = "/", label = "메뉴로" }) {
  return (
    <Link
      to={href}
      style={{
        display: "inline-flex",
        color: palette.muted,
        textDecoration: "none",
        border: `1px solid ${palette.line}`,
        background: "rgba(255,250,241,0.76)",
        padding: "8px 12px",
        borderRadius: 8,
        fontWeight: 800,
        fontSize: 13,
        marginBottom: 20,
      }}
    >
      {label}
    </Link>
  );
}

function Shell({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        overflowX: "hidden",
        background:
          "linear-gradient(135deg, rgba(184,58,47,0.08), transparent 35%), linear-gradient(225deg, rgba(49,95,130,0.10), transparent 42%), #f7f3ea",
        color: palette.text,
        fontFamily:
          "'Pretendard', 'Noto Sans KR', 'Hiragino Sans', 'Yu Gothic', sans-serif",
      }}
    >
      {children}
    </div>
  );
}

export function HomePage() {
  const menus = [
    {
      href: "/plant-energy",
      title: "12단원 식물과 에너지",
      subtitle: "광합성, 호흡, 증산, 물질 이동을 애니메이션과 퀴즈로 이해하는 학습 페이지",
      accent: palette.green,
      meta: "광합성 · 호흡 · 증산 · 물질 이동",
      external: false,
    },
    {
      href: "presentation.html",
      title: "코딩과 AI 패러다임",
      subtitle: "코딩 기초부터 프롬프트·에이전틱·하네스까지, 약 2시간 분량의 발표 슬라이드",
      accent: palette.amber,
      meta: "발표 슬라이드 · 38p",
      external: true,
      downloads: presentationDownloads.codingAi,
    },
    {
      href: "/jp-vocab",
      title: "일본어 단어 암기",
      subtitle: "비슷한 단어를 묶어서 빠르게 외우는 학습 페이지",
      accent: palette.red,
      meta: "플래시카드 · 퀴즈 · 비교표",
      external: false,
    },
    {
      href: "/multi-agent",
      title: "멀티에이전트 개발 프로세스",
      subtitle: "기존 CLAUDE.md 프로세스 시각화 화면",
      accent: palette.blue,
      meta: "페르소나 · 플로우 · PR 절차",
      external: false,
      downloads: presentationDownloads.multiAgent,
    },
    {
      href: "/spec-manager",
      title: "스펙매니저 발표 자료",
      subtitle: "spec-manager 소개 슬라이드",
      accent: palette.green,
      meta: "발표 모드",
      external: false,
      downloads: presentationDownloads.specManager,
    },
    {
      href: "/ai-native",
      title: "AI Native: 운영체계의 교체",
      subtitle: "도구가 아니라 PDLC 전체의 재설계. Anthropic 1차 자료로 실증.",
      accent: palette.blue,
      meta: "발표 슬라이드 · 26장 · 25분(±5)",
      external: false,
      downloads: presentationDownloads.aiNative,
    },
  ];

  return (
    <Shell>
      <main style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 22px 80px" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: 42,
            alignItems: "end",
            marginBottom: 38,
          }}
        >
          <div>
            <div style={{ color: palette.red, fontWeight: 900, marginBottom: 14 }}>
              Service Launcher
            </div>
            <h1
              style={{
                fontSize: "clamp(38px, 7vw, 84px)",
                lineHeight: 0.95,
                margin: 0,
                color: palette.ink,
                letterSpacing: 0,
              }}
            >
              각 서비스에 접속해 보세요
            </h1>
          </div>
          <p style={{ margin: 0, color: palette.muted, fontSize: 18, lineHeight: 1.8 }}>
            아래 카드 중 원하는 자료를 골라 누르면 새 창에서 열립니다.
            여러 자료를 동시에 열어두고 비교하며 보실 수 있습니다.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: 16,
          }}
        >
          {menus.map((menu) => (
            <div
              key={menu.href}
              style={{
                minHeight: 230,
                padding: 24,
                background: palette.paper,
                border: `1px solid ${palette.line}`,
                borderTop: `6px solid ${menu.accent}`,
                borderRadius: 8,
                textDecoration: "none",
                color: palette.text,
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.18s, box-shadow 0.18s",
                boxShadow: "0 12px 34px rgba(38,33,27,0.08)",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = "translateY(-4px)";
                event.currentTarget.style.boxShadow = "0 18px 44px rgba(38,33,27,0.13)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = "translateY(0)";
                event.currentTarget.style.boxShadow = "0 12px 34px rgba(38,33,27,0.08)";
              }}
            >
              <Link
                to={menu.href}
                target={menu.external ? "_blank" : undefined}
                rel={menu.external ? "noopener noreferrer" : undefined}
                style={{ textDecoration: "none", color: palette.text, display: "flex", flexDirection: "column", flex: 1 }}
              >
                <div style={{ color: menu.accent, fontSize: 13, fontWeight: 900, marginBottom: 16 }}>
                  {menu.meta}
                </div>
                <h2 style={{ margin: 0, fontSize: 25, lineHeight: 1.2, color: palette.ink }}>
                  {menu.title}
                </h2>
                <p style={{ margin: "14px 0 0", color: palette.muted, lineHeight: 1.7, fontSize: 15 }}>
                  {menu.subtitle}
                </p>
                <div style={{ marginTop: "auto", color: menu.accent, fontWeight: 900 }}>
                  {menu.external ? "새 창으로 열기 ↗" : "들어가기"}
                </div>
              </Link>
              {menu.downloads && (
                <div style={{ display: "flex", gap: 8, marginTop: 18 }} data-export-hidden>
                  <button
                    type="button"
                    onClick={() => openPdfPrintView(menu.downloads.pdf)}
                    style={{
                      border: `1px solid ${menu.accent}55`,
                      background: `${menu.accent}12`,
                      color: menu.accent,
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    PDF 저장
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (menu.downloads.filename) downloadStaticHtml(menu.downloads.html, menu.downloads.filename);
                      else window.open(menu.downloads.html, "_blank", "noopener,noreferrer");
                    }}
                    style={{
                      border: `1px solid ${palette.line}`,
                      background: "#fff",
                      color: palette.text,
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    HTML 다운로드
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
    </Shell>
  );
}

function GroupTabs({ groups, activeId, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {groups.map((group) => (
        <button
          key={group.id}
          onClick={() => onSelect(group.id)}
          style={{
            border: `1px solid ${activeId === group.id ? palette.red : palette.line}`,
            background: activeId === group.id ? palette.red : palette.paper,
            color: activeId === group.id ? "#fff" : palette.text,
            borderRadius: 8,
            padding: "10px 13px",
            cursor: "pointer",
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          {group.title}
        </button>
      ))}
    </div>
  );
}

function getReading(jp) {
  return wordGroups
    .flatMap((group) => group.words)
    .find((word) => word.jp === jp)?.reading;
}

function FuriganaWord({ jp, reading, size = "md", color = palette.ink }) {
  const [isReadingVisible, setIsReadingVisible] = useState(false);
  const fontSize = size === "lg" ? 56 : size === "sm" ? 18 : 44;
  const readingSize = size === "lg" ? 22 : size === "sm" ? 13 : 18;

  const toggleReading = (event) => {
    event.stopPropagation();
    setIsReadingVisible((value) => !value);
  };

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={toggleReading}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") toggleReading(event);
      }}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 6,
        color,
        cursor: "pointer",
        lineHeight: 1,
        maxWidth: "100%",
      }}
      title="클릭하면 후리가나를 볼 수 있습니다"
    >
      <span
        style={{
          fontSize,
          fontWeight: 650,
          overflowWrap: "anywhere",
          lineHeight: 1.05,
        }}
      >
        {jp}
      </span>
      <span
        style={{
          minHeight: readingSize + 2,
          color: palette.blue,
          fontSize: readingSize,
          fontWeight: 900,
          opacity: isReadingVisible ? 1 : 0,
          transition: "opacity 0.18s",
        }}
      >
        {reading}
      </span>
    </span>
  );
}

function Flashcard({ word, isOpen, onToggle }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onToggle();
      }}
      style={{
        width: "100%",
        boxSizing: "border-box",
        minWidth: 0,
        textAlign: "left",
        minHeight: 255,
        border: `1px solid ${palette.line}`,
        borderRadius: 8,
        background: palette.paper,
        padding: 26,
        cursor: "pointer",
        boxShadow: "0 14px 36px rgba(38,33,27,0.10)",
      }}
    >
      <div style={{ color: palette.red, fontWeight: 900, marginBottom: 18 }}>
        {isOpen ? "뜻과 암기 포인트" : "한자를 눌러 후리가나, 카드를 눌러 뜻 보기"}
      </div>
      <FuriganaWord jp={word.jp} reading={word.reading} size="lg" />
      {isOpen ? (
        <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: palette.text }}>{word.kr}</div>
          <p style={{ color: palette.muted, fontSize: 16, lineHeight: 1.8, margin: "12px 0 0" }}>
            {word.memory}
          </p>
          <div
            style={{
              marginTop: 18,
              background: palette.soft,
              borderLeft: `4px solid ${palette.red}`,
              padding: "13px 15px",
              color: palette.text,
              lineHeight: 1.7,
            }}
          >
            <strong>{word.example}</strong>
            <br />
            {word.exampleKr}
          </div>
        </div>
      ) : (
        <p style={{ color: palette.muted, fontSize: 16, lineHeight: 1.8, margin: "22px 0 0" }}>
          먼저 일본어만 보고 읽는 법과 뜻을 떠올려 보세요.
        </p>
      )}
    </div>
  );
}

function Quiz({ words }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const current = words[index % words.length];

  const options = useMemo(() => {
    const other = words
      .filter((word) => word.jp !== current.jp)
      .slice()
      .sort((a, b) => a.jp.localeCompare(b.jp, "ja"))
      .slice(0, 3);
    return [current, ...other].sort((a, b) => a.kr.localeCompare(b.kr, "ko"));
  }, [current, words]);

  const answerState = selected
    ? selected.jp === current.jp
      ? "정답입니다"
      : `아쉽습니다. 정답은 ${current.kr}입니다`
    : "뜻을 고르세요";

  return (
    <section
      style={{
        background: palette.paper,
        border: `1px solid ${palette.line}`,
        borderRadius: 8,
        padding: 24,
        boxShadow: "0 12px 34px rgba(38,33,27,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 22, color: palette.ink }}>빠른 퀴즈</h2>
        <span style={{ marginLeft: "auto", color: palette.muted, fontWeight: 800 }}>
          {index + 1} / {words.length}
        </span>
      </div>
      <div style={{ marginBottom: 18 }}>
        <FuriganaWord jp={current.jp} reading={current.reading} />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {options.map((option) => {
          const isSelected = selected?.jp === option.jp;
          const isAnswer = selected && option.jp === current.jp;
          return (
            <button
              key={option.jp}
              onClick={() => setSelected(option)}
              style={{
                border: `1px solid ${isAnswer ? palette.green : isSelected ? palette.red : palette.line}`,
                background: isAnswer ? "#e8f1eb" : isSelected ? "#f8e6e2" : "#fffdf8",
                color: palette.text,
                borderRadius: 8,
                padding: "12px 14px",
                textAlign: "left",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              {option.kr}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 14, color: selected?.jp === current.jp ? palette.green : palette.red, fontWeight: 900 }}>
        {answerState}
      </div>
      <button
        onClick={() => {
          setSelected(null);
          setIndex((value) => (value + 1) % words.length);
        }}
        style={{
          marginTop: 16,
          border: "none",
          background: palette.ink,
          color: "#fff",
          borderRadius: 8,
          padding: "12px 16px",
          cursor: "pointer",
          fontWeight: 900,
        }}
      >
        다음 문제
      </button>
    </section>
  );
}

export function VocabularyPage() {
  const [activeGroupId, setActiveGroupId] = useState(wordGroups[0].id);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const activeGroup = wordGroups.find((group) => group.id === activeGroupId) ?? wordGroups[0];
  const activeWord = activeGroup.words[activeCardIndex % activeGroup.words.length];
  const allWords = wordGroups.flatMap((group) => group.words);

  const handleGroupSelect = (groupId) => {
    setActiveGroupId(groupId);
    setActiveCardIndex(0);
    setIsCardOpen(false);
  };

  return (
    <Shell>
      <main style={{ maxWidth: 1160, margin: "0 auto", padding: "24px 22px 80px" }}>
        <BackLink />
        <section style={{ marginBottom: 24 }}>
          <div style={{ color: palette.red, fontWeight: 900, marginBottom: 12 }}>
            일본어 단어 암기
          </div>
          <h1
            style={{
              fontSize: "clamp(34px, 6vw, 70px)",
              lineHeight: 1,
              letterSpacing: 0,
              margin: 0,
              color: palette.ink,
              maxWidth: 780,
            }}
          >
            헷갈리는 단어를 짝으로 묶어서 외웁니다
          </h1>
          <p style={{ margin: "18px 0 0", color: palette.muted, fontSize: 17, lineHeight: 1.8, maxWidth: 760 }}>
            읽기, 뜻, 예문을 한 번에 외우기보다 먼저 비슷한 단어의 차이를 잡는 방식입니다.
          </p>
        </section>

        <GroupTabs groups={wordGroups} activeId={activeGroup.id} onSelect={handleGroupSelect} />

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
            gap: 18,
            marginTop: 18,
            alignItems: "start",
            minWidth: 0,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
                color: palette.muted,
                fontWeight: 800,
              }}
            >
              <span>{activeGroup.title}</span>
              <span style={{ marginLeft: "auto" }}>
                {activeCardIndex + 1} / {activeGroup.words.length}
              </span>
            </div>
            <Flashcard
              word={activeWord}
              isOpen={isCardOpen}
              onToggle={() => setIsCardOpen((value) => !value)}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={() => {
                  setActiveCardIndex((value) =>
                    value === 0 ? activeGroup.words.length - 1 : value - 1
                  );
                  setIsCardOpen(false);
                }}
                style={controlButtonStyle}
              >
                이전
              </button>
              <button
                onClick={() => {
                  setActiveCardIndex((value) => (value + 1) % activeGroup.words.length);
                  setIsCardOpen(false);
                }}
                style={controlButtonStyle}
              >
                다음
              </button>
              <button onClick={() => setIsCardOpen((value) => !value)} style={controlButtonStyle}>
                뜻 보기
              </button>
            </div>
          </div>

          <aside style={{ minWidth: 0 }}>
            <section
              style={{
                background: palette.paper,
                border: `1px solid ${palette.line}`,
                borderRadius: 8,
                padding: 22,
                marginBottom: 14,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 20, color: palette.ink }}>오늘의 암기법</h2>
              <p style={{ color: palette.muted, lineHeight: 1.8, margin: "12px 0 0" }}>
                {activeGroup.hint}
              </p>
              <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
                {activeGroup.words.map((word) => (
                  <div
                    role="button"
                    tabIndex={0}
                    key={word.jp}
                    onClick={() => {
                      setActiveCardIndex(activeGroup.words.indexOf(word));
                      setIsCardOpen(true);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        setActiveCardIndex(activeGroup.words.indexOf(word));
                        setIsCardOpen(true);
                      }
                    }}
                    style={{
                      border: `1px solid ${word.jp === activeWord.jp ? palette.red : palette.line}`,
                      background: word.jp === activeWord.jp ? "#f8e6e2" : "#fffdf8",
                      borderRadius: 8,
                      padding: "10px 12px",
                      textAlign: "left",
                      cursor: "pointer",
                      color: palette.text,
                      fontWeight: 800,
                    }}
                  >
                    <FuriganaWord jp={word.jp} reading={word.reading} size="sm" />
                    <span style={{ color: palette.muted, marginLeft: 8 }}>{word.kr}</span>
                  </div>
                ))}
              </div>
            </section>
            <Quiz words={allWords} />
          </aside>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={{ color: palette.ink, fontSize: 26, margin: "0 0 12px" }}>
            헷갈리는 말 한눈에 비교
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: 14,
            }}
          >
            {comparisonSets.map((set) => (
              <div
                key={set.title}
                style={{
                  background: palette.paper,
                  border: `1px solid ${palette.line}`,
                  borderRadius: 8,
                  padding: 20,
                }}
              >
                <h3 style={{ margin: "0 0 14px", color: palette.blue, fontSize: 18 }}>
                  {set.title}
                </h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {set.rows.map(([jp, kr, ex]) => (
                    <div key={jp} style={{ borderTop: `1px solid ${palette.line}`, paddingTop: 10 }}>
                      <FuriganaWord jp={jp} reading={getReading(jp) ?? ""} size="sm" />
                      <div style={{ color: palette.text, marginTop: 4 }}>{kr}</div>
                      <div style={{ color: palette.muted, marginTop: 4, fontSize: 14 }}>{ex}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Shell>
  );
}

const controlButtonStyle = {
  border: `1px solid ${palette.line}`,
  background: palette.paper,
  color: palette.text,
  borderRadius: 8,
  padding: "11px 14px",
  cursor: "pointer",
  fontWeight: 900,
};

export default function App() {
  return <HomePage />;
}
