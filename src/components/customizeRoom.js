// customizeRoom.js
import React, { useEffect, useRef, useState } from "react";
import {Modal,View,Text,TouchableOpacity,Image,StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PET_LIST = {
  Bartholemeu: require("../assets/images/pets/Cat-Orange.png"),
  Miso: require("../assets/images/pets/Cat-White.png"),
  Taro: require("../assets/images/pets/Dog-Shiba.png"),
};

/**
 * Load the saved pet key.
 * If nothing saved OR the value is invalid, return the provided default.
 */
export async function loadSavedPet(defaultKey) {
  try {
    const saved = await AsyncStorage.getItem('selectedPet');
    if (!saved) return defaultKey;

    return saved;
  } catch (e) {
    console.warn("Failed to load pet:", e);
    return defaultKey;
  }
}

//Save selected pet key to storage.
export async function savePet(key) {
  try {
    await AsyncStorage.setItem('selectedPet', key);
  } catch (e) {
    console.warn("Failed to save pet:", e);
  }
}

let showPopup = null;
// Function: triggers the popup to show
export function popUp({ onSelect } = {}) {
  if (typeof showPopup === "function") {
    showPopup(onSelect);
  }
}

// CustomizeRoomPopUp Component
export default function CustomizeRoomPopUp() {
  const [visible, setVisible] = useState(false);
  // Prevents re-rendering issues
  const onSelectRef = useRef(null);

  useEffect(() => {
    showPopup = (onSelect) => {
      onSelectRef.current = onSelect || null;
      setVisible(true);
    };
    return () => {
      showPopup = null;
    };
  }, []);

  // Close the popup
  const handleClose = () => setVisible(false);

  // Handle pet selection
  const handlePick = async (petKey) => {
    await savePet(petKey);
    try {
      onSelectRef.current && onSelectRef.current(petKey);
    } finally {
      setVisible(false);
    }
  };

  // Reference Modal: https://docs.expo.dev/router/advanced/modals/
  return (
    <Modal
    visible={visible}
    animationType="fade"
    transparent
    onRequestClose={handleClose}
  >
  {/* Backdrop */}
  <View style={styles.backdrop}>
    
    {/* Pop-up */}  
    <View style={styles.popupContainer}>
      <View style={styles.popupHeader}>
        <View style={styles.headerStripe} />

        <TouchableOpacity
          onPress={handleClose}
          hitSlop={{ top: 15, left: 15, right: 15, bottom: 15 }}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Text style={styles.closeX}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.popupBody}>
        <Text style={styles.title}>choose a pet</Text>

        {/* Pet Select Row */}
        <View style={styles.row}>
          {Object.entries(PET_LIST).map(([name, image]) => (
            <TouchableOpacity
              key={name}
              style={styles.petCard}
              onPress={() => handlePick(name)}
              activeOpacity={0.85}
            >
              <View style={styles.petThumb}>
                <Image source={image} style={styles.petImg} />
              </View>
              <Text style={styles.petLabel}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    justifyContent: "center",  
    alignItems: "center",      
  },

  // main popup container (used to be cardWrap)
  popupContainer: {
    width: "95%",
    backgroundColor: COLORS.white,
    borderRadius: 22,
    overflow: "hidden",//clip content
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  popupHeader: {
    height: 56,
    width: "100%",
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

  // content area (used to be cardBody)
  popupBody: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: COLORS.white,
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
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 6,
  },

  petCard: {
    alignItems: "center",
    width: 100,
  },

  petThumb: {
    width: 100,
    height: 100,
    borderRadius: 18,
    backgroundColor: "#E9DCD2",
    borderWidth: 3,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  petImg: {
    width: 65,
    height: 65,
    resizeMode: "contain",
  },

  petLabel: {
    marginTop: 8,
    fontFamily: "Fredoka",
    fontWeight: "600",
    fontSize: 14,
    color: COLORS.text,
  },
});
