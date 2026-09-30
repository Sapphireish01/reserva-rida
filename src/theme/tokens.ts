import { colors, palette } from "./colors";

export const buttonTokens = {
  sizes: {
    sm: {
      height: 38,
      paddingHorizontal: 16,
      borderRadius: 10,
      fontSize: 13,
    },
    md: {
      height: 48,
      paddingHorizontal: 20,
      borderRadius: 12,
      fontSize: 15,
    },
    lg: {
      height: 54,
      paddingHorizontal: 24,
      borderRadius: 10,
      fontSize: 16,
    },
  },
  variants: {
    primary: {
      backgroundColor: colors.primary,
      textColor: palette.neutral[0],
      borderColor: "transparent",
      disabledBg: "#F6F8FA",
      disabledText: "#CDD0D5",
    },
    secondary: {
      backgroundColor: "#CDD0D5",
      textColor: palette.slate[900],
      borderColor: "transparent",
      disabledBg: palette.slate[100],
      disabledText: palette.slate[400],
    },
    outline: {
      backgroundColor: "transparent",
      textColor: colors.primary,
      borderColor: colors.primary,
      disabledBg: "transparent",
      disabledText: palette.slate[300],
    },
    ghost: {
      backgroundColor: "transparent",
      textColor: palette.slate[700],
      borderColor: "transparent",
      disabledBg: "transparent",
      disabledText: palette.slate[300],
    },
    destructive: {
      backgroundColor: palette.error[600],
      textColor: palette.neutral[0],
      borderColor: "transparent",
      disabledBg: palette.error[200],
      disabledText: palette.error[400],
    },
  },
};

export const inputTokens = {
  height: 50,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.border,
  focusedBorderColor: colors.primary,
  errorBorderColor: colors.error,
  backgroundColor: palette.neutral[0],
  placeholderColor: palette.slate[400],
  textColor: palette.slate[900],
  labelColor: palette.slate[700],
};

export const modalTokens = {
  backdropColor: "rgba(15, 23, 42, 0.5)",
  borderRadius: 24,
  dragIndicatorColor: palette.slate[300],
  backgroundColor: palette.neutral[0],
};

// Design & Styling System Specification Tokens

export const headerTokens = {
  container: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    padding: 4, // 24px icon + 4px padding each side = 32px total width
  },
  title: {
    fontFamily: "DM Sans Bold",
    fontSize: 20,
    fontWeight: "600" as const,
    color: "#0F172A",
    textAlign: "center" as const,
  },
  rightSpacer: {
    width: 32,
  },
};

export const emptyStateTokens = {
  container: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    lineHeight: 17,
    fontWeight: "500" as const,
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center" as const,
  },
  subtitle: {
    fontFamily: "DM Sans",
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
    marginBottom: 12,
    maxWidth: 328,
    textAlign: "center" as const,
  },
  button: {
    backgroundColor: "#375DFB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: "DM Sans Bold",
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
};

export const navigationCardTokens = {
  guidanceCard: {
    backgroundColor: "#00382E", // Dark Emerald-Teal
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  towardLabel: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#A7F3D0",
  },
  streetNameText: {
    fontFamily: "DM Sans Bold",
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  starCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E2E8F0",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  subManeuverPill: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    alignSelf: "flex-start" as const,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
};

export const mapControlTokens = {
  circleDarkBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1E293B",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  reportPillBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    backgroundColor: "#1E293B",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    elevation: 6,
  },
};

export const bottomSheetActionTokens = {
  bottomCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center" as const,
  },
  stateTitleText: {
    fontFamily: "DM Sans Bold",
    fontSize: 19,
    fontWeight: "700" as const,
    color: "#0F172A",
  },
  etaBlueText: {
    fontFamily: "DM Sans Bold",
    fontSize: 19,
    fontWeight: "700" as const,
    color: "#2F60FF",
  },
  primaryBtn: {
    flex: 1,
    height: 54,
    backgroundColor: "#305CFF",
    borderRadius: 16,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  primaryBtnLeaving: {
    backgroundColor: "#EBF2FF",
    elevation: 0,
  },
  callSquareBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#305CFF",
    backgroundColor: "#FFFFFF",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  messageSquareBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#EBF2FF",
    borderWidth: 0,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
};

export const timelineManifestTokens = {
  sectionHeaderStrip: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 12,
  },
  sectionHeaderText: {
    fontFamily: "DM Sans",
    fontSize: 13,
    fontWeight: "500" as const,
    color: "#71717A",
  },
  checkedInPill: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#86EFAC",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  checkedInText: {
    fontFamily: "DM Sans Bold",
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#16A34A",
  },
  dashedConnector: {
    width: 1,
    height: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed" as const,
    marginLeft: 4,
    marginVertical: 2,
  },
};

export const ratingTokens = {
  routePill: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  passengerCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: 14,
  },
  textareaContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 16,
    minHeight: 180,
    justifyContent: "space-between" as const,
  },
  submitButtonStates: {
    disabled: {
      backgroundColor: "#F8FAFC",
      borderWidth: 1,
      borderColor: "#E2E8F0",
      textColor: "#CBD5E1",
    },
    active: {
      backgroundColor: "#3B66FF",
      borderWidth: 0,
      borderColor: "transparent",
      textColor: "#FFFFFF",
    },
    loading: {
      backgroundColor: "#3B66FF",
      borderWidth: 0,
      borderColor: "transparent",
      textColor: "#FFFFFF",
    },
    submitted: {
      backgroundColor: "#3B66FF",
      borderWidth: 0,
      borderColor: "transparent",
      textColor: "#FFFFFF",
    },
  },
};
