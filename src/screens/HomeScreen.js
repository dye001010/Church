import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { RotateCcw, BookHeart, Bell } from "lucide-react-native";
import JourneyArc from "../components/JourneyArc";
import { PARTS, TOTAL_PARTS, SECTION_ORDER } from "../data/curriculum";
import { colors } from "../theme/colors";

export default function HomeScreen({
  completed,
  onStart,
  onReset,
  onOpenJournal,
  onOpenSettings,
  reminder,
}) {
  const progress = completed.length / TOTAL_PARTS;
  const remaining = PARTS.filter((p) => !completed.includes(p.id));
  const today = remaining.slice(0, 2);
  const done = remaining.length === 0;
  const currentSectionIdx = today[0]
    ? SECTION_ORDER.indexOf(today[0].sec)
    : SECTION_ORDER.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>좋은 아침입니다</Text>
        <Text style={styles.heroTitle}>
          {done ? "여정을 완주했어요" : `${completed.length}파트를 걸어왔어요`}
        </Text>
        <JourneyArc progress={progress} />
        <Text style={styles.heroSub}>
          {completed.length} / {TOTAL_PARTS}파트 · 조직신학 로드맵
        </Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.sectionHeading}>{done ? "다시 걷고 싶다면" : "오늘의 학습"}</Text>

        {done ? (
          <Text style={styles.doneText}>
            96파트를 모두 마쳤습니다. 처음부터 다시 걷거나, 인상 깊었던 파트를 복습해보세요.
          </Text>
        ) : (
          today.map((part, idx) => (
            <TouchableOpacity
              key={part.id}
              onPress={() => onStart(part)}
              style={idx === 0 ? styles.primaryCard : styles.secondaryCard}
            >
              <Text style={idx === 0 ? styles.primaryLabel : styles.secondaryLabel}>
                {part.sec} · {part.ch}
              </Text>
              <Text style={idx === 0 ? styles.primaryTitle : styles.secondaryTitle}>
                파트 {part.id}
                {idx !== 0 ? " · 선택" : ""}
              </Text>
              {idx === 0 && <Text style={styles.primaryMeta}>약 6분 · 시작하기</Text>}
            </TouchableOpacity>
          ))
        )}

        <View style={styles.sectionProgress}>
          <Text style={styles.sectionProgressLabel}>대단원 진행</Text>
          <Text style={styles.sectionProgressText}>
            {SECTION_ORDER.map((s, i) => (
              <Text key={s} style={i === currentSectionIdx ? styles.sectionCurrent : undefined}>
                {s}
                {i < SECTION_ORDER.length - 1 ? " · " : ""}
              </Text>
            ))}
          </Text>
        </View>

        <View style={styles.linkGroup}>
          <TouchableOpacity onPress={onOpenJournal} style={styles.linkRow}>
            <BookHeart size={15} color={colors.bodyText} />
            <Text style={styles.linkText}>나의 여정 노트</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onOpenSettings} style={styles.linkRow}>
            <Bell size={15} color={colors.bodyText} />
            <Text style={styles.linkText}>아침 알림 설정</Text>
            <Text style={styles.linkMeta}>{reminder?.enabled ? `· ${reminder.time}` : "· 꺼짐"}</Text>
          </TouchableOpacity>
        </View>

        {completed.length > 0 && (
          <TouchableOpacity onPress={onReset} style={styles.resetRow}>
            <RotateCcw size={12} color={colors.muted} />
            <Text style={styles.resetText}>진도 초기화</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.parchment },
  hero: { backgroundColor: colors.ink, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 },
  heroLabel: { color: colors.goldLight, fontSize: 13 },
  heroTitle: { color: colors.parchment, fontSize: 22, fontFamily: "serif", marginTop: 4 },
  heroSub: { color: colors.starDim, fontSize: 11, paddingBottom: 16 },
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },
  sectionHeading: { color: colors.inkText, fontSize: 15, fontWeight: "500", marginBottom: 12 },
  doneText: { color: colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 16 },
  primaryCard: {
    backgroundColor: colors.ink,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 12,
  },
  primaryLabel: { color: colors.goldLight, fontSize: 12 },
  primaryTitle: { color: colors.parchment, fontSize: 18, fontFamily: "serif", marginTop: 4 },
  primaryMeta: { color: colors.starDim, fontSize: 13, marginTop: 12 },
  secondaryCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
  },
  secondaryLabel: { color: colors.muted, fontSize: 12 },
  secondaryTitle: { color: colors.bodyText, fontSize: 15, marginTop: 4 },
  sectionProgress: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 20,
  },
  sectionProgressLabel: { color: colors.muted, fontSize: 12, marginBottom: 4 },
  sectionProgressText: { color: colors.bodyText, fontSize: 13, lineHeight: 26 },
  sectionCurrent: { color: colors.inkText, fontWeight: "600" },
  linkGroup: { marginTop: 32 },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  linkText: { color: colors.bodyText, fontSize: 14 },
  linkMeta: { color: colors.muted, fontSize: 12 },
  resetRow: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 6 },
  resetText: { color: colors.muted, fontSize: 12 },
});
