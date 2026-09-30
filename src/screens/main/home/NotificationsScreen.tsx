import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ComplaintDetailsSheet } from "../../../components/notifications/ComplaintDetailsSheet";
import { NotificationOptionsModal } from "../../../components/notifications/NotificationOptionsModal";
import { MainStackParamList } from "../../../navigation/types";

type Props = NativeStackScreenProps<MainStackParamList, "Notifications">;

export interface NotificationFeedItem {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  type: "progress" | "confirmed" | "referrals" | "cancelled" | "request" | "coupon" | "complaint" | "transaction";
  isRead?: boolean;
  actionText?: string;
  linkText?: string;
}

const INITIAL_NOTIFICATIONS: NotificationFeedItem[] = [
  {
    id: "n1",
    title: "Driver on his way",
    subtitle: "Your ride is 5mins away make sure you're at the pick up point",
    timeAgo: "5mins away",
    type: "progress",
  },
  {
    id: "n2",
    title: "Driver heading your way!",
    subtitle: "Your driver is heading to the pickup location.",
    timeAgo: "5mins ago",
    type: "request",
  },
  {
    id: "n3",
    title: "Booking Confirmed",
    subtitle: "Your vehicle has been successfully booked. Meet at the pick up point tomorrow by 10:30 AM",
    timeAgo: "2 hours ago",
    type: "confirmed",
    actionText: "View Bookings",
  },
  {
    id: "n4",
    title: "You've Hit 100 Referrals 🎉",
    subtitle: "Congratulations Prosper, you've hit 100 referrals, redeem your points now",
    timeAgo: "2 hours ago",
    type: "referrals",
    actionText: "Redeem Points",
  },
  {
    id: "n5",
    title: "Booking Cancelled",
    subtitle: "Your vehicle reservation has been cancelled. If it wasn't you ",
    timeAgo: "2 hours ago",
    type: "cancelled",
    linkText: "contact support",
  },
  {
    id: "n6",
    title: "Request Sent",
    subtitle: "Your request has been sent to the driver, we will update you on his response",
    timeAgo: "2 hours ago",
    type: "request",
  },
  {
    id: "n7",
    title: "Get Your 30% Discount Coupon 🎉",
    subtitle: "Follow Us on Facebook to get yourself 30% off your next trip",
    timeAgo: "2 hours ago",
    type: "coupon",
    actionText: "Follow on Facebook",
  },
  {
    id: "n8",
    title: "Complaint Received",
    subtitle: "Your complaint has been logged and our team will review it shortly.",
    timeAgo: "2 hours ago",
    type: "complaint",
    actionText: "View Summary",
  },
  {
    id: "n9",
    title: "Transaction Confirmed",
    subtitle: "Your vehicle has been successfully booked. Pick-up Toyota Corolla 2026 on 30 May 2026.",
    timeAgo: "2 hours ago",
    type: "transaction",
    actionText: "View Receipt",
  },
];

export const NotificationsScreen = ({ navigation }: Props) => {
  const [viewState, setViewState] = useState<"onboarding" | "empty" | "populated">("populated");
  const [notifications, setNotifications] = useState<NotificationFeedItem[]>(INITIAL_NOTIFICATIONS);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [showComplaintSheet, setShowComplaintSheet] = useState(false);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteSelected = () => {
    setNotifications(notifications.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
    setIsBulkMode(false);
    setShowOptionsSheet(false);
  };

  const handleMarkAsReadSelected = () => {
    setNotifications(
      notifications.map((n) => (selectedIds.includes(n.id) ? { ...n, isRead: true } : n))
    );
    setSelectedIds([]);
    setIsBulkMode(false);
    setShowOptionsSheet(false);
  };

  // State 1: Permission Onboarding View
  if (viewState === "onboarding") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.centerContainer}>
          <Text style={styles.onboardingTitle}>Stay Updated</Text>
          <Text style={styles.onboardingSub}>
            Turn on notifications to receive updates about your bookings, vehicle status, and important alerts.
          </Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={() => setViewState("populated")}>
            <Text style={styles.primaryBtnText}>Enable Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setViewState("empty")}>
            <Text style={styles.secondaryBtnText}>Not Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // State 2: Empty Notifications View
  if (viewState === "empty" || notifications.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={() => setViewState("onboarding")} style={styles.backBtn}>
            <Ionicons name="settings-outline" size={22} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerContainer}>
          <View style={styles.bellCircle}>
            <Ionicons name="notifications-outline" size={32} color="#94A3B8" />
          </View>
          <Text style={styles.onboardingTitle}>No Notifications Yet</Text>
          <Text style={styles.onboardingSub}>
            You'll see updates about your bookings, trips, and support requests here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // State 3: Populated Notifications Feed
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>

        <TouchableOpacity
          onPress={() => {
            if (isBulkMode && selectedIds.length > 0) {
              setShowOptionsSheet(true);
            } else {
              setIsBulkMode(!isBulkMode);
            }
          }}
          style={styles.backBtn}
        >
          <Ionicons name="ellipsis-horizontal" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notificationCard, item.isRead && styles.readCard]}
            onPress={() => {
              if (isBulkMode) toggleSelect(item.id);
            }}
            activeOpacity={isBulkMode ? 0.8 : 1}
          >
            <View style={styles.cardHeaderRow}>
              {isBulkMode && (
                <TouchableOpacity onPress={() => toggleSelect(item.id)} style={{ marginRight: 10 }}>
                  <Ionicons
                    name={selectedIds.includes(item.id) ? "checkbox" : "square-outline"}
                    size={20}
                    color={selectedIds.includes(item.id) ? "#375DFB" : "#94A3B8"}
                  />
                </TouchableOpacity>
              )}

              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.type === "confirmed" && <Ionicons name="checkmark-circle" size={16} color="#21C650" style={{ marginLeft: 6 }} />}
                {item.type === "request" && <Ionicons name="checkmark-circle" size={16} color="#21C650" style={{ marginLeft: 6 }} />}
                {item.type === "transaction" && <Ionicons name="checkmark-circle" size={16} color="#21C650" style={{ marginLeft: 6 }} />}
                {item.type === "cancelled" && <Ionicons name="close-circle" size={16} color="#EF4444" style={{ marginLeft: 6 }} />}
              </View>

              <Text style={styles.timeAgo}>{item.timeAgo}</Text>
            </View>

            <Text style={styles.cardSub}>
              {item.subtitle}
              {item.linkText && (
                <Text style={styles.linkText} onPress={() => {}}>
                  {item.linkText}
                </Text>
              )}
            </Text>

            {/* Live Progress Bar indicator for driver */}
            {item.type === "progress" && (
              <View style={styles.progressRow}>
                <View style={[styles.progressSegment, styles.segmentActive]} />
                <View style={[styles.progressSegment, styles.segmentActive]} />
                <View style={[styles.progressSegment, styles.segmentActive]} />
                <View style={[styles.progressSegment, styles.segmentActive]} />
                <View style={[styles.progressSegment, styles.segmentInactive]} />
              </View>
            )}

            {/* Action Buttons */}
            {item.actionText && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  if (item.type === "complaint") setShowComplaintSheet(true);
                  else if (item.type === "confirmed") (navigation as any).navigate("MainTabs");
                }}
              >
                <Text style={styles.actionBtnText}>{item.actionText}</Text>
                {item.type === "coupon" && <Ionicons name="logo-facebook" size={14} color="#0F172A" style={{ marginLeft: 6 }} />}
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
      />

      {/* Complaint Details Sheet */}
      <ComplaintDetailsSheet
        visible={showComplaintSheet}
        onClose={() => setShowComplaintSheet(false)}
      />

      {/* Notification Bulk Options Sheet */}
      <NotificationOptionsModal
        visible={showOptionsSheet}
        onClose={() => setShowOptionsSheet(false)}
        onDeleteSelected={handleDeleteSelected}
        onMarkAsReadSelected={handleMarkAsReadSelected}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtn: { padding: 4 },
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },

  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
  bellCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#F8FAFC", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  onboardingTitle: { fontFamily: "DM Sans Bold", fontSize: 18, color: "#0F172A", fontWeight: "700", marginBottom: 8, textAlign: "center" },
  onboardingSub: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B", textAlign: "center", lineHeight: 20, marginBottom: 30 },

  primaryBtn: { width: "100%", backgroundColor: "#375DFB", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 12 },
  primaryBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
  secondaryBtn: { width: "100%", backgroundColor: "#F8FAFC", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  secondaryBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#94A3B8" },

  listContent: { paddingHorizontal: 16, paddingVertical: 12 },
  notificationCard: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  readCard: { opacity: 0.6 },

  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  titleRow: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 8 },
  cardTitle: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A", fontWeight: "700" },
  timeAgo: { fontFamily: "DM Sans", fontSize: 11, color: "#94A3B8" },

  cardSub: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B", lineHeight: 18, marginTop: 2 },
  linkText: { fontFamily: "DM Sans Bold", color: "#0F172A", textDecorationLine: "underline" },

  progressRow: { flexDirection: "row", gap: 4, marginTop: 12, marginBottom: 6 },
  progressSegment: { flex: 1, height: 4, borderRadius: 2 },
  segmentActive: { backgroundColor: "#375DFB" },
  segmentInactive: { backgroundColor: "#F1F5F9" },

  actionBtn: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  actionBtnText: { fontFamily: "DM Sans Bold", fontSize: 12, color: "#0F172A" },
});
