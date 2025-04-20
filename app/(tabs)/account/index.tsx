import Logout from "@/components/auth/logout/Logout";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect } from "react";
import { View } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { getUserInfo } from "@/store/reducers/userReducer";
import ActivityIndicatorView from "@/components/activityIndicator/ActivityIndicatorView";
import ToastManager, { Toast } from "toastify-react-native";

SplashScreen.preventAutoHideAsync();

const AccountScreen = () => {
  const { name, email, loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserInfo()).then((response) => {
      if (response.meta.requestStatus === "rejected") {
        Toast.error("Failed to fetch user info");
      }
    });
  }, []);

  if (loading) {
    return <ActivityIndicatorView />;
  }

  return (
    <SafeAreaView>
      <View
        style={{
          padding: 24,
        }}
      >
        <Card
          mode="elevated"
          style={{
            marginBottom: 16,
          }}
        >
          <Card.Content
            style={{
              alignItems: "center",
            }}
          >
            <Avatar.Icon
              icon={({ color, size }) => (
                <Ionicons name="person" size={size} color={color} />
              )}
              style={{
                marginBottom: 8,
              }}
            />
            <Text variant="titleMedium">{name}</Text>
            <Text variant="bodyMedium">{email}</Text>
          </Card.Content>
        </Card>
        <Logout />
      </View>
      <ToastManager useModal={true} />
    </SafeAreaView>
  );
};

export default AccountScreen;
