import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AvailableRidesScreen } from "../../../components/booking/AvailableRidesScreen";
import { BookingFlowModals } from "../../../components/booking/BookingFlowModals";
import { RouteSearchModal } from "../../../components/booking/RouteSearchModal";
import { WhatsHappeningSheet } from "../../../components/home/WhatsHappeningSheet";
import { PaymentModals } from "../../../components/payment/PaymentModals";
import { CheckIcon } from "../../../components/ui";
import {
  getUserAddress,
  getUserAvatar,
  getUserFirstName,
  useAuthStore,
} from "../../../state/authStore";
import { CheckoutScreen } from "./CheckoutScreen";
import { RequestSuccessScreen } from "./RequestSuccessScreen";

type Props = any;

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

type DemoStep =
  | "homeMap"
  | "routeSearch"
  | "availableRides"
  | "driverDetails"
  | "checkout"
  | "paymentMethods"
  | "requestSuccess"
  | "navMode";

export const HomeScreen = ({ navigation }: Props) => {
  const user = useAuthStore((s) => s.user);
  const firstName = getUserFirstName(user) || "Prosper";
  const address = getUserAddress(user) || "42 Montgomery Road, Yaba";
  const avatarUri = getUserAvatar(user) || DEFAULT_AVATAR;

  // Active Flow Step State
  const [activeStep, setActiveStep] = useState<DemoStep>("homeMap");

  // Modal Visibility States
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAvailableRides, setShowAvailableRides] = useState(false);
  const [selectedRide, setSelectedRide] = useState<any | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOpenSearch = () => {
    setActiveStep("routeSearch");
    setShowSearchModal(true);
  };

  const handleRouteSelected = (pickup: string, dropoff: string, date?: string) => {
    setShowSearchModal(false);
    setActiveStep("availableRides");
    setShowAvailableRides(true);
  };

  const handleSelectRide = (ride: any) => {
    setSelectedRide(ride);
    setActiveStep("driverDetails");
  };

  const handleConfirmBookingDetails = (details: any) => {
    setBookingDetails(details);
    setSelectedRide(null);
    setShowAvailableRides(false);
    setActiveStep("checkout");
    setShowCheckout(true);
  };

  const handleProceedToPayment = () => {
    setShowCheckout(false);
    setActiveStep("paymentMethods");
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setActiveStep("requestSuccess");
    setShowSuccess(true);
  };

  const handleReturnHome = () => {
    setShowSuccess(false);
    setActiveStep("homeMap");
  };

  const handleViewBooking = () => {
    setShowSuccess(false);
    setActiveStep("homeMap");
    navigation.navigate("BookingsTab");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Interactive Step Switcher Bar */}
      <View style={styles.stepSwitcherBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stepSwitcherContent}>
          {[
            { id: "homeMap", label: "1. Home Dashboard" },
            { id: "routeSearch", label: "2. Route Search" },
            { id: "availableRides", label: "3. Available Rides" },
            { id: "driverDetails", label: "4. Ride Details" },
            { id: "checkout", label: "5. Trip Details / Checkout" },
            { id: "paymentMethods", label: "6. Payment Options" },
            { id: "requestSuccess", label: "7. Request Success 🎉" },
            { id: "navMode", label: "8. Live In-Trip View" },
          ].map((st) => (
            <TouchableOpacity
              key={st.id}
              style={[styles.stepChip, activeStep === st.id && styles.stepChipActive]}
              onPress={() => {
                setActiveStep(st.id as DemoStep);
                if (st.id === "routeSearch") setShowSearchModal(true);
                else if (st.id === "availableRides") setShowAvailableRides(true);
                else if (st.id === "driverDetails") setSelectedRide({ driverName: "Prosper Edward", rating: 4.5 });
                else if (st.id === "checkout") setShowCheckout(true);
                else if (st.id === "paymentMethods") setShowPayment(true);
                else if (st.id === "requestSuccess") setShowSuccess(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.stepChipText, activeStep === st.id && styles.stepChipTextActive]}>
                {st.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {activeStep === "navMode" ? (
        /* ================= IN-TRIP NAVIGATION VIEW ================= */
        <View style={styles.navContainer}>
          <View style={styles.navTopBanner}>
            <View style={styles.navDirectionRow}>
              <Ionicons name="arrow-up" size={26} color="#FFFFFF" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.navDirectionSub}>toward Gbade</Text>
                <Text style={styles.navDirectionMain}>Olayode Cl</Text>
              </View>
              <View style={styles.navSparkleCircle}>
                <Ionicons name="sparkles" size={18} color="#375DFB" />
              </View>
            </View>
            <View style={styles.navThenChip}>
              <Text style={styles.navThenText}>Then ↰</Text>
            </View>
          </View>

          {/* Map View Background */}
          <View style={styles.mapCanvas}>
            <View style={styles.mapRouteLine} />
            <View style={styles.mapCarIcon}>
              <Ionicons name="car" size={20} color="#375DFB" />
            </View>
          </View>

          {/* Bottom Active Trip Sheet */}
          <View style={styles.navBottomSheet}>
            <View style={styles.sheetDragHandle} />
            <View style={styles.navSheetHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.navSheetTitle}>Driving to pickup Prosper</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <Ionicons name="location-outline" size={14} color="#94A3B8" style={{ marginRight: 4 }} />
                  <Text style={styles.navSheetAddress}>10 Obe Street</Text>
                </View>
              </View>
              <Text style={styles.navEtaText}>26min</Text>
            </View>

            <TouchableOpacity style={styles.navPrimaryBtn} onPress={() => setActiveStep("homeMap")}>
              <Text style={styles.navPrimaryBtnText}>Complete Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* ================= RIDER MAP HOME VIEW ================= */
        <View style={styles.mainHomeContainer}>
          {/* Map Canvas Background */}
          <View style={styles.mapCanvasFull}>
            {/* User Location Pin Graphic */}
            <View style={styles.userLocationMarker}>
              <View style={styles.userLocationPulse} />
              <Ionicons name="ellipse" size={18} color="#375DFB" />
            </View>
          </View>

          {/* Floating Search Bar & Notification Header */}
          <View style={styles.floatingHeaderContainer}>
            <TouchableOpacity style={styles.searchBarBox} onPress={handleOpenSearch} activeOpacity={0.85}>
              <Ionicons name="search" size={20} color="#94A3B8" style={{ marginRight: 10 }} />
              <Text style={styles.searchPlaceholder}>Where To?..</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bellBtnBox}
              onPress={() => navigation.navigate("Notifications")}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications-outline" size={22} color="#0F172A" />
            </TouchableOpacity>
          </View>

          {/* Sliding Bottom Sheet for "Whats Happening? ✨" */}
          <View style={styles.bottomSheetContainer}>
            <View style={styles.sheetHeaderHandleArea}>
              <View style={styles.sheetHandlePill} />
            </View>

            <WhatsHappeningSheet
              onSelectRoute={handleOpenSearch}
              onFindRide={handleOpenSearch}
              onJoinCommunity={() => handleOpenSearch()}
              onSeeAllUpcoming={() => navigation.navigate("BookingsTab")}
              onSelectBooking={() => navigation.navigate("BookingsTab")}
              onSeeAllSaved={handleOpenSearch}
              onSeeAllCommunities={() => {}}
            />
          </View>
        </View>
      )}

      {/* 2. Route Search & Departure Date Selector */}
      <RouteSearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectRoute={handleRouteSelected}
      />

      {/* 3. Available Rides Screen */}
      <AvailableRidesScreen
        visible={showAvailableRides}
        onClose={() => setShowAvailableRides(false)}
        onSelectRide={handleSelectRide}
        onOpenFilter={() => {}}
      />

      {/* 4. Ride Details & Booking Modals */}
      <BookingFlowModals
        ride={selectedRide}
        onCloseDriverDetails={() => setSelectedRide(null)}
        onConfirmBookingDetails={handleConfirmBookingDetails}
      />

      {/* 5. Checkout & Promo Validation Screen */}
      <CheckoutScreen
        visible={showCheckout}
        onClose={() => setShowCheckout(false)}
        bookingData={bookingDetails}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* 6. Payment Options Sheet */}
      <PaymentModals
        visible={showPayment}
        onClose={() => setShowPayment(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 7. Request Sent Successfully Screen */}
      <RequestSuccessScreen
        visible={showSuccess}
        onHome={handleReturnHome}
        onViewBooking={handleViewBooking}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 4 : 0,
  },
  stepSwitcherBar: { backgroundColor: "#F8FAFC", borderBottomWidth: 1, borderBottomColor: "#F1F5F9", paddingVertical: 8, zIndex: 50 },
  stepSwitcherContent: { paddingHorizontal: 16, gap: 8 },
  stepChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: "#F1F5F9" },
  stepChipActive: { backgroundColor: "#375DFB" },
  stepChipText: { fontFamily: "DM Sans Bold", fontSize: 12, fontWeight: "600", color: "#64748B" },
  stepChipTextActive: { color: "#FFFFFF" },

  mainHomeContainer: { flex: 1, backgroundColor: "#F8FAFC", position: "relative" },
  mapCanvasFull: { flex: 1, backgroundColor: "#E2E8F0", justifyContent: "center", alignItems: "center" },
  userLocationMarker: { justifyContent: "center", alignItems: "center", position: "relative" },
  userLocationPulse: { position: "absolute", width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(55, 93, 251, 0.2)" },

  floatingHeaderContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 12,
    zIndex: 10,
  },
  searchBarBox: {
    flex: 1,
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchPlaceholder: { fontFamily: "DM Sans", fontSize: 15, color: "#94A3B8" },
  bellBtnBox: {
    width: 52,
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  bottomSheetContainer: {
    position: "absolute",
    top: 78,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 20,
    overflow: "hidden",
  },
  sheetHeaderHandleArea: { paddingTop: 10, paddingBottom: 6, alignItems: "center" },
  sheetHandlePill: { width: 36, height: 4, borderRadius: 2, backgroundColor: "#E2E8F0" },


  /* In-Trip View Styles */
  navContainer: { flex: 1, backgroundColor: "#064E3B" },
  navTopBanner: { backgroundColor: "#064E3B", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  navDirectionRow: { flexDirection: "row", alignItems: "center" },
  navDirectionSub: { fontFamily: "DM Sans", fontSize: 14, color: "#A7F3D0" },
  navDirectionMain: { fontFamily: "DM Sans Bold", fontSize: 22, fontWeight: "700", color: "#FFFFFF" },
  navSparkleCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" },
  navThenChip: { backgroundColor: "rgba(255, 255, 255, 0.15)", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginTop: 10 },
  navThenText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#FFFFFF" },
  mapCanvas: { flex: 1, backgroundColor: "#0F172A", justifyContent: "center", alignItems: "center" },
  mapRouteLine: { width: "80%", height: 6, backgroundColor: "#38BDF8", borderRadius: 3 },
  mapCarIcon: { position: "absolute", top: "45%", left: "55%", width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" },
  navBottomSheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  sheetDragHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#CBD5E1", alignSelf: "center", marginBottom: 12 },
  navSheetHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  navSheetTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },
  navSheetAddress: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B" },
  navEtaText: { fontFamily: "DM Sans Bold", fontSize: 16, color: "#375DFB" },
  navPrimaryBtn: { backgroundColor: "#375DFB", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  navPrimaryBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
});
