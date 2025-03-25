import { useStorageState } from "@/hooks/useStorageState";
import { TokenResponse } from "expo-auth-session";
import { createContext, PropsWithChildren, useContext } from "react";

type SessionContextType = {
  saveAuthTokens: (tokenResponse: TokenResponse) => void;
  clearAuthTokens: () => void;
  saveCodeVerifier: (codeVerifier: string) => void;
  getCodeVerifier: () => string | null;
  getIsLoading: () => boolean;
  getIsAuthenticated: () => boolean;
};

const SessionContext = createContext({
  saveAuthTokens: () => {},
  clearAuthTokens: () => {},
  saveCodeVerifier: () => {},
  getCodeVerifier: () => "",
  getIsLoading: () => false,
  getIsAuthenticated: () => false,
} as SessionContextType);

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
  const [[isCodeVerifierLoading, codeVerifier], setCodeVerifier] =
    useStorageState("codeVerifier");
  const [[isAccessTokenLoading, accessToken], setAccessToken] =
    useStorageState("accessToken");
  const [[isRefreshTokenLoading, refreshToken], setRefreshToken] =
    useStorageState("refreshToken");
  const [[isIdTokenLoading, idToken], setIdToken] = useStorageState("idToken");

  // Extract auth tokens from TokenResponse and save them to storage
  const saveAuthTokens = (tokenResponse: TokenResponse) => {
    console.log("[saveAuthTokens] tokenResponse: ", tokenResponse);
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

  const saveCodeVerifier = (codeVerifier: string) => {
    setCodeVerifier(codeVerifier);
  };

  const getCodeVerifier = () => {
    return codeVerifier;
  };

  const getIsAuthenticated = () => {
    return !!(accessToken && refreshToken && idToken);
  };

  const getIsLoading = () => {
    return (
      isAccessTokenLoading ||
      isRefreshTokenLoading ||
      isIdTokenLoading ||
      isCodeVerifierLoading
    );
  };

  return (
    <SessionContext.Provider
      value={{
        saveAuthTokens,
        clearAuthTokens,
        saveCodeVerifier,
        getCodeVerifier,
        getIsLoading,
        getIsAuthenticated,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
