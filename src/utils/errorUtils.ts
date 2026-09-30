import { AppError, ErrorCode } from "../types/error";

/**
 * Parses any backend error response body into human-readable field errors
 * and a unified primary error message.
 */
function extractBackendDetails(data: any): {
  primaryMessage: string;
  fieldErrors?: Record<string, string[]>;
} {
  if (!data) {
    return { primaryMessage: "An unexpected response was received." };
  }

  if (typeof data === "string") {
    return { primaryMessage: data };
  }

  if (typeof data === "object") {
    // If standard detail or message field exists
    if (typeof data.detail === "string") {
      return { primaryMessage: data.detail };
    }
    if (typeof data.message === "string") {
      return { primaryMessage: data.message };
    }
    if (typeof data.error === "string") {
      return { primaryMessage: data.error };
    }

    // Handle non_field_errors array
    if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
      return { primaryMessage: data.non_field_errors.join(", ") };
    }

    // Handle field error dictionary (e.g. { phone_number: ["Already registered"] })
    const fieldErrors: Record<string, string[]> = {};
    const messages: string[] = [];

    for (const [key, value] of Object.entries(data)) {
      const formattedKey = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      if (Array.isArray(value)) {
        const errorStrings = value.map((v) => (typeof v === "string" ? v : JSON.stringify(v)));
        fieldErrors[key] = errorStrings;
        messages.push(`${formattedKey}: ${errorStrings.join(", ")}`);
      } else if (typeof value === "string") {
        fieldErrors[key] = [value];
        messages.push(`${formattedKey}: ${value}`);
      }
    }

    if (messages.length > 0) {
      return {
        primaryMessage: messages[0],
        fieldErrors,
      };
    }

    return { primaryMessage: JSON.stringify(data) };
  }

  return { primaryMessage: "An unexpected error occurred." };
}

/**
 * Normalizes any error (Axios, Network, Runtime, or String) into a standardized AppError.
 */
export function normalizeApiError(error: unknown): AppError {
  if (!error) {
    return {
      code: "UNKNOWN",
      title: "Unknown Error",
      message: "An unexpected error occurred. Please try again.",
      isRetryable: true,
      originalError: error,
    };
  }

  const anyErr = error as any;

  // Check for Network Error or Timeout
  if (
    anyErr.code === "ECONNABORTED" ||
    anyErr.message === "Network Error" ||
    anyErr.name === "AxiosError" && !anyErr.response
  ) {
    const isTimeout = anyErr.code === "ECONNABORTED" || anyErr.message?.toLowerCase().includes("timeout");
    return {
      code: isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
      title: isTimeout ? "Connection Timed Out" : "No Internet Connection",
      message: isTimeout
        ? "The server took too long to respond. Please check your network and try again."
        : "Please verify your Wi-Fi or cellular network connection and try again.",
      isRetryable: true,
      originalError: error,
    };
  }

  // Axios HTTP Response Error
  if (anyErr.response) {
    const status = anyErr.response.status as number;
    const { primaryMessage, fieldErrors } = extractBackendDetails(anyErr.response.data);

    let code: ErrorCode = "UNKNOWN";
    let title = "Error";
    let isRetryable = false;

    switch (status) {
      case 400:
        code = "VALIDATION_ERROR";
        title = "Invalid Request";
        break;
      case 401:
        code = "UNAUTHORIZED";
        title = "Session Expired";
        break;
      case 403:
        code = "FORBIDDEN";
        title = "Access Denied";
        break;
      case 404:
        code = "NOT_FOUND";
        title = "Not Found";
        break;
      case 429:
        code = "SERVER_ERROR";
        title = "Too Many Requests";
        isRetryable = true;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        code = "SERVER_ERROR";
        title = "Server Unavailable";
        isRetryable = true;
        break;
      default:
        code = "UNKNOWN";
        title = "Request Failed";
        isRetryable = status >= 500;
        break;
    }

    return {
      code,
      title,
      message: primaryMessage,
      statusCode: status,
      fieldErrors,
      isRetryable,
      originalError: error,
    };
  }

  // Standard Error instance
  if (error instanceof Error) {
    return {
      code: "UNKNOWN",
      title: "Operation Failed",
      message: error.message || "An unexpected error occurred. Please try again.",
      isRetryable: true,
      originalError: error,
    };
  }

  // Raw string
  if (typeof error === "string") {
    return {
      code: "UNKNOWN",
      title: "Notice",
      message: error,
      isRetryable: true,
      originalError: error,
    };
  }

  return {
    code: "UNKNOWN",
    title: "Unexpected Error",
    message: "Something went wrong. Please try again.",
    isRetryable: true,
    originalError: error,
  };
}
