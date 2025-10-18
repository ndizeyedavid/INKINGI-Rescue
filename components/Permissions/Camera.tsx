import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

export default function Camera() {
  return (
    <View className="flex-row items-center gap-2">
      {/* icon here */}
      <View className="" style={styles.iconContainer}>
        <Ionicons name="camera-outline" size={48} color={"#E6491E"} />
      </View>
      {/* text here */}
      <View className="gap-2">
        <Text className="font-bold" style={styles.titleText}>
          Capture emergency.
        </Text>
        <Text style={styles.subTitleText}>Please allow camera permission.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: "#FCE7E7",
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 65,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E6491E",
  },
  subTitleText: {
    fontSize: 16,
    color: "#150502",
    opacity: 0.8,
    fontWeight: "400",
  },
});
