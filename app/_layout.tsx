import "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";
import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { KeyboardProvider } from "react-native-keyboard-controller";
import React, { useEffect } from "react";
import { SessionProvider, useSession } from "@/contexts/SessionContext";
import { Platform } from "react-native";
import { Provider as StoreProvider } from "react-redux";
import store from "@/store/store";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

const InitialLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const segments = useSegments();
  const router = useRouter();
  const { getIsAuthenticated } = useSession();

  useEffect(() => {
    if (!loaded) {
      return;
    }

    SplashScreen.hideAsync();

    const isAuthenticated = getIsAuthenticated();
    console.log("[InitialLayout] isAuthenticated: ", isAuthenticated);
    console.log("[InitialLayout] segments: ", segments);

    if (segments[0] === "logout") {
      console.log("[InitialLayout] /logout");
    } else if (!isAuthenticated && segments[0] !== "login") {
      console.log("[InitialLayout] Redirecting to /login");
      router.replace("/login");
    } else if (isAuthenticated && segments[0] !== "(tabs)") {
      console.log("[InitialLayout] Redirecting to /(tabs)/home");
      router.replace("/(tabs)/home");
    }
  }, [loaded, getIsAuthenticated]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        {Platform.OS === "web" ? (
          <style type="text/css">{`
          @font-face {
            font-family: 'MaterialCommunityIcons';
            src: url(${require("react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf")}) format('truetype');
            }
            `}</style>
        ) : null}
        <KeyboardProvider>
          <SessionProvider>
            <InitialLayout />
          </SessionProvider>
        </KeyboardProvider>
      </PaperProvider>
    </StoreProvider>
  );
};

export default RootLayout;
