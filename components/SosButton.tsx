import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function SosButton() {
  const outerScale = useSharedValue(1);
  const middleScale = useSharedValue(1);
  const innerScale = useSharedValue(1);

  useEffect(() => {
    // Outer ring animation - slowest, smoothest
    outerScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Middle ring animation - medium speed
    middleScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Inner ring animation - fastest
    innerScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const outerRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: outerScale.value }],
  }));

  const middleRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: middleScale.value }],
  }));

  const innerRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: innerScale.value }],
  }));
  return (
    <View style={styles.sosButtonContainer}>
      <Animated.View style={[styles.sosOuterRing, outerRingStyle]} />
      <Animated.View style={[styles.sosMiddleRing, middleRingStyle]} />
      <Animated.View style={[styles.sosInnerRing, innerRingStyle]} />
      <TouchableOpacity activeOpacity={0.8} style={styles.sosButton}>
        <Text style={styles.sosButtonText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    padding: 20,
    paddingHorizontal: 30,
    marginTop: 100,
  },
  text: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
  },
  boldText: {
    color: "#E6491E",
    fontWeight: "bold",
  },
  sosButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  sosOuterRing: {
    width: 317,
    height: 317,
    borderRadius: "100%",
    backgroundColor: "rgba(230, 73, 29, 0.1)",
    position: "absolute",
    zIndex: 1,
  },
  sosMiddleRing: {
    width: 293,
    height: 293,
    borderRadius: "100%",
    backgroundColor: "rgba(230, 73, 29, 0.2)",
    position: "absolute",
    zIndex: 2,
  },
  sosInnerRing: {
    width: 267,
    height: 267,
    borderRadius: "100%",
    backgroundColor: "rgba(230, 73, 29, 0.3)",
    position: "absolute",
    zIndex: 3,
  },
  sosButton: {
    width: 241,
    height: 241,
    borderRadius: "100%",
    backgroundColor: "#E6491E",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },
  sosButtonText: {
    color: "white",
    fontSize: 54,
    fontWeight: "bold",
    textAlign: "center",
  },
});
