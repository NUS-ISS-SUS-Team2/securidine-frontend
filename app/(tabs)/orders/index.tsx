import { getOrders } from "@/store/reducers/orderReducer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import ToastManager, { Toast } from "toastify-react-native";

const OrdersScreen = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.order);

  const testGetOrders = () => {
    dispatch(getOrders()).then((response) => {
      if (response.meta.requestStatus === "rejected") {
        Toast.error(error || "Failed to fetch orders");
      }
    });
  };

  return (
    <View>
      <Text>Orders page</Text>
      <Button mode="contained" onPress={testGetOrders}>
        Test get orders
      </Button>
      <ToastManager />
    </View>
  );
};

export default OrdersScreen;
