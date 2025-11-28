// src/screens/CreateTaskScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createEventForCurrentUser } from "../modules/calendarEvents";

const colors = {
  background: "#f7f1eb",
  cardBg: "#ffffff",
  headerText: "#5c3a2c",
  accent: "#E0916C",
  inputBorder: "#8C4B33",
  muted: "#b39b86",
  dropdownBg: "#F7E4D5",
};

const CATEGORY_OPTIONS = ["School", "Work", "Personal", "Other"];

const formatDateTime = (date) => {
  if (!date) return "";
  return date.toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function CreateTaskScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showCategoryList, setShowCategoryList] = useState(false);

  const handleCreate = async () => {
    if (!title || !startDate) {
      Alert.alert(
        "Missing info",
        "Please enter at least a title and start date."
      );
      return;
    }

    try {
      await createEventForCurrentUser({
        title,
        startDate,
        endDate,
        note,
        // optional extra info
        category: category || null,
      });

      navigation.goBack();
    } catch (e) {
      console.warn(e);
      Alert.alert("Error", e.message || "Could not create task.");
    }
  };

  const onStartChange = (selectedDate) => {
    // Android: dismiss picker after selection
    if (Platform.OS === "android") setShowStartPicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndChange = (selectedDate) => {
    if (Platform.OS === "android") setShowEndPicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  const toggleCategory = () => {
    setShowCategoryList((prev) => !prev);
  };

  const pickCategory = (value) => {
    setCategory(value);
    setShowCategoryList(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backHit}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Task</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Enter Title</Text>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Title */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Have family dinner"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Category dropdown */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Category</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={toggleCategory}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    !category && { color: colors.muted },
                  ]}
                >
                  {category || "Select a category"}
                </Text>
                <Text style={styles.dropdownArrow}>
                  {showCategoryList ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>

              {showCategoryList && (
                <View style={styles.dropdownList}>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={styles.dropdownItem}
                      onPress={() => pickCategory(opt)}
                    >
                      <Text style={styles.dropdownItemText}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Start date time */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Start Date &amp; Time</Text>
              <TouchableOpacity
                style={styles.inputLike}
                onPress={() => setShowStartPicker(true)}
              >
                <Text
                  style={[
                    styles.inputLikeText,
                    !startDate && { color: colors.muted },
                  ]}
                >
                  {formatDateTime(startDate) || "Select start date & time"}
                </Text>
              </TouchableOpacity>

              {showStartPicker && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="datetime"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={onStartChange}
                />
              )}
            </View>

            {/* End date time (optional) */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>End Date &amp; Time (Optional)</Text>
              <TouchableOpacity
                style={styles.inputLike}
                onPress={() => setShowEndPicker(true)}
              >
                <Text
                  style={[
                    styles.inputLikeText,
                    !endDate && { color: colors.muted },
                  ]}
                >
                  {endDate
                    ? formatDateTime(endDate)
                    : "Select end date & time"}
                </Text>
              </TouchableOpacity>

              {showEndPicker && (
                <DateTimePicker
                  value={endDate || startDate || new Date()}
                  mode="datetime"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={onEndChange}
                />
              )}
            </View>

            {/* Note */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Note</Text>
              <TextInput
                style={[styles.input, styles.noteInput]}
                value={note}
                onChangeText={setNote}
                placeholder="Extra details..."
                placeholderTextColor={colors.muted}
                multiline
              />
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.createText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  backHit: {
    padding: 4,
    marginRight: 8,
  },
  backArrow: {
    fontSize: 26,
    color: colors.headerText,
  },
  headerTitle: {
    fontFamily: "Fredoka",
    fontSize: 20,
    fontWeight: "900",
    color: colors.headerText,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    padding: 18,
  },
  sectionTitle: {
    fontFamily: "Fredoka",
    fontSize: 18,
    color: colors.headerText,
    marginBottom: 12,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: "Fredoka",
    fontSize: 14,
    color: colors.headerText,
    marginBottom: 4,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.inputBorder,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: "Fredoka",
    fontSize: 14,
    color: colors.headerText,
  },
  noteInput: {
    height: 100,
    textAlignVertical: "top",
  },
  // fake input for date/time
  inputLike: {
    borderWidth: 2,
    borderColor: colors.inputBorder,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  inputLikeText: {
    fontFamily: "Fredoka",
    fontSize: 14,
    color: colors.headerText,
  },
  createButton: {
    marginTop: 12,
    backgroundColor: colors.accent,
    borderRadius: 24,
    alignItems: "center",
    paddingVertical: 12,
  },
  createText: {
    fontFamily: "Fredoka",
    fontSize: 16,
    color: "#fff",
    fontWeight: "800",
  },

  // dropdown styles
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: colors.inputBorder,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownText: {
    fontFamily: "Fredoka",
    fontSize: 14,
    color: colors.headerText,
  },
  dropdownArrow: {
    fontSize: 14,
    color: colors.headerText,
  },
  dropdownList: {
    marginTop: 6,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.dropdownBg,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    fontFamily: "Fredoka",
    fontSize: 14,
    color: colors.headerText,
  },
});
