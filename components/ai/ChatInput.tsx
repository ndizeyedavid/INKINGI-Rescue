import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onMicPress?: () => void;
  isRecording?: boolean;
}

export default function ChatInput({
  value,
  onChangeText,
  onSend,
  onMicPress,
  isRecording = false,
}: ChatInputProps) {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TouchableOpacity
          style={[
            styles.micButton,
            isRecording && styles.micButtonRecording,
          ]}
          onPress={onMicPress}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isRecording ? "stop-circle" : "mic"} 
            size={22} 
            color={isRecording ? "#ffffff" : "#e6491e"} 
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Ask about any emergency..."
          placeholderTextColor="#999999"
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            value.trim() === "" && styles.sendButtonDisabled,
          ]}
          onPress={onSend}
          disabled={value.trim() === ""}
          activeOpacity={0.7}
        >
          <Ionicons
            name="send"
            size={20}
            color={value.trim() === "" ? "#cccccc" : "#ffffff"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 26,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f4f4f4",
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  micButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  micButtonRecording: {
    backgroundColor: "#e6491e",
    borderRadius: 20,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1a1a1a",
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e6491e",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#f0f0f0",
  },
});
