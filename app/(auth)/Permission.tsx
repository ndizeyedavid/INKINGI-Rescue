import Button from "@/components/Button";
import Camera from "@/components/Permissions/Camera";
import Location from "@/components/Permissions/Location";
import Microphone from "@/components/Permissions/Microphone";
import PanicButton from "@/components/Permissions/PanicButton";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
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

  const permissionComponents = [
    { component: <Location />, key: "location" },
    { component: <Camera />, key: "camera" },
    { component: <Microphone />, key: "microphone" },
    { component: <PanicButton />, key: "panic" },
  ];

  const handleAllow = () => {
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
          >
            {currentIndex == 3 ? "Finish" : "Allow"}
          </Button>
          <TouchableOpacity className="items-center w-full">
            <Text>Skip for now</Text>
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
