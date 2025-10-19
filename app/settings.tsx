import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const router = useRouter();
  // Permissions
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // App Settings
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoShareLocation, setAutoShareLocation] = useState(true);

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
                onValueChange={setLocationEnabled}
                trackColor={{ false: "#d1d5db", true: "#fecaca" }}
                thumbColor={locationEnabled ? "#e6491e" : "#f4f3f4"}
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
                onValueChange={setCameraEnabled}
                trackColor={{ false: "#d1d5db", true: "#fecaca" }}
                thumbColor={cameraEnabled ? "#e6491e" : "#f4f3f4"}
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
                onValueChange={setMicrophoneEnabled}
                trackColor={{ false: "#d1d5db", true: "#fecaca" }}
                thumbColor={microphoneEnabled ? "#e6491e" : "#f4f3f4"}
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
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#d1d5db", true: "#fecaca" }}
                thumbColor={notificationsEnabled ? "#e6491e" : "#f4f3f4"}
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
