import EmergencyCard from "@/components/EmergencyCard";
import PageHeader from "@/components/pageHeader";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SosPage() {
  const [activeTab, setActiveTab] = useState<"you" | "others">("you");
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title={t("sos.title")} />

      {/* Pills Navigation */}
      <View style={styles.pillsContainer}>
        <TouchableOpacity
          style={[styles.pill, activeTab === "you" && styles.activePill]}
          onPress={() => setActiveTab("you")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.pillText,
              activeTab === "you" && styles.activePillText,
            ]}
          >
            {t("sos.you")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pill, activeTab === "others" && styles.activePill]}
          onPress={() => setActiveTab("others")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.pillText,
              activeTab === "others" && styles.activePillText,
            ]}
          >
            {t("sos.others")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "you" ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/view-sos",
                params: { emergencyType: "Road Accident" },
              })
            }
          >
            <EmergencyCard
              location="Kimisagara, KK 301"
              icon="car-crash"
              type="Road Accident"
              description="The incident involved the vehicle RAH 331, which was involved in a collision between a car and a motorcycle. The accident resulted in a serious head injury for the biker. Urgent emergency services are needed at this location."
              isMine={true}
              onDelete={() => console.log("Delete emergency")}
              status="reported"
            />
          </TouchableOpacity>
        ) : (
          <View>
            <EmergencyCard
              location="Kimisagara, KK 301"
              icon="hand-holding-heart"
              type="Medical Emergency"
              description="I am having a stork please send help asap."
              onDelete={() => console.log("Delete emergency")}
              reportedBy="mellow"
            />
            <EmergencyCard
              location="Kimisagara, KK 301"
              icon="fire"
              type="Fire Emergency"
              description="later butter owner easy expect barn market fireplace person important interior food public factory feet southern green complete may sight loose situation shelf supperI am having a stork please send help asap."
              onDelete={() => console.log("Delete emergency")}
              reportedBy="Jean Pierre"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  pillsContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    padding: 4,
  },
  pill: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666666",
  },
  activePillText: {
    color: "#e6491e",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999999",
  },
});
