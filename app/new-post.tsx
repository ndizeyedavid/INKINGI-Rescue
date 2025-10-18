import LocationPickerModal from "@/components/LocationPickerModal";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Kimironko, KN 324");
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handlePost = () => {
    console.log("Post created:", { title, description, location });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Upload Photo/Video Section */}
        <TouchableOpacity style={styles.uploadContainer} activeOpacity={0.7}>
          <Ionicons name="image-outline" size={32} color="#666666" />
          <Text style={styles.uploadText}>Upload Photo/ Video</Text>
        </TouchableOpacity>

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
          style={styles.postButton}
          activeOpacity={0.8}
          onPress={handlePost}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Location Picker Modal */}
      <LocationPickerModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={(newLocation) => setLocation(newLocation)}
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
  },
  postButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
