import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AlertType = "success" | "error" | "warning" | "info";

interface CustomAlertProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
  onButtonPress?: () => void;
}

export default function CustomAlert({
  visible,
  type,
  title,
  message,
  buttonText = "OK",
  onClose,
  onButtonPress,
}: CustomAlertProps) {
  const getIconConfig = () => {
    switch (type) {
      case "success":
        return {
          name: "checkmark" as const,
          color: "#10b981",
          backgroundColor: "#d1fae5",
        };
      case "error":
        return {
          name: "close" as const,
          color: "#ef4444",
          backgroundColor: "#fee2e2",
        };
      case "warning":
        return {
          name: "warning" as const,
          color: "#f59e0b",
          backgroundColor: "#fef3c7",
        };
      case "info":
        return {
          name: "information" as const,
          color: "#3b82f6",
          backgroundColor: "#dbeafe",
        };
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "#10b981";
      case "error":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      case "info":
        return "#3b82f6";
      default:
        return "#e6491e";
    }
  };

  const iconConfig = getIconConfig();

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color="#999999" />
          </TouchableOpacity>

          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: iconConfig.backgroundColor },
            ]}
          >
            <Ionicons
              name={iconConfig.name}
              size={40}
              color={iconConfig.color}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: getButtonColor() }]}
            onPress={handleButtonPress}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  alertContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
