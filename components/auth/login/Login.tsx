import * as WebBrowser from "expo-web-browser";
import { useMemo } from "react";
import { Config } from "@/constants/Config";
import {
  AuthRequestConfig,
  CodeChallengeMethod,
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session";
import { Button } from "react-native-paper";
import { useSession } from "@/contexts/SessionContext";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const { saveCodeVerifier } = useSession();
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

  const config: AuthRequestConfig = {
    clientId: Config.clientId,
    scopes: ["openid", "email", "profile", "phone"],
    responseType: ResponseType.Code,
    redirectUri,
    codeChallengeMethod: CodeChallengeMethod.S256,
    usePKCE: true,
  };

  const [request] = useAuthRequest(config, discoveryDocument);

  const redirectToAuthorizeEndpoint = async () => {
    if (!request) {
      return;
    }

    const authUrl = await request.makeAuthUrlAsync(discoveryDocument);
    console.log("authUrl: ", authUrl);
    console.log("request: ", request);

    if (request.codeVerifier) {
      console.log("codeVerifier in request: ", request.codeVerifier);
      saveCodeVerifier(request.codeVerifier);
    }

    if (authUrl) {
      window.location.href = authUrl;
    } else {
      console.error("Failed to create auth URL");
    }
  };

  return (
    <Button
      mode="contained"
      disabled={!request}
      onPress={() => redirectToAuthorizeEndpoint()}
    >
      Sign in
    </Button>
  );
};

export default Login;
