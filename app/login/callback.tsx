import * as WebBrowser from "expo-web-browser";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Config, DiscoveryDocument } from "@/constants/Config";
import { useSession } from "@/contexts/SessionContext";
import {
  AccessTokenRequestConfig,
  exchangeCodeAsync,
  makeRedirectUri,
} from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

// Web-only
const LoginCallbackScreen = () => {
  const { getCodeVerifier, saveAuthTokens, getIsAuthenticated, saveTokenResponseConfig } = useSession();
  const codeVerifier = getCodeVerifier();
  const isAuthenticated = getIsAuthenticated();
  const params = useLocalSearchParams();
  const redirectUri = makeRedirectUri({
    scheme: "securidine",
    path: "login/callback",
  });

  const exchangeFn = async (exchangeTokenReq: AccessTokenRequestConfig) => {
    try {
      const exchangeTokenResponse = await exchangeCodeAsync(
        exchangeTokenReq,
        DiscoveryDocument
      );
      console.log(
        "[exchangeFn] exchangeTokenResponse: ",
        exchangeTokenResponse
      );
      saveTokenResponseConfig(exchangeTokenResponse.getRequestConfig());
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

  return null;
};

export default LoginCallbackScreen;
