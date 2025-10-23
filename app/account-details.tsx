import CustomAlert from "@/components/CustomAlert";
import LocationPickerModal from "@/components/LocationPickerModal";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/services/api/api.service";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountDetails() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertCallback, setAlertCallback] = useState<(() => void) | undefined>(
    undefined
  );

  const showAlert = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    message: string,
    callback?: () => void
  ) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertCallback(() => callback);
    setAlertVisible(true);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userApi.getProfile();

      if (response.success && response.data) {
        const profile = response.data;
        setFirstName(profile.firstName || "");
        setLastName(profile.lastName || "");
        setPhone(profile.phoneNumber || "");
        setEmail(profile.email || "");
        setNationalId(profile.nationalId || "");
        setLocation(profile.address || "");
        setLatitude(profile.latitude || 0);
        setLongitude(profile.longitude || 0);
        setProfileImage(profile.profileImageUrl || null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      showAlert("error", "Error", "Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile(); // Reset to original values
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        showAlert(
          "warning",
          "Permission Required",
          "Please grant camera roll permissions to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        await uploadProfileImage(imageUri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      showAlert("error", "Error", "Failed to pick image. Please try again.");
    }
  };

  const uploadProfileImage = async (imageUri: string) => {
    try {
      const filename = imageUri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);

      const response = await userApi.uploadProfileImage(formData);

      if (response.success) {
        showAlert("success", "Success", "Profile image updated successfully!");
        if (response.data?.profileImage) {
          setProfileImage(response.data.profileImage);
        }
      } else {
        showAlert(
          "error",
          "Error",
          response.error || "Failed to upload image."
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      showAlert(
        "error",
        "Error",
        "An error occurred while uploading the image."
      );
    }
  };

  const validateForm = (): boolean => {
    if (!firstName.trim() || !lastName.trim()) {
      showAlert(
        "warning",
        "Validation Error",
        "Please enter your first and last name."
      );
      return false;
    }

    if (!phone.trim()) {
      showAlert(
        "warning",
        "Validation Error",
        "Please enter your phone number."
      );
      return false;
    }

    if (!email.trim()) {
      showAlert("warning", "Validation Error", "Please enter your email.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      const updateData: any = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phone.trim(),
        email: email.trim(),
        nationalId: nationalId.trim() || undefined,
        address: location.trim() || undefined,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
      };

      // Only include password if it was changed
      if (password && password !== "********") {
        updateData.password = password;
      }

      const response = await userApi.updateProfile(updateData);

      if (response.success) {
        showAlert("success", "Success", "Profile updated successfully!", () => {
          setIsEditing(false);
        });

        // Update auth context
        if (response.data) {
          updateUser(response.data);
        }

        await fetchProfile();
      } else {
        showAlert(
          "error",
          "Error",
          response.error || "Failed to update profile."
        );
      }
    } catch (error) {
      console.error("Update error:", error);
      showAlert(
        "error",
        "Error",
        "An error occurred while updating your profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#e6491e" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={48} color="#ffffff" />
            </View>
          )}
          <TouchableOpacity
            style={styles.changePhotoButton}
            activeOpacity={0.7}
            onPress={pickImage}
          >
            <Text style={styles.changePhotoText}>{t("auth.changePhoto")}</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor="#999999"
                editable={!isSaving}
              />
            ) : (
              <View style={styles.readonlyField}>
                <Text style={styles.readonlyText}>{firstName}</Text>
              </View>
            )}
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor="#999999"
                editable={!isSaving}
              />
            ) : (
              <View style={styles.readonlyField}>
                <Text style={styles.readonlyText}>{lastName}</Text>
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
                editable={!isSaving}
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
                editable={!isSaving}
              />
            ) : (
              <View style={styles.readonlyField}>
                <Text style={styles.readonlyText}>{email}</Text>
              </View>
            )}
          </View>

          {/* National ID */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>National ID</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={nationalId}
                onChangeText={setNationalId}
                placeholder="Enter your national ID"
                placeholderTextColor="#999999"
                keyboardType="phone-pad"
                editable={!isSaving}
              />
            ) : (
              <View style={styles.readonlyField}>
                <Text style={styles.readonlyText}>{nationalId}</Text>
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
                  placeholder="Enter new password (leave blank to keep current)"
                  placeholderTextColor="#999999"
                  secureTextEntry={!showPassword}
                  editable={!isSaving}
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

          {/* Location */}
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
                  <Text style={styles.locationText}>{location}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>
            ) : (
              <View style={styles.readonlyField}>
                <Ionicons name="location-outline" size={20} color="#666666" />
                <Text style={styles.readonlyText}>{location}</Text>
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
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              activeOpacity={0.8}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={[styles.saveButtonText, { marginLeft: 8 }]}>
                    Saving...
                  </Text>
                </>
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
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
        onSelectLocation={(locationData) => {
          setLocation(locationData.address);
          setLatitude(locationData.latitude);
          setLongitude(locationData.longitude);
          setShowLocationModal(false);
        }}
        currentLocation={location}
      />

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={() => {
          setAlertVisible(false);
          if (alertCallback) {
            alertCallback();
          }
        }}
        onButtonPress={() => {
          setAlertVisible(false);
          if (alertCallback) {
            alertCallback();
          }
        }}
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
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  saveButtonDisabled: {
    backgroundColor: "#fca5a5",
    opacity: 0.7,
  },
});
