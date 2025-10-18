import { Text, View } from "react-native";
import "../global.css";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-green-500">
      <Text className="text-xl font-bold text-black ">
        Welcome to Nativewind!
      </Text>
      <View className="p-10 w-8 h-8 bg-black rounded-full mt-4 active:bg-red-800 active:p-5"></View>
    </View>
  );
}
