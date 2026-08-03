import { MARKER } from "../lib/questionBuilders.js";
import { palette } from "../theme.js";

/**
 * 문장 안의 밑줄 표식(＿…＿)을 실제 밑줄로 그린다.
 * 표식이 없는 문장(문맥상 어휘·용법)은 그대로 보여 준다.
 */
function Sentence({ text }) {
  const parts = text.split(MARKER);
  return (
    <p lang="ja" style={{ margin: "0 0 18px", fontSize: 19, lineHeight: 1.9, color: palette.ink }}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <strong
            key={index}
            style={{ borderBottom: `2px solid ${palette.red}`, fontWeight: 800, padding: "0 2px" }}
          >
            {part}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </p>
  );
}

/**
 * 실전 연습 문항 한 개.
 *
 * @param {Object} props
 * @param {number} props.number 화면에 보여 줄 문항 번호 (1부터)
 * @param {import("../lib/questionBuilders.js").PracticeQuestion} props.question
 * @param {number | null} props.selected
 * @param {(index: number) => void} props.onSelect
 * @param {null | { isCorrect: boolean, isUnanswered: boolean }} props.result 채점 전이면 null
 */
export default function PracticeQuestionCard({ number, question, selected, onSelect, result }) {
  const graded = result !== null;

  return (
    <section
      data-testid="practice-question"
      style={{
        background: palette.paper,
        border: `1px solid ${palette.line}`,
        borderLeft: `5px solid ${
          !graded ? palette.line : result.isCorrect ? palette.green : palette.red
        }`,
        borderRadius: 10,
        padding: "22px 20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
        <span style={{ color: palette.red, fontWeight: 900, fontSize: 15 }}>{number}</span>
        <span style={{ color: palette.muted, fontSize: 14, fontWeight: 700 }}>{question.prompt}</span>
        {graded && (
          <span
            data-testid="result-mark"
            style={{
              marginLeft: "auto",
              fontWeight: 900,
              fontSize: 14,
              color: result.isCorrect ? palette.green : palette.red,
            }}
          >
            {result.isUnanswered ? "미응답" : result.isCorrect ? "정답" : "오답"}
          </span>
        )}
      </div>

      {question.subject && (
        <p
          lang="ja"
          style={{ margin: "0 0 16px", fontSize: 30, fontWeight: 800, color: palette.ink }}
        >
          {question.subject}
        </p>
      )}
      {question.sentence && <Sentence text={question.sentence} />}

      <div style={{ display: "grid", gap: 8 }}>
        {question.choices.map((choice, index) => {
          const isAnswer = index === question.answerIndex;
          const isPicked = index === selected;
          const background = !graded
            ? isPicked
              ? "rgba(49,95,130,0.12)"
              : palette.soft
            : isAnswer
            ? "rgba(70,114,95,0.16)"
            : isPicked
            ? "rgba(184,58,47,0.14)"
            : palette.soft;
          const borderColor = !graded
            ? isPicked
              ? palette.blue
              : palette.line
            : isAnswer
            ? palette.green
            : isPicked
            ? palette.red
            : palette.line;

          return (
            <button
              key={choice}
              type="button"
              data-choice={choice}
              onClick={() => onSelect(index)}
              disabled={graded}
              style={{
                border: `1px solid ${borderColor}`,
                background,
                color: palette.text,
                borderRadius: 8,
                padding: "12px 14px",
                fontSize: 17,
                fontWeight: 600,
                textAlign: "left",
                cursor: graded ? "default" : "pointer",
                fontFamily: "inherit",
                lineHeight: 1.7,
              }}
            >
              <span aria-hidden="true" style={{ color: palette.muted, fontSize: 13, marginRight: 10 }}>
                {index + 1}
              </span>
              <span lang="ja">{choice}</span>
            </button>
          );
        })}
      </div>

      {graded && (
        <p
          style={{
            margin: "16px 0 0",
            padding: "12px 14px",
            background: palette.soft,
            borderRadius: 8,
            color: palette.text,
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          {question.explanation}
        </p>
      )}
    </section>
  );
}
