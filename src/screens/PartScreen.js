import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from "react-native";
import { ArrowLeft, Check } from "lucide-react-native";
import { colors } from "../theme/colors";

function buildSteps(part) {
  return [
    { kind: "text", label: "핵심 본문", title: part.title, body: part.core },
    { kind: "text", label: "개념 설명", title: "이해하기", body: part.concept },
    { kind: "text", label: "성경 근거", title: part.ref, body: part.note },
    {
      kind: "quiz",
      label: "이해 체크",
      title: part.q,
      options: part.opts.map((text, i) => ({ id: String(i), text })),
      answer: String(part.ans),
      explain: part.exp,
    },
    { kind: "reflect", label: "한 줄 묵상", title: "적용하기", prompt: part.reflect },
  ];
}

export default function PartScreen({ part, onExit, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [reflection, setReflection] = useState("");
  const steps = buildSteps(part);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const canAdvance = step.kind !== "quiz" || selected !== null;

  function next() {
    if (isLast) {
      onComplete(part.id, reflection);
      return;
    }
    setStepIndex((i) => i + 1);
    setSelected(null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit}>
          <ArrowLeft size={20} color={colors.bodyText} />
        </TouchableOpacity>
        <View style={styles.progressRow}>
          {steps.map((_, i) => (
            <View key={i} style={[styles.progressDot, i <= stepIndex && styles.progressDotActive]} />
          ))}
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.label}>
          {part.sec} · {part.ch} · {step.label}
        </Text>

        {step.kind === "text" && (
          <>
            <Text style={styles.textTitle}>{step.title}</Text>
            <Text style={styles.textBody}>{step.body}</Text>
          </>
        )}

        {step.kind === "quiz" && (
          <>
            <Text style={styles.quizTitle}>{step.title}</Text>
            <View style={styles.optionList}>
              {step.options.map((opt) => {
                const isSel = selected === opt.id;
                const isCorrect = opt.id === step.answer;
                const showResult = selected !== null;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setSelected(opt.id)}
                    disabled={selected !== null}
                    style={[
                      styles.option,
                      showResult && isCorrect && styles.optionCorrect,
                      showResult && isSel && !isCorrect && styles.optionWrong,
                    ]}
                  >
                    {showResult && isCorrect && (
                      <Check size={16} color={colors.ink} style={{ marginTop: 2 }} />
                    )}
                    <Text style={styles.optionText}>{opt.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {selected !== null && <Text style={styles.explain}>{step.explain}</Text>}
          </>
        )}

        {step.kind === "reflect" && (
          <>
            <Text style={styles.quizTitle}>{step.title}</Text>
            <Text style={styles.reflectPrompt}>{step.prompt}</Text>
            <TextInput
              value={reflection}
              onChangeText={setReflection}
              placeholder="짧게 적어보세요 (선택)"
              placeholderTextColor={colors.muted}
              multiline
              style={styles.textarea}
            />
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={next}
          disabled={!canAdvance}
          style={[styles.nextBtn, !canAdvance && styles.nextBtnDisabled]}
        >
          <Text style={[styles.nextBtnText, !canAdvance && styles.nextBtnTextDisabled]}>
            {isLast ? "오늘도 한 걸음" : "다음"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.parchment },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  progressRow: { flexDirection: "row", gap: 6, flex: 1 },
  progressDot: { height: 6, flex: 1, borderRadius: 3, backgroundColor: colors.borderMuted },
  progressDotActive: { backgroundColor: colors.ink },
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: 24, paddingBottom: 16 },
  label: { color: colors.gold, fontSize: 12, marginBottom: 8 },
  textTitle: { color: colors.inkText, fontSize: 20, fontFamily: "serif", marginBottom: 16 },
  textBody: { color: colors.bodyText, fontFamily: "serif", fontSize: 17, lineHeight: 30 },
  quizTitle: { color: colors.inkText, fontSize: 17, fontWeight: "500", marginBottom: 20, lineHeight: 26 },
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
  reflectPrompt: { color: colors.muted, fontSize: 14, marginBottom: 16 },
  textarea: {
    height: 112,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.bodyText,
    textAlignVertical: "top",
  },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 },
  nextBtn: { borderRadius: 16, paddingVertical: 14, backgroundColor: colors.ink, alignItems: "center" },
  nextBtnDisabled: { backgroundColor: colors.borderMuted },
  nextBtnText: { color: colors.parchment, fontSize: 14, fontWeight: "500" },
  nextBtnTextDisabled: { color: colors.muted },
});
