import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { useShakeDetection } from "@/hooks/useShakeDetection";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useCallback } from "react";
import { StatusBar, TouchableOpacity } from "react-native";

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

function StackNavigator() {
  const router = useRouter();

  // Handle shake detection
  const handleShake = useCallback(() => {
    console.log("Shake detected! Opening emergency report...");
    router.push("/alert-loud");
  }, [router]);

  // Enable shake detection
  useShakeDetection({
    threshold: 2.0, // Adjust sensitivity (higher = less sensitive)
    timeout: 1000, // 1 second between shakes
    onShake: handleShake,
  });

  return (
    <>
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
        <Stack.Screen
          name="account-details"
          options={{
            title: "Account Details",
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
          name="setup-sos"
          options={{
            title: "Setup SoS",
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
          name="settings"
          options={{
            title: "Settings",
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
          name="about"
          options={{
            title: "About",
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
          name="language"
          options={{
            title: "Language",
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
          name="privacy-policy"
          options={{
            title: "Privacy Policy",
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
          name="terms-of-service"
          options={{
            title: "Terms of Service",
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
          name="post-detail"
          options={{
            title: "Post",
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
          name="notifications"
          options={{
            title: "Notifications",
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
          name="report-emergency"
          options={{
            title: "Report Emergency",
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
          name="add-emergency-contact"
          options={{
            title: "Add Emergency Contact",
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
          name="edit-emergency-contact"
          options={{
            title: "Edit Emergency Contact",
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
          name="setup-panic-button"
          options={{
            title: "Setup Panic Button",
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
          name="edit-panic-button"
          options={{
            title: "Edit Panic Button",
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
          name="onboarding"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar barStyle="dark-content" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <StackNavigator />
      </NotificationProvider>
    </AuthProvider>
  );
}
