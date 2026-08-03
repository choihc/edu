import { describe, it, expect } from "vitest";
import {
  DAY,
  MINUTE,
  STAGE_INTERVALS,
  initialCard,
  intervalFor,
  learnedCount,
  nextDueAt,
  pickNextId,
  review,
} from "./srs.js";

const NOW = 1_700_000_000_000;

describe("간격 반복 (JN4-009~JN4-012, AC-5)", () => {
  it("미학습 항목은 단계 0에 복습 시각이 없다 (JN4-009)", () => {
    expect(initialCard()).toEqual({ stage: 0, dueAt: null });
  });

  it("단계별 간격이 10분 → 1일 → 3일 → 7일 → 30일이다", () => {
    expect(STAGE_INTERVALS).toEqual([10 * MINUTE, 1 * DAY, 3 * DAY, 7 * DAY, 30 * DAY]);
  });

  it("최고 단계를 넘는 단계에는 마지막 간격을 쓴다", () => {
    expect(intervalFor(4)).toBe(30 * DAY);
    expect(intervalFor(9)).toBe(30 * DAY);
  });

  it("정답이면 단계가 1 오르고 새 단계 간격만큼 뒤로 예약한다 (JN4-010)", () => {
    expect(review(initialCard(), true, NOW)).toEqual({ stage: 1, dueAt: NOW + 1 * DAY });
    expect(review({ stage: 1, dueAt: NOW }, true, NOW)).toEqual({ stage: 2, dueAt: NOW + 3 * DAY });
    expect(review({ stage: 2, dueAt: NOW }, true, NOW)).toEqual({ stage: 3, dueAt: NOW + 7 * DAY });
    expect(review({ stage: 3, dueAt: NOW }, true, NOW)).toEqual({ stage: 4, dueAt: NOW + 30 * DAY });
  });

  it("최고 단계를 넘어서도 30일 간격을 유지한다 (JN4-010)", () => {
    expect(review({ stage: 7, dueAt: NOW }, true, NOW)).toEqual({ stage: 8, dueAt: NOW + 30 * DAY });
  });

  it("오답이면 단계가 0으로 돌아가고 10분 뒤로 예약한다 (JN4-011)", () => {
    expect(review({ stage: 4, dueAt: NOW }, false, NOW)).toEqual({ stage: 0, dueAt: NOW + 10 * MINUTE });
    expect(review(initialCard(), false, NOW)).toEqual({ stage: 0, dueAt: NOW + 10 * MINUTE });
  });

  it("review는 원본 카드를 바꾸지 않는다", () => {
    const card = { stage: 1, dueAt: NOW };
    review(card, true, NOW);
    expect(card).toEqual({ stage: 1, dueAt: NOW });
  });

  it("복습 시각이 지난 항목을 미학습 항목보다 먼저 고른다 (JN4-012)", () => {
    const progress = { b: { stage: 1, dueAt: NOW - 1 } };
    expect(pickNextId(["a", "b", "c"], progress, NOW)).toBe("b");
  });

  it("복습 시각이 여러 개 지났으면 가장 오래 밀린 항목을 먼저 고른다 (JN4-012)", () => {
    const progress = {
      a: { stage: 1, dueAt: NOW - 100 },
      b: { stage: 1, dueAt: NOW - 5_000 },
      c: { stage: 1, dueAt: NOW - 1_000 },
    };
    expect(pickNextId(["a", "b", "c"], progress, NOW)).toBe("b");
  });

  it("복습 대상이 없으면 미학습 항목을 목록 순서대로 고른다 (JN4-012)", () => {
    const progress = { a: { stage: 1, dueAt: NOW + DAY } };
    expect(pickNextId(["a", "b", "c"], progress, NOW)).toBe("b");
  });

  it("복습 대상도 미학습 항목도 없으면 null을 준다 (JN4-024)", () => {
    const progress = { a: { stage: 1, dueAt: NOW + DAY } };
    expect(pickNextId(["a"], progress, NOW)).toBeNull();
  });

  it("복습 시각이 정확히 현재와 같으면 복습 대상으로 본다", () => {
    const progress = { a: { stage: 1, dueAt: NOW } };
    expect(pickNextId(["a"], progress, NOW)).toBe("a");
  });

  it("가장 이른 다음 복습 시각을 알려 준다 (JN4-024)", () => {
    const progress = {
      a: { stage: 1, dueAt: NOW + 5 * DAY },
      b: { stage: 2, dueAt: NOW + 2 * DAY },
    };
    expect(nextDueAt(["a", "b"], progress)).toBe(NOW + 2 * DAY);
    expect(nextDueAt(["c"], {})).toBeNull();
  });

  it("단계 1 이상인 항목만 학습한 것으로 센다 (JN4-028)", () => {
    const progress = {
      a: { stage: 1, dueAt: NOW },
      b: { stage: 0, dueAt: NOW },
      d: { stage: 3, dueAt: NOW },
    };
    expect(learnedCount(["a", "b", "c"], progress)).toBe(1);
    expect(learnedCount(["a", "b", "c", "d"], progress)).toBe(2);
  });
});
