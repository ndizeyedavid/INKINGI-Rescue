import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: boolean;
  badge?: number;
  priority?: "default" | "low" | "high" | "max";
  categoryIdentifier?: string;
}

class NotificationService {
  private expoPushToken: string | null = null;

  /**
   * Register for push notifications and get the Expo push token
   */
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log("Must use physical device for Push Notifications");
      return null;
    }

    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return null;
      }

      // Get projectId from app config (recommended by Expo docs)
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      this.expoPushToken = token.data;

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#E6491E",
        });

        // Emergency channel for critical alerts
        Notifications.setNotificationChannelAsync("emergency", {
          name: "Emergency Alerts",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 500, 250, 500],
          lightColor: "#FF0000",
          sound: "default",
        });
      }

      return token.data;
    } catch (error) {
      console.error("Error registering for push notifications:", error);
      return null;
    }
  }

  /**
   * Schedule a local notification
   */
  async scheduleNotification(
    notification: NotificationData,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    const content: Notifications.NotificationContentInput = {
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
      sound: notification.sound !== false,
      priority:
        notification.priority === "max"
          ? Notifications.AndroidNotificationPriority.MAX
          : notification.priority === "high"
            ? Notifications.AndroidNotificationPriority.HIGH
            : notification.priority === "low"
              ? Notifications.AndroidNotificationPriority.LOW
              : Notifications.AndroidNotificationPriority.DEFAULT,
    };

    // Only add badge if it's explicitly set
    if (notification.badge !== undefined && notification.badge !== null) {
      content.badge = notification.badge;
    }

    // Only add categoryIdentifier if it's set
    if (notification.categoryIdentifier) {
      content.categoryIdentifier = notification.categoryIdentifier;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger: trigger || null, // null means immediate
    });

    return notificationId;
  }

  /**
   * Send an immediate local notification
   */
  async sendNotification(notification: NotificationData): Promise<string> {
    return this.scheduleNotification(notification, null);
  }

  /**
   * Send an emergency notification (high priority)
   */
  async sendEmergencyNotification(
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<string> {
    return this.sendNotification({
      title,
      body,
      data,
      priority: "max",
      sound: true,
      categoryIdentifier: "emergency",
    });
  }

  /**
   * Schedule a notification for a specific time
   */
  async scheduleNotificationAt(
    notification: NotificationData,
    date: Date
  ): Promise<string> {
    return this.scheduleNotification(notification, {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
    });
  }

  /**
   * Schedule a repeating notification
   */
  async scheduleRepeatingNotification(
    notification: NotificationData,
    seconds: number
  ): Promise<string> {
    return this.scheduleNotification(notification, {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: true,
    });
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get all scheduled notifications
   */
  async getAllScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  /**
   * Dismiss a notification
   */
  async dismissNotification(notificationId: string): Promise<void> {
    await Notifications.dismissNotificationAsync(notificationId);
  }

  /**
   * Dismiss all notifications
   */
  async dismissAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }

  /**
   * Get the Expo push token
   */
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Add notification received listener
   */
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  /**
   * Add notification response listener (when user taps notification)
   */
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  /**
   * Set badge count (iOS)
   */
  async setBadgeCount(count: number): Promise<boolean> {
    return await Notifications.setBadgeCountAsync(count);
  }

  /**
   * Get badge count (iOS)
   */
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export Notifications for direct access if needed
export { Notifications };
