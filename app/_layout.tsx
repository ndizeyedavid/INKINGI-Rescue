import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar, TouchableOpacity } from "react-native";
import { AuthProvider } from "../context/AuthContext";

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="new-post"
          options={{
            title: "Create Community Post",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="view-sos"
          options={({ route }: any) => ({
            title: route.params?.emergencyType || "Emergency Details",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack>
      {/* <Tabs /> */}
      <StatusBar barStyle="dark-content" />
    </AuthProvider>
  );
}
