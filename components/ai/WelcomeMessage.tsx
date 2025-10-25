import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function WelcomeMessage() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="shield-checkmark" size={64} color="#e6491e" />
      </View>

      <Text style={styles.title}>Welcome to INKINGI AI</Text>

      <Text style={styles.subtitle}>
        Your personal emergency assistance companion
      </Text>

      <Text style={styles.prompt}>How can I help you today?</Text>
    </View>
  );
}

function FeatureItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={20} color="#e6491e" />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    marginBottom: 16,
    padding: 16,
    // backgroundColor: "#fff5f3",
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 20,
  },
  featuresContainer: {
    width: "100%",
    alignItems: "center",
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
    textAlign: "center",
  },
  featuresList: {
    width: "100%",
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 15,
    color: "#444",
    flex: 1,
    lineHeight: 20,
  },
  callToAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff5f3",
    padding: 16,
    borderRadius: 12,
    width: "100%",
  },
  callToActionText: {
    fontSize: 15,
    color: "#444",
    flex: 1,
    lineHeight: 20,
  },
  prompt: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e6491e",
    marginTop: 24,
    textAlign: "center",
  },
});
