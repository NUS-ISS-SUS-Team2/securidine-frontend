import ActivityIndicatorView from "@/components/activityIndicator/ActivityIndicatorView";
import { Order } from "@/models/order.model";
import { getOrders } from "@/store/reducers/orderReducer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { Platform, View, StyleSheet } from "react-native";
import { Button, DataTable, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

const OrdersScreen = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.order);
  const [page, setPage] = useState(0);
  const numberOfItemsPerPageList = [5, 10, 15, 20];
  const [itemsPerPage, setItemsPerPage] = useState(numberOfItemsPerPageList[0]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, orders.length);

  const testGetOrders = () => {
    dispatch(getOrders()).then((response) => {
      if (response.meta.requestStatus === "rejected") {
        Toast.error(error ?? "Failed to fetch orders");
      }
    });
  };

  const renderOrderRows = (orders: Order[]) => {
    return orders.slice(from, to).map((order) => (
      <DataTable.Row key={order.orderId}>
        <DataTable.Cell>{order.orderId}</DataTable.Cell>
        <DataTable.Cell>{order.customerName}</DataTable.Cell>
        <DataTable.Cell>{order.deliveryAddress}</DataTable.Cell>
        <DataTable.Cell>{order.orderDate}</DataTable.Cell>
        <DataTable.Cell>${order.totalPrice}</DataTable.Cell>
      </DataTable.Row>
    ));
  };

  useEffect(() => {
    dispatch(getOrders()).then((response) => {
      if (response.meta.requestStatus === "rejected") {
        Toast.error(error ?? "Failed to fetch orders");
      }
    });
  }, []);

  if (loading) {
    return <ActivityIndicatorView />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ marginVertical: 16 }} variant="titleLarge">
          Orders
        </Text>

        <DataTable style={{ marginBottom: 16 }}>
          <DataTable.Header>
            <DataTable.Title>Order ID</DataTable.Title>
            <DataTable.Title>Customer Name</DataTable.Title>
            <DataTable.Title>Delivery Address</DataTable.Title>
            <DataTable.Title>Order Date</DataTable.Title>
            <DataTable.Title>Total Price</DataTable.Title>
          </DataTable.Header>
          {renderOrderRows(orders)}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(orders.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`Page ${page + 1} of ${Math.ceil(
              orders.length / itemsPerPage
            )}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            selectPageDropdownLabel={"Rows per page"}
            showFastPaginationControls
          />
        </DataTable>
        <Button mode="elevated" onPress={testGetOrders}>
          Test get orders
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Platform.OS === "web" ? 40 : 16,
    paddingVertical: Platform.OS === "web" ? 40 : 0,
  },
});

export default OrdersScreen;
