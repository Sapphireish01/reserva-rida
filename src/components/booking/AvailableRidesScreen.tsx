import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TripCardSkeleton } from "../ui";

export interface AvailableRidesScreenProps {
  visible: boolean;
  onClose: () => void;
  onSelectRide: (ride: any) => void;
  onOpenFilter: () => void;
}

const DUMMY_RIDES = [
  {
    id: "r1",
    driverName: "Prosper Edward",
    isVerified: true,
    rating: 4.5,
    vehicle: "Honda Accord • Black • KTU345GX",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    startingPoint: "Frebson Fitness Gym",
    destination: "42, Montgomery Road Yaba",
    departureDate: "Tomorrow 10:15AM",
    estimatedArrival: "11:45AM • 12km",
    availableSeats: 2,
    price: "$10.12",
    tripType: "Recurring Trip",
  },
  {
    id: "r2",
    driverName: "Prosper Edward",
    isVerified: true,
    rating: 4.5,
    vehicle: "Honda Accord • Black • KTU345GX",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    startingPoint: "Frebson Fitness Gym",
    destination: "42, Montgomery Road Yaba",
    departureDate: "25 Jun 2025",
    departureTime: "10:30AM",
    availableSeats: 2,
    price: "$10.12",
    tripType: "One-Time Trip",
  },
  {
    id: "r3",
    driverName: "Prosper Edward",
    isVerified: true,
    rating: 4.5,
    vehicle: "Honda Accord • Black • KTU345GX",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    startingPoint: "Frebson Fitness Gym",
    destination: "42, Montgomery Road Yaba",
    departureDate: "25 Jun 2025",
    departureTime: "10:30AM",
    availableSeats: 2,
    price: "$10.12",
    tripType: "One-Time Trip",
  },
];

export const AvailableRidesScreen: React.FC<AvailableRidesScreenProps> = ({
  visible,
  onClose,
  onSelectRide,
  onOpenFilter,
}) => {
  const [viewState, setViewState] = useState<"loading" | "empty" | "populated">("populated");

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Available Rides</Text>
          <TouchableOpacity onPress={onOpenFilter} style={styles.iconBtn}>
            <Ionicons name="options-outline" size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Demo Toggle Bar for Previewing Loading / Empty / Populated */}
        <View style={styles.toggleBar}>
          <TouchableOpacity
            style={[styles.toggleChip, viewState === "loading" && styles.toggleChipActive]}
            onPress={() => setViewState("loading")}
          >
            <Text style={[styles.toggleText, viewState === "loading" && styles.toggleTextActive]}>Loading</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleChip, viewState === "empty" && styles.toggleChipActive]}
            onPress={() => setViewState("empty")}
          >
            <Text style={[styles.toggleText, viewState === "empty" && styles.toggleTextActive]}>Empty</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleChip, viewState === "populated" && styles.toggleChipActive]}
            onPress={() => setViewState("populated")}
          >
            <Text style={[styles.toggleText, viewState === "populated" && styles.toggleTextActive]}>Rides ({DUMMY_RIDES.length})</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        {viewState === "loading" ? (
          <ScrollView style={styles.listContent} showsVerticalScrollIndicator={false}>
            <TripCardSkeleton />
            <TripCardSkeleton />
            <TripCardSkeleton />
          </ScrollView>
        ) : viewState === "empty" ? (
          <View style={styles.emptyContainer}>
            {/* UFO Illustration Placeholder */}
            <View style={styles.ufoCircle}>
              <Ionicons name="planet-outline" size={80} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyText}>
              No trips match your search. Try a nearby date or pickup location to find more options.
            </Text>
            <TouchableOpacity style={styles.exploreBtn} onPress={() => setViewState("populated")}>
              <Text style={styles.exploreBtnText}>Explore Nearby Trips</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.listContent} showsVerticalScrollIndicator={false}>
            {DUMMY_RIDES.map((ride) => (
              <TouchableOpacity
                key={ride.id}
                style={styles.rideCard}
                onPress={() => onSelectRide(ride)}
                activeOpacity={0.8}
              >
                {/* Driver Info Row */}
                <View style={styles.driverRow}>
                  <Image source={{ uri: ride.avatar }} style={styles.driverAvatar} />
                  <View style={styles.driverMeta}>
                    <View style={styles.nameBadgeRow}>
                      <Text style={styles.driverName}>{ride.driverName}</Text>
                      {ride.isVerified && <Ionicons name="checkmark-circle" size={14} color="#375DFB" style={{ marginLeft: 4 }} />}
                      <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>{ride.rating}</Text>
                        <Ionicons name="star" size={12} color="#375DFB" style={{ marginLeft: 2 }} />
                      </View>
                    </View>
                    <Text style={styles.vehicleText} numberOfLines={1}>{ride.vehicle}</Text>
                  </View>

                  <View style={ride.tripType === "Recurring Trip" ? styles.recurringChip : styles.oneTimeChip}>
                    <Text style={ride.tripType === "Recurring Trip" ? styles.recurringChipText : styles.oneTimeChipText}>
                      {ride.tripType}
                    </Text>
                  </View>
                </View>

                {/* Route points */}
                <View style={styles.routeBox}>
                  <View style={styles.pointRow}>
                    <View style={styles.dotOutline} />
                    <Text style={styles.pointLabel}>Starting Point</Text>
                    <Text style={styles.pointValue}>{ride.startingPoint}</Text>
                  </View>
                  <View style={styles.connectorLine} />
                  <View style={styles.pointRow}>
                    <View style={styles.dotSolid} />
                    <Text style={styles.pointLabel}>Destination</Text>
                    <Text style={styles.pointValue}>{ride.destination}</Text>
                  </View>
                </View>

                {/* Time & Arrival Cards */}
                <View style={styles.timeGrid}>
                  <View style={styles.timeCard}>
                    <Text style={styles.timeLabel}>Departure Date</Text>
                    <Text style={styles.timeValue}>{ride.departureDate}</Text>
                  </View>
                  <View style={styles.timeCard}>
                    <Text style={styles.timeLabel}>{ride.estimatedArrival ? "Estimated Arrival" : "Departure Time"}</Text>
                    <Text style={styles.timeValue}>{ride.estimatedArrival || ride.departureTime}</Text>
                  </View>
                </View>

                {/* Footer Price & Seats */}
                <View style={styles.cardFooter}>
                  <View style={styles.seatsRow}>
                    <Ionicons name="people-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
                    <Text style={styles.seatsText}>Available Seats : {ride.availableSeats}</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceValue}>{ride.price}</Text>
                    <Text style={styles.perSeatText}> per seat</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
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
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },

  toggleBar: { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  toggleChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: "#F1F5F9" },
  toggleChipActive: { backgroundColor: "#375DFB" },
  toggleText: { fontFamily: "DM Sans Bold", fontSize: 11, color: "#64748B" },
  toggleTextActive: { color: "#FFFFFF" },

  /* Loading State */
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(15,23,42,0.4)" },
  loadingCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 24, alignItems: "center", width: 220 },
  loadingText: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B" },

  /* Empty State */
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
  ufoCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: "#F8FAFC", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  emptyText: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B", textAlign: "center", lineHeight: 20, marginBottom: 24 },
  exploreBtn: { width: "100%", backgroundColor: "#375DFB", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  exploreBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },

  /* Populated State */
  listContent: { flex: 1, paddingHorizontal: 16, paddingBottom: 24 },
  rideCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginBottom: 14,
  },
  driverRow: { flexDirection: "row", alignItems: "center" },
  driverAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E2E8F0" },
  driverMeta: { flex: 1, marginLeft: 10, marginRight: 6 },
  nameBadgeRow: { flexDirection: "row", alignItems: "center" },
  driverName: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "700", color: "#0F172A" },
  ratingBadge: { flexDirection: "row", alignItems: "center", marginLeft: 6 },
  ratingText: { fontFamily: "DM Sans Bold", fontSize: 12, fontWeight: "700", color: "#375DFB" },
  vehicleText: { fontFamily: "DM Sans", fontSize: 11, color: "#64748B", marginTop: 2 },
  recurringChip: { borderWidth: 1, borderColor: "#BEDBFF", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: "#EFF6FF" },
  recurringChipText: { fontFamily: "DM Sans", fontSize: 10, color: "#375DFB" },
  oneTimeChip: { borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: "#F8FAFC" },
  oneTimeChipText: { fontFamily: "DM Sans", fontSize: 10, color: "#64748B" },

  routeBox: { marginVertical: 12 },
  pointRow: { flexDirection: "row", alignItems: "center" },
  dotOutline: { width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: "#64748B", marginRight: 8 },
  dotSolid: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#64748B", marginRight: 8 },
  pointLabel: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8", marginRight: 6 },
  pointValue: { fontFamily: "DM Sans Bold", fontSize: 12, fontWeight: "600", color: "#0F172A", marginLeft: "auto" },
  connectorLine: { width: 1, height: 12, backgroundColor: "#CBD5E1", marginLeft: 3.5, marginVertical: 2 },

  timeGrid: { flexDirection: "row", gap: 10, marginBottom: 14 },
  timeCard: { flex: 1, backgroundColor: "#F8FAFC", borderRadius: 10, padding: 10 },
  timeLabel: { fontFamily: "DM Sans", fontSize: 10, color: "#94A3B8" },
  timeValue: { fontFamily: "DM Sans Bold", fontSize: 12, fontWeight: "700", color: "#0F172A", marginTop: 2 },

  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTopWidth: 1, borderTopColor: "#F1F5F9" },
  seatsRow: { flexDirection: "row", alignItems: "center" },
  seatsText: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B" },
  priceRow: { flexDirection: "row", alignItems: "baseline" },
  priceValue: { fontFamily: "DM Sans Bold", fontSize: 16, fontWeight: "700", color: "#0F172A" },
  perSeatText: { fontFamily: "DM Sans", fontSize: 11, color: "#64748B" },
});
