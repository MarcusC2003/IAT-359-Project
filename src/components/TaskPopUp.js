// src/components/TaskPopUp.js
import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const COLORS = {
  backdrop: "rgba(0,0,0,0.3)",
  cardBg: "#FFFFFF",
  headerText: "#5c3a2c",
  accent: "#E0916C",
  subtle: "#B39A84",
  pillBg: "#F7E4D5",
  dangerBg: "#F7C4C4",
  dangerText: "#B63B3B",
};

const formatDateTime = (value, allDay) => {
  if (!value) return "-";
  const d = value instanceof Date ? value : new Date(value);

  if (allDay) {
    return d.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return d.toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function TaskPopUp({ visible, onClose, event, onRemove }) {
  if (!event) return null;

  const { title, note, startDate, endDate, category, allDay } = event;

  const handleRemove = () => {
    if (onRemove) {
      onRemove(event);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>{title || "Untitled task"}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Category / all day pills */}
          <View style={styles.pillsRow}>
            {category ? (
              <View style={styles.pill}>
                <Text style={styles.pillText}>{category}</Text>
              </View>
            ) : null}
            {allDay ? (
              <View style={styles.pill}>
                <Text style={styles.pillText}>All Day</Text>
              </View>
            ) : null}
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {/* Category row */}
            <View style={styles.row}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.value}>{category || "—"}</Text>
            </View>

            {/* Start */}
            <View style={styles.row}>
              <Text style={styles.label}>Start</Text>
              <Text style={styles.value}>
                {formatDateTime(startDate, allDay)}
              </Text>
            </View>

            {/* End */}
            <View style={styles.row}>
              <Text style={styles.label}>End</Text>
              <Text style={styles.value}>
                {endDate ? formatDateTime(endDate, allDay) : "—"}
              </Text>
            </View>

            {/* Notes */}
            <View
              style={[
                styles.row,
                { flexDirection: "column", alignItems: "flex-start" },
              ]}
            >
              <Text style={styles.label}>Notes</Text>
              <Text style={styles.noteText}>
                {note && note.trim().length > 0
                  ? note
                  : "No additional notes."}
              </Text>
            </View>
          </ScrollView>

          {/* Footer buttons */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.backdrop,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontFamily: "Fredoka",
    fontSize: 30,
    fontWeight: "600",
    color: COLORS.headerText,
    marginRight: 8,
  },
  closeText: {
    fontSize: 20,
    color: COLORS.subtle,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  pill: {
    backgroundColor: COLORS.pillBg,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontFamily: "Fredoka",
    fontSize: 14,
    fontWeight:"500",
    color: COLORS.headerText,
  },
  content: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontFamily: "Fredoka",
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.subtle,
  },
  value: {
    fontFamily: "Fredoka",
    fontSize: 18,
    color: COLORS.headerText,
    maxWidth: "65%",
    textAlign: "right",
  },
  noteText: {
    marginTop: 4,
    fontFamily: "Fredoka",
    fontSize: 17,
    color: COLORS.headerText,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 10,
  },
  removeButton: {
    flex: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.dangerBg,
  },
  removeButtonText: {
    fontFamily: "Fredoka",
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.dangerText,
  },
  closeButton: {
    flex: 1,
    alignSelf: "center",
    backgroundColor: COLORS.accent,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontFamily: "Fredoka",
    fontSize: 15,
    color: "#fff",
    fontWeight: "700",
  },
});
