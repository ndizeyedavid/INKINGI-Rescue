import { emergencyApi } from "@/services/api/api.service";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Audio, Video, ResizeMode } from "expo-av";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import VolunteerForm from "@/components/VolunteerForm";
import { geminiService } from "@/services/gemini.service";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import CustomAlert from "../components/CustomAlert";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Volunteer {
  id: string;
  emergencyId: string;
  userId: string;
  message: string;
  skills: string;
  isAccepted: boolean;
  acceptedAt: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  createdAt: string;
}

interface Media {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video" | "audio";
  createdAt: string;
}

interface EmergencyData {
  id: string;
  type: string;
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  status: "reported" | "dispatched" | "resolved";
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  media?: Media[];
  mediaFiles?: {
    id: string;
    url: string;
    type: "image" | "video" | "audio";
  }[];
  volunteers?: Volunteer[];
}

export default function ViewSos() {
  const params = useLocalSearchParams();
  const emergencyId = params.emergencyId as string;
  const { user } = useAuth();

  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState(true);
  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [duration, setDuration] = useState<number>(0);
  const [showVolunteersModal, setShowVolunteersModal] = useState(false);
  const [isVolunteered, setIsVolunteered] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  );
  const [showVolunteerDetailsModal, setShowVolunteerDetailsModal] =
    useState(false);
  const [showVolunteerFormModal, setShowVolunteerFormModal] = useState(false);
  const [isSubmittingVolunteer, setIsSubmittingVolunteer] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    type: "error" | "success" | "warning" | "info";
    title: string;
    message: string;
    onButtonPress?: () => void;
  }>({
    type: "success",
    title: "",
    message: "",
    onButtonPress: undefined,
  });
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioSound, setAudioSound] = useState<Audio.Sound | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const videoRef = useRef<Video>(null);
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [loadingTips, setLoadingTips] = useState(false);

  // Get volunteers from emergency data
  const volunteers = emergencyData?.volunteers || [];

  useEffect(() => {
    fetchEmergencyDetails();
    getUserLocation();

    // Cleanup audio on unmount
    return () => {
      if (audioSound) {
        audioSound.unloadAsync();
      }
    };
  }, [emergencyId]);

  const fetchEmergencyDetails = async () => {
    try {
      setLoading(true);
      const response = await emergencyApi.getById(emergencyId);

      if (response.success && response.data) {
        setEmergencyData(response.data);
        
        // Check if current user has already volunteered
        if (user && response.data.volunteers) {
          const hasVolunteered = response.data.volunteers.some(
            (volunteer: any) => volunteer.userId === user.id
          );
          setIsVolunteered(hasVolunteered);
        }

        // Generate AI tips for this emergency
        generateAITips(response.data);
      } else {
        showAlert(
          "error",
          "Error",
          "Failed to load emergency details. Please try again."
        );
      }
    } catch (error) {
      console.error("Error fetching emergency:", error);
      showAlert(
        "error",
        "Error",
        "An error occurred while loading emergency details."
      );
    } finally {
      setLoading(false);
    }
  };

  const generateAITips = async (emergency: EmergencyData) => {
    try {
      setLoadingTips(true);
      const tips = await geminiService.generateEmergencyTips({
        type: emergency.type,
        title: emergency.title,
        description: emergency.description,
        address: emergency.address,
      });
      setAiTips(tips);
    } catch (error) {
      console.error("Error generating AI tips:", error);
      // Set fallback tips if AI fails
      setAiTips([
        "Stay calm and assess the situation carefully.",
        "Call emergency services (112) immediately if needed.",
        "Ensure your own safety before helping others.",
        "Follow instructions from emergency responders.",
        "Keep emergency contacts readily available."
      ]);
    } finally {
      setLoadingTips(false);
    }
  };

  const showAlert = (
    type: "error" | "success" | "warning" | "info",
    title: string,
    message: string,
    onButtonPress?: () => void
  ) => {
    setAlertConfig({ type, title, message, onButtonPress });
    setAlertVisible(true);
  };

  const handleVolunteer = () => {
    if (isVolunteered) {
      showAlert(
        "info",
        "Already Volunteered",
        "You have already volunteered for this emergency."
      );
    } else {
      setIsVolunteered(true);
      showAlert(
        "success",
        "Thank You!",
        "You have successfully volunteered to help with this emergency. Stay safe and follow emergency protocols."
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "#f59e0b";
      case "dispatched":
        return "#3b82f6";
      case "resolved":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reported":
        return "alert-circle";
      case "dispatched":
        return "car";
      case "resolved":
        return "checkmark-circle";
      default:
        return "alert-circle";
    }
  };

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to show distance."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation(location);

      // Get route from GraphHopper
      if (emergencyData) {
        await getRoute(
          location.coords.latitude,
          location.coords.longitude,
          emergencyData.latitude,
          emergencyData.longitude
        );
      }
    } catch (error) {
      console.error("Location error:", error);
    }
  };

  const getRoute = async (
    startLat: number,
    startLon: number,
    endLat: number,
    endLon: number
  ) => {
    try {
      // GraphHopper API endpoint
      const apiKey = "629e52a9-2355-4711-99ca-119d3e430a89"; // Replace with your API key
      const url = `https://graphhopper.com/api/1/route?point=${startLat},${startLon}&point=${endLat},${endLon}&vehicle=foot&locale=en&key=${apiKey}&points_encoded=false&instructions=true`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.paths && data.paths.length > 0) {
        const path = data.paths[0];

        // Extract coordinates from the route
        const coordinates = path.points.coordinates.map(
          (coord: [number, number]) => ({
            latitude: coord[1],
            longitude: coord[0],
          })
        );

        setRouteCoordinates(coordinates);

        // Set distance in kilometers
        setDistance(path.distance / 1000);

        // Set duration in minutes
        setDuration(path.time / 60000);

        // Fit map to show the entire route
        if (mapRef.current && coordinates.length > 0) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error("Route error:", error);
      // Fallback to straight line if routing fails
      setRouteCoordinates([
        { latitude: startLat, longitude: startLon },
        { latitude: endLat, longitude: endLon },
      ]);

      // Calculate straight-line distance as fallback
      const dist = calculateDistance(startLat, startLon, endLat, endLon);
      setDistance(dist);
    }
  };

  // Calculate distance using Haversine formula (fallback)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getEmergencyIcon = (type: string): string => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("medical")) return "hand-holding-heart";
    if (lowerType.includes("fire")) return "fire";
    if (lowerType.includes("accident")) return "car-burst";
    if (lowerType.includes("flood")) return "house-flood-water";
    if (lowerType.includes("quake")) return "house-crack";
    if (lowerType.includes("robbery")) return "people-robbery";
    if (lowerType.includes("assault")) return "user-injured";
    return "ellipsis";
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const getMediaByType = (type: "image" | "video" | "audio") => {
    // Check both media and mediaFiles for backward compatibility
    const mediaFromNew = emergencyData?.media?.filter((file) => file.mediaType === type) || [];
    const mediaFromOld = emergencyData?.mediaFiles?.filter((file) => file.type === type) || [];
    
    // Convert new format to old format for consistency
    const convertedMedia = mediaFromNew.map(m => ({
      id: m.id,
      url: m.mediaUrl,
      type: m.mediaType
    }));
    
    return [...convertedMedia, ...mediaFromOld];
  };

  const handleVolunteerSubmit = async (data: {
    message: string;
    skills: string;
  }) => {
    try {
      setIsSubmittingVolunteer(true);
      const response = await emergencyApi.volunteer(emergencyId, data);

      if (response.success) {
        setShowVolunteerFormModal(false);
        setIsVolunteered(true);
        
        // Refresh emergency data to get updated volunteers list
        await fetchEmergencyDetails();
        
        showAlert(
          "success",
          "Success!",
          "Thank you for volunteering! The emergency reporter will be notified."
        );
      } else {
        showAlert(
          "error",
          "Error",
          response.error || "Failed to submit volunteer request. Please try again."
        );
      }
    } catch (error) {
      console.error("Volunteer error:", error);
      showAlert(
        "error",
        "Error",
        "An error occurred while submitting your volunteer request."
      );
    } finally {
      setIsSubmittingVolunteer(false);
    }
  };

  const handlePlayAudio = async (audioUrl: string, audioId: string) => {
    try {
      // Stop currently playing audio if any
      if (audioSound) {
        await audioSound.stopAsync();
        await audioSound.unloadAsync();
        setAudioSound(null);
        
        // If clicking the same audio, just stop it
        if (playingAudio === audioId) {
          setPlayingAudio(null);
          return;
        }
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      // Load and play new audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      setAudioSound(sound);
      setPlayingAudio(audioId);

      // Set up playback status update
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingAudio(null);
          sound.unloadAsync();
          setAudioSound(null);
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      showAlert(
        "error",
        "Playback Error",
        "Failed to play audio recording. Please try again."
      );
    }
  };

  const handleDeleteVolunteer = async () => {
    if (!user || !emergencyData) return;

    // Find current user's volunteer record
    const myVolunteer = emergencyData.volunteers?.find(
      (v) => v.userId === user.id
    );

    if (!myVolunteer) return;

    Alert.alert(
      "Remove Volunteer Request",
      "Are you sure you want to remove your volunteer request for this emergency?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await emergencyApi.deleteVolunteer(
                emergencyId,
                myVolunteer.id
              );

              if (response.success) {
                setIsVolunteered(false);
                
                // Refresh emergency data
                await fetchEmergencyDetails();
                
                showAlert(
                  "success",
                  "Removed",
                  "Your volunteer request has been removed."
                );
              } else {
                showAlert(
                  "error",
                  "Error",
                  response.error || "Failed to remove volunteer request."
                );
              }
            } catch (error) {
              console.error("Delete volunteer error:", error);
              showAlert(
                "error",
                "Error",
                "An error occurred while removing your volunteer request."
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#e6491e" />
        <Text style={styles.loadingText}>Loading emergency details...</Text>
      </View>
    );
  }

  if (!emergencyData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle-outline" size={64} color="#999999" />
        <Text style={styles.errorText}>Emergency not found</Text>
      </View>
    );
  }

  const images = getMediaByType("image");
  const videos = getMediaByType("video");
  const audios = getMediaByType("audio");

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency Icon */}
        <View style={styles.iconContainer}>
          <FontAwesome6
            name={getEmergencyIcon(emergencyData.type)}
            size={28}
            color="#ffffff"
          />
        </View>

        {/* Emergency Type Title */}
        <Text style={styles.emergencyTitle}>{emergencyData.title}</Text>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666666" />
          <Text style={styles.locationText}>{emergencyData.address}</Text>
        </View>

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(emergencyData.status) },
          ]}
        >
          <Ionicons
            name={getStatusIcon(emergencyData.status) as any}
            size={16}
            color="#ffffff"
          />
          <Text style={styles.statusText}>
            {emergencyData.status.charAt(0).toUpperCase() +
              emergencyData.status.slice(1)}
          </Text>
        </View>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: emergencyData.latitude,
                longitude: emergencyData.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              showsUserLocation={true}
            >
              {/* Emergency Location Marker */}
              <Marker
                coordinate={{
                  latitude: emergencyData.latitude,
                  longitude: emergencyData.longitude,
                }}
              >
                <View style={styles.alertMarkerContainer}>
                  <Ionicons name="location" size={40} color="#e6491e" />
                </View>
              </Marker>

              {/* User Location Marker */}
              {userLocation && (
                <Marker
                  coordinate={{
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                  }}
                >
                  <View style={styles.userMarkerContainer}>
                    <View style={styles.userDot} />
                  </View>
                </Marker>
              )}

              {/* Route line */}
              {routeCoordinates.length > 0 && (
                <Polyline
                  coordinates={routeCoordinates}
                  strokeColor="#4285F4"
                  strokeWidth={4}
                  lineCap="round"
                  lineJoin="round"
                />
              )}
            </MapView>
          </View>

          {/* Distance Info */}
          <View style={styles.distanceInfo}>
            <Ionicons name="navigate" size={16} color="#666666" />
            <Text style={styles.distanceText}>
              {distance > 0
                ? `${distance.toFixed(1)} km away${duration > 0 ? ` • ~${Math.round(duration)} min Foot` : ""}`
                : "Calculating route..."}
            </Text>
          </View>
        </View>

        {/* Meta Information */}
        <View style={styles.metaContainer}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#999999" />
              <Text style={styles.metaText}>
                {formatTimeAgo(emergencyData.createdAt)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.metaItem}
              onPress={() => setShowVolunteersModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="people-outline" size={16} color="#999999" />
              <Text style={styles.metaText}>
                {volunteers.length}{" "}
                {volunteers.length === 1 ? "volunteer" : "volunteers"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reportedByContainer}>
            <View style={styles.reporterAvatar}>
              <Text style={styles.reporterInitial}>
                {emergencyData.user?.firstName?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <View style={styles.reporterInfo}>
              <Text style={styles.reporterLabel}>Reported by</Text>
              <Text style={styles.reporterName}>
                {emergencyData.user?.firstName || "Unknown User"}
              </Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        {emergencyData.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {emergencyData.description}
            </Text>
          </View>
        )}

        {/* Images Section */}
        {images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Images ({images.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.imagesGrid}>
                {images.map((file) => (
                  <TouchableOpacity
                    key={file.id}
                    style={styles.imageWrapper}
                    activeOpacity={0.8}
                    onPress={() => setSelectedImage(file.url)}
                  >
                    <Image source={{ uri: file.url }} style={styles.image} />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Videos ({videos.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.imagesGrid}>
                {videos.map((file) => (
                  <TouchableOpacity
                    key={file.id}
                    style={styles.imageWrapper}
                    activeOpacity={0.8}
                    onPress={() => setSelectedVideo(file.url)}
                  >
                    <Image source={{ uri: file.url }} style={styles.image} />
                    <View style={styles.videoOverlay}>
                      <Ionicons name="play-circle" size={48} color="#ffffff" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Audio Section */}
        {audios.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Audio Recordings ({audios.length})
            </Text>
            {audios.map((file, index) => (
              <TouchableOpacity
                key={file.id}
                style={[
                  styles.audioButton,
                  playingAudio === file.id && styles.audioButtonPlaying
                ]}
                activeOpacity={0.7}
                onPress={() => handlePlayAudio(file.url, file.id)}
              >
                <Ionicons 
                  name={playingAudio === file.id ? "stop" : "play"} 
                  size={20} 
                  color={playingAudio === file.id ? "#e6491e" : "#000000"} 
                />
                <Text style={[
                  styles.audioText,
                  playingAudio === file.id && styles.audioTextPlaying
                ]}>
                  {playingAudio === file.id ? "Playing..." : `Audio recording ${index + 1}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* AI-Generated Tips Section */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipsHeader}>
            <Ionicons name="sparkles" size={20} color="#e6491e" />
            <Text style={styles.tipsHeaderText}>
              INKINGI AI Safety Tips
            </Text>
          </View>

          {loadingTips ? (
            <View style={styles.tipsLoadingContainer}>
              <ActivityIndicator size="small" color="#e6491e" />
              <Text style={styles.tipsLoadingText}>
                Generating personalized safety tips...
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.tipTitle}>
                Safety guidance for this emergency
              </Text>
              <Text style={styles.tipSubtitle}>
                AI-generated tips based on the emergency type, location, and situation.
              </Text>

              <View style={styles.tipsList}>
                {aiTips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <Text style={styles.tipNumber}>{index + 1}.</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.footer}>
        {emergencyData && user && emergencyData.user.id === user.id ? (
          // Emergency Creator View
          <TouchableOpacity
            style={styles.emergencyOwnerButton}
            activeOpacity={0.8}
            onPress={() => setShowVolunteersModal(true)}
          >
            <Ionicons name="people" size={24} color="#ffffff" />
            <Text style={styles.volunteerButtonText}>
              View Volunteers ({volunteers.length})
            </Text>
          </TouchableOpacity>
        ) : (
          // Volunteer Button for Others
          <TouchableOpacity
            style={[
              styles.volunteerButton,
              isVolunteered && styles.volunteerButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={isVolunteered ? handleDeleteVolunteer : () => setShowVolunteerFormModal(true)}
          >
            <Ionicons
              name={isVolunteered ? "checkmark-circle" : "hand-right"}
              size={24}
              color="#ffffff"
            />
            <Text style={styles.volunteerButtonText}>
              {isVolunteered ? "Already Volunteered" : "Volunteer to Help"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Image Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedImage(null)}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedImage(null)}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {selectedImage && (
            <TouchableOpacity
              style={styles.modalImageContainer}
              activeOpacity={1}
            >
              <Image
                source={{ uri: selectedImage }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Modal>

      {/* Video Modal */}
      <Modal
        visible={selectedVideo !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setSelectedVideo(null);
          if (videoRef.current) {
            videoRef.current.pauseAsync();
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setSelectedVideo(null);
                if (videoRef.current) {
                  videoRef.current.pauseAsync();
                }
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {selectedVideo && (
            <View style={styles.videoModalContainer}>
              <Video
                ref={videoRef}
                source={{ uri: selectedVideo }}
                style={styles.videoPlayer}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
              />
            </View>
          )}
        </View>
      </Modal>

      {/* Volunteers Modal */}
      <Modal
        visible={showVolunteersModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowVolunteersModal(false)}
      >
        <View style={styles.volunteersModalOverlay}>
          <TouchableOpacity
            style={styles.volunteersModalBackdrop}
            activeOpacity={1}
            onPress={() => setShowVolunteersModal(false)}
          />
          <View style={styles.volunteersModalContainer}>
            <View style={styles.volunteersModalHandle} />
            <View style={styles.volunteersModalHeader}>
              <Text style={styles.volunteersModalTitle}>
                Volunteers ({volunteers.length})
              </Text>
              <TouchableOpacity
                onPress={() => setShowVolunteersModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.volunteersModalScroll}
              showsVerticalScrollIndicator={false}
            >
              {volunteers.length > 0 ? (
                volunteers.map((volunteer) => (
                  <TouchableOpacity
                    key={volunteer.id}
                    style={styles.volunteerItem}
                    activeOpacity={0.7}
                    onPress={() => {
                      setShowVolunteersModal(false);
                      setTimeout(() => {
                        setSelectedVolunteer(volunteer);
                        setShowVolunteerDetailsModal(true);
                      }, 10);
                    }}
                  >
                    <View style={styles.volunteerAvatar}>
                      <Text style={styles.volunteerAvatarText}>
                        {volunteer.user?.firstName?.charAt(0).toUpperCase() ||
                          "V"}
                      </Text>
                    </View>
                    <View style={styles.volunteerInfo}>
                      <Text style={styles.volunteerName}>
                        {volunteer.user?.firstName && volunteer.user?.lastName
                          ? `${volunteer.user.firstName} ${volunteer.user.lastName}`
                          : volunteer.user?.firstName || "Volunteer"}
                      </Text>
                      <Text style={styles.volunteerTime}>
                        Volunteered {formatTimeAgo(volunteer.createdAt)}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#999999"
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyVolunteersContainer}>
                  <Ionicons name="people-outline" size={48} color="#cccccc" />
                  <Text style={styles.emptyVolunteersText}>
                    No volunteers yet
                  </Text>
                  <Text style={styles.emptyVolunteersSubtext}>
                    Be the first to volunteer for this emergency
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Volunteer Details Modal */}
      <Modal
        visible={showVolunteerDetailsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVolunteerDetailsModal(false)}
      >
        <View style={styles.volunteerDetailsModalOverlay}>
          <TouchableOpacity
            style={styles.volunteerDetailsModalBackdrop}
            activeOpacity={1}
            onPress={() => setShowVolunteerDetailsModal(false)}
          />
          <View style={styles.volunteerDetailsModalContainer}>
            {/* Header */}
            <View style={styles.volunteerDetailsHeader}>
              <Text style={styles.volunteerDetailsTitle}>
                Volunteer Details
              </Text>
              <TouchableOpacity
                onPress={() => setShowVolunteerDetailsModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.volunteerDetailsScroll}
              showsVerticalScrollIndicator={false}
            >
              {selectedVolunteer && (
                <>
                  {/* Volunteer Info */}
                  <View style={styles.volunteerDetailsCard}>
                    <View style={styles.volunteerDetailsAvatarContainer}>
                      <View style={styles.volunteerDetailsAvatar}>
                        <Text style={styles.volunteerDetailsAvatarText}>
                          {selectedVolunteer.user?.firstName
                            ?.charAt(0)
                            .toUpperCase() || "V"}
                        </Text>
                      </View>
                      {selectedVolunteer.isAccepted && (
                        <View style={styles.acceptedBadge}>
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#ffffff"
                          />
                          <Text style={styles.acceptedBadgeText}>Accepted</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.volunteerDetailsName}>
                      {selectedVolunteer.user?.firstName &&
                      selectedVolunteer.user?.lastName
                        ? `${selectedVolunteer.user.firstName} ${selectedVolunteer.user.lastName}`
                        : selectedVolunteer.user?.firstName || "Volunteer"}
                    </Text>
                    <Text style={styles.volunteerDetailsEmail}>
                      {selectedVolunteer.user?.email}
                    </Text>
                    {selectedVolunteer.user?.phoneNumber && (
                      <View style={styles.volunteerDetailsPhoneContainer}>
                        <Ionicons
                          name="call-outline"
                          size={16}
                          color="#666666"
                        />
                        <Text style={styles.volunteerDetailsPhone}>
                          {selectedVolunteer.user.phoneNumber}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Skills Section */}
                  {selectedVolunteer.skills && (
                    <View style={styles.volunteerDetailsSection}>
                      <View style={styles.volunteerDetailsSectionHeader}>
                        <Ionicons
                          name="ribbon-outline"
                          size={20}
                          color="#e6491e"
                        />
                        <Text style={styles.volunteerDetailsSectionTitle}>
                          Skills
                        </Text>
                      </View>
                      <View style={styles.skillsContainer}>
                        {selectedVolunteer.skills
                          .split(",")
                          .map((skill, index) => (
                            <View key={index} style={styles.skillBadge}>
                              <Text style={styles.skillBadgeText}>
                                {skill.trim()}
                              </Text>
                            </View>
                          ))}
                      </View>
                    </View>
                  )}

                  {/* Message Section */}
                  {selectedVolunteer.message && (
                    <View style={styles.volunteerDetailsSection}>
                      <View style={styles.volunteerDetailsSectionHeader}>
                        <Ionicons
                          name="chatbubble-outline"
                          size={20}
                          color="#e6491e"
                        />
                        <Text style={styles.volunteerDetailsSectionTitle}>
                          Message
                        </Text>
                      </View>
                      <Text style={styles.volunteerDetailsMessage}>
                        {selectedVolunteer.message}
                      </Text>
                    </View>
                  )}

                  {/* Volunteered Time */}
                  <View style={styles.volunteerDetailsSection}>
                    <View style={styles.volunteerDetailsSectionHeader}>
                      <Ionicons name="time-outline" size={20} color="#e6491e" />
                      <Text style={styles.volunteerDetailsSectionTitle}>
                        Volunteered
                      </Text>
                    </View>
                    <Text style={styles.volunteerDetailsTime}>
                      {formatTimeAgo(selectedVolunteer.createdAt)}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Volunteer Form Modal */}
      <VolunteerForm
        visible={showVolunteerFormModal}
        onClose={() => setShowVolunteerFormModal(false)}
        onSubmit={handleVolunteerSubmit}
        isSubmitting={isSubmittingVolunteer}
      />

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
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e6491e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  locationText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  emergencyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    textTransform: "capitalize",
  },
  metaContainer: {
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: "#999999",
    fontWeight: "500",
  },
  reportedByContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  reporterAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e6491e",
    justifyContent: "center",
    alignItems: "center",
  },
  reporterInitial: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  reporterInfo: {
    flex: 1,
  },
  reporterLabel: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  reporterName: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "600",
  },
  mapSection: {
    marginBottom: 24,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  map: {
    flex: 1,
  },
  alertMarkerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  userMarkerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  userDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4285F4",
    borderWidth: 3,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  distanceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  distanceText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
  },
  imagesGrid: {
    flexDirection: "row",
    gap: 12,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999999",
    fontWeight: "500",
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  audioButtonPlaying: {
    backgroundColor: "#fff5f3",
    borderWidth: 1,
    borderColor: "#e6491e",
  },
  audioText: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "500",
  },
  audioTextPlaying: {
    color: "#e6491e",
    fontWeight: "600",
  },
  tipsLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 20,
    justifyContent: "center",
  },
  tipsLoadingText: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
  },
  tipsContainer: {
    backgroundColor: "#fff8f5",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffe5d9",
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  tipsHeaderText: {
    fontSize: 14,
    color: "#e6491e",
    fontWeight: "600",
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  tipSubtitle: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: "row",
    gap: 8,
  },
  tipNumber: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "600",
    minWidth: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  boldText: {
    fontWeight: "700",
    color: "#000000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeader: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImageContainer: {
    width: SCREEN_WIDTH,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  videoModalContainer: {
    width: SCREEN_WIDTH,
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlayer: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  volunteersModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  volunteersModalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  volunteersModalContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  volunteersModalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#cccccc",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  volunteersModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  volunteersModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  volunteersModalScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  volunteerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 12,
  },
  volunteerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e6491e",
    justifyContent: "center",
    alignItems: "center",
  },
  volunteerAvatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  volunteerInfo: {
    flex: 1,
  },
  volunteerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  volunteerTime: {
    fontSize: 13,
    color: "#999999",
  },
  footer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  volunteerButton: {
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
  volunteerButtonDisabled: {
    backgroundColor: "#10b981",
  },
  volunteerButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  emergencyOwnerButton: {
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#3b82f6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyVolunteersContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyVolunteersText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyVolunteersSubtext: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
  },
  volunteerDetailsModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  volunteerDetailsModalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  volunteerDetailsModalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  volunteerDetailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  volunteerDetailsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  volunteerDetailsScroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  volunteerDetailsCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  volunteerDetailsAvatarContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  volunteerDetailsAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e6491e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  volunteerDetailsAvatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
  },
  acceptedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#10b981",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  acceptedBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  volunteerDetailsName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  volunteerDetailsEmail: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  volunteerDetailsPhoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  volunteerDetailsPhone: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  volunteerDetailsSection: {
    marginBottom: 20,
  },
  volunteerDetailsSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  volunteerDetailsSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    backgroundColor: "#fff8f5",
    borderWidth: 1,
    borderColor: "#e6491e",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  skillBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#e6491e",
  },
  volunteerDetailsMessage: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  volunteerDetailsTime: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
});
