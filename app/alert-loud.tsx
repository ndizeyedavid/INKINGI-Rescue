import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Brightness from "expo-brightness";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { shakeEmergencyService } from "@/services/shakeEmergency.service";

export default function AlertLoud() {
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [originalBrightness, setOriginalBrightness] = useState<number>(0.5);
  const [emergencySubmitted, setEmergencySubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(1)).current;
  const hapticInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const cameraRef = useRef<any>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    // Initialize emergency flow
    initializeEmergency();

    // Start pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Start flashing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 0.6,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Set brightness to maximum
    setBrightnessToMax();

    // Start haptic feedback
    startHapticFeedback();

    // Load and play alarm sound at maximum app volume
    playAlarmSound();

    return () => {
      // Cleanup sound on unmount
      if (sound) {
        sound.unloadAsync();
      }
      // Stop haptic feedback
      stopHapticFeedback();
      // Restore original brightness
      restoreBrightness();
    };
  }, []);

  const initializeEmergency = async () => {
    try {
      console.log("🚨 SHAKE EMERGENCY DETECTED - Starting automatic emergency submission...");
      
      // Request camera permission if not granted
      if (!cameraPermission?.granted) {
        console.log("Requesting camera permission...");
        const result = await requestCameraPermission();
        console.log("Camera permission result:", result?.granted);
        
        // Wait a bit for camera to initialize after permission granted
        if (result?.granted) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Execute shake emergency flow with camera ref
      console.log("Camera ref available:", !!cameraRef.current);
      const success = await shakeEmergencyService.executeShakeEmergency(
        cameraRef.current
      );

      setEmergencySubmitted(success);
      setIsProcessing(false);

      if (success) {
        console.log("✅ Emergency submitted successfully");
      } else {
        console.error("❌ Failed to submit emergency");
      }
    } catch (error) {
      console.error("Error initializing emergency:", error);
      setIsProcessing(false);
    }
  };

  const setBrightnessToMax = async () => {
    try {
      // Get current brightness to restore later
      const currentBrightness = await Brightness.getBrightnessAsync();
      setOriginalBrightness(currentBrightness);

      // Set brightness to maximum (1.0)
      await Brightness.setBrightnessAsync(1.0);
    } catch (error) {
      console.error("Error setting brightness:", error);
    }
  };

  const restoreBrightness = async () => {
    try {
      // Restore original brightness
      await Brightness.setBrightnessAsync(originalBrightness);
    } catch (error) {
      console.error("Error restoring brightness:", error);
    }
  };

  const startHapticFeedback = () => {
    // LAYER 1: High-intensity vibration pattern (strong physical vibration)
    // Pattern: 500ms vibrate, 200ms pause, 500ms vibrate, 200ms pause (repeats)
    const pattern = [0, 500, 200, 500, 200];
    Vibration.vibrate(pattern, true); // true = repeat indefinitely

    // LAYER 2: Add haptic feedback on top for even more intensity
    // Trigger heavy haptic impacts at regular intervals
    hapticInterval.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 200); // Slightly offset from vibration pattern for layered effect
  };

  const stopHapticFeedback = () => {
    // Stop vibration layer
    Vibration.cancel();

    // Stop haptic layer
    if (hapticInterval.current) {
      clearInterval(hapticInterval.current);
      hapticInterval.current = null;
    }
  };

  const playAlarmSound = async () => {
    try {
      // Set audio mode for maximum volume with iOS-specific settings
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
        // iOS-specific: Use playback category for maximum control
        allowsRecordingIOS: false,
        interruptionModeIOS: 2, // DoNotMix - ensures full volume
        interruptionModeAndroid: 1, // DoNotMix
      });

      // Create alarm sound with maximum volume settings
      const { sound: alarmSound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/alert.mp3"),
        {
          isLooping: true,
          volume: 1.0,
          // iOS-specific: Ensure audio plays at system volume
          shouldPlay: false,
          rate: 1.0,
          shouldCorrectPitch: true,
          pitchCorrectionQuality: Audio.PitchCorrectionQuality.High,
        },
        // Status update callback
        null,
        // Download first (for remote files)
        true
      );

      // Set volume to maximum before playing
      await alarmSound.setVolumeAsync(1);

      setSound(alarmSound);
      await alarmSound.playAsync();
    } catch (error) {
      console.error("Error playing alarm sound:", error);
    }
  };

  const handleStopAlert = async () => {
    // Stop haptic feedback
    stopHapticFeedback();

    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    // Restore brightness before leaving
    await restoreBrightness();
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Pulsing Alert Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Ionicons name="warning" size={120} color="#ffffff" />
          </Animated.View>

          {/* Alert Text */}
          <Animated.View style={{ opacity: flashAnim }}>
            <Text style={styles.alertTitle}>EMERGENCY ALERT</Text>
            <Text style={styles.alertSubtitle}>Help Signal Active</Text>
          </Animated.View>

          {/* Volume Warning */}
          <View style={styles.volumeWarning}>
            <Ionicons name="volume-high" size={24} color="#ffffff" />
            <Text style={styles.volumeWarningText}>
              Please ensure your device volume is turned up for maximum alert
            </Text>
          </View>

          {/* Status Indicators */}
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Ionicons 
                name={isProcessing ? "hourglass" : emergencySubmitted ? "checkmark-circle" : "close-circle"} 
                size={32} 
                color="#ffffff" 
              />
              <Text style={styles.statusText}>
                {isProcessing ? "Submitting Emergency..." : emergencySubmitted ? "Emergency Submitted" : "Submission Failed"}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name="location" size={32} color="#ffffff" />
              <Text style={styles.statusText}>Location Captured</Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name="mic" size={32} color="#ffffff" />
              <Text style={styles.statusText}>Audio Recorded (5s)</Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name="camera" size={32} color="#ffffff" />
              <Text style={styles.statusText}>Photo Captured</Text>
            </View>
          </View>

          {/* Info Text */}
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={24} color="#ffffff" />
            <Text style={styles.infoText}>
              {emergencySubmitted 
                ? "Emergency data submitted successfully. Responders have been notified with your location, audio, and photo."
                : "Collecting emergency data automatically. Your location, audio, and photo are being captured."}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Hidden Camera View for Photo Capture */}
      {cameraPermission?.granted && (
        <View style={styles.hiddenCamera}>
          <CameraView
            ref={cameraRef}
            style={{ width: 1, height: 1 }}
            facing="back"
          />
        </View>
      )}

      {/* Stop Alert Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.stopButton}
          activeOpacity={0.8}
          onPress={handleStopAlert}
        >
          <Ionicons name="stop-circle" size={32} color="#e6491e" />
          <Text style={styles.stopButtonText}>Stop Alert</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6491e",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 40,
  },
  alertTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 2,
  },
  alertSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.9,
  },
  volumeWarning: {
    display: "none",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 40,
  },
  volumeWarningText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
    lineHeight: 18,
  },
  statusContainer: {
    width: "100%",
    gap: 24,
    marginBottom: 40,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  infoContainer: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#ffffff",
    lineHeight: 20,
  },
  footer: {
    padding: 24,
  },
  stopButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#ffffff",
    paddingVertical: 20,
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
  stopButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e6491e",
  },
  hiddenCamera: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
    overflow: "hidden",
  },
});
