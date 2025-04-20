import { Stack } from "expo-router";

const AccountLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
      />
    </Stack>
  );
};

export default AccountLayout;
