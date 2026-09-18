import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Sparkles } from "lucide-react-native";
import { colors } from "../theme/colors";

export default function SectionReviewPromptScreen({ section, onStart, onSkip }) {
  return (
    <View style={styles.container}>
      <Sparkles size={28} color={colors.gold} style={{ marginBottom: 16 }} />
      <Text style={styles.label}>{section} 완주</Text>
      <Text style={styles.title}>한 대단원을 다 걸으셨어요</Text>
      <Text style={styles.desc}>5문항짜리 짧은 정리 퀴즈로 {section}을 복습해볼까요?</Text>
      <TouchableOpacity onPress={onStart} style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>정리 퀴즈 풀기</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSkip}>
        <Text style={styles.skipText}>나중에 할게요</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.parchment,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  label: { color: colors.gold, fontSize: 12, marginBottom: 8 },
  title: { color: colors.inkText, fontSize: 20, fontFamily: "serif", marginBottom: 12, textAlign: "center" },
  desc: { color: colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 32, textAlign: "center" },
  primaryBtn: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    backgroundColor: colors.ink,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryBtnText: { color: colors.parchment, fontSize: 14, fontWeight: "500" },
  skipText: { color: colors.muted, fontSize: 14 },
});
