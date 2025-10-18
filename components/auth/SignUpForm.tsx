import { Link } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Button from "../Button";
import FormInput from "./FormInput";

interface SignUpFormProps {
  onSignUp: (name: string, email: string, password: string) => void;
  loading?: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  onSignUp,
  loading = false,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    onSignUp(name, email, password);
  };

  const isFormValid = () => {
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      password === confirmPassword
    );
  };

  return (
    <View className="w-full mt-[28px] h-full">
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

      <View className="gap-[26px]">
        <FormInput
          label="Full Name"
          icon="person-outline"
          placeholder="Your name"
          keyboardType="default"
        />
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
        <FormInput
          label="Confirm Password"
          icon="lock-closed-outline"
          placeholder="Re-enter Password"
          keyboardType="default"
          secureTextEntry={true}
        />
      </View>

      <View>
        <Button>Sign Up</Button>
      </View>

      <View className="mt-[22px] ">
        <Text className="text-center text-black text-lg">
          Already have an account?{" "}
          <Link
            href="/(auth)/sign-in"
            className="text-[#E6491E] font-bold active:opacity-90"
          >
            Sign in
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default SignUpForm;
