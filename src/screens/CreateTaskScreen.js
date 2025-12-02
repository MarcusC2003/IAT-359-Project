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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createEventForCurrentUser } from "../modules/calendarEvents";
import DatePicker from "../components/DatePicker";

const colors = {
  background: "#f7f1eb",
  cardBg: "#ffffff",
  headerText: "#5c3a2c",
  accent: "#E0916C",
  inputBorder: "#8C4B33",
  muted: "#b39b86",
  dropdownBg: "#F7E4D5",
  background: "#f7f1eb",

};

const CATEGORY_OPTIONS = ["School", "Work", "Personal", "Other"];

export default function CreateTaskScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [allDay, setAllDay] = useState(false);

  const [showCategoryList, setShowCategoryList] = useState(false);

  // Create the event when "Create" button is pressed
  const handleCreate = async () => {
    if (!title || !startDate) {
      Alert.alert("Missing info", "Please enter at least a title and start date.");
      return;
    }

    const start = new Date(startDate);
    let end = endDate ? new Date(endDate) : null;

    if (allDay) {
      start.setHours(0, 0, 0, 0);
      if (end) {
        end.setHours(23, 59, 0, 0);
      }
    }

    try {
      await createEventForCurrentUser({
        title,
        startDate: start,
        endDate: end,
        note,
        category: category || null,
        allDay,
      });

      navigation.goBack();
    } catch (e) {
      console.warn(e);
      Alert.alert("Error", e.message || "Could not create task.");
    }
  };

  const toggleCategory = () => setShowCategoryList((prev) => !prev);

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
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Title */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter Title"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Category dropdown */}
            <View style={[styles.fieldBlock, styles.dropdownWrapper]}>
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

            {/* All Day toggle */}
            <View style={[styles.fieldBlock, styles.allDayRow]}>
              <Text style={styles.fieldLabel}>All Day</Text>
              <TouchableOpacity
                style={[styles.allDayToggle, allDay && styles.allDayToggleOn]}
                onPress={() => setAllDay((prev) => !prev)}
              >
                <Text style={styles.allDayToggleText}>
                  {allDay ? "Yes" : "No"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Start Date/Time */}
            <DatePicker
              label="Start"
              value={startDate}
              onChange={setStartDate}
              allowTime={!allDay}
            />

            {/* End Date/Time (optional) */}
            <DatePicker
              label="End (Optional)"
              value={endDate}
              onChange={setEndDate}
              allowTime={!allDay}
              minDate={startDate}
              optional
            />

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
    marginBottom: 70,
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
    fontSize: 25,
    fontWeight: "900",
    color: colors.headerText,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    padding: 18,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: "Fredoka",
    fontSize: 18,
    fontWeight: "700",
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
  dropdownWrapper: {
    position: "relative",
    zIndex: 20,
  },
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
    marginTop: 4,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.dropdownBg,
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    zIndex: 30,
    elevation: 4,
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

  // All Day toggle
  allDayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  allDayToggle: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.inputBorder,
  },
  allDayToggleOn: {
    backgroundColor: colors.accent,
  },
  allDayToggleText: {
    fontFamily: "Fredoka",
    fontSize: 14,
    color: "#fff",
    fontWeight: "700",
  },
});
