// customizeRoom.js
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Replace these paths with your actual assets.
 * Example structure:
 *   /assets/pets/dog1.png
 *   /assets/pets/dog2.png
 *   /assets/pets/dog3.png
 */
export const PETS = {
  cat1: require("../assets/images/pets/cat-1.png"),
  cat2: require("../assets/images/pets/cat-2.png"),
  cat3: require("../assets/images/pets/cat-3.png"),
};

// Imperative handle shared via module scope
let _showPopup = null;

/**
 * Call this from anywhere (after <CustomizeRoomPortal/> is mounted):
 *   popUp({ onSelect: (petKey) => { ... } })
 */
export function popUp({ onSelect } = {}) {
  if (typeof _showPopup === "function") {
    _showPopup(onSelect);
  } else {
    console.warn(
      "[customizeRoom] popUp() called before <CustomizeRoomPortal/> was mounted."
    );
  }
}

/**
 * Mount this component once (e.g., inside HomeScreen render tree).
 * It provides the modal UI and wires up the popUp() function.
 */
export default function CustomizeRoomPortal() {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const onSelectRef = useRef(null);

  useEffect(() => {
    _showPopup = (onSelect) => {
      onSelectRef.current = onSelect || null;
      setVisible(true);
    };
    return () => {
      _showPopup = null;
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
  };

  const handlePick = (petKey) => {
    try {
      onSelectRef.current && onSelectRef.current(petKey);
    } finally {
      setVisible(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={handleClose} />

      {/* Card */}
      <View style={[styles.cardWrap, { paddingTop: insets.top + 8 }]}>
        <View style={styles.cardHeader}>
          <View style={styles.headerStripe} />
          <TouchableOpacity
            onPress={handleClose}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={styles.closeX}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.title}>choose a pet</Text>

          <View style={styles.row}>
            {Object.entries(PETS).map(([key, src]) => (
              <TouchableOpacity
                key={key}
                style={styles.petCard}
                onPress={() => handlePick(key)}
                activeOpacity={0.85}
              >
                <View style={styles.petThumb}>
                  <Image source={src} style={styles.petImg} />
                </View>
                <Text style={styles.petLabel}>
                  {key.replace("dog", "dog #")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const COLORS = {
  bg: "#EFE6DE",
  text: "#844634",
  topBar: "#E0916C",
  chip: "rgba(224,145,108,0.25)",
  border: "rgba(132,70,52,0.8)",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  cardWrap: {
    position: "absolute",
    left: 12,
    right: 12,
    top: 0,
    bottom: 12,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    overflow: "hidden",

    // soft shadow
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  cardHeader: {
    height: 56,
    backgroundColor: COLORS.topBar,
    justifyContent: "flex-end",
  },
  headerStripe: {
    height: 4,
    backgroundColor: COLORS.text,
    opacity: 0.35,
  },
  closeBtn: {
    position: "absolute",
    right: 14,
    top: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  closeX: {
    fontSize: 22,
    color: COLORS.text,
    opacity: 0.9,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    alignItems: "center",
  },
  title: {
    fontFamily: "Fredoka",
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    gap: 14,
    marginTop: 6,
  },
  petCard: {
    alignItems: "center",
    width: 110,
  },
  petThumb: {
    width: 110,
    height: 110,
    borderRadius: 18,
    backgroundColor: "#E9DCD2",
    borderWidth: 3,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  petImg: {
    width: 88,
    height: 88,
    resizeMode: "contain",
  },
  petLabel: {
    marginTop: 8,
    fontFamily: "Fredoka",
    fontSize: 14,
    color: COLORS.text,
  },
});
