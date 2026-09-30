import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppBottomSheet, AppLoader } from "../ui";
import {
  formatDriverName,
  formatVehicleSummary,
  useRequestBookingMutation,
} from "../../hooks/useRiderBookings";
import { normalizeApiError } from "../../utils/errorUtils";

const DAY_INDEX_MAP: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const formatToYmd = (dateStr?: string, defaultDaysOffset = 0): string => {
  if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
    return dateStr.trim();
  }
  const now = new Date();
  const d = dateStr ? new Date(dateStr) : now;
  const target = isNaN(d.getTime()) ? now : d;
  if (defaultDaysOffset !== 0) {
    target.setDate(target.getDate() + defaultDaysOffset);
  }
  return target.toISOString().split("T")[0];
};

export interface BookingFlowModalsProps {
  ride: any | null;
  onCloseDriverDetails: () => void;
  onConfirmBookingDetails: (details: any) => void;
}

export const BookingFlowModals: React.FC<BookingFlowModalsProps> = ({
  ride,
  onCloseDriverDetails,
  onConfirmBookingDetails,
}) => {
  const requestBookingMutation = useRequestBookingMutation();

  const data = ride?.raw || ride || {};
  const driver = (typeof data.driver === "object" ? data.driver : null) || {};
  const driverName =
    driver.full_name ||
    ride?.driverName ||
    formatDriverName(data.driver) ||
    "Assigned Driver";
  const driverAvatar =
    driver.profile_picture ||
    ride?.avatar ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";
  const driverRating = driver.rating ?? ride?.rating ?? 5;
  const vehicleDesc =
    formatVehicleSummary(data.vehicle || ride?.vehicle) ||
    "Vehicle Details Unavailable";

  const isRecurring =
    data.is_recurring !== undefined
      ? Boolean(data.is_recurring)
      : (ride?.tripType ? ride.tripType.toLowerCase().includes("recurring") : false);

  const tripFrequencyRaw =
    data.trip_frequency || ride?.tripType || (isRecurring ? "Custom" : "One-Time");
  const tripFrequencyDisplay = isRecurring
    ? `${tripFrequencyRaw.charAt(0).toUpperCase() + tripFrequencyRaw.slice(1)} • Recurring`
    : "One-Time Trip";

  const tripDate = data.trip_date || ride?.departureDate || "2026-09-04";
  const endDate = data.end_date || (isRecurring ? "2026-09-20" : tripDate);

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "06:00 AM";
    if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
    const parts = timeStr.split(":");
    if (parts.length >= 2) {
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
    }
    return timeStr;
  };

  const departureTime = formatTime(data.departure_time || ride?.estimatedArrival);
  const pickupLocation =
    data.pickup_location || ride?.startingPoint || "Pickup Location";
  const destination = data.destination || ride?.destination || "Destination";

  const maxAvailableSeats =
    typeof data.available_seats === "number"
      ? data.available_seats
      : typeof ride?.availableSeats === "number"
      ? ride.availableSeats
      : 4;

  const offeredDays: string[] =
    Array.isArray(data.recurrence_days) && data.recurrence_days.length > 0
      ? data.recurrence_days
      : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const [step, setStep] = useState<"driverDetails" | "bookingForm">("driverDetails");
  const [seats, setSeats] = useState(1);
  const [days, setDays] = useState<string[]>(
    Array.isArray(data.recurrence_days) && data.recurrence_days.length > 0
      ? data.recurrence_days
      : ["Monday", "Wednesday", "Friday"]
  );
  const [pickupPoint, setPickupPoint] = useState(pickupLocation);
  const [dropoffPoint, setDropoffPoint] = useState(destination);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    if (pickupLocation) setPickupPoint(pickupLocation);
    if (destination) setDropoffPoint(destination);
    if (Array.isArray(data.recurrence_days) && data.recurrence_days.length > 0) {
      setDays(data.recurrence_days);
    }
  }, [pickupLocation, destination, data.recurrence_days]);

  if (!ride) return null;

  const toggleDay = (day: string) => {
    if (days.includes(day)) {
      setDays(days.filter((d) => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const rawTripId = data.id || ride?.id || ride?.tripId || 14;
  const tripId = Number(rawTripId) || rawTripId;

  const formattedStartDate = formatToYmd(data.trip_date || ride?.departureDate);
  const formattedEndDate = isRecurring
    ? formatToYmd(data.end_date || endDate, 1)
    : formatToYmd(data.end_date || data.trip_date || ride?.departureDate, 1);

  const selectedDaysIndices = days
    .map((day) => DAY_INDEX_MAP[day])
    .filter((idx): idx is number => idx !== undefined);
  const tripDateObj = new Date(formattedStartDate);
  const dayOfWeek = isNaN(tripDateObj.getTime()) ? 2 : tripDateObj.getDay();
  const finalSelectedDays = selectedDaysIndices.length > 0 ? selectedDaysIndices : [dayOfWeek];

  const pickupStop =
    typeof data.pickup_stop === "number"
      ? data.pickup_stop
      : typeof data.pickup_point?.id === "number"
      ? data.pickup_point.id
      : undefined;

  const dropoffStop =
    typeof data.dropoff_stop === "number"
      ? data.dropoff_stop
      : typeof data.dropoff_point?.id === "number"
      ? data.dropoff_point.id
      : undefined;

  const handleContinue = async () => {
    setBookingError(null);
    let bookingResult: any = null;
    try {
      bookingResult = await requestBookingMutation.mutateAsync({
        tripId,
        payload: {
          seats_requested: seats,
          selected_days: finalSelectedDays,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          ...(pickupStop !== undefined ? { pickup_stop: pickupStop } : {}),
          ...(dropoffStop !== undefined ? { dropoff_stop: dropoffStop } : {}),
        },
      });
    } catch (err: any) {
      console.log("Request booking API error:", err);
      const msg = normalizeApiError(err).message;
      setBookingError(msg);
    }

    const rawPriceStr = data.price_per_seat || ride?.price || "0.00";
    const unitPrice = parseFloat(String(rawPriceStr).replace(/[^0-9.-]+/g, "")) || 0;
    const computedTotal = unitPrice * seats;
    const finalPrice = computedTotal > 0 ? `₦${computedTotal.toFixed(2)}` : (ride?.price || "₦0.00");

    onConfirmBookingDetails({
      ride,
      seats,
      days,
      pickupPoint,
      dropoffPoint,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      departureTime,
      driverName,
      driverAvatar,
      driverRating,
      vehicle: vehicleDesc,
      frequency: tripFrequencyDisplay,
      isRecurring,
      tripType: isRecurring ? "Recurring Trip" : "One-Time Trip",
      price: finalPrice,
      pricePerSeat: unitPrice,
      availableSeats: maxAvailableSeats,
      bookingId: bookingResult?.id,
      bookingStatus: bookingResult?.status || "pending",
      priceAtBooking: bookingResult?.price_at_booking,
    });
  };

  return (
    <>
      {/* 1. Driver Details Sheet */}
      <AppBottomSheet
        visible={step === "driverDetails"}
        onClose={onCloseDriverDetails}
        showCloseButton={false}
        maxHeight="90%"
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.driverDetailsScrollContent}>
          {/* Header */}
          <View style={styles.sheetHeaderRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.driverTitle}>{driverName}</Text>
              <Ionicons name="checkmark-circle" size={18} color="#305CFF" style={{ marginLeft: 6 }} />
            </View>
            <TouchableOpacity onPress={onCloseDriverDetails} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Driver Photo & Reliability Card */}
          <View style={styles.driverPhotoContainer}>
            <Image
              source={{ uri: driverAvatar }}
              style={styles.driverPhoto}
            />

            <View style={styles.driverInfoCol}>
              {/* Report Pill Badge */}
              <TouchableOpacity style={styles.reportPill} activeOpacity={0.7}>
                <Text style={styles.reportText}>Report</Text>
                <Ionicons name="flag-outline" size={13} color="#EF4444" style={{ marginLeft: 4 }} />
              </TouchableOpacity>

              {/* Stats Column */}
              <View style={styles.statsColumn}>
                <Text style={styles.statLine}>Member since 2026</Text>
                <Text style={styles.statLine}>Verified Driver</Text>
                <Text style={styles.statLine}>100% Booking Reliability</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color="#305CFF" />
                  <Text style={styles.ratingVal}>{driverRating}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Trip Frequency & End Date Key-Value Rows */}
          <View style={styles.tripMetaContainer}>
            <View style={styles.metaRowItem}>
              <Text style={styles.metaLabel}>Trip Frequency</Text>
              <Text style={styles.metaValue}>{tripFrequencyDisplay}</Text>
            </View>
            <View style={[styles.metaRowItem, { marginTop: 14 }]}>
              <Text style={styles.metaLabel}>Departure Time</Text>
              <Text style={styles.metaValue}>{departureTime}</Text>
            </View>
            <View style={[styles.metaRowItem, { marginTop: 14 }]}>
              <Text style={styles.metaLabel}>Start Date</Text>
              <Text style={styles.metaValue}>{tripDate}</Text>
            </View>
            {isRecurring ? (
              <View style={[styles.metaRowItem, { marginTop: 14 }]}>
                <Text style={styles.metaLabel}>End Date</Text>
                <Text style={styles.metaValue}>{endDate}</Text>
              </View>
            ) : null}
          </View>

          {/* Route Section */}
          <View style={styles.sectionHeaderStrip}>
            <Text style={styles.sectionHeaderText}>Route</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 8 }}>
              <Ionicons name="location" size={16} color="#375DFB" style={{ marginTop: 2, marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8" }}>Pick-up Location</Text>
                <Text style={{ fontFamily: "DM Sans Bold", fontSize: 13, color: "#0F172A", marginTop: 2 }}>{pickupLocation}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Ionicons name="flag" size={16} color="#EF4444" style={{ marginTop: 2, marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8" }}>Destination</Text>
                <Text style={{ fontFamily: "DM Sans Bold", fontSize: 13, color: "#0F172A", marginTop: 2 }}>{destination}</Text>
              </View>
            </View>
          </View>

          {/* Vehicle Description Section */}
          <View style={styles.sectionHeaderStrip}>
            <Text style={styles.sectionHeaderText}>Vehicle Description</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.vehicleDescText}>{vehicleDesc}</Text>
          </View>

          {/* Driver Preferences Section */}
          <View style={styles.sectionHeaderStrip}>
            <Text style={styles.sectionHeaderText}>Driver Preferences</Text>
          </View>
          <View style={styles.sectionContent}>
            {["No Smoking", "Air Conditioned", "No Pets", "Luggage Allowed"].map((pref, i) => (
              <View key={i} style={styles.prefRow}>
                <Text style={styles.prefText}>{pref}</Text>
              </View>
            ))}
          </View>

          {/* Book Ride CTA Button */}
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep("bookingForm")} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Book Ride</Text>
          </TouchableOpacity>
        </ScrollView>
      </AppBottomSheet>

      {/* 2. Booking Details Form Sheet */}
      <AppBottomSheet
        visible={step === "bookingForm"}
        onClose={() => setStep("driverDetails")}
        title="Booking Details"
        maxHeight="90%"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Select Number of Seats */}
          <Text style={styles.formLabel}>Select Number of Seats</Text>
          <View style={styles.seatsCounterRow}>
            <TouchableOpacity style={styles.counterBtn} onPress={() => seats > 1 && setSeats(seats - 1)}>
              <Ionicons name="remove" size={18} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.seatsCountText}>{seats}</Text>
            <TouchableOpacity
              style={[styles.counterBtnBlue, seats >= maxAvailableSeats && { opacity: 0.5 }]}
              onPress={() => seats < maxAvailableSeats && setSeats(seats + 1)}
              disabled={seats >= maxAvailableSeats}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.seatsLeftText}>{maxAvailableSeats} available seats for booking</Text>

          {/* Trip Frequency */}
          {isRecurring ? (
            <>
              <Text style={[styles.formLabel, { marginTop: 16 }]}>Trip Frequency ({tripFrequencyRaw})</Text>
              <View style={styles.frequencyRow}>
                {offeredDays.map((day) => {
                  const isSelected = days.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      style={[styles.freqChip, isSelected && styles.freqChipActive]}
                      onPress={() => toggleDay(day)}
                    >
                      <Ionicons
                        name={isSelected ? "checkbox" : "square-outline"}
                        size={16}
                        color={isSelected ? "#375DFB" : "#94A3B8"}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={[styles.freqText, isSelected && styles.freqTextActive]}>{day.slice(0, 3)}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : null}

          {/* Start Date & End Date */}
          <Text style={[styles.formLabel, { marginTop: 16 }]}>Start Date</Text>
          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyText}>{tripDate}</Text>
            <Ionicons name="calendar-outline" size={18} color="#94A3B8" />
          </View>

          {isRecurring ? (
            <>
              <Text style={[styles.formLabel, { marginTop: 12 }]}>End Date</Text>
              <View style={styles.readOnlyInput}>
                <Text style={styles.readOnlyText}>{endDate}</Text>
                <Ionicons name="calendar-outline" size={18} color="#94A3B8" />
              </View>
            </>
          ) : null}

          {/* Closest Pick Up Point Radios */}
          <Text style={[styles.formLabel, { marginTop: 16 }]}>Pick Up Point</Text>
          {[pickupLocation, "Nearest Major Junction"].map((point) => {
            const isSelected = pickupPoint === point;
            return (
              <TouchableOpacity
                key={point}
                style={[styles.radioCard, isSelected && styles.radioCardSelected]}
                onPress={() => setPickupPoint(point)}
              >
                <Ionicons
                  name={isSelected ? "checkbox" : "square-outline"}
                  size={18}
                  color={isSelected ? "#375DFB" : "#94A3B8"}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.radioText} numberOfLines={2}>{point}</Text>
              </TouchableOpacity>
            );
          })}

          {bookingError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="information-circle-outline" size={16} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.errorBannerText}>{bookingError}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              { marginTop: 24, marginBottom: 20 },
              requestBookingMutation.isPending && { opacity: 0.7 },
            ]}
            onPress={handleContinue}
            disabled={requestBookingMutation.isPending}
            activeOpacity={0.85}
          >
            {requestBookingMutation.isPending ? (
              <AppLoader size={20} color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryBtnText}>Continue</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </AppBottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  driverDetailsScrollContent: {
    paddingBottom: 24,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  driverTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  cancelText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#94A3B8",
  },

  driverPhotoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  driverPhoto: {
    width: 106,
    height: 106,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
  },
  driverInfoCol: {
    flex: 1,
    marginLeft: 16,
  },
  reportPill: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  reportText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#EF4444",
  },
  statsColumn: {
    gap: 3,
  },
  statLine: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#0F172A",
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingVal: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
    marginLeft: 6,
  },

  tripMetaContainer: {
    paddingVertical: 14,
    marginBottom: 6,
  },
  metaRowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaLabel: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#94A3B8",
  },
  metaValue: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#0F172A",
  },

  sectionHeaderStrip: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },
  sectionHeaderText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#94A3B8",
  },
  sectionContent: {
    paddingVertical: 12,
  },
  vehicleDescText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#0F172A",
  },
  prefRow: {
    paddingVertical: 5,
  },
  prefText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#0F172A",
  },

  primaryBtn: {
    backgroundColor: "#305CFF",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  primaryBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  /* Form Styles */
  formLabel: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#64748B", marginBottom: 8 },
  seatsCounterRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderRadius: 12, padding: 4 },
  counterBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0" },
  counterBtnBlue: { width: 36, height: 36, borderRadius: 8, backgroundColor: "#305CFF", justifyContent: "center", alignItems: "center" },
  seatsCountText: { flex: 1, textAlign: "center", fontFamily: "DM Sans Bold", fontSize: 15, color: "#0F172A" },
  seatsLeftText: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8", alignSelf: "flex-end", marginTop: 10 },

  frequencyRow: { flexDirection: "row", gap: 10 },
  freqChip: { flex: 1, flexDirection: "row", alignItems: "center", borderRadius: 12, padding: 12, backgroundColor: "#FFFFFF" },
  freqChipActive: { backgroundColor: "#EFF6FF", borderColor: "#BEDBFF" },
  freqText: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B" },
  freqTextActive: { fontFamily: "DM Sans Bold", color: "#0F172A" },

  readOnlyInput: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 14, height: 48, backgroundColor: "#FFFFFF" },
  readOnlyText: { fontFamily: "DM Sans", fontSize: 14, color: "#0F172A" },

  radioCard: { flexDirection: "row", alignItems: "center", borderRadius: 12, padding: 14, marginBottom: 8, backgroundColor: "#F8FAFC" },
  radioCardSelected: {
    backgroundColor: "#EFF6FF"
  },
  radioText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#0F172A" },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 16,
  },
  errorBannerText: {
    flex: 1,
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#B91C1C",
    lineHeight: 16,
  },
});
