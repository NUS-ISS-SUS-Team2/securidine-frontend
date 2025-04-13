import { DiscoveryDocument } from "@/constants/Config";
import axiosInstance from "@/utils/AxiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UserState {
  name: string;
  email: string;
  loading: boolean;
  error: string | null | undefined;
}

const initialState: UserState = {
  name: "",
  email: "",
  loading: false,
  error: null,
};

export const getUserInfo = createAsyncThunk("user/getUserInfo", async () => {
  const response = await axiosInstance.get(DiscoveryDocument.userInfoEndpoint);
  return response.data;
});

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.loading = false;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        console.log("Error fetching user info:", action);
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
