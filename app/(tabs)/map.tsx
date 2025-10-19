import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

interface EmergencyReport {
  id: number;
  type: "accident" | "fire" | "medical" | "flood" | "robbery" | "assault";
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  timestamp: string;
}

export default function MapTab() {
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
  const [emergencies, setEmergencies] = useState<EmergencyReport[]>([
    {
      id: 1,
      type: "fire",
      latitude: -1.9506,
      longitude: 30.0588,
      title: "Fire Emergency",
      description: "Building fire reported",
      timestamp: "10 min ago",
    },
    {
      id: 2,
      type: "accident",
      latitude: -1.9395,
      longitude: 30.0644,
      title: "Car Accident",
      description: "Multiple vehicles involved",
      timestamp: "25 min ago",
    },
    {
      id: 3,
      type: "medical",
      latitude: -1.9478,
      longitude: 30.0567,
      title: "Medical Emergency",
      description: "Person collapsed",
      timestamp: "1 hour ago",
    },
    {
      id: 4,
      type: "robbery",
      latitude: -1.9423,
      longitude: 30.0701,
      title: "Robbery in Progress",
      description: "Armed robbery at store",
      timestamp: "5 min ago",
    },
  ]);

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

      // Center map on user location
      mapRef.current?.animateToRegion(
        {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
    })();

    // Cleanup function
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    };
  }, []);

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

      // Start watching position
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation);
          // Only animate if still tracking
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
      // Stop watching position
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    }
  };

  const getMarkerColor = (type: EmergencyReport["type"]) => {
    switch (type) {
      case "fire":
        return "#ef4444";
      case "accident":
        return "#f59e0b";
      case "medical":
        return "#dc2626";
      case "flood":
        return "#3b82f6";
      case "robbery":
        return "#8b5cf6";
      case "assault":
        return "#ec4899";
      default:
        return "#6b7280";
    }
  };

  const getMarkerIcon = (type: EmergencyReport["type"]) => {
    switch (type) {
      case "fire":
        return "flame";
      case "accident":
        return "car-sport";
      case "medical":
        return "medical";
      case "flood":
        return "water";
      case "robbery":
        return "bag";
      case "assault":
        return "warning";
      default:
        return "alert-circle";
    }
  };

  return (
    <View style={styles.container}>
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
            title="Your Location"
            description="You are here"
          >
            <View style={styles.userMarker}>
              <View style={styles.userMarkerInner} />
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
            <Callout tooltip onPress={() => router.push("/view-sos")}>
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
                      {emergency.timestamp}
                    </Text>
                  </View>
                </View>
                <Text style={styles.calloutDescription} numberOfLines={2}>
                  {emergency.description}
                </Text>
                <TouchableOpacity
                  style={styles.viewDetailsButton}
                  onPress={() => router.push("/view-sos")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Map Controls */}
      <View style={styles.controls}>
        {/* Center on User Button */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={centerOnUser}
          activeOpacity={0.8}
        >
          <Ionicons name="locate" size={24} color="#000000" />
        </TouchableOpacity>

        {/* Track Location Button */}
        <TouchableOpacity
          style={[styles.trackButton, isTracking && styles.trackButtonActive]}
          onPress={toggleTracking}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isTracking ? "navigate" : "navigate-outline"}
            size={20}
            color={isTracking ? "#ffffff" : "#000000"}
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

      {/* Legend */}
      {/* <View style={styles.legend}>
        <Text style={styles.legendTitle}>Emergency Types</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#ef4444" }]} />
            <Text style={styles.legendText}>Fire</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#f59e0b" }]} />
            <Text style={styles.legendText}>Accident</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#dc2626" }]} />
            <Text style={styles.legendText}>Medical</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#8b5cf6" }]} />
            <Text style={styles.legendText}>Robbery</Text>
          </View>
        </View>
      </View> */}
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
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  trackButtonActive: {
    backgroundColor: "#e6491e",
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  trackButtonTextActive: {
    color: "#ffffff",
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    borderWidth: 3,
    borderColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
  },
  emergencyMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  legend: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  legendItems: {
    gap: 6,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#666666",
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
});
