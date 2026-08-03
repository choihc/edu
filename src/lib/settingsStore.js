/**
 * 화면 표시 설정의 저장·복원. 스펙 JN4-033(기본값), JN4-035(설정 유지).
 *
 * 학습 진도(progressStore)와 키를 나눠 둔다. 설정은 진도와 성격이 다르고,
 * 진도 저장 형식이 바뀌어도 설정이 함께 날아가지 않게 하기 위해서다.
 */

export const FURIGANA_KEY = "jlpt-n4-furigana";

const ON = "on";
const OFF = "off";

/**
 * @param {Storage | null} storage
 * @returns {boolean} 저장된 값이 없거나 읽을 수 없으면 꺼짐
 */
export function loadFurigana(storage) {
  if (!storage) return false;
  try {
    return storage.getItem(FURIGANA_KEY) === ON;
  } catch {
    return false;
  }
}

/**
 * @param {Storage | null} storage
 * @param {boolean} enabled
 */
export function saveFurigana(storage, enabled) {
  if (!storage) return;
  try {
    storage.setItem(FURIGANA_KEY, enabled ? ON : OFF);
  } catch {
    // 저장하지 못해도 이번 세션의 표시 설정은 그대로 쓸 수 있다.
  }
}
