import CommunityPostCard from "@/components/CommunityPostCard";
import PageHeader from "@/components/pageHeader";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CommunityPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title={t("community.title")} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CommunityPostCard
          author="Ministry Of Food and Nutrition"
          date="21-01-25"
          title="Free Meals Available for Those in Need"
          content={`If you or someone you know needs a warm meal, our community kitchen at "SHEMA Foundation" is serving free lunch from 12 PM - 3 PM today.

No registration needed—just come by! Let's support each other. ❤️`}
          imageUrl="https://cdn.britannica.com/36/123536-050-95CB0C6E/Variety-fruits-vegetables.jpg"
          onMenuPress={() => console.log("Menu pressed")}
        />

        <CommunityPostCard
          author="Rwanda Red Cross"
          date="20-01-25"
          title="Blood Donation Drive This Weekend"
          content="Join us for a blood donation drive at King Faisal Hospital this Saturday from 9 AM - 4 PM. Your donation can save lives! Walk-ins welcome."
          imageUrl="https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&q=80"
          onMenuPress={() => console.log("Menu pressed")}
        />

        <CommunityPostCard
          author="Kigali City Council"
          date="19-01-25"
          title="Emergency Preparedness Workshop"
          content="Learn essential emergency response skills at our free workshop next Tuesday at 2 PM. Topics include first aid, fire safety, and disaster preparedness. Register at city hall."
          onMenuPress={() => console.log("Menu pressed")}
        />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push("/new-post")}
      >
        <Ionicons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  fab: {
    position: "absolute",
    bottom: 110,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e6491e",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
