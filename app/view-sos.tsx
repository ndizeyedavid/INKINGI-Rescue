import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ViewSos() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // This data would come from navigation params or API
  const emergencyData = {
    type: "Road Accident",
    icon: "car-crash",
    location: "Nyamkombo Kk 291",
    description:
      "The incident involved the vehicle RAH 331, which was involved in a collision between a car and a motorcycle. The accident resulted in a serious head injury for the biker. Urgent emergency services are needed at this location.",
    images: [
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    ],
    hasAudio: true,
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
            {/* Alert Location Marker */}
            <View style={styles.alertMarker}>
              <Ionicons name="location" size={32} color="#e6491e" />
              <View style={styles.alertLabel}>
                <Text style={styles.alertLabelText}>Alert Location</Text>
              </View>
            </View>

            {/* User Current Location Marker */}
            <View style={styles.userMarker}>
              <View style={styles.userDot} />
              <View style={styles.userLabel}>
                <Text style={styles.userLabelText}>You are here</Text>
              </View>
            </View>

            {/* Distance Line */}
            <View style={styles.distanceLine} />
          </View>

          {/* Distance Info */}
          <View style={styles.distanceInfo}>
            <Ionicons name="navigate" size={16} color="#666666" />
            <Text style={styles.distanceText}>2.3 km away from you</Text>
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
    backgroundColor: "#e8f4f8",
    borderRadius: 12,
    position: "relative",
    overflow: "hidden",
    marginBottom: 12,
  },
  alertMarker: {
    position: "absolute",
    top: 40,
    right: 60,
    alignItems: "center",
  },
  alertLabel: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertLabelText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#e6491e",
  },
  userMarker: {
    position: "absolute",
    bottom: 50,
    left: 50,
    alignItems: "center",
  },
  userDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4285F4",
    borderWidth: 3,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userLabel: {
    backgroundColor: "#000000",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
  },
  userLabelText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ffffff",
  },
  distanceLine: {
    position: "absolute",
    top: 70,
    left: 65,
    right: 90,
    height: 2,
    backgroundColor: "#666666",
    opacity: 0.3,
    transform: [{ rotate: "20deg" }],
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
