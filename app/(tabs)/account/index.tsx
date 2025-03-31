import Logout from "@/components/auth/logout/Logout";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AccountScreen = () => {
  return (
    <SafeAreaView>
      <Text>Account page</Text>
      <Logout />
    </SafeAreaView>
  );
};

export default AccountScreen;
