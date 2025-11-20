import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import "@/i18n";
import { shakeEmergencyService } from "@/services/shakeEmergency.service";
import { PanicButton, panicButtonsStorage } from "@/utils/panicButtonsStorage";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { Accelerometer } from "expo-sensors";
import { useCallback, useEffect, useRef, useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

function StackNavigator() {
  const router = useRouter();
  const [shakePanicButtons, setShakePanicButtons] = useState<PanicButton[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  // Shake tracking state - counting shake cycles instead of duration
  const shakeCount = useRef<number>(0);
  const isShaking = useRef<boolean>(false);
  const lastShakeEndTime = useRef<number>(0);
  const triggeredButtons = useRef<Set<string>>(new Set());
  const waitTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const SHAKE_WAIT_DELAY = 1500; // Wait 1.5 seconds after last shake to see if user continues
  const SHAKE_RESET_DELAY = 3000; // Reset count if no shakes for 3 seconds

  const showToast = useCallback((message: string, duration = 2000) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, duration);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Load all panic buttons with shake trigger
  useEffect(() => {
    const loadShakePanicButtons = async () => {
      try {
        const buttons = await panicButtonsStorage.getButtons();

        // Log all panic buttons for debugging
        console.log(
          `Loaded ${buttons.length} panic button(s) from storage:`,
          buttons.map((b) => ({
            id: b.id,
            type: b.type,
            trigger: b.trigger,
            mode: b.mode,
            duration: b.shakeDurationSeconds,
            savedAt: b.savedAt,
          }))
        );

        // Find all panic buttons with "Shake Device" trigger
        const shakeButtons = buttons.filter(
          (button) => button.trigger === "Shake Device"
        );

        if (shakeButtons.length > 0) {
          // Sort by duration (shortest first) so shorter durations are checked first
          const sortedShakeButtons = shakeButtons.sort((a, b) => {
            const durationA = a.shakeDurationSeconds || 1000;
            const durationB = b.shakeDurationSeconds || 1000;
            return durationA - durationB;
          });

          setShakePanicButtons(sortedShakeButtons);

          console.log(
            `Active shake panic buttons (${sortedShakeButtons.length}):`,
            sortedShakeButtons.map((b) => ({
              type: b.type,
              mode: b.mode,
              duration: `${b.shakeDurationSeconds}s`,
            }))
          );
        } else {
          console.log("No shake panic button configured");
        }
      } catch (error) {
        console.error("Error loading shake panic buttons:", error);
      }
    };

    loadShakePanicButtons();
  }, []);

  // Handle silent emergency execution (no UI, no alerts, just submit)
  const handleSilentEmergency = useCallback(
    async (panicButton: PanicButton) => {
      try {
        console.log(
          `🔇 SILENT EMERGENCY MODE - ${panicButton.type} - Submitting quietly...`
        );

        // Request camera permission if not granted (for photo capture)
        let hasCameraPermission = cameraPermission?.granted;
        if (!hasCameraPermission) {
          const result = await requestCameraPermission();
          hasCameraPermission = result?.granted || false;
          // Wait a bit for camera to initialize after permission granted
          if (hasCameraPermission) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }

        // Execute shake emergency flow silently (no UI alerts)
        const success = await shakeEmergencyService.executeShakeEmergency(
          hasCameraPermission ? cameraRef.current : undefined,
          panicButton.type
        );

        if (success) {
          console.log(
            `✅ Silent emergency (${panicButton.type}) submitted successfully`
          );
        } else {
          console.error(
            `❌ Failed to submit silent emergency (${panicButton.type})`
          );
        }
      } catch (error) {
        console.error(
          `Error in silent emergency flow (${panicButton.type}):`,
          error
        );
      }
    },
    [cameraPermission, requestCameraPermission]
  );

  // Trigger a panic button based on its mode
  const triggerPanicButton = useCallback(
    (panicButton: PanicButton) => {
      // Check if this button was already triggered in this shake session
      if (triggeredButtons.current.has(panicButton.id)) {
        console.log(
          `⏭️ Button ${panicButton.type} already triggered in this session`
        );
        return;
      }

      // Mark as triggered
      triggeredButtons.current.add(panicButton.id);

      // Reset shake count after triggering
      shakeCount.current = 0;

      const isSilentMode = panicButton.mode === "Silent";
      showToast(
        `Emergency triggered: ${panicButton.type} (${panicButton.mode})`,
        2500
      );

      if (isSilentMode) {
        // Silent mode: execute emergency flow quietly without UI
        console.log(
          `🔇 Triggering SILENT mode: ${panicButton.type} (${panicButton.shakeDurationSeconds} shakes)`
        );
        handleSilentEmergency(panicButton);
      } else {
        // Loud mode: navigate to alert screen with sounds and alerts
        console.log(
          `🔊 Triggering LOUD mode: ${panicButton.type} (${panicButton.shakeDurationSeconds} shakes)`
        );
        router.push({
          pathname: "/alert-loud",
          params: { emergencyType: panicButton.type },
        });
      }
    },
    [router, handleSilentEmergency, showToast]
  );

  // Check if current shake count matches any button and trigger if user stops shaking
  const checkAndTriggerButtons = useCallback(() => {
    const currentCount = shakeCount.current;

    if (currentCount === 0) return;

    console.log(`🔍 Checking buttons for shake count: ${currentCount}`);

    // Find buttons that match the current shake count
    const matchingButtons = shakePanicButtons.filter(
      (button) => button.shakeDurationSeconds === currentCount
    );

    if (matchingButtons.length > 0) {
      // If multiple buttons match, trigger the first one (or you could trigger all)
      const buttonToTrigger = matchingButtons[0];
      console.log(
        `✅ Shake count ${currentCount} matches ${buttonToTrigger.type} - triggering!`
      );
      triggerPanicButton(buttonToTrigger);
    } else {
      console.log(
        `⏳ Shake count ${currentCount} doesn't match any button yet (waiting for more shakes or reset)`
      );
    }
  }, [shakePanicButtons, triggerPanicButton]);

  // Custom shake detection with shake cycle counting
  useEffect(() => {
    if (shakePanicButtons.length === 0) return;

    const SHAKE_THRESHOLD = 2.0; // Shake intensity threshold
    const SHAKE_DEBOUNCE = 200; // Minimum time between shake start/stop (ms)
    let subscription: any = null;
    let resetTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastShakeEventTime = 0;

    // Set update interval for accelerometer
    Accelerometer.setUpdateInterval(100);

    // Subscribe to accelerometer updates
    subscription = Accelerometer.addListener((accelerometerData: any) => {
      const { x, y, z } = accelerometerData;
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      // Debounce shake events to prevent rapid toggling
      if (now - lastShakeEventTime < SHAKE_DEBOUNCE) {
        return;
      }

      if (acceleration > SHAKE_THRESHOLD) {
        // Shake detected
        if (!isShaking.current) {
          // Shake just started - clear wait timeout if it exists (user is continuing to shake)
          if (waitTimeout.current) {
            clearTimeout(waitTimeout.current);
            waitTimeout.current = null;
          }
          if (resetTimeout) {
            clearTimeout(resetTimeout);
            resetTimeout = null;
          }

          isShaking.current = true;
          lastShakeEventTime = now;
          console.log(`📱 Shake cycle started (count: ${shakeCount.current})`);
        }
      } else {
        // No shake detected
        if (isShaking.current) {
          // Shake just ended - increment count
          isShaking.current = false;
          lastShakeEventTime = now;
          shakeCount.current += 1;
          lastShakeEndTime.current = now;

          console.log(
            `📱 Shake cycle ended - Total count: ${shakeCount.current}`
          );
          showToast(`Shake count: ${shakeCount.current}`);

          // Clear any existing wait timeout
          if (waitTimeout.current) {
            clearTimeout(waitTimeout.current);
            waitTimeout.current = null;
          }

          // Wait a bit to see if user continues shaking
          waitTimeout.current = setTimeout(() => {
            // User stopped shaking - check if count matches any button
            console.log(
              `⏱️ Wait period ended - checking buttons for count: ${shakeCount.current}`
            );
            checkAndTriggerButtons();

            // Also set a reset timeout if no more shakes come
            if (resetTimeout) clearTimeout(resetTimeout);
            resetTimeout = setTimeout(() => {
              console.log(
                `🔄 Resetting shake count (no activity for ${SHAKE_RESET_DELAY}ms)`
              );
              shakeCount.current = 0;
              triggeredButtons.current.clear();
            }, SHAKE_RESET_DELAY);
          }, SHAKE_WAIT_DELAY);
        }
      }
    });

    // Cleanup
    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (waitTimeout.current) {
        clearTimeout(waitTimeout.current);
      }
      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }
    };
  }, [shakePanicButtons, checkAndTriggerButtons]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="new-post"
          options={{
            title: "Create Community Post",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="view-sos"
          options={({ route }: any) => ({
            title: route.params?.emergencyType || "Emergency Details",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="account-details"
          options={{
            title: "Account Details",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="setup-sos"
          options={{
            title: "Setup SoS",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: "About",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="language"
          options={{
            title: "Language",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="privacy-policy"
          options={{
            title: "Privacy Policy",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="terms-of-service"
          options={{
            title: "Terms of Service",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="post-detail"
          options={{
            title: "Post",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            title: "Notifications",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="report-emergency"
          options={{
            title: "Report Emergency",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen
          name="add-emergency-contact"
          options={{
            title: "Add Emergency Contact",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen
          name="edit-emergency-contact"
          options={{
            title: "Edit Emergency Contact",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen
          name="setup-panic-button"
          options={{
            title: "Setup Panic Button",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen
          name="edit-panic-button"
          options={{
            title: "Edit Panic Button",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
            },
            headerTintColor: "#000000",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 16 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      {/* Hidden Camera View for Silent Mode Photo Capture */}
      {cameraPermission?.granted && (
        <View
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0,
            overflow: "hidden",
          }}
        >
          <CameraView
            ref={cameraRef}
            style={{ width: 1, height: 1 }}
            facing="back"
          />
        </View>
      )}
      {toastMessage && (
        <View
          style={{
            position: "absolute",
            top: 60,
            left: 24,
            right: 24,
            backgroundColor: "rgba(0,0,0,0.85)",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 14,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {toastMessage}
          </Text>
        </View>
      )}
      <StatusBar barStyle="dark-content" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <StackNavigator />
      </NotificationProvider>
    </AuthProvider>
  );
}
