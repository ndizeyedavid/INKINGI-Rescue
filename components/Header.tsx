import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Header() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { unreadCount } = useNotification();

  // Format user name - capitalize first letter of each word
  const formatName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const displayName = user?.firstName && user?.lastName
    ? formatName(`${user.firstName} ${user.lastName}`)
    : user?.name
    ? formatName(user.name)
    : 'Guest';

  return (
    <View style={styles.headerContainer}>
      <View className="ml-4">
        <Text>{t("common.hello")}</Text>
        <Text style={styles.headerText}>{displayName.toUpperCase()}</Text>
      </View>

      <TouchableOpacity
        style={styles.notificationContainer}
        activeOpacity={0.7}
        onPress={() => router.push("/notifications")}
      >
        <Ionicons name="notifications-outline" size={27} color="black" />
        {unreadCount > 0 && <View style={styles.notificationBadge} />}
      </TouchableOpacity>
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
