import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { PARTS, SECTION_REVIEW_IDS } from "../data/curriculum";
import { colors } from "../theme/colors";

export default function SectionReviewQuizScreen({ section, onFinish }) {
  const ids = SECTION_REVIEW_IDS[section] || [];
  const questions = ids.map((id) => PARTS.find((p) => p.id === id)).filter(Boolean);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  if (questions.length === 0) {
    return (
      <View style={styles.center}>
        <TouchableOpacity onPress={() => onFinish(section)}>
          <Text style={{ color: colors.ink }}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = questions[qIndex];
  const isLastQ = qIndex === questions.length - 1;

  function pick(i) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.ans) setCorrectCount((c) => c + 1);
  }

  function next() {
    if (isLastQ) {
      setDone(true);
      return;
    }
    setQIndex((i) => i + 1);
    setSelected(null);
  }

  if (done) {
    return (
      <View style={styles.center}>
        <Text style={styles.doneLabel}>{section} 정리 퀴즈</Text>
        <Text style={styles.doneTitle}>
          {questions.length}문항 중 {correctCount}개 정답
        </Text>
        <Text style={styles.doneDesc}>수고하셨어요. 다음 대단원도 함께 걸어요.</Text>
        <TouchableOpacity onPress={() => onFinish(section)} style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>완료</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {questions.map((_, i) => (
          <View key={i} style={[styles.dot, i <= qIndex && styles.dotActive]} />
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.label}>
          {section} 정리 퀴즈 · {qIndex + 1}/{questions.length}
        </Text>
        <Text style={styles.question}>{q.q}</Text>
        <View style={styles.optionList}>
          {q.opts.map((text, i) => {
            const isSel = selected === i;
            const isCorrect = i === q.ans;
            const showResult = selected !== null;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => pick(i)}
                disabled={selected !== null}
                style={[
                  styles.option,
                  showResult && isCorrect && styles.optionCorrect,
                  showResult && isSel && !isCorrect && styles.optionWrong,
                ]}
              >
                {showResult && isCorrect && <Check size={16} color={colors.ink} style={{ marginTop: 2 }} />}
                <Text style={styles.optionText}>{text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {selected !== null && <Text style={styles.explain}>{q.exp}</Text>}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={next}
          disabled={selected === null}
          style={[styles.nextBtn, selected === null && styles.nextBtnDisabled]}
        >
          <Text style={[styles.nextBtnText, selected === null && styles.nextBtnTextDisabled]}>
            {isLastQ ? "결과 보기" : "다음 문항"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.parchment },
  header: { flexDirection: "row", gap: 6, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  dot: { height: 6, flex: 1, borderRadius: 3, backgroundColor: colors.borderMuted },
  dotActive: { backgroundColor: colors.ink },
  body: { paddingHorizontal: 24, paddingBottom: 16 },
  label: { color: colors.gold, fontSize: 12, marginBottom: 8 },
  question: { color: colors.inkText, fontSize: 17, fontWeight: "500", marginBottom: 20, lineHeight: 26 },
  optionList: { gap: 10 },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  optionCorrect: { borderColor: colors.ink, backgroundColor: "rgba(28,37,65,0.05)" },
  optionWrong: { borderColor: colors.danger, backgroundColor: "rgba(176,85,74,0.05)" },
  optionText: { color: colors.bodyText, fontSize: 14, lineHeight: 22, flexShrink: 1 },
  explain: { color: colors.muted, fontSize: 13, marginTop: 16, lineHeight: 22 },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 },
  nextBtn: { borderRadius: 16, paddingVertical: 14, backgroundColor: colors.ink, alignItems: "center" },
  nextBtnDisabled: { backgroundColor: colors.borderMuted },
  nextBtnText: { color: colors.parchment, fontSize: 14, fontWeight: "500" },
  nextBtnTextDisabled: { color: colors.muted },
  center: {
    flex: 1,
    backgroundColor: colors.parchment,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  doneLabel: { color: colors.gold, fontSize: 12, marginBottom: 8 },
  doneTitle: { color: colors.inkText, fontSize: 22, fontFamily: "serif", marginBottom: 12, textAlign: "center" },
  doneDesc: { color: colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 32, textAlign: "center" },
  primaryBtn: { width: "100%", borderRadius: 16, paddingVertical: 14, backgroundColor: colors.ink, alignItems: "center" },
  primaryBtnText: { color: colors.parchment, fontSize: 14, fontWeight: "500" },
});
