import { Stack } from "expo-router";
import { Platform } from "react-native";

const LoginLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: Platform.OS !== "web" }}>  
      <Stack.Screen name="index" />
      <Stack.Screen name="callback" />
    </Stack>
  );
};

export default LoginLayout;
