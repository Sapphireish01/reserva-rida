import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookingsService,
  DiscoverTripItem,
  DriverSummary,
  PopularRouteItem,
  RateTripPayload,
  RequestBookingPayload,
  RiderBookingApiItem,
  SaveRoutePayload,
  SearchTripsPayload,
  tripsService,
  VehicleSummary,
} from "../api";

// ================= NORMALIZATION HELPERS =================

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const formatRecurrenceDays = (days?: number[] | string[], frequency?: string): string => {
  const freqLower = (frequency || "").toLowerCase();
  if (freqLower === "daily") return "Daily";
  if (!days || days.length === 0) {
    if (freqLower) return freqLower.charAt(0).toUpperCase() + freqLower.slice(1);
    return "One-Time";
  }

  if (days.length === 7) return "Daily";

  if (typeof days[0] === "number") {
    const names = (days as number[]).map((d) => DAY_NAMES[d] || `Day ${d}`);
    const freqSuffix = frequency ? ` • ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}` : "";
    return `${names.join(", ")}${freqSuffix}`;
  }

  // Handle array of strings like ["Monday", "Tuesday", ...]
  const shortNames = (days as string[]).map((d) => d.slice(0, 3));
  const freqSuffix = frequency ? ` • ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}` : "";
  return `${shortNames.join(", ")}${freqSuffix}`;
};

export const formatPrice = (price?: string | number | null, currency = "₦"): string => {
  if (price === undefined || price === null || price === "") return `${currency}0.00`;
  const num = typeof price === "number" ? price : parseFloat(String(price).replace(/[^0-9.-]+/g, ""));
  if (isNaN(num)) return String(price);
  return `${currency}${num.toFixed(2)}`;
};

export const formatVehicleSummary = (vehicle?: VehicleSummary | number | string): string => {
  if (!vehicle) return "Vehicle Details Unavailable";
  if (typeof vehicle === "number") return `Vehicle #${vehicle}`;
  if (typeof vehicle === "string") return vehicle;
  const parts = [
    `${vehicle.brand || ""} ${vehicle.model || ""}`.trim(),
    vehicle.colour,
    vehicle.plate_number,
  ].filter(Boolean);
  return parts.join(" • ") || "Vehicle Details Unavailable";
};

export const formatDriverName = (driver?: DriverSummary | number | string): string => {
  if (!driver) return "Assigned Driver";
  if (typeof driver === "object" && driver.full_name) return driver.full_name;
  if (typeof driver === "number") return `Driver #${driver}`;
  return String(driver);
};

export const mapBackendBookingStatus = (
  status?: string,
  tripStatus?: string
): "Ongoing" | "Upcoming" | "Pending" | "Completed" | "Cancelled" => {
  const s = (status || "").toLowerCase();
  const ts = (tripStatus || "").toLowerCase();

  if (s === "cancelled") return "Cancelled";
  if (ts === "ongoing" || s === "ongoing") return "Ongoing";
  if (s === "completed") return "Completed";
  if (s === "scheduled" || s === "confirmed" || s === "approved") return "Upcoming";
  return "Pending";
};

// ================= HOOKS =================

/**
 * Hook 1: Fetch Rider Bookings (with optional status filter)
 */
export const useRiderBookingsQuery = (status?: string) => {
  return useQuery({
    queryKey: ["rider-bookings", status || "all"],
    queryFn: () => bookingsService.getRiderBookings(status),
    staleTime: 1000 * 30, // 30 seconds
  });
};

/**
 * Hook 2: Cancel Booking Mutation
 */
export const useCancelBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => bookingsService.cancelRiderBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rider-bookings"] });
    },
  });
};

/**
 * Hook 3: Check-in Booking Mutation
 */
export const useCheckInBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, occurrenceDate }: { bookingId: string; occurrenceDate: string }) =>
      bookingsService.checkInRiderBooking(bookingId, occurrenceDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rider-bookings"] });
    },
  });
};

/**
 * Hook 4: Request Booking (Book Ride) Mutation
 */
export const useRequestBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, payload }: { tripId: number | string; payload: RequestBookingPayload }) =>
      bookingsService.requestRiderBooking(tripId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rider-bookings"] });
    },
  });
};

/**
 * Hook 5: Fetch Rider Trip & Driver Details
 */
export const useRiderTripDetailsQuery = (tripId: number | string | null | undefined) => {
  return useQuery({
    queryKey: ["rider-trip-details", tripId],
    queryFn: () => bookingsService.getRiderTripDetails(tripId!),
    enabled: !!tripId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook 6: Search Rider Trips
 */
export const useSearchTripsMutation = () => {
  return useMutation({
    mutationFn: (payload: SearchTripsPayload) => tripsService.searchRiderTrips(payload),
  });
};

/**
 * Hook 7: Rate Trip Mutation
 */
export const useRateTripMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, payload }: { tripId: number | string; payload: RateTripPayload }) =>
      bookingsService.rateRiderTrip(tripId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rider-bookings"] });
    },
  });
};

/**
 * Hook 8: Raise Dispute Mutation
 */
export const useRaiseDisputeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tripId,
      bookingId,
      reason,
    }: {
      tripId: number | string;
      bookingId: string | number;
      reason: string;
    }) => bookingsService.raiseRiderDispute(tripId, bookingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rider-bookings"] });
    },
  });
};

/**
 * Hook 9: Saved Routes Query
 */
export const useSavedRoutesQuery = () => {
  return useQuery({
    queryKey: ["saved-routes"],
    queryFn: () => bookingsService.getSavedRoutes(),
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Hook 10: Save Route Mutation
 */
export const useSaveRouteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, payload }: { tripId: number | string; payload: SaveRoutePayload }) =>
      bookingsService.saveRiderRoute(tripId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-routes"] });
    },
  });
};

/**
 * Hook 11: Discover Trips Query
 */
export const useDiscoverTripsQuery = () => {
  return useQuery({
    queryKey: ["discover-trips"],
    queryFn: () => bookingsService.getDiscoverTrips(),
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Hook 12: Popular Routes Query
 */
export const usePopularRoutesQuery = () => {
  return useQuery({
    queryKey: ["popular-routes"],
    queryFn: () => bookingsService.getPopularRoutes(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
