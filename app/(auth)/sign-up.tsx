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
    password: string
  ) => {
    setLoading(true);
    try {
      await signUp(name, email, password);
      // Navigate to main app
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    // Navigate to sign in screen
    router.push("/(auth)/sign-in");
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
