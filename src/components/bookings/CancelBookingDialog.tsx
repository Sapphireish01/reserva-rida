import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface CancelBookingDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
}

export const CancelBookingDialog: React.FC<CancelBookingDialogProps> = ({
  visible,
  onClose,
  onConfirmCancel,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Cancel Trip?</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Description Body */}
          <Text style={styles.description}>
            Are you sure you want to cancel this trip? This action cannot be undone.
          </Text>

          {/* Destructive Cancel Button */}
          <TouchableOpacity style={styles.cancelTripBtn} onPress={onConfirmCancel} activeOpacity={0.85}>
            <Text style={styles.cancelTripBtnText}>Cancel Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontFamily: "DM Sans Bold",
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  closeBtn: {
    padding: 2,
  },
  description: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 24,
  },
  cancelTripBtn: {
    backgroundColor: "#E11D48", // Standard vibrant red
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelTripBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
