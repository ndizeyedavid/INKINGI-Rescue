import SignInForm from "@/components/auth/SignInForm";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSignIn = async (email: string, password: string) => {
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', "Please enter both email and password");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // Navigate to permission screen or main app
        router.replace("/(auth)/Permission");
      } else {
        // Show user-friendly error message
        Alert.alert('Login Failed', result.error || "Failed to sign in. Please check your credentials and try again.");
      }
    } catch (error: any) {
      // Catch any unexpected errors and show alert instead of crashing
      console.error('Sign in error:', error);
      Alert.alert('Error', error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="flex-1 bg-[#f4f4f4]">
        <ScrollView>
          <View className="flex-1 justify-center p-6 mt-[96px]">
            <View className="gap-2">
              <Text className="text-[#E6491E] text-[34px] font-bold">
                {t("auth.signIn")}
              </Text>
              <Text className="text-lg text-black/75">
                {t("auth.welcomeBack")}
              </Text>
            </View>

            <SignInForm onSignIn={handleSignIn} loading={loading} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
