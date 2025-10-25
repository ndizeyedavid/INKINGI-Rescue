import { notificationsApi } from "@/services/api/api.service";
import { useNotification } from "@/context/NotificationContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type NotificationType = "emergency" | "post" | "system" | "alert";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  relatedId?: string;
}

export default function Notifications() {
  const router = useRouter();
  const { refreshUnreadCount } = useNotification();
  const [filter, setFilter] = useState<"all" | NotificationType>("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const STORAGE_KEY_READ = "@notifications_read_status";
  const STORAGE_KEY_DELETED = "@notifications_deleted";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsApi.getAll();
      
      if (response.success && response.data) {
        // Load local read status and deleted IDs
        const readStatus = await getReadStatus();
        const deletedIds = await getDeletedIds();
        
        // Filter out deleted notifications and merge with read status
        const notificationsWithReadStatus = response.data
          .filter((notif: Notification) => !deletedIds.includes(notif.id))
          .map((notif: Notification) => ({
            ...notif,
            isRead: readStatus[notif.id] !== undefined ? readStatus[notif.id] : notif.isRead,
          }));
        
        setNotifications(notificationsWithReadStatus);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getReadStatus = async (): Promise<Record<string, boolean>> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_READ);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error loading read status:", error);
      return {};
    }
  };

  const saveReadStatus = async (id: string, isRead: boolean) => {
    try {
      const readStatus = await getReadStatus();
      readStatus[id] = isRead;
      await AsyncStorage.setItem(STORAGE_KEY_READ, JSON.stringify(readStatus));
    } catch (error) {
      console.error("Error saving read status:", error);
    }
  };

  const saveAllReadStatus = async (ids: string[]) => {
    try {
      const readStatus = await getReadStatus();
      ids.forEach(id => {
        readStatus[id] = true;
      });
      await AsyncStorage.setItem(STORAGE_KEY_READ, JSON.stringify(readStatus));
    } catch (error) {
      console.error("Error saving all read status:", error);
    }
  };

  const getDeletedIds = async (): Promise<string[]> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_DELETED);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading deleted IDs:", error);
      return [];
    }
  };

  const saveDeletedId = async (id: string) => {
    try {
      const deletedIds = await getDeletedIds();
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        await AsyncStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(deletedIds));
      }
    } catch (error) {
      console.error("Error saving deleted ID:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (id: string) => {
    // Update local state
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    
    // Save to AsyncStorage
    await saveReadStatus(id, true);
    
    // Refresh unread count in context
    await refreshUnreadCount();
  };

  const markAllAsRead = async () => {
    // Update local state
    setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })));
    
    // Save all to AsyncStorage
    const allIds = notifications.map(n => n.id);
    await saveAllReadStatus(allIds);
    
    // Refresh unread count in context
    await refreshUnreadCount();
  };

  const deleteNotification = async (id: string) => {
    // Update local state
    setNotifications(notifications.filter((notif) => notif.id !== id));
    
    // Save to AsyncStorage
    await saveDeletedId(id);
    
    // Refresh unread count in context
    await refreshUnreadCount();
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((notif) => notif.type === filter);

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  const getNotificationStyle = (type: NotificationType) => {
    switch (type) {
      case "emergency":
        return {
          icon: "warning" as const,
          iconColor: "#dc2626",
          backgroundColor: "#fef2f2",
        };
      case "post":
        return {
          icon: "people" as const,
          iconColor: "#2563eb",
          backgroundColor: "#eff6ff",
        };
      case "alert":
        return {
          icon: "alert-circle" as const,
          iconColor: "#ea580c",
          backgroundColor: "#fff7ed",
        };
      case "system":
        return {
          icon: "settings" as const,
          iconColor: "#16a34a",
          backgroundColor: "#f0fdf4",
        };
      default:
        return {
          icon: "notifications" as const,
          iconColor: "#666666",
          backgroundColor: "#f4f4f4",
        };
    }
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#e6491e" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#e6491e"]}
            tintColor="#e6491e"
          />
        }
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
          filteredNotifications.map((notification) => {
            const style = getNotificationStyle(notification.type);
            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.isRead && styles.notificationCardUnread,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  markAsRead(notification.id);
                  if (notification.type === "emergency" && notification.relatedId) {
                    router.push(`/view-sos?emergencyId=${notification.relatedId}`);
                  } else if (notification.type === "post" && notification.relatedId) {
                    router.push(`/post-detail?postId=${notification.relatedId}`);
                  }
                }}
              >
                <View
                  style={[
                    styles.notificationIcon,
                    { backgroundColor: style.backgroundColor },
                  ]}
                >
                  <Ionicons
                    name={style.icon}
                    size={24}
                    color={style.iconColor}
                  />
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    {!notification.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {formatTime(notification.createdAt)}
                  </Text>
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
            );
          })
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
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
  },
});
