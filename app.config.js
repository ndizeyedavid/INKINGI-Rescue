module.exports = {
  expo: {
    name: "INKINGI-Rescu-alpha",
    slug: "inkingi-rescue",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "inkingirescualpha",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.davidndizeye.inkingirescue",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      splash: {
        image: "./assets/images/logo.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
      splash: {
        image: "./assets/images/logo.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      [
        "expo-notifications",
        {
          icon: "./assets/images/icon.png",
          color: "#E6491E",
          sounds: ["./assets/sounds/notification.wav"],
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission:
            "Allow INKINGI Rescue to access your camera to take photos during emergency reports.",
        },
      ],
      "expo-brightness",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
            image: "./assets/images/logo.png",
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      eas: {
        projectId: "04f30c6c-aff4-4586-87f2-1696bf73b65b",
      },
      router: {},
      geminiApiKey: process.env.GEMINI_API_KEY || "",
    },
    owner: "davidndizeye",
  },
};
