import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppLoader } from "./AppLoader";
import { palette } from "../../theme/colors";

export interface ErrorStateProps {
  title?: string;
  subtitle?: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
  loading?: boolean;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  buttonStyle?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Unable to Load Data",
  subtitle = "We encountered a problem while fetching this information. Please check your connection and try again.",
  buttonTitle = "Try Again",
  onButtonPress,
  loading = false,
  icon,
  containerStyle,
  titleStyle,
  subtitleStyle,
  buttonStyle,
}) => {
  return (
    <View style={[styles.errorContainer, containerStyle]}>
      {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}

      <Text style={[styles.errorTitle, titleStyle]}>{title}</Text>

      {subtitle ? (
        <Text style={[styles.errorSubtitle, subtitleStyle]}>{subtitle}</Text>
      ) : null}

      {buttonTitle && onButtonPress ? (
        <TouchableOpacity
          style={[styles.retryButton, buttonStyle]}
          onPress={onButtonPress}
          disabled={loading}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={buttonTitle}
        >
          {loading ? (
            <AppLoader size={18} />
          ) : (
            <View style={styles.buttonContent}>
              <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.retryButtonText}>{buttonTitle}</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  iconWrapper: {
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  defaultIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.error[50],
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: palette.error[200],
  },
  errorTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubtitle: {
    fontFamily: "DM Sans",
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
    marginBottom: 20,
    maxWidth: 320,
    textAlign: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#375DFB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 44,
    minWidth: 120,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  retryButtonText: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
