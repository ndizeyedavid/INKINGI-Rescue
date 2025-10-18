import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
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

interface ILocationPickerModal {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
  currentLocation: string;
}

const LOCATIONS = ["Kimisagara, KK 301", "Gitega", "Gatsata"];

export default function LocationPickerModal({
  visible,
  onClose,
  onSelectLocation,
  currentLocation,
}: ILocationPickerModal) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  const [translateY] = useState(new Animated.Value(0));

  const filteredLocations = LOCATIONS.filter((location) =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    onSelectLocation(selectedLocation);
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

          {/* Map Placeholder */}
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <View style={styles.youAreHere}>
                <Text style={styles.youAreHereText}>You are here</Text>
              </View>
              <Ionicons
                name="location"
                size={40}
                color="#e6491e"
                style={styles.mapMarker}
              />
            </View>
            <TouchableOpacity style={styles.trackLocationButton}>
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
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: "#e8f4f8",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  youAreHere: {
    backgroundColor: "#000000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    position: "absolute",
    top: 20,
  },
  youAreHereText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  mapMarker: {
    marginTop: 20,
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
