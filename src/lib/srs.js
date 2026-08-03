/**
 * 간격 반복(spaced repetition) 규칙. 스펙 JN4-009~JN4-012, JN4-024, JN4-028.
 *
 * 현재 시각은 인자로 주입받는다. 이 모듈 안에서 Date.now를 직접 부르지 않기 때문에
 * 시각에 따라 결과가 흔들리지 않고 테스트할 수 있다.
 *
 * @typedef {{ stage: number, dueAt: number | null }} CardState
 *   stage  간격 단계. 0이면 아직 자리를 잡지 못한 상태다.
 *   dueAt  다음 복습 시각(epoch ms). null이면 한 번도 학습하지 않은 항목이다.
 */

export const MINUTE = 60_000;
export const DAY = 24 * 60 * MINUTE;

/** 단계별 간격. 인덱스가 곧 간격 단계다. */
export const STAGE_INTERVALS = [10 * MINUTE, 1 * DAY, 3 * DAY, 7 * DAY, 30 * DAY];

/** @returns {CardState} */
export function initialCard() {
  return { stage: 0, dueAt: null };
}

/**
 * 마지막 단계를 넘어서면 마지막 간격(30일)을 그대로 유지한다.
 * @param {number} stage
 * @returns {number}
 */
export function intervalFor(stage) {
  const index = Math.min(Math.max(stage, 0), STAGE_INTERVALS.length - 1);
  return STAGE_INTERVALS[index];
}

/**
 * 한 번의 학습 결과를 반영한 새 카드 상태를 만든다. 원본은 건드리지 않는다.
 * @param {CardState} card
 * @param {boolean} isCorrect
 * @param {number} now
 * @returns {CardState}
 */
export function review(card, isCorrect, now) {
  if (!isCorrect) {
    return { stage: 0, dueAt: now + intervalFor(0) };
  }
  const stage = card.stage + 1;
  return { stage, dueAt: now + intervalFor(stage) };
}

/**
 * 다음에 물어볼 항목을 고른다.
 * 복습 시각이 지난 항목을 먼저 쓰되, 가장 오래 밀린 것부터 처리한다.
 * 그런 항목이 없으면 아직 학습하지 않은 항목을 목록 순서대로 준다.
 *
 * @param {string[]} allIds
 * @param {Record<string, CardState>} progress
 * @param {number} now
 * @returns {string | null}
 */
export function pickNextId(allIds, progress, now) {
  let dueId = null;
  let dueAt = Infinity;

  for (const id of allIds) {
    const card = progress[id];
    if (!card || card.dueAt === null) continue;
    if (card.dueAt <= now && card.dueAt < dueAt) {
      dueId = id;
      dueAt = card.dueAt;
    }
  }
  if (dueId !== null) return dueId;

  for (const id of allIds) {
    const card = progress[id];
    if (!card || card.dueAt === null) return id;
  }
  return null;
}

/**
 * 예약된 복습 중 가장 이른 시각. 예약이 하나도 없으면 null.
 * @param {string[]} allIds
 * @param {Record<string, CardState>} progress
 * @returns {number | null}
 */
export function nextDueAt(allIds, progress) {
  let earliest = null;
  for (const id of allIds) {
    const card = progress[id];
    if (!card || card.dueAt === null) continue;
    if (earliest === null || card.dueAt < earliest) earliest = card.dueAt;
  }
  return earliest;
}

/**
 * 간격 단계 1 이상인 항목의 수. 진도 표시에 쓴다.
 * @param {string[]} allIds
 * @param {Record<string, CardState>} progress
 * @returns {number}
 */
export function learnedCount(allIds, progress) {
  return allIds.filter((id) => (progress[id]?.stage ?? 0) >= 1).length;
}
