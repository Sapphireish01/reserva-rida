import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppBottomSheet } from "../ui/AppBottomSheet";

export interface EmergencySosModalProps {
  visible: boolean;
  onClose: () => void;
  onCallDriver?: () => void;
  onMessageDriver?: () => void;
}

type SosStep = "contacts" | "confirmSos" | "sosSent";

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  visible,
  onClose,
  onCallDriver,
  onMessageDriver,
}) => {
  const [step, setStep] = useState<SosStep>("contacts");

  const handleCloseAll = () => {
    setStep("contacts");
    onClose();
  };

  return (
    <>
      {/* 1. Emergency Contacts & Quick Phone Actions Sheet */}
      <AppBottomSheet
        visible={visible && step === "contacts"}
        onClose={handleCloseAll}
        showCloseButton={false}
        maxHeight="70%"
      >
        <View style={styles.contactsList}>
          {/* Driver Contact Card 1 */}
          <View style={styles.contactCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>Prosper Edward</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Text style={styles.phoneText}>+23428495069</Text>
                <Ionicons name="copy-outline" size={14} color="#94A3B8" style={{ marginLeft: 6 }} />
              </View>
            </View>

            <TouchableOpacity style={styles.blueIconBtn} onPress={onCallDriver}>
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.lightIconBtn} onPress={onMessageDriver}>
              <Ionicons name="mail" size={18} color="#375DFB" />
            </TouchableOpacity>
          </View>

          {/* Driver Contact Card 2 */}
          <View style={styles.contactCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>Prosper Edward</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Text style={styles.phoneText}>+23428495069</Text>
                <Ionicons name="copy-outline" size={14} color="#94A3B8" style={{ marginLeft: 6 }} />
              </View>
            </View>

            <TouchableOpacity style={styles.blueIconBtn} onPress={onCallDriver}>
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.lightIconBtn} onPress={onMessageDriver}>
              <Ionicons name="mail" size={18} color="#375DFB" />
            </TouchableOpacity>
          </View>

          {/* Trigger Emergency SOS Modal */}
          <TouchableOpacity style={styles.triggerSosBtn} onPress={() => setStep("confirmSos")}>
            <Ionicons name="warning-outline" size={18} color="#E11D48" style={{ marginRight: 6 }} />
            <Text style={styles.triggerSosText}>Trigger Emergency SOS</Text>
          </TouchableOpacity>
        </View>
      </AppBottomSheet>

      {/* 2. Send Emergency SOS Confirmation Dialog */}
      <Modal visible={visible && step === "confirmSos"} transparent animationType="fade" onRequestClose={handleCloseAll}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.dialogTitle}>Send Emergency SOS?</Text>
            <TouchableOpacity
              style={styles.redActionBtn}
              onPress={() => setStep("sosSent")}
            >
              <Text style={styles.redActionText}>Send SOS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBorderBtn} onPress={() => setStep("contacts")}>
              <Text style={styles.cancelBorderText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3. Emergency SOS Sent Confirmation Screen */}
      <Modal visible={visible && step === "sosSent"} transparent animationType="fade" onRequestClose={handleCloseAll}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.closeIconBtn} onPress={handleCloseAll}>
              <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
            </TouchableOpacity>

            <Text style={styles.dialogTitle}>Emergency SOS Sent!</Text>
            <Text style={styles.dialogSub}>Do you want to send a report?</Text>

            <TouchableOpacity style={styles.blueActionBtn} onPress={handleCloseAll}>
              <Text style={styles.blueActionText}>No, Continue with trip</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.lightBlueBtn} onPress={handleCloseAll}>
              <Text style={styles.lightBlueText}>Send Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  contactsList: { gap: 12, paddingBottom: 16 },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  contactName: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#94A3B8" },
  phoneText: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A" },

  blueIconBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: "#375DFB", justifyContent: "center", alignItems: "center" },
  lightIconBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: "#EFF6FF", justifyContent: "center", alignItems: "center" },

  triggerSosBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
  },
  triggerSosText: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#E11D48" },

  /* Dialog Backdrop & Card */
  backdrop: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.65)", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  card: { width: "100%", backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20, alignItems: "center", position: "relative" },
  closeIconBtn: { position: "absolute", top: 16, right: 16 },

  dialogTitle: { fontFamily: "DM Sans Bold", fontSize: 20, fontWeight: "700", color: "#0F172A", marginBottom: 8, textAlign: "center" },
  dialogSub: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", textAlign: "center", marginBottom: 20 },

  redActionBtn: { width: "100%", backgroundColor: "#E11D48", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 10 },
  redActionText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },

  cancelBorderBtn: { width: "100%", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  cancelBorderText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#64748B" },

  blueActionBtn: { width: "100%", backgroundColor: "#375DFB", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 10 },
  blueActionText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },

  lightBlueBtn: { width: "100%", backgroundColor: "#EFF6FF", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  lightBlueText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#375DFB", fontWeight: "700" },
});
