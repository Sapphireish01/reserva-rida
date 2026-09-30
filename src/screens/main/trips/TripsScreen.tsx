import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookingFlowModals } from "../../../components/booking/BookingFlowModals";
import { RidesFilterModal } from "../../../components/booking/RidesFilterModal";
import { EmptyState, ErrorState, Skeleton } from "../../../components/ui";
import { normalizeApiError } from "../../../utils/errorUtils";
import {
  formatDriverName,
  formatVehicleSummary,
  useDiscoverTripsQuery,
} from "../../../hooks/useRiderBookings";
import { CheckoutScreen } from "../home/CheckoutScreen";
import { RequestSuccessScreen } from "../home/RequestSuccessScreen";

export interface DiscoverRideItem {
  id: string;
  driverName: string;
  isVerified: boolean;
  rating: number;
  vehicle: string;
  avatar: string;
  startingPoint: string;
  destination: string;
  departureDate: string;
  estimatedArrival: string;
  availableSeats: number;
  price: string;
  tripType: string;
  raw?: any;
}

export const TripsScreen = ({ navigation }: any) => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRide, setSelectedRide] = useState<DiscoverRideItem | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Live Query Hook
  const { data: discoverData, isLoading, isRefetching, isError, error, refetch } = useDiscoverTripsQuery();

  const rides: DiscoverRideItem[] = useMemo(() => {
    if (!discoverData || discoverData.length === 0) {
      return [];
    }

    return discoverData.map((item) => {
      const formattedTime = item.departure_time
        ? item.departure_time.length > 5
          ? item.departure_time.slice(0, 5)
          : item.departure_time
        : "08:00 AM";

      const tripFreq = item.trip_frequency
        ? item.trip_frequency.charAt(0).toUpperCase() + item.trip_frequency.slice(1)
        : "Custom";

      return {
        id: String(item.id),
        driverName: formatDriverName(item.driver),
        isVerified: true,
        rating: (typeof item.driver === "object" && item.driver?.rating) ? item.driver.rating : 5,
        vehicle: formatVehicleSummary(item.vehicle),
        avatar:
          (typeof item.driver === "object" && item.driver?.profile_picture) ||
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        startingPoint: item.pickup_location,
        destination: item.destination,
        departureDate: item.trip_date || "Upcoming",
        estimatedArrival: formattedTime,
        availableSeats: 2,
        price: "₦0.00",
        tripType: item.is_recurring ? `${tripFreq} Trip` : "One-Time Trip",
        raw: item,
      };
    });
  }, [discoverData]);

  const onRefresh = () => {
    refetch();
  };

  const handleConfirmBookingDetails = (details: any) => {
    setBookingDetails(details);
    setSelectedRide(null);
    setShowCheckout(true);
  };

  const handleProceedToPayment = () => {
    setShowCheckout(false);
    setShowSuccess(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trips</Text>
        <TouchableOpacity onPress={() => setShowFilter(true)} style={styles.iconBtn}>
          <Ionicons name="options-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Discover Available Rides List / Skeletons / ErrorState */}
      {isLoading && rides.length === 0 ? (
        <View style={styles.listContent}>
          {[1, 2, 3].map((k) => (
            <View key={k} style={[styles.rideCard, { padding: 16, gap: 12 }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Skeleton width={44} height={44} borderRadius={22} />
                <View style={{ flex: 1, gap: 6 }}>
                  <Skeleton width="60%" height={16} />
                  <Skeleton width="40%" height={12} />
                </View>
                <Skeleton width={80} height={24} borderRadius={12} />
              </View>
              <Skeleton width="100%" height={50} borderRadius={8} />
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Skeleton width="45%" height={32} borderRadius={6} />
                <Skeleton width="45%" height={32} borderRadius={6} />
              </View>
            </View>
          ))}
        </View>
      ) : isError && rides.length === 0 ? (
        <ErrorState
          title="Failed to Load Trips"
          subtitle={normalizeApiError(error).message}
          onButtonPress={() => refetch()}
          buttonTitle="Try Again"
        />
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} colors={["#375DFB"]} />}
          contentContainerStyle={[styles.listContent, rides.length === 0 && { flex: 1, justifyContent: "center" }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title="No Available Trips Found"
              subtitle="Check back shortly or try searching for a different route."
              buttonTitle="Refresh"
              onButtonPress={() => refetch()}
              icon={<Ionicons name="car-outline" size={48} color="#94A3B8" />}
            />
          }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.rideCard}
            onPress={() => setSelectedRide(item)}
            activeOpacity={0.85}
          >
            {/* Driver Header */}
            <View style={styles.driverRow}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.driverMeta}>
                <View style={styles.nameRow}>
                  <Text style={styles.driverName}>{item.driverName}</Text>
                  {item.isVerified && <Ionicons name="checkmark-circle" size={14} color="#375DFB" style={{ marginLeft: 4 }} />}
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>{item.rating}</Text>
                    <Ionicons name="star" size={12} color="#375DFB" style={{ marginLeft: 2 }} />
                  </View>
                </View>
                <Text style={styles.vehicleText} numberOfLines={1}>{item.vehicle}</Text>
              </View>

              <View style={styles.recurringChip}>
                <Text style={styles.recurringChipText}>{item.tripType}</Text>
              </View>
            </View>

            {/* Route Points */}
            <View style={styles.routeBox}>
              <View style={styles.pointRow}>
                <View style={styles.dotOutline} />
                <Text style={styles.pointLabel}>Starting Point</Text>
                <Text style={styles.pointValue}>{item.startingPoint}</Text>
              </View>
              <View style={styles.connectorLine} />
              <View style={styles.pointRow}>
                <View style={styles.dotSolid} />
                <Text style={styles.pointLabel}>Destination</Text>
                <Text style={styles.pointValue}>{item.destination}</Text>
              </View>
            </View>

            {/* Departure & Arrival Info */}
            <View style={styles.timeGrid}>
              <View style={styles.timeCard}>
                <Text style={styles.timeLabel}>Departure Date</Text>
                <Text style={styles.timeValue}>{item.departureDate}</Text>
              </View>
              <View style={styles.timeCard}>
                <Text style={styles.timeLabel}>Estimated Arrival</Text>
                <Text style={styles.timeValue}>{item.estimatedArrival}</Text>
              </View>
            </View>

            {/* Footer Seats & Price */}
            <View style={styles.cardFooter}>
              <View style={styles.seatsRow}>
                <Ionicons name="people-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
                <Text style={styles.seatsText}>Available Seats : {item.availableSeats}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceValue}>{item.price}</Text>
                <Text style={styles.perSeatText}> per seat</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    )}

      {/* Filter Modal */}
      <RidesFilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={() => {}}
      />

      {/* Ride Details & Booking Modals */}
      <BookingFlowModals
        ride={selectedRide}
        onCloseDriverDetails={() => setSelectedRide(null)}
        onConfirmBookingDetails={handleConfirmBookingDetails}
      />

      {/* Checkout Screen */}
      <CheckoutScreen
        visible={showCheckout}
        onClose={() => setShowCheckout(false)}
        bookingData={bookingDetails}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* Request Success Screen */}
      <RequestSuccessScreen
        visible={showSuccess}
        onHome={() => setShowSuccess(false)}
        onViewBooking={() => {
          setShowSuccess(false);
          navigation.navigate("BookingsTab");
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  iconBtn: { padding: 4 },
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },

  listContent: { padding: 16 },

  rideCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginBottom: 14,
  },
  driverRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E2E8F0" },
  driverMeta: { flex: 1, marginLeft: 10, marginRight: 6 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  driverName: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "700", color: "#0F172A" },
  ratingBadge: { flexDirection: "row", alignItems: "center", marginLeft: 6 },
  ratingText: { fontFamily: "DM Sans Bold", fontSize: 12, fontWeight: "700", color: "#375DFB" },
  vehicleText: { fontFamily: "DM Sans", fontSize: 11, color: "#64748B", marginTop: 2 },

  recurringChip: { borderWidth: 1, borderColor: "#BEDBFF", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: "#EFF6FF" },
  recurringChipText: { fontFamily: "DM Sans", fontSize: 10, color: "#375DFB" },

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
