export type ErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "UNKNOWN";

export interface AppError {
  code: ErrorCode;
  title: string;
  message: string;
  statusCode?: number;
  fieldErrors?: Record<string, string[]>;
  isRetryable: boolean;
  originalError?: unknown;
}

export type ToastType = "error" | "warning" | "success" | "info";

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number; // ms, defaults to 4000
  action?: ToastAction;
}
