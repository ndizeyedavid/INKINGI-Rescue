import { StyleSheet, Text, View } from "react-native";

export default function SetupSos() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Setup SoS</Text>
        <Text style={styles.subtitle}>
          Configure your emergency contacts and settings
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
  },
});
