import {
  EmergencyContact,
  emergencyContactsStorage,
} from "@/utils/emergencyContactsStorage";
import { PanicButton, panicButtonsStorage } from "@/utils/panicButtonsStorage";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabType = "contacts" | "hotlines" | "panic";

export default function SetupSos() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("contacts");
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([]);
  const [panicButtons, setPanicButtons] = useState<PanicButton[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButtons, setIsLoadingButtons] = useState(true);

  const handleCall = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          console.log("Phone dialer is not available");
        }
      })
      .catch((err) => console.error("Error opening dialer:", err));
  };

  // Load contacts from storage
  const loadContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const contacts = await emergencyContactsStorage.getContacts();
      setEmergencyContacts(contacts);
    } catch (error) {
      console.error("Error loading contacts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load panic buttons from storage
  const loadPanicButtons = useCallback(async () => {
    setIsLoadingButtons(true);
    try {
      const buttons = await panicButtonsStorage.getButtons();
      setPanicButtons(buttons);
    } catch (error) {
      console.error("Error loading panic buttons:", error);
    } finally {
      setIsLoadingButtons(false);
    }
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadContacts();
      loadPanicButtons();
    }, [loadContacts, loadPanicButtons])
  );

  const [hotlines] = useState([
    { id: 1, name: "Police", number: "112", icon: "shield-outline" },
    { id: 2, name: "Fire Department", number: "112", icon: "flame-outline" },
    { id: 3, name: "Ambulance", number: "912", icon: "medical-outline" },
    {
      id: 4,
      name: "Gender Violence",
      number: "3512",
      icon: "alert-circle-outline",
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "contacts" && styles.activeTab]}
          activeOpacity={0.7}
          onPress={() => setActiveTab("contacts")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "contacts" && styles.activeTabText,
            ]}
          >
            Contacts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "hotlines" && styles.activeTab]}
          activeOpacity={0.7}
          onPress={() => setActiveTab("hotlines")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "hotlines" && styles.activeTabText,
            ]}
          >
            Hotlines
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "panic" && styles.activeTab]}
          activeOpacity={0.7}
          onPress={() => setActiveTab("panic")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "panic" && styles.activeTabText,
            ]}
          >
            Panic Buttons
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency Contacts Section */}
        {activeTab === "contacts" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Emergency Contacts</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/add-emergency-contact")}
              >
                <Ionicons name="add-circle" size={28} color="#e6491e" />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              Add trusted contacts to notify in emergencies
            </Text>

            <View style={styles.contactsList}>
              {isLoading ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Loading contacts...</Text>
                </View>
              ) : emergencyContacts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="person-add-outline"
                    size={48}
                    color="#cccccc"
                  />
                  <Text style={styles.emptyStateTitle}>
                    No Emergency Contacts
                  </Text>
                  <Text style={styles.emptyStateText}>
                    Add trusted contacts to notify in emergencies
                  </Text>
                </View>
              ) : (
                emergencyContacts.map((contact) => (
                  <View key={contact.id} style={styles.contactCard}>
                    <View style={styles.contactIcon}>
                      <Ionicons name="person" size={24} color="#e6491e" />
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactPhone}>{contact.phone}</Text>
                      <Text style={styles.contactRelation}>
                        {contact.relation}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.contactAction}
                      onPress={() =>
                        router.push(`/edit-emergency-contact?id=${contact.id}`)
                      }
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="create-outline"
                        size={20}
                        color="#666666"
                      />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {/* Emergency Hotlines Section */}
        {activeTab === "hotlines" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Hotlines</Text>
            <Text style={styles.sectionSubtitle}>
              Quick access to emergency services
            </Text>

            <View style={styles.hotlinesList}>
              {hotlines.map((hotline) => (
                <View key={hotline.id} style={styles.hotlineCard}>
                  <View style={styles.hotlineLeft}>
                    <View style={styles.hotlineIcon}>
                      <Ionicons
                        name={hotline.icon as any}
                        size={24}
                        color="#e6491e"
                      />
                    </View>
                    <View>
                      <Text style={styles.hotlineName}>{hotline.name}</Text>
                      <Text style={styles.hotlineNumber}>{hotline.number}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => handleCall(hotline.number)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="call" size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Panic Buttons Section */}
        {activeTab === "panic" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Panic Buttons</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/setup-panic-button")}
              >
                <Ionicons name="add-circle" size={28} color="#e6491e" />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              Configure custom panic triggers for different emergencies
            </Text>

            <View style={styles.panicButtonsList}>
              {isLoadingButtons ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    Loading panic buttons...
                  </Text>
                </View>
              ) : panicButtons.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={48}
                    color="#cccccc"
                  />
                  <Text style={styles.emptyStateTitle}>No Panic Buttons</Text>
                  <Text style={styles.emptyStateText}>
                    Configure custom panic triggers for different emergencies
                  </Text>
                </View>
              ) : (
                panicButtons.map((button) => (
                  <TouchableOpacity
                    key={button.id}
                    style={styles.panicCard}
                    activeOpacity={0.7}
                    onPress={() =>
                      router.push(`/edit-panic-button?id=${button.id}`)
                    }
                  >
                    <View
                      style={[
                        styles.panicIconContainer,
                        { backgroundColor: button.color },
                      ]}
                    >
                      <FontAwesome6
                        name={button.icon as any}
                        size={28}
                        color="#ffffff"
                      />
                    </View>
                    <View style={styles.panicInfo}>
                      <Text style={styles.panicType}>{button.type}</Text>
                      <View style={styles.panicDetails}>
                        <View style={styles.panicDetailItem}>
                          <Ionicons
                            name="hand-left-outline"
                            size={16}
                            color="#666666"
                          />
                          <Text style={styles.panicDetailText}>
                            {button.trigger}
                          </Text>
                        </View>
                        <View style={styles.panicDetailItem}>
                          <Ionicons
                            name={
                              button.mode === "Loud"
                                ? "volume-high"
                                : "volume-mute"
                            }
                            size={16}
                            color="#666666"
                          />
                          <Text style={styles.panicDetailText}>
                            {button.mode}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#666666"
                    />
                  </TouchableOpacity>
                ))
              )}
            </View>
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 4,
    margin: 12,
    marginBottom: 0,
    borderRadius: 17,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 17,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#e6491e",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  activeTabText: {
    color: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 16,
  },
  contactsList: {
    gap: 12,
  },
  contactCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 12,
    color: "#999999",
  },
  contactAction: {
    padding: 8,
  },
  hotlinesList: {
    gap: 12,
  },
  hotlineCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  hotlineLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  hotlineIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  hotlineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  hotlineNumber: {
    fontSize: 14,
    color: "#666666",
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#34C759",
    justifyContent: "center",
    alignItems: "center",
  },
  panicButtonsList: {
    gap: 12,
  },
  panicCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  panicIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  panicInfo: {
    flex: 1,
  },
  panicType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  panicDetails: {
    flexDirection: "row",
    gap: 16,
  },
  panicDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  panicDetailText: {
    fontSize: 13,
    color: "#666666",
  },
  infoCard: {
    backgroundColor: "#fff5f2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "#ffe5d9",
    marginVertical: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
});
