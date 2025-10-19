import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type NotificationType = "emergency" | "post" | "system" | "alert";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  iconColor: string;
  backgroundColor: string;
}

export default function Notifications() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | NotificationType>("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "emergency",
      title: "Emergency Alert - Robbery",
      message:
        "Robbery reported 500m from your location on KN 5 Ave. Stay alert and avoid the area.",
      time: "5 min ago",
      read: false,
      icon: "warning",
      iconColor: "#dc2626",
      backgroundColor: "#fef2f2",
    },
    {
      id: 2,
      type: "post",
      title: "New Community Post",
      message:
        "Rwanda Red Cross posted about Blood Donation Drive This Weekend",
      time: "1 hour ago",
      read: false,
      icon: "people",
      iconColor: "#2563eb",
      backgroundColor: "#eff6ff",
    },
    {
      id: 3,
      type: "alert",
      title: "Safety Alert",
      message:
        "Heavy rainfall expected in your area. Risk of flooding. Stay safe.",
      time: "2 hours ago",
      read: false,
      icon: "alert-circle",
      iconColor: "#ea580c",
      backgroundColor: "#fff7ed",
    },
    {
      id: 4,
      type: "emergency",
      title: "Fire Emergency Nearby",
      message:
        "Fire reported at KG 123 St. Emergency services on the way. Avoid the area.",
      time: "3 hours ago",
      read: true,
      icon: "flame",
      iconColor: "#dc2626",
      backgroundColor: "#fef2f2",
    },
    {
      id: 5,
      type: "post",
      title: "New Community Post",
      message:
        "Kigali City Council posted about Emergency Preparedness Workshop",
      time: "5 hours ago",
      read: true,
      icon: "people",
      iconColor: "#2563eb",
      backgroundColor: "#eff6ff",
    },
    {
      id: 6,
      type: "system",
      title: "App Update Available",
      message:
        "Version 1.1 is now available with new features and improvements.",
      time: "1 day ago",
      read: true,
      icon: "download",
      iconColor: "#16a34a",
      backgroundColor: "#f0fdf4",
    },
    {
      id: 7,
      type: "alert",
      title: "Community Safety Tip",
      message:
        "Remember to update your emergency contacts and verify your location settings.",
      time: "2 days ago",
      read: true,
      icon: "information-circle",
      iconColor: "#0891b2",
      backgroundColor: "#ecfeff",
    },
    {
      id: 8,
      type: "emergency",
      title: "Medical Emergency Alert",
      message:
        "Ambulance requested in your area. Please give way to emergency vehicles.",
      time: "3 days ago",
      read: true,
      icon: "medical",
      iconColor: "#dc2626",
      backgroundColor: "#fef2f2",
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((notif) => notif.type === filter);

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.headerStats}>
        <View>
          <Text style={styles.statsNumber}>{notifications.length}</Text>
          <Text style={styles.statsLabel}>Total</Text>
        </View>
        <View style={styles.statsDivider} />
        <View>
          <Text style={[styles.statsNumber, { color: "#e6491e" }]}>
            {unreadCount}
          </Text>
          <Text style={styles.statsLabel}>Unread</Text>
        </View>
        <View style={{ flex: 1 }} />
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            activeOpacity={0.7}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterTab, filter === "all" && styles.filterTabActive]}
          activeOpacity={0.7}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "emergency" && styles.filterTabActive,
          ]}
          activeOpacity={0.7}
          onPress={() => setFilter("emergency")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "emergency" && styles.filterTextActive,
            ]}
          >
            Emergency
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "alert" && styles.filterTabActive,
          ]}
          activeOpacity={0.7}
          onPress={() => setFilter("alert")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "alert" && styles.filterTextActive,
            ]}
          >
            Alerts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "post" && styles.filterTabActive,
          ]}
          activeOpacity={0.7}
          onPress={() => setFilter("post")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "post" && styles.filterTextActive,
            ]}
          >
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "system" && styles.filterTabActive,
          ]}
          activeOpacity={0.7}
          onPress={() => setFilter("system")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "system" && styles.filterTextActive,
            ]}
          >
            System
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off" size={64} color="#cccccc" />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>
              You're all caught up! Check back later for updates.
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.notificationCardUnread,
              ]}
              activeOpacity={0.7}
              onPress={() => {
                markAsRead(notification.id);
                if (notification.type === "post") {
                  router.push("/post-detail");
                }
              }}
            >
              <View
                style={[
                  styles.notificationIcon,
                  { backgroundColor: notification.backgroundColor },
                ]}
              >
                <Ionicons
                  name={notification.icon as any}
                  size={24}
                  color={notification.iconColor}
                />
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                activeOpacity={0.7}
                onPress={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}
              >
                <Ionicons name="close-circle" size={20} color="#999999" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  headerStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
    gap: 20,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 13,
    color: "#666666",
  },
  statsDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e0e0e0",
  },
  markAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff5f2",
  },
  markAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e6491e",
  },
  filterContainer: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    maxHeight: 60,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    flexGrow: 0,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f4f4f4",
  },
  filterTabActive: {
    backgroundColor: "#e6491e",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  filterTextActive: {
    color: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: "#e6491e",
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e6491e",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999999",
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
  },
});
