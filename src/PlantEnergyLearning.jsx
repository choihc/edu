import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const palette = {
  bg: "#f6f8ef",
  ink: "#102018",
  text: "#23332b",
  muted: "#5f7068",
  line: "#d8dfd2",
  surface: "#fffdf6",
  green: "#247a46",
  greenSoft: "#dff4ce",
  yellow: "#f4c430",
  blue: "#2f7fb4",
  blueSoft: "#dbeffd",
  orange: "#d56a23",
  orangeSoft: "#ffe5cf",
  red: "#b94235",
};

const courseSections = [
  {
    id: "story",
    step: "1",
    label: "낮과 밤 스토리",
    short: "광합성·호흡 관계",
    takeaway: "낮과 밤에 식물 주변 기체 변화가 달라지는 까닭을 이해합니다.",
    accent: palette.green,
  },
  {
    id: "inside",
    step: "2",
    label: "식물 내부 탐험",
    short: "기관과 물질 이동",
    takeaway: "뿌리털, 물관, 체관, 엽록체, 기공의 역할을 연결합니다.",
    accent: palette.blue,
  },
  {
    id: "experiment",
    step: "3",
    label: "조건 실험",
    short: "환경 조건과 결과",
    takeaway: "빛, 이산화탄소, 온도, 습도를 바꾸며 결과를 예측합니다.",
    accent: palette.orange,
  },
];

const sectionQuestions = {
  story: [
    {
      id: "story-1",
      prompt: "낮에 식물이 겉으로 이산화탄소를 흡수하는 것처럼 보이는 까닭은?",
      options: [
        "호흡이 완전히 멈추기 때문",
        "광합성량이 호흡량보다 크기 때문",
        "증산 작용이 이산화탄소를 만들기 때문",
      ],
      answer: 1,
      feedback: [
        "호흡은 낮에도 계속 일어납니다. 다만 광합성이 더 활발합니다.",
        "맞습니다. 낮에는 광합성이 호흡보다 활발해 이산화탄소가 순흡수됩니다.",
        "증산 작용은 수증기가 빠져나가는 현상입니다.",
      ],
    },
    {
      id: "story-2",
      prompt: "밤에 식물이 산소를 흡수하는 주된 까닭은?",
      options: [
        "광합성만 일어나기 때문",
        "호흡만 계속 일어나기 때문",
        "체관이 산소를 운반하기 때문",
      ],
      answer: 1,
      feedback: [
        "밤에는 빛이 부족해 광합성이 거의 일어나지 않습니다.",
        "맞습니다. 호흡은 낮과 밤 모두 계속되어 산소를 사용합니다.",
        "체관은 주로 광합성 산물 같은 유기물을 이동시킵니다.",
      ],
    },
  ],
  inside: [
    {
      id: "inside-1",
      prompt: "뿌리에서 흡수한 물과 무기 양분이 위로 이동하는 통로는?",
      options: ["물관", "체관", "기공"],
      answer: 0,
      feedback: [
        "맞습니다. 물관은 물과 무기 양분을 위쪽으로 이동시킵니다.",
        "체관은 광합성 산물이 필요한 곳으로 이동하는 통로입니다.",
        "기공은 기체 출입과 증산이 일어나는 잎의 작은 구멍입니다.",
      ],
    },
    {
      id: "inside-2",
      prompt: "광합성으로 만든 포도당 같은 유기물이 이동하는 통로는?",
      options: ["물관", "체관", "뿌리털"],
      answer: 1,
      feedback: [
        "물관은 물과 무기 양분 이동에 주로 관여합니다.",
        "맞습니다. 체관은 광합성 산물을 필요한 기관으로 보냅니다.",
        "뿌리털은 흙 속의 물과 무기 이온을 흡수합니다.",
      ],
    },
  ],
  experiment: [
    {
      id: "experiment-1",
      prompt: "빛이 약해지면 일반적으로 광합성 속도는 어떻게 될까요?",
      options: ["증가한다", "감소한다", "항상 그대로다"],
      answer: 1,
      feedback: [
        "빛은 광합성에 필요한 에너지입니다. 약해지면 보통 속도가 줄어듭니다.",
        "맞습니다. 빛에너지가 줄면 광합성 속도도 보통 감소합니다.",
        "빛의 세기는 광합성 속도에 영향을 줍니다.",
      ],
    },
    {
      id: "experiment-2",
      prompt: "습도가 높아지면 증산량은 보통 어떻게 변할까요?",
      options: ["감소한다", "증가한다", "항상 0이 된다"],
      answer: 0,
      feedback: [
        "맞습니다. 공기 중 수증기가 많으면 잎 밖으로 물이 빠져나가기 어려워집니다.",
        "습도가 높으면 증산은 보통 줄어듭니다.",
        "습도가 높아도 조건에 따라 증산은 완전히 멈추지 않을 수 있습니다.",
      ],
    },
  ],
};

const miniTest = [
  {
    id: "mini-1",
    concept: "광합성",
    prompt: "광합성 반응식의 빈칸에 들어갈 물질은? 이산화탄소 + 물 → 포도당 + ___",
    options: ["산소", "질소", "녹말"],
    answer: 0,
    feedback: "광합성은 빛에너지를 이용해 포도당과 산소를 만듭니다.",
  },
  {
    id: "mini-2",
    concept: "호흡",
    prompt: "식물의 호흡이 일어나는 장소로 가장 알맞은 것은?",
    options: ["미토콘드리아", "기공", "체관"],
    answer: 0,
    feedback: "호흡은 미토콘드리아에서 포도당을 분해해 에너지를 얻는 과정입니다.",
  },
  {
    id: "mini-3",
    concept: "낮과 밤",
    prompt: "낮에도 식물의 호흡은 일어날까요?",
    options: ["일어난다", "일어나지 않는다", "기공이 닫힐 때만 일어난다"],
    answer: 0,
    feedback: "호흡은 생명 활동에 필요한 에너지를 얻는 과정이라 낮과 밤 모두 계속됩니다.",
  },
  {
    id: "mini-4",
    concept: "물질 이동",
    prompt: "물관과 체관의 설명으로 옳은 것은?",
    options: [
      "물관은 물과 무기 양분, 체관은 광합성 산물을 이동시킨다",
      "물관은 산소만, 체관은 이산화탄소만 이동시킨다",
      "물관과 체관은 모두 기공 안에 있다",
    ],
    answer: 0,
    feedback: "물관은 물과 무기 양분, 체관은 광합성 산물의 이동과 관련됩니다.",
  },
  {
    id: "mini-5",
    concept: "조건 변화",
    prompt: "광합성 속도에 영향을 주는 조건으로 묶인 것은?",
    options: ["빛의 세기, 이산화탄소 농도, 온도", "습도, 소리, 흙 색깔", "달의 모양, 바람 이름, 잎의 무늬"],
    answer: 0,
    feedback: "광합성 속도에는 빛의 세기, 이산화탄소 농도, 온도 등이 영향을 줍니다.",
  },
];

const organFacts = [
  ["뿌리털", "물과 무기 이온을 흡수합니다."],
  ["물관", "물과 무기 양분을 뿌리에서 잎 쪽으로 이동시킵니다."],
  ["체관", "광합성 산물을 필요한 곳으로 이동시킵니다."],
  ["엽록체", "엽록소가 빛을 흡수하고 광합성이 일어나는 장소입니다."],
  ["기공·공변세포", "기체 출입과 증산량을 조절합니다."],
  ["미토콘드리아", "포도당을 분해해 에너지를 얻는 호흡 장소입니다."],
];

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function getExperimentResult({ light, co2, temperature, humidity }) {
  const temperatureEffect = clamp(100 - Math.abs(temperature - 25) * 4);
  const photosynthesis = Math.round(
    clamp(light * 0.38 + co2 * 0.34 + temperatureEffect * 0.28)
  );
  const transpiration = Math.round(
    clamp(light * 0.3 + temperature * 1.8 - humidity * 0.45)
  );
  return { photosynthesis, transpiration, temperatureEffect };
}

function getExperimentInsight({ photosynthesis, transpiration }) {
  if (photosynthesis >= 75 && transpiration >= 60) {
    return "광합성과 증산이 모두 활발한 조건입니다. 물 공급이 충분해야 잎이 쉽게 시들지 않습니다.";
  }
  if (photosynthesis >= 75) {
    return "광합성이 잘 일어나는 조건입니다. 빛, 이산화탄소, 적절한 온도가 함께 맞았습니다.";
  }
  if (transpiration >= 60) {
    return "증산이 활발한 조건입니다. 물이 위로 끌려 올라가는 힘도 커질 수 있습니다.";
  }
  return "조건 중 하나 이상이 부족합니다. 어떤 조건이 제한 요인인지 슬라이더를 움직여 확인해 보세요.";
}

function SectionButton({ section, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        border: `1px solid ${active ? section.accent : palette.line}`,
        background: active ? section.accent : palette.surface,
        color: active ? "#fff" : palette.text,
        borderRadius: 8,
        padding: "14px 16px",
        textAlign: "left",
        cursor: "pointer",
        display: "grid",
        gap: 6,
        minHeight: 94,
        boxShadow: active ? `0 14px 30px ${section.accent}25` : "none",
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 900 }}>STEP {section.step}</span>
      <strong style={{ fontSize: 18 }}>{section.label}</strong>
      <span style={{ fontSize: 13, opacity: 0.85 }}>{section.short}</span>
    </button>
  );
}

function ProgressBar({ label, value, color }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
        <strong>{label}</strong>
        <span style={{ color: palette.muted }}>{value}%</span>
      </div>
      <div
        style={{
          height: 14,
          background: "#edf0e7",
          borderRadius: 999,
          overflow: "hidden",
          border: `1px solid ${palette.line}`,
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: color,
            transition: "width 0.28s ease",
          }}
        />
      </div>
    </div>
  );
}

function QuizBlock({ title, questions, answers, onAnswer }) {
  return (
    <section
      style={{
        borderTop: `1px solid ${palette.line}`,
        paddingTop: 22,
        display: "grid",
        gap: 16,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 22, color: palette.ink }}>{title}</h3>
      {questions.map((question) => {
        const selected = answers[question.id];
        return (
          <div
            key={question.id}
            style={{
              background: "#fff",
              border: `1px solid ${palette.line}`,
              borderRadius: 8,
              padding: 16,
            }}
          >
            <p style={{ margin: "0 0 12px", fontWeight: 900, color: palette.text }}>
              {question.prompt}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {question.options.map((option, index) => {
                const isSelected = selected === index;
                const isCorrect = question.answer === index;
                return (
                  <button
                    key={option}
                    onClick={() => onAnswer(question.id, index)}
                    aria-pressed={isSelected}
                    style={{
                      border: `1px solid ${
                        isSelected ? (isCorrect ? palette.green : palette.red) : palette.line
                      }`,
                      background: isSelected ? (isCorrect ? "#e8f6df" : "#fde8e5") : "#fffdf8",
                      color: palette.text,
                      borderRadius: 8,
                      padding: "10px 12px",
                      cursor: "pointer",
                      fontWeight: 800,
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {selected !== undefined && (
              <p
                style={{
                  margin: "12px 0 0",
                  color: selected === question.answer ? palette.green : palette.red,
                  fontWeight: 800,
                  lineHeight: 1.6,
                }}
              >
                {question.feedback[selected] ?? question.feedback}
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}

function StorySection({ answers, onAnswer }) {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 14,
        }}
      >
        <div className="cycle-panel day-panel">
          <div>
            <span className="panel-label">낮</span>
            <h3>광합성량 &gt; 호흡량</h3>
            <p>이산화탄소와 물이 빛에너지를 받아 포도당과 산소로 바뀝니다.</p>
          </div>
          <div className="leaf-stage">
            <span className="particle co2 p1">CO2</span>
            <span className="particle water p2">H2O</span>
            <span className="particle oxygen p3">O2</span>
            <span className="sunbeam" />
            <div className="leaf-shape">엽록체</div>
          </div>
          <strong>이산화탄소 + 물 → 포도당 + 산소</strong>
        </div>
        <div className="cycle-panel night-panel">
          <div>
            <span className="panel-label">밤</span>
            <h3>호흡만 계속 진행</h3>
            <p>빛이 없으면 광합성은 거의 멈추지만, 생명 활동을 위한 호흡은 계속됩니다.</p>
          </div>
          <div className="leaf-stage">
            <span className="particle sugar p1">포도당</span>
            <span className="particle oxygen p2">O2</span>
            <span className="particle energy p3">에너지</span>
            <div className="mitochondria">미토콘드리아</div>
          </div>
          <strong>포도당 + 산소 → 이산화탄소 + 물 + 에너지</strong>
        </div>
      </div>
      <div className="key-sentence">
        낮에는 호흡도 일어나지만 광합성이 더 활발합니다. 그래서 겉으로는 산소 방출과 이산화탄소 흡수가 크게 보입니다.
      </div>
      <QuizBlock
        title="스토리 확인 문제"
        questions={sectionQuestions.story}
        answers={answers}
        onAnswer={onAnswer}
      />
    </div>
  );
}

function InsideSection({ answers, onAnswer }) {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div
          className="plant-diagram"
          role="img"
          aria-label="식물 내부에서 뿌리털은 물과 무기 양분을 흡수하고, 물관은 위쪽으로 이동시키며, 체관은 광합성 산물을 필요한 곳으로 보내는 도식"
        >
          <div className="leaf left">엽록체</div>
          <div className="leaf right">기공</div>
          <div className="stem">
            <span className="xylem">물관 ↑</span>
            <span className="phloem">체관 ↓</span>
          </div>
          <div className="root">뿌리털</div>
          <span className="flow water-flow">물·무기 양분</span>
          <span className="flow food-flow">광합성 산물</span>
          <span className="stomata-note">공변세포가 기공을 조절</span>
          <span className="mito-note">미토콘드리아: 호흡</span>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {organFacts.map(([title, body]) => (
            <div
              key={title}
              style={{
                display: "grid",
                gridTemplateColumns: "104px 1fr",
                gap: 12,
                alignItems: "start",
                borderBottom: `1px solid ${palette.line}`,
                paddingBottom: 10,
              }}
            >
              <strong style={{ color: palette.blue }}>{title}</strong>
              <span style={{ color: palette.text, lineHeight: 1.65 }}>{body}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="key-sentence">
        물관은 아래에서 위로 물과 무기 양분을 올리고, 체관은 광합성 산물을 필요한 곳으로 나누어 보냅니다.
      </div>
      <QuizBlock
        title="탐험 확인 문제"
        questions={sectionQuestions.inside}
        answers={answers}
        onAnswer={onAnswer}
      />
    </div>
  );
}

function ExperimentSection({ conditions, setConditions, answers, onAnswer }) {
  const result = useMemo(() => getExperimentResult(conditions), [conditions]);
  const insight = useMemo(() => getExperimentInsight(result), [result]);
  const controls = [
    ["light", "빛 세기", 0, 100, "%"],
    ["co2", "이산화탄소 농도", 0, 100, "%"],
    ["temperature", "온도", 5, 40, "도"],
    ["humidity", "습도", 0, 100, "%"],
  ];

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: 22,
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: 16 }}>
          {controls.map(([key, label, min, max, unit]) => (
            <label key={key} style={{ display: "grid", gap: 8 }}>
              <span style={{ display: "flex", justifyContent: "space-between", fontWeight: 900 }}>
                {label}
                <span style={{ color: palette.muted }}>
                  {conditions[key]}
                  {unit}
                </span>
              </span>
              <input
                type="range"
                min={min}
                max={max}
                value={conditions[key]}
                onChange={(event) =>
                  setConditions((current) => ({
                    ...current,
                    [key]: Number(event.target.value),
                  }))
                }
              />
            </label>
          ))}
        </div>
        <div
          style={{
            background: "#fff",
            border: `1px solid ${palette.line}`,
            borderRadius: 8,
            padding: 20,
            display: "grid",
            gap: 20,
          }}
        >
          <ProgressBar label="광합성 속도" value={result.photosynthesis} color={palette.green} />
          <ProgressBar label="증산량" value={result.transpiration} color={palette.blue} />
          <ProgressBar label="온도 적합도" value={result.temperatureEffect} color={palette.orange} />
          <p style={{ margin: 0, color: palette.text, lineHeight: 1.7, fontWeight: 800 }}>
            {insight}
          </p>
          <p style={{ margin: 0, color: palette.muted, lineHeight: 1.7, fontSize: 14 }}>
            교육용 단순 모델입니다. 실제 식물의 반응은 식물 종류와 환경에 따라 달라질 수 있습니다.
          </p>
        </div>
      </div>
      <QuizBlock
        title="실험 확인 문제"
        questions={sectionQuestions.experiment}
        answers={answers}
        onAnswer={onAnswer}
      />
    </div>
  );
}

function MiniTest({ answers, onAnswer, onReset }) {
  const answered = miniTest.filter((question) => answers[question.id] !== undefined);
  const correct = miniTest.filter((question) => answers[question.id] === question.answer);
  const missedConcepts = miniTest
    .filter((question) => answers[question.id] !== undefined && answers[question.id] !== question.answer)
    .map((question) => question.concept);

  return (
    <section
      style={{
        background: palette.ink,
        color: "#fff",
        padding: "34px 22px 44px",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gap: 22 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(min(100%, 360px), 1fr) auto",
            gap: 18,
            alignItems: "end",
          }}
        >
          <div>
            <p style={{ margin: "0 0 8px", color: "#b9d7c5", fontWeight: 900 }}>
              시험 확인
            </p>
            <h2 style={{ margin: 0, fontSize: "clamp(28px, 5vw, 52px)", lineHeight: 1.05 }}>
              단원 미니 테스트
            </h2>
          </div>
          <div style={{ color: "#d8efe0", fontWeight: 900 }}>
            {correct.length} / {miniTest.length} 정답 · {answered.length}문항 풀이
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: 12,
          }}
        >
          {miniTest.map((question) => {
            const selected = answers[question.id];
            return (
              <div
                key={question.id}
                style={{
                  background: "#fffdf6",
                  color: palette.text,
                  borderRadius: 8,
                  padding: 16,
                  display: "grid",
                  gap: 12,
                }}
              >
                <strong style={{ color: palette.green }}>{question.concept}</strong>
                <p style={{ margin: 0, fontWeight: 900, lineHeight: 1.55 }}>{question.prompt}</p>
                <div style={{ display: "grid", gap: 8 }}>
                  {question.options.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => onAnswer(question.id, index)}
                      aria-pressed={selected === index}
                      style={{
                        border: `1px solid ${
                          selected === index
                            ? index === question.answer
                              ? palette.green
                              : palette.red
                            : palette.line
                        }`,
                        background:
                          selected === index
                            ? index === question.answer
                              ? "#e8f6df"
                              : "#fde8e5"
                            : "#fff",
                        borderRadius: 8,
                        color: palette.text,
                        padding: "10px 12px",
                        cursor: "pointer",
                        textAlign: "left",
                        fontWeight: 800,
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {selected !== undefined && (
                  <p
                    style={{
                      margin: 0,
                      lineHeight: 1.6,
                      color: selected === question.answer ? palette.green : palette.red,
                      fontWeight: 800,
                    }}
                  >
                    {question.feedback}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: 18,
          }}
        >
          <p style={{ margin: 0, color: "#d8efe0", lineHeight: 1.7 }}>
            {missedConcepts.length
              ? `다시 볼 개념: ${[...new Set(missedConcepts)].join(", ")}`
              : answered.length === miniTest.length
                ? "좋습니다. 핵심 개념 흐름이 안정적으로 연결되어 있습니다."
                : "문제를 풀면 다시 볼 개념을 알려드립니다."}
          </p>
          <button
            onClick={onReset}
            style={{
              border: "1px solid rgba(255,255,255,0.35)",
              background: "transparent",
              color: "#fff",
              borderRadius: 8,
              padding: "11px 14px",
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            다시 풀기
          </button>
        </div>
      </div>
    </section>
  );
}

function LearningStyles() {
  return (
    <style>{`
      .cycle-panel {
        min-height: 430px;
        border-radius: 8px;
        padding: 22px;
        border: 1px solid ${palette.line};
        display: grid;
        align-content: space-between;
        gap: 18px;
        overflow: hidden;
      }
      .day-panel { background: linear-gradient(180deg, #fff7cc 0%, #edf8dd 100%); }
      .night-panel { background: linear-gradient(180deg, #dbeafe 0%, #eef2ff 100%); }
      .panel-label {
        display: inline-block;
        color: ${palette.muted};
        font-weight: 900;
        margin-bottom: 8px;
      }
      .cycle-panel h3 { margin: 0 0 8px; font-size: 28px; color: ${palette.ink}; }
      .cycle-panel p { margin: 0; color: ${palette.text}; line-height: 1.7; }
      .leaf-stage {
        position: relative;
        min-height: 190px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.42);
        border: 1px solid rgba(16, 32, 24, 0.08);
      }
      .leaf-shape {
        position: absolute;
        left: 50%;
        top: 52%;
        transform: translate(-50%, -50%) rotate(-18deg);
        width: 150px;
        height: 92px;
        border-radius: 90px 12px 90px 12px;
        background: ${palette.green};
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
      }
      .mitochondria {
        position: absolute;
        left: 50%;
        top: 52%;
        transform: translate(-50%, -50%);
        width: 170px;
        height: 86px;
        border-radius: 50%;
        background: ${palette.orange};
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
      }
      .particle {
        position: absolute;
        z-index: 2;
        border-radius: 999px;
        padding: 8px 10px;
        font-size: 12px;
        font-weight: 900;
        animation: drift 3.4s ease-in-out infinite alternate;
      }
      .co2 { background: ${palette.blueSoft}; color: ${palette.blue}; }
      .water { background: #e2f4ff; color: ${palette.blue}; animation-delay: 0.5s; }
      .oxygen { background: #f3fce6; color: ${palette.green}; animation-delay: 0.9s; }
      .sugar { background: ${palette.greenSoft}; color: ${palette.green}; }
      .energy { background: ${palette.orangeSoft}; color: ${palette.orange}; animation-delay: 0.8s; }
      .p1 { left: 10%; top: 28%; }
      .p2 { left: 23%; bottom: 18%; }
      .p3 { right: 12%; top: 38%; }
      .sunbeam {
        position: absolute;
        left: 22%;
        top: 0;
        width: 18px;
        height: 170px;
        background: rgba(244, 196, 48, 0.38);
        transform: rotate(26deg);
        animation: beam 2.4s ease-in-out infinite alternate;
      }
      .plant-diagram {
        position: relative;
        min-height: 520px;
        background: linear-gradient(180deg, #ecf8db 0 52%, #ead8bc 52% 100%);
        border: 1px solid ${palette.line};
        border-radius: 8px;
        overflow: hidden;
      }
      .leaf {
        position: absolute;
        top: 70px;
        width: 130px;
        height: 78px;
        border-radius: 80px 14px 80px 14px;
        background: ${palette.green};
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
      }
      .leaf.left { left: calc(50% - 130px); transform: rotate(-24deg); }
      .leaf.right { left: calc(50% + 8px); transform: rotate(24deg); }
      .stem {
        position: absolute;
        left: calc(50% - 34px);
        top: 145px;
        width: 68px;
        height: 230px;
        background: #7c9a4a;
        border-radius: 26px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        overflow: hidden;
        color: #fff;
        font-size: 12px;
        font-weight: 900;
      }
      .xylem, .phloem {
        display: flex;
        align-items: center;
        justify-content: center;
        writing-mode: vertical-rl;
      }
      .xylem { background: ${palette.blue}; }
      .phloem { background: ${palette.orange}; }
      .root {
        position: absolute;
        left: calc(50% - 90px);
        bottom: 44px;
        width: 180px;
        height: 95px;
        color: ${palette.ink};
        font-weight: 900;
        display: flex;
        justify-content: center;
        align-items: flex-end;
      }
      .root::before {
        content: "";
        position: absolute;
        inset: 0;
        border-bottom: 10px solid #8b5e34;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        clip-path: polygon(48% 0, 56% 0, 72% 100%, 58% 100%, 50% 35%, 42% 100%, 28% 100%);
      }
      .flow {
        position: absolute;
        padding: 7px 10px;
        border-radius: 999px;
        background: #fff;
        border: 1px solid ${palette.line};
        font-size: 12px;
        font-weight: 900;
      }
      .water-flow { left: 18px; top: 300px; color: ${palette.blue}; animation: rise 2.8s ease-in-out infinite alternate; }
      .food-flow { right: 18px; top: 190px; color: ${palette.orange}; animation: fall 2.8s ease-in-out infinite alternate; }
      .stomata-note { position: absolute; right: 18px; top: 22px; color: ${palette.green}; font-weight: 900; font-size: 13px; }
      .mito-note { position: absolute; left: 18px; top: 22px; color: ${palette.orange}; font-weight: 900; font-size: 13px; }
      .key-sentence {
        background: ${palette.surface};
        border-left: 6px solid ${palette.green};
        padding: 16px 18px;
        color: ${palette.text};
        font-weight: 900;
        line-height: 1.7;
      }
      input[type="range"] {
        width: 100%;
        accent-color: ${palette.green};
      }
      @keyframes drift {
        from { transform: translate(0, 0); }
        to { transform: translate(18px, -14px); }
      }
      @keyframes beam {
        from { opacity: 0.45; transform: rotate(26deg) translateY(-8px); }
        to { opacity: 0.9; transform: rotate(26deg) translateY(8px); }
      }
      @keyframes rise {
        from { transform: translateY(28px); }
        to { transform: translateY(-28px); }
      }
      @keyframes fall {
        from { transform: translateY(-18px); }
        to { transform: translateY(24px); }
      }
      @media (max-width: 720px) {
        .cycle-panel { min-height: 380px; }
        .plant-diagram { min-height: 450px; }
      }
    `}</style>
  );
}

export default function PlantEnergyLearning() {
  const [activeSection, setActiveSection] = useState("story");
  const [answers, setAnswers] = useState({});
  const [miniAnswers, setMiniAnswers] = useState({});
  const [conditions, setConditions] = useState({
    light: 70,
    co2: 65,
    temperature: 25,
    humidity: 45,
  });

  const active = courseSections.find((section) => section.id === activeSection) ?? courseSections[0];

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers((current) => ({ ...current, [questionId]: optionIndex }));
  };

  const handleMiniAnswer = (questionId, optionIndex) => {
    setMiniAnswers((current) => ({ ...current, [questionId]: optionIndex }));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: palette.bg,
        color: palette.text,
        fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
      }}
    >
      <LearningStyles />
      <header style={{ borderBottom: `1px solid ${palette.line}`, background: palette.surface }}>
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "22px",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" style={{ color: palette.muted, fontWeight: 900, textDecoration: "none" }}>
            메뉴로
          </Link>
          <strong style={{ color: palette.green }}>중학교 2학년 과학</strong>
        </div>
      </header>

      <main>
        <section style={{ maxWidth: 1160, margin: "0 auto", padding: "42px 22px 28px" }}>
          <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
              gap: 32,
              alignItems: "end",
            }}
          >
            <div>
              <p style={{ margin: "0 0 12px", color: palette.green, fontWeight: 900 }}>
                12단원 식물과 에너지
              </p>
              <h1
                style={{
                  margin: 0,
                  color: palette.ink,
                  fontSize: "clamp(38px, 7vw, 78px)",
                  lineHeight: 0.98,
                  letterSpacing: 0,
                }}
              >
                외우기 전에 흐름을 봅니다
              </h1>
            </div>
            <p style={{ margin: 0, color: palette.muted, fontSize: 18, lineHeight: 1.8 }}>
              낮과 밤의 기체 변화, 식물 내부의 이동 통로, 조건 변화 실험을 차례로 보고
              마지막 미니 테스트로 시험 포인트를 확인합니다.
            </p>
          </div>
        </section>

        <section
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "0 22px 42px",
            display: "grid",
            gap: 18,
          }}
        >
          <nav
            aria-label="학습 단계"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: 10,
            }}
          >
            {courseSections.map((section) => (
              <SectionButton
                key={section.id}
                section={section}
                active={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              />
            ))}
          </nav>

          <section
            style={{
              background: palette.surface,
              border: `1px solid ${palette.line}`,
              borderRadius: 8,
              padding: "24px",
              display: "grid",
              gap: 22,
            }}
          >
            <div>
              <p style={{ margin: "0 0 8px", color: active.accent, fontWeight: 900 }}>
                STEP {active.step}
              </p>
              <h2 style={{ margin: "0 0 8px", fontSize: "clamp(28px, 4vw, 44px)", color: palette.ink }}>
                {active.label}
              </h2>
              <p style={{ margin: 0, color: palette.muted, lineHeight: 1.7 }}>{active.takeaway}</p>
            </div>

            {activeSection === "story" && <StorySection answers={answers} onAnswer={handleAnswer} />}
            {activeSection === "inside" && <InsideSection answers={answers} onAnswer={handleAnswer} />}
            {activeSection === "experiment" && (
              <ExperimentSection
                conditions={conditions}
                setConditions={setConditions}
                answers={answers}
                onAnswer={handleAnswer}
              />
            )}
          </section>
        </section>

        <MiniTest
          answers={miniAnswers}
          onAnswer={handleMiniAnswer}
          onReset={() => setMiniAnswers({})}
        />
      </main>
    </div>
  );
}
