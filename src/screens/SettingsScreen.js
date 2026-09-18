import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "../theme/colors";

function timeStringToDate(time) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function dateToTimeString(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export default function SettingsScreen({ reminder, onExit, onSave }) {
  const [enabled, setEnabled] = useState(reminder.enabled);
  const [time, setTime] = useState(reminder.time);
  const [showPicker, setShowPicker] = useState(false);

  function save() {
    onSave({ enabled, time });
    onExit();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit}>
          <ArrowLeft size={20} color={colors.bodyText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>아침 알림 설정</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>아침 알림 사용</Text>
            <Text style={styles.rowSub}>설정한 시각에 오늘의 파트를 알려드려요</Text>
          </View>
          <TouchableOpacity
            onPress={() => setEnabled((v) => !v)}
            style={[styles.switch, enabled && styles.switchOn]}
          >
            <View style={[styles.switchKnob, enabled && styles.switchKnobOn]} />
          </TouchableOpacity>
        </View>

        {enabled && (
          <View style={styles.row}>
            <Text style={styles.rowTitle}>알림 시각</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Text style={styles.timeText}>{time}</Text>
            </TouchableOpacity>
          </View>
        )}

        {showPicker && (
          <DateTimePicker
            value={timeStringToDate(time)}
            mode="time"
            is24Hour
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowPicker(Platform.OS === "ios");
              if (selectedDate) setTime(dateToTimeString(selectedDate));
            }}
          />
        )}

        <Text style={styles.note}>
          기기 알림 권한을 허용하면, 앱이 꺼져 있어도 설정한 시각에 매일 알림을 받을 수 있어요.
        </Text>

        <TouchableOpacity onPress={save} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>저장</Text>
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
  headerTitle: { color: colors.inkText, fontSize: 15, fontWeight: "500" },
  body: { flex: 1, paddingHorizontal: 24, paddingBottom: 32 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  rowTitle: { color: colors.inkText, fontSize: 14, fontWeight: "500" },
  rowSub: { color: colors.muted, fontSize: 12, marginTop: 4 },
  timeText: { color: colors.ink, fontSize: 16, fontWeight: "600" },
  switch: { width: 44, height: 24, borderRadius: 12, backgroundColor: colors.borderMuted, justifyContent: "center" },
  switchOn: { backgroundColor: colors.ink },
  switchKnob: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff", marginLeft: 2 },
  switchKnobOn: { marginLeft: 22 },
  note: { color: colors.muted, fontSize: 12, lineHeight: 20, marginBottom: 24 },
  saveBtn: { borderRadius: 16, paddingVertical: 14, backgroundColor: colors.ink, alignItems: "center" },
  saveBtnText: { color: colors.parchment, fontSize: 14, fontWeight: "500" },
});
