import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Markdown from "react-native-markdown-display";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSpeak = async () => {
    try {
      if (isSpeaking) {
        // Stop speaking
        await Speech.stop();
        setIsSpeaking(false);
        console.log("Stopped speech");
      } else {
        // Remove markdown formatting for better speech
        const cleanText = message.text
          .replace(/[#*_`~\[\]()]/g, "") // Remove markdown symbols
          .replace(/\n+/g, " ") // Replace newlines with spaces
          .replace(/\*\*/g, "") // Remove bold markers
          .replace(/>/g, "") // Remove blockquote markers
          .replace(/\s+/g, " ") // Normalize whitespace
          .trim();

        console.log("=== SPEECH DEBUG ===");
        console.log("Original text length:", message.text.length);
        console.log("Clean text length:", cleanText.length);
        console.log("First 100 chars:", cleanText.substring(0, 100));

        // Check available voices
        const voices = await Speech.getAvailableVoicesAsync();
        console.log("Available voices count:", voices.length);

        // Find an English voice
        const englishVoice =
          voices.find(
            (v) => v.language.startsWith("en") && v.quality === "Enhanced"
          ) || voices.find((v) => v.language.startsWith("en"));

        if (englishVoice) {
          console.log(
            "Using voice:",
            englishVoice.identifier,
            englishVoice.language
          );
        }

        // Start speaking
        setIsSpeaking(true);

        const options = {
          language: "en-US",
          pitch: 1.0,
          rate: 1,
          volume: 1.0,
          voice: englishVoice?.identifier,
          onStart: () => {
            console.log("✅ Speech STARTED successfully!");
          },
          onDone: () => {
            console.log("✅ Speech DONE");
            setIsSpeaking(false);
          },
          onStopped: () => {
            console.log("⚠️ Speech STOPPED");
            setIsSpeaking(false);
          },
          onError: (error: any) => {
            console.error("❌ Speech ERROR:", JSON.stringify(error));
            setIsSpeaking(false);
          },
        };

        console.log("Speech options:", options);
        console.log("Calling Speech.speak()...");

        Speech.speak(cleanText, options);

        console.log("Speech.speak() called");
      }
    } catch (error) {
      console.error("❌ Exception in handleSpeak:", error);
      setIsSpeaking(false);
    }
  };

  return (
    <View
      style={[
        styles.messageWrapper,
        message.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper,
      ]}
    >
      {!message.isUser && (
        <View style={styles.aiAvatar}>
          <Ionicons name="sparkles" size={20} color="#ffffff" />
        </View>
      )}

      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userMessageBubble : styles.aiMessageBubble,
        ]}
      >
        {message.isUser ? (
          <Text style={[styles.messageText, styles.userMessageText]}>
            {message.text}
          </Text>
        ) : (
          <>
            <Markdown style={markdownStyles}>{message.text}</Markdown>
            <TouchableOpacity
              style={styles.speakButton}
              onPress={handleSpeak}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSpeaking ? "stop-circle" : "volume-high"}
                size={18}
                color="#e6491e"
              />
              <Text style={styles.speakButtonText}>
                {isSpeaking ? "Stop" : "Read aloud"}
              </Text>
            </TouchableOpacity>
          </>
        )}
        <Text
          style={[
            styles.timestamp,
            message.isUser ? styles.userTimestamp : styles.aiTimestamp,
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>

      {message.isUser && (
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={20} color="#ffffff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  aiMessageWrapper: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 16,
  },
  userMessageBubble: {
    backgroundColor: "#e6491e",
    borderBottomRightRadius: 4,
  },
  aiMessageBubble: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#ffffff",
  },
  aiMessageText: {
    color: "#1a1a1a",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 6,
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "right",
  },
  aiTimestamp: {
    color: "#999999",
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e6491e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#666666",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  speakButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff5f2",
    borderRadius: 8,
    marginTop: 8,
    alignSelf: "flex-start",
    gap: 6,
  },
  speakButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#e6491e",
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    color: "#1a1a1a",
    fontSize: 15,
    lineHeight: 22,
  },
  heading1: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 12,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 10,
    marginBottom: 6,
  },
  heading3: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginTop: 8,
    marginBottom: 4,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
    color: "#1a1a1a",
    fontSize: 15,
    lineHeight: 22,
  },
  strong: {
    fontWeight: "700",
    color: "#1a1a1a",
  },
  em: {
    fontStyle: "italic",
  },
  bullet_list: {
    marginTop: 4,
    marginBottom: 8,
  },
  ordered_list: {
    marginTop: 4,
    marginBottom: 8,
  },
  list_item: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bullet_list_icon: {
    marginLeft: 0,
    marginRight: 8,
    color: "#e6491e",
    fontSize: 15,
    lineHeight: 22,
  },
  ordered_list_icon: {
    marginLeft: 0,
    marginRight: 8,
    color: "#e6491e",
    fontSize: 15,
    lineHeight: 22,
  },
  code_inline: {
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontFamily: "monospace",
    fontSize: 14,
    color: "#e6491e",
  },
  code_block: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontFamily: "monospace",
    fontSize: 14,
    color: "#1a1a1a",
  },
  fence: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontFamily: "monospace",
    fontSize: 14,
    color: "#1a1a1a",
  },
  blockquote: {
    backgroundColor: "#fff5f2",
    borderLeftWidth: 4,
    borderLeftColor: "#e6491e",
    paddingLeft: 12,
    paddingVertical: 8,
    marginVertical: 8,
  },
  link: {
    color: "#e6491e",
    textDecorationLine: "underline",
  },
  hr: {
    backgroundColor: "#e0e0e0",
    height: 1,
    marginVertical: 12,
  },
});
