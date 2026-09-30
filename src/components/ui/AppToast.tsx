import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useToastStore } from "../../state/toastStore";
import { palette } from "../../theme/colors";

const TYPE_CONFIG = {
  error: {
    bg: palette.error[50],
    border: palette.error[200],
    titleColor: palette.error[900],
    messageColor: palette.error[800],
    iconColor: palette.error[600],
    iconName: "alert-circle" as const,
  },
  warning: {
    bg: palette.warning[50],
    border: palette.warning[200],
    titleColor: palette.warning[900],
    messageColor: palette.warning[800],
    iconColor: palette.warning[600],
    iconName: "warning" as const,
  },
  success: {
    bg: palette.success[50],
    border: palette.success[200],
    titleColor: palette.success[900],
    messageColor: palette.success[800],
    iconColor: palette.success[600],
    iconName: "checkmark-circle" as const,
  },
  info: {
    bg: palette.information[50],
    border: palette.information[200],
    titleColor: palette.information[900],
    messageColor: palette.information[800],
    iconColor: palette.information[600],
    iconName: "information-circle" as const,
  },
};

export const AppToast: React.FC = () => {
  const insets = useSafeAreaInsets();
  const toast = useToastStore((s) => s.toast);
  const hideToast = useToastStore((s) => s.hideToast);

  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (toast) {
      // Animate entry
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      const duration = toast.duration ?? 4000;
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, duration);
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [toast]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      hideToast();
    });
  };

  if (!toast) return null;

  const config = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.overlay,
        {
          top: insets.top + 8,
          transform: [{ translateY }],
          opacity,
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: config.bg,
            borderColor: config.border,
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={config.iconName} size={22} color={config.iconColor} />
        </View>

        <View style={styles.textContainer}>
          {toast.title ? (
            <Text style={[styles.title, { color: config.titleColor }]}>
              {toast.title}
            </Text>
          ) : null}
          <Text style={[styles.message, { color: config.messageColor }]}>
            {toast.message}
          </Text>

          {toast.action ? (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                toast.action?.onPress();
                handleDismiss();
              }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={toast.action.label}
            >
              <Text style={[styles.actionText, { color: config.iconColor }]}>
                {toast.action.label}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleDismiss}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
        >
          <Ionicons name="close" size={18} color={config.titleColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 1,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: 2,
  },
  message: {
    fontFamily: "DM Sans",
    fontSize: 13,
    lineHeight: 18,
  },
  actionButton: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  actionText: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
    minHeight: 44,
  },
});
