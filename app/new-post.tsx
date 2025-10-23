import LocationPickerModal from "@/components/LocationPickerModal";
import { postsApi } from "@/services/api/api.service";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latitude, setLatitude] = useState(-1.9403);
  const [longitude, setLongitude] = useState(30.0619);
  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera roll permissions to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert("Validation Error", "Please enter a title for your post.");
      return false;
    }

    if (title.trim().length < 5) {
      Alert.alert(
        "Validation Error",
        "Title must be at least 5 characters long."
      );
      return false;
    }

    if (!description.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter a description for your post."
      );
      return false;
    }

    if (description.trim().length < 10) {
      Alert.alert(
        "Validation Error",
        "Description must be at least 10 characters long."
      );
      return false;
    }

    return true;
  };

  const handlePost = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", description.trim());

      // Add image if selected
      if (selectedImage) {
        const filename = selectedImage.split("/").pop() || "image.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("image", {
          uri: selectedImage,
          name: filename,
          type: type,
        } as any);
      }

      // Add location if provided
      if (location.trim()) {
        formData.append("location", location.trim());
        formData.append("latitude", latitude.toString());
        formData.append("longitude", longitude.toString());
      }

      const response = await postsApi.create(formData);

      if (response.success) {
        Alert.alert("Success", "Your post has been published!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          response.error || "Failed to create post. Please try again."
        );
      }
    } catch (error) {
      console.error("Create post error:", error);
      Alert.alert(
        "Error",
        "An error occurred while creating your post. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Upload Photo/Video Section */}
        {selectedImage ? (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.imagePreview}
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={removeImage}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle" size={32} color="#ffffff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.uploadContainer}
            activeOpacity={0.7}
            onPress={pickImage}
          >
            <Ionicons name="image-outline" size={32} color="#666666" />
            <Text style={styles.uploadText}>Upload Photo/ Video</Text>
          </TouchableOpacity>
        )}

        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Post title"
            placeholderTextColor="#999999"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            editable={!isSubmitting}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Post information"
            placeholderTextColor="#999999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            maxLength={1000}
            editable={!isSubmitting}
          />
        </View>

        {/* Location Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Location <Text style={styles.optional}>(optional)</Text>
          </Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationInput}>
              <Ionicons name="location-outline" size={20} color="#666666" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowLocationModal(true)}
            >
              <Text style={styles.changeButton}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Post Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.postButton, isSubmitting && styles.postButtonDisabled]}
          activeOpacity={0.8}
          onPress={handlePost}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={[styles.postButtonText, { marginLeft: 8 }]}>
                Posting...
              </Text>
            </>
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

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
  uploadContainer: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#cccccc",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    backgroundColor: "#ffffff",
  },
  uploadText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 8,
    fontWeight: "500",
  },
  imagePreviewContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "#ffffff",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  required: {
    color: "#e6491e",
  },
  optional: {
    fontSize: 14,
    fontWeight: "400",
    color: "#999999",
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: "#000000",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textArea: {
    minHeight: 150,
    paddingTop: 16,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: "#000000",
  },
  changeButton: {
    fontSize: 14,
    color: "#e6491e",
    fontWeight: "600",
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: "#f4f4f4",
  },
  postButton: {
    backgroundColor: "#e6491e",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  postButtonDisabled: {
    backgroundColor: "#fca5a5",
    opacity: 0.7,
  },
  postButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
