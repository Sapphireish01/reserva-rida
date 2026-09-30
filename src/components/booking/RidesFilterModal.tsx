import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppBottomSheet } from "../ui/AppBottomSheet";

export interface RidesFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export const RidesFilterModal: React.FC<RidesFilterModalProps> = ({
  visible,
  onClose,
  onApply,
}) => {
  const [rating, setRating] = useState(0);
  const [priceOrder, setPriceOrder] = useState("Highest to Lowest");
  const [priceVal, setPriceVal] = useState(250);
  const [departureTimeOrder, setDepartureTimeOrder] = useState("Earliest to Latest Departure");
  const [durationOrder, setDurationOrder] = useState("Shortest to Longest Duration");
  const [radius, setRadius] = useState(2.5);
  const [gender, setGender] = useState<string | null>(null);

  const handleClear = () => {
    setRating(0);
    setPriceOrder("Highest to Lowest");
    setPriceVal(250);
    setDepartureTimeOrder("Earliest to Latest Departure");
    setDurationOrder("Shortest to Longest Duration");
    setRadius(2.5);
    setGender(null);
  };

  const handleApply = () => {
    onApply({ rating, priceOrder, priceVal, departureTimeOrder, durationOrder, radius, gender });
    onClose();
  };

  return (
    <AppBottomSheet visible={visible} onClose={onClose} title="Filter" maxHeight="90%">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Driver Rating */}
        <Text style={styles.filterSectionTitle}>Driver Rating</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons
                name={star <= rating ? "star" : "star-outline"}
                size={28}
                color={star <= rating ? "#F59E0B" : "#CBD5E1"}
                style={{ marginRight: 8 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Range */}
        <Text style={styles.filterSectionTitle}>Price Range</Text>
        <TouchableOpacity style={styles.dropdownBtn}>
          <Text style={styles.dropdownText}>{priceOrder}</Text>
          <Ionicons name="swap-vertical" size={16} color="#64748B" />
        </TouchableOpacity>

        <View style={styles.sliderBox}>
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>$0</Text>
            <Text style={styles.sliderLabel}>$500</Text>
          </View>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${(priceVal / 500) * 100}%` }]} />
            <View style={[styles.sliderThumb, { left: `${(priceVal / 500) * 90}%` }]} />
          </View>
        </View>

        {/* Departure Time & Duration Sorters */}
        <Text style={styles.filterSectionTitle}>Departure Time</Text>
        <TouchableOpacity
          style={styles.dropdownBtn}
          onPress={() =>
            setDepartureTimeOrder(
              departureTimeOrder === "Earliest to Latest Departure"
                ? "Latest to Earliest Departure"
                : "Earliest to Latest Departure"
            )
          }
        >
          <Text style={styles.dropdownText}>{departureTimeOrder}</Text>
          <Ionicons name="swap-vertical" size={16} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dropdownBtn, { marginTop: 8 }]}
          onPress={() =>
            setDurationOrder(
              durationOrder === "Shortest to Longest Duration"
                ? "Longest to Shortest Duration"
                : "Shortest to Longest Duration"
            )
          }
        >
          <Text style={styles.dropdownText}>{durationOrder}</Text>
          <Ionicons name="swap-vertical" size={16} color="#64748B" />
        </TouchableOpacity>

        {/* Pickup Radius */}
        <Text style={styles.filterSectionTitle}>Pickup Radius</Text>
        <View style={styles.sliderBox}>
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>0</Text>
            <Text style={styles.sliderLabel}>5km</Text>
          </View>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${(radius / 5) * 100}%` }]} />
            <View style={[styles.sliderThumb, { left: `${(radius / 5) * 90}%` }]} />
          </View>
        </View>

        {/* Gender Preference */}
        <Text style={styles.filterSectionTitle}>Gender Preference</Text>
        <View style={styles.genderRow}>
          {["Female Only", "Male Only"].map((g) => {
            const isSelected = gender === g;
            return (
              <TouchableOpacity
                key={g}
                style={[styles.genderChip, isSelected && styles.genderChipSelected]}
                onPress={() => setGender(isSelected ? null : g)}
              >
                <Ionicons
                  name={isSelected ? "checkbox" : "square-outline"}
                  size={16}
                  color={isSelected ? "#375DFB" : "#94A3B8"}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.genderText}>{g}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyBtnText}>Apply Filter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  filterSectionTitle: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B", marginTop: 14, marginBottom: 8 },
  starsRow: { flexDirection: "row", marginBottom: 10 },

  dropdownBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  dropdownText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#0F172A" },

  sliderBox: { marginVertical: 10 },
  sliderLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  sliderLabel: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8" },
  sliderTrack: { height: 6, backgroundColor: "#F1F5F9", borderRadius: 3, position: "relative", justifyContent: "center" },
  sliderFill: { height: "100%", backgroundColor: "#375DFB", borderRadius: 3 },
  sliderThumb: { position: "absolute", width: 18, height: 18, borderRadius: 9, backgroundColor: "#375DFB", borderWidth: 3, borderColor: "#FFFFFF" },

  genderRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  genderChip: { flex: 1, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, padding: 12, backgroundColor: "#F8FAFC" },
  genderChipSelected: { borderColor: "#375DFB", backgroundColor: "#EFF6FF" },
  genderText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#0F172A" },

  actionsRow: { flexDirection: "row", gap: 12, marginTop: 10, marginBottom: 20 },
  clearBtn: { flex: 1, borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  clearBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#64748B" },
  applyBtn: { flex: 1, backgroundColor: "#375DFB", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  applyBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
});
