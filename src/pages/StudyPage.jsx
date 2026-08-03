import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RecallCard from "../components/RecallCard.jsx";
import { VOCABULARY, allIds, findById } from "../data/vocabulary.js";
import { buildRecallQuestion, pickDirection } from "../lib/quizGenerator.js";
import { loadProgress, saveProgress } from "../lib/progressStore.js";
import { initialCard, learnedCount, nextDueAt, pickNextId, review } from "../lib/srs.js";
import { mainStyle, palette, shellStyle } from "../theme.js";

/** 브라우저 밖(테스트·서버)에서도 안전하게 기본 저장소를 고른다. */
function defaultStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function formatDateTime(ms) {
  return new Date(ms).toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 학습 화면. 진도 상태를 소유하고 저장소와 동기화한다.
 * 스펙 S1, JN4-005, JN4-008, JN4-010~JN4-014, JN4-024, JN4-028.
 *
 * getNow·storage·rand를 주입할 수 있게 열어 두어, 시각과 무작위에 흔들리지 않게 테스트한다.
 */
export default function StudyPage({ getNow = Date.now, storage, rand = Math.random }) {
  const store = storage ?? defaultStorage();
  const ids = useMemo(() => allIds(), []);

  const buildNext = (progress) => {
    const id = pickNextId(ids, progress, getNow());
    if (id === null) return null;
    return buildRecallQuestion(findById(id), VOCABULARY, pickDirection(rand), rand);
  };

  const [state, setState] = useState(() => {
    const progress = loadProgress(store);
    return { progress, question: buildNext(progress), selectedIndex: null };
  });

  const handleSelect = (index) => {
    if (state.selectedIndex !== null) return;

    const { question, progress } = state;
    const card = progress[question.item.id] ?? initialCard();
    const nextProgress = {
      ...progress,
      [question.item.id]: review(card, index === question.answerIndex, getNow()),
    };
    saveProgress(store, nextProgress);
    setState({ progress: nextProgress, question, selectedIndex: index });
  };

  const handleNext = () => {
    setState((current) => ({
      progress: current.progress,
      question: buildNext(current.progress),
      selectedIndex: null,
    }));
  };

  const learned = learnedCount(ids, state.progress);
  const upcoming = nextDueAt(ids, state.progress);

  return (
    <div style={shellStyle}>
      <main style={mainStyle}>
        <header style={{ marginBottom: 24 }}>
          <Link
            to="/"
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
            }}
          >
            홈으로
          </Link>
          <h1 style={{ margin: "18px 0 6px", fontSize: "clamp(26px, 5vw, 36px)", color: palette.ink }}>
            어휘 학습
          </h1>
          <p data-testid="progress" style={{ margin: 0, color: palette.muted, fontSize: 15 }}>
            전체 {ids.length}개 중 <strong style={{ color: palette.blue }}>{learned}개</strong> 학습 (
            {Math.round((learned / ids.length) * 100)}%)
          </p>
        </header>

        {state.question ? (
          <RecallCard
            question={state.question}
            selectedIndex={state.selectedIndex}
            onSelect={handleSelect}
            onNext={handleNext}
          />
        ) : (
          <section
            data-testid="empty-state"
            style={{
              background: palette.paper,
              border: `1px solid ${palette.line}`,
              borderTop: `6px solid ${palette.green}`,
              borderRadius: 10,
              padding: "40px 22px",
              textAlign: "center",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 22, color: palette.ink }}>지금 복습할 항목이 없습니다</h2>
            <p style={{ margin: "14px 0 0", color: palette.muted, lineHeight: 1.8 }}>
              모든 항목이 다음 복습을 기다리고 있습니다.
              <br />
              그동안 실전 연습으로 문제 유형에 익숙해져 보세요.
            </p>
            {upcoming !== null && (
              <p data-testid="next-due" style={{ margin: "20px 0 0", fontWeight: 800, color: palette.blue }}>
                다음 복습 예정: {formatDateTime(upcoming)}
              </p>
            )}
            <Link
              to="/practice"
              style={{
                display: "inline-block",
                marginTop: 26,
                background: palette.ink,
                color: "#fff",
                textDecoration: "none",
                borderRadius: 8,
                padding: "13px 22px",
                fontWeight: 800,
              }}
            >
              실전 연습 하러 가기
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
