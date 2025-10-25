import AsyncStorage from "@react-native-async-storage/async-storage";
import { notificationsApi } from "@/services/api/api.service";
import * as Notifications from "expo-notifications";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { notificationService } from "../utils/notificationService";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  sendNotification: (title: string, body: string, data?: any) => Promise<void>;
  sendEmergencyNotification: (
    title: string,
    body: string,
    data?: any
  ) => Promise<void>;
  scheduleNotification: (
    title: string,
    body: string,
    date: Date,
    data?: any
  ) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
  const responseListener = useRef<Notifications.Subscription | undefined>(undefined);
  const STORAGE_KEY_READ = "@notifications_read_status";
  const STORAGE_KEY_DELETED = "@notifications_deleted";

  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications();
    
    // Load initial unread count
    refreshUnreadCount();

    // Listen for notifications received while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        // Refresh unread count when new notification arrives
        refreshUnreadCount();
      });

    // Listen for user interactions with notifications
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
        // Handle notification tap - navigate to relevant screen
        const data = response.notification.request.content.data;
        if (data?.screen) {
          // You can use router here to navigate based on data.screen
          console.log("Navigate to:", data.screen);
        }
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const registerForPushNotifications = async () => {
    const token = await notificationService.registerForPushNotifications();
    setExpoPushToken(token);
  };

  const sendNotification = async (
    title: string,
    body: string,
    data?: any
  ): Promise<void> => {
    await notificationService.sendNotification({
      title,
      body,
      data,
    });
  };

  const sendEmergencyNotification = async (
    title: string,
    body: string,
    data?: any
  ): Promise<void> => {
    await notificationService.sendEmergencyNotification(title, body, data);
  };

  const scheduleNotification = async (
    title: string,
    body: string,
    date: Date,
    data?: any
  ): Promise<void> => {
    await notificationService.scheduleNotificationAt(
      {
        title,
        body,
        data,
      },
      date
    );
  };

  const cancelAllNotifications = async (): Promise<void> => {
    await notificationService.cancelAllNotifications();
  };

  const refreshUnreadCount = async (): Promise<void> => {
    try {
      const response = await notificationsApi.getAll();
      
      if (response.success && response.data) {
        // Load local read status and deleted IDs
        const readStatus = await getReadStatus();
        const deletedIds = await getDeletedIds();
        
        // Filter and count unread notifications
        const unread = response.data
          .filter((notif: any) => !deletedIds.includes(notif.id))
          .filter((notif: any) => {
            const isRead = readStatus[notif.id] !== undefined ? readStatus[notif.id] : notif.isRead;
            return !isRead;
          });
        
        setUnreadCount(unread.length);
      }
    } catch (error) {
      console.error("Error refreshing unread count:", error);
    }
  };

  const getReadStatus = async (): Promise<Record<string, boolean>> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_READ);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      return {};
    }
  };

  const getDeletedIds = async (): Promise<string[]> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_DELETED);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        unreadCount,
        refreshUnreadCount,
        sendNotification,
        sendEmergencyNotification,
        scheduleNotification,
        cancelAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
