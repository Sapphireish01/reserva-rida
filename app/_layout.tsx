import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { Slot } from "expo-router";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { useFonts, Diplomata_400Regular } from "@expo-google-fonts/diplomata";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useToastStore } from "../src/state/toastStore";
import { AppToast, ErrorBoundary } from "../src/components/ui";

LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // If data already exists, background refresh failed: notify user non-intrusively
      if (query.state.data !== undefined) {
        useToastStore.getState().showError(error);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (!(mutation.meta as any)?.suppressToast) {
        useToastStore.getState().showError(error);
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Diplomata: Diplomata_400Regular,
    Diplomata_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Slot />
          <AppToast />
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}



