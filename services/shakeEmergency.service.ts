import { Audio } from "expo-av";
import * as Location from "expo-location";
import { emergencyApi } from "./api/api.service";

interface ShakeEmergencyData {
  audioUri?: string;
  photoUri?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  emergencyType?: string; // Backend emergency type (ACCIDENT, FIRE, MEDICAL, etc.)
}

export class ShakeEmergencyService {
  private recording: Audio.Recording | null = null;

  /**
   * Record 5 seconds of audio
   */
  async recordAudio(): Promise<string | null> {
    try {
      console.log("Starting 5-second audio recording...");

      // Request permissions
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        console.error("Audio permission not granted");
        return null;
      }

      // Configure audio mode for simultaneous playback + recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      this.recording = recording;

      // Stop after 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000));

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      this.recording = null;

      console.log("Audio recorded:", uri);
      return uri;
    } catch (error) {
      console.error("Failed to record audio:", error);
      return null;
    } finally {
      // Restore audio mode to playback-friendly defaults so the loud alert keeps playing
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });
      } catch (restoreError) {
        console.warn(
          "Failed to restore audio mode after recording:",
          restoreError
        );
      }
    }
  }

  /**
   * Get current location with coordinates
   */
  async getCurrentLocation(): Promise<ShakeEmergencyData["location"] | null> {
    try {
      console.log("Getting current location...");

      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission not granted");
        return null;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Get address from coordinates
      let address = undefined;
      try {
        const [addressResult] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (addressResult) {
          address =
            `${addressResult.street || ""}, ${addressResult.city || ""}, ${addressResult.region || ""}, ${addressResult.country || ""}`.trim();
        }
      } catch (error) {
        console.error("Failed to get address:", error);
      }

      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address,
      };

      console.log("Location obtained:", locationData);
      return locationData;
    } catch (error) {
      console.error("Failed to get location:", error);
      return null;
    }
  }

  /**
   * Capture photo from camera (placeholder - requires camera ref)
   * This will be called from the component with camera access
   */
  async capturePhoto(cameraRef: any): Promise<string | null> {
    try {
      console.log("Capturing photo...");

      if (!cameraRef) {
        console.error("Camera ref not available");
        return null;
      }

      // Add a small delay to ensure camera is ready
      await new Promise((resolve) => setTimeout(resolve, 300));

      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (!photo || !photo.uri) {
        console.error("Photo capture returned no URI");
        return null;
      }

      console.log("Photo captured successfully:", photo.uri);
      return photo.uri;
    } catch (error) {
      console.error("Failed to capture photo:", error);
      return null;
    }
  }

  /**
   * Map panic button type label to backend emergency type
   */
  private mapTypeToBackend(typeLabel: string): string {
    const typeMap: Record<string, string> = {
      Fire: "FIRE",
      Medical: "MEDICAL",
      Robbery: "ROBBERY",
      Accident: "ACCIDENT",
      Assault: "ASSAULT",
      Flood: "FLOOD",
      Quake: "QUAKE",
      Other: "OTHER",
    };
    return typeMap[typeLabel] || "OTHER";
  }

  /**
   * Submit shake emergency to backend
   */
  async submitShakeEmergency(data: ShakeEmergencyData): Promise<boolean> {
    try {
      console.log("Submitting shake emergency to backend...");

      const formData = new FormData();

      // Add emergency metadata (matching report-emergency.tsx format)
      // Backend only accepts: ACCIDENT, FIRE, MEDICAL, FLOOD, QUAKE, ROBBERY, ASSAULT, OTHER
      const emergencyType = data.emergencyType
        ? this.mapTypeToBackend(data.emergencyType)
        : "OTHER";
      formData.append("type", emergencyType);
      formData.append("title", "🚨 SHAKE ALERT - Immediate Help Needed");
      formData.append(
        "description",
        "URGENT: Emergency triggered by shake detection. User may be in immediate danger and unable to manually report. This is an EXTRA URGENT situation requiring immediate response."
      );

      // Add location data
      if (data.location) {
        formData.append("latitude", data.location.latitude.toString());
        formData.append("longitude", data.location.longitude.toString());
        formData.append(
          "address",
          data.location.address || "Location captured"
        );
      } else {
        formData.append("address", "Location unavailable");
      }

      // Add audio file using 'files' field (matching backend expectation)
      if (data.audioUri) {
        console.log("Adding audio file to FormData:", data.audioUri);
        formData.append("files", {
          uri: data.audioUri,
          type: "audio/m4a",
          name: "shake_audio.m4a",
        } as any);
      }

      // Add photo file using 'files' field (matching backend expectation)
      if (data.photoUri) {
        console.log("Adding photo file to FormData:", data.photoUri);
        formData.append("files", {
          uri: data.photoUri,
          type: "image/jpeg",
          name: "shake_photo.jpg",
        } as any);
      } else {
        console.warn(
          "No photo URI available - photo may not have been captured"
        );
      }

      // Submit to backend
      const response = await emergencyApi.create(formData);

      if (response.success) {
        console.log("Shake emergency submitted successfully:", response.data);
        return true;
      } else {
        console.error("Failed to submit shake emergency:", response.error);
        return false;
      }
    } catch (error) {
      console.error("Error submitting shake emergency:", error);
      return false;
    }
  }

  /**
   * Execute full shake emergency flow
   */
  async executeShakeEmergency(
    cameraRef?: any,
    emergencyType?: string
  ): Promise<boolean> {
    try {
      console.log("=== EXECUTING SHAKE EMERGENCY FLOW ===");
      console.log("Emergency type:", emergencyType || "OTHER (default)");

      const emergencyData: ShakeEmergencyData = {
        emergencyType: emergencyType,
      };

      // Start audio and location in parallel
      const [audioUri, location, photoUri] = await Promise.all([
        this.recordAudio(),
        this.getCurrentLocation(),
        cameraRef ? this.capturePhoto(cameraRef) : Promise.resolve(null),
      ]);

      emergencyData.audioUri = audioUri || undefined;
      emergencyData.location = location || undefined;
      emergencyData.photoUri = photoUri || undefined;

      console.log("Emergency data collected:", {
        hasAudio: !!emergencyData.audioUri,
        hasLocation: !!emergencyData.location,
        hasPhoto: !!emergencyData.photoUri,
        audioUri: emergencyData.audioUri,
        photoUri: emergencyData.photoUri,
      });

      // Submit to backend
      const success = await this.submitShakeEmergency(emergencyData);

      console.log("=== SHAKE EMERGENCY FLOW COMPLETED ===");
      return success;
    } catch (error) {
      console.error("Error in shake emergency flow:", error);
      return false;
    }
  }
}

export const shakeEmergencyService = new ShakeEmergencyService();
