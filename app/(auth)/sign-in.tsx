import SignInForm from "@/components/auth/SignInForm";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

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

  const handleSignUp = () => {
    // Navigate to sign up screen
    router.push("/(auth)/sign-up");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f4f4f4]">
      <ScrollView>
        <View className="flex-1 justify-center p-6 mt-[96px]">
          <View className="gap-2">
            <Text className="text-[#E6491E] text-[34px] font-bold">
              Let's Sign you in.
            </Text>
            <Text className="text-black/75 text-lg">Welcome Back.</Text>
          </View>

          <SignInForm onSignIn={handleSignIn} loading={loading} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
