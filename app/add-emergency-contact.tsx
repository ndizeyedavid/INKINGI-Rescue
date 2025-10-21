import CustomAlert from "@/components/CustomAlert";
import { emergencyContactsStorage } from "@/utils/emergencyContactsStorage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddEmergencyContact() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);
  const { t } = useTranslation();

  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    type: "error" | "success" | "warning" | "info";
    title: string;
    message: string;
    onButtonPress?: () => void;
  }>({
    type: "error",
    title: "",
    message: "",
    onButtonPress: undefined,
  });

  const relations = [
    { id: "mother", label: "Mother", icon: "woman" },
    { id: "father", label: "Father", icon: "man" },
    { id: "sibling", label: "Sibling", icon: "people" },
    { id: "spouse", label: "Spouse", icon: "heart" },
    { id: "friend", label: "Friend", icon: "person" },
    { id: "other", label: "Other", icon: "person-add" },
  ];

  const showAlert = (
    type: "error" | "success" | "warning",
    title: string,
    message: string,
    onButtonPress?: () => void
  ) => {
    setAlertConfig({ type, title, message, onButtonPress });
    setAlertVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert("warning", "Missing Information", "Please enter a name");
      return;
    }
    if (!phone.trim()) {
      showAlert(
        "warning",
        "Missing Information",
        "Please enter a phone number"
      );
      return;
    }
    if (!selectedRelation && !relation.trim()) {
      showAlert(
        "warning",
        "Missing Information",
        "Please select or enter a relation"
      );
      return;
    }

    try {
      // Get the relation label
      const relationLabel = selectedRelation
        ? relations.find((r) => r.id === selectedRelation)?.label || relation
        : relation;

      // Save contact to storage
      await emergencyContactsStorage.saveContact({
        name: name.trim(),
        phone: phone.trim(),
        relation: relationLabel,
      });

      showAlert(
        "success",
        "Success",
        "Emergency contact added successfully",
        () => {
          setAlertVisible(false);
          router.back();
        }
      );
    } catch (error) {
      showAlert("error", "Error", "Failed to save contact. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-add" size={40} color="#e6491e" />
          </View>
        </View>

        {/* Name Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>{t("auth.fullName")} *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#999999" />
            <TextInput
              style={styles.input}
              placeholder={t("auth.fullName")}
              placeholderTextColor="#999999"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        {/* Phone Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>{t("auth.phoneNumber")}</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#999999" />
            <TextInput
              style={styles.input}
              placeholder="+250 788 123 456"
              placeholderTextColor="#999999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Relation Selection */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>
            {t("addEmergencyContact.relationship")}
          </Text>
          <View style={styles.relationsGrid}>
            {relations.map((rel) => (
              <TouchableOpacity
                key={rel.id}
                style={[
                  styles.relationCard,
                  selectedRelation === rel.id && styles.relationCardSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedRelation(rel.id);
                  setRelation("");
                }}
              >
                <Ionicons
                  name={rel.icon as any}
                  size={24}
                  color={selectedRelation === rel.id ? "#e6491e" : "#666666"}
                />
                <Text
                  style={[
                    styles.relationLabel,
                    selectedRelation === rel.id && styles.relationLabelSelected,
                  ]}
                >
                  {rel.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Relation Input */}
        {selectedRelation === "other" && (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Specify Relationship</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="create-outline" size={20} color="#999999" />
              <TextInput
                style={styles.input}
                placeholder="e.g., Cousin, Neighbor"
                placeholderTextColor="#999999"
                value={relation}
                onChangeText={setRelation}
              />
            </View>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#e6491e" />
          <Text style={styles.infoText}>
            {t("addEmergencyContact.infoText")}
          </Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
          <Text style={styles.saveButtonText}>Save Contact</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
        onButtonPress={alertConfig.onButtonPress}
      />
    </View>
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
    padding: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff5f2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#e6491e",
  },
  inputSection: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  relationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  relationCard: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    paddingBottom: 13,
  },
  relationCardSelected: {
    borderColor: "#e6491e",
    backgroundColor: "#fff5f2",
  },
  relationLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666666",
  },
  relationLabelSelected: {
    color: "#e6491e",
  },
  infoCard: {
    backgroundColor: "#fff5f2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "#ffe5d9",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#666666",
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  saveButton: {
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
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
