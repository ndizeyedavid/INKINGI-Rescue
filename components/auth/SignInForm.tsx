import { Link } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Button from "../Button";
import FormInput from "./FormInput";

interface SignInFormProps {
  onSignIn: (email: string, password: string) => void;
  loading?: boolean;
}

const SignInForm: React.FC<SignInFormProps> = ({
  onSignIn,
  loading = false,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    onSignIn(email, password);
  };

  return (
    <View className="w-full mt-[28px] h-full">
      <View className="gap-[26px]">
        <FormInput
          label="Email"
          icon="mail-outline"
          placeholder="Your email"
          keyboardType="email-address"
        />
        <FormInput
          label="Password"
          icon="lock-closed-outline"
          placeholder="Enter Password"
          keyboardType="default"
          secureTextEntry={true}
        />
      </View>

      <View className="items-end w-full mt-[14px]">
        <Link href="/" className="text-[#E6491E] font-bold active:opacity-90">
          Forgot Password?
        </Link>
      </View>

      <View>
        <Button onPress={handleSignIn}>Login</Button>
      </View>

      <View className="mt-[22px] ">
        <Text className="text-center text-black text-lg">
          Are you new here?{" "}
          <Link
            href="/(auth)/sign-up"
            className="text-[#E6491E] font-bold active:opacity-90"
          >
            Sign up
          </Link>
        </Text>
      </View>

      <View
        className="flex-row items-center w-full px-4"
        style={{ marginTop: 30, marginBottom: 30 }}
      >
        <View className="border border-black flex-1" style={{ opacity: 0.5 }} />
        <Text
          className="text-center text-black text-lg mx-4"
          style={{ opacity: 0.7 }}
        >
          {"  "}
          or continue with{"    "}
        </Text>
        <View className="border border-black flex-1" style={{ opacity: 0.5 }} />
      </View>

      <View
        className="flex-row justify-center items-center"
        style={{ gap: 20 }}
      >
        <TouchableOpacity activeOpacity={0.8}>
          <Image
            source={require("../../assets/images/social-accounts/google.png")}
            className="w-[64px] h-[64px] rounded-full"
            style={{ objectFit: "contain" }}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
          <Image
            source={require("../../assets/images/social-accounts/facebook.png")}
            className="w-[64px] h-[64px] rounded-full"
            style={{ objectFit: "contain" }}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
          <Image
            source={require("../../assets/images/social-accounts/instagram.png")}
            className="w-[64px] h-[64px] rounded-full"
            style={{ objectFit: "contain" }}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
          <Image
            source={require("../../assets/images/social-accounts/twitter.png")}
            className="w-[64px] h-[64px] rounded-full"
            style={{ objectFit: "contain" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignInForm;
