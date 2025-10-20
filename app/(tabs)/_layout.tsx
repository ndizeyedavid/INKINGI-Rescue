import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Tabs, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function AppLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#e6491e",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />

      <Tabs.Screen
        name="sos"
        options={{
          title: "SOS",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="error-outline" size={size} color={color} />
          ),
          tabBarBadge: "2",
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.centralButton,
                !focused && styles.centralButtonInactive,
              ]}
            >
              <MaterialIcons
                name="map"
                size={28}
                color={focused ? "#ffffff" : "#ffffff"}
              />
            </View>
          ),
          tabBarLabel: () => null,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            router.push("/emergencies-map");
          },
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="people-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="person-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#ffffff",
    borderTopWidth: 0,
    elevation: 0,
    height: 95,
    paddingBottom: 10,
    paddingTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: "absolute",
  },
  tabBarBackground: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flex: 1,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  centralButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e6491e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#e6491e",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centralButtonInactive: {
    backgroundColor: "#e6491e",
    opacity: 1,
    shadowColor: "#000",
    shadowOpacity: 0.15,
  },
});
