import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DirectionsListModal } from "../../../components/ongoing/DirectionsListModal";
import { DriverCallScreen } from "../../../components/ongoing/DriverCallScreen";
import { DriverChatScreen } from "../../../components/ongoing/DriverChatScreen";
import { EmergencySosModal } from "../../../components/ongoing/EmergencySosModal";
import { RateTripModal } from "../../../components/ongoing/RateTripModal";

export interface OngoingMapViewScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const OngoingMapViewScreen: React.FC<OngoingMapViewScreenProps> = ({
  visible,
  onClose,
}) => {
  const [showDirections, setShowDirections] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSos, setShowSos] = useState(false);
  const [showRating, setShowRating] = useState(false);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.container}>
          {/* Top Dark Emerald Turn-by-Turn Maneuver Guidance Card */}
          <View style={styles.guidanceCard}>
            <View style={styles.directionRow}>
              <Ionicons name="arrow-up" size={28} color="#FFFFFF" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.towardLabel}>toward Gbade</Text>
                <Text style={styles.streetNameText}>Olayode Cl</Text>
              </View>
              <TouchableOpacity style={styles.starCircleBtn} activeOpacity={0.8}>
                <Ionicons name="sparkles" size={20} color="#305CFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.subManeuverPill}>
              <Text style={styles.subManeuverText}>Then ↰</Text>
            </View>
          </View>

          {/* Interactive Map Canvas */}
          <View style={styles.mapCanvas}>
            {/* Simulated Route Line */}
            <View style={styles.routeLine} />

            {/* Car Icon Marker */}
            <View style={styles.carMarker}>
              <Ionicons name="car" size={22} color="#305CFF" />
            </View>

            {/* Floating Side Action Controls */}
            <View style={styles.floatingControls}>
              <TouchableOpacity style={styles.circleDarkBtn} activeOpacity={0.8}>
                <Ionicons name="compass-outline" size={22} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.circleDarkBtn} activeOpacity={0.8}>
                <Ionicons name="search" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.circleDarkBtn} activeOpacity={0.8}>
                <Ionicons name="volume-mute" size={22} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reportPillBtn}
                onPress={() => setShowSos(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="warning" size={16} color="#F59E0B" />
                <Text style={styles.reportBtnText}>Report</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Navigation Control Sheet */}
          <View style={styles.bottomCard}>
            <View style={styles.dragHandle} />

            {/* Sub-Header Drop Off ETA */}
            <View style={styles.sheetHeaderRow}>
              <View>
                <Text style={styles.stateTitleText}>Drop off at 7:44 AM</Text>
                <Text style={styles.etaSubText}>500m • 26min</Text>
              </View>
              <TouchableOpacity
                style={styles.viewDirectionsChip}
                onPress={() => setShowDirections(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="navigate-outline" size={14} color="#305CFF" style={{ marginRight: 4 }} />
                <Text style={styles.viewDirectionsText}>View Directions</Text>
              </TouchableOpacity>
            </View>

            {/* Communication & SOS Action Button Row */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.callSquareBtn}
                onPress={() => setShowCall(true)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Call driver"
              >
                <Ionicons name="call" size={22} color="#305CFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.messageSquareBtn}
                onPress={() => setShowChat(true)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Message driver"
              >
                <Ionicons name="mail" size={22} color="#305CFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => setShowRating(true)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Arrived at destination"
              >
                <Text style={styles.primaryBtnText}>Arrived</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Directions List Sheet */}
        <DirectionsListModal
          visible={showDirections}
          onClose={() => setShowDirections(false)}
        />

        {/* Driver Voice Call Screen */}
        <DriverCallScreen
          visible={showCall}
          onClose={() => setShowCall(false)}
        />

        {/* Driver Chat Screen */}
        <DriverChatScreen
          visible={showChat}
          onClose={() => setShowChat(false)}
          onCallDriver={() => {
            setShowChat(false);
            setShowCall(true);
          }}
        />

        {/* Safety SOS Workflow */}
        <EmergencySosModal
          visible={showSos}
          onClose={() => setShowSos(false)}
          onCallDriver={() => {
            setShowSos(false);
            setShowCall(true);
          }}
          onMessageDriver={() => {
            setShowSos(false);
            setShowChat(true);
          }}
        />

        {/* Post-Trip Rating Modal */}
        <RateTripModal
          visible={showRating}
          onClose={() => setShowRating(false)}
          onSubmitSuccess={() => {
            setShowRating(false);
            onClose();
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#00382E" },
  container: { flex: 1, backgroundColor: "#0F172A" },

  // Top Turn-by-Turn Navigation Card (Section 3)
  guidanceCard: {
    backgroundColor: "#00382E", // Dark Emerald-Teal
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  directionRow: { flexDirection: "row", alignItems: "center" },
  towardLabel: { fontFamily: "DM Sans", fontSize: 14, color: "#A7F3D0" },
  streetNameText: { fontFamily: "DM Sans Bold", fontSize: 22, fontWeight: "700", color: "#FFFFFF" },
  starCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  subManeuverPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  subManeuverText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#FFFFFF" },

  // Map Canvas & Controls (Section 4)
  mapCanvas: { flex: 1, backgroundColor: "#0F172A", justifyContent: "center", alignItems: "center", position: "relative" },
  routeLine: { width: "80%", height: 6, backgroundColor: "#38BDF8", borderRadius: 3 },
  carMarker: {
    position: "absolute",
    top: "45%",
    left: "55%",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingControls: { position: "absolute", right: 16, bottom: 20, gap: 10, alignItems: "center" },
  circleDarkBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  reportPillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1E293B",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    elevation: 6,
  },
  reportBtnText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#FFFFFF" },

  // Bottom Navigation Control Sheet (Section 5)
  bottomCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  stateTitleText: { fontFamily: "DM Sans Bold", fontSize: 19, fontWeight: "700", color: "#0F172A" },
  etaSubText: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B", marginTop: 2 },
  viewDirectionsChip: { flexDirection: "row", alignItems: "center", backgroundColor: "#EFF6FF", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  viewDirectionsText: { fontFamily: "DM Sans Bold", fontSize: 12, color: "#305CFF" },

  actionButtonsRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  callSquareBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#305CFF",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  messageSquareBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#EBF2FF",
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtn: {
    flex: 1,
    height: 54,
    backgroundColor: "#305CFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
});

