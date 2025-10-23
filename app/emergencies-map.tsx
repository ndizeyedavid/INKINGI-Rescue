import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { emergencyApi } from "@/services/api/api.service";
import {
  Alert,
  Animated,
  FlatList,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  Callout,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

interface EmergencyReport {
  id: string;
  type: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  createdAt: string;
  address: string;
  status: "reported" | "dispatched" | "resolved";
}

export default function EmergenciesMap() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [region, setRegion] = useState<Region>({
    latitude: -1.9441,
    longitude: 30.0619,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isTracking, setIsTracking] = useState(false);
  const isTrackingRef = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalTranslateY = useRef(new Animated.Value(300)).current;
  const [selectedEmergency, setSelectedEmergency] =
    useState<EmergencyReport | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [routeDistance, setRouteDistance] = useState<number>(0);
  const [routeDuration, setRouteDuration] = useState<number>(0);

  const [emergencies, setEmergencies] = useState<EmergencyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to show your position on the map."
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);

      mapRef.current?.animateToRegion(
        {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );

      // Fetch emergencies from backend
      await fetchEmergencies();
    })();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    };
  }, []);

  const fetchEmergencies = async () => {
    try {
      setLoading(true);
      const response = await emergencyApi.getAll();
      
      if (response.success && response.data) {
        setEmergencies(response.data);
      }
    } catch (error) {
      console.error("Error fetching emergencies:", error);
      Alert.alert("Error", "Failed to load emergencies. Please try again.");
    } finally {
      setLoading(false);
    }
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
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const centerOnUser = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);

      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      mapRef.current?.animateToRegion(newRegion, 1000);
    } catch (error) {
      Alert.alert("Error", "Failed to get current location");
    }
  };

  const toggleTracking = async () => {
    if (!isTracking) {
      setIsTracking(true);
      isTrackingRef.current = true;
      await centerOnUser();

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation);
          if (isTrackingRef.current) {
            mapRef.current?.animateToRegion(
              {
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              500
            );
          }
        }
      );
      locationSubscription.current = subscription;
    } else {
      setIsTracking(false);
      isTrackingRef.current = false;
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    }
  };

  const getRoute = async (emergency: EmergencyReport) => {
    if (!location) {
      Alert.alert("Location Required", "Please enable location to get route");
      return;
    }

    try {
      const apiKey = "629e52a9-2355-4711-99ca-119d3e430a89";
      const url = `https://graphhopper.com/api/1/route?point=${location.coords.latitude},${location.coords.longitude}&point=${emergency.latitude},${emergency.longitude}&vehicle=car&locale=en&key=${apiKey}&points_encoded=false&instructions=true`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.paths && data.paths.length > 0) {
        const path = data.paths[0];

        const coordinates = path.points.coordinates.map(
          (coord: [number, number]) => ({
            latitude: coord[1],
            longitude: coord[0],
          })
        );

        setRouteCoordinates(coordinates);
        setRouteDistance(path.distance / 1000);
        setRouteDuration(path.time / 60000);
        setSelectedEmergency(emergency);

        if (mapRef.current && coordinates.length > 0) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 100, right: 80, bottom: 300, left: 80 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error("Route error:", error);
      Alert.alert("Route Error", "Failed to get route. Please try again.");
    }
  };

  const clearRoute = () => {
    setRouteCoordinates([]);
    setRouteDistance(0);
    setRouteDuration(0);
    setSelectedEmergency(null);
  };

  const toggleModal = () => {
    if (isModalOpen) {
      Animated.timing(modalTranslateY, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsModalOpen(false));
    } else {
      setIsModalOpen(true);
      Animated.timing(modalTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 5;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        modalTranslateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        toggleModal();
      } else {
        Animated.spring(modalTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const getMarkerColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("fire")) return "#ef4444";
    if (lowerType.includes("accident")) return "#f59e0b";
    if (lowerType.includes("medical")) return "#dc2626";
    if (lowerType.includes("flood")) return "#3b82f6";
    if (lowerType.includes("robbery")) return "#8b5cf6";
    if (lowerType.includes("assault")) return "#ec4899";
    if (lowerType.includes("quake")) return "#a855f7";
    return "#6b7280";
  };

  const getMarkerIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("fire")) return "flame";
    if (lowerType.includes("accident")) return "car-sport";
    if (lowerType.includes("medical")) return "medical";
    if (lowerType.includes("flood")) return "water";
    if (lowerType.includes("robbery")) return "bag";
    if (lowerType.includes("assault")) return "warning";
    if (lowerType.includes("quake")) return "home";
    return "alert-circle";
  };

  const renderEmergencyItem = ({ item }: { item: EmergencyReport }) => (
    <TouchableOpacity
      style={[
        styles.emergencyCard,
        selectedEmergency?.id === item.id && styles.emergencyCardSelected,
      ]}
      activeOpacity={0.8}
      onPress={() => {
        getRoute(item);
        toggleModal();
      }}
    >
      <View
        style={[
          styles.emergencyIconContainer,
          { backgroundColor: getMarkerColor(item.type) },
        ]}
      >
        <Ionicons
          name={getMarkerIcon(item.type) as any}
          size={20}
          color="#ffffff"
        />
      </View>
      <View style={styles.emergencyInfo}>
        <Text style={styles.emergencyTitle}>{item.title}</Text>
        <Text style={styles.emergencyLocation} numberOfLines={1}>
          {item.address}
        </Text>
        <Text style={styles.emergencyTimestamp}>{formatTimeAgo(item.createdAt)}</Text>
      </View>
      <Ionicons name="navigate" size={20} color="#e6491e" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Emergency Map",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsTraffic={false}
      >
        {/* User Location Marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          >
            <View style={styles.userLocationMarker}>
              <View style={styles.userLocationDot} />
            </View>
          </Marker>
        )}

        {/* Emergency Markers */}
        {emergencies.map((emergency) => (
          <Marker
            key={emergency.id}
            coordinate={{
              latitude: emergency.latitude,
              longitude: emergency.longitude,
            }}
          >
            <View
              style={[
                styles.emergencyMarker,
                { backgroundColor: getMarkerColor(emergency.type) },
              ]}
            >
              <Ionicons
                name={getMarkerIcon(emergency.type) as any}
                size={20}
                color="#ffffff"
              />
            </View>
            <Callout tooltip onPress={() => router.push({
              pathname: "/view-sos",
              params: { emergencyId: emergency.id }
            })}>
              <View style={styles.calloutContainer}>
                <View style={styles.calloutHeader}>
                  <View
                    style={[
                      styles.calloutIcon,
                      { backgroundColor: getMarkerColor(emergency.type) },
                    ]}
                  >
                    <Ionicons
                      name={getMarkerIcon(emergency.type) as any}
                      size={16}
                      color="#ffffff"
                    />
                  </View>
                  <View style={styles.calloutHeaderText}>
                    <Text style={styles.calloutTitle}>{emergency.title}</Text>
                    <Text style={styles.calloutTimestamp}>
                      {formatTimeAgo(emergency.createdAt)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.calloutDescription} numberOfLines={2}>
                  {emergency.description}
                </Text>
                <TouchableOpacity
                  style={styles.viewDetailsButton}
                  onPress={() => {
                    getRoute(emergency);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.viewDetailsText}>Get Directions</Text>
                  <Ionicons name="navigate" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Route Polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#4285F4"
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>

      {/* Map Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={centerOnUser}
          activeOpacity={0.8}
        >
          <Ionicons name="locate" size={24} color="#000000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.trackButton, isTracking && styles.trackButtonActive]}
          onPress={toggleTracking}
          activeOpacity={0.8}
        >
          <Ionicons
            name="navigate"
            size={20}
            color={isTracking ? "#ffffff" : "#e6491e"}
          />
          <Text
            style={[
              styles.trackButtonText,
              isTracking && styles.trackButtonTextActive,
            ]}
          >
            {isTracking ? "Tracking..." : "Track Me"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Route Info Card */}
      {selectedEmergency && (
        <View style={styles.routeInfoCard}>
          <View style={styles.routeInfoHeader}>
            <View style={styles.routeInfoLeft}>
              <Text style={styles.routeInfoTitle}>
                {selectedEmergency.title}
              </Text>
              <Text style={styles.routeInfoDetails}>
                {routeDistance.toFixed(1)} km • ~{Math.round(routeDuration)} min
              </Text>
            </View>
            <TouchableOpacity
              style={styles.clearRouteButton}
              onPress={clearRoute}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={20} color="#666666" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.viewDetailsButtonSmall}
            onPress={() => router.push({
              pathname: "/view-sos",
              params: { emergencyId: selectedEmergency.id }
            })}
            activeOpacity={0.8}
          >
            <Text style={styles.viewDetailsTextSmall}>View Details</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Toggle Modal Button */}
      <TouchableOpacity
        style={styles.toggleModalButton}
        onPress={toggleModal}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isModalOpen ? "chevron-down" : "chevron-up"}
          size={24}
          color="#ffffff"
        />
        <Text style={styles.toggleModalText}>
          {emergencies.length} Emergencies
        </Text>
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
      {isModalOpen && (
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: modalTranslateY }] },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Reported Emergencies</Text>
            <TouchableOpacity onPress={toggleModal} activeOpacity={0.8}>
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={emergencies}
            renderItem={renderEmergencyItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.emergencyList}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  userLocationMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(66, 133, 244, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  userLocationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4285F4",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  emergencyMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
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
  controls: {
    position: "absolute",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    bottom: 120,
    right: 20,
    gap: 12,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  trackButtonActive: {
    backgroundColor: "#e6491e",
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e6491e",
  },
  trackButtonTextActive: {
    color: "#ffffff",
  },
  toggleModalButton: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    backgroundColor: "#e6491e",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toggleModalText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#cccccc",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  emergencyList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emergencyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 12,
  },
  emergencyIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  emergencyLocation: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  emergencyTimestamp: {
    fontSize: 12,
    color: "#999999",
  },
  calloutContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    width: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calloutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  calloutIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  calloutHeaderText: {
    flex: 1,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 2,
  },
  calloutTimestamp: {
    fontSize: 12,
    color: "#999999",
  },
  calloutDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 12,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#e6491e",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  emergencyCardSelected: {
    backgroundColor: "#fff5f5",
    borderWidth: 2,
    borderColor: "#e6491e",
  },
  routeInfoCard: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  routeInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  routeInfoLeft: {
    flex: 1,
  },
  routeInfoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  routeInfoDetails: {
    fontSize: 14,
    color: "#666666",
  },
  clearRouteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  viewDetailsButtonSmall: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#e6491e",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewDetailsTextSmall: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});
