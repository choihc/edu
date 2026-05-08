# 식물과 에너지 학습 페이지 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 중학교 2학년 `12단원 식물과 에너지` 학습 페이지를 추가하고, 기존 수동 해시 라우팅을 React Router 기반 라우팅으로 전환한다.

**Architecture:** Vite + React 단일 앱을 유지하되 `src/main.jsx`에서 `createBrowserRouter`로 라우트를 정의한다. 기존 `App.jsx`는 홈과 일본어 학습 화면을 named export로 제공하도록 최소 수정하고, 새 학습 페이지는 `src/PlantEnergyLearning.jsx`에 독립 구현한다. 발표 자료 슬라이드 번호는 `/spec-manager/:slide` 경로 파라미터로 관리하며 legacy `#/...` 진입은 초기 로드에서 새 URL로 치환한다.

**Tech Stack:** React 18, Vite 5, react-router-dom 6.x, CSS-in-JS style object, CSS keyframe animation.

---

## Chunk 1: 라우팅 기반 정리

**파일 소유권과 계약:**
- `src/main.jsx`: 라우트 테이블, legacy hash 초기 치환, `RouterProvider` 렌더링만 담당한다. 학습 UI나 발표 슬라이드 상태 로직을 넣지 않는다.
- `src/App.jsx`: 홈 화면과 일본어 학습 화면을 named export로 제공한다. 기존 일본어 학습 동작은 유지하고 해시 분기만 제거한다.
- `src/Presentation.jsx`: 발표 슬라이드 상태를 React Router 경로 파라미터와 동기화한다. 슬라이드 컨텐츠 데이터는 변경하지 않는다.
- `src/MultiAgentProcess.jsx`: 링크 URL만 path 기반으로 변경한다.
- 금지 사항: 라우팅 전환 중 기존 학습/발표 컨텐츠를 재작성하거나 디자인을 대폭 바꾸지 않는다.

### Task 1: React Router 의존성 추가

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: 의존성 설치**

Run: `npm install react-router-dom@^6.30.1`

Expected: `package.json` dependencies에 `react-router-dom`이 추가되고 `package-lock.json`이 갱신된다.

- [ ] **Step 2: 설치 결과 확인**

Run: `npm ls react-router-dom`

Expected: `react-router-dom@6.x`가 출력된다.

### Task 2: 기존 App.jsx의 해시 라우팅 제거 준비

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: 기존 해시 라우터 위치 확인**

Run: `rg "useHash|window.location.hash|#/|export default function App" src/App.jsx`

Expected: `useHash`, `BackLink`, 홈 메뉴 링크, 파일 하단 `App` 기본 export 위치가 확인된다.

- [ ] **Step 2: 홈/일본어 화면을 named export로 노출**

Implementation:
- `function HomePage()`를 `export function HomePage()`로 변경한다.
- `function VocabularyPage()`를 `export function VocabularyPage()`로 변경한다.
- 하단 기본 export는 홈 화면만 반환하도록 단순화한다.

Expected code shape:

```jsx
export function HomePage() {
  // existing implementation
}

export function VocabularyPage() {
  // existing implementation
}

export default function App() {
  return <HomePage />;
}
```

- [ ] **Step 3: 사용하지 않는 해시 훅 제거**

Implementation:
- `useHash` 함수를 삭제한다.
- `useHash`에서만 쓰던 import가 있으면 정리한다. 단, 다른 컴포넌트에서 쓰는 `useEffect`, `useMemo`, `useState`는 유지한다.

- [ ] **Step 4: 홈 링크를 path 기반으로 변경**

Implementation:
- `#/jp-vocab` → `/jp-vocab`
- `#/multi-agent` → `/multi-agent`
- `#/spec-manager` → `/spec-manager`
- 새 메뉴 `/plant-energy` 추가
- `BackLink` 기본값 `"#/"` → `"/"`

Expected: `rg "#/" src/App.jsx`에서 결과가 없어야 한다.

### Task 3: main.jsx에 createBrowserRouter 적용

**Files:**
- Modify: `src/main.jsx`

- [ ] **Step 1: 라우터 imports 추가**

Implementation:

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App, { HomePage, VocabularyPage } from "./App.jsx";
import MultiAgentProcess from "./MultiAgentProcess.jsx";
import Presentation from "./Presentation.jsx";
import PlantEnergyLearning from "./PlantEnergyLearning.jsx";
```

- [ ] **Step 2: legacy hash 치환 함수 추가**

Implementation:

```jsx
function redirectLegacyHash() {
  const { hash, pathname, search } = window.location;
  if (!hash.startsWith("#/")) return;
  const nextPath = hash.slice(1);
  window.history.replaceState(null, "", `${nextPath}${search}`);
}
```

Call `redirectLegacyHash()` before creating the router.

- [ ] **Step 3: 라우트 정의**

Implementation:

```jsx
const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/jp-vocab", element: <VocabularyPage /> },
  { path: "/multi-agent", element: <MultiAgentProcess /> },
  { path: "/spec-manager", element: <Presentation /> },
  { path: "/spec-manager/:slide", element: <Presentation /> },
  { path: "/plant-energy", element: <PlantEnergyLearning /> },
  { path: "*", element: <App /> },
]);
```

- [ ] **Step 4: 렌더링을 RouterProvider로 전환**

Implementation:

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

### Task 4: 발표 자료를 path parameter 기반으로 전환

**Files:**
- Modify: `src/Presentation.jsx`

- [ ] **Step 1: React Router hooks import**

Implementation:

```jsx
import { useNavigate, useParams } from "react-router-dom";
```

- [ ] **Step 2: 슬라이드 초기값을 params에서 읽기**

Implementation:
- `window.location.hash.match(...)`를 제거한다.
- `const { slide } = useParams();`로 읽는다.
- `slide`가 없으면 0, 숫자가 있으면 `slide - 1`로 clamp한다.
- URL 파라미터가 바뀌면 `idx`도 동기화한다.

- [ ] **Step 3: goto에서 navigate 사용**

Implementation:
- `window.history.replaceState`를 제거한다.
- `navigate(clamped === 0 ? "/spec-manager" : `/spec-manager/${clamped + 1}`);`를 사용한다.
- 브라우저 뒤로가기 검증을 위해 `replace: true`를 사용하지 않는다.

- [ ] **Step 4: 내부 링크 수정**

Implementation:
- `href="#/"` → `href="/"`
- `rg "window.location.hash|#/" src/Presentation.jsx` 결과가 없어야 한다.

### Task 5: 멀티에이전트 화면 링크 수정

**Files:**
- Modify: `src/MultiAgentProcess.jsx`

- [ ] **Step 1: 해시 링크를 path 링크로 변경**

Implementation:
- `href="#/spec-manager"` → `href="/spec-manager"`

Run: `rg "#/" src`

Expected: 앱 소스에서 해시 라우트 링크가 없어야 한다. 단, `src/main.jsx`의 legacy redirect 판별 문자열 `"#/"`는 허용한다.

### Task 6: Chunk 1 검증

**Files:**
- Verify only

- [ ] **Step 1: 빌드 실행**

Run: `npm run build`

Expected: Vite build succeeds.

- [ ] **Step 2: 라우팅 문자열 검증**

Run: `rg "hashchange|#/" src`

Expected: 앱 소스에서 해시 라우트 링크와 `hashchange` 이벤트 리스너가 남아 있지 않다. 단, `src/main.jsx`의 legacy hash 초기 치환을 위한 `window.location.hash` 사용은 허용한다.

- [ ] **Step 3: 커밋**

Run:

```bash
git add package.json package-lock.json src/main.jsx src/App.jsx src/Presentation.jsx src/MultiAgentProcess.jsx
git commit -m "React Router 기반 라우팅으로 전환"
```

Expected: 라우팅 전환 커밋 생성.

---

## Chunk 2: 식물과 에너지 학습 페이지 구현

**파일 소유권과 계약:**
- `src/PlantEnergyLearning.jsx`: 식물과 에너지 학습 UI, 학습 데이터, 조건 실험 모델, 퀴즈 상태를 소유한다.
- `src/App.jsx`: 홈 메뉴에서 `/plant-energy` 링크만 연결한다.
- 금지 사항: 새 학습 페이지 구현 중 라우터 구조, 발표 자료, 일본어 학습 로직을 추가 변경하지 않는다.

### Task 7: 학습 페이지 데이터 모델과 기본 화면 생성

**Files:**
- Create: `src/PlantEnergyLearning.jsx`

- [ ] **Step 1: 컴포넌트 골격 작성**

Implementation:
- `sections` 상수 3개: `story`, `inside`, `experiment`
- `miniTest` 상수 5문항
- `useState`로 active section, quiz answers, slider values 관리

Expected code shape:

```jsx
export default function PlantEnergyLearning() {
  const [activeSection, setActiveSection] = useState("story");
  const [answers, setAnswers] = useState({});
  const [conditions, setConditions] = useState({
    light: 70,
    co2: 65,
    temperature: 25,
    humidity: 45,
  });

  return <main>{/* learning UI */}</main>;
}
```

- [ ] **Step 2: 전체 레이아웃 구현**

Implementation:
- 상단: 홈으로 이동 링크, 단원명, 현재 학습 진행 표시
- 본문: 왼쪽/상단 코스 네비게이션, 오른쪽/아래 활성 학습 패널
- 하단: 단원 미니 테스트
- 카드 안의 카드 중첩은 피하고, 섹션은 full-width band 또는 plain layout으로 구성한다.

- [ ] **Step 3: 모바일 반응형 기본값 추가**

Implementation:
- `gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))"` 패턴 사용
- fixed format 도식에는 `aspectRatio`와 `minHeight` 지정

### Task 8: 낮과 밤 스토리 섹션 구현

**Files:**
- Modify: `src/PlantEnergyLearning.jsx`

- [ ] **Step 1: 광합성/호흡 비교 도식 구현**

Implementation:
- 낮 패널: `빛 + CO2 + 물 -> 포도당 + 산소`
- 밤 패널: `포도당 + 산소 -> 이산화탄소 + 물 + 에너지`
- CSS animation으로 기체 입자 방향을 보여준다.

- [ ] **Step 2: 핵심 문장 구현**

Content:
- `낮에는 광합성량이 호흡량보다 크면 겉으로 산소가 더 많이 나옵니다.`
- `밤에는 광합성이 멈추고 호흡만 계속됩니다.`

- [ ] **Step 3: 확인 문제 2문항 추가**

Questions:
- 낮에 식물이 겉으로 이산화탄소를 흡수하는 까닭은?
- 밤에 식물이 산소를 흡수하는 까닭은?

Expected: 정답/오답 선택 시 피드백이 즉시 표시된다.

### Task 9: 식물 내부 탐험 섹션 구현

**Files:**
- Modify: `src/PlantEnergyLearning.jsx`

- [ ] **Step 1: 식물 구조 도식 구현**

Implementation:
- 뿌리털, 물관, 체관, 잎, 엽록체, 기공, 공변세포, 미토콘드리아 라벨을 포함한다.
- 물관 흐름은 위쪽 방향, 체관 흐름은 필요한 곳으로 퍼지는 방향을 표시한다.

- [ ] **Step 2: 구조별 설명 리스트 구현**

Content:
- 뿌리털: 물과 무기 이온 흡수
- 물관: 물과 무기 양분 이동
- 체관: 광합성 산물 이동
- 엽록체: 광합성 장소
- 기공/공변세포: 기체 출입과 증산 조절
- 미토콘드리아: 호흡 장소

- [ ] **Step 3: 확인 문제 2문항 추가**

Questions:
- 물과 무기 양분이 이동하는 통로는?
- 광합성 산물이 이동하는 통로는?

Expected: 정답/오답 선택 시 피드백이 즉시 표시된다.

### Task 10: 조건 실험 섹션 구현

**Files:**
- Modify: `src/PlantEnergyLearning.jsx`

- [ ] **Step 1: 단순 모델 함수 작성**

Implementation:

```jsx
function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function getExperimentResult({ light, co2, temperature, humidity }) {
  const temperatureEffect = clamp(100 - Math.abs(temperature - 25) * 4);
  const photosynthesis = Math.round(clamp((light * 0.38) + (co2 * 0.34) + (temperatureEffect * 0.28)));
  const transpiration = Math.round(clamp((light * 0.3) + (temperature * 1.8) - (humidity * 0.45)));
  return { photosynthesis, transpiration, temperatureEffect };
}
```

- [ ] **Step 2: 슬라이더 UI 구현**

Controls:
- 빛 세기: 0-100
- 이산화탄소 농도: 0-100
- 온도: 5-40
- 습도: 0-100

Expected: 슬라이더 변경 시 광합성 속도와 증산량 게이지가 즉시 바뀐다.

- [ ] **Step 3: 결과 해설 구현**

Content:
- `교육용 단순 모델입니다. 실제 식물의 반응은 종류와 환경에 따라 달라질 수 있습니다.`
- 조건 변화에 따라 “광합성이 잘 일어나는 조건”, “증산이 활발한 조건”을 한 문장으로 표시한다.

- [ ] **Step 4: 확인 문제 2문항 추가**

Questions:
- 빛이 약해지면 광합성 속도는 어떻게 되는가?
- 습도가 높아지면 증산량은 어떻게 되는가?

Expected: 정답/오답 선택 시 피드백이 즉시 표시된다.

### Task 11: 미니 테스트와 점수 피드백 구현

**Files:**
- Modify: `src/PlantEnergyLearning.jsx`

- [ ] **Step 1: 5문항 미니 테스트 구현**

Question coverage:
- 광합성 반응식
- 호흡 반응식
- 낮/밤 비교
- 물관/체관 구분
- 조건 변화 해석

- [ ] **Step 2: 점수 요약 구현**

Implementation:
- 답변한 문항 수와 정답 수 표시
- 모든 문항 답변 후 `다시 볼 개념` 추천 표시

- [ ] **Step 3: 다시 풀기 기능 구현**

Implementation:
- 미니 테스트 답변 상태만 초기화하는 버튼 추가

### Task 12: 홈 연결과 Chunk 2 검증

**Files:**
- Modify: `src/App.jsx`
- Verify: `src/PlantEnergyLearning.jsx`

- [ ] **Step 1: 홈 메뉴 확인**

Implementation:
- `HomePage` 메뉴에 `/plant-energy` 항목이 첫 번째 또는 학습 페이지 그룹에 보이도록 한다.
- 제목: `12단원 식물과 에너지`
- 메타: `광합성 · 호흡 · 증산 · 물질 이동`

- [ ] **Step 2: 빌드 실행**

Run: `npm run build`

Expected: Vite build succeeds.

- [ ] **Step 3: 커밋**

Run:

```bash
git add src/App.jsx src/PlantEnergyLearning.jsx
git commit -m "식물과 에너지 학습 페이지 구현"
```

Expected: 학습 페이지 구현 커밋 생성.

---

## Chunk 3: 통합 검증과 브라우저 확인

### Task 13: 개발 서버로 라우팅 검증

**Files:**
- Verify only

- [ ] **Step 1: 개발 서버 시작**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite dev server URL이 출력된다.

- [ ] **Step 2: 주요 경로 수동 확인**

Open:
- `/`
- `/jp-vocab`
- `/multi-agent`
- `/spec-manager`
- `/spec-manager/2`
- `/plant-energy`

Expected: 모든 경로가 렌더링된다.

- [ ] **Step 3: legacy hash redirect 확인**

Open:
- `/#/jp-vocab`
- `/#/multi-agent`
- `/#/spec-manager/2`

Expected: 각각 `/jp-vocab`, `/multi-agent`, `/spec-manager/2`로 URL이 치환된다.

- [ ] **Step 4: 발표 슬라이드 히스토리 확인**

Scenario:
- `/spec-manager`에서 다음 슬라이드 버튼을 눌러 `/spec-manager/2`로 이동한다.
- 브라우저 뒤로가기를 누른다.
- 브라우저 앞으로가기를 누른다.

Expected:
- 뒤로가기 시 `/spec-manager` 첫 슬라이드로 돌아간다.
- 앞으로가기 시 `/spec-manager/2`로 다시 이동한다.

- [ ] **Step 5: Vite preview에서 직접 경로 확인**

Run:

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

Open:
- `/plant-energy`
- `/spec-manager/2`

Expected: Vite preview에서도 직접 경로 접근이 렌더링된다. 별도 정적 호스팅 fallback은 배포 환경 작업으로 남긴다.

### Task 14: 학습 상호작용 검증

**Files:**
- Verify only

- [ ] **Step 1: 섹션 이동 확인**

Expected: 코스 네비게이션을 누르면 스토리, 탐험, 실험 섹션이 전환된다.

- [ ] **Step 2: 슬라이더 확인**

Expected: 조건 실험 슬라이더를 움직이면 광합성/증산 게이지와 해설이 변경된다.

- [ ] **Step 3: 퀴즈 확인**

Expected: 확인 문제와 미니 테스트에서 정답/오답 피드백이 즉시 표시된다.

- [ ] **Step 4: 반응형 확인**

Viewport:
- Desktop: 1440x900
- Mobile: 390x844

Expected: 텍스트와 도식이 겹치지 않는다.

### Task 15: 최종 검증 커밋 또는 보고

**Files:**
- Verify only

- [ ] **Step 1: 최종 상태 확인**

Run: `git status --short`

Expected: 의도한 변경만 남아 있거나 clean.

- [ ] **Step 2: 빌드 재실행**

Run: `npm run build`

Expected: Vite build succeeds.

- [ ] **Step 3: 최종 보고**

Report:
- 구현한 기능
- 검증한 명령
- 남은 리스크: 정적 호스팅 fallback은 배포 환경에서 별도 설정 필요
