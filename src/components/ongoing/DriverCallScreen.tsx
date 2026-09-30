import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface DriverCallScreenProps {
  visible: boolean;
  onClose: () => void;
  driverName?: string;
  avatar?: string;
}

export const DriverCallScreen: React.FC<DriverCallScreenProps> = ({
  visible,
  onClose,
  driverName = "Prosper Edward",
  avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
        <View style={styles.container}>
          {/* Top Left Minimize Icon */}
          <TouchableOpacity style={styles.minimizeBtn} onPress={onClose}>
            <Ionicons name="contract-outline" size={22} color="#0F172A" />
          </TouchableOpacity>

          {/* Header Driver Info */}
          <Text style={styles.driverName}>{driverName}</Text>
          <Text style={styles.callStatusText}>Calling...</Text>

          {/* Large Circular Avatar */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          </View>

          {/* Bottom Call Controls */}
          <View style={styles.controlsRow}>
            {/* Message Action */}
            <TouchableOpacity style={styles.controlCircleBtn} onPress={onClose}>
              <Ionicons name="mail-outline" size={22} color="#0F172A" />
            </TouchableOpacity>

            {/* Speaker Action */}
            <TouchableOpacity
              style={[styles.controlCircleBtn, isSpeaker && styles.controlCircleBtnActive]}
              onPress={() => setIsSpeaker(!isSpeaker)}
            >
              <Ionicons name="volume-high-outline" size={22} color={isSpeaker ? "#375DFB" : "#0F172A"} />
            </TouchableOpacity>

            {/* Mute Mic Action */}
            <TouchableOpacity
              style={[styles.controlCircleBtn, isMuted && styles.controlCircleBtnActive]}
              onPress={() => setIsMuted(!isMuted)}
            >
              <Ionicons name={isMuted ? "mic-off-outline" : "mic-outline"} size={22} color={isMuted ? "#375DFB" : "#0F172A"} />
            </TouchableOpacity>

            {/* Red End Call Action */}
            <TouchableOpacity style={styles.endCallBtn} onPress={onClose}>
              <Ionicons name="call" size={24} color="#FFFFFF" style={{ transform: [{ rotate: "135deg" }] }} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, alignItems: "center", justifyContent: "space-between", paddingVertical: 24, paddingHorizontal: 20 },
  minimizeBtn: { alignSelf: "flex-start", padding: 8, backgroundColor: "#F8FAFC", borderRadius: 20 },

  driverName: { fontFamily: "DM Sans Bold", fontSize: 22, fontWeight: "700", color: "#0F172A", marginTop: 20 },
  callStatusText: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B", marginTop: 4 },

  avatarContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
    borderWidth: 4,
    borderColor: "#F1F5F9",
    marginVertical: 40,
  },
  avatarImage: { width: "100%", height: "100%" },

  controlsRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 },
  controlCircleBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  controlCircleBtnActive: { backgroundColor: "#EFF6FF", borderColor: "#BEDBFF" },
  endCallBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E11D48",
    justifyContent: "center",
    alignItems: "center",
  },
});
