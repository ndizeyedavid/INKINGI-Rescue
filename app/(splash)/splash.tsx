import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent() {
  const router = useRouter();
  const { isLoading, user } = useAuth();

  useEffect(() => {
    async function prepare() {
      try {
        // Add any resource loading or initialization here
        // For example: await loadFonts(), await loadUserData(), etc.

        // Simulate a loading delay (remove this in a real app)
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Navigate based on auth state
        if (user) {
          router.replace("/");
        } else {
          router.replace("/(auth)/sign-in");
        }
      }
    }

    if (!isLoading) {
      prepare();
    }
  }, [isLoading, user]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>INKINGI Rescue</Text>
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
  },
});
