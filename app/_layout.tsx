import "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { PaperProvider } from "react-native-paper";
import { KeyboardProvider } from "react-native-keyboard-controller";
import React, { useEffect } from "react";
import { SessionProvider } from "@/contexts/SessionContext";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider>
      <KeyboardProvider>
        <SessionProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </SessionProvider>
      </KeyboardProvider>
    </PaperProvider>
  );
};

export default RootLayout;
