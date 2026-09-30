import { create } from "zustand";
import { ToastAction, ToastItem, ToastType } from "../types/error";
import { normalizeApiError } from "../utils/errorUtils";

interface ToastState {
  toast: ToastItem | null;
  showToast: (params: {
    type: ToastType;
    message: string;
    title?: string;
    duration?: number;
    action?: ToastAction;
  }) => void;
  showError: (error: unknown, action?: ToastAction) => void;
  showSuccess: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toast: null,

  showToast: ({ type, message, title, duration = 4000, action }) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    set({
      toast: {
        id,
        type,
        message,
        title,
        duration,
        action,
      },
    });
  },

  showError: (error, action) => {
    const normalized = normalizeApiError(error);
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    set({
      toast: {
        id,
        type: "error",
        title: normalized.title,
        message: normalized.message,
        duration: 4500,
        action,
      },
    });
  },

  showSuccess: (message, title = "Success") => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    set({
      toast: {
        id,
        type: "success",
        title,
        message,
        duration: 3500,
      },
    });
  },

  showWarning: (message, title = "Warning") => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    set({
      toast: {
        id,
        type: "warning",
        title,
        message,
        duration: 4000,
      },
    });
  },

  showInfo: (message, title = "Notice") => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    set({
      toast: {
        id,
        type: "info",
        title,
        message,
        duration: 3500,
      },
    });
  },

  hideToast: () => set({ toast: null }),
}));
