import Button from "@/components/Button";
import Camera from "@/components/Permissions/Camera";
import Location from "@/components/Permissions/Location";
import Microphone from "@/components/Permissions/Microphone";
import PanicButton from "@/components/Permissions/PanicButton";
import { usePermissions } from "@/hooks/usePermissions";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

export default function PermissionScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { 
    requestLocationPermission, 
    requestCameraPermission, 
    requestMicrophonePermission,
    checkLocationPermission,
    checkCameraPermission,
    checkMicrophonePermission,
    isRequesting 
  } = usePermissions();

  // Check if all permissions are already granted on mount
  useEffect(() => {
    checkAllPermissions();
  }, []);

  const checkAllPermissions = async () => {
    const location = await checkLocationPermission();
    const camera = await checkCameraPermission();
    const microphone = await checkMicrophonePermission();

    // If all permissions are granted, skip to main app
    if (location && camera && microphone) {
      router.replace("/(tabs)");
    }
  };

  const permissionComponents = [
    { component: <Location />, key: "location", request: requestLocationPermission },
    { component: <Camera />, key: "camera", request: requestCameraPermission },
    { component: <Microphone />, key: "microphone", request: requestMicrophonePermission },
    { component: <PanicButton />, key: "panic", request: null },
  ];

  const handleAllow = async () => {
    const currentPermission = permissionComponents[currentIndex];
    
    // Request permission if there's a request function
    if (currentPermission.request) {
      const granted = await currentPermission.request();
      if (!granted) {
        // Permission denied, but still allow user to continue
        console.log(`${currentPermission.key} permission denied`);
      }
    }

    // After requesting permission, check if all are now granted
    const location = await checkLocationPermission();
    const camera = await checkCameraPermission();
    const microphone = await checkMicrophonePermission();

    // If all permissions are granted, skip to main app
    if (location && camera && microphone) {
      router.replace("/(tabs)");
      return;
    }

    if (currentIndex < permissionComponents.length - 1) {
      // Fade out current component
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -300, // Slide to the left
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Move to next component
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        // Reset animations for next component
        slideAnim.setValue(300); // Start from the right for next component
        fadeAnim.setValue(0); // Start invisible

        // Fade in and slide in next component
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0, // Slide to center
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const handleNavigate = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="h-screen bg-[#f4f4f4]">
      {/* Centered part */}
      <View style={styles.centerContainer}>
        <Animated.View
          style={{
            ...styles.animatedContainer,
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }}
        >
          {permissionComponents[currentIndex].component}
        </Animated.View>
      </View>

      {/* bottom part */}
      <View style={styles.bottomContainer}>
        <View className="w-full px-6" style={{ gap: 20 }}>
          <Button
            className="w-full"
            onPress={currentIndex != 3 ? handleAllow : handleNavigate}
            disabled={isRequesting}
          >
            {isRequesting ? "Requesting..." : currentIndex == 3 ? "Finish" : "Allow"}
          </Button>
          <TouchableOpacity 
            className="items-center w-full"
            onPress={currentIndex != 3 ? handleAllow : handleNavigate}
            disabled={isRequesting}
          >
            <Text style={{ opacity: isRequesting ? 0.5 : 1 }}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    // flex: 1 / 3,
    alignItems: "center",
    justifyContent: "flex-end",
    height: 140,
    marginBottom: 10,
  },
  animatedContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    backgroundColor: "#FCE7E7",
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 65,
  },
  titleText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#E6491E",
  },
  subTitleText: {
    fontSize: 16,
    color: "#150502",
    opacity: 0.8,
    fontWeight: "400",
  },
});
