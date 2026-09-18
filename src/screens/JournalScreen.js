import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { PARTS } from "../data/curriculum";
import { colors } from "../theme/colors";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function JournalScreen({ reflections, onExit }) {
  const entries = Object.entries(reflections)
    .filter(([, v]) => v && v.text)
    .map(([partId, v]) => ({
      partId: Number(partId),
      ...v,
      part: PARTS.find((p) => p.id === Number(partId)),
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit}>
          <ArrowLeft size={20} color={colors.bodyText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>나의 여정 노트</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {entries.length === 0 ? (
          <Text style={styles.empty}>
            아직 남긴 묵상이 없어요. 파트를 마칠 때 마지막 단계에서 짧게 적어보세요.
          </Text>
        ) : (
          entries.map((e) => (
            <View key={e.partId} style={styles.entry}>
              <Text style={styles.entryMeta}>
                {formatDate(e.date)} · {e.part?.sec} · {e.part?.ch}
              </Text>
              <Text style={styles.entryTitle}>{e.part?.title}</Text>
              <Text style={styles.entryText}>{e.text}</Text>
            </View>
          ))
        )}
      </ScrollView>
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
  headerTitle: { color: colors.inkText, fontSize: 15, fontWeight: "500" },
  body: { paddingHorizontal: 24, paddingBottom: 32 },
  empty: { color: colors.muted, fontSize: 14, lineHeight: 22, marginTop: 16 },
  entry: { borderBottomWidth: 1, borderBottomColor: colors.borderMuted, paddingVertical: 16 },
  entryMeta: { color: colors.gold, fontSize: 12 },
  entryTitle: { color: colors.inkText, fontSize: 14, fontWeight: "500", marginTop: 4 },
  entryText: { color: colors.bodyText, fontSize: 14, lineHeight: 22, marginTop: 8 },
});
