import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import LottieView from "lottie-react-native";

const LogoutScreen = () => {
  return (
    <View
      style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
    >
      <LottieView
        autoPlay
        loop
        webStyle={{ height: "60%" }}
        source={require("../../assets/lotties/success.json")}
      />
      <Text variant="bodyLarge" style={{ color: "#000", textAlign: "center", marginBottom: 40 }}>
        Logout Success. You may close this browser.
      </Text>
      <Button mode="contained" onPress={window.close}>
        Close
      </Button>
    </View>
  );
};

export default LogoutScreen;
