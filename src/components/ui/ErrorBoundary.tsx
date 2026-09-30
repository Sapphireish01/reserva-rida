import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { palette } from "../../theme/colors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("💥 [ErrorBoundary caught fatal error]:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="warning-outline" size={40} color={palette.error[600]} />
            </View>

            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              An unexpected error occurred in the application. Don't worry, your data is safe.
            </Text>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={this.handleReset}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Reload application"
            >
              <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.resetButtonText}>Reload Screen</Text>
            </TouchableOpacity>

            {__DEV__ && this.state.error ? (
              <View style={styles.devContainer}>
                <Text style={styles.devTitle}>Developer Diagnostics:</Text>
                <Text style={styles.devErrorText}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo?.componentStack ? (
                  <Text style={styles.devStackText}>
                    {this.state.errorInfo.componentStack.trim()}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: palette.error[50],
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: palette.error[200],
    marginBottom: 20,
  },
  title: {
    fontFamily: "DM Sans Bold",
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    lineHeight: 22,
    color: "#64748B",
    textAlign: "center",
    maxWidth: 320,
    marginBottom: 28,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#375DFB",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minHeight: 48,
    minWidth: 160,
  },
  resetButtonText: {
    fontFamily: "DM Sans Bold",
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  devContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: palette.neutral[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.neutral[200],
    width: "100%",
  },
  devTitle: {
    fontFamily: "DM Sans Bold",
    fontSize: 13,
    fontWeight: "700",
    color: palette.error[600],
    marginBottom: 6,
  },
  devErrorText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#0F172A",
    marginBottom: 8,
  },
  devStackText: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "#64748B",
  },
});
