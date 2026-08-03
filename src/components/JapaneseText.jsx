import { READINGS } from "../data/kanjiReadings.js";
import { annotate } from "../lib/furigana.js";
import { MARKER } from "../lib/questionBuilders.js";
import { palette } from "../theme.js";

/**
 * 일본어 본문 한 덩어리. 밑줄 표식을 밑줄로 그리고, 후리가나를 켜면 한자 위에 읽기를 얹는다.
 * 스펙 JN4-032(켜기·끄기), JN4-033(기본은 꺼짐), JN4-034(밑줄 대상 제외).
 *
 * @param {Object} props
 * @param {string} props.text 밑줄 대상을 MARKER로 감싼 문장
 * @param {boolean} props.furigana 후리가나를 켤지
 * @param {boolean} [props.excludeUnderlined]
 *   한자 읽기 유형처럼 밑줄 대상의 읽기가 곧 정답인 문항에서 true로 준다.
 */
export default function JapaneseText({ text, furigana, excludeUnderlined = false }) {
  // MARKER로 감싼 부분이 홀수 번째 조각이 된다.
  const parts = text.split(MARKER);

  return (
    <>
      {parts.map((part, index) => {
        const isUnderlined = index % 2 === 1;
        const withFurigana = furigana && !(isUnderlined && excludeUnderlined);
        const body = withFurigana ? <Ruby text={part} /> : part;

        if (!isUnderlined) return <span key={index}>{body}</span>;
        return (
          <strong
            key={index}
            data-testid="underlined"
            style={{ borderBottom: `2px solid ${palette.red}`, fontWeight: 800, padding: "0 2px" }}
          >
            {body}
          </strong>
        );
      })}
    </>
  );
}

function Ruby({ text }) {
  return (
    <>
      {annotate(text, READINGS).map((segment, index) =>
        segment.reading ? (
          <ruby key={index}>
            {segment.text}
            <rt style={{ fontSize: "0.5em", fontWeight: 500, color: palette.muted }}>{segment.reading}</rt>
          </ruby>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </>
  );
}
