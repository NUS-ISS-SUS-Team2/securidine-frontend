import axios, { AxiosError } from "axios";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { RefreshTokenRequestConfig, TokenResponse } from "expo-auth-session";
import { Config, DiscoveryDocument } from "@/constants/Config";

const axiosInstance = axios.create();

const refreshToken = async (tokenResponse: TokenResponse) => {
  const refreshTokenRefreshConfig: RefreshTokenRequestConfig = {
    clientId: Config.clientId,
    refreshToken: tokenResponse.refreshToken,
  };
  const authTokenResponse = await tokenResponse.refreshAsync(
    refreshTokenRefreshConfig,
    DiscoveryDocument
  );

  console.log(
    "[Axios Request Interceptor] AuthTokenResponse (after refresh):",
    authTokenResponse
  );

  if (Platform.OS === "web") {
    sessionStorage.setItem(
      "tokenResponseConfig",
      JSON.stringify(authTokenResponse.getRequestConfig())
    );
    if (
      authTokenResponse?.accessToken &&
      authTokenResponse?.refreshToken &&
      authTokenResponse?.idToken
    ) {
      sessionStorage.setItem("accessToken", authTokenResponse.accessToken);
      sessionStorage.setItem("refreshToken", authTokenResponse.refreshToken);
      sessionStorage.setItem("idToken", authTokenResponse.idToken);
    }
  } else {
    await SecureStore.setItemAsync(
      "tokenResponseConfig",
      JSON.stringify(authTokenResponse.getRequestConfig())
    );
    if (
      authTokenResponse?.accessToken &&
      authTokenResponse?.refreshToken &&
      authTokenResponse?.idToken
    ) {
      await SecureStore.setItemAsync(
        "accessToken",
        authTokenResponse.accessToken
      );
      await SecureStore.setItemAsync(
        "refreshToken",
        authTokenResponse.refreshToken
      );
      await SecureStore.setItemAsync("idToken", authTokenResponse.idToken);
    }
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const tokenResponseConfig =
      Platform.OS === "web"
        ? sessionStorage.getItem("tokenResponseConfig")
        : await SecureStore.getItemAsync("tokenResponseConfig");
    console.log(
      "[Axios Request Interceptor] tokenResponseConfig:",
      tokenResponseConfig
    );

    if (tokenResponseConfig) {
      const tokenResponse = new TokenResponse(JSON.parse(tokenResponseConfig));
      console.log("[Axios Request Interceptor] TokenResponse:", tokenResponse);

      if (tokenResponse.shouldRefresh()) {
        await refreshToken(tokenResponse);
      }
    }

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
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (Platform.OS === "web") {
        sessionStorage.clear();
      } else {
        SecureStore.deleteItemAsync("accessToken");
        SecureStore.deleteItemAsync("refreshToken");
        SecureStore.deleteItemAsync("idToken");
        SecureStore.deleteItemAsync("tokenResponseConfig");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
