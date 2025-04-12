import { Stack } from "expo-router";

const RestaurantLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
    </Stack>
  );
};

export default RestaurantLayout;
