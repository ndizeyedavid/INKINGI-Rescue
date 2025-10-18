import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <View className="ml-4">
        <Text>Hey!</Text>
        <Text style={styles.headerText}>MELLOW JUNIOR</Text>
      </View>

      <View style={styles.notificationContainer}>
        <Ionicons name="notifications-outline" size={27} color="black" />
        <View style={styles.notificationBadge} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  notificationContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 2,

    backgroundColor: "#FF0000",
    borderRadius: 10,
    width: 10,
    height: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
