import * as WebBrowser from "expo-web-browser";
import { Config, DiscoveryDocument } from "@/constants/Config";
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

  const config: AuthRequestConfig = {
    clientId: Config.clientId,
    scopes: ["openid", "email", "profile", "phone"],
    responseType: ResponseType.Code,
    redirectUri,
    codeChallengeMethod: CodeChallengeMethod.S256,
    usePKCE: true,
  };

  const [request] = useAuthRequest(config, DiscoveryDocument);

  const redirectToAuthorizeEndpoint = async () => {
    if (!request) {
      return;
    }

    const authUrl = await request.makeAuthUrlAsync(DiscoveryDocument);
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
      mode="outlined"
      disabled={!request}
      onPress={() => redirectToAuthorizeEndpoint()}
    >
      Sign in
    </Button>
  );
};

export default Login;
