import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ViewSos() {
  const mapRef = useRef<MapView>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [duration, setDuration] = useState<number>(0);

  // This data would come from navigation params or API
  const emergencyData = {
    type: "Road Accident",
    icon: "car-crash",
    location: "Nyamkombo Kk 291",
    coordinates: {
      latitude: -2.2076556621901284,
      longitude: 30.15177516593474,
    },
    description:
      "The incident involved the vehicle RAH 331, which was involved in a collision between a car and a motorcycle. The accident resulted in a serious head injury for the biker. Urgent emergency services are needed at this location.",
    images: [
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    ],
    hasAudio: true,
  };

  useEffect(() => {
    getUserLocation();
  }, []);

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
      await getRoute(
        location.coords.latitude,
        location.coords.longitude,
        emergencyData.coordinates.latitude,
        emergencyData.coordinates.longitude
      );
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency Icon */}
        <View style={styles.iconContainer}>
          <FontAwesome5 name={emergencyData.icon} size={28} color="#ffffff" />
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666666" />
          <Text style={styles.locationText}>{emergencyData.location}</Text>
        </View>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: emergencyData.coordinates.latitude,
                longitude: emergencyData.coordinates.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              showsUserLocation={true}
            >
              {/* Emergency Location Marker */}
              <Marker coordinate={emergencyData.coordinates}>
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

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {emergencyData.description}
          </Text>
        </View>

        {/* Images/Videos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images/videos</Text>
          <View style={styles.imagesGrid}>
            {emergencyData.images.map((imageUrl, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageWrapper}
                activeOpacity={0.8}
                onPress={() => setSelectedImage(imageUrl)}
              >
                <Image source={{ uri: imageUrl }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recorded Audio */}
        {emergencyData.hasAudio && (
          <TouchableOpacity style={styles.audioButton} activeOpacity={0.7}>
            <Ionicons name="play" size={20} color="#000000" />
            <Text style={styles.audioText}>recorded audio</Text>
          </TouchableOpacity>
        )}

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipsHeader}>
            <Ionicons name="information-circle" size={20} color="#e6491e" />
            <Text style={styles.tipsHeaderText}>
              Tips that might be helpful
            </Text>
          </View>

          <Text style={styles.tipTitle}>If you are in an accident</Text>
          <Text style={styles.tipSubtitle}>
            Stay Calm & Check for Injuries – Assess yourself and passengers for
            injuries.
          </Text>

          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>1.</Text>
              <Text style={styles.tipText}>
                Move to Safety (If Possible) – If the vehicle is drivable, move
                it to the side of the road. Turn on hazard lights.
              </Text>
            </View>

            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>2.</Text>
              <Text style={styles.tipText}>
                Call Emergency Services – Dial{" "}
                <Text style={styles.boldText}>112</Text> for medical and police
                assistance.
              </Text>
            </View>

            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>3.</Text>
              <Text style={styles.tipText}>
                Do Not Leave the Scene – Stay until authorities arrive unless
                medical attention is needed.
              </Text>
            </View>

            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>4.</Text>
              <Text style={styles.tipText}>
                Exchange Information – Collect contact and insurance details
                with other involved parties.
              </Text>
            </View>

            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>5.</Text>
              <Text style={styles.tipText}>
                Document the Scene – Take photos of the vehicles, damage, and
                surroundings if safe to do so.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

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
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  audioText: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "500",
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
    width: SCREEN_WIDTH - 40,
    height: "80%",
  },
});
