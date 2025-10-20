import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Brightness from "expo-brightness";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Broadcast severity levels
type SeverityLevel = "extreme" | "severe" | "moderate" | "minor";

interface BroadcastData {
  id: string;
  title: string;
  message: string;
  severity: SeverityLevel;
  issuer: string;
  timestamp: Date;
  expiresAt: Date;
  affectedAreas: string[];
  instructions: string[];
  emergencyContacts: {
    name: string;
    number: string;
  }[];
  actionRequired: boolean;
}

export default function EmergencyBroadcast() {
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [originalBrightness, setOriginalBrightness] = useState<number>(0.5);
  const [acknowledged, setAcknowledged] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(1)).current;
  const hapticInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mock broadcast data - In production, this would come from a push notification or API
  const broadcast: BroadcastData = {
    id: "BROADCAST-2025-001",
    title: "EXTREME WEATHER ALERT",
    message:
      "A severe storm warning has been issued for your area. Heavy rainfall, strong winds, and potential flooding expected. Residents are advised to stay indoors and avoid unnecessary travel.",
    severity: "extreme",
    issuer: "National Emergency Management Agency",
    timestamp: new Date(),
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    affectedAreas: ["Kigali City", "Eastern Province", "Southern Province"],
    instructions: [
      "Stay indoors and away from windows",
      "Secure loose outdoor items",
      "Prepare emergency supplies (water, food, flashlight)",
      "Charge all electronic devices",
      "Monitor local news and weather updates",
      "Do not attempt to cross flooded areas",
    ],
    emergencyContacts: [
      { name: "Emergency Services", number: "112" },
      { name: "Police", number: "113" },
      { name: "Fire Department", number: "111" },
      { name: "Ambulance", number: "912" },
    ],
    actionRequired: true,
  };

  useEffect(() => {
    // Start animations
    startAnimations();

    // Set brightness to maximum for visibility
    setBrightnessToMax();

    // Start alert feedback
    startAlertFeedback();

    // Play alert sound
    // playAlertSound();

    return () => {
      // Cleanup
      if (sound) {
        sound
          .getStatusAsync()
          .then((status) => {
            if (status.isLoaded) {
              sound.unloadAsync();
            }
          })
          .catch((error) => {
            console.error("Error cleaning up sound:", error);
          });
      }
      stopAlertFeedback();
      restoreBrightness();
    };
  }, []);

  const startAnimations = () => {
    // Pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Flashing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 0.7,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const setBrightnessToMax = async () => {
    try {
      const currentBrightness = await Brightness.getBrightnessAsync();
      setOriginalBrightness(currentBrightness);
      await Brightness.setBrightnessAsync(1.0);
    } catch (error) {
      console.error("Error setting brightness:", error);
    }
  };

  const restoreBrightness = async () => {
    try {
      await Brightness.setBrightnessAsync(originalBrightness);
    } catch (error) {
      console.error("Error restoring brightness:", error);
    }
  };

  const startAlertFeedback = () => {
    // Vibration pattern for government alert
    const pattern = [0, 300, 100, 300, 100, 300];
    // Vibration.vibrate(pattern, true);

    // Add haptic feedback
    hapticInterval.current = setInterval(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }, 200);
  };

  const stopAlertFeedback = () => {
    Vibration.cancel();
    if (hapticInterval.current) {
      clearInterval(hapticInterval.current);
      hapticInterval.current = null;
    }
  };

  const playAlertSound = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
      });

      const { sound: alertSound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/alert.mp3"),
        {
          isLooping: true,
          volume: 0.8,
          shouldPlay: true,
        }
      );

      setSound(alertSound);
    } catch (error) {
      console.error("Error playing alert sound:", error);
    }
  };

  const handleAcknowledge = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAcknowledged(true);

    // Stop alert feedback
    stopAlertFeedback();
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      } catch (error) {
        console.error("Error stopping sound:", error);
      }
    }
  };

  const handleDismiss = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    stopAlertFeedback();
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      } catch (error) {
        console.error("Error stopping sound:", error);
      }
    }
    await restoreBrightness();
    router.back();
  };

  const handleCallEmergency = (number: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`tel:${number}`);
  };

  const getSeverityConfig = (severity: SeverityLevel) => {
    switch (severity) {
      case "extreme":
        return {
          color: "#DC2626",
          bgColor: "#DC2626",
          icon: "warning" as const,
          label: "EXTREME",
        };
      case "severe":
        return {
          color: "#EA580C",
          bgColor: "#EA580C",
          icon: "error" as const,
          label: "SEVERE",
        };
      case "moderate":
        return {
          color: "#F59E0B",
          bgColor: "#F59E0B",
          icon: "warning" as const,
          label: "MODERATE",
        };
      case "minor":
        return {
          color: "#3B82F6",
          bgColor: "#3B82F6",
          icon: "info" as const,
          label: "ADVISORY",
        };
    }
  };

  const severityConfig = getSeverityConfig(broadcast.severity);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: severityConfig.bgColor }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Alert Header */}
          <Animated.View
            style={[
              styles.headerContainer,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <MaterialIcons
              name={severityConfig.icon}
              size={80}
              color="#ffffff"
            />
          </Animated.View>

          <Animated.View style={{ opacity: flashAnim }}>
            <View style={styles.severityBadge}>
              <Text style={styles.severityText}>{severityConfig.label}</Text>
            </View>
            <Text style={styles.alertTitle}>{broadcast.title}</Text>
          </Animated.View>

          {/* Issuer Information */}
          <View style={styles.issuerContainer}>
            <MaterialIcons name="verified" size={20} color="#ffffff" />
            <Text style={styles.issuerText}>{broadcast.issuer}</Text>
          </View>

          {/* Broadcast ID and Time */}
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>ID: {broadcast.id}</Text>
            <Text style={styles.metaText}>
              {broadcast.timestamp.toLocaleTimeString()} •{" "}
              {broadcast.timestamp.toLocaleDateString()}
            </Text>
          </View>

          {/* Alert Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageTitle}>ALERT MESSAGE</Text>
            <Text style={styles.messageText}>{broadcast.message}</Text>
          </View>

          {/* Affected Areas */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location" size={24} color="#ffffff" />
              <Text style={styles.sectionTitle}>Affected Areas</Text>
            </View>
            {broadcast.affectedAreas.map((area, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>{area}</Text>
              </View>
            ))}
          </View>

          {/* Safety Instructions */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="checklist" size={24} color="#ffffff" />
              <Text style={styles.sectionTitle}>Safety Instructions</Text>
            </View>
            {broadcast.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Emergency Contacts */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="call" size={24} color="#ffffff" />
              <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            </View>
            {broadcast.emergencyContacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactItem}
                onPress={() => handleCallEmergency(contact.number)}
                activeOpacity={0.7}
              >
                <View style={styles.contactInfo}>
                  <Ionicons name="call-outline" size={20} color="#ffffff" />
                  <Text style={styles.contactName}>{contact.name}</Text>
                </View>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Expiration Notice */}
          <View style={styles.expirationContainer}>
            <Ionicons name="time-outline" size={18} color="#ffffff" />
            <Text style={styles.expirationText}>
              This alert expires at {broadcast.expiresAt.toLocaleTimeString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {!acknowledged && broadcast.actionRequired && (
          <TouchableOpacity
            style={styles.acknowledgeButton}
            activeOpacity={0.8}
            onPress={handleAcknowledge}
          >
            <MaterialIcons
              name="check-circle"
              size={28}
              color={severityConfig.color}
            />
            <Text
              style={[
                styles.acknowledgeButtonText,
                { color: severityConfig.color },
              ]}
            >
              I Understand
            </Text>
          </TouchableOpacity>
        )}

        {acknowledged && (
          <View style={styles.acknowledgedBanner}>
            <MaterialIcons name="verified" size={24} color="#10B981" />
            <Text style={styles.acknowledgedText}>Alert Acknowledged</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.dismissButton,
            acknowledged && styles.dismissButtonAcknowledged,
          ]}
          activeOpacity={0.8}
          onPress={handleDismiss}
        >
          <Ionicons
            name="close-circle"
            size={24}
            color={acknowledged ? "#ffffff" : "rgba(255, 255, 255, 0.7)"}
          />
          <Text
            style={[
              styles.dismissButtonText,
              acknowledged && styles.dismissButtonTextAcknowledged,
            ]}
          >
            {acknowledged ? "Close Broadcast" : "Dismiss"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  severityBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  severityText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 2,
  },
  alertTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1,
  },
  issuerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  issuerText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
  metaContainer: {
    alignItems: "center",
    gap: 4,
    marginBottom: 24,
  },
  metaText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  messageContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  messageTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#ffffff",
    fontWeight: "500",
  },
  sectionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "500",
  },
  instructionItem: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "500",
    lineHeight: 22,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  contactName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  expirationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  expirationText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    gap: 12,
  },
  acknowledgeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#ffffff",
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  acknowledgeButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  acknowledgedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#10B981",
  },
  acknowledgedText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10B981",
  },
  dismissButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  dismissButtonAcknowledged: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderColor: "#ffffff",
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },
  dismissButtonTextAcknowledged: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
