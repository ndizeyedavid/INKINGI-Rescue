import { Link } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const handleSignIn = () => {
    onSignIn(email, password);
  };

  return (
    <View className="w-full mt-[28px] h-full">
      <View className="gap-[26px]">
        <FormInput
          label="Email"
          icon="mail-outline"
          placeholder={t("auth.email")}
          keyboardType="email-address"
        />
        <FormInput
          label="Password"
          icon="lock-closed-outline"
          placeholder={t("auth.password")}
          keyboardType="default"
          secureTextEntry={true}
        />
      </View>

      <View className="items-end w-full mt-[14px]">
        <Link href="/" className="text-[#E6491E] font-bold active:opacity-90">
          {t("auth.forgotPassword")}
        </Link>
      </View>

      <View>
        <Button onPress={handleSignIn}>{t("auth.signIn")}</Button>
      </View>

      <View className="mt-[22px] ">
        <Text className="text-lg text-center text-black">
          {t("auth.dontHaveAccount")}{" "}
          <Link
            href="/(auth)/sign-up"
            className="text-[#E6491E] font-bold active:opacity-90"
          >
            {t("auth.signUp")}
          </Link>
        </Text>
      </View>

      <View
        className="flex-row items-center w-full px-4"
        style={{ marginTop: 30, marginBottom: 30 }}
      >
        <View className="flex-1 border border-black" style={{ opacity: 0.5 }} />
        <Text
          className="mx-4 text-lg text-center text-black"
          style={{ opacity: 0.7 }}
        >
          {"  "}
          {t("auth.orContinueWith")}
          {"    "}
        </Text>
        <View className="flex-1 border border-black" style={{ opacity: 0.5 }} />
      </View>

      <View
        className="flex-row items-center justify-center"
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
