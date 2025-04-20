import ActivityIndicatorView from "@/components/activityIndicator/ActivityIndicatorView";
import { MenuItem } from "@/models/restaurant.model";
import { getMenuItems } from "@/store/reducers/restaurantReducer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getMenuItemCardCoverImage } from "@/utils/ImagePlaceholder";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, Platform, ScrollView } from "react-native";
import { Button, Card, Searchbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ToastManager, { Toast } from "toastify-react-native";

const RestaurantScreen = () => {
  const dispatch = useAppDispatch();
  const { selectedRestaurant, menuItems, loading, error } = useAppSelector(
    (state) => state.restaurant
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems);

  const testGetMenuItems = () => {
    dispatch(getMenuItems()).then((response) => {
      if (response.meta.requestStatus === "rejected") {
        Toast.error(error ?? "Failed to fetch menu items");
      }
    });
  };

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
    const filteredData = menuItems.filter((menuItem) =>
      menuItem.itemName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMenuItems(filteredData);
  };

  const handleAddToCart = (itemName: string) => {
    Toast.success(`${itemName} added to cart`);
  };

  const renderMenuItemCards = (filteredMenuItems: MenuItem[]) => {
    return filteredMenuItems.map((menuItem) => (
      <Card style={styles.card} key={menuItem.menuId}>
        <Card.Title title={menuItem.itemName} />
        <Card.Content>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text variant="bodyMedium">{menuItem.description}</Text>
            <Text variant="bodyLarge">${menuItem.price}</Text>
          </View>
        </Card.Content>
        <Card.Cover
          source={{
            uri: getMenuItemCardCoverImage(menuItem.menuId),
          }}
        />
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => handleAddToCart(menuItem.itemName)}
          >
            Add to cart
          </Button>
        </Card.Actions>
      </Card>
    ));
  };

  useEffect(() => {
    dispatch(getMenuItems()).then((response) => {
      if (response.meta.requestStatus === "rejected") {
        Toast.error(error ?? "Failed to fetch menu items");
        return;
      }
      setFilteredMenuItems(response?.payload);
    });
  }, []);

  if (loading) {
    return <ActivityIndicatorView />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ marginVertical: 16 }} variant="titleLarge">
          {selectedRestaurant?.name}
        </Text>
        <Searchbar
          style={styles.searchBar}
          placeholder="Search menu"
          onChangeText={handleSearchQuery}
          value={searchQuery}
        />

        <ScrollView style={{ marginBottom: 8 }}>
          {renderMenuItemCards(filteredMenuItems)}
        </ScrollView>

        <Button
          style={{ marginBottom: 8 }}
          mode="elevated"
          onPress={testGetMenuItems}
        >
          Test get menu items
        </Button>

        <Link href="/home" asChild>
          <Button mode="contained-tonal">Back to Home</Button>
        </Link>
      </View>
      <ToastManager />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Platform.OS === "web" ? 40 : 16,
    paddingVertical: Platform.OS === "web" ? 40 : 0,
  },
  searchBar: {
    marginBottom: Platform.OS === "web" ? 40 : 16,
  },
  card: {
    marginBottom: 16,
  },
});

export default RestaurantScreen;
