import Logout from "@/components/auth/logout/Logout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const AccountScreen = () => {
  return (
    <SafeAreaView>
      <View
        style={{
          padding: 24,
        }}
      >
        <Card
          mode="elevated"
          style={{
            marginBottom: 16,
          }}
        >
          <Card.Content
            style={{
              alignItems: "center",
            }}
          >
            <Avatar.Icon
              icon={({ color, size }) => (
                <Ionicons name="person" size={size} color={color} />
              )}
              style={{
                marginBottom: 8,
              }}
            />
            <Text variant="titleMedium">User name</Text>
            <Text variant="bodyMedium">Email Address</Text>
          </Card.Content>
        </Card>
        <Logout />
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;
