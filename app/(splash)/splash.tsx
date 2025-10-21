import "@/global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Splash() {
  const router = useRouter();
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate logo entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Check if user has seen onboarding
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      // Wait for animation to complete
      setTimeout(() => {
        if (hasSeenOnboarding === "true") {
          // User has seen onboarding, go to sign-in
          // router.replace("/(tabs)");
          router.replace("/onboarding");
        } else {
          // First time user, show onboarding
          router.replace("/onboarding");
        }
      }, 2500);
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      // Default to onboarding on error
      setTimeout(() => {
        router.replace("/onboarding");
      }, 2500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>INKINGI</Text>
          <Text style={styles.subtitle}>Rescue</Text>

          {/* Lottie Animation */}
          <LottieView
            source={require("@/assets/animations/splash.json")}
            autoPlay
            loop
            style={styles.lottieContainer}
          />
        </Animated.View>

        <Animated.View style={[styles.taglineContainer, { opacity: fadeAnim }]}>
          <Text style={styles.tagline}>{t("splash.tagline")}</Text>
          <Text style={styles.version}>Version 1.0 alpha</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
  },
  lottieContainer: {
    width: 60,
    height: 60,
    marginTop: 20,
  },
  logo: {
    width: 144,
    height: 144,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#E6491E",
    marginTop: 14,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 23,
    color: "#E6491E",
    fontWeight: "600",
  },
  taglineContainer: {
    position: "absolute",
    bottom: 10,
    alignItems: "center",
    gap: 10,
  },
  tagline: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  version: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
});
