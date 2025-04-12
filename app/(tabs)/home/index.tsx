import ActivityIndicatorView from "@/components/activityIndicator/ActivityIndicatorView";
import { getRestaurants } from "@/store/reducers/restaurantReducer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";
import ToastManager from "toastify-react-native/components/ToastManager";

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const { restaurants, loading, error } = useAppSelector(
    (state) => state.restaurant
  );

  const testGetRestaurants = () => {
    dispatch(getRestaurants()).then((response) => {
      if (response.meta.requestStatus === "rejected") {
        Toast.error(error ?? "Failed to fetch restaurants");
      }
    });
  };

  if (loading) {
    return <ActivityIndicatorView />;
  }

  return (
    <SafeAreaView>
      <View>
        <Text>Home page</Text>
        <Button mode="contained" onPress={testGetRestaurants}>
          Test get restaurants
        </Button>
        <ToastManager />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
