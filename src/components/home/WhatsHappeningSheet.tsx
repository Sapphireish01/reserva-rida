import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Skeleton } from "../ui";

export interface WhatsHappeningSheetProps {
  onSelectRoute?: (route: any) => void;
  onFindRide?: (route: any) => void;
  onJoinCommunity?: (community: any) => void;
  onSeeAllUpcoming?: () => void;
  onSeeAllSaved?: () => void;
  onSeeAllCommunities?: () => void;
  onSelectBooking?: (booking: any) => void;
}

const formatTimeToAMPM = (timeStr?: string): string => {
  if (!timeStr) return "08:00 AM";
  const trimmed = timeStr.trim();
  if (trimmed.toUpperCase().includes("AM") || trimmed.toUpperCase().includes("PM")) {
    return trimmed;
  }
  const parts = trimmed.split(":");
  if (parts.length >= 2) {
    const hour = parseInt(parts[0], 10);
    const minute = parts[1];
    if (!isNaN(hour)) {
      const ampm = hour >= 12 ? "PM" : "AM";
      const h12 = hour % 12 || 12;
      return `${String(h12).padStart(2, "0")}:${minute} ${ampm}`;
    }
  }
  return trimmed;
};

const UpcomingCardSkeleton = () => (
  <View style={styles.upcomingCard}>
    <View style={styles.driverRow}>
      <Skeleton width={44} height={44} borderRadius={22} style={styles.driverAvatar} />
      <View style={styles.driverMeta}>
        <Skeleton width={100} height={14} borderRadius={4} style={{ marginBottom: 6 }} />
        <Skeleton width={140} height={10} borderRadius={4} />
      </View>
      <Skeleton width={36} height={18} borderRadius={6} />
    </View>
    <View style={styles.routeBox}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
        <View style={styles.dotOutline} />
        <Skeleton width={70} height={10} borderRadius={4} style={{ marginRight: 8 }} />
        <Skeleton width={110} height={12} borderRadius={4} style={{ marginLeft: "auto" }} />
      </View>
      <View style={styles.connectorLine} />
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
        <View style={styles.dotSolid} />
        <Skeleton width={70} height={10} borderRadius={4} style={{ marginRight: 8 }} />
        <Skeleton width={110} height={12} borderRadius={4} style={{ marginLeft: "auto" }} />
      </View>
    </View>
    <View style={styles.timeDetailsGrid}>
      <View style={styles.timeCard}>
        <Skeleton width={60} height={10} borderRadius={4} style={{ marginBottom: 4 }} />
        <Skeleton width={80} height={12} borderRadius={4} />
      </View>
      <View style={styles.timeCard}>
        <Skeleton width={60} height={10} borderRadius={4} style={{ marginBottom: 4 }} />
        <Skeleton width={80} height={12} borderRadius={4} />
      </View>
    </View>
  </View>
);

const SAVED_ROUTES = [
  {
    id: "sr-1",
    driveTime: "18 mins drive",
    pickup: "Frebson Fitness Gym",
    destination: "42, Montgomery Road Yaba",
  },
  {
    id: "sr-2",
    driveTime: "35 mins drive",
    pickup: "Ikeja Along Bus Stop",
    destination: "Victoria Island",
  },
];

const LANDMARKS = [
  {
    id: "lm-1",
    title: "Ikeja Along Bus Stop",
    time: "5min",
    distance: "0.2miles",
    subtitle: "Off International Airport Road, adjacent to Globus bank",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "lm-2",
    title: "CMS Terminal",
    time: "12min",
    distance: "0.8miles",
    subtitle: "Off Cathedral Church Marina, Lagos Island",
    image: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=400&auto=format&fit=crop&q=80",
  },
];

const POPULAR_ROUTES = [
  {
    id: "pr-1",
    badge: "Weekdays",
    tripsAvailable: "18 Trips Available",
    from: "Ikeja Along Bus Stop",
    to: "Victoria Island",
    eta: "40min",
    distance: "10km",
  },
  {
    id: "pr-2",
    badge: "Weekdays",
    tripsAvailable: "12 Trips Available",
    from: "Yaba Tech Gate",
    to: "Lekki Phase 1",
    eta: "25min",
    distance: "8km",
  },
];

const TRIP_RECOMMENDATIONS = [
  {
    id: "tr-1",
    reason: "Since you frequently travel to Victoria Island",
    driverName: "Prosper Edward",
    isVerified: true,
    rating: 4.5,
    vehicle: "Honda Accord • Black • KTU345GX",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    pickup: "Frebson Fitness Gym",
    destination: "42, Montgomery Road Yaba",
    departureTime: "10:30AM",
    arrivalTime: "11:30AM",
  },
];

const COMMUNITIES = [
  {
    id: "cm-1",
    title: "Women Only",
    from: "Ikeja",
    to: "Victoria Island",
    subtitle: "For frequent travelers and ride-sharing enthusiasts",
    members: "500 members",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "cm-2",
    title: "UNILAG Students",
    from: "Yaba",
    to: "Akoka",
    subtitle: "Daily campus shuttles and shared rides for students",
    members: "1.8k members",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80",
  },
];

import { RiderBookingApiItem } from "../../api";
import {
  formatDriverName,
  formatVehicleSummary,
  usePopularRoutesQuery,
  useRiderBookingsQuery,
  useSavedRoutesQuery,
} from "../../hooks/useRiderBookings";

export const WhatsHappeningSheet: React.FC<WhatsHappeningSheetProps> = ({
  onSelectRoute,
  onFindRide,
  onJoinCommunity,
  onSeeAllUpcoming,
  onSeeAllSaved,
  onSeeAllCommunities,
  onSelectBooking,
}) => {
  const { data: savedRoutesData } = useSavedRoutesQuery();
  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    isError: isErrorBookings,
  } = useRiderBookingsQuery("confirmed");
  const { data: popularRoutesData } = usePopularRoutesQuery();

  const savedRoutes = (savedRoutesData?.data && savedRoutesData.data.length > 0)
    ? savedRoutesData.data.map((r) => ({
      id: r.id,
      driveTime: "Saved Route",
      pickup: r.pickup_location,
      destination: r.destination,
    }))
    : SAVED_ROUTES;

  const popularRoutes = (popularRoutesData && popularRoutesData.length > 0)
    ? popularRoutesData.map((pr, index) => ({
      id: `pr-${index}`,
      badge: pr.schedule_label || "Schedule",
      tripsAvailable: `${pr.trips_available} ${pr.trips_available === 1 ? "Trip" : "Trips"} Available`,
      from: pr.pickup_location,
      to: pr.destination,
      eta: pr.eta_minutes != null ? `${pr.eta_minutes}min` : null,
      distance: pr.distance_km != null ? `${pr.distance_km}km` : "Direct route",
    }))
    : POPULAR_ROUTES;

  const rawBookings: RiderBookingApiItem[] = React.useMemo(() => {
    if (!bookingsData) return [];
    if (Array.isArray(bookingsData)) return bookingsData;
    if (Array.isArray(bookingsData.results)) return bookingsData.results;
    return [];
  }, [bookingsData]);

  const upcomingTrips = React.useMemo(() => {
    return rawBookings.map((b) => ({
      raw: b,
      id: String(b.id),
      driverName: formatDriverName(b.driver),
      isVerified: true,
      rating: typeof b.driver === "object" && b.driver?.rating ? b.driver.rating : 5,
      vehicle: formatVehicleSummary(b.vehicle),
      avatar:
        (typeof b.driver === "object" && b.driver?.profile_picture) ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      pickup: b.pickup_location || b.pickup_point?.name || "Pickup location",
      destination: b.destination || b.dropoff_point?.name || "Destination",
      departureDate: b.trip_date || b.start_date || "Upcoming",
      departureTime: formatTimeToAMPM(b.departure_time),
    }));
  }, [rawBookings]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Whats Happening Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Whats Happening?</Text>
        <Text style={styles.sparkleEmoji}> ✨</Text>
      </View>

      {/* 1. Upcoming Trips */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Trips</Text>
        <TouchableOpacity onPress={onSeeAllUpcoming}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {isLoadingBookings ? (
          <>
            <UpcomingCardSkeleton />
            <UpcomingCardSkeleton />
          </>
        ) : upcomingTrips.length === 0 ? (
          <View style={styles.emptyUpcomingCard}>
            <View style={styles.emptyIconBadge}>
              <Ionicons name="calendar-outline" size={22} color="#375DFB" />
            </View>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.emptyUpcomingTitle}>No upcoming trips</Text>
              <Text style={styles.emptyUpcomingSubtitle} numberOfLines={2}>
                Confirmed trips will show here once booked.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.emptyActionBtn}
              onPress={() => onFindRide && onFindRide(null)}
              activeOpacity={0.7}
            >
              <Text style={styles.emptyActionBtnText}>Find Ride</Text>
            </TouchableOpacity>
          </View>
        ) : (
          upcomingTrips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={styles.upcomingCard}
              activeOpacity={0.85}
              onPress={() => (onSelectBooking ? onSelectBooking(trip.raw) : onSeeAllUpcoming?.())}
            >
              <View style={styles.driverRow}>
                <Image source={{ uri: trip.avatar }} style={styles.driverAvatar} />
                <View style={styles.driverMeta}>
                  <View style={styles.nameBadgeRow}>
                    <Text style={styles.driverName}>{trip.driverName}</Text>
                    {trip.isVerified && <Ionicons name="checkmark-circle" size={14} color="#375DFB" style={{ marginLeft: 4 }} />}
                  </View>
                  <Text style={styles.vehicleText} numberOfLines={1}>{trip.vehicle}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingValue}>{trip.rating}</Text>
                  <Ionicons name="star" size={12} color="#375DFB" style={{ marginLeft: 2 }} />
                </View>
              </View>

              <View style={styles.routeBox}>
                <View style={styles.pointRow}>
                  <View style={styles.dotOutline} />
                  <Text style={styles.pointLabel}>Pick up point</Text>
                  <Text style={styles.pointValue} numberOfLines={1}>{trip.pickup}</Text>
                </View>

                <View style={styles.connectorLine} />

                <View style={styles.pointRow}>
                  <View style={styles.dotSolid} />
                  <Text style={styles.pointLabel}>Destination</Text>
                  <Text style={styles.pointValue} numberOfLines={1}>{trip.destination}</Text>
                </View>
              </View>

              <View style={styles.timeDetailsGrid}>
                <View style={styles.timeCard}>
                  <Text style={styles.timeCardLabel}>Departure Date</Text>
                  <Text style={styles.timeCardValue} numberOfLines={1}>{trip.departureDate}</Text>
                </View>
                <View style={styles.timeCard}>
                  <Text style={styles.timeCardLabel}>Departure Time</Text>
                  <Text style={styles.timeCardValue} numberOfLines={1}>{trip.departureTime}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* 2. Saved Routes */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Saved Routes</Text>
        <TouchableOpacity onPress={onSeeAllSaved}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {savedRoutes.map((route) => (
          <View key={route.id} style={styles.savedRouteCard}>
            <View style={styles.savedHeader}>
              <Text style={styles.driveTimeText}>{route.driveTime}</Text>
              <Ionicons name="bookmark-outline" size={18} color="#64748B" />
            </View>

            <View style={styles.savedPointsRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.savedLabel}>Pick up point</Text>
                <Text style={styles.savedValue} numberOfLines={2}>{route.pickup}</Text>
              </View>

              <View style={styles.dashedLine} />

              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={styles.savedLabel}>Destination</Text>
                <Text style={[styles.savedValue, { textAlign: "right" }]} numberOfLines={2}>{route.destination}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.findRideBtn} onPress={() => onFindRide && onFindRide(route)}>
              <Text style={styles.findRideText}>Find Ride</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* 3. Landmarks Near You */}
      <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12, paddingHorizontal: 16 }]}>Landmarks Near You</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {LANDMARKS.map((lm) => (
          <View key={lm.id} style={styles.landmarkCard}>
            <Image source={{ uri: lm.image }} style={styles.landmarkImage} />
            <View style={styles.landmarkContent}>
              <Text style={styles.landmarkTitle}>{lm.title}</Text>
              <View style={styles.landmarkMetaRow}>
                <Ionicons name="walk-outline" size={13} color="#64748B" style={{ marginRight: 2 }} />
                <Text style={styles.landmarkMeta}>{lm.time} • {lm.distance}</Text>
              </View>
              <Text style={styles.landmarkSubtitle} numberOfLines={1}>{lm.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 4. Popular Routes */}
      <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12, paddingHorizontal: 16 }]}>Popular Routes</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {popularRoutes.map((pr) => (
          <View key={pr.id} style={styles.popularCard}>
            <View style={styles.popularBadgeRow}>
              <View style={styles.weekdayBadge}>
                <Ionicons name="calendar-outline" size={12} color="#375DFB" style={{ marginRight: 4 }} />
                <Text style={styles.weekdayText}>{pr.badge}</Text>
              </View>
              <Text style={styles.availableText}>{pr.tripsAvailable}</Text>
            </View>

            {((pr.from?.length || 0) + (pr.to?.length || 0)) > 40 ? (
              <View style={styles.popularRouteColumn}>
                <Text style={styles.popularRouteText} numberOfLines={1}>
                  {pr.from}
                </Text>
                <View style={styles.popularRouteToRow}>
                  <Ionicons name="arrow-forward-outline" size={14} color="#9a9ca3ff" style={{ marginRight: 4 }} />
                  <Text style={[styles.popularRouteText, { flex: 1 }]} numberOfLines={1}>
                    {pr.to}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.popularRouteLine}>
                <Text style={styles.popularRouteText} numberOfLines={1}>{pr.from}</Text>
                <Ionicons name="arrow-forward-outline" size={14} color="#64748B" style={{ marginHorizontal: 6 }} />
                <Text style={styles.popularRouteText} numberOfLines={1}>{pr.to}</Text>
              </View>
            )}

            <View style={styles.popularFooter}>
              <Ionicons name="car-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
              <Text style={styles.popularFooterText}>
                {pr.eta ? `ETA ${pr.eta} • ` : ""}{pr.distance}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 5. Trip Recommendations */}
      <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12, paddingHorizontal: 16 }]}>Trip Recommendations</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {TRIP_RECOMMENDATIONS.map((tr) => (
          <View key={tr.id} style={styles.upcomingCard}>
            <Text style={styles.recommendReason}>{tr.reason}</Text>
            <View style={[styles.driverRow, { marginTop: 8 }]}>
              <Image source={{ uri: tr.avatar }} style={styles.driverAvatar} />
              <View style={styles.driverMeta}>
                <View style={styles.nameBadgeRow}>
                  <Text style={styles.driverName}>{tr.driverName}</Text>
                  {tr.isVerified && <Ionicons name="checkmark-circle" size={14} color="#375DFB" style={{ marginLeft: 4 }} />}
                </View>
                <Text style={styles.vehicleText} numberOfLines={1}>{tr.vehicle}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingValue}>{tr.rating}</Text>
                <Ionicons name="star" size={12} color="#375DFB" style={{ marginLeft: 2 }} />
              </View>
            </View>

            <View style={styles.routeBox}>
              <View style={styles.pointRow}>
                <View style={styles.dotOutline} />
                <Text style={styles.pointLabel}>Pick up point</Text>
                <Text style={styles.pointValue}>{tr.pickup}</Text>
              </View>
              <View style={styles.connectorLine} />
              <View style={styles.pointRow}>
                <View style={styles.dotSolid} />
                <Text style={styles.pointLabel}>Destination</Text>
                <Text style={styles.pointValue}>{tr.destination}</Text>
              </View>
            </View>

            <View style={styles.timeDetailsGrid}>
              <View style={styles.timeCard}>
                <Text style={styles.timeCardLabel}>Departure Time</Text>
                <Text style={styles.timeCardValue}>{tr.departureTime}</Text>
              </View>
              <View style={styles.timeCard}>
                <Text style={styles.timeCardLabel}>Arrival Time (ETA)</Text>
                <Text style={styles.timeCardValue}>{tr.arrivalTime}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 6. Communities */}
      {/* <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Communities</Text>
        <TouchableOpacity onPress={onSeeAllCommunities}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.horizontalList, { marginBottom: 30 }]}>
        {COMMUNITIES.map((cm) => (
          <View key={cm.id} style={styles.communityCard}>
            <Image source={{ uri: cm.image }} style={styles.communityImage} />
            <View style={styles.communityContent}>
              <Text style={styles.communityTitle}>{cm.title}</Text>
              <View style={styles.communityRouteRow}>
                <Text style={styles.communityRouteText}>{cm.from}</Text>
                <Ionicons name="arrow-forward-outline" size={12} color="#64748B" style={{ marginHorizontal: 4 }} />
                <Text style={styles.communityRouteText}>{cm.to}</Text>
              </View>
              <Text style={styles.communitySubtitle}>{cm.subtitle}</Text>
              <View style={styles.communityMetaRow}>
                <Ionicons name="people-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
                <Text style={styles.communityMembersText}>{cm.members}</Text>
              </View>

              <TouchableOpacity style={styles.joinBtn} onPress={() => onJoinCommunity && onJoinCommunity(cm)}>
                <Text style={styles.joinBtnText}>Join Community</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 4, marginBottom: 20 },
  title: { fontFamily: "DM Sans Bold", fontSize: 20, fontWeight: "700", color: "#0F172A" },
  sparkleEmoji: { fontSize: 18 },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontFamily: "DM Sans Bold", fontSize: 16, fontWeight: "700", color: "#64748B" },
  seeAllText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#64748B", fontWeight: "600" },

  horizontalList: { paddingHorizontal: 16, gap: 14 },

  /* Card 1: Upcoming Trips */
  upcomingCard: {
    width: 310,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  recommendReason: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B" },
  driverRow: { flexDirection: "row", alignItems: "center" },
  driverAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E2E8F0" },
  driverMeta: { flex: 1, marginLeft: 10, marginRight: 6 },
  nameBadgeRow: { flexDirection: "row", alignItems: "center" },
  driverName: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "700", color: "#0F172A" },
  vehicleText: { fontFamily: "DM Sans", fontSize: 11, color: "#64748B", marginTop: 2 },
  ratingBadge: { flexDirection: "row", alignItems: "center" },
  ratingValue: { fontFamily: "DM Sans Bold", fontSize: 13, fontWeight: "700", color: "#0F172A" },

  routeBox: { marginVertical: 12 },
  pointRow: { flexDirection: "row", alignItems: "center" },
  dotOutline: { width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: "#64748B", marginRight: 8 },
  dotSolid: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#64748B", marginRight: 8 },
  pointLabel: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8", marginRight: 6 },
  pointValue: { fontFamily: "DM Sans Bold", fontSize: 12, fontWeight: "600", color: "#0F172A", marginLeft: "auto" },
  connectorLine: { width: 1, height: 12, backgroundColor: "#CBD5E1", marginLeft: 3.5, marginVertical: 2 },

  timeDetailsGrid: { flexDirection: "row", gap: 10 },
  timeCard: { flex: 1, backgroundColor: "#F8FAFC", borderRadius: 10, padding: 10 },
  timeCardLabel: { fontFamily: "DM Sans", fontSize: 10, color: "#94A3B8" },
  timeCardValue: { fontFamily: "DM Sans Bold", fontSize: 12, fontWeight: "700", color: "#0F172A", marginTop: 2 },

  /* Empty Upcoming Card */
  emptyUpcomingCard: {
    width: 310,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
  },
  emptyIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emptyUpcomingTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  emptyUpcomingSubtitle: {
    fontFamily: "DM Sans",
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  emptyActionBtn: {
    backgroundColor: "#375DFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  emptyActionBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* Card 2: Saved Routes */
  savedRouteCard: {
    width: 290,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  savedHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  driveTimeText: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B" },
  savedPointsRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  savedLabel: { fontFamily: "DM Sans", fontSize: 10, color: "#94A3B8" },
  savedValue: { fontFamily: "DM Sans Bold", fontSize: 12, fontWeight: "700", color: "#0F172A", marginTop: 2 },
  dashedLine: { flex: 1, height: 1, borderWidth: 1, borderColor: "#CBD5E1", borderStyle: "dashed", marginHorizontal: 8 },
  findRideBtn: { backgroundColor: "#375DFB", borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  findRideText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#FFFFFF", fontWeight: "700" },

  /* Card 3: Landmarks */
  landmarkCard: {
    width: 260,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  landmarkImage: { width: "100%", height: 120, backgroundColor: "#E2E8F0" },
  landmarkContent: { padding: 12 },
  landmarkTitle: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "700", color: "#0F172A" },
  landmarkMetaRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  landmarkMeta: { fontFamily: "DM Sans", fontSize: 11, color: "#64748B" },
  landmarkSubtitle: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8" },

  /* Card 4: Popular Routes */
  popularCard: {
    width: 260,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  popularBadgeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  weekdayBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#EFF6FF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  weekdayText: { fontFamily: "DM Sans Bold", fontSize: 11, color: "#375DFB" },
  availableText: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8" },
  popularRouteLine: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  popularRouteColumn: { marginBottom: 10, gap: 4 },
  popularRouteToRow: { flexDirection: "row", alignItems: "center" },
  popularRouteText: { fontFamily: "DM Sans Bold", fontSize: 13, fontWeight: "700", color: "#0F172A" },
  popularFooter: { flexDirection: "row", alignItems: "center" },
  popularFooterText: { fontFamily: "DM Sans", fontSize: 11, color: "#64748B" },

  /* Card 6: Communities */
  communityCard: {
    width: 270,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  communityImage: { width: "100%", height: 125, backgroundColor: "#E2E8F0" },
  communityContent: { padding: 12 },
  communityTitle: { fontFamily: "DM Sans Bold", fontSize: 14, fontWeight: "700", color: "#0F172A" },
  communityRouteRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  communityRouteText: { fontFamily: "DM Sans Bold", fontSize: 12, color: "#0F172A" },
  communitySubtitle: { fontFamily: "DM Sans", fontSize: 11, color: "#64748B", marginBottom: 8 },
  communityMetaRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  communityMembersText: { fontFamily: "DM Sans", fontSize: 11, color: "#64748B" },
  joinBtn: { backgroundColor: "#EFF6FF", borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  joinBtnText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#375DFB", fontWeight: "700" },
});
