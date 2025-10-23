import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from 'expo-av';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function Microphone() {
  const { t } = useTranslation();
  const [permissionStatus, setPermissionStatus] = useState<string>('pending');

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Audio.getPermissionsAsync();
    setPermissionStatus(status);
  };
  return (
    <View className="flex-row items-center justify-center gap-2 px-4">
      {/* icon here */}
      <View className="" style={styles.iconContainer}>
        <Ionicons name="mic-outline" size={48} color={"#E6491E"} />
      </View>
      {/* text here */}
      <View className="flex-1 gap-2">
        <Text className="font-bold" style={styles.titleText} numberOfLines={2}>
          {t("settings.microphoneAccess")}
        </Text>
        <Text style={styles.subTitleText} numberOfLines={3}>
          {t("settings.microphoneDescription")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: "#FCE7E7",
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 65,
  },
  titleText: {
    fontSize: 30,
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
