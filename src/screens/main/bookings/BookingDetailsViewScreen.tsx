import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CancelBookingDialog } from "../../../components/bookings/CancelBookingDialog";
import { EditBookingModal } from "../../../components/bookings/EditBookingModal";
import { DriverCallScreen } from "../../../components/ongoing/DriverCallScreen";
import { DriverChatScreen } from "../../../components/ongoing/DriverChatScreen";
import { EmergencySosModal } from "../../../components/ongoing/EmergencySosModal";
import { OngoingMapViewScreen } from "./OngoingMapViewScreen";

import {
  useCancelBookingMutation,
  useCheckInBookingMutation,
  useRaiseDisputeMutation,
} from "../../../hooks/useRiderBookings";

export type BookingStatus = "Ongoing" | "Upcoming" | "Pending" | "Completed" | "Cancelled";

export interface BookingDetailsViewScreenProps {
  visible: boolean;
  onClose: () => void;
  booking: any;
  onExploreRides?: () => void;
  onRateTrip?: () => void;
  onRebookTrip?: () => void;
}

export const BookingDetailsViewScreen: React.FC<BookingDetailsViewScreenProps> = ({
  visible,
  onClose,
  booking,
  onExploreRides,
  onRateTrip,
  onRebookTrip,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showLiveMap, setShowLiveMap] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSos, setShowSos] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(booking);

  const cancelMutation = useCancelBookingMutation();
  const checkInMutation = useCheckInBookingMutation();
  const raiseDisputeMutation = useRaiseDisputeMutation();

  useEffect(() => {
    if (booking) {
      setCurrentBooking(booking);
    }
  }, [booking]);

  if (!booking && !currentBooking) return null;

  const activeBooking = currentBooking || booking;
  const status: BookingStatus = activeBooking?.status || "Pending";

  const handleConfirmCancel = async () => {
    setShowCancelDialog(false);
    if (activeBooking?.id) {
      try {
        await cancelMutation.mutateAsync(activeBooking.id);
      } catch (err) {
        console.log("Cancel API error (local fallback applied):", err);
      }
    }
    setCurrentBooking({ ...(activeBooking || {}), status: "Cancelled" });
  };

  const handleSaveEdit = (updatedData: any) => {
    setCurrentBooking({ ...(activeBooking || {}), ...updatedData });
  };

  // Status badge styling helper
  const renderStatusBadge = () => {
    let bg = "#F1F5F9";
    let color = "#64748B";

    if (status === "Ongoing") {
      bg = "#FFF7ED";
      color = "#FF8904";
    } else if (status === "Upcoming") {
      bg = "#EFF6FF";
      color = "#375DFB";
    } else if (status === "Pending") {
      bg = "#F8FAFC";
      color = "#64748B";
    } else if (status === "Completed") {
      bg = "#F0FDF4";
      color = "#21C650";
    } else if (status === "Cancelled") {
      bg = "#FEF2F2";
      color = "#EF4444";
    }

    return (
      <View style={[styles.statusPill, { backgroundColor: bg }]}>
        <Text style={[styles.statusPillText, { color }]}>{status}</Text>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.headerTitle}>My Bookings</Text>
            {renderStatusBadge()}
          </View>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Driver Summary Card */}
          <View style={styles.driverSummaryCard}>
            <Image
              source={{ uri: activeBooking?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" }}
              style={styles.driverAvatar}
            />
            <View style={styles.driverMeta}>
              <View style={styles.nameRow}>
                <Text style={styles.driverName}>{activeBooking?.driverName || "Prosper Edward"}</Text>
                <Ionicons name="checkmark-circle" size={14} color="#375DFB" style={{ marginLeft: 4 }} />
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>{activeBooking?.rating || 4.5}</Text>
                  <Ionicons name="star" size={12} color="#375DFB" style={{ marginLeft: 2 }} />
                </View>
              </View>
              <Text style={styles.vehicleText}>{activeBooking?.vehicle || "Honda Accord • Black • KTU345GX"}</Text>
            </View>
          </View>

          {/* Booking Details Table */}
          <View style={styles.detailsTable}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Pick up point</Text>
              <Text style={styles.tableValue}>{activeBooking?.pickupPoint || activeBooking?.pickup || "Seven and Eight Junction"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Drop Off</Text>
              <Text style={styles.tableValue}>{activeBooking?.dropoffPoint || activeBooking?.destination || "Yaba Bus Stop"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Number of Seats</Text>
              <Text style={styles.tableValue}>{activeBooking?.seats || 1}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Trip Frequency</Text>
              <Text style={styles.tableValue}>{activeBooking?.frequency || "Mon, Wed • Weekly"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Start Date</Text>
              <Text style={styles.tableValue}>{activeBooking?.date || "Tomorrow"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Departure Time</Text>
              <Text style={styles.tableValue}>{activeBooking?.time || "10:00AM"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>End Date</Text>
              <Text style={styles.tableValue}>25 Apr 2026</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>ETA</Text>
              <Text style={styles.tableValue}>11:00AM</Text>
            </View>
          </View>


          {/* Contextual Sections & CTAs Based on Status */}
          {status === "Ongoing" && (
            <View style={styles.ongoingSection}>
              {/* Pickup Directions Card */}
              <Text style={styles.directionSectionTitle}>Nearest Pick-Up Point</Text>
              <TouchableOpacity style={styles.directionCard} onPress={() => setShowLiveMap(true)}>
                <View style={styles.directionIconBox}>
                  <Ionicons name="location" size={18} color="#375DFB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.directionTitle}>Getting to Your Pickup Point</Text>
                  <Text style={styles.directionSub}>Follow the directions below to reach your nearest pickup point.</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              {/* Drop-Off Directions Card */}
              <Text style={styles.directionSectionTitle}>Nearest Drop-Off</Text>
              <TouchableOpacity style={styles.directionCard} onPress={() => setShowLiveMap(true)}>
                <View style={styles.directionIconBox}>
                  <Ionicons name="pin" size={18} color="#375DFB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.directionTitle}>Getting to Your Drop-Off Point</Text>
                  <Text style={styles.directionSub}>Follow the directions below to reach your designated drop-off point</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              {/* Action Buttons Row */}
              <View style={styles.ongoingActionRow}>
                <TouchableOpacity style={styles.imWithDriverBtn} onPress={() => setShowLiveMap(true)}>
                  <Text style={styles.imWithDriverText}>I'm with the driver</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconCircleBtn} onPress={() => setShowCall(true)}>
                  <Ionicons name="call-outline" size={20} color="#375DFB" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconCircleBtn} onPress={() => setShowChat(true)}>
                  <Ionicons name="mail-outline" size={20} color="#375DFB" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {status === "Pending" && (
            <View style={styles.ctaGroup}>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowEditModal(true)}>
                <Text style={styles.primaryBtnText}>Edit Trip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryLightBtn} onPress={() => setShowCancelDialog(true)}>
                <Text style={styles.secondaryLightBtnText}>Cancel Trip</Text>
              </TouchableOpacity>
            </View>
          )}

          {status === "Upcoming" && (
            <View style={styles.upcomingSection}>
              {/* Pickup Directions Card */}
              <Text style={styles.directionSectionTitle}>Nearest Pick-Up Point</Text>
              <TouchableOpacity style={styles.directionCard} onPress={() => setShowLiveMap(true)}>
                <View style={styles.directionIconBox}>
                  <Ionicons name="location" size={18} color="#375DFB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.directionTitle}>Getting to Your Pickup Point</Text>
                  <Text style={styles.directionSub}>Follow the directions below to reach your nearest pickup point.</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              {/* Drop-Off Directions Card */}
              <Text style={styles.directionSectionTitle}>Nearest Drop-Off</Text>
              <TouchableOpacity style={styles.directionCard} onPress={() => setShowLiveMap(true)}>
                <View style={styles.directionIconBox}>
                  <Ionicons name="pin" size={18} color="#375DFB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.directionTitle}>Getting to Your Drop-Off Point</Text>
                  <Text style={styles.directionSub}>Follow the directions below to reach your designated drop-off point</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              {/* Call / Message Actions */}
              <TouchableOpacity style={[styles.primaryBtn, { marginTop: 20 }]} onPress={() => setShowCall(true)}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.primaryBtnText}>Call Driver </Text>
                  <Ionicons name="call-outline" size={18} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.secondaryLightBtn, { marginTop: 10 }]} onPress={() => setShowChat(true)}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.secondaryLightBtnText}>Message Driver </Text>
                  <Ionicons name="mail-outline" size={18} color="#375DFB" />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {status === "Completed" && (
            <View style={styles.ctaGroup}>
              <TouchableOpacity style={styles.primaryBtn} onPress={onRateTrip}>
                <Text style={styles.primaryBtnText}>Rate Trip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryLightBtn} onPress={onRebookTrip}>
                <Text style={styles.secondaryLightBtnText}>Rebook Trip</Text>
              </TouchableOpacity>
            </View>
          )}

          {status === "Cancelled" && (
            <View style={styles.ctaGroup}>
              <TouchableOpacity style={styles.primaryBtn} onPress={onExploreRides || onClose}>
                <Text style={styles.primaryBtnText}>Explore More Rides</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Modals & Flow Views */}
        <OngoingMapViewScreen
          visible={showLiveMap}
          onClose={() => setShowLiveMap(false)}
        />

        <DriverCallScreen
          visible={showCall}
          onClose={() => setShowCall(false)}
        />

        <DriverChatScreen
          visible={showChat}
          onClose={() => setShowChat(false)}
          onCallDriver={() => {
            setShowChat(false);
            setShowCall(true);
          }}
        />

        <EditBookingModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          booking={currentBooking}
          onSave={handleSaveEdit}
        />

        <CancelBookingDialog
          visible={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
          onConfirmCancel={handleConfirmCancel}
        />
      </SafeAreaView>
    </Modal>
  );
};


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: { padding: 4 },
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A", marginRight: 8 },

  statusPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  statusPillText: { fontFamily: "DM Sans Bold", fontSize: 11 },

  content: { flex: 1, paddingHorizontal: 16, paddingBottom: 30 },

  driverSummaryCard: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F1F5F9", marginBottom: 20 },
  driverAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E2E8F0" },
  driverMeta: { flex: 1, marginLeft: 10 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  driverName: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A" },
  ratingBadge: { flexDirection: "row", alignItems: "center", marginLeft: 6 },
  ratingText: { fontFamily: "DM Sans Bold", fontSize: 12, color: "#375DFB" },
  vehicleText: { fontFamily: "DM Sans", fontSize: 11, color: "#64748B", marginTop: 2 },

  detailsTable: { backgroundColor: "#F8FAFC", borderRadius: 14, padding: 14, marginBottom: 24 },
  tableRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  tableLabel: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B" },
  tableValue: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#0F172A" },

  ctaGroup: { gap: 12, marginBottom: 30 },
  primaryBtn: { backgroundColor: "#375DFB", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  primaryBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
  secondaryLightBtn: { backgroundColor: "#EFF6FF", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  secondaryLightBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#375DFB", fontWeight: "700" },

  upcomingSection: { marginBottom: 30 },
  ongoingSection: { marginBottom: 30 },
  ongoingActionRow: { flexDirection: "row", gap: 10, alignItems: "center", marginTop: 20 },
  imWithDriverBtn: { flex: 1, backgroundColor: "#375DFB", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  imWithDriverText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
  iconCircleBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: "#EFF6FF", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#BEDBFF" },

  directionSectionTitle: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8", marginBottom: 6 },
  directionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  directionIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#EFF6FF", justifyContent: "center", alignItems: "center", marginRight: 12 },
  directionIconBoxBlue: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#EFF6FF", justifyContent: "center", alignItems: "center", marginRight: 12 },
  directionTitle: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#0F172A" },
  directionSub: { fontFamily: "DM Sans", fontSize: 11, color: "#64748B", marginTop: 2 },
});

