import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function Location() {
  const { t } = useTranslation();
  return (
    <View className="flex-row items-center justify-center gap-2 px-4">
      {/* icon here */}
      <View className="" style={styles.iconContainer}>
        <Ionicons name="location-outline" size={48} color={"#E6491E"} />
      </View>
      {/* text here */}
      <View className="gap-2 flex-1">
        <Text className="font-bold" style={styles.titleText} numberOfLines={2}>
          {t("settings.locationAccess")}
        </Text>
        <Text style={styles.subTitleText} numberOfLines={3}>
          {t("settings.locationDescription")}
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
