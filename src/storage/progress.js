import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "reformed_theology_progress";

const DEFAULT_PROGRESS = {
  completed: [],
  reflections: {},
  sectionReviewsDone: [],
  reminder: { enabled: false, time: "07:30" },
};

export async function loadProgress() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        completed: parsed.completed || [],
        reflections: parsed.reflections || {},
        sectionReviewsDone: parsed.sectionReviewsDone || [],
        reminder: parsed.reminder || DEFAULT_PROGRESS.reminder,
      };
    }
  } catch (e) {
    // 저장된 값이 없거나 읽기 오류 — 초기 상태로 시작
  }
  return { ...DEFAULT_PROGRESS };
}

export async function saveProgress(progress) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    // 저장 실패 시에도 앱은 계속 동작 (이번 세션 안에서는 진행 가능)
  }
}

export async function clearProgress() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // 무시
  }
}
