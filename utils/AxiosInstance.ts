import axios, { AxiosError } from "axios";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken =
      Platform.OS === "web"
        ? sessionStorage.getItem("accessToken")
        : await SecureStore.getItemAsync("accessToken");
    console.log("[Axios Request Interceptor] Access token:", accessToken);

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    console.error("[Axios Response Interceptor] Response error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
