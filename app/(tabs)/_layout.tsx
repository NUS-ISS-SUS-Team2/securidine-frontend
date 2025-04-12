import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Platform } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarPosition: Platform.OS === "web" ? "left" : "bottom",
        tabBarVariant: Platform.OS === "web" ? "material" : "uikit",
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: "Home",
          headerShown: Platform.OS !== "web",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          headerTitle: "Orders",
          headerShown: Platform.OS !== "web",
          tabBarLabel: "Orders",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          headerTitle: "Account",
          headerShown: Platform.OS !== "web",
          tabBarLabel: "Account",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="restaurants"
        options={{
          headerShown: false,
          href: null,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
