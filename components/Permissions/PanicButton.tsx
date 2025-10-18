import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function PanicButton() {
  return (
    <View className="flex-row items-center gap-2">
      {/* icon here */}
      <View className="" style={styles.iconContainer}>
        <MaterialIcons name="emergency-share" size={48} color={"#E6491E"} />
      </View>
      {/* text here */}
      <View className="gap-2">
        <Text className="font-bold" style={styles.titleText}>
          Panic Button
        </Text>
        <Text style={styles.subTitleText}>
          Please allow using the panic button.
        </Text>
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
    fontSize: 34,
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
