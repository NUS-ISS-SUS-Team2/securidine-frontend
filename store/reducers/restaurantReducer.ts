import { MenuItem, Restaurant } from "@/models/restaurant.model";
import axiosInstance from "@/utils/AxiosInstance";
import { createAsyncThunk, createSlice, isPending } from "@reduxjs/toolkit";

interface RestaurantState {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null | undefined;
}

const initialState: RestaurantState = {
  restaurants: [],
  selectedRestaurant: null,
  menuItems: [],
  loading: false,
  error: null,
};

export const getRestaurants = createAsyncThunk("restaurant/getRestaurants", async () => {
  const response = await axiosInstance.get(
    "https://api.nusiss-sus-project.online/prod/restaurant/getAllRestaurants"
  );
  return response.data;
});

export const getMenuItems = createAsyncThunk("restaurant/getMenuItems", async () => {
  const response = await axiosInstance.get(
    "https://api.nusiss-sus-project.online/prod/menu/getAllMenuItems"
  );
  return response.data;
});

export const restaurantSlice = createSlice({
  name: "restaurant",
  initialState: initialState,
  reducers: {
    setSelectedRestaurant: (state, action) => {
      state.selectedRestaurant = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRestaurants.fulfilled, (state, action) => {
        state.restaurants = action.payload;
        state.loading = false;
      })
      .addCase(getRestaurants.rejected, (state, action) => {
        console.log("Error fetching restaurants:", action);
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getMenuItems.fulfilled, (state, action) => {
        state.menuItems = action.payload;
        state.loading = false;
      })
      .addCase(getMenuItems.rejected, (state, action) => {
        console.log("Error fetching menu items:", action);
        state.loading = false;
        state.error = action.error.message;
      })
      .addMatcher(isPending(getMenuItems, getRestaurants), (state) => {
        state.loading = true
      });
  },
});

export const { setSelectedRestaurant } = restaurantSlice.actions;

export default restaurantSlice.reducer;
