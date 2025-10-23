/**
 * Custom hook for managing app permissions
 */

import * as ExpoLocation from 'expo-location';
import { Camera as ExpoCamera } from 'expo-camera';
import { Audio } from 'expo-av';
import { useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';

export const usePermissions = () => {
  const [isRequesting, setIsRequesting] = useState(false);

  /**
   * Request Location Permission
   */
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      setIsRequesting(true);
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        return true;
      } else if (status === 'denied') {
        Alert.alert(
          'Location Permission Required',
          'Location access is required for emergency alerts. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
      return false;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    } finally {
      setIsRequesting(false);
    }
  };

  /**
   * Request Camera Permission
   */
  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      setIsRequesting(true);
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      
      if (status === 'granted') {
        return true;
      } else if (status === 'denied') {
        Alert.alert(
          'Camera Permission Required',
          'Camera access is required to take photos during emergencies. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
      return false;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    } finally {
      setIsRequesting(false);
    }
  };

  /**
   * Request Microphone Permission
   */
  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      setIsRequesting(true);
      const { status } = await Audio.requestPermissionsAsync();
      
      if (status === 'granted') {
        return true;
      } else if (status === 'denied') {
        Alert.alert(
          'Microphone Permission Required',
          'Microphone access is required to record audio during emergencies. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
      return false;
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      return false;
    } finally {
      setIsRequesting(false);
    }
  };

  /**
   * Check if Location Permission is granted
   */
  const checkLocationPermission = async (): Promise<boolean> => {
    const { status } = await ExpoLocation.getForegroundPermissionsAsync();
    return status === 'granted';
  };

  /**
   * Check if Camera Permission is granted
   */
  const checkCameraPermission = async (): Promise<boolean> => {
    const { status } = await ExpoCamera.getCameraPermissionsAsync();
    return status === 'granted';
  };

  /**
   * Check if Microphone Permission is granted
   */
  const checkMicrophonePermission = async (): Promise<boolean> => {
    const { status } = await Audio.getPermissionsAsync();
    return status === 'granted';
  };

  /**
   * Request all permissions at once
   */
  const requestAllPermissions = async () => {
    const location = await requestLocationPermission();
    const camera = await requestCameraPermission();
    const microphone = await requestMicrophonePermission();

    return {
      location,
      camera,
      microphone,
    };
  };

  return {
    isRequesting,
    requestLocationPermission,
    requestCameraPermission,
    requestMicrophonePermission,
    checkLocationPermission,
    checkCameraPermission,
    checkMicrophonePermission,
    requestAllPermissions,
  };
};
