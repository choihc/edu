/** 화면 전체가 공유하는 색과 서체. */

export const palette = {
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

export const fontStack =
  "'Pretendard', 'Noto Sans KR', 'Hiragino Sans', 'Yu Gothic', sans-serif";

export const shellStyle = {
  minHeight: "100vh",
  overflowX: "hidden",
  background:
    "linear-gradient(135deg, rgba(184,58,47,0.08), transparent 35%), linear-gradient(225deg, rgba(49,95,130,0.10), transparent 42%), #f7f3ea",
  color: palette.text,
  fontFamily: fontStack,
};

export const mainStyle = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "32px 16px 72px",
};

/** 화면 아래쪽에 붙는 안내 문구 스타일. 키보드 단축키를 알려 준다. */
export const hintStyle = {
  margin: "22px 0 0",
  color: palette.muted,
  fontSize: 13,
  lineHeight: 1.7,
  textAlign: "center",
};
