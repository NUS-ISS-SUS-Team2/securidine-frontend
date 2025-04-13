export const Config = {
  // AWS Cognito
  clientId: "1eh44gevn1oel083saief19n2n",
  userPoolUrl:
    "https://ap-southeast-1ldw6e3byz.auth.ap-southeast-1.amazoncognito.com",
};

export const DiscoveryDocument = {
  authorizationEndpoint: Config.userPoolUrl + "/oauth2/authorize",
  tokenEndpoint: Config.userPoolUrl + "/oauth2/token",
  revocationEndpoint: Config.userPoolUrl + "/oauth2/revoke",
  userInfoEndpoint: Config.userPoolUrl + "/oauth2/userInfo",
  endSessionEndpoint: Config.userPoolUrl + "/logout",
};
