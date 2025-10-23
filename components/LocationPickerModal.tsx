import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

interface ILocationPickerModal {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (locationData: LocationData) => void;
  currentLocation: string;
}

const LOCATIONS = ["Kimisagara, KK 301", "Gitega", "Gatsata"];

export default function LocationPickerModal({
  visible,
  onClose,
  onSelectLocation,
  currentLocation,
}: ILocationPickerModal) {
  const mapRef = useRef<MapView>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  const [translateY] = useState(new Animated.Value(0));
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: -1.9441,
    longitude: 30.0619,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: -1.9441,
    longitude: 30.0619,
  });

  useEffect(() => {
    if (visible) {
      getUserLocation();
    }
  }, [visible]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to show your position."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation(location);
      
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      setRegion(newRegion);
      setMarkerCoordinate({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      // Get address from coordinates
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (address[0]) {
        const addr = address[0];
        const parts = [
          addr.name,
          addr.street,
          addr.streetNumber,
          addr.district,
          addr.subregion,
          addr.city,
          addr.region,
          addr.postalCode,
        ].filter(Boolean);
        
        const formattedAddress = parts.length > 0 
          ? parts.slice(0, 3).join(", ") 
          : `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;
        
        setSelectedLocation(formattedAddress);
      }
      
      mapRef.current?.animateToRegion(newRegion, 1000);
    } catch (error) {
      console.error("Location error:", error);
    }
  };

  const handleMapPress = async (event: any) => {
    const coordinate = event.nativeEvent.coordinate;
    setMarkerCoordinate(coordinate);
    
    try {
      const address = await Location.reverseGeocodeAsync({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
      
      if (address[0]) {
        const addr = address[0];
        const parts = [
          addr.name,
          addr.street,
          addr.streetNumber,
          addr.district,
          addr.subregion,
          addr.city,
          addr.region,
          addr.postalCode,
        ].filter(Boolean);
        
        const formattedAddress = parts.length > 0 
          ? parts.slice(0, 3).join(", ") 
          : `${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)}`;
        
        setSelectedLocation(formattedAddress);
      }
    } catch (error) {
      console.error("Reverse geocode error:", error);
      // Fallback to coordinates if reverse geocoding fails
      setSelectedLocation(`${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)}`);
    }
  };

  const filteredLocations = LOCATIONS.filter((location) =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    onSelectLocation({
      address: selectedLocation,
      latitude: markerCoordinate.latitude,
      longitude: markerCoordinate.longitude,
    });
    onClose();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 5;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 150) {
        Animated.timing(translateY, {
          toValue: 1000,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onClose();
          translateY.setValue(0);
        });
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: translateY }] },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Handle Bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Select Location</Text>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Address"
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Map */}
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={region}
              onPress={handleMapPress}
              showsUserLocation={true}
              showsMyLocationButton={false}
            >
              <Marker
                coordinate={markerCoordinate}
                draggable
                onDragEnd={handleMapPress}
              >
                <View style={styles.customMarker}>
                  <Ionicons name="location" size={40} color="#e6491e" />
                </View>
              </Marker>
            </MapView>
            <TouchableOpacity 
              style={styles.trackLocationButton}
              onPress={getUserLocation}
              activeOpacity={0.8}
            >
              <Ionicons name="navigate" size={16} color="#e6491e" />
              <Text style={styles.trackLocationText}>Track my location</Text>
            </TouchableOpacity>
          </View>

          {/* Current Location */}
          <View style={styles.currentLocationContainer}>
            <Ionicons name="location-outline" size={20} color="#666666" />
            <Text style={styles.currentLocationText}>{currentLocation}</Text>
          </View>

          {/* Location List */}
          <ScrollView
            style={styles.locationList}
            showsVerticalScrollIndicator={false}
          >
            {filteredLocations.map((location, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.locationItem,
                  selectedLocation === location && styles.selectedLocationItem,
                ]}
                onPress={() => setSelectedLocation(location)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.locationItemText,
                    selectedLocation === location &&
                      styles.selectedLocationItemText,
                  ]}
                >
                  {location}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Confirm Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              activeOpacity={0.8}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    height: "80%",
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#cccccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000000",
  },
  mapContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    position: "relative",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  customMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  trackLocationButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trackLocationText: {
    color: "#e6491e",
    fontSize: 12,
    fontWeight: "600",
  },
  currentLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  currentLocationText: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "500",
  },
  locationList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  locationItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedLocationItem: {
    backgroundColor: "#ffffff",
    borderColor: "#e6491e",
  },
  locationItemText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  selectedLocationItemText: {
    color: "#000000",
    fontWeight: "600",
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  confirmButton: {
    backgroundColor: "#e6491e",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
