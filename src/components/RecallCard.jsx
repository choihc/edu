import JapaneseText from "./JapaneseText.jsx";
import { palette } from "../theme.js";

/**
 * 학습 카드 한 장. 표시와 선택만 맡고 진도 계산은 하지 않는다.
 * 스펙 JN4-005(제출 전 보조 정보 비공개), JN4-008(제출 후 피드백).
 *
 * @param {Object} props
 * @param {import("../lib/quizGenerator.js").RecallQuestion} props.question
 * @param {number | null} props.selectedIndex  아직 답하지 않았으면 null
 * @param {(index: number) => void} props.onSelect
 * @param {() => void} props.onNext
 * @param {boolean} [props.furigana] 후리가나 표시 여부
 */
export default function RecallCard({ question, selectedIndex, onSelect, onNext, furigana = false }) {
  const answered = selectedIndex !== null;
  const isCorrect = selectedIndex === question.answerIndex;
  const { item } = question;

  return (
    <section
      style={{
        background: palette.paper,
        border: `1px solid ${palette.line}`,
        borderTop: `6px solid ${answered ? (isCorrect ? palette.green : palette.red) : palette.blue}`,
        borderRadius: 10,
        padding: "28px 22px",
        boxShadow: "0 12px 34px rgba(38,33,27,0.08)",
      }}
    >
      <p style={{ margin: 0, color: palette.muted, fontSize: 14, fontWeight: 800 }}>{question.prompt}</p>

      <p
        data-testid="card-subject"
        lang={question.direction === "wordFromMeaning" ? "ko" : "ja"}
        style={{
          margin: "16px 0 26px",
          fontSize: "clamp(34px, 9vw, 56px)",
          lineHeight: 1.25,
          color: palette.ink,
          fontWeight: 800,
          wordBreak: "keep-all",
        }}
      >
        {answered ? <JapaneseText text={question.subject} furigana={furigana} /> : question.subject}
      </p>

      <div data-testid="choices" style={{ display: "grid", gap: 10 }}>
        {question.choices.map((choice, index) => {
          const isAnswer = index === question.answerIndex;
          const isPicked = index === selectedIndex;
          const background = !answered
            ? palette.soft
            : isAnswer
            ? "rgba(70,114,95,0.16)"
            : isPicked
            ? "rgba(184,58,47,0.14)"
            : palette.soft;
          const borderColor = !answered
            ? palette.line
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
              disabled={answered}
              style={{
                border: `1px solid ${borderColor}`,
                background,
                color: palette.text,
                borderRadius: 8,
                padding: "14px 16px",
                fontSize: 19,
                fontWeight: 700,
                textAlign: "left",
                cursor: answered ? "default" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {/* 번호는 키보드 단축키 안내용 장식이므로 읽어 주지 않는다 */}
              <span aria-hidden="true" style={{ color: palette.muted, fontSize: 13, marginRight: 10 }}>
                {index + 1}
              </span>
              <JapaneseText text={choice} furigana={furigana} />
            </button>
          );
        })}
      </div>

      {answered && (
        <div style={{ marginTop: 24, borderTop: `1px solid ${palette.line}`, paddingTop: 20 }}>
          <p
            data-testid="verdict"
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 900,
              color: isCorrect ? palette.green : palette.red,
            }}
          >
            {isCorrect ? "정답입니다" : "오답입니다"}
          </p>

          <dl style={{ margin: "18px 0 0", display: "grid", gap: 12 }}>
            <Row label="정답" testId="answer">
              <span lang="ja">
                <JapaneseText text={question.choices[question.answerIndex]} furigana={furigana} />
              </span>
            </Row>
            <Row label="단어">
              <span lang="ja">
                <JapaneseText text={item.word} furigana={furigana} /> ({item.reading})
              </span>{" "}
              — {item.meaning}
            </Row>
            <Row label="한국식 음훈">{item.sinoKorean}</Row>
            <Row label="기억 힌트">{item.hint}</Row>
            <Row label="예문">
              <span lang="ja">
                <JapaneseText text={item.example} furigana={furigana} />
              </span>
              <br />
              <span style={{ color: palette.muted }}>{item.exampleKr}</span>
            </Row>
          </dl>

          <button
            type="button"
            onClick={onNext}
            style={{
              marginTop: 24,
              width: "100%",
              border: "none",
              background: palette.ink,
              color: "#fff",
              borderRadius: 8,
              padding: "14px 16px",
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            다음 카드
          </button>
        </div>
      )}
    </section>
  );
}

function Row({ label, testId, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(88px, auto) 1fr", gap: 12 }}>
      <dt style={{ color: palette.muted, fontSize: 13, fontWeight: 800 }}>{label}</dt>
      <dd data-testid={testId} style={{ margin: 0, fontSize: 16, lineHeight: 1.7 }}>
        {children}
      </dd>
    </div>
  );
}
