import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface IEmergencyCard {
  location: string;
  icon: string;
  type: string;
  description: string;
  isMine?: boolean;
  onDelete?: () => void;
}

export default function EmergencyCard({
  location,
  icon,
  type,
  description,
  isMine = false,
  onDelete,
}: IEmergencyCard) {
  return (
    <View style={styles.card}>
      {/* Header with location and delete button */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color="#666666" />
          <Text style={styles.locationText}>{location}</Text>
        </View>
        {isMine && onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            style={styles.deleteButton}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={24} color="#e6491e" />
          </TouchableOpacity>
        )}
      </View>

      {/* Emergency Icon and Type */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name={icon} size={32} color="#ffffff" />
        </View>

        <View style={styles.details}>
          <Text style={styles.typeText}>{type}</Text>
          <Text style={styles.descriptionText} numberOfLines={4}>
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  deleteButton: {
    padding: 4,
  },
  content: {
    flexDirection: "column",
    gap: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e6491e",
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  typeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
});
