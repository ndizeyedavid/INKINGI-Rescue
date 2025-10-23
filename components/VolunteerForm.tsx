import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface VolunteerFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { message: string; skills: string }) => void;
  isSubmitting?: boolean;
}

export default function VolunteerForm({
  visible,
  onClose,
  onSubmit,
  isSubmitting = false,
}: VolunteerFormProps) {
  const [message, setMessage] = useState("");
  const [skills, setSkills] = useState("");
  const [errors, setErrors] = useState<{ message?: string; skills?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { message?: string; skills?: string } = {};

    if (!message.trim()) {
      newErrors.message = "Please enter a message";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    if (!skills.trim()) {
      newErrors.skills = "Please enter your skills";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        message: message.trim(),
        skills: skills.trim(),
      });
      // Reset form
      setMessage("");
      setSkills("");
      setErrors({});
    }
  };

  const handleClose = () => {
    setMessage("");
    setSkills("");
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="hand-right" size={24} color="#e6491e" />
            </View>
            <Text style={styles.title}>Volunteer to Help</Text>
            <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.description}>
              Thank you for volunteering! Please provide some information about
              how you can help.
            </Text>

            {/* Message Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputHeader}>
                <Ionicons name="chatbubble-outline" size={18} color="#e6491e" />
                <Text style={styles.inputLabel}>Message</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={[
                  styles.textArea,
                  errors.message && styles.inputError,
                ]}
                placeholder="Describe how you can help with this emergency..."
                placeholderTextColor="#999999"
                value={message}
                onChangeText={(text) => {
                  setMessage(text);
                  if (errors.message) {
                    setErrors({ ...errors, message: undefined });
                  }
                }}
                multiline
                numberOfLines={4}
                maxLength={500}
                editable={!isSubmitting}
              />
              {errors.message && (
                <Text style={styles.errorText}>{errors.message}</Text>
              )}
              <Text style={styles.characterCount}>
                {message.length}/500 characters
              </Text>
            </View>

            {/* Skills Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputHeader}>
                <Ionicons name="ribbon-outline" size={18} color="#e6491e" />
                <Text style={styles.inputLabel}>Skills</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={[styles.input, errors.skills && styles.inputError]}
                placeholder="e.g., First Aid, CPR Certified, Transportation"
                placeholderTextColor="#999999"
                value={skills}
                onChangeText={(text) => {
                  setSkills(text);
                  if (errors.skills) {
                    setErrors({ ...errors, skills: undefined });
                  }
                }}
                maxLength={200}
                editable={!isSubmitting}
              />
              {errors.skills && (
                <Text style={styles.errorText}>{errors.skills}</Text>
              )}
              <Text style={styles.helperText}>
                Separate multiple skills with commas
              </Text>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#3b82f6" />
              <Text style={styles.infoText}>
                Your information will be shared with the emergency reporter to
                coordinate assistance.
              </Text>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Ionicons name="hourglass-outline" size={20} color="#ffffff" />
                  <Text style={styles.submitButtonText}>Submitting...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                  <Text style={styles.submitButtonText}>Submit</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff8f5",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginLeft: 12,
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  required: {
    fontSize: 14,
    color: "#e6491e",
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#000000",
  },
  textArea: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#000000",
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#e6491e",
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: "#e6491e",
    marginTop: 4,
    marginLeft: 4,
  },
  characterCount: {
    fontSize: 12,
    color: "#999999",
    marginTop: 4,
    textAlign: "right",
  },
  helperText: {
    fontSize: 12,
    color: "#999999",
    marginTop: 4,
    marginLeft: 4,
  },
  infoBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#1e40af",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#e6491e",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#e6491e",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: "#fca5a5",
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
