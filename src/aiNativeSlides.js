// src/aiNativeSlides.js
// 본 모듈은 AI Native 발표 슬라이드(/ai-native)의 데이터 단일 출처.
// spec: docs/superpowers/specs/2026-05-19-ai-native-presentation-design.md

export const MODELS = {
  SONNET: "4.6",        // 출시 2026.02
  OPUS: "4.7",          // 출시 2026.04
};

export const PRESENTATION_META = {
  TOTAL_SLIDES: 26,
  TARGET_MINUTES: 25,
  TITLE: "AI Native: 도구의 교체가 아니라 운영체계의 교체",
};

// SourceRef: 인용 출처 표기 — 정량 슬라이드 필수 필드
// { label, url?, year?, disclaimer? }

// 슬라이드 데이터는 Chunk 3에서 ACT 순서대로 채운다.
// 본 스캐폴딩은 빈 슬라이드 1장으로 라우트 동작 검증용.
export const slides = [
  {
    kind: "hero",
    variant: "title",
    eyebrow: "사내 발표",
    title: PRESENTATION_META.TITLE,
    subtitle: "(스캐폴딩 — Chunk 3에서 채움)",
  },
];

// 출처 표기 dev-only 검증 — spec §7.4 룰
// 정량 슬라이드(stats-grid / compare-rows / 정량 list-rows variant)는 source 필수.
if (import.meta.env && import.meta.env.DEV) {
  const REQUIRE_SOURCE_KINDS = new Set(["stats-grid", "compare-rows"]);
  const REQUIRE_SOURCE_LIST_VARIANTS = new Set([
    "counterevidence",
    "cycle-step",
    "persona-quant",
    "eval-metric",
  ]);
  const missing = [];
  slides.forEach((s, i) => {
    const needs =
      REQUIRE_SOURCE_KINDS.has(s.kind) ||
      (s.kind === "list-rows" && REQUIRE_SOURCE_LIST_VARIANTS.has(s.variant));
    if (needs && !s.source) {
      missing.push(`#${i + 1} ${s.kind}${s.variant ? "/" + s.variant : ""}`);
    }
  });
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(`[aiNativeSlides] source 누락: ${missing.join(", ")}`);
  }
}
