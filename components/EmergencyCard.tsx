import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type EmergencyStatus = "reported" | "dispatched" | "resolved";

interface IEmergencyCard {
  location: string;
  icon: string;
  type: string;
  description: string;
  status?: EmergencyStatus;
  timeReported?: string;
  volunteersCount?: number;
  reportedBy?: string;
  isMine?: boolean;
  onDelete?: () => void;
  onFlagAsSpam?: () => void;
}

export default function EmergencyCard({
  location,
  icon,
  type,
  description,
  status = "reported",
  timeReported = "Now",
  volunteersCount = 0,
  reportedBy,
  isMine = false,
  onDelete,
  onFlagAsSpam,
}: IEmergencyCard) {
  const [showMenu, setShowMenu] = useState(false);
  const getStatusColor = () => {
    switch (status) {
      case "reported":
        return "#f59e0b";
      case "dispatched":
        return "#3b82f6";
      case "resolved":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "reported":
        return "alert-circle";
      case "dispatched":
        return "car";
      case "resolved":
        return "checkmark-circle";
      default:
        return "alert-circle";
    }
  };

  return (
    <View style={styles.card}>
      {/* Header with location and menu button */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color="#666666" />
          <Text style={styles.locationText}>{location}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowMenu(true)}
          style={styles.menuButton}
          activeOpacity={0.7}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#666666" />
        </TouchableOpacity>
      </View>

      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
        <Ionicons name={getStatusIcon() as any} size={16} color="#ffffff" />
        <Text style={styles.statusText}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
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

      {/* Footer with time, volunteers, and reported by */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          {timeReported && (
            <View style={styles.footerItem}>
              <Ionicons name="time-outline" size={16} color="#999999" />
              <Text style={styles.footerText}>{timeReported}</Text>
            </View>
          )}
          <View style={styles.footerItem}>
            <Ionicons name="people-outline" size={16} color="#999999" />
            <Text style={styles.footerText}>
              {volunteersCount}{" "}
              {volunteersCount === 1 ? "volunteer" : "volunteers"}
            </Text>
          </View>
        </View>
        {reportedBy && (
          <View style={styles.reportedByContainer}>
            <View style={styles.reporterAvatar}>
              <Text style={styles.reporterInitial}>
                {reportedBy.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.reporterInfo}>
              <Text style={styles.reporterLabel}>Reported by</Text>
              <Text style={styles.reporterName}>{reportedBy}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            {isMine && onDelete && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  onDelete();
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={20} color="#e6491e" />
                <Text style={styles.menuItemText}>Delete</Text>
              </TouchableOpacity>
            )}
            {!isMine && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  // onFlagAsSpam();
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="flag-outline" size={20} color="#f59e0b" />
                <Text style={styles.menuItemText}>Report False Alert</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowMenu(false)}
              activeOpacity={0.7}
            >
              <Ionicons name="close-outline" size={20} color="#666666" />
              <Text style={styles.menuItemText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    textTransform: "capitalize",
  },
  footer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: "#999999",
    fontWeight: "500",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    width: "100%",
  },
  reportedByContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  reporterAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e6491e",
    justifyContent: "center",
    alignItems: "center",
  },
  reporterInitial: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  reporterInfo: {
    flex: 1,
  },
  reporterLabel: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  reporterName: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "600",
  },
  menuButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 8,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 15,
    color: "#000000",
    fontWeight: "500",
  },
});
