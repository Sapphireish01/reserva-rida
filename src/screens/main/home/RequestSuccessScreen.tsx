import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface RequestSuccessScreenProps {
  visible: boolean;
  onHome: () => void;
  onViewBooking: () => void;
}

export const RequestSuccessScreen: React.FC<RequestSuccessScreenProps> = ({
  visible,
  onHome,
  onViewBooking,
}) => {
  const [saveRoute, setSaveRoute] = useState(false);

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onHome}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
        <View style={styles.container}>
          {/* Green Checkmark Circle Graphic */}
          <View style={styles.iconOuterCircle}>
            <View style={styles.iconInnerCircle}>
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </View>
          </View>

          {/* Title & Subtitle */}
          <Text style={styles.title}>Request Sent Successfully 🎉</Text>
          <Text style={styles.subtitle}>
            Your request has been sent. We'll let you know when the driver responds.
          </Text>

          {/* Save Route Checkbox Option */}
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => setSaveRoute(!saveRoute)}>
              <Ionicons
                name={saveRoute ? "checkbox" : "square-outline"}
                size={18}
                color={saveRoute ? "#375DFB" : "#94A3B8"}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.checkboxText}>Save route for next time?</Text>
            </TouchableOpacity>

            {/* Action Buttons */}
            <TouchableOpacity style={styles.homeBtn} onPress={onHome}>
              <Text style={styles.homeBtnText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.viewBookingBtn} onPress={onViewBooking}>
              <Text style={styles.viewBookingText}>View Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },

  iconOuterCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },
  iconInnerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#21C650",
    justifyContent: "center",
    alignItems: "center",
  },

  title: { fontFamily: "DM Sans Bold", fontSize: 20, fontWeight: "700", color: "#0F172A", marginBottom: 12, textAlign: "center" },
  subtitle: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", textAlign: "center", lineHeight: 22, maxWidth: 300 },

  bottomSection: { width: "100%", position: "absolute", bottom: 24, paddingHorizontal: 24 },

  checkboxRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  checkboxText: { fontFamily: "DM Sans", fontSize: 13, color: "#94A3B8" },

  homeBtn: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  homeBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#64748B" },

  viewBookingBtn: {
    width: "100%",
    backgroundColor: "#375DFB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  viewBookingText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
});
