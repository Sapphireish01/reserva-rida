import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppBottomSheet } from "../ui/AppBottomSheet";

export interface ComplaintDetailsSheetProps {
  visible: boolean;
  onClose: () => void;
  complaint?: {
    title: string;
    category: string;
    description: string;
    fileName?: string;
    fileSize?: string;
  };
}

export const ComplaintDetailsSheet: React.FC<ComplaintDetailsSheetProps> = ({
  visible,
  onClose,
  complaint = {
    title: "Tyre Problems",
    category: "Payment Issues",
    description: "Still stuff about the payment",
    fileName: "Issue.png",
    fileSize: "120 KB",
  },
}) => {
  return (
    <AppBottomSheet visible={visible} onClose={onClose} showCloseButton={false} maxHeight="75%">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{complaint.title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Category */}
        <Text style={styles.sectionLabel}>Category</Text>
        <Text style={styles.valueText}>{complaint.category}</Text>

        {/* Description */}
        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Description</Text>
        <Text style={styles.valueText}>{complaint.description}</Text>

        {/* Attachment Card */}
        {complaint.fileName && (
          <View style={styles.attachmentCard}>
            <View style={styles.pngIconBox}>
              <Text style={styles.pngText}>PNG</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.fileName}>{complaint.fileName}</Text>
              <Text style={styles.fileSize}>{complaint.fileSize}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontFamily: "DM Sans Bold", fontSize: 18, color: "#0F172A", fontWeight: "700" },
  cancelText: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B" },

  sectionLabel: { fontFamily: "DM Sans Bold", fontSize: 12, color: "#94A3B8", marginBottom: 4 },
  valueText: { fontFamily: "DM Sans", fontSize: 14, color: "#64748B" },

  attachmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pngIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BEDBFF",
  },
  pngText: { fontFamily: "DM Sans Bold", fontSize: 12, color: "#375DFB" },
  fileName: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A" },
  fileSize: { fontFamily: "DM Sans", fontSize: 12, color: "#94A3B8", marginTop: 2 },
});
