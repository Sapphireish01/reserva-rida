import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppBottomSheet } from "../ui/AppBottomSheet";

export interface DirectionsListModalProps {
  visible: boolean;
  onClose: () => void;
}

const MANEUVERS = [
  {
    id: "1",
    icon: "arrow-up-outline",
    title: "Head towards Kudirat Abiola Way",
    sub: "Pass by Tessy World Salon (on the right in 72m)",
    distance: "700 meters",
  },
  {
    id: "2",
    icon: "arrow-back-outline",
    title: "Turn left onto Allen Ave",
    sub: "",
    distance: "20 meters",
  },
  {
    id: "3",
    icon: "arrow-forward-outline",
    title: "Turn right onto Obafemi Awolowo Way",
    sub: "Pass by Seedoflifeventures(on the right)",
    distance: "300 meters",
  },
  {
    id: "4",
    icon: "arrow-up-outline",
    title: "Head towards Kudirat Abiola Way",
    sub: "Pass by Tessy World Salon (on the right in 72m)",
    distance: "700 meters",
  },
  {
    id: "5",
    icon: "arrow-back-outline",
    title: "Turn left onto Simbiat Abiola Way",
    sub: "",
    distance: "20 meters",
  },
];

export const DirectionsListModal: React.FC<DirectionsListModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title="Directions"
      maxHeight="80%"
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {MANEUVERS.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.iconBox}>
              <Ionicons name={item.icon as any} size={20} color="#64748B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              {!!item.sub && <Text style={styles.itemSub}>{item.sub}</Text>}
              <Text style={styles.distanceText}>{item.distance}</Text>
            </View>
          </View>
        ))}

        {/* Destination Arrival Item */}
        <View style={styles.itemRow}>
          <View style={styles.pinIconBox}>
            <Ionicons name="location-sharp" size={20} color="#375DFB" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>Seven and Eight Junction</Text>
            <Text style={styles.itemSub}>Murtala Mohammed Airport Road ,Mushin 100214, Lagos</Text>
          </View>
        </View>
      </ScrollView>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    marginTop: 2,
  },
  pinIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    marginTop: 2,
  },
  itemTitle: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A", fontWeight: "700" },
  itemSub: { fontFamily: "DM Sans", fontSize: 12, color: "#94A3B8", marginTop: 2 },
  distanceText: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B", marginTop: 6 },
});
