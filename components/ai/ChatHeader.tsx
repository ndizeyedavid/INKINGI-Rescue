import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChatHeaderProps {
  title: string;
  onMenuPress: () => void;
  onNewChatPress: () => void;
}

export default function ChatHeader({
  title,
  onMenuPress,
  onNewChatPress,
}: ChatHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={onMenuPress}
        activeOpacity={0.7}
      >
        <Ionicons name="menu" size={24} color="#1a1a1a" />
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.statusIndicator}>
          <Ionicons name="flash" size={12} color="#e6491e" />
          <Text style={styles.statusText}>Powered by Gemini Flash</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.headerAction}
        onPress={onNewChatPress}
        activeOpacity={0.7}
      >
        <Ionicons name="create-outline" size={24} color="#1a1a1a" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingTop: 50,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    color: "#666666",
    fontWeight: "500",
  },
  headerAction: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
