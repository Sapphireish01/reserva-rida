import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppBottomSheet } from "../ui/AppBottomSheet";

export interface NotificationOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onDeleteSelected: () => void;
  onMarkAsReadSelected: () => void;
}

export const NotificationOptionsModal: React.FC<NotificationOptionsModalProps> = ({
  visible,
  onClose,
  onDeleteSelected,
  onMarkAsReadSelected,
}) => {
  return (
    <AppBottomSheet visible={visible} onClose={onClose} title="Select an Option" maxHeight="45%">
      <View style={styles.optionsList}>
        <TouchableOpacity style={styles.optionBtn} onPress={onDeleteSelected}>
          <Text style={styles.optionText}>Delete Selected</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionBtn} onPress={onMarkAsReadSelected}>
          <Text style={styles.optionText}>Mark Selected As Read</Text>
        </TouchableOpacity>
      </View>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  optionsList: { gap: 12, paddingBottom: 20 },
  optionBtn: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  optionText: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A" },
});
