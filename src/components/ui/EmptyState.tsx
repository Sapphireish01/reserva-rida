import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface EmptyStateProps {
  title: string;
  subtitle?: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  buttonStyle?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  buttonTitle,
  onButtonPress,
  icon,
  containerStyle,
  titleStyle,
  subtitleStyle,
  buttonStyle,
}) => {
  return (
    <View style={[styles.emptyContainer, containerStyle]}>
      {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}

      <Text style={[styles.emptyTitle, titleStyle]}>{title}</Text>

      {subtitle ? (
        <Text style={[styles.emptySubtitle, subtitleStyle]}>{subtitle}</Text>
      ) : null}

      {buttonTitle && onButtonPress ? (
        <TouchableOpacity
          style={[styles.emptyButton, buttonStyle]}
          onPress={onButtonPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={buttonTitle}
        >
          <Text style={styles.emptyButtonText}>{buttonTitle}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
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
  emptyTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    lineHeight: 17,
    fontWeight: "500",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: "DM Sans",
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
    marginBottom: 12,
    maxWidth: 328,
    textAlign: "center",
  },
  emptyButton: {
    backgroundColor: "#375DFB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyButtonText: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
