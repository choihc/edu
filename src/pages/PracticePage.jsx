import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PracticeQuestionCard from "../components/PracticeQuestionCard.jsx";
import { useChoiceKeys } from "../hooks/useChoiceKeys.js";
import { PRACTICE_TYPES, SESSION_SIZE, scoreSession, startSession } from "../lib/practiceSession.js";
import { hintStyle, mainStyle, palette, shellStyle } from "../theme.js";

function findType(typeId) {
  return PRACTICE_TYPES.find((type) => type.id === typeId);
}

/**
 * 실전 연습 한 회차 화면. 스펙 S3, JN4-016, JN4-022, JN4-023, JN4-025, JN4-029.
 *
 * 이 화면은 진도 저장소를 읽지도 쓰지도 않는다. 실전 연습이 복습 예약을 바꾸지
 * 않는다는 JN4-029를 구조로 보장하기 위해서다. storage prop은 그 사실을
 * 테스트에서 확인하기 위해 받아 두기만 한다.
 */
export default function PracticePage({ rand = Math.random }) {
  const { typeId } = useParams();
  const type = findType(typeId);

  const [session, setSession] = useState(() => startSession(typeId, rand));
  const [answers, setAnswers] = useState({});
  const [scored, setScored] = useState(null);

  const handleSelect = (questionId, index) => {
    if (scored) return;
    setAnswers((current) => ({ ...current, [questionId]: index }));
  };

  const handleSubmit = () => {
    setScored(scoreSession(session, answers));
  };

  const handleRestart = () => {
    setSession(startSession(typeId, rand));
    setAnswers({});
    setScored(null);
  };

  // 문항이 열 개 한 화면에 있어 숫자키를 어느 문항에 줄지 정할 수 없으므로,
  // 여기서는 Enter 채점만 지원한다. 채점 뒤에는 실수로 회차가 지워지지 않게 끈다.
  useChoiceKeys({ onSubmit: handleSubmit, enabled: Boolean(type) && scored === null });

  if (!type) {
    return (
      <div style={shellStyle}>
        <main style={mainStyle}>
          <section
            data-testid="unknown-type"
            style={{
              background: palette.paper,
              border: `1px solid ${palette.line}`,
              borderRadius: 10,
              padding: "40px 22px",
              textAlign: "center",
            }}
          >
            <h1 style={{ margin: 0, fontSize: 22, color: palette.ink }}>없는 연습 유형입니다</h1>
            <p style={{ margin: "14px 0 24px", color: palette.muted }}>
              주소를 다시 확인하거나 목록에서 유형을 골라 주세요.
            </p>
            <Link to="/practice" style={{ color: palette.blue, fontWeight: 800 }}>
              연습 유형 목록으로
            </Link>
          </section>
        </main>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;

  return (
    <div style={shellStyle}>
      <main style={mainStyle}>
        <header style={{ marginBottom: 22 }}>
          <Link
            to="/practice"
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
            유형 목록으로
          </Link>
          <h1 style={{ margin: "18px 0 6px", fontSize: "clamp(24px, 5vw, 32px)", color: palette.ink }}>
            {type.label}
          </h1>
          <p style={{ margin: 0, color: palette.muted, fontSize: 15, lineHeight: 1.7 }}>
            {type.description} 모두 {SESSION_SIZE}문항입니다.
          </p>
        </header>

        {scored && (
          <section
            data-testid="score"
            style={{
              background: palette.paper,
              border: `1px solid ${palette.line}`,
              borderTop: `6px solid ${palette.green}`,
              borderRadius: 10,
              padding: "22px 20px",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, color: palette.muted, fontSize: 14, fontWeight: 800 }}>채점 결과</p>
            <p style={{ margin: "10px 0 0", fontSize: 34, fontWeight: 900, color: palette.ink }}>
              {scored.total}문항 중 {scored.correct}문항 정답
            </p>
            <p style={{ margin: "10px 0 0", color: palette.muted, fontSize: 15 }}>
              미응답 {scored.results.filter((result) => result.isUnanswered).length}문항
            </p>
          </section>
        )}

        <div style={{ display: "grid", gap: 16 }}>
          {session.map((question, index) => (
            <PracticeQuestionCard
              key={question.id}
              number={index + 1}
              question={question}
              selected={answers[question.id] ?? null}
              onSelect={(choiceIndex) => handleSelect(question.id, choiceIndex)}
              result={scored ? scored.results[index] : null}
            />
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          {scored ? (
            <button
              type="button"
              onClick={handleRestart}
              style={{
                width: "100%",
                border: "none",
                background: palette.ink,
                color: "#fff",
                borderRadius: 8,
                padding: "16px",
                fontSize: 16,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              새 문제로 다시 풀기
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                width: "100%",
                border: "none",
                background: palette.red,
                color: "#fff",
                borderRadius: 8,
                padding: "16px",
                fontSize: 16,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              채점하기 ({answeredCount}/{session.length} 응답)
            </button>
          )}
        </div>

        {!scored && <p style={hintStyle}>Enter를 누르면 바로 채점합니다.</p>}
      </main>
    </div>
  );
}
