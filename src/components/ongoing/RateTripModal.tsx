import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppBottomSheet } from "../ui/AppBottomSheet";
import { useRateTripMutation } from "../../hooks/useRiderBookings";

export interface RateTripModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  driverName?: string;
  tripId?: number | string;
  avatar?: string;
  routeTitle?: string;
}

export const RateTripModal: React.FC<RateTripModalProps> = ({
  visible,
  onClose,
  onSubmitSuccess,
  tripId = 14,
  driverName = "Prosper Edward",
  avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  routeTitle = "Frebson Fitness Gym ➔ CMS Bus Stop Lagos Island",
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<"disabled" | "active" | "loading" | "submitted">("disabled");

  const rateTripMutation = useRateTripMutation();

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (status !== "loading" && status !== "submitted") {
      setStatus(newRating > 0 ? "active" : "disabled");
    }
  };

  const handleSubmit = async () => {
    if (rating === 0 || status === "loading" || status === "submitted") return;
    setStatus("loading");
    try {
      if (tripId) {
        await rateTripMutation.mutateAsync({
          tripId,
          payload: { rating, comment: feedback },
        });
      }
    } catch (e) {
      console.log("Trip rating API error (local fallback applied):", e);
    }
    setStatus("submitted");
    setTimeout(() => {
      setStatus("disabled");
      setRating(0);
      setFeedback("");
      onSubmitSuccess();
    }, 1200);
  };

  const isSubmitDisabled = rating === 0 || status === "loading" || status === "submitted";

  return (
    <AppBottomSheet visible={visible} onClose={onClose} showCloseButton={false} maxHeight="85%">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Rate Your Trip</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Route Pill */}
        <View style={styles.routePill}>
          <Text style={styles.routePillText} numberOfLines={1}>
            {routeTitle}
          </Text>
          <Ionicons name="navigate-circle-outline" size={20} color="#64748B" />
        </View>

        {/* Driver / Passenger Card */}
        <View style={styles.passengerCard}>
          <Image source={{ uri: avatar }} style={styles.avatarImage} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.driverName}>{driverName}</Text>
              <Ionicons name="checkmark-circle" size={16} color="#3B66FF" style={{ marginLeft: 4 }} />
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>4.5</Text>
                <Ionicons name="star" size={12} color="#3B66FF" style={{ marginLeft: 2 }} />
              </View>
            </View>
            <Text style={styles.vehicleText}>Honda Accord • Black • KTU345GX</Text>
          </View>
        </View>

        {/* 5 Interactive Rating Stars */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleRatingChange(star)}
              activeOpacity={0.7}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Ionicons
                name={star <= rating ? "star" : "star-outline"}
                size={34}
                color={star <= rating ? "#F59E0B" : "#CBD5E1"}
                style={{ marginHorizontal: 6 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback Section */}
        <Text style={styles.feedbackLabel}>We would love your feedback</Text>
        <View style={styles.textareaContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Tell us about your last trip"
            placeholderTextColor="#94A3B8"
            multiline
            maxLength={200}
            value={feedback}
            onChangeText={setFeedback}
          />
          <Text style={styles.charCounter}>{feedback.length}/200</Text>
        </View>

        {/* 4-State Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            status === "disabled" && styles.submitBtnDisabled,
            (status === "active" || status === "loading" || status === "submitted") && styles.submitBtnActive,
          ]}
          disabled={isSubmitDisabled}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          {status === "loading" ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : status === "submitted" ? (
            <View style={styles.submittedBtnRow}>
              <Ionicons name="checkmark-circle" size={20} color="#22C55E" style={{ marginRight: 6 }} />
              <Text style={styles.submitBtnTextActive}>Submitted</Text>
            </View>
          ) : (
            <Text
              style={[
                styles.submitBtnText,
                status === "disabled" ? styles.submitBtnTextDisabled : styles.submitBtnTextActive,
              ]}
            >
              Submit
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: "DM Sans Bold",
    fontSize: 18,
    color: "#0F172A",
    fontWeight: "700",
  },
  cancelText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#64748B",
  },

  // Route Pill (Section 7)
  routePill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
  },
  routePillText: {
    flex: 1,
    fontFamily: "DM Sans",
    fontSize: 13,
    color: "#64748B",
    marginRight: 8,
  },

  // Passenger Card (Section 7)
  passengerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: 14,
    backgroundColor: "#E2E8F0",
  },
  driverName: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "700",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    color: "#3B66FF",
  },
  vehicleText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  // Stars Row
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  // Textarea Container (Section 7)
  feedbackLabel: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 8,
  },
  textareaContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 16,
    minHeight: 180,
    justifyContent: "space-between",
    marginBottom: 24,
  },
  textArea: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#0F172A",
    minHeight: 120,
    textAlignVertical: "top",
  },
  charCounter: {
    fontFamily: "DM Sans",
    fontSize: 11,
    color: "#94A3B8",
    alignSelf: "flex-end",
  },

  // 4-State Submit Button (Section 7)
  submitBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  submitBtnActive: {
    backgroundColor: "#3B66FF",
    borderWidth: 0,
  },
  submitBtnText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "700",
  },
  submitBtnTextDisabled: {
    color: "#CBD5E1",
  },
  submitBtnTextActive: {
    color: "#FFFFFF",
  },
  submittedBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

