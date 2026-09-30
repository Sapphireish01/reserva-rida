import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppBottomSheet } from "../ui/AppBottomSheet";

export interface ChooseTopUpModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMethod: (method: string) => void;
}

export const ChooseTopUpModal: React.FC<ChooseTopUpModalProps> = ({
  visible,
  onClose,
  onSelectMethod,
}) => {
  const methods = [
    { id: "card", label: "Pay with Card", icon: "card-outline" },
    { id: "bank", label: "Pay with Bank Transfer", icon: "business-outline" },
    { id: "paypal", label: "Pay with PayPal", icon: "logo-paypal" },
    { id: "stripe", label: "Pay with Stripe", icon: "wallet-outline" },
  ];

  return (
    <AppBottomSheet visible={visible} onClose={onClose} title="Choose Top-Up" maxHeight="55%">
      <View style={styles.listContainer}>
        {methods.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={styles.methodCard}
            onPress={() => {
              onSelectMethod(m.id);
              onClose();
            }}
            activeOpacity={0.8}
          >
            <View style={styles.leftRow}>
              <Ionicons name={m.icon as any} size={20} color="#375DFB" style={{ marginRight: 12 }} />
              <Text style={styles.methodLabel}>{m.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        ))}
      </View>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  listContainer: { gap: 12, paddingBottom: 20 },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  leftRow: { flexDirection: "row", alignItems: "center" },
  methodLabel: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A" },
});
