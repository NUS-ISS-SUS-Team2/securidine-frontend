import ActivityIndicatorView from "@/components/activityIndicator/ActivityIndicatorView";
import { Restaurant } from "@/models/restaurant.model";
import {
  getRestaurants,
  setSelectedRestaurant,
} from "@/store/reducers/restaurantReducer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getRestaurantCardCoverImage } from "@/utils/ImagePlaceholder";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, Platform, ScrollView } from "react-native";
import { Button, Card, Searchbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ToastManager, { Toast } from "toastify-react-native";

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const { restaurants, loading, error } = useAppSelector(
    (state) => state.restaurant
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);

  const testGetRestaurants = () => {
    dispatch(getRestaurants()).then((response) => {
      if (response.meta.requestStatus === "rejected") {
        Toast.error(error ?? "Failed to fetch restaurants");
      }
    });
  };

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
    const filteredData = restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRestaurants(filteredData);
  };

  const renderRestaurantCards = (filteredRestaurants: Restaurant[]) => {
    return filteredRestaurants.map((restaurant) => (
      <Card style={styles.card} key={restaurant.restaurantId}>
        <Card.Title title={restaurant.name} />
        <Card.Content>
          <Text style={{ marginBottom: 8 }} variant="bodyMedium">
            {restaurant.location}
          </Text>
        </Card.Content>
        <Card.Cover
          source={{
            uri: getRestaurantCardCoverImage(restaurant.restaurantId),
          }}
        />
        <Card.Actions>
          <Link href={`/restaurants/${restaurant.restaurantId}`} asChild>
            <Button
              mode="contained"
              onPress={() => dispatch(setSelectedRestaurant(restaurant))}
            >
              View menu
            </Button>
          </Link>
        </Card.Actions>
      </Card>
    ));
  };

  useEffect(() => {
    dispatch(getRestaurants()).then((response) => {
      if (response.meta.requestStatus === "rejected") {
        Toast.error(error ?? "Failed to fetch restaurants");
        return;
      }
      setFilteredRestaurants(response?.payload);
    });
  }, []);

  if (loading) {
    return <ActivityIndicatorView />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Searchbar
          style={styles.searchBar}
          placeholder="Search restaurants"
          onChangeText={handleSearchQuery}
          value={searchQuery}
        />

        <ScrollView style={{ marginBottom: 8 }}>
          {renderRestaurantCards(filteredRestaurants)}
        </ScrollView>

        <Button mode="elevated" onPress={testGetRestaurants}>
          Test get restaurants
        </Button>
      </View>
      <ToastManager useModal={true} />
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

export default HomeScreen;
