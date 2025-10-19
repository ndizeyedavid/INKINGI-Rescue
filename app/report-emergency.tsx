import CustomAlert from "@/components/CustomAlert";
import LocationPickerModal from "@/components/LocationPickerModal";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Audio, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
type EmergencyType =
  | "accident"
  | "fire"
  | "medical"
  | "flood"
  | "quake"
  | "robbery"
  | "assault"
  | "other";

interface EmergencyOption {
  type: EmergencyType;
  label: string;
  icon: string;
}

export default function ReportEmergency() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<EmergencyType | null>(null);
  const [otherEmergencyType, setOtherEmergencyType] = useState("");
  const [location, setLocation] = useState("Kimisagara, KK 301");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [audioRecordings, setAudioRecordings] = useState<
    { uri: string; duration: number }[]
  >([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewType, setPreviewType] = useState<"photo" | "video" | "audio">(
    "photo"
  );
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    visible: boolean;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    buttonText?: string;
    onButtonPress?: () => void;
  }>({
    visible: false,
    type: "info",
    title: "",
    message: "",
  });

  const emergencyTypes: EmergencyOption[] = [
    { type: "accident", label: "Accident", icon: "car-burst" },
    { type: "fire", label: "Fire", icon: "fire" },
    { type: "medical", label: "Medical", icon: "hand-holding-heart" },
    { type: "flood", label: "Flood", icon: "house-flood-water" },
    { type: "quake", label: "Quake", icon: "house-crack" },
    { type: "robbery", label: "Robbery", icon: "people-robbery" },
    { type: "assault", label: "Assault", icon: "user-injured" },
    { type: "other", label: "Other", icon: "ellipsis" },
  ];

  const handleChangeLocation = async () => {
    setShowLocationPicker(true);
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setAlert({
        visible: true,
        type: "error",
        title: "Permission Denied",
        message: "Camera permission is required to take photos.",
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const handleTakeVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setAlert({
        visible: true,
        type: "error",
        title: "Permission Denied",
        message: "Camera permission is required to record videos.",
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
      videoMaxDuration: 60,
    });

    if (!result.canceled) {
      setVideos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const handleStartRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        setAlert({
          visible: true,
          type: "error",
          title: "Permission Denied",
          message: "Microphone permission is required to record audio.",
        });
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
      setAlert({
        visible: true,
        type: "error",
        title: "Recording Error",
        message: "Failed to start recording. Please try again.",
      });
    }
  };

  const handleStopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);

      // Get status before stopping to ensure we have the duration
      const statusBeforeStop = await recording.getStatusAsync();
      const durationMillis = statusBeforeStop.durationMillis || 0;

      await recording.stopAndUnloadAsync();

      // Reset audio mode after recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const uri = recording.getURI();

      if (uri) {
        setAudioRecordings((prev) => [
          ...prev,
          { uri, duration: durationMillis / 1000 },
        ]);
      }

      setRecording(null);
    } catch (error) {
      console.error("Stop recording error:", error);
      setAlert({
        visible: true,
        type: "error",
        title: "Recording Error",
        message: "Failed to stop recording. Please try again.",
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAudio = (index: number) => {
    setAudioRecordings((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePreview = (type: "photo" | "video" | "audio", index: number) => {
    setPreviewType(type);
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  const handlePlayAudio = async (uri: string) => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      // Clean up after playback
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Audio playback error:", error);
      setAlert({
        visible: true,
        type: "error",
        title: "Playback Error",
        message: "Failed to play audio. Please try again.",
      });
    }
  };

  const handleSubmit = () => {
    if (!selectedType) {
      setAlert({
        visible: true,
        type: "warning",
        title: "Required Field",
        message: "Please select an emergency type to continue.",
      });
      return;
    }

    if (selectedType === "other" && !otherEmergencyType.trim()) {
      setAlert({
        visible: true,
        type: "warning",
        title: "Required Field",
        message: "Please specify the emergency type.",
      });
      return;
    }

    if (!description.trim()) {
      setAlert({
        visible: true,
        type: "warning",
        title: "Required Field",
        message: "Please provide a brief description of the emergency.",
      });
      return;
    }

    setAlert({
      visible: true,
      type: "success",
      title: "Help is on the way.",
      message:
        "Your emergency report has been submitted successfully. Stay safe!",
      buttonText: "Read Instructions",
      onButtonPress: () => {
        setAlert({ ...alert, visible: false });
        router.push("/view-sos");
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Emergency type</Text>
          <View style={styles.typeGrid}>
            {emergencyTypes.map((emergency) => (
              <TouchableOpacity
                key={emergency.type}
                style={[
                  styles.typeCard,
                  selectedType === emergency.type && styles.typeCardActive,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedType(emergency.type)}
              >
                <View
                  style={[
                    styles.typeIcon,
                    selectedType === emergency.type && styles.typeIconActive,
                  ]}
                >
                  <FontAwesome6
                    name={emergency.icon as any}
                    size={28}
                    color={
                      selectedType === emergency.type ? "#ffffff" : "#8f959b"
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.typeLabel,
                    selectedType === emergency.type && styles.typeLabelActive,
                  ]}
                >
                  {emergency.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Other Emergency Type Input */}
          {selectedType === "other" && (
            <View style={styles.otherTypeContainer}>
              <TextInput
                style={styles.otherTypeInput}
                placeholder="Please specify emergency type..."
                placeholderTextColor="#999999"
                value={otherEmergencyType}
                onChangeText={setOtherEmergencyType}
              />
            </View>
          )}
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationInfo}>
              <Ionicons name="location" size={20} color="#e6491e" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
            <TouchableOpacity
              style={styles.changeButton}
              activeOpacity={0.7}
              onPress={handleChangeLocation}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Attach Proof */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attach proof</Text>
          <View style={styles.attachmentGrid}>
            <TouchableOpacity
              style={styles.attachmentCard}
              activeOpacity={0.7}
              onPress={handleTakePhoto}
            >
              <View style={styles.attachmentIcon}>
                <Ionicons name="camera" size={32} color="#e6491e" />
              </View>
              <Text style={styles.attachmentLabel}>Click Pictures</Text>
              {photos.length > 0 && (
                <View style={styles.attachmentBadge}>
                  <Text style={styles.attachmentBadgeText}>
                    {photos.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.attachmentCard}
              activeOpacity={0.7}
              onPress={handleTakeVideo}
            >
              <View style={styles.attachmentIcon}>
                <Ionicons name="videocam" size={32} color="#e6491e" />
              </View>
              <Text style={styles.attachmentLabel}>Video Recording</Text>
              {videos.length > 0 && (
                <View style={styles.attachmentBadge}>
                  <Text style={styles.attachmentBadgeText}>
                    {videos.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.attachmentCard}
              activeOpacity={0.7}
              onPress={isRecording ? handleStopRecording : handleStartRecording}
            >
              <View
                style={[
                  styles.attachmentIcon,
                  isRecording && styles.recordingActive,
                ]}
              >
                <Ionicons
                  name={isRecording ? "stop" : "mic"}
                  size={32}
                  color={isRecording ? "#ffffff" : "#e6491e"}
                />
              </View>
              <Text style={styles.attachmentLabel}>
                {isRecording ? "Stop Recording" : "Voice Recording"}
              </Text>
              {audioRecordings.length > 0 && !isRecording && (
                <View style={styles.attachmentBadge}>
                  <Text style={styles.attachmentBadgeText}>
                    {audioRecordings.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Display Captured Photos */}
          {photos.length > 0 && (
            <View style={styles.capturedContent}>
              <Text style={styles.capturedTitle}>Captured Photos</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.capturedScroll}
              >
                {photos.map((uri, index) => (
                  <View key={index} style={styles.capturedItem}>
                    <TouchableOpacity
                      onPress={() => handlePreview("photo", index)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri }} style={styles.capturedImage} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemovePhoto(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Display Captured Videos */}
          {videos.length > 0 && (
            <View style={styles.capturedContent}>
              <Text style={styles.capturedTitle}>Recorded Videos</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.capturedScroll}
              >
                {videos.map((uri, index) => (
                  <View key={index} style={styles.capturedItem}>
                    <TouchableOpacity
                      onPress={() => handlePreview("video", index)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.videoPlaceholder}>
                        <Ionicons name="videocam" size={40} color="#666666" />
                        <Text style={styles.videoText}>Video {index + 1}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveVideo(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Display Audio Recordings */}
          {audioRecordings.length > 0 && (
            <View style={styles.capturedContent}>
              <Text style={styles.capturedTitle}>Audio Recordings</Text>
              {audioRecordings.map((audio, index) => (
                <View key={index} style={styles.audioItem}>
                  <TouchableOpacity
                    style={styles.audioInfo}
                    onPress={() => handlePlayAudio(audio.uri)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="play-circle" size={24} color="#e6491e" />
                    <Text style={styles.audioText}>
                      Recording {index + 1} ({audio.duration.toFixed(1)}s)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoveAudio(index)}>
                    <Ionicons name="trash" size={20} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specify emergency in brief</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe the emergency situation..."
            placeholderTextColor="#999999"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#0891b2" />
          <Text style={styles.infoText}>
            Your location and contact information will be shared with emergency
            services to ensure quick response.
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </View>

      {/* Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.previewModal}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>
              {previewType === "photo"
                ? `Photo ${previewIndex + 1} of ${photos.length}`
                : previewType === "video"
                  ? `Video ${previewIndex + 1} of ${videos.length}`
                  : `Audio ${previewIndex + 1} of ${audioRecordings.length}`}
            </Text>
            <TouchableOpacity
              onPress={() => setPreviewVisible(false)}
              style={styles.previewCloseButton}
            >
              <Ionicons name="close" size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.previewContent}>
            {previewType === "photo" && (
              <Image
                source={{ uri: photos[previewIndex] }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )}
            {previewType === "video" && (
              <Video
                source={{ uri: videos[previewIndex] }}
                style={styles.previewVideo}
                useNativeControls
                shouldPlay={true}
              />
            )}
            {previewType === "audio" && (
              <View style={styles.previewAudioContainer}>
                <TouchableOpacity
                  style={styles.previewPlayButton}
                  onPress={() =>
                    handlePlayAudio(audioRecordings[previewIndex].uri)
                  }
                >
                  <Ionicons name="play-circle" size={80} color="#e6491e" />
                </TouchableOpacity>
                <Text style={styles.previewAudioText}>
                  Recording {previewIndex + 1}
                </Text>
                <Text style={styles.previewAudioDuration}>
                  Duration: {audioRecordings[previewIndex]?.duration.toFixed(1)}
                  s
                </Text>
              </View>
            )}
          </View>

          {/* Navigation Arrows */}
          {((previewType === "photo" && photos.length > 1) ||
            (previewType === "video" && videos.length > 1) ||
            (previewType === "audio" && audioRecordings.length > 1)) && (
            <View style={styles.previewNavigation}>
              <TouchableOpacity
                style={[
                  styles.previewNavButton,
                  previewIndex === 0 && styles.previewNavButtonDisabled,
                ]}
                onPress={() => setPreviewIndex((prev) => Math.max(0, prev - 1))}
                disabled={previewIndex === 0}
              >
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color={previewIndex === 0 ? "#666666" : "#ffffff"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.previewNavButton,
                  previewIndex ===
                    (previewType === "photo"
                      ? photos.length - 1
                      : previewType === "video"
                        ? videos.length - 1
                        : audioRecordings.length - 1) &&
                    styles.previewNavButtonDisabled,
                ]}
                onPress={() =>
                  setPreviewIndex((prev) =>
                    Math.min(
                      previewType === "photo"
                        ? photos.length - 1
                        : previewType === "video"
                          ? videos.length - 1
                          : audioRecordings.length - 1,
                      prev + 1
                    )
                  )
                }
                disabled={
                  previewIndex ===
                  (previewType === "photo"
                    ? photos.length - 1
                    : previewType === "video"
                      ? videos.length - 1
                      : audioRecordings.length - 1)
                }
              >
                <Ionicons
                  name="chevron-forward"
                  size={32}
                  color={
                    previewIndex ===
                    (previewType === "photo"
                      ? photos.length - 1
                      : previewType === "video"
                        ? videos.length - 1
                        : audioRecordings.length - 1)
                      ? "#666666"
                      : "#ffffff"
                  }
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
      {showLocationPicker && (
        <LocationPickerModal
          visible={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onSelectLocation={(location) => {
            setLocation(location);
            setShowLocationPicker(false);
          }}
          currentLocation={location}
        />
      )}

      {/* Custom Alert */}
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        buttonText={alert.buttonText}
        onClose={() => setAlert({ ...alert, visible: false })}
        onButtonPress={alert.onButtonPress}
      />
    </KeyboardAvoidingView>
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
    paddingBottom: 100,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 16,
  },
  typeGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  typeCard: {
    width: "23.5%",
    aspectRatio: 1,
    // backgroundColor: "#ffffff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  typeCardActive: {
    borderColor: "#e6491e",
    backgroundColor: "#fff5f2",
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    // backgroundColor: "#fff5f2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  typeIconActive: {
    backgroundColor: "#e6491e",
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
    textAlign: "center",
  },
  typeLabelActive: {
    color: "#e6491e",
  },
  otherTypeContainer: {
    marginTop: 36,
  },
  otherTypeInput: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "#000000",
    borderWidth: 2,
    borderColor: "#e6491e",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  locationText: {
    fontSize: 15,
    color: "#000000",
    flex: 1,
  },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  changeButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e6491e",
  },
  attachmentGrid: {
    flexDirection: "row",
    gap: 12,
  },
  attachmentCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  attachmentIcon: {
    marginBottom: 12,
  },
  attachmentLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666666",
    textAlign: "center",
  },
  attachmentBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#e6491e",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  attachmentBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  recordingActive: {
    backgroundColor: "#dc2626",
  },
  capturedContent: {
    marginTop: 20,
  },
  capturedTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  capturedScroll: {
    marginHorizontal: -4,
  },
  capturedItem: {
    marginHorizontal: 4,
    position: "relative",
  },
  capturedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  videoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  videoText: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
  },
  audioItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  audioInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  audioText: {
    fontSize: 14,
    color: "#000000",
  },
  descriptionInput: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "#000000",
    minHeight: 120,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#ecfeff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#0e7490",
    lineHeight: 20,
  },
  submitContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  submitButton: {
    backgroundColor: "#e6491e",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#e6491e",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#ffffff",
  },
  previewModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  previewCloseButton: {
    padding: 8,
  },
  previewContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewVideo: {
    width: "100%",
    height: "100%",
  },
  previewVideoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  previewVideoText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginTop: 20,
  },
  previewVideoSubtext: {
    fontSize: 14,
    color: "#cccccc",
    marginTop: 8,
    textAlign: "center",
  },
  previewAudioContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  previewPlayButton: {
    marginBottom: 20,
  },
  previewAudioText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  previewAudioDuration: {
    fontSize: 16,
    color: "#cccccc",
  },
  previewNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  previewNavButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewNavButtonDisabled: {
    opacity: 0.3,
  },
});
