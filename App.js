import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View, Text, Platform } from "react-native";

import HomeScreen from "./src/screens/HomeScreen";
import PartScreen from "./src/screens/PartScreen";
import JournalScreen from "./src/screens/JournalScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import SectionReviewPromptScreen from "./src/screens/SectionReviewPromptScreen";
import SectionReviewQuizScreen from "./src/screens/SectionReviewQuizScreen";

import { loadProgress, saveProgress, clearProgress } from "./src/storage/progress";
import { PARTS, SECTION_LAST_ID } from "./src/data/curriculum";
import { colors } from "./src/theme/colors";

// Expo Go(SDK 53 이상) 환경 충돌 방지를 위해 알림 등록 로직을 비워둡니다.
async function scheduleReminderNotification(reminder) {
  // 실제 빌드(APK/EAS Build) 환경 구축 시 복구 가능
  return;
}

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [completed, setCompleted] = useState([]);
  const [reflections, setReflections] = useState({});
  const [sectionReviewsDone, setSectionReviewsDone] = useState([]);
  const [reminder, setReminder] = useState({ enabled: false, time: "07:30" });
  const [activePart, setActivePart] = useState(null);
  const [pendingSection, setPendingSection] = useState(null);

  useEffect(() => {
    loadProgress().then((p) => {
      setCompleted(p.completed);
      setReflections(p.reflections);
      setSectionReviewsDone(p.sectionReviewsDone);
      setReminder(p.reminder);
      setScreen("home");
    });
  }, []);

  function handleComplete(partId, reflectionText) {
    const part = PARTS.find((p) => p.id === partId);
    const newCompleted = completed.includes(partId) ? completed : [...completed, partId];
    const newReflections = reflectionText
      ? { ...reflections, [partId]: { text: reflectionText, date: new Date().toISOString() } }
      : reflections;

    setCompleted(newCompleted);
    setReflections(newReflections);
    saveProgress({
      completed: newCompleted,
      reflections: newReflections,
      sectionReviewsDone,
      reminder,
    });

    const isSectionFinish =
      part && SECTION_LAST_ID[part.sec] === partId && !sectionReviewsDone.includes(part.sec);

    if (isSectionFinish) {
      setPendingSection(part.sec);
      setScreen("reviewPrompt");
    } else {
      setScreen("home");
    }
  }

  function finishSectionReview(section) {
    const newDone = sectionReviewsDone.includes(section)
      ? sectionReviewsDone
      : [...sectionReviewsDone, section];
    setSectionReviewsDone(newDone);
    saveProgress({ completed, reflections, sectionReviewsDone: newDone, reminder });
    setPendingSection(null);
    setScreen("home");
  }

  async function handleReset() {
    await clearProgress();
    setCompleted([]);
    setReflections({});
    setSectionReviewsDone([]);
    setScreen("home");
  }

  async function saveReminder(next) {
    setReminder(next);
    saveProgress({ completed, reflections, sectionReviewsDone, reminder: next });
    await scheduleReminderNotification(next);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.ink} />
      {screen === "loading" && (
        <View style={styles.loading}>
          <Text style={{ color: colors.muted }}>불러오는 중…</Text>
        </View>
      )}
      {screen === "home" && (
        <HomeScreen
          completed={completed}
          reminder={reminder}
          onStart={(part) => {
            setActivePart(part);
            setScreen("part");
          }}
          onReset={handleReset}
          onOpenJournal={() => setScreen("journal")}
          onOpenSettings={() => setScreen("settings")}
        />
      )}
      {screen === "part" && activePart && (
        <PartScreen part={activePart} onExit={() => setScreen("home")} onComplete={handleComplete} />
      )}
      {screen === "journal" && (
        <JournalScreen reflections={reflections} onExit={() => setScreen("home")} />
      )}
      {screen === "settings" && (
        <SettingsScreen reminder={reminder} onExit={() => setScreen("home")} onSave={saveReminder} />
      )}
      {screen === "reviewPrompt" && pendingSection && (
        <SectionReviewPromptScreen
          section={pendingSection}
          onStart={() => setScreen("reviewQuiz")}
          onSkip={() => finishSectionReview(pendingSection)}
        />
      )}
      {screen === "reviewQuiz" && pendingSection && (
        <SectionReviewQuizScreen section={pendingSection} onFinish={finishSectionReview} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.parchment,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
});