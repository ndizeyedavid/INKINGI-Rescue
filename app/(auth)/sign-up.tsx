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
import SignUpForm from "../../components/auth/SignUpForm";
import { useAuth } from "../../context/AuthContext";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSignUp = async (
    name: string,
    email: string,
    password: string,
    phoneNumber?: string
  ) => {
    // Validate inputs
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert(t('common.error'), "Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('common.error'), "Please enter a valid email address");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert(t('common.error'), "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(name, email, password, phoneNumber);
      
      if (result.success) {
        // Navigate to permission screen
        router.replace("/(auth)/Permission");
      } else {
        // Show user-friendly error message
        Alert.alert('Registration Failed', result.error || "Failed to create account. Please try again.");
      }
    } catch (error: any) {
      // Catch any unexpected errors and show alert instead of crashing
      console.error('Sign up error:', error);
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
          <View className="justify-center flex-1 p-6" style={{ marginTop: 96 }}>
            <View className="gap-2">
              <Text className="text-[#E6491E] text-[34px] font-bold">
                {t("auth.signUp")}
              </Text>
              <Text className="text-lg text-black/75">{t("auth.welcome")}</Text>
            </View>

            <SignUpForm onSignUp={handleSignUp} loading={loading} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
