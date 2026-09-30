import { apiClient } from "../client";

// ================= TYPES & INTERFACES =================

export interface DriverSummary {
  id: number;
  full_name: string;
  rating: number;
  profile_picture?: string | null;
}

export interface VehicleSummary {
  brand: string;
  model: string;
  colour: string;
  plate_number: string;
}

export interface StopPoint {
  id: number;
  stop_type: "pickup" | "dropoff" | string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export interface DiscoverTripItem {
  id: number;
  driver: DriverSummary;
  vehicle: VehicleSummary;
  is_recurring: boolean;
  recurrence_days?: string[];
  pickup_location: string;
  destination: string;
  trip_date: string;
  departure_time: string;
  trip_frequency: string;
  end_date: string;
  available_seats?: number;
  price_per_seat?: string;
}

export interface PopularRouteItem {
  pickup_location: string;
  destination: string;
  trips_available: number;
  schedule_label: string;
  eta_minutes: number | null;
  distance_km: number | null;
}

export interface RiderBookingApiItem {
  id: string | number;
  driver?: DriverSummary | number;
  vehicle?: VehicleSummary | number | string;
  pickup_location: string;
  destination: string;
  pickup_point?: StopPoint | null;
  dropoff_point?: StopPoint | null;
  seats_requested?: number;
  seats_booked?: number;
  seats_available?: number;
  available_seats?: number;
  price_at_booking?: string;
  price_per_seat?: string | number;
  status: "pending" | "confirmed" | "scheduled" | "completed" | "cancelled" | "ongoing" | string;
  trip_date?: string;
  departure_time?: string;
  scheduled_at?: string;
  trip_frequency?: "once" | "daily" | "weekly" | "custom" | string;
  recurrence_frequency?: string;
  recurrence_days?: number[] | string[];
  start_date?: string;
  end_date?: string;
  trip_status?: string;
  trip_price_per_seat?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RiderBookingsResponse {
  count: number;
  results: RiderBookingApiItem[];
}

export interface RequestBookingPayload {
  seats_requested: number;
  selected_days: number[];
  start_date: string;
  end_date: string;
  pickup_stop?: number;
  dropoff_stop?: number;
}

export interface RequestBookingResponse {
  id: string;
  seats_requested: number;
  selected_days: number[];
  start_date: string;
  end_date: string;
  pickup_stop?: number;
  dropoff_stop?: number;
  status: string;
  price_at_booking: string;
}

export interface CancelBookingResponse {
  message: string;
  booking_id: string;
  status: "cancelled";
}

export interface CheckInResponse {
  id: string;
  booking: string;
  occurrence_date: string;
  status: string;
  confirmed_at?: string;
  pickup_stop?: number | null;
  dropoff_stop?: number | null;
}

export interface RiderTripDetailsResponse {
  trip: {
    id: number;
    driver: DriverSummary;
    vehicle: VehicleSummary;
    is_recurring: boolean;
    pickup_location: string;
    destination: string;
    trip_date: string;
    departure_time: string;
    trip_frequency: string;
    end_date: string;
  };
  completed_trips: number;
  date_joined: string;
  place_of_work: string | null;
  reliability_level: number;
}

export interface RateTripPayload {
  rating: number;
  comment?: string;
}

export interface RateTripResponse {
  message: string;
  data: {
    id: number;
    rider: number;
    rider_name: string;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
  };
}

export interface RaiseDisputeResponse {
  message: string;
  data: {
    id: number;
    trip: number;
    trip_details: {
      id: number;
      pickup_location: string;
      destination: string;
      trip_date: string;
      departure_time: string;
      scheduled_at?: string;
      price_per_seat: number;
    };
    booking_id: string | number;
    customer: {
      id: number;
      full_name: string;
      email: string;
      phone_number: string;
    };
    reason: string;
    status: "open" | "resolved" | "closed" | string;
    resolution_note: string | null;
    resolved_by: string | null;
    resolved_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface SavedRouteItem {
  id: string;
  name: string | null;
  pickup_location: string;
  destination: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavedRoutesResponse {
  count: number;
  data: SavedRouteItem[];
}

export interface SaveRoutePayload {
  pickup_location: string;
  destination: string;
}

// ================= SERVICE METHODS =================

export const bookingsService = {
  /**
   * 1. GET /riders/bookings/ (optional ?status=cancelled|confirmed|pending)
   */
  async getRiderBookings(status?: string): Promise<RiderBookingsResponse> {
    const params: Record<string, string> = {};
    if (status && status !== "all") {
      params.status = status;
    }
    const response = await apiClient.get<RiderBookingsResponse>("riders/bookings/", {
      params,
    });
    return response.data;
  },

  /**
   * 2. POST /riders/bookings/cancel/?booking_id={booking_id}
   */
  async cancelRiderBooking(bookingId: string): Promise<CancelBookingResponse> {
    const response = await apiClient.post<CancelBookingResponse>(
      "riders/bookings/cancel/",
      {},
      { params: { booking_id: bookingId } }
    );
    return response.data;
  },

  /**
   * 3. POST /riders/bookings/check-in/?booking_id={booking_id}
   */
  async checkInRiderBooking(
    bookingId: string,
    occurrenceDate: string
  ): Promise<CheckInResponse> {
    const response = await apiClient.post<CheckInResponse>(
      "riders/bookings/check-in/",
      { occurrence_date: occurrenceDate },
      { params: { booking_id: bookingId } }
    );
    return response.data;
  },

  /**
   * 4. POST /riders/request-booking/?trip_id={trip_id}
   */
  async requestRiderBooking(
    tripId: number | string,
    payload: RequestBookingPayload
  ): Promise<RequestBookingResponse> {
    const response = await apiClient.post<RequestBookingResponse>(
      "riders/request-booking/",
      payload,
      { params: { trip_id: tripId } }
    );
    return response.data;
  },

  /**
   * 5. GET /riders/trips/?trip_id={trip_id}
   */
  async getRiderTripDetails(tripId: number | string): Promise<RiderTripDetailsResponse> {
    const response = await apiClient.get<RiderTripDetailsResponse>("riders/trips/", {
      params: { trip_id: tripId },
    });
    return response.data;
  },

  /**
   * 6. POST /riders/trips/rating/?trip_id={trip_id}
   */
  async rateRiderTrip(
    tripId: number | string,
    payload: RateTripPayload
  ): Promise<RateTripResponse> {
    const formData = new FormData();
    formData.append("rating", String(payload.rating));
    if (payload.comment) {
      formData.append("comment", payload.comment);
    }
    const response = await apiClient.post<RateTripResponse>(
      "riders/trips/rating/",
      formData,
      {
        params: { trip_id: tripId },
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  /**
   * 7. POST /riders/trips/disputes/?trip_id={trip_id}&booking_id={booking_id}
   */
  async raiseRiderDispute(
    tripId: number | string,
    bookingId: string | number,
    reason: string
  ): Promise<RaiseDisputeResponse> {
    const formData = new FormData();
    formData.append("reason", reason);
    const response = await apiClient.post<RaiseDisputeResponse>(
      "riders/trips/disputes/",
      formData,
      {
        params: { trip_id: tripId, booking_id: bookingId },
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  /**
   * 8. GET /riders/saved-routes/
   */
  async getSavedRoutes(): Promise<SavedRoutesResponse> {
    const response = await apiClient.get<SavedRoutesResponse>("riders/saved-routes/");
    return response.data;
  },

  /**
   * 9. POST /riders/saved-routes/?trip_id={trip_id}
   */
  async saveRiderRoute(
    tripId: number | string,
    payload: SaveRoutePayload
  ): Promise<any> {
    const formData = new FormData();
    formData.append("pickup_location", payload.pickup_location);
    formData.append("destination", payload.destination);
    const response = await apiClient.post("riders/saved-routes/", formData, {
      params: { trip_id: tripId },
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * 10. GET /riders/discover/trips/
   */
  async getDiscoverTrips(): Promise<DiscoverTripItem[]> {
    const response = await apiClient.get<DiscoverTripItem[]>("riders/discover/trips/");
    return response.data;
  },

  /**
   * 11. GET /riders/trips/popular-routes/
   */
  async getPopularRoutes(): Promise<PopularRouteItem[]> {
    const response = await apiClient.get<PopularRouteItem[]>("riders/trips/popular-routes/");
    return response.data;
  },
};
