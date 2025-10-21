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
    setLoading(true);
    try {
      await signIn(email, password);
      // Navigate to main app
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    Alert.alert(
      "Forgot Password",
      "This would navigate to the forgot password screen."
    );
  };

  const handleRedirect = () => {
    router.push("/(auth)/Permission");
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

            <SignInForm onSignIn={handleRedirect} loading={loading} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
