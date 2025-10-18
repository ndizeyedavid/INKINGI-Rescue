import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { AuthProvider } from "../context/AuthContext";

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="(splash)/splash"
      />
      <StatusBar barStyle="dark-content" />
    </AuthProvider>
  );
}
