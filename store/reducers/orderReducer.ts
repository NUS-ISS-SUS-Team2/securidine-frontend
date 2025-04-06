import axiosInstance from "@/utils/AxiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface OrderState {
  orders: any[];
  loading: boolean;
  error: string | null | undefined;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const getOrders = createAsyncThunk("order/getOrders", async () => {
  const response = await axiosInstance.get(
    "https://api.nusiss-sus-project.online/prod/order/getAllOrders"
  );
  return response.data;
});

export const orderSlice = createSlice({
  name: "order",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(getOrders.rejected, (state, action) => {
        console.log("Error fetching orders:", action);
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
