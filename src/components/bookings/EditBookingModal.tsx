import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppBottomSheet } from "../ui/AppBottomSheet";

export interface EditBookingModalProps {
  visible: boolean;
  onClose: () => void;
  booking: any;
  onSave: (updatedData: any) => void;
}

export const EditBookingModal: React.FC<EditBookingModalProps> = ({
  visible,
  onClose,
  booking,
  onSave,
}) => {
  const [seats, setSeats] = useState(booking?.seats || 1);
  const [days, setDays] = useState<string[]>(["Wednesday"]);
  const [pickupPoint, setPickupPoint] = useState("Seven and Eight Junction");

  useEffect(() => {
    if (booking?.seats) {
      setSeats(booking.seats);
    }
  }, [booking]);

  const toggleDay = (day: string) => {
    if (days.includes(day)) {
      setDays(days.filter((d) => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const handleSave = () => {
    onSave({
      seats,
      days,
      pickupPoint,
    });
    onClose();
  };

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title="Booking Details"
      maxHeight="85%"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Select Number of Seats */}
        <Text style={styles.formLabel}>Select Number of Seats</Text>
        <View style={styles.seatsCounterRow}>
          <TouchableOpacity style={styles.counterBtn} onPress={() => seats > 1 && setSeats(seats - 1)}>
            <Ionicons name="remove" size={18} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.seatsCountText}>{seats}</Text>
          <TouchableOpacity style={styles.counterBtnBlue} onPress={() => setSeats(seats + 1)}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.seatsLeftText}>2 seats left</Text>

        {/* Trip Frequency */}
        <Text style={[styles.formLabel, { marginTop: 16 }]}>Trip Frequency</Text>
        <View style={styles.frequencyRow}>
          {["Monday", "Wednesday"].map((day) => {
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
                <Text style={[styles.freqText, isSelected && styles.freqTextActive]}>{day}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Start Date */}
        <Text style={[styles.formLabel, { marginTop: 16 }]}>Start Date</Text>
        <View style={styles.readOnlyInput}>
          <Text style={styles.readOnlyText}>Tomorrow</Text>
          <Ionicons name="calendar-outline" size={18} color="#94A3B8" />
        </View>

        {/* End Date */}
        <Text style={[styles.formLabel, { marginTop: 12 }]}>End Date</Text>
        <View style={styles.readOnlyInput}>
          <Text style={styles.readOnlyText}>25 April</Text>
          <Ionicons name="calendar-outline" size={18} color="#94A3B8" />
        </View>

        {/* Closest Pick Up Point Radios */}
        <Text style={[styles.formLabel, { marginTop: 16 }]}>Closest Pick Up Point</Text>
        {["Seven and Eight Junction", "Jesus House Church"].map((point) => {
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
              <Text style={styles.radioText}>{point}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Save CTA */}
        <TouchableOpacity style={[styles.saveBtn, { marginTop: 24, marginBottom: 20 }]} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  formLabel: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#64748B", marginBottom: 8 },
  seatsCounterRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderRadius: 12, padding: 4, width: 140 },
  counterBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0" },
  counterBtnBlue: { width: 36, height: 36, borderRadius: 8, backgroundColor: "#375DFB", justifyContent: "center", alignItems: "center" },
  seatsCountText: { flex: 1, textAlign: "center", fontFamily: "DM Sans Bold", fontSize: 15, color: "#0F172A" },
  seatsLeftText: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8", alignSelf: "flex-end", marginTop: -20 },

  frequencyRow: { flexDirection: "row", gap: 10 },
  freqChip: { flex: 1, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, padding: 12, backgroundColor: "#FFFFFF" },
  freqChipActive: { backgroundColor: "#EFF6FF", borderColor: "#BEDBFF" },
  freqText: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B" },
  freqTextActive: { fontFamily: "DM Sans Bold", color: "#0F172A" },

  readOnlyInput: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 14, height: 48, backgroundColor: "#FFFFFF" },
  readOnlyText: { fontFamily: "DM Sans", fontSize: 14, color: "#0F172A" },

  radioCard: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, padding: 14, marginBottom: 8, backgroundColor: "#F8FAFC" },
  radioCardSelected: { borderColor: "#375DFB", backgroundColor: "#EFF6FF" },
  radioText: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#0F172A" },

  saveBtn: { backgroundColor: "#375DFB", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  saveBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
});
