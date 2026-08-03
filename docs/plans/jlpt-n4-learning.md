---
작성일: 2026-08-03
최종 수정일: 2026-08-03
문서 종류: 플랜 (실행 계획)
관련 스펙: `docs/specs/jlpt-n4-learning-spec.md`
작업 브랜치: `choihc/n4-1`
---

## 1. 작업 범위 요약

기존 학습·발표 콘텐츠 6종을 저장소에서 제거하고, 그 자리에 JLPT N4 문자·어휘 학습 앱을 새로 만든다. 어휘 103개를 간격 반복으로 외우는 학습 화면과, 다섯 유형 × 103문항 이상의 실전 연습을 제공한다. 모든 답변은 네 지선다이며 진도는 브라우저 로컬 저장소에 남는다.

작업량의 무게중심은 코드가 아니라 **창작 문항 309개**(문맥상 어휘·유의 표현·용법 × 103)에 있다. 이 부분을 9단계에서 다섯 배치로 나눠 진행한다.

## 2. 사전 확인 (0단계)

| 확인 항목 | 방법 | 기대값 |
|---|---|---|
| 현재 브랜치 | `git rev-parse --abbrev-ref HEAD` | `choihc/n4-1` |
| 작업 트리 청결 | `git status --short` | `docs/` 외 변경 없음 |
| 빌드 베이스라인 | `npm run build` | 성공 (제거 작업 전후 비교 기준) |
| Node·npm 동작 | `node -v` | v18 이상 |

> 이 저장소는 이미 워크트리(`orca/workspaces/edu/n4-1`)이므로 새 워크트리를 만들지 않는다.

## 3. 단계별 분해

각 단계는 커밋 1개에 대응한다. 코드 단계는 모두 **실패 테스트 → 최소 구현 → 리팩터** 순서를 지킨다.

---

### 1단계 — 테스트 인프라 도입

**위험도**: 낮음 · **산출물**: 테스트 러너가 동작하는 상태

현재 `package.json`에는 테스트 러너가 없다. TDD를 시작하려면 먼저 이것부터 놓는다.

1-1. 의존성 설치
```bash
npm i -D vitest@^2 jsdom@^25 @testing-library/react@^16 @testing-library/user-event@^14 @testing-library/jest-dom@^6
```

1-2. `package.json` scripts에 추가
```json
"test": "vitest run",
"test:watch": "vitest"
```

1-3. `vite.config.js`에 test 설정 추가 (기존 `defineConfig` 객체에 `test` 키 추가)
```js
test: {
  environment: "jsdom",
  globals: true,
  setupFiles: ["./src/test/setup.js"],
},
```

1-4. `src/test/setup.js` 신규 생성
```js
import "@testing-library/jest-dom/vitest";
```

**검증**: `src/test/smoke.test.js`에 `expect(1 + 1).toBe(2)` 한 줄을 넣고 `npm test`가 통과하면 삭제한다.

---

### 2단계 — 기존 콘텐츠 제거 (JN4-001)

**위험도**: 높음 (되돌리기 어려움) · **산출물**: N4 전용 저장소

**삭제 파일**
```
src/App.jsx
src/MultiAgentProcess.jsx
src/PlantEnergyLearning.jsx
src/Presentation.jsx
src/AiNativePresentation.jsx
src/aiNativeSlides.js
src/downloadUtils.js
presentation.html
announcement-slides.html
dr-checklist.html
docs/superpowers/          (디렉터리 전체)
```

`docs/superpowers/`는 삭제된 콘텐츠에만 딸린 문서이고 더 이상 쓰지 않으므로 함께 제거한다(지시자 확정, 2026-08-03). 남기는 문서는 `docs/specs/`와 `docs/plans/`뿐이다.

**수정**
- `vite.config.js` → `build.rollupOptions.input`을 `{ main: resolve(__dirname, "index.html") }`만 남긴다.
- `index.html` → `<title>`을 `JLPT N4 문자·어휘`로 바꾸고 `lang="ko"` 유지.
- `src/main.jsx` → 3단계 이후 완성하므로 이 단계에서는 라우터를 `[{ path: "*", element: <N4HomePlaceholderFree /> }]`로 두지 않고, **11단계까지 임시로 최소 라우터**를 둔다:
```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StudyPage from "./pages/StudyPage.jsx";

const router = createBrowserRouter([{ path: "*", element: <StudyPage /> }]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```
`StudyPage`는 7단계에서 만든다. 이 단계에서는 `src/pages/StudyPage.jsx`에 `export default function StudyPage() { return <main>학습 화면</main>; }`만 두어 빌드가 깨지지 않게 한다. (placeholder 문구가 아니라 7단계에서 대체될 최소 구현이다.)

**검증**
- `npm run build` 성공
- `git grep -n "MultiAgentProcess\|PlantEnergy\|AiNative\|aiNativeSlides\|downloadUtils" -- src index.html vite.config.js` → 결과 없음 (AC-1)

---

### 3단계 — 어휘 데이터 103개 (JN4-002, JN4-003, AC-2)

**위험도**: 중간 (분량) · **산출물**: `src/data/vocabulary.js`

**인터페이스 계약 (생산)**
```js
/**
 * @typedef {Object} VocabularyItem
 * @property {string} id        표기+읽기 결합 식별자. 예: "青い|あおい"
 * @property {string} word      표기. 예: "青い"
 * @property {string} reading   히라가나 읽기. 예: "あおい"
 * @property {string} meaning   한국어 뜻. 예: "파랗다"
 * @property {string} sinoKorean 한국식 음훈. 예: "青 = 푸를 청"
 * @property {string} hint      기억 힌트 (한 문장)
 * @property {string} example   일본어 예문 (창작)
 * @property {string} exampleKr 예문 한국어 해석
 * @property {string} row       가나다 행. "あ"|"か"|"さ"|"た"|"な"|"は"|"ま"|"や"|"ら"
 */
export const VOCABULARY = [/* 103개 */];
export function findById(id) {/* ... */}
```

**RED** — `src/data/vocabulary.test.js`
```js
import { describe, it, expect } from "vitest";
import { VOCABULARY } from "./vocabulary.js";

const ROW_COUNTS = { あ: 26, か: 24, さ: 13, た: 13, な: 8, は: 10, ま: 2, や: 6, ら: 1 };
const FIELDS = ["id", "word", "reading", "meaning", "sinoKorean", "hint", "example", "exampleKr", "row"];

describe("어휘 데이터", () => {
  it("103개다", () => expect(VOCABULARY).toHaveLength(103));

  it("행별 개수가 원본과 일치한다", () => {
    const counted = {};
    for (const item of VOCABULARY) counted[item.row] = (counted[item.row] ?? 0) + 1;
    expect(counted).toEqual(ROW_COUNTS);
  });

  it("모든 항목이 필수 필드를 빈 값 없이 가진다", () => {
    for (const item of VOCABULARY) {
      for (const field of FIELDS) expect(item[field], `${item.word} · ${field}`).toBeTruthy();
    }
  });

  it("식별자가 중복되지 않는다", () => {
    expect(new Set(VOCABULARY.map((i) => i.id)).size).toBe(103);
  });

  it("읽기가 히라가나로만 이루어진다", () => {
    for (const item of VOCABULARY) expect(item.reading, item.word).toMatch(/^[ぁ-ゖー]+$/);
  });

  it("예문에 해당 표기가 들어 있다", () => {
    for (const item of VOCABULARY) expect(item.example, item.word).toContain(item.word);
  });
});
```

**GREEN** — 어휘 103개를 행 순서대로 채운다. 예문은 전부 새로 쓴다(JN4-026). 표기 검사를 통과해야 하므로 예문에 활용형이 아닌 사전형 표기를 그대로 넣는다.

---

### 4단계 — 간격 반복 로직 (JN4-009~JN4-012, AC-5)

**위험도**: 낮음 · **산출물**: `src/lib/srs.js` (순수 함수, 시각 주입)

**인터페이스 계약 (생산)**
```js
export const MINUTE = 60_000;
export const DAY = 24 * 60 * MINUTE;
/** 단계별 간격. 인덱스 = 간격 단계. 4단계 이상은 마지막 값을 쓴다. */
export const STAGE_INTERVALS = [10 * MINUTE, 1 * DAY, 3 * DAY, 7 * DAY, 30 * DAY];

/** @typedef {{ stage: number, dueAt: number | null }} CardState  dueAt이 null이면 미학습 */
export function initialCard();                       // -> { stage: 0, dueAt: null }
export function intervalFor(stage);                  // -> number
export function review(card, isCorrect, now);        // -> CardState (새 객체)
export function pickNextId(allIds, progress, now);   // -> string | null
export function learnedCount(allIds, progress);      // -> number  (stage >= 1)
```

**RED** — `src/lib/srs.test.js`
```js
import { describe, it, expect } from "vitest";
import { initialCard, review, pickNextId, learnedCount, DAY, MINUTE } from "./srs.js";

const NOW = 1_700_000_000_000;

describe("간격 반복", () => {
  it("정답이면 단계가 1 오르고 새 단계 간격만큼 뒤로 예약한다", () => {
    expect(review(initialCard(), true, NOW)).toEqual({ stage: 1, dueAt: NOW + 1 * DAY });
    expect(review({ stage: 1, dueAt: NOW }, true, NOW)).toEqual({ stage: 2, dueAt: NOW + 3 * DAY });
    expect(review({ stage: 3, dueAt: NOW }, true, NOW)).toEqual({ stage: 4, dueAt: NOW + 30 * DAY });
  });

  it("최고 단계를 넘어서도 30일 간격을 유지한다", () => {
    expect(review({ stage: 7, dueAt: NOW }, true, NOW)).toEqual({ stage: 8, dueAt: NOW + 30 * DAY });
  });

  it("오답이면 단계가 0으로 돌아가고 10분 뒤로 예약한다", () => {
    expect(review({ stage: 4, dueAt: NOW }, false, NOW)).toEqual({ stage: 0, dueAt: NOW + 10 * MINUTE });
  });

  it("복습 시각이 지난 항목을 미학습 항목보다 먼저 고른다", () => {
    const progress = { b: { stage: 1, dueAt: NOW - 1 } };
    expect(pickNextId(["a", "b", "c"], progress, NOW)).toBe("b");
  });

  it("복습 대상이 없으면 미학습 항목을 고른다", () => {
    const progress = { a: { stage: 1, dueAt: NOW + DAY } };
    expect(pickNextId(["a", "b"], progress, NOW)).toBe("b");
  });

  it("둘 다 없으면 null을 돌려준다", () => {
    const progress = { a: { stage: 1, dueAt: NOW + DAY } };
    expect(pickNextId(["a"], progress, NOW)).toBeNull();
  });

  it("단계 1 이상인 항목만 학습 완료로 센다", () => {
    const progress = { a: { stage: 1, dueAt: NOW }, b: { stage: 0, dueAt: NOW } };
    expect(learnedCount(["a", "b", "c"], progress)).toBe(1);
  });
});
```

---

### 5단계 — 진도 저장·복원 (JN4-013~JN4-015, JN4-U10, AC-6)

**위험도**: 낮음 · **산출물**: `src/lib/progressStore.js`

**인터페이스 계약 (소비)**: 4단계의 `CardState`
**인터페이스 계약 (생산)**
```js
export const STORAGE_KEY = "jlpt-n4-progress";
export const SCHEMA_VERSION = 1;
/** @param {Storage} storage @returns {Record<string, CardState>} 읽기 실패 시 {} */
export function loadProgress(storage);
export function saveProgress(storage, progress);
```

저장 형태는 `{ "version": 1, "cards": { "<id>": { "stage": 1, "dueAt": 1700000000000 } } }`.

**RED** — `src/lib/progressStore.test.js`: 왕복 저장·복원, `version`이 다르면 `{}`, JSON이 깨졌으면 `{}`, `localStorage.setItem`이 예외를 던져도 앱이 죽지 않음(용량 초과 상황), 4가지를 단언한다.

---

### 6단계 — 네 지선다 생성기 (JN4-007, JN4-027, AC-3)

**위험도**: 중간 · **산출물**: `src/lib/quizGenerator.js`

**인터페이스 계약 (소비)**: `VocabularyItem`
**인터페이스 계약 (생산)**
```js
/** 회상 방향 */
export const DIRECTIONS = ["readingFromWord", "meaningFromWord", "wordFromMeaning"];

/** 혼동 후보: 읽기가 같거나, 한자를 한 글자 이상 공유하는 항목 */
export function confusableIds(item, pool);   // -> string[]

/**
 * @param {VocabularyItem} item
 * @param {VocabularyItem[]} pool  전체 어휘
 * @param {"readingFromWord"|"meaningFromWord"|"wordFromMeaning"} direction
 * @param {() => number} rand  0 이상 1 미만
 * @returns {{ direction: string, prompt: string, choices: string[], answerIndex: number, item: VocabularyItem }}
 */
export function buildRecallQuestion(item, pool, direction, rand);
```

**RED** — `src/lib/quizGenerator.test.js`
```js
it("선택지는 4개이고 중복이 없다", ...)
it("정답이 정확히 한 개 들어 있다", ...)
it("혼동 후보가 있으면 오답으로 우선 쓴다", ...)      // 読み 동일 항목 주입
it("혼동 후보가 부족하면 나머지 어휘로 채운다", ...)   // pool을 5개로 축소
it("rand를 고정하면 같은 결과를 낸다", ...)           // rand = () => 0
```

`rand`를 주입 가능하게 만드는 이유: 무작위 코드는 테스트가 불가능해지기 때문이다. 화면에서는 `Math.random`을 넘긴다.

---

### 7단계 — 학습 화면 (S1, JN4-005, JN4-008, JN4-024, JN4-028, AC-4)

**위험도**: 중간 · **산출물**: `src/pages/StudyPage.jsx`, `src/components/RecallCard.jsx`

**인터페이스 계약 (소비)**: `VOCABULARY`, `srs`, `progressStore`, `buildRecallQuestion`
**인터페이스 계약 (생산)**
```jsx
// RecallCard: 표시와 입력만 담당. 진도 계산은 하지 않는다.
export default function RecallCard({ question, revealed, selectedIndex, onSelect, onNext });
// StudyPage: 진도 상태를 소유하고 localStorage와 동기화한다.
export default function StudyPage();
```

**RED** — `src/pages/StudyPage.test.jsx`
```js
it("제출 전에는 한국식 음훈과 기억 힌트를 보여 주지 않는다", ...)   // AC-4 전반
it("선택지를 누르면 정답 여부와 음훈·힌트·예문을 보여 준다", ...)   // AC-4 후반, JN4-008
it("정답하면 진도가 localStorage에 저장된다", ...)                 // JN4-013
it("복습·미학습 대상이 없으면 빈 상태와 다음 복습 시각을 보여 준다", ...)  // JN4-024
it("학습한 항목 수와 비율을 표시한다", ...)                        // JN4-028
```

시각 의존을 없애기 위해 `StudyPage`는 `now` 공급자를 prop으로 받되 기본값을 `Date.now`로 둔다: `function StudyPage({ getNow = Date.now, storage = window.localStorage })`. 테스트는 고정 시각을 넘긴다.

---

### 8단계 — 자동 생성 문항 은행: 한자 읽기·표기 (JN4-017, JN4-018)

**위험도**: 낮음 · **산출물**: `src/lib/questionBuilders.js`

어휘의 `example`을 문장으로 쓰고 `word`를 밑줄 대상으로 삼는다. 창작 문장이므로 JN4-026을 만족한다.

**인터페이스 계약 (생산)**
```js
/**
 * @typedef {Object} PracticeQuestion
 * @property {string} id
 * @property {"reading"|"orthography"|"context"|"synonym"|"usage"} typeId
 * @property {string} sentence   밑줄 대상을 ＿로 감싼 문장. 예: "空が＿青い＿。"
 * @property {string} prompt     문제 지시문 (한국어)
 * @property {string[]} choices  길이 4
 * @property {number} answerIndex
 * @property {string} explanation
 */
export function buildReadingQuestions(vocabulary, rand);      // -> PracticeQuestion[] (103개)
export function buildOrthographyQuestions(vocabulary, rand);  // -> PracticeQuestion[] (103개)
```

읽기 유형의 오답은 읽기가 비슷한 항목(첫 음절 일치·길이 유사)에서, 표기 유형의 오답은 한자를 공유하거나 획 구성이 비슷한 항목에서 뽑는다.

**RED** — `src/lib/questionBuilders.test.js`: 각각 103문항, 선택지 4개·중복 없음, 정답 1개, 밑줄 표식이 문장에 정확히 두 번 등장.

---

### 9단계 — 창작 문항 은행: 문맥상 어휘·유의 표현·용법 (JN4-019~JN4-021, AC-7)

**위험도**: 높음 (분량 309문항) · **산출물**: `src/data/authoredQuestions/*.js`

이 단계가 전체 작업량의 대부분이다. 행 단위로 다섯 배치로 나눠 각 배치마다 커밋한다.

| 배치 | 대상 행 | 어휘 수 | 문항 수 | 파일 |
|---|---|---|---|---|
| 9-A | あ | 26 | 78 | `src/data/authoredQuestions/rowA.js` |
| 9-B | か | 24 | 72 | `src/data/authoredQuestions/rowKa.js` |
| 9-C | さ·た | 26 | 78 | `src/data/authoredQuestions/rowSaTa.js` |
| 9-D | な·は | 18 | 54 | `src/data/authoredQuestions/rowNaHa.js` |
| 9-E | ま·や·ら | 9 | 27 | `src/data/authoredQuestions/rowMaYaRa.js` |

각 파일은 `PracticeQuestion` 배열을 내보내고, `src/data/authoredQuestions/index.js`가 이를 합쳐 `AUTHORED_QUESTIONS`로 재수출한다.

**문항 작성 규칙**
- 문맥상 어휘: 대상 어휘를 `＿＿＿`로 비운 문장 1개. 오답 3개는 품사가 같고 문맥상 자연스럽지 않은 어휘.
- 유의 표현: 대상 어휘가 든 문장을 제시하고, 뜻이 가장 가까운 바꿔 쓴 문장을 고르게 한다. 오답은 어휘 하나만 바꿔 뜻이 달라진 문장.
- 용법: 대상 어휘를 제시하고, 그 어휘가 문법·의미상 올바르게 쓰인 문장을 고르게 한다. 오답은 같은 어휘를 어색하게 쓴 문장.
- 모든 문항은 N4 범위 문법·어휘로만 쓴다. 해설은 한국어 한두 문장.

**RED (배치마다 재실행)** — `src/data/authoredQuestions/index.test.js`
```js
it("세 유형이 각각 103문항이다", ...)                    // AC-7
it("모든 문항의 선택지가 4개이고 중복이 없다", ...)
it("정답 인덱스가 0~3 범위이고 해설이 비어 있지 않다", ...)
it("모든 어휘가 세 유형에 한 번씩 등장한다", ...)          // 누락 어휘 검출
it("문맥상 어휘 문항에 빈칸 표식이 정확히 하나 있다", ...)
```
배치가 진행될수록 통과 문항 수가 늘어나며, 9-E 커밋에서 전부 통과한다.

---

### 10단계 — 실전 연습 화면 (S3, JN4-016, JN4-022, JN4-023, JN4-025, JN4-029, AC-8)

**위험도**: 중간 · **산출물**: `src/lib/practiceSession.js`, `src/pages/PracticePage.jsx`

**인터페이스 계약 (생산)**
```js
export const PRACTICE_TYPES = [
  { id: "reading", label: "한자 읽기" },
  { id: "orthography", label: "표기" },
  { id: "context", label: "문맥상 어휘" },
  { id: "synonym", label: "유의 표현" },
  { id: "usage", label: "용법" },
];
export const SESSION_SIZE = 10;
export function getBank(typeId);                        // -> PracticeQuestion[]
export function startSession(typeId, rand);             // -> PracticeQuestion[] (10개, 중복 없음)
export function scoreSession(questions, answers);
// answers: Record<questionId, number | undefined>
// -> { total: 10, correct: number, results: Array<{ question, selected: number|null, isCorrect: boolean, isUnanswered: boolean }> }
```

**RED** — `src/lib/practiceSession.test.js`
```js
it("회차는 10문항이고 중복이 없다", ...)                 // JN4-016
it("미응답은 오답으로 집계하고 미응답으로 표시한다", ...)   // JN4-023
it("정답 수를 정확히 센다", ...)                         // JN4-022
```

**RED** — `src/pages/PracticePage.test.jsx`
```js
it("유형을 고르면 그 유형 문항이 나온다", ...)            // JN4-017~021
it("제출하면 정답 수와 문항별 정오답·해설을 보여 준다", ...) // JN4-022
it("제출 후에는 선택지를 누를 수 없다", ...)              // JN4-025
it("실전 연습은 학습 진도를 바꾸지 않는다", ...)          // JN4-029, localStorage 비교
```

---

### 11단계 — 홈과 라우팅 (JN4-001, AC-1)

**위험도**: 낮음 · **산출물**: `src/pages/HomePage.jsx`, `src/main.jsx` 최종본

라우트는 `/`(홈), `/study`(학습), `/practice`(실전 연습 유형 선택), `/practice/:typeId`(회차) 네 개다. 홈에는 학습·실전 연습 두 진입점과 현재 진도(JN4-028)만 둔다.

**RED** — `src/pages/HomePage.test.jsx`
```js
it("학습과 실전 연습 진입점만 보여 준다", ...)
it("기존 콘텐츠 이름이 화면에 없다", ...)   // 식물과 에너지 / AI Native / 스펙매니저 / 멀티에이전트
it("현재 학습 진도를 보여 준다", ...)
```

---

### 12단계 — 접근성·반응형 마무리 (JN4-U08, JN4-U09, AC-9, AC-10)

**위험도**: 낮음 · **산출물**: 키보드 조작 훅과 반응형 스타일

**인터페이스 계약 (생산)**: `src/hooks/useChoiceKeys.js`
```js
/** 숫자키 1~4 → onSelect(index), Enter → onSubmit. 입력 요소에 포커스가 있으면 무시한다. */
export function useChoiceKeys({ onSelect, onSubmit, enabled });
```

**RED** — `src/hooks/useChoiceKeys.test.jsx`: `1` 키가 `onSelect(0)`을 부르고, `Enter`가 `onSubmit`을 부르며, `enabled: false`면 아무것도 부르지 않는다.
추가로 `RecallCard`·`PracticePage` 테스트에 "모든 선택지가 `button` 요소다"를 넣는다(AC-9).

반응형은 자동 검증이 어려우므로 수동 확인으로 남긴다(AC-10).

---

### 14단계 — 후리가나 사전과 문장 분해 (JN4-036, AC-13)

**위험도**: 중간 (데이터 분량) · **산출물**: `src/lib/furigana.js`, `src/data/kanjiReadings.js`

지시자가 "예문의 한자를 못 읽으면 외울 수 없다"고 지적해(2026-08-03) 뒤늦게 추가한 단계다.
문장 1,184개에 손으로 후리가나를 적는 대신 단어→읽기 사전을 만들고 문장을 자동으로 나눈다.

**인터페이스 계약 (생산)**
```js
// src/lib/furigana.js
export function annotate(text, dictionary);          // -> Array<{ text, reading? }>
export function displayedSentences();                // -> string[] (화면에 쓰이는 일본어 문장 전부)
export function missingReadings(sentences, dict);    // -> string[] (읽기가 빠진 한자 덩어리)
// src/data/kanjiReadings.js
export const READINGS;                               // 표기 → 히라가나 읽기
```

사전 키는 보내는 가나까지 포함한 표기다. 한자 하나에 읽기 하나를 짝지을 수 없기 때문이다
(行く는 いく, 行う는 おこなう). 기본형을 짧은 키로 두고 읽기가 갈리는 경우만 긴 키를 얹는다.

**RED** — `src/lib/furigana.test.js`
```js
it("한자 덩어리에 읽기를 붙이고 가나는 그대로 둔다", ...)
it("보내는 가나까지 붙은 긴 항목을 먼저 맞춘다", ...)   // 行く / 行う
it("읽기가 붙지 않은 한자가 하나도 없다", ...)          // AC-13 — 사전을 채우는 길잡이
it("어휘 103개를 사전으로 읽으면 어휘 데이터의 읽기와 일치한다", ...)  // 읽기의 정확성 검증
```

같은 표기가 문맥에 따라 다르게 읽혀 후리가나를 붙일 수 없는 문장은 데이터를 다듬는다.
(月の光で→月あかりで, 大学に通っている→大学で勉強している, 数を計算する→計算をする)

---

### 15단계 — 후리가나 UI 연결 (JN4-032~JN4-035, AC-14, AC-15)

**위험도**: 낮음 · **산출물**: `src/components/JapaneseText.jsx`, `src/components/FuriganaToggle.jsx`, `src/lib/settingsStore.js`

**인터페이스 계약 (생산)**
```jsx
export default function JapaneseText({ text, furigana, excludeUnderlined });
export default function FuriganaToggle({ enabled, onToggle });
// src/lib/settingsStore.js
export const FURIGANA_KEY;                  // "jlpt-n4-furigana" (진도와 다른 키)
export function loadFurigana(storage);      // 기본값 false (JN4-033)
export function saveFurigana(storage, enabled);
```

**RED** — `JapaneseText.test.jsx`, `settingsStore.test.js`, 두 화면 테스트에 각각 추가
```js
it("후리가나를 켜면 한자에만 읽기를 얹고 보내는 가나는 그대로 둔다", ...)
it("밑줄 대상은 후리가나에서 제외한다", ...)                    // JN4-034, AC-14
it("후리가나 설정을 저장하고 다시 열 때 복원한다", ...)          // JN4-035, AC-15
it("한자 읽기 유형은 후리가나를 켜도 밑줄 대상의 읽기를 보여 주지 않는다", ...)
```

학습 화면의 제시 대상은 답하기 전에는 후리가나를 붙이지 않는다. 표기→읽기 회상에서
정답이 그대로 보이기 때문이다. 예문·단어는 답한 뒤에 붙는다.

---

### 16단계 — 학습 진도 초기화 (JN4-037~JN4-041, AC-16, AC-17)

**위험도**: 낮음 · **산출물**: `src/lib/progressStore.js`, `src/components/ResetProgressButton.jsx`, `src/pages/HomePage.jsx`

**인터페이스 계약 (생산)**
```jsx
// src/lib/progressStore.js
export function clearProgress(storage);   // 진도 키만 제거, 예외를 밖으로 던지지 않음
// src/components/ResetProgressButton.jsx
export default function ResetProgressButton({ onConfirm });
```

**RED** — `progressStore.test.js`, `HomePage.test.jsx`에 추가
```js
it("저장된 진도를 모두 지운다", ...)                          // JN4-039
it("후리가나 설정은 함께 지우지 않는다", ...)                  // JN4-041, AC-17
it("저장된 진도가 없으면 초기화 버튼을 보여 주지 않는다", ...)   // JN4-037
it("버튼을 한 번 누르면 바로 지우지 않고 확인과 취소를 묻는다", ...) // JN4-038
it("취소를 누르면 진도를 그대로 유지한다", ...)                 // JN4-040, AC-16
```

되돌릴 수 없는 동작이므로 확인 단계를 컴포넌트 안에 둔다. 지우는 일은 컴포넌트가 하지 않고
화면이 `onConfirm`으로 받는다. 초기화 후 진도 표시를 갱신하려면 홈 화면이 진도를 상태로 들어야 한다.

---

### 13단계 — 통합 검증과 정리

`npm test`, `npm run build`를 돌리고, 아래 수동 체크리스트를 수행한다. 스펙의 §6 수용 조건 12개를 하나씩 대조해 완료 보고에 결과를 적는다.

## 4. 테스트 전략

**자동 테스트 신규 작성**

| 파일 | 대상 | 관련 동작 |
|---|---|---|
| `src/data/vocabulary.test.js` | 어휘 103개 무결성 | JN4-002, JN4-003, AC-2 |
| `src/lib/srs.test.js` | 간격 반복 규칙 | JN4-009~JN4-012, AC-5 |
| `src/lib/progressStore.test.js` | 저장·복원·손상 복구 | JN4-013~JN4-015, AC-6 |
| `src/lib/quizGenerator.test.js` | 네 지선다 구성 | JN4-007, JN4-027, AC-3 |
| `src/lib/questionBuilders.test.js` | 읽기·표기 문항 생성 | JN4-017, JN4-018 |
| `src/data/authoredQuestions/index.test.js` | 창작 문항 309개 무결성 | JN4-019~JN4-021, AC-7 |
| `src/lib/practiceSession.test.js` | 회차 구성·채점 | JN4-016, JN4-022, JN4-023 |
| `src/pages/StudyPage.test.jsx` | 학습 화면 | JN4-005, JN4-008, JN4-024, JN4-028, AC-4 |
| `src/pages/PracticePage.test.jsx` | 실전 연습 화면 | JN4-022, JN4-025, JN4-029, AC-8 |
| `src/pages/HomePage.test.jsx` | 홈 진입점 | JN4-001, AC-1 |
| `src/hooks/useChoiceKeys.test.jsx` | 키보드 조작 | JN4-U08, AC-9 |
| `src/lib/furigana.test.js` | 문장 분해·사전 커버리지·읽기 정확성 | JN4-036, AC-13 |
| `src/lib/settingsStore.test.js` | 후리가나 설정 저장 | JN4-033, JN4-035, AC-15 |
| `src/components/JapaneseText.test.jsx` | 루비 표시·밑줄 대상 제외 | JN4-032~JN4-034, AC-14 |

**수동 회귀 체크리스트**

| # | 확인 | 관련 |
|---|---|---|
| M1 | 홈에 기존 콘텐츠 카드가 하나도 없다 | AC-1 |
| M2 | 폭 360px에서 학습·연습 화면에 가로 스크롤이 없다 | AC-10 |
| M3 | 학습 카드 10장을 푼 뒤 새로고침하면 진도가 그대로다 | JN4-014 |
| M4 | 브라우저 개발자 도구로 저장값을 깨뜨려도 앱이 정상 시작한다 | JN4-015 |
| M5 | 다섯 유형을 각각 한 회차씩 풀어 결과 화면이 정상 표시된다 | JN4-022 |
| M6 | 어휘 103개와 창작 문항 309개를 지시자가 검수한다 | AC-11, AC-12 |
| M7 | 후리가나를 켠 상태로 다섯 유형을 훑어 읽기가 어색한 곳이 없는지 지시자가 확인한다 | AC-11 |

## 5. 위험과 완화

| 위험 | 영향 | 완화 |
|---|---|---|
| 창작 문항 309개가 작업량의 대부분이고, 후반에 몰리면 품질이 떨어진다 | 높음 | 9단계를 다섯 배치로 쪼개 배치마다 커밋·검수한다. 배치별 테스트가 누락 어휘를 즉시 잡는다. |
| 2단계 삭제가 되돌리기 어렵다 | 높음 | 삭제를 단독 커밋으로 분리한다. 되돌릴 때는 해당 커밋만 revert하면 된다. 삭제 대상은 모두 이미 커밋된 상태라 git 이력에 남는다. |
| 창작 문항이 원본 교재 예문과 우연히 겹친다 | 중간 | 원본 이미지는 어휘 목록(표기·읽기·뜻)만 담고 있어 예문이 없다. 예문·문항은 전부 새로 쓰므로 구조적으로 겹칠 수 없다. AC-12로 확인한다. |
| 무작위 로직이 테스트를 불안정하게 만든다 | 중간 | `rand`를 인자로 주입한다. 화면에서만 `Math.random`을 넘긴다. |
| 시각 의존 로직(간격 반복)이 테스트를 불안정하게 만든다 | 중간 | `now`를 인자로 주입한다. `Date.now`를 로직 안에서 직접 부르지 않는다. |
| 일본어 예문에 N4 범위를 넘는 문법이 섞인다 | 중간 | 문항 작성 규칙에 "N4 범위 문법·어휘만" 명시. 검수 항목 M6에 포함. |

## 6. 브랜치·PR 전략

- 브랜치: `choihc/n4-1` (현 브랜치 유지, 새로 만들지 않음)
- 커밋: 각 단계를 1커밋으로 두되 9단계는 배치별 5커밋으로 나눈다.
  14·15단계는 구현 도중 지시자 요청으로 추가되었다.
- 커밋 메시지는 한국어로 쓰고 관련 동작 ID를 본문에 남긴다.
- PR은 `pr-review-process` 스킬에 따라 code-reviewer 에이전트 + Codex 이중 리뷰를 거친 뒤 지시자 승인을 받아 생성한다.

## 7. 완료 보고 항목

작업 종료 시 아래를 스펙 동작 ID 기준으로 보고한다.

- **충족**: JN4-001~JN4-031 각각의 구현 위치와 검증 테스트
- **수용 조건**: AC-1~AC-12 통과 여부. AC-10·AC-11·AC-12는 수동 확인 결과
- **미해결**: 남은 항목이 있으면 이유와 함께 명시
- **테스트 결과**: `npm test` 통과 수, `npm run build` 결과
