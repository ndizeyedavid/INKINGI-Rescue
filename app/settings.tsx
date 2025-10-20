import CustomAlert from "@/components/CustomAlert";
import { useNotification } from "@/context/NotificationContext";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const router = useRouter();
  const { sendNotification, sendEmergencyNotification } = useNotification();

  // Permissions
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);

  // App Settings
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoShareLocation, setAutoShareLocation] = useState(true);

  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    type: "error" | "success" | "warning" | "info";
    title: string;
    message: string;
  }>({
    type: "success",
    title: "",
    message: "",
  });

  const showAlert = (
    type: "error" | "success" | "warning" | "info",
    title: string,
    message: string
  ) => {
    setAlertConfig({ type, title, message });
    setAlertVisible(true);
  };

  const handleTestNotification = async () => {
    try {
      await sendNotification(
        "🔔 Test Notification",
        "Your notifications are working perfectly! You'll receive alerts for emergencies near you.",
        { screen: "/settings", test: true }
      );
      showAlert(
        "success",
        "Notification Sent!",
        "Check your notification tray to see the test notification."
      );
    } catch (error) {
      console.log(error);
      showAlert(
        "error",
        "Error",
        "Failed to send notification. Please check your notification permissions."
      );
    }
  };

  const handleTestEmergencyNotification = async () => {
    try {
      await sendEmergencyNotification(
        "🚨 Emergency Alert Test",
        "This is a high-priority emergency notification test. In a real emergency, you would receive critical updates like this.",
        { screen: "/view-sos", test: true }
      );
      showAlert(
        "success",
        "Emergency Alert Sent!",
        "Check your notification tray for the high-priority emergency notification."
      );
    } catch (error) {
      showAlert(
        "error",
        "Error",
        "Failed to send emergency notification. Please check your notification permissions."
      );
    }
  };

  // Check all permissions on mount
  useEffect(() => {
    checkAllPermissions();
  }, []);

  const checkAllPermissions = async () => {
    setIsCheckingPermissions(true);
    await Promise.all([
      checkLocationPermission(),
      checkCameraPermission(),
      checkMicrophonePermission(),
      checkNotificationPermission(),
    ]);
    setIsCheckingPermissions(false);
  };

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationEnabled(status === "granted");
    } catch (error) {
      console.error("Error checking location permission:", error);
    }
  };

  const checkCameraPermission = async () => {
    try {
      const { status } = await Camera.getCameraPermissionsAsync();
      setCameraEnabled(status === "granted");
    } catch (error) {
      console.error("Error checking camera permission:", error);
    }
  };

  const checkMicrophonePermission = async () => {
    try {
      const { status } = await Audio.getPermissionsAsync();
      setMicrophoneEnabled(status === "granted");
    } catch (error) {
      console.error("Error checking microphone permission:", error);
    }
  };

  const checkNotificationPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationsEnabled(status === "granted");
    } catch (error) {
      console.error("Error checking notification permission:", error);
    }
  };

  const handleLocationToggle = async (value: boolean) => {
    if (value) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          setLocationEnabled(true);
          showAlert(
            "success",
            "Location Enabled",
            "Location access has been granted. You can now share your location during emergencies."
          );
        } else {
          setLocationEnabled(false);
          showAlert(
            "warning",
            "Permission Denied",
            "Location permission was denied. Please enable it in your device settings to use location features."
          );
        }
      } catch (error) {
        setLocationEnabled(false);
        showAlert(
          "error",
          "Error",
          "Failed to request location permission. Please try again."
        );
      }
    } else {
      setLocationEnabled(false);
      showAlert(
        "info",
        "Location Disabled",
        "To re-enable location access, you'll need to grant permission again or enable it in device settings."
      );
    }
  };

  const handleCameraToggle = async (value: boolean) => {
    if (value) {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === "granted") {
          setCameraEnabled(true);
          showAlert(
            "success",
            "Camera Enabled",
            "Camera access has been granted. You can now take photos during emergency reports."
          );
        } else {
          setCameraEnabled(false);
          showAlert(
            "warning",
            "Permission Denied",
            "Camera permission was denied. Please enable it in your device settings to take photos."
          );
        }
      } catch (error) {
        setCameraEnabled(false);
        showAlert(
          "error",
          "Error",
          "Failed to request camera permission. Please try again."
        );
      }
    } else {
      setCameraEnabled(false);
      showAlert(
        "info",
        "Camera Disabled",
        "To re-enable camera access, you'll need to grant permission again or enable it in device settings."
      );
    }
  };

  const handleMicrophoneToggle = async (value: boolean) => {
    if (value) {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status === "granted") {
          setMicrophoneEnabled(true);
          showAlert(
            "success",
            "Microphone Enabled",
            "Microphone access has been granted. You can now record audio during emergencies."
          );
        } else {
          setMicrophoneEnabled(false);
          showAlert(
            "warning",
            "Permission Denied",
            "Microphone permission was denied. Please enable it in your device settings."
          );
        }
      } catch (error) {
        setMicrophoneEnabled(false);
        showAlert(
          "error",
          "Error",
          "Failed to request microphone permission. Please try again."
        );
      }
    } else {
      setMicrophoneEnabled(false);
      showAlert(
        "info",
        "Microphone Disabled",
        "To re-enable microphone access, you'll need to grant permission again or enable it in device settings."
      );
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === "granted") {
          setNotificationsEnabled(true);
          showAlert(
            "success",
            "Notifications Enabled",
            "You will now receive emergency alerts and updates."
          );
        } else {
          setNotificationsEnabled(false);
          showAlert(
            "warning",
            "Permission Denied",
            "Notification permission was denied. Please enable it in your device settings to receive emergency alerts."
          );
        }
      } catch (error) {
        setNotificationsEnabled(false);
        showAlert(
          "error",
          "Error",
          "Failed to request notification permission. Please try again."
        );
      }
    } else {
      setNotificationsEnabled(false);
      if (Platform.OS === "ios") {
        showAlert(
          "info",
          "Notifications Disabled",
          "To re-enable notifications, please go to Settings > Notifications > INKINGI Rescue."
        );
      } else {
        showAlert(
          "info",
          "Notifications Disabled",
          "To re-enable notifications, please go to Settings > Apps > INKINGI Rescue > Notifications."
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Permissions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          <Text style={styles.sectionSubtitle}>
            Manage app permissions for better functionality
          </Text>

          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="location" size={20} color="#e6491e" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Location Access</Text>
                  <Text style={styles.settingDescription}>
                    Required for emergency alerts
                  </Text>
                </View>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={handleLocationToggle}
                trackColor={{ false: "#d1d5db", true: "#fecaca" }}
                thumbColor={locationEnabled ? "#e6491e" : "#f4f3f4"}
                disabled={isCheckingPermissions}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="camera" size={20} color="#e6491e" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Camera Access</Text>
                  <Text style={styles.settingDescription}>
                    Take photos during emergencies
                  </Text>
                </View>
              </View>
              <Switch
                value={cameraEnabled}
                onValueChange={handleCameraToggle}
                trackColor={{ false: "#d1d5db", true: "#fecaca" }}
                thumbColor={cameraEnabled ? "#e6491e" : "#f4f3f4"}
                disabled={isCheckingPermissions}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="mic" size={20} color="#e6491e" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Microphone Access</Text>
                  <Text style={styles.settingDescription}>
                    Record audio during emergencies
                  </Text>
                </View>
              </View>
              <Switch
                value={microphoneEnabled}
                onValueChange={handleMicrophoneToggle}
                trackColor={{ false: "#d1d5db", true: "#fecaca" }}
                thumbColor={microphoneEnabled ? "#e6491e" : "#f4f3f4"}
                disabled={isCheckingPermissions}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="notifications" size={20} color="#e6491e" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive emergency alerts
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: "#d1d5db", true: "#fecaca" }}
                thumbColor={notificationsEnabled ? "#e6491e" : "#f4f3f4"}
                disabled={isCheckingPermissions}
              />
            </View>
          </View>
        </View>

        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          <Text style={styles.sectionSubtitle}>
            Customize your app experience
          </Text>

          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="volume-high" size={20} color="#e6491e" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Sound Effects</Text>
                  <Text style={styles.settingDescription}>
                    Play sounds for alerts
                  </Text>
                </View>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: "#d1d5db", true: "#fecaca" }}
                thumbColor={soundEnabled ? "#e6491e" : "#f4f3f4"}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="phone-portrait" size={20} color="#e6491e" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Vibration</Text>
                  <Text style={styles.settingDescription}>
                    Vibrate on alerts
                  </Text>
                </View>
              </View>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: "#d1d5db", true: "#fecaca" }}
                thumbColor={vibrationEnabled ? "#e6491e" : "#f4f3f4"}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="navigate" size={20} color="#e6491e" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Auto-Share Location</Text>
                  <Text style={styles.settingDescription}>
                    Share location during SOS
                  </Text>
                </View>
              </View>
              <Switch
                value={autoShareLocation}
                onValueChange={setAutoShareLocation}
                trackColor={{ false: "#d1d5db", true: "#fecaca" }}
                thumbColor={autoShareLocation ? "#e6491e" : "#f4f3f4"}
              />
            </View>
          </View>
        </View>

        {/* Developer Tools Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer Tools</Text>
          <Text style={styles.sectionSubtitle}>
            Test notification functionality
          </Text>

          <View style={styles.settingsList}>
            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={handleTestNotification}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#e6491e"
                  />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Test Notification</Text>
                  <Text style={styles.settingDescription}>
                    Send a test notification
                  </Text>
                </View>
              </View>
              <Ionicons name="send" size={20} color="#e6491e" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={handleTestEmergencyNotification}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="alert-circle" size={20} color="#e6491e" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Test Emergency Alert</Text>
                  <Text style={styles.settingDescription}>
                    Send high-priority alert
                  </Text>
                </View>
              </View>
              <Ionicons name="send" size={20} color="#e6491e" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Other Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other</Text>

          <View style={styles.settingsList}>
            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={() => router.push("/language")}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="language" size={20} color="#e6491e" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Language</Text>
                  <Text style={styles.settingDescription}>English</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={() => router.push("/privacy-policy")}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="shield-checkmark" size={20} color="#e6491e" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Privacy Policy</Text>
                  <Text style={styles.settingDescription}>
                    View our privacy policy
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={() => router.push("/terms-of-service")}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="document-text" size={20} color="#e6491e" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Terms of Service</Text>
                  <Text style={styles.settingDescription}>
                    Read terms and conditions
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0 Alpha</Text>
        </View>
      </ScrollView>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 16,
  },
  settingsList: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
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
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: "#666666",
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: "#999999",
  },
});
