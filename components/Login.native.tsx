import { Alert, Button, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import {
  useAuthRequest,
  exchangeCodeAsync,
  ResponseType,
  AccessTokenRequestConfig,
  AuthRequestConfig,
  makeRedirectUri,
  CodeChallengeMethod,
  TokenResponse,
} from "expo-auth-session";
import { useMemo, useState, useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

const clientId = "1eh44gevn1oel083saief19n2n";
const userPoolUrl =
  "https://ap-southeast-1ldw6e3byz.auth.ap-southeast-1.amazoncognito.com";
const redirectUri = makeRedirectUri({
  scheme: "securidine",
});

const Login = () => {
  const [authTokens, setAuthTokens] = useState<TokenResponse | null>(null);
  const discoveryDocument = useMemo(
    () => ({
      authorizationEndpoint: userPoolUrl + "/oauth2/authorize",
      tokenEndpoint: userPoolUrl + "/oauth2/token",
      revocationEndpoint: userPoolUrl + "/oauth2/revoke",
      userInfoEndpoint: userPoolUrl + "/oauth2/userInfo",
      endSessionEndpoint: userPoolUrl + "/logout",
    }),
    []
  );

  const config: AuthRequestConfig = {
    clientId,
    scopes: ["openid", "email", "profile", "phone"],
    responseType: ResponseType.Code,
    redirectUri,
    codeChallengeMethod: CodeChallengeMethod.S256,
    usePKCE: true,
  };

  const [request, response, promptAsync] = useAuthRequest(
    config,
    discoveryDocument
  );

  useEffect(() => {
    const exchangeFn = async (exchangeTokenReq: AccessTokenRequestConfig) => {
      try {
        const exchangeTokenResponse = await exchangeCodeAsync(
          exchangeTokenReq,
          discoveryDocument
        );
        setAuthTokens(exchangeTokenResponse);
      } catch (error) {
        console.error(error);
      }
    };
    console.log("request: ", request);
    console.log("response: ", response);
    if (response) {
      if (response.type === "error") {
        Alert.alert(
          "Authentication error",
          response.params.error_description || "something went wrong"
        );
        return;
      }
      if (response.type === "success" && request?.codeVerifier) {
        exchangeFn({
          clientId,
          code: response.params.code,
          redirectUri,
          extraParams: {
            code_verifier: request.codeVerifier,
          },
        });
      }
    }
  }, [discoveryDocument, request, response]);

  const logout = async () => {
    console.log("logging out");
    if (!authTokens?.refreshToken || !discoveryDocument || !config?.clientId) {
      console.error("Missing required data for logout");
      return;
    }

    try {
      const urlParams = new URLSearchParams({
        client_id: config.clientId || "",
        logout_uri: redirectUri,
      });

      // Open the logout page in the browser
      console.log("url: ", `${userPoolUrl}/logout?${urlParams.toString()}`);
      await WebBrowser.openAuthSessionAsync(
        `${userPoolUrl}/logout?${urlParams.toString()}`
      );

      // Revoke the refresh token
      console.log("token to revoke: ", authTokens.refreshToken);
      console.log("client config: ", config.clientId);

      const revokeResponse = await axios.post(
        discoveryDocument.revocationEndpoint,
        {
          client_id: config.clientId,
          token: authTokens.refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("revokeResponse: ", revokeResponse);
      if (revokeResponse?.status === 200) {
        setAuthTokens(null);
      }
    } catch (error) {
      // Log the error but don't throw it since we want to continue with clearing tokens
      console.error("Error during token revocation:", error);
    }
  };

  console.log("authTokens: " + JSON.stringify(authTokens));
  console.log("redirectUri: " + redirectUri);

  return authTokens ? (
    <Button title="Logout" onPress={() => logout()} />
  ) : (
    <>
      <Button disabled={!request} title="Login" onPress={() => promptAsync()} />
      <Text>Native Login</Text>
    </>
  );
};

export default Login;
