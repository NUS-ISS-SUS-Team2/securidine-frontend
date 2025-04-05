import axiosInstance from "@/utils/AxiosInstance";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";

const OrdersScreen = () => {
  const testGetOrders = () => {
    axiosInstance
      .get("https://api.nusiss-sus-project.online/prod/order/getAllOrders")
      .then((response) => {
        console.log("Response data:", response.data);
      });
  };

  return (
    <View>
      <Text>Orders page</Text>
      <Button mode="contained" onPress={testGetOrders}>
        Test get orders
      </Button>
    </View>
  );
};

export default OrdersScreen;
