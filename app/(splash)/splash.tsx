import "@/global.css";
import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Splash() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/(auth)/sign-in");
  };

  return (
    <SafeAreaView
      onTouchStart={handleRedirect}
      className="bg-[#f4f4f4] h-screen"
    >
      <View className="flex-1 justify-center items-center">
        <Image
          source={require("@/assets/images/logo.png")}
          className="w-[144px] h-[144px] object-contain"
        />
        <Text
          className="font-bold mt-[14px]"
          style={{ fontSize: 36, color: "#E6491E" }}
        >
          INKINGI
        </Text>
        <Text style={{ fontSize: 23, color: "#E6491E" }}>Rescue</Text>
      </View>
    </SafeAreaView>
  );
}
