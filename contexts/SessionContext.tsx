import { useStorageState } from "@/hooks/useStorageState";
import { TokenResponse } from "expo-auth-session";
import { createContext, PropsWithChildren, useContext } from "react";

const SessionContext = createContext({});

/***
 * Custom hook to access the authentication state and session information
 */
export const useSession = () => {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error("useSession must be wrapped within a <SessionProvider />");
  }
  return value;
};

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [[isAccessTokenLoading, accessToken], setAccessToken] =
    useStorageState("accessToken");
  const [[isRefreshTokenLoading, refreshToken], setRefreshToken] =
    useStorageState("refreshToken");
  const [[isIdTokenLoading, idToken], setIdToken] = useStorageState("idToken");

  // Extract auth tokens from TokenResponse and save them to storage
  const saveAuthTokens = (tokenResponse: TokenResponse) => {
    if (
      tokenResponse?.accessToken &&
      tokenResponse?.refreshToken &&
      tokenResponse?.idToken
    ) {
      setAccessToken(tokenResponse.accessToken);
      setRefreshToken(tokenResponse.refreshToken);
      setIdToken(tokenResponse.idToken);
    }
  };

  const clearAuthTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setIdToken(null);
  };

  return (
    <SessionContext.Provider
      value={{
        saveAuthTokens,
        clearAuthTokens,
        isLoading:
          isAccessTokenLoading || isRefreshTokenLoading || isIdTokenLoading,
        isAuthenticated: accessToken && refreshToken && idToken,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
