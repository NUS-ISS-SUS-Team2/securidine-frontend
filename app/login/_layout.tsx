import { Stack } from "expo-router";

const LoginLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="callback" />
    </Stack>
  );
};

export default LoginLayout;
