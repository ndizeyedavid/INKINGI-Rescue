import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  animation?: any;
  gif?: any;
  type: "lottie" | "gif";
}

// Slides will be generated dynamically using translations

export default function Onboarding() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const slides: OnboardingSlide[] = [
    {
      id: "1",
      title: t("onboarding.slide1.title"),
      description: t("onboarding.slide1.description"),
      animation: require("@/assets/animations/firefighters.json"),
      type: "lottie",
    },
    {
      id: "2",
      title: t("onboarding.slide2.title"),
      description: t("onboarding.slide2.description"),
      animation: require("@/assets/animations/asd.json"),
      type: "lottie",
    },
    {
      id: "3",
      title: t("onboarding.slide3.title"),
      description: t("onboarding.slide3.description"),
      gif: require("@/assets/animations/community.gif"),
      type: "gif",
    },
    {
      id: "4",
      title: t("onboarding.slide4.title"),
      description: t("onboarding.slide4.description"),
      animation: require("@/assets/animations/splash.json"),
      type: "lottie",
    },
  ];

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      router.replace("/(auth)/sign-in");
    }
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <View style={styles.imageCircle}>
          {item.type === "lottie" ? (
            <LottieView
              source={item.animation}
              autoPlay
              loop
              style={styles.lottie}
            />
          ) : (
            <Image source={item.gif} style={styles.gif} resizeMode="contain" />
          )}
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>{t("common.skip")}</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {/* Next/Get Started Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1
              ? t("common.getStarted")
              : t("common.next")}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 5,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "600",
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  imageCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#fff5f2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#e6491e",
  },
  lottie: {
    width: 240,
    height: 240,
  },
  gif: {
    width: 215,
    height: 215,
  },
  textContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 32,
    backgroundColor: "#e6491e",
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#cccccc",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#e6491e",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#e6491e",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
