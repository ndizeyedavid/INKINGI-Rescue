import CustomAlert from "@/components/CustomAlert";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { panicButtonsStorage } from "@/utils/panicButtonsStorage";

export default function SetupPanicButton() {
  const router = useRouter();
  const [emergencyType, setEmergencyType] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>("loud");

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

  const emergencyTypes = [
    { id: "fire", label: "Fire", icon: "fire", color: "#FF6B35" },
    {
      id: "medical",
      label: "Medical",
      icon: "hand-holding-heart",
      color: "#ef4444",
    },
    {
      id: "robbery",
      label: "Robbery",
      icon: "people-robbery",
      color: "#e6491e",
    },
    { id: "accident", label: "Accident", icon: "car-burst", color: "#f59e0b" },
    { id: "assault", label: "Assault", icon: "user-injured", color: "#dc2626" },
    {
      id: "other",
      label: "Other",
      icon: "ellipsis",
      color: "#6b7280",
    },
  ];

  const triggers = [
    { id: "volume-3", label: "Volume Down × 3", icon: "volume-low" },
    { id: "volume-5", label: "Volume Down × 5", icon: "volume-medium" },
    { id: "shake", label: "Shake Device", icon: "phone-portrait" },
  ];

  const modes = [
    {
      id: "loud",
      label: "Loud",
      description: "Siren and alerts",
      icon: "volume-high",
      color: "#ef4444",
    },
    {
      id: "silent",
      label: "Silent",
      description: "No sound, discreet",
      icon: "volume-mute",
      color: "#6b7280",
    },
  ];

  const showAlert = (
    type: "error" | "success" | "warning" | "info",
    title: string,
    message: string,
    onButtonPress?: () => void
  ) => {
    setAlertConfig({ type, title, message, onButtonPress });
    setAlertVisible(true);
  };

  const handleSave = async () => {
    if (!selectedType && !emergencyType.trim()) {
      showAlert(
        "warning",
        "Missing Information",
        "Please select an emergency type"
      );
      return;
    }
    if (!selectedTrigger) {
      showAlert(
        "warning",
        "Missing Information",
        "Please select a trigger method"
      );
      return;
    }
    if (!selectedMode) {
      showAlert("warning", "Missing Information", "Please select alert mode");
      return;
    }

    try {
      // Get type details
      const typeData = emergencyTypes.find((t) => t.id === selectedType);
      const typeLabel = selectedType === "other" ? emergencyType.trim() : typeData?.label || "";
      const typeIcon = typeData?.icon || "alert-circle";
      const typeColor = typeData?.color || "#e6491e";

      // Get trigger label
      const triggerData = triggers.find((t) => t.id === selectedTrigger);
      const triggerLabel = triggerData?.label || "";

      // Get mode label
      const modeData = modes.find((m) => m.id === selectedMode);
      const modeLabel = modeData?.label || "";

      // Save panic button to storage
      await panicButtonsStorage.saveButton({
        type: typeLabel,
        trigger: triggerLabel,
        mode: modeLabel,
        icon: typeIcon,
        color: typeColor,
      });

      showAlert(
        "success",
        "Success",
        "Panic button configured successfully",
        () => {
          setAlertVisible(false);
          router.back();
        }
      );
    } catch (error) {
      showAlert(
        "error",
        "Error",
        "Failed to save panic button. Please try again."
      );
    }
  };

  const getSelectedTypeColor = () => {
    if (!selectedType) return "#e6491e";
    const type = emergencyTypes.find((t) => t.id === selectedType);
    return type?.color || "#e6491e";
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon Preview */}
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: getSelectedTypeColor() },
            ]}
          >
            <FontAwesome6
              name={
                selectedType
                  ? (emergencyTypes.find((t) => t.id === selectedType)
                      ?.icon as any)
                  : "circle-exclamation"
              }
              size={40}
              color="#ffffff"
            />
          </View>
        </View>

        {/* Emergency Type Selection */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Emergency Type *</Text>
          <View style={styles.typesGrid}>
            {emergencyTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType === type.id && styles.typeCardSelected,
                  selectedType === type.id && {
                    borderColor: type.color,
                    backgroundColor: `${type.color}15`,
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedType(type.id);
                  setEmergencyType("");
                }}
              >
                <View
                  style={[
                    styles.typeIconContainer,
                    { backgroundColor: type.color },
                  ]}
                >
                  <FontAwesome6
                    name={type.icon as any}
                    size={20}
                    color="#ffffff"
                  />
                </View>
                <Text
                  style={[
                    styles.typeLabel,
                    selectedType === type.id && { color: type.color },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Emergency Type */}
        {selectedType === "other" && (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Specify Emergency Type</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="create-outline" size={20} color="#999999" />
              <TextInput
                style={styles.input}
                placeholder="e.g., Natural Disaster, Kidnapping"
                placeholderTextColor="#999999"
                value={emergencyType}
                onChangeText={setEmergencyType}
              />
            </View>
          </View>
        )}

        {/* Trigger Selection */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Trigger Method *</Text>
          <Text style={styles.inputDescription}>
            Choose how to activate this panic button
          </Text>
          <View style={styles.triggersList}>
            {triggers.map((trigger) => (
              <TouchableOpacity
                key={trigger.id}
                style={[
                  styles.triggerCard,
                  selectedTrigger === trigger.id && styles.triggerCardSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedTrigger(trigger.id)}
              >
                <View style={styles.triggerLeft}>
                  <Ionicons
                    name={trigger.icon as any}
                    size={24}
                    color={
                      selectedTrigger === trigger.id ? "#e6491e" : "#666666"
                    }
                  />
                  <Text
                    style={[
                      styles.triggerLabel,
                      selectedTrigger === trigger.id &&
                        styles.triggerLabelSelected,
                    ]}
                  >
                    {trigger.label}
                  </Text>
                </View>
                {selectedTrigger === trigger.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#e6491e" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Alert Mode Selection */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Alert Mode *</Text>
          <Text style={styles.inputDescription}>
            Choose how the alert will be triggered
          </Text>
          <View style={styles.modesList}>
            {modes.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeCard,
                  selectedMode === mode.id && styles.modeCardSelected,
                  selectedMode === mode.id && {
                    borderColor: mode.color,
                    backgroundColor: `${mode.color}15`,
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedMode(mode.id)}
              >
                <View style={styles.modeHeader}>
                  <View
                    style={[
                      styles.modeIconContainer,
                      { backgroundColor: mode.color },
                    ]}
                  >
                    <Ionicons
                      name={mode.icon as any}
                      size={24}
                      color="#ffffff"
                    />
                  </View>
                  {selectedMode === mode.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={mode.color}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.modeLabel,
                    selectedMode === mode.id && { color: mode.color },
                  ]}
                >
                  {mode.label}
                </Text>
                <Text style={styles.modeDescription}>{mode.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#e6491e" />
          <Text style={styles.infoText}>
            Panic buttons work even when your phone is locked. Test your panic
            button regularly to ensure it works properly.
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
          <Text style={styles.saveButtonText}>Save Panic Button</Text>
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
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  inputDescription: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 12,
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
  typesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  typeCard: {
    width: "30%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },
  typeCardSelected: {
    borderWidth: 2,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
    textAlign: "center",
  },
  triggersList: {
    gap: 12,
  },
  triggerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },
  triggerCardSelected: {
    borderColor: "#e6491e",
    backgroundColor: "#fff5f2",
  },
  triggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  triggerLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666666",
  },
  triggerLabelSelected: {
    color: "#e6491e",
  },
  modesList: {
    flexDirection: "row",
    gap: 12,
  },
  modeCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },
  modeCardSelected: {
    borderWidth: 2,
  },
  modeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  modeDescription: {
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
