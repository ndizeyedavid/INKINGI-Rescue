import { useRouter } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function Index() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/(tabs)/index");
  };

  return (
    <SafeAreaView
      onTouchStart={handleRedirect}
      className="bg-[#f4f4f4] h-screen"
    >
      <Text>Mellow</Text>
    </SafeAreaView>
  );
}
