import { Config } from "@/constants/Config";
import { useSession } from "@/contexts/SessionContext";
import {
  AccessTokenRequestConfig,
  AuthRequestConfig,
  CodeChallengeMethod,
  exchangeCodeAsync,
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useMemo } from "react";
import { Button } from "react-native-paper";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const { saveCodeVerifier, saveAuthTokens } = useSession();
  const redirectUri = makeRedirectUri({
    scheme: "securidine",
    path: "login",
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

  const config: AuthRequestConfig = {
    clientId: Config.clientId,
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

  const redirectToAuthorizeEndpoint = () => {
    if (!request) {
      return;
    }

    console.log("request: ", request);
    if (request.codeVerifier) {
      console.log("codeVerifier in request: ", request.codeVerifier);
      saveCodeVerifier(request.codeVerifier);
    }

    promptAsync();
  };

  const exchangeFn = async (exchangeTokenReq: AccessTokenRequestConfig) => {
    try {
      const exchangeTokenResponse = await exchangeCodeAsync(
        exchangeTokenReq,
        discoveryDocument
      );
      saveAuthTokens(exchangeTokenResponse);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!response) {
      return;
    }

    if (response.type === "error") {
      console.error("Authentication error: ", response);
      return;
    }

    if (response.type === "success" && request?.codeVerifier) {
      exchangeFn({
        clientId: Config.clientId,
        code: response.params.code,
        redirectUri,
        extraParams: {
          code_verifier: request.codeVerifier,
        },
      });
    }
  }, [discoveryDocument, request, response]);

  return (
    <Button
      mode="contained"
      disabled={!request}
      onPress={() => promptAsync()}
    >
      Sign in
    </Button>
  );
};

export default Login;
