import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface CheckoutScreenProps {
  visible: boolean;
  onClose: () => void;
  bookingData: any;
  onProceedToPayment: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  visible,
  onClose,
  bookingData,
  onProceedToPayment,
}) => {
  const [promoCode, setPromoCode] = useState("RZA-230-10%");
  const [promoStatus, setPromoStatus] = useState<"idle" | "loading" | "applied">("idle");
  const [saveRoute, setSaveRoute] = useState(false);

  const handleRedeem = () => {
    if (!promoCode.trim()) return;
    setPromoStatus("loading");
    setTimeout(() => {
      setPromoStatus("applied");
    }, 1200);
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
            <Text style={styles.headerTitle}>Trip Details</Text>
            <View style={styles.recurringChip}>
              <Text style={styles.recurringChipText}>
                {bookingData?.tripType || (bookingData?.isRecurring ? "Recurring Trip" : "One-Time Trip")}
              </Text>
            </View>
          </View>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Reservation Timer Notice Banner */}
          <View style={styles.noticeBanner}>
            <Text style={styles.noticeText}>
              This reservation will be held for 24 hours. Please complete your payment within this time to secure your booking.
            </Text>
          </View>

          {/* Driver Summary Row */}
          <View style={styles.driverSummaryCard}>
            <Image
              source={{
                uri:
                  bookingData?.driverAvatar ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
              }}
              style={styles.driverAvatar}
            />
            <View style={styles.driverMeta}>
              <View style={styles.nameRow}>
                <Text style={styles.driverName}>{bookingData?.driverName || "Assigned Driver"}</Text>
                <Ionicons name="checkmark-circle" size={14} color="#375DFB" style={{ marginLeft: 4 }} />
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>{bookingData?.driverRating ?? 5}</Text>
                  <Ionicons name="star" size={12} color="#375DFB" style={{ marginLeft: 2 }} />
                </View>
              </View>
              <Text style={styles.vehicleText} numberOfLines={1}>
                {bookingData?.vehicle || "Vehicle Details"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </View>

          {/* Trip Details Table */}
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <View style={styles.detailsTable}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Pick up point</Text>
              <Text style={styles.tableValue}>{bookingData?.pickupPoint || "Pickup Point"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Drop Off</Text>
              <Text style={styles.tableValue}>{bookingData?.dropoffPoint || "Destination"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Number of Seats</Text>
              <Text style={styles.tableValue}>{bookingData?.seats || 1}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Trip Frequency</Text>
              <Text style={styles.tableValue}>{bookingData?.frequency || "Custom"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Start Date</Text>
              <Text style={styles.tableValue}>{bookingData?.startDate || "Upcoming"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Departure Time</Text>
              <Text style={styles.tableValue}>{bookingData?.departureTime || "06:00 AM"}</Text>
            </View>
            {bookingData?.endDate ? (
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>End Date</Text>
                <Text style={styles.tableValue}>{bookingData.endDate}</Text>
              </View>
            ) : null}
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>ETA</Text>
              <Text style={styles.tableValue}>{bookingData?.eta || "45 min"}</Text>
            </View>
          </View>

          {/* Price Breakdown */}
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Fare</Text>
            <Text style={styles.fareValue}>{bookingData?.price || "₦0.00"}</Text>
          </View>

          {/* Promo Code Entry Box */}
          <View style={styles.promoContainer}>
            <TextInput
              style={styles.promoInput}
              value={promoCode}
              onChangeText={setPromoCode}
              placeholder="Promo Code"
              placeholderTextColor="#94A3B8"
            />
            {promoStatus === "applied" ? (
              <View style={styles.appliedBadge}>
                <Text style={styles.appliedText}>Applied!</Text>
                <Ionicons name="checkmark-circle" size={16} color="#21C650" style={{ marginLeft: 4 }} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.redeemBtn}
                onPress={handleRedeem}
                disabled={promoStatus === "loading"}
              >
                {promoStatus === "loading" ? (
                  <ActivityIndicator size="small" color="#375DFB" />
                ) : (
                  <Text style={styles.redeemBtnText}>Redeem</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Save Route Checkbox */}
          <TouchableOpacity style={styles.checkboxRow} onPress={() => setSaveRoute(!saveRoute)}>
            <Ionicons
              name={saveRoute ? "checkbox" : "square-outline"}
              size={18}
              color={saveRoute ? "#375DFB" : "#94A3B8"}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.checkboxLabel}>Save route for next time?</Text>
          </TouchableOpacity>

          {/* Pay Now Button */}
          <TouchableOpacity style={styles.payNowBtn} onPress={onProceedToPayment}>
            <Text style={styles.payNowText}>Pay Now</Text>
          </TouchableOpacity>
        </ScrollView>
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
  recurringChip: { borderWidth: 1, borderColor: "#BEDBFF", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: "#EFF6FF" },
  recurringChipText: { fontFamily: "DM Sans", fontSize: 10, color: "#375DFB" },

  content: { flex: 1, paddingHorizontal: 16, paddingBottom: 24 },

  noticeBanner: { backgroundColor: "#EFF6FF", borderRadius: 12, padding: 12, marginBottom: 16 },
  noticeText: { fontFamily: "DM Sans", fontSize: 12, color: "#375DFB", lineHeight: 18 },

  driverSummaryCard: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F1F5F9", marginBottom: 16 },
  driverAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E2E8F0" },
  driverMeta: { flex: 1, marginLeft: 10 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  driverName: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A" },
  ratingBadge: { flexDirection: "row", alignItems: "center", marginLeft: 6 },
  ratingText: { fontFamily: "DM Sans Bold", fontSize: 12, color: "#375DFB" },
  vehicleText: { fontFamily: "DM Sans", fontSize: 11, color: "#64748B", marginTop: 2 },

  sectionTitle: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#94A3B8", marginBottom: 10 },
  detailsTable: { backgroundColor: "#F8FAFC", borderRadius: 14, padding: 14, marginBottom: 20 },
  tableRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  tableLabel: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B" },
  tableValue: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#0F172A" },

  fareRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  fareLabel: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#0F172A" },
  fareValue: { fontFamily: "DM Sans Bold", fontSize: 18, color: "#0F172A" },

  promoContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  promoInput: { flex: 1, fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A", paddingVertical: 0, height: "100%" },
  redeemBtn: { backgroundColor: "#EFF6FF", borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  redeemBtnText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#375DFB" },
  appliedBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#F0FDF4", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  appliedText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#21C650" },

  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  checkboxLabel: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B" },

  payNowBtn: { backgroundColor: "#375DFB", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 30 },
  payNowText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
});
