import { View, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { Config } from "@/constants/Config";
import { useSession } from "@/contexts/SessionContext";
import {
  AccessTokenRequestConfig,
  exchangeCodeAsync,
  makeRedirectUri,
} from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

// Web-only
const LoginCallbackScreen = () => {
  const { getCodeVerifier, saveAuthTokens, getIsAuthenticated } = useSession();
  const codeVerifier = getCodeVerifier();
  const isAuthenticated = getIsAuthenticated();
  const params = useLocalSearchParams();
  const redirectUri = makeRedirectUri({
    scheme: "securidine",
    path: "login/callback",
  });
  const discoveryDocument = useMemo(
    () => ({
      authorizationEndpoint: Config.userPoolUrl + "/oauth2/authorize",
      tokenEndpoint: Config.userPoolUrl + "/oauth2/token",
      revocationEndpoint: Config.userPoolUrl + "/oauth2/revoke",
      userInfoEndpoint: Config.userPoolUrl + "/oauth2/userInfo",
      endSessionEndpoint: Config.userPoolUrl + "/logout",
    }),
    []
  );

  const exchangeFn = async (exchangeTokenReq: AccessTokenRequestConfig) => {
    try {
      const exchangeTokenResponse = await exchangeCodeAsync(
        exchangeTokenReq,
        discoveryDocument
      );
      console.log("[exchangeFn] exchangeTokenResponse: ", exchangeTokenResponse);
      saveAuthTokens(exchangeTokenResponse);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (params?.code && params?.state && codeVerifier && !isAuthenticated) {
      exchangeFn({
        clientId: Config.clientId,
        code: params.code as string,
        redirectUri,
        extraParams: {
          code_verifier: codeVerifier,
        },
      });
    }
  }, [params]);

  return (
    <View>
      <Text>Login callback page</Text>
    </View>
  );
};

export default LoginCallbackScreen;
