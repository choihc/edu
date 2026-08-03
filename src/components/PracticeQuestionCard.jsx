import JapaneseText from "./JapaneseText.jsx";
import { palette } from "../theme.js";

/**
 * 실전 연습 문항 한 개.
 *
 * @param {Object} props
 * @param {number} props.number 화면에 보여 줄 문항 번호 (1부터)
 * @param {import("../lib/questionBuilders.js").PracticeQuestion} props.question
 * @param {number | null} props.selected
 * @param {(index: number) => void} props.onSelect
 * @param {null | { isCorrect: boolean, isUnanswered: boolean }} props.result 채점 전이면 null
 * @param {boolean} [props.furigana] 후리가나 표시 여부
 */
export default function PracticeQuestionCard({ number, question, selected, onSelect, result, furigana = false }) {
  // 한자 읽기 유형은 밑줄 대상의 읽기가 곧 정답이므로 그 부분만 후리가나에서 뺀다 (JN4-034).
  const excludeUnderlined = question.typeId === "reading";
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
          <JapaneseText text={question.subject} furigana={furigana} />
        </p>
      )}
      {question.sentence && (
        <p lang="ja" style={{ margin: "0 0 18px", fontSize: 19, lineHeight: 2.1, color: palette.ink }}>
          <JapaneseText
            text={question.sentence}
            furigana={furigana}
            excludeUnderlined={excludeUnderlined}
          />
        </p>
      )}

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
              <span lang="ja">
                <JapaneseText text={choice} furigana={furigana} />
              </span>
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
