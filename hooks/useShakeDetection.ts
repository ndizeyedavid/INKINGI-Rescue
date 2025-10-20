import { Accelerometer } from "expo-sensors";
import { useEffect, useRef } from "react";

interface ShakeDetectionOptions {
  threshold?: number; // Shake intensity threshold (default: 1.5)
  timeout?: number; // Time between shakes in ms (default: 500)
  onShake: () => void;
}

/**
 * Custom hook to detect device shake gestures
 * @param options Configuration options for shake detection
 */
export const useShakeDetection = ({
  threshold = 1.5,
  timeout = 500,
  onShake,
}: ShakeDetectionOptions) => {
  const lastShake = useRef<number>(0);
  const subscription = useRef<any>(null);

  useEffect(() => {
    // Set update interval for accelerometer
    Accelerometer.setUpdateInterval(100);

    // Subscribe to accelerometer updates
    subscription.current = Accelerometer.addListener((accelerometerData) => {
      const { x, y, z } = accelerometerData;
      
      // Calculate total acceleration
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      
      // Detect shake if acceleration exceeds threshold
      if (acceleration > threshold) {
        const now = Date.now();
        
        // Check if enough time has passed since last shake
        if (now - lastShake.current > timeout) {
          lastShake.current = now;
          onShake();
        }
      }
    });

    // Cleanup on unmount
    return () => {
      if (subscription.current) {
        subscription.current.remove();
      }
    };
  }, [threshold, timeout, onShake]);

  return null;
};
