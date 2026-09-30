import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState, ErrorState, Skeleton } from "../../../components/ui";
import { normalizeApiError } from "../../../utils/errorUtils";
import {
  formatDriverName,
  formatRecurrenceDays,
  formatVehicleSummary,
  mapBackendBookingStatus,
  useRiderBookingsQuery,
} from "../../../hooks/useRiderBookings";
import { BookingDetailsViewScreen, BookingStatus } from "./BookingDetailsViewScreen";

type Props = any;

export interface BookingItem {
  id: string;
  routeTitle: string;
  pickup: string;
  destination: string;
  pickupPoint?: string;
  dropoffPoint?: string;
  seats: number;
  frequency: string;
  date: string;
  time: string;
  status: BookingStatus;
  driverName?: string;
  avatar?: string;
  rating?: number;
  vehicle?: string;
}

export const PassengerRequestsScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

  // Live Query Hook
  const { data: apiResponse, isLoading, isRefetching, isError, error, refetch } = useRiderBookingsQuery();

  // Normalization of API Results
  const bookings: BookingItem[] = useMemo(() => {
    if (!apiResponse?.results || apiResponse.results.length === 0) {
      return [];
    }

    return apiResponse.results.map((item) => {
      const pickupName = item.pickup_point?.name || item.pickup_location || "Pickup point";
      const dropoffName = item.dropoff_point?.name || item.destination || "Destination";
      const routeTitle = `${item.pickup_location || pickupName} ➔ ${item.destination || dropoffName}`;

      return {
        id: String(item.id),
        routeTitle,
        pickup: item.pickup_location,
        destination: item.destination,
        pickupPoint: item.pickup_point?.name,
        dropoffPoint: item.dropoff_point?.name,
        seats: item.seats_requested || item.available_seats || item.seats_booked || 1,
        frequency: formatRecurrenceDays(
          item.recurrence_days,
          item.trip_frequency || item.recurrence_frequency
        ),
        date: item.trip_date || item.start_date || "Upcoming",
        time: item.departure_time || "08:00 AM",
        status: mapBackendBookingStatus(item.status, item.trip_status),
        driverName: formatDriverName(item.driver),
        avatar: (typeof item.driver === "object" && item.driver?.profile_picture) || undefined,
        rating: (typeof item.driver === "object" && item.driver?.rating) ? item.driver.rating : 5,
        vehicle: formatVehicleSummary(item.vehicle),
      };
    });
  }, [apiResponse]);

  const getStatusBadgeStyle = (status: BookingStatus) => {
    switch (status) {
      case "Ongoing":
        return { cardBg: "#FFFFFF", badgeBg: "#FFF7ED", textColor: "#FF8904", borderColor: "#FFEDD4" };
      case "Upcoming":
        return { cardBg: "#FFFFFF", badgeBg: "#EFF6FF", textColor: "#375DFB", borderColor: "#DBEAFE" };
      case "Pending":
        return { cardBg: "#FFFFFF", badgeBg: "#F8FAFC", textColor: "#64748B", borderColor: "#E2E8F0" };
      case "Completed":
        return { cardBg: "#FFFFFF", badgeBg: "#F0FDF4", textColor: "#21C650", borderColor: "#DCFCE7" };
      case "Cancelled":
        return { cardBg: "#FFFFFF", badgeBg: "#FEF2F2", textColor: "#EF4444", borderColor: "#FFE2E2" };
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={styles.rightSpacer} />
      </View>

      {/* Bookings List / Skeletons / Empty / Error State */}
      {isLoading && !apiResponse ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map((key) => (
            <View key={key} style={styles.skeletonCard}>
              <Skeleton width="70%" height={18} borderRadius={4} />
              <View style={{ height: 10 }} />
              <Skeleton width="40%" height={14} borderRadius={4} />
              <View style={{ height: 14 }} />
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Skeleton width="30%" height={14} borderRadius={4} />
                <Skeleton width="25%" height={22} borderRadius={11} />
              </View>
            </View>
          ))}
        </View>
      ) : isError && !apiResponse ? (
        <ErrorState
          title="Failed to Load Bookings"
          subtitle={normalizeApiError(error).message}
          onButtonPress={() => refetch()}
          buttonTitle="Try Again"
        />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#375DFB"]} />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              title="No Bookings Found"
              subtitle="Schedule or search a trip to connect with verified drivers traveling your route."
              buttonTitle="Find a Ride"
              onButtonPress={() => navigation.navigate("TripsTab")}
            />
          }
          renderItem={({ item }) => {
            const badgeStyle = getStatusBadgeStyle(item.status);
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => setSelectedBooking(item)}
                activeOpacity={0.8}
              >
                {/* Route Title */}
                <Text style={styles.routeTitle}>{item.routeTitle}</Text>

                {/* Meta Row: Seats & Frequency */}
                <View style={styles.metaRow}>
                  <Ionicons name="people-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.metaText}>{item.seats} {item.seats > 1 ? "seats" : "seat"}</Text>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text style={styles.metaText}>{item.frequency}</Text>
                </View>

                {/* Bottom Date, Time & Status Badge Row */}
                <View style={styles.footerRow}>
                  <View style={styles.dateTimeCol}>
                    <View style={styles.iconTextItem}>
                      <Ionicons name="calendar-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.dateTimeText}>{item.date}</Text>
                    </View>
                    <View style={styles.iconTextItem}>
                      <Ionicons name="time-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.dateTimeText}>{item.time}</Text>
                    </View>
                  </View>

                  {/* Status Badge */}
                  <View
                    style={[
                      styles.badgePill,
                      { backgroundColor: badgeStyle.badgeBg, borderColor: badgeStyle.borderColor },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: badgeStyle.textColor }]}>{item.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Booking Details Full Modal */}
      <BookingDetailsViewScreen
        visible={!!selectedBooking}
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onExploreRides={() => {
          setSelectedBooking(null);
          navigation.navigate("HomeTab");
        }}
        onRateTrip={() => {
          setSelectedBooking(null);
          navigation.navigate("HomeTab");
        }}
        onRebookTrip={() => {
          setSelectedBooking(null);
          navigation.navigate("HomeTab");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: { padding: 4 },
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },
  rightSpacer: { width: 32 },



  listContent: { padding: 16, gap: 12, paddingBottom: 32 },

  skeletonContainer: { padding: 16, gap: 12 },
  skeletonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
  },
  routeTitle: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A", marginBottom: 8, lineHeight: 20 },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  metaText: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B" },
  dotSeparator: { marginHorizontal: 6, color: "#94A3B8" },

  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dateTimeCol: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconTextItem: { flexDirection: "row", alignItems: "center" },
  dateTimeText: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B" },

  badgePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: { fontFamily: "DM Sans Bold", fontSize: 11, fontWeight: "600" },
});

