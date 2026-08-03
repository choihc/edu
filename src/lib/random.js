/**
 * 무작위를 쓰는 공용 도구. rand는 항상 인자로 주입받아 테스트에서 재현할 수 있게 한다.
 */

/**
 * rand를 쓰는 Fisher-Yates 섞기. 원본은 건드리지 않는다.
 * @template T
 * @param {T[]} list
 * @param {() => number} rand
 * @returns {T[]}
 */
export function shuffle(list, rand) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
