import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface RouteSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectRoute: (pickup: string, dropoff: string, date?: string) => void;
}

const RECENT_SEARCHES = [
  { id: "1", name: "11a Onoyade St", address: "Igbobi, Lagos 101245, Lagos" },
  { id: "2", name: "Police College", address: "8a Oba Akinjobi Way, Ikeja GRA, 101223, Lagos" },
  { id: "3", name: "Trinity College Yaba Lagos", address: "1 FFF Rd, Off Alara St, Sabo Yaba, 101223, Lagos" },
];

import { useSavedRoutesQuery } from "../../hooks/useRiderBookings";

const FALLBACK_SAVED_ROUTES = [
  { id: "s1", pickup: "Frebson Fitness Gym", destination: "42, Montgomery Road Yaba" },
  { id: "s2", pickup: "Frebson Fitness Gym", destination: "42, Montgomery Road Yaba" },
  { id: "s3", pickup: "Frebson Fitness Gym", destination: "42, Montgomery Road Yaba" },
];

export const RouteSearchModal: React.FC<RouteSearchModalProps> = ({
  visible,
  onClose,
  onSelectRoute,
}) => {
  const [pickup, setPickup] = useState("11a Onoyade St");
  const [dropoff, setDropoff] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data: savedRoutesData } = useSavedRoutesQuery();

  const savedRoutes = (savedRoutesData?.data && savedRoutesData.data.length > 0)
    ? savedRoutesData.data.map((r) => ({
        id: r.id,
        pickup: r.pickup_location,
        destination: r.destination,
      }))
    : FALLBACK_SAVED_ROUTES;

  const handleSearch = () => {
    if (dropoff.trim() || pickup.trim()) {
      onSelectRoute(pickup || "Current Location", dropoff || "10b Obe Street", selectedTime || undefined);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Route</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          {/* Pickup and Dropoff Inputs Container */}
          <View style={styles.inputsCard}>
            <View style={styles.dotsColumn}>
              <View style={styles.dotOutline} />
              <View style={styles.dotsLine} />
              <View style={styles.dotSolid} />
            </View>

            <View style={styles.fieldsColumn}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={pickup}
                  onChangeText={setPickup}
                  placeholder="Search pickup location"
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity style={styles.pinIconBtn}>
                  <Ionicons name="location-sharp" size={18} color="#375DFB" />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputWrapper, { marginTop: 10 }]}>
                <TextInput
                  style={styles.textInput}
                  value={dropoff}
                  onChangeText={setDropoff}
                  placeholder="Drop Off Location"
                  placeholderTextColor="#94A3B8"
                  autoFocus
                />
              </View>
            </View>
          </View>

          {/* Departure Date Chip */}
          <View style={styles.departureDateRow}>
            {selectedTime ? (
              <View style={styles.selectedTimeChip}>
                <Text style={styles.selectedTimeText}>{selectedTime}</Text>
                <TouchableOpacity onPress={() => setSelectedTime(null)} style={{ marginLeft: 6 }}>
                  <Ionicons name="close" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addDateBtn} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="add" size={16} color="#94A3B8" style={{ marginRight: 4 }} />
                <Text style={styles.addDateText}>Departure Date</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Current Location Option */}
          <TouchableOpacity style={styles.currentLocationRow} onPress={() => setPickup("Current Location")}>
            <Ionicons name="navigate-outline" size={20} color="#375DFB" style={{ marginRight: 12 }} />
            <Text style={styles.currentLocationText}>Current Location</Text>
          </TouchableOpacity>

          {/* Recent Searches Section */}
          {RECENT_SEARCHES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.recentItemRow}
              onPress={() => {
                setDropoff(item.name);
                onSelectRoute(pickup, item.name, selectedTime || undefined);
              }}
            >
              <Ionicons name="time-outline" size={20} color="#94A3B8" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.recentItemName}>{item.name}</Text>
                <Text style={styles.recentItemAddress}>{item.address}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Saved Routes Section */}
          <View style={styles.savedRoutesSection}>
            <Text style={styles.sectionHeaderTitle}>Saved Routes</Text>
            {savedRoutes.map((route) => (
              <View key={route.id} style={styles.savedRouteCard}>
                <View style={styles.savedPointRow}>
                  <View style={styles.miniDotOutline} />
                  <Text style={styles.savedPointLabel}>Pick up point</Text>
                  <Text style={styles.savedPointValue}>{route.pickup}</Text>
                </View>
                <View style={styles.savedConnectorLine} />
                <View style={styles.savedPointRow}>
                  <View style={styles.miniDotSolid} />
                  <Text style={styles.savedPointLabel}>Destination</Text>
                  <Text style={styles.savedPointValue}>{route.destination}</Text>
                </View>
                <TouchableOpacity style={styles.savedCloseBtn}>
                  <Ionicons name="close" size={14} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Departure Date Calendar Modal */}
        <Modal visible={showDatePicker} transparent animationType="slide" onRequestClose={() => setShowDatePicker(false)}>
          <View style={styles.calendarModalOverlay}>
            <View style={styles.calendarModalCard}>
              <View style={styles.calendarHeaderRow}>
                <Text style={styles.calendarTitle}>Select Departure Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Ionicons name="close-circle-outline" size={24} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <View style={styles.monthSelector}>
                <Text style={styles.monthText}>SEPT</Text>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
              </View>

              {/* Simplified Calendar Days Grid */}
              <View style={styles.daysHeader}>
                {["MON", "TUE", "WED", "THUR", "FRI", "SAT", "SUN"].map((d) => (
                  <Text key={d} style={styles.dayHeaderText}>{d}</Text>
                ))}
              </View>
              <View style={styles.daysGrid}>
                {[30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3].map((dayNum, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.dayCell, dayNum === 10 && i === 10 && styles.dayCellSelected]}
                    onPress={() => {
                      setSelectedTime("12:53 PM");
                      setShowDatePicker(false);
                    }}
                  >
                    <Text style={[styles.dayCellText, dayNum === 10 && i === 10 && styles.dayCellTextSelected]}>{dayNum}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.calendarActionsRow}>
                <TouchableOpacity style={styles.clearBtn} onPress={() => setSelectedTime(null)}>
                  <Text style={styles.clearBtnText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.setBtn}
                  onPress={() => {
                    setSelectedTime("12:53 PM");
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={styles.setBtnText}>Set</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  backButton: { padding: 4 },
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },
  content: { flex: 1, paddingHorizontal: 16 },

  inputsCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  dotsColumn: { alignItems: "center", width: 24, marginRight: 8 },
  dotOutline: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: "#94A3B8" },
  dotsLine: { width: 1.5, height: 38, backgroundColor: "#CBD5E1", marginVertical: 4 },
  dotSolid: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#64748B" },
  fieldsColumn: { flex: 1 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: "#FFFFFF",
  },
  textInput: { flex: 1, fontFamily: "DM Sans", fontSize: 14, color: "#0F172A", paddingVertical: 0, height: "100%" },
  pinIconBtn: { padding: 4 },

  departureDateRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12, marginBottom: 20 },
  addDateBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  addDateText: { fontFamily: "DM Sans", fontSize: 13, color: "#94A3B8" },
  selectedTimeChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#F8FAFC",
  },
  selectedTimeText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#0F172A" },

  currentLocationRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  currentLocationText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#0F172A" },

  recentItemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  recentItemName: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A" },
  recentItemAddress: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B", marginTop: 2 },

  savedRoutesSection: { marginTop: 24, marginBottom: 30 },
  sectionHeaderTitle: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#64748B", marginBottom: 12 },
  savedRouteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginBottom: 10,
    position: "relative",
  },
  savedPointRow: { flexDirection: "row", alignItems: "center" },
  miniDotOutline: { width: 6, height: 6, borderRadius: 3, borderWidth: 1, borderColor: "#64748B", marginRight: 8 },
  miniDotSolid: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#64748B", marginRight: 8 },
  savedPointLabel: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8", marginRight: 6 },
  savedPointValue: { fontFamily: "DM Sans Bold", fontSize: 12, color: "#0F172A", marginLeft: "auto", marginRight: 20 },
  savedConnectorLine: { width: 1, height: 10, backgroundColor: "#CBD5E1", marginLeft: 2.5, marginVertical: 2 },
  savedCloseBtn: { position: "absolute", top: 12, right: 12, padding: 4 },

  /* Calendar Modal */
  calendarModalOverlay: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.65)", justifyContent: "flex-end" },
  calendarModalCard: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  calendarHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  calendarTitle: { fontFamily: "DM Sans Bold", fontSize: 18, color: "#0F172A" },
  monthSelector: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 16 },
  monthText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#64748B", marginRight: 4 },
  daysHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  dayHeaderText: { fontFamily: "DM Sans Bold", fontSize: 11, color: "#94A3B8", width: "14%", textAlign: "center" },
  daysGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: { width: "14%", height: 40, justifyContent: "center", alignItems: "center", marginBottom: 4 },
  dayCellSelected: { backgroundColor: "#375DFB", borderRadius: 10 },
  dayCellText: { fontFamily: "DM Sans", fontSize: 14, color: "#0F172A" },
  dayCellTextSelected: { fontFamily: "DM Sans Bold", color: "#FFFFFF" },
  calendarActionsRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  clearBtn: { flex: 1, borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  clearBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#64748B" },
  setBtn: { flex: 1, backgroundColor: "#375DFB", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  setBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
});
