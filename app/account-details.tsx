import LocationPickerModal from "@/components/LocationPickerModal";
import { Ionicons } from "@expo/vector-icons";
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
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Mellow Junior");
  const [phone, setPhone] = useState("+250 788 123 456");
  const [email, setEmail] = useState("mellowjunior@example.com");
  const [password, setPassword] = useState("********");
  const [district, setDistrict] = useState("Kimironko, KN 324");
  const [bloodType, setBloodType] = useState("O+");
  const [showPassword, setShowPassword] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const { t } = useTranslation();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
  };

  const handleSave = () => {
    console.log("Saving account details...");
    setIsEditing(false);
    // Add save logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color="#ffffff" />
          </View>
          <TouchableOpacity
            style={styles.changePhotoButton}
            activeOpacity={0.7}
          >
            <Text style={styles.changePhotoText}>{t("auth.changePhoto")}</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("auth.fullName")}</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="#999999"
              />
            ) : (
              <View style={styles.readonlyField}>
                <Text style={styles.readonlyText}>{name}</Text>
              </View>
            )}
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("auth.phoneNumber")}</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor="#999999"
                keyboardType="phone-pad"
              />
            ) : (
              <View style={styles.readonlyField}>
                <Text style={styles.readonlyText}>{phone}</Text>
              </View>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("auth.email")}</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#999999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <View style={styles.readonlyField}>
                <Text style={styles.readonlyText}>{email}</Text>
              </View>
            )}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("auth.password")}</Text>
            {isEditing ? (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#999999"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#666666"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.readonlyField}>
                <Text style={styles.readonlyText}>••••••••</Text>
              </View>
            )}
          </View>

          {/* District */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("auth.location")}</Text>
            {isEditing ? (
              <TouchableOpacity
                style={styles.locationInput}
                activeOpacity={0.7}
                onPress={() => setShowLocationModal(true)}
              >
                <View style={styles.locationInputContent}>
                  <Ionicons name="location-outline" size={20} color="#666666" />
                  <Text style={styles.locationText}>{district}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>
            ) : (
              <View style={styles.readonlyField}>
                <Ionicons name="location-outline" size={20} color="#666666" />
                <Text style={styles.readonlyText}>{district}</Text>
              </View>
            )}
          </View>

          {/* Blood Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("auth.bloodType")}</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={bloodType}
                onChangeText={setBloodType}
                placeholder="Enter your blood type"
                placeholderTextColor="#999999"
              />
            ) : (
              <View style={styles.readonlyField}>
                <Text style={styles.readonlyText}>{bloodType}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        {isEditing ? (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.8}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.8}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.8}
            onPress={handleEdit}
          >
            <Ionicons name="create-outline" size={20} color="#ffffff" />
            <Text style={styles.editButtonText}>{t("auth.editProfile")}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Location Picker Modal */}
      <LocationPickerModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={(newLocation) => setDistrict(newLocation)}
        currentLocation={district}
      />
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
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e6491e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    fontSize: 14,
    color: "#e6491e",
    fontWeight: "600",
  },
  formSection: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000000",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000000",
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  locationInput: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  locationInputContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationText: {
    fontSize: 16,
    color: "#000000",
  },
  readonlyField: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  readonlyText: {
    fontSize: 16,
    color: "#000000",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666666",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#e6491e",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  editButton: {
    backgroundColor: "#e6491e",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 32,
    marginBottom: 20,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
