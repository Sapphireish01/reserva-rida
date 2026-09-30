import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBackIconItem } from "../../../components/ProfileIcons";
import { colors, spacing } from "../../../theme/colors";

type Props = any;

interface BookmarkedPlace {
  id: string;
  name: string;
  address: string;
  type: "work" | "home" | "custom";
}

interface SavedRoute {
  id: string;
  driveTime: string;
  pickup: string;
  destination: string;
}

const INITIAL_PLACES: BookmarkedPlace[] = [
  {
    id: "1",
    name: "Work",
    address: "42 Montgomery Road, Yaba",
    type: "work",
  },
  {
    id: "2",
    name: "Home",
    address: "42 Montgomery Road, Yaba",
    type: "home",
  },
  {
    id: "3",
    name: "Seven and Eight Junction",
    address: "Murtala Muhammed 100214",
    type: "custom",
  },
  {
    id: "4",
    name: "GlassHouse",
    address: "12 Obe Street Off, Bank Anthony Way",
    type: "custom",
  },
];

const INITIAL_ROUTES: SavedRoute[] = [
  {
    id: "r1",
    driveTime: "18 mins drive",
    pickup: "Frebson Fitness Gym",
    destination: "42, Montgomery Road Yaba",
  },
  {
    id: "r2",
    driveTime: "18 mins drive",
    pickup: "Frebson Fitness Gym",
    destination: "42, Montgomery Road Yaba",
  },
];

export const BookmarksScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [places, setPlaces] = useState<BookmarkedPlace[]>(INITIAL_PLACES);
  const [routes, setRoutes] = useState<SavedRoute[]>(INITIAL_ROUTES);

  // Bottom Sheet & Modal States
  const [selectedPlace, setSelectedPlace] = useState<BookmarkedPlace | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAddress, setEditAddress] = useState("");

  const handleOpenDetails = (place: BookmarkedPlace) => {
    setSelectedPlace(place);
    setShowDetailsModal(true);
  };

  const handleStartEdit = () => {
    if (!selectedPlace) return;
    setEditAddress(selectedPlace.address);
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedPlace) return;
    setPlaces((prev) =>
      prev.map((p) => (p.id === selectedPlace.id ? { ...p, address: editAddress } : p))
    );
    setShowEditModal(false);
    setSelectedPlace(null);
  };

  const handleDeletePlace = () => {
    if (!selectedPlace) return;
    setPlaces((prev) => prev.filter((p) => p.id !== selectedPlace.id));
    setShowDetailsModal(false);
    setSelectedPlace(null);
  };

  const renderPlaceIcon = (type: BookmarkedPlace["type"]) => {
    if (type === "work") {
      return <Ionicons name="business-outline" size={20} color="#868C98" />;
    }
    if (type === "home") {
      return <Ionicons name="home-outline" size={20} color="#868C98" />;
    }
    return <Ionicons name="location-outline" size={20} color="#868C98" />;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <HeaderBackIconItem size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookmarks</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Bookmarked Places List */}
        <View style={styles.placesContainer}>
          {places.map((place) => (
            <TouchableOpacity
              key={place.id}
              style={styles.placeRow}
              onPress={() => handleOpenDetails(place)}
              activeOpacity={0.7}
            >
              <View style={styles.placeIconBox}>{renderPlaceIcon(place.type)}</View>
              <View style={styles.placeTextContainer}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeAddress}>{place.address}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Saved Routes Section Header */}
        <View style={styles.sectionHeaderBand}>
          <Text style={styles.sectionHeaderText}>Saved Routes</Text>
        </View>

        {/* Saved Routes Cards */}
        <View style={styles.routesContainer}>
          {routes.map((routeItem) => (
            <View key={routeItem.id} style={styles.routeCard}>
              {/* Card Top Header */}
              <View style={styles.routeCardTop}>
                <Text style={styles.driveTimeText}>{routeItem.driveTime}</Text>
                <View style={styles.bookmarkIconBox}>
                  <Ionicons name="bookmark-outline" size={16} color="#475569" />
                </View>
              </View>

              {/* Card Middle: Pickup & Destination with dotted line */}
              <View style={styles.routeDetailsRow}>
                <View style={styles.routeCol}>
                  <Text style={styles.routeLabel}>Pick up point</Text>
                  <Text style={styles.routeValue}>{routeItem.pickup}</Text>
                </View>

                {/* Dotted Line Connector */}
                <View style={styles.dottedConnectorContainer}>
                  <Text style={styles.dottedLineText}>-----------------</Text>
                </View>

                <View style={styles.routeCol}>
                  <Text style={styles.routeLabel}>Destination</Text>
                  <Text style={styles.routeValue}>{routeItem.destination}</Text>
                </View>
              </View>

              {/* Find Ride Action Button */}
              <TouchableOpacity
                style={styles.findRideBtn}
                onPress={() => {
                  navigation.navigate("TripsTab");
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.findRideBtnText}>Find Ride</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 1. Location Details Bottom Sheet Modal */}
      <Modal visible={showDetailsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setShowDetailsModal(false)}
            activeOpacity={1}
          />
          <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            {/* Sheet Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Location Details</Text>
              <TouchableOpacity onPress={() => setShowDetailsModal(false)} activeOpacity={0.7}>
                <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Action Row 1: Edit */}
            <TouchableOpacity style={styles.sheetOptionCard} onPress={handleStartEdit} activeOpacity={0.7}>
              <View style={styles.sheetOptionLeft}>
                <Ionicons name="create-outline" size={22} color="#475569" />
                <Text style={styles.sheetOptionText}>Edit</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Action Row 2: Delete */}
            <TouchableOpacity style={styles.sheetOptionCard} onPress={handleDeletePlace} activeOpacity={0.7}>
              <View style={styles.sheetOptionLeft}>
                <Ionicons name="trash-outline" size={22} color="#475569" />
                <Text style={styles.sheetOptionText}>Delete</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2. Edit Location Screen / Modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setShowEditModal(false)}
            activeOpacity={1}
          />
          <View style={[styles.editSheetContainer, { paddingBottom: Math.max(insets.bottom, 34) }]}>
            {/* Top Bar Header */}
            <View style={styles.editHeaderBar}>
              <TouchableOpacity onPress={() => setShowEditModal(false)} activeOpacity={0.7}>
                <Text style={styles.editCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.editHeaderTitle}>Edit {selectedPlace?.name || "Location"}</Text>
              <TouchableOpacity onPress={handleSaveEdit} activeOpacity={0.7}>
                <Text style={styles.editSaveText}>Save</Text>
              </TouchableOpacity>
            </View>

            {/* Address Text Input */}
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.addressInput}
                value={editAddress}
                onChangeText={setEditAddress}
                placeholder="Enter address"
                placeholderTextColor="#94A3B8"
                autoFocus
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },
  headerRightPlaceholder: {
    width: 28,
  },
  scrollContent: {
    paddingBottom: spacing.xl * 2,
  },
  placesContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  placeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  placeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  placeTextContainer: {
    flex: 1,
  },
  placeName: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 3,
  },
  placeAddress: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#94A3B8",
  },
  sectionHeaderBand: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionHeaderText: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },
  routesContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  routeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  routeCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  driveTimeText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#64748B",
  },
  bookmarkIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  routeDetailsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  routeCol: {
    flex: 1,
  },
  routeLabel: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 4,
  },
  routeValue: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
    lineHeight: 18,
  },
  dottedConnectorContainer: {
    paddingHorizontal: 4,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dottedLineText: {
    color: "#CBD5E1",
    fontSize: 11,
    letterSpacing: -1,
  },
  findRideBtn: {
    backgroundColor: "#375DFB",
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  findRideBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  sheetOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    marginBottom: 4,
  },
  sheetOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sheetOptionText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  editSheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingTop: spacing.md,
    minHeight: 300,
  },
  editHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    paddingVertical: 4,
  },
  editCancelText: {
    fontFamily: "DM Sans",
    fontSize: 15,
    color: "#94A3B8",
  },
  editHeaderTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  editSaveText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  inputBoxContainer: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.md,
    height: 52,
    justifyContent: "center",
  },
  addressInput: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#0F172A",
  },
});
