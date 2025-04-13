import { Stack } from "expo-router";

const LogoutLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default LogoutLayout;
