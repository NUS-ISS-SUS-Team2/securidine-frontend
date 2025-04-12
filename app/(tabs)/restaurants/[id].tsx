import ActivityIndicatorView from "@/components/activityIndicator/ActivityIndicatorView";
import { getMenuItems } from "@/store/reducers/restaurantReducer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Link, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";
import ToastManager from "toastify-react-native/components/ToastManager";

const RestaurantScreen = () => {
  const dispatch = useAppDispatch();
  const { restaurantId } = useLocalSearchParams();
  const { menuItems, loading, error } = useAppSelector(
    (state) => state.restaurant
  );

  const testGetMenuItems = () => {
    dispatch(getMenuItems()).then((response) => {
      if (response.meta.requestStatus === "rejected") {
        Toast.error(error ?? "Failed to fetch menu items");
      }
    });
  };

  if (loading) {
    return <ActivityIndicatorView />;
  }

  return (
    <SafeAreaView>
      <View>
        <Text>Restaurant {restaurantId} page</Text>
        <Button mode="contained" onPress={testGetMenuItems}>
          Test get menu items
        </Button>
        
        <Link href="/home" asChild>
          <Button mode="outlined">Back to Home</Button>
        </Link>
        <ToastManager />
      </View>
    </SafeAreaView>
  );
};

export default RestaurantScreen;
