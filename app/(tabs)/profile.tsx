import PageHeader from "@/components/pageHeader";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const menuItems = [
    {
      title: t("profile.accountDetails"),
      icon: "person-outline",
      route: "/account-details",
    },
    {
      title: t("profile.setupSoS"),
      icon: "alert-circle-outline",
      route: "/setup-sos",
    },
    {
      title: "Settings",
      icon: "settings-outline",
      route: "/settings",
    },
    {
      title: "About",
      icon: "information-circle-outline",
      route: "/about",
    },
  ];

  const handleMenuPress = (route: string) => {
    router.push(route as any);
  };

  const handleLogout = () => {
    console.log("Logout pressed");
    // Add logout logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="Profile" />

      <View style={styles.content}>
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item.route)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color="#000000" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 35,
  },
  menuContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#ffffff",
    borderRadius: 70,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e6491e",
    marginBottom: 20,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e6491e",
  },
});
