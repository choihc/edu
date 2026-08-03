/**
 * 복습 진도의 브라우저 저장·복원. 스펙 JN4-013~JN4-015, JN4-U10.
 *
 * 저장 형태:
 *   { "version": 1, "cards": { "<학습 항목 id>": { "stage": 1, "dueAt": 1700000000000 } } }
 *
 * 저장값은 사용자가 언제든 지우거나 망가뜨릴 수 있으므로, 읽기는 어떤 경우에도
 * 예외를 밖으로 던지지 않고 빈 진도를 돌려준다 (JN4-015).
 */

/** @typedef {import("./srs.js").CardState} CardState */

export const STORAGE_KEY = "jlpt-n4-progress";
export const SCHEMA_VERSION = 1;

/** 저장된 카드 하나가 쓸 수 있는 형태인지 확인한다. */
function isValidCard(card) {
  if (!card || typeof card !== "object") return false;
  if (!Number.isFinite(card.stage)) return false;
  return card.dueAt === null || Number.isFinite(card.dueAt);
}

/**
 * @param {Storage | null} storage
 * @returns {Record<string, CardState>} 읽을 수 없으면 빈 객체
 */
export function loadProgress(storage) {
  if (!storage) return {};

  let raw;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return {};
  }
  if (!raw) return {};

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }

  if (!parsed || parsed.version !== SCHEMA_VERSION) return {};
  const { cards } = parsed;
  if (!cards || typeof cards !== "object" || Array.isArray(cards)) return {};

  /** @type {Record<string, CardState>} */
  const result = {};
  for (const [id, card] of Object.entries(cards)) {
    if (isValidCard(card)) result[id] = { stage: card.stage, dueAt: card.dueAt };
  }
  return result;
}

/**
 * 저장 실패(용량 초과·사생활 보호 모드 등)는 학습을 막을 이유가 아니므로 조용히 넘어간다.
 * @param {Storage | null} storage
 * @param {Record<string, CardState>} progress
 */
export function saveProgress(storage, progress) {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, cards: progress }));
  } catch {
    // 저장하지 못해도 이번 세션 학습은 계속할 수 있다.
  }
}
