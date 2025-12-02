// src/components/DatePicker.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";


const toYMD = (date) => {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "";
  return date.toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  });
};

//Reference https://www.w3schools.com/jsref/jsref_tolocalestring.asp
export default function DatePicker({
  label,
  value,
  onChange,
  allowTime = true,
  minDate,
  optional = false,
}) {
  const [visible, setVisible] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());


// open and close
  const openModal = () => {
    setTempDate(value || new Date());
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
  };

// Calendar Reference:https://github.com/wix/react-native-calendars#basic-parameters
  const handleDayPress = (day) => {
    const [year, month, date] = day.dateString.split("-").map((n) => parseInt(n, 10));
    setTempDate((prev) => {
      const base = prev || value || new Date();
      const d = new Date(base);
      d.setFullYear(year, month - 1, date);
      return d;
    });
  };

  const onTimeChange = (event, selectedDate) => {
    if (event.type === "dismissed") return;
    if (selectedDate) {
      setTempDate((prev) => {
        const base = prev || value || new Date();
        const d = new Date(base);
        d.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
        return d;
      });
    }
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setVisible(false);
  };

  const displayText = () => {
    if (!value) {
      return optional ? `Select ${label.toLowerCase()}` : "Select date";
    }
    const datePart = formatDisplayDate(value);
    if (!allowTime) return datePart;
    return `${datePart} • ${formatTime(value)}`;
  };

  return (
    <View style={styles.fieldBlock}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}

      {/* Selector button */}
      <TouchableOpacity style={styles.inputLike} onPress={openModal}>
        <Text
          style={[
            styles.inputLikeText,
            !value && { color: colors.muted },
          ]}
        >
          {displayText()}
        </Text>
      </TouchableOpacity>

        {/* 
        *   popup 
        *   nested calendar and time picker
        *   Calendar Reference:https://github.com/wix/react-native-calendars#basic-parameters
        */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.modalTitle}>
              {label || "Select Date"}
            </Text>

            <Calendar
                style={{ borderRadius: 14, fontWeight: "700" }}
              onDayPress={handleDayPress}
              markedDates={{
                [toYMD(tempDate)]: {
                  selected: true,
                  selectedColor: colors.accent,
                  selectedTextColor: "#fff",
                },
              }}
              minDate={minDate ? toYMD(minDate) : undefined}
            />
            
            {allowTime && (
              <View style={styles.timeSection}>
                <Text style={styles.timeLabel}>Time</Text>
                {/* time picker */}
                <DateTimePicker
                  value={tempDate || new Date()}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                />
              </View>
            )}

            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>

            {optional && value && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => {
                  onChange(null);
                  setVisible(false);
                }}
              >
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
const colors = {
    headerText: "#5c3a2c",
    accent: "#E0916C",
    inputBorder: "#8C4B33",
    muted: "#b39b86",
    background: "#f7f1eb",

  
};
const styles = StyleSheet.create({
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

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderColor: colors.inputBorder,
    borderWidth: 3,
  },
  modalTitle: {
    fontFamily: "Fredoka",
    fontSize: 22,
    fontWeight: "700",
    color: colors.headerText,
    textAlign: "center",
    marginBottom: 8,
  },
  timeSection: {
    marginTop: 12,
    alignItems: "center",
  },
  timeLabel: {
    fontFamily: "Fredoka",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    color: colors.headerText,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  cancelText: {
    fontFamily: "Fredoka",
    fontSize: 15,
    fontWeight: "700",
    color: colors.accent,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
  confirmText: {
    fontFamily: "Fredoka",
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  clearBtn: {
    marginTop: 8,
    alignItems: "center",
  },
  clearText: {
    fontFamily: "Fredoka",
    fontSize: 14,
    color: colors.muted,
    textDecorationLine: "underline",
  },
});
