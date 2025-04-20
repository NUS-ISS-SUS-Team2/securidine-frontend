import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import { Button } from "react-native-paper";
import { useSession } from "@/contexts/SessionContext";
import { Config, DiscoveryDocument } from "@/constants/Config";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const Logout = () => {
  const { getAuthTokens, clearAuthTokens } = useSession();
  const authTokens = getAuthTokens();
  const redirectUri = makeRedirectUri({
    scheme: "securidine",
    path: "logout",
  });

  const handleLogout = async () => {
    if (
      !authTokens?.accessToken ||
      !DiscoveryDocument?.endSessionEndpoint ||
      !DiscoveryDocument?.revocationEndpoint ||
      !Config?.clientId
    ) {
      console.error("[handleLogout] Missing required data for logout");
      return;
    }

    try {
      console.log("[handleLogout] logging out");
      const urlParams = new URLSearchParams({
        client_id: Config.clientId,
        logout_uri: redirectUri,
      });

      await WebBrowser.openAuthSessionAsync(
        `${DiscoveryDocument.endSessionEndpoint}?${urlParams.toString()}`
      );

      const revokeTokenResponse = await axios.post(
        DiscoveryDocument.revocationEndpoint,
        {
          client_id: Config.clientId,
          token: authTokens.refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("[handleLogout] revokeTokenResponse: ", revokeTokenResponse);
      if (revokeTokenResponse?.status === 200) {
        console.log("[handleLogout] Tokens revoked successfully");
      }
    } catch (error) {
      console.error("[handleLogout] Error during token revocation:", error);
    } finally {
      clearAuthTokens();
    }
  };

  return (
    <Button mode="contained" onPress={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
