import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "../../theme/colors";

export interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  showBack = true,
  rightAction,
  containerStyle,
  titleStyle,
}) => {
  return (
    <View style={[styles.header, containerStyle]}>
      {showBack ? (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerRightSpacer} />
      )}

      <Text style={[styles.headerTitle, titleStyle]} numberOfLines={1}>
        {title}
      </Text>

      {rightAction ? (
        <View style={styles.rightActionWrapper}>{rightAction}</View>
      ) : (
        <View style={styles.headerRightSpacer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    padding: 4, // 24px icon + 4px padding each side = 32px total width
  },
  headerTitle: {
    flex: 1,
    fontFamily: "DM Sans Bold",
    fontSize: 20,
    fontWeight: "600",
    color: "#0F172A",
    textAlign: "center",
  },
  headerRightSpacer: {
    width: 32,
  },
  rightActionWrapper: {
    minWidth: 32,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
