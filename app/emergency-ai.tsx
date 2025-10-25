import ChatDrawer from "@/components/ai/ChatDrawer";
import ChatHeader from "@/components/ai/ChatHeader";
import ChatInput from "@/components/ai/ChatInput";
import ChatMessage from "@/components/ai/ChatMessage";
import SuggestionPills from "@/components/ai/SuggestionPills";
import TypingIndicator from "@/components/ai/TypingIndicator";
import WelcomeMessage from "@/components/ai/WelcomeMessage";
import { chatStorageService } from "@/services/chatStorage.service";
import { geminiService } from "@/services/gemini.service";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

export default function EmergencyAI() {
  const { i18n } = useTranslation();

  const initialMessage: Message = {
    id: "welcome",
    text: "", // Empty text for welcome message
    isUser: false,
    timestamp: new Date(),
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("current");
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const streamingTextRef = useRef<string>("");

  const suggestions = [
    { id: "1", text: "Medical Emergency", icon: "medical" },
    { id: "2", text: "Fire Safety", icon: "flame" },
    { id: "3", text: "Car Accident", icon: "car" },
    { id: "4", text: "First Aid", icon: "fitness" },
    { id: "5", text: "Flood Safety", icon: "water" },
    { id: "6", text: "Earthquake Tips", icon: "warning" },
    { id: "7", text: "CPR Instructions", icon: "heart" },
    { id: "8", text: "Emergency Contacts", icon: "call" },
  ];

  // Load chat history and current chat on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save current chat whenever messages change
  useEffect(() => {
    if (!isLoading && messages.length > 1) {
      chatStorageService.saveCurrentChat(messages, currentChatId);
    }
  }, [messages, currentChatId, isLoading]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Load chat history
      const history = await chatStorageService.loadChatHistory();
      setChatHistory(history);

      // Load current chat session if exists
      const currentChat = await chatStorageService.loadCurrentChat();
      if (currentChat && currentChat.messages.length > 1) {
        setMessages(currentChat.messages);
        setCurrentChatId(currentChat.chatId);

        // Restore Gemini chat session with history
        const geminiHistory = currentChat.messages
          .filter((msg) => msg.id !== "1") // Skip initial message
          .map((msg) => ({
            role: msg.isUser ? ("user" as const) : ("model" as const),
            parts: [{ text: msg.text }],
          }));

        if (geminiHistory.length > 0) {
          await geminiService.loadChatHistory(geminiHistory);
        }
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      Alert.alert("Error", "Failed to load chat history");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async () => {
    if (inputText.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    Keyboard.dismiss();

    // Show typing indicator
    setIsTyping(true);
    streamingTextRef.current = "";

    try {
      // Create a temporary message ID for the streaming response
      const aiMessageId = (Date.now() + 1).toString();

      // Use streaming for real-time response
      await geminiService.sendMessageStream(
        userMessage.text,
        (chunk: string) => {
          // chunk already contains the full accumulated text
          streamingTextRef.current = chunk;

          // Update the AI message in real-time
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (
              lastMessage &&
              !lastMessage.isUser &&
              lastMessage.id === aiMessageId
            ) {
              // Update existing streaming message
              return [
                ...prev.slice(0, -1),
                {
                  ...lastMessage,
                  text: chunk,
                },
              ];
            } else {
              // Create new streaming message
              return [
                ...prev,
                {
                  id: aiMessageId,
                  text: chunk,
                  isUser: false,
                  timestamp: new Date(),
                },
              ];
            }
          });
        }
      );

      setIsTyping(false);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setIsTyping(false);

      // Show fallback error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting right now. Please ensure you have an internet connection and try again. For immediate emergencies, please call 911 or your local emergency number.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Microphone button disabled - voice input not available
  const handleMicPress = async () => {
    Alert.alert(
      "Voice Input Unavailable",
      "Please type your emergency message in the text field below."
    );
  };

  const handleSuggestionPress = (suggestionText: string) => {
    setInputText(suggestionText);
  };

  const getConversationTitle = (): string => {
    if (messages.length === 1) {
      return "INKINGI AI";
    }

    // Get the first user message to generate a title
    const firstUserMessage = messages.find((m) => m.isUser);
    if (firstUserMessage) {
      const text = firstUserMessage.text;
      // Extract key emergency type from the message
      if (text.toLowerCase().includes("medical") || text.includes("🚑")) {
        return "Medical Emergency";
      } else if (text.toLowerCase().includes("fire") || text.includes("🔥")) {
        return "Fire Safety";
      } else if (
        text.toLowerCase().includes("accident") ||
        text.includes("🚗")
      ) {
        return "Car Accident";
      } else if (
        text.toLowerCase().includes("first aid") ||
        text.includes("💊")
      ) {
        return "First Aid";
      } else if (text.toLowerCase().includes("flood") || text.includes("🌊")) {
        return "Flood Safety";
      } else if (
        text.toLowerCase().includes("earthquake") ||
        text.includes("⚡")
      ) {
        return "Earthquake Tips";
      } else if (text.toLowerCase().includes("cpr") || text.includes("🏥")) {
        return "CPR Instructions";
      } else if (
        text.toLowerCase().includes("contact") ||
        text.includes("☎️")
      ) {
        return "Emergency Contacts";
      } else {
        // Use first few words of the message
        const words = text.split(" ").slice(0, 3).join(" ");
        return words.length > 20 ? words.substring(0, 20) + "..." : words;
      }
    }

    return "INKINGI AI";
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const startNewChat = async () => {
    try {
      // Save current chat to history if it has messages beyond the initial one
      if (messages.length > 1) {
        const newHistory: ChatHistory = {
          id: currentChatId,
          title: getConversationTitle(),
          lastMessage: messages[messages.length - 1].text,
          timestamp: new Date(),
          messages: messages,
        };

        await chatStorageService.addChatToHistory(newHistory);
        setChatHistory([newHistory, ...chatHistory]);
      }

      // Reset Gemini chat session
      geminiService.resetChat();
      await geminiService.startNewChat();

      // Reset to new chat
      setMessages([initialMessage]);
      const newChatId = Date.now().toString();
      setCurrentChatId(newChatId);
      await chatStorageService.saveCurrentChat([initialMessage], newChatId);

      toggleDrawer();
    } catch (error) {
      console.error("Error starting new chat:", error);
      Alert.alert("Error", "Failed to start new chat");
    }
  };

  const loadChat = async (chat: ChatHistory) => {
    try {
      // Save current chat first if it has messages
      if (messages.length > 1 && currentChatId !== chat.id) {
        const currentHistory: ChatHistory = {
          id: currentChatId,
          title: getConversationTitle(),
          lastMessage: messages[messages.length - 1].text,
          timestamp: new Date(),
          messages: messages,
        };

        await chatStorageService.updateChatInHistory(
          currentChatId,
          currentHistory
        );
        setChatHistory([
          currentHistory,
          ...chatHistory.filter((h) => h.id !== currentChatId),
        ]);
      }

      // Load selected chat
      setMessages(chat.messages);
      setCurrentChatId(chat.id);
      await chatStorageService.saveCurrentChat(chat.messages, chat.id);

      // Restore Gemini chat session with history
      const geminiHistory = chat.messages
        .filter((msg) => msg.id !== "1") // Skip initial message
        .map((msg) => ({
          role: msg.isUser ? ("user" as const) : ("model" as const),
          parts: [{ text: msg.text }],
        }));

      geminiService.resetChat();
      if (geminiHistory.length > 0) {
        await geminiService.loadChatHistory(geminiHistory);
      } else {
        await geminiService.startNewChat();
      }

      toggleDrawer();
    } catch (error) {
      console.error("Error loading chat:", error);
      Alert.alert("Error", "Failed to load chat");
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await chatStorageService.deleteChat(chatId);
      setChatHistory(chatHistory.filter((h) => h.id !== chatId));
    } catch (error) {
      console.error("Error deleting chat:", error);
      Alert.alert("Error", "Failed to delete chat");
    }
  };

  // Fallback function (not used with Gemini, kept for reference)
  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes("medical") || input.includes("🚑")) {
      return "For medical emergencies:\n\n1. Call emergency services immediately (911 or local emergency number)\n2. Stay calm and assess the situation\n3. Check if the person is breathing\n4. Apply first aid if trained\n5. Don't move the person unless necessary\n\nWhat specific medical emergency are you dealing with?";
    } else if (input.includes("fire") || input.includes("🔥")) {
      return "Fire Safety Protocol:\n\n1. Alert everyone - shout 'FIRE!'\n2. Activate fire alarm if available\n3. Evacuate immediately\n4. Stay low to avoid smoke\n5. Feel doors before opening\n6. Use stairs, never elevators\n7. Call fire department once safe\n\nDo you need evacuation guidance?";
    } else if (input.includes("accident") || input.includes("🚗")) {
      return "Car Accident Response:\n\n1. Ensure scene safety\n2. Call emergency services\n3. Check for injuries\n4. Turn off vehicles if safe\n5. Set up warning triangles\n6. Don't move injured unless danger\n7. Exchange information\n\nIs anyone injured?";
    } else if (input.includes("first aid") || input.includes("💊")) {
      return "First Aid Basics:\n\n• Bleeding: Apply pressure, elevate\n• Burns: Cool water, cover loosely\n• Choking: Heimlich maneuver\n• Shock: Lay down, elevate legs\n• Fractures: Immobilize, don't move\n\nWhat type of first aid do you need?";
    } else if (input.includes("flood") || input.includes("🌊")) {
      return "Flood Safety:\n\n1. Move to higher ground immediately\n2. Avoid walking/driving through water\n3. Turn off utilities if time permits\n4. Don't touch electrical equipment\n5. Listen to emergency broadcasts\n6. Evacuate if ordered\n\nAre you currently in a flood zone?";
    } else if (input.includes("earthquake") || input.includes("⚡")) {
      return "Earthquake Safety:\n\nDURING:\n• Drop, Cover, Hold On\n• Stay away from windows\n• If outside, move to open area\n\nAFTER:\n• Check for injuries\n• Inspect for damage\n• Expect aftershocks\n• Listen to emergency info\n\nAre you experiencing an earthquake now?";
    } else if (input.includes("cpr") || input.includes("🏥")) {
      return "CPR Instructions:\n\n1. Check responsiveness\n2. Call emergency services\n3. Position on firm surface\n4. Hand placement: center of chest\n5. Compress 2 inches deep\n6. Rate: 100-120 per minute\n7. 30 compressions, 2 breaths\n8. Continue until help arrives\n\n⚠️ If untrained, do hands-only CPR!\n\nIs someone unconscious?";
    } else if (input.includes("contact") || input.includes("☎️")) {
      return "Emergency Contacts:\n\n🚨 General Emergency: 911\n🚑 Ambulance: 912\n🚒 Fire Department: 912\n👮 Police: 112\n☎️ Poison Control: 1-800-222-1222\n\nSave these numbers in your phone!\n\nDo you need to report an emergency now?";
    } else if (input.includes("help") || input.includes("assist")) {
      return "I can help you with:\n\n• Medical emergencies\n• Fire safety protocols\n• Accident response\n• First aid instructions\n• Natural disaster guidance\n• CPR steps\n• Emergency contacts\n\nWhat emergency situation do you need help with?";
    } else {
      return "I understand you need assistance. Could you please provide more details about the emergency situation? You can also use the suggestion pills above to quickly access common emergency topics.\n\nIs this a life-threatening emergency? If yes, please call 911 immediately!";
    }
  };

  return (
    <View style={styles.container}>
      <ChatHeader
        title={getConversationTitle()}
        onMenuPress={toggleDrawer}
        onNewChatPress={startNewChat}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        >
          {messages.map((message) => {
            // Show welcome component for initial message
            if (message.id === "welcome") {
              return <WelcomeMessage key={message.id} />;
            }
            return <ChatMessage key={message.id} message={message} />;
          })}

          {isTyping && <TypingIndicator />}
        </ScrollView>

        <SuggestionPills
          suggestions={suggestions}
          onSuggestionPress={handleSuggestionPress}
          visible={messages.length === 1}
        />

        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          onMicPress={handleMicPress}
          isRecording={isRecording}
        />
      </KeyboardAvoidingView>

      <ChatDrawer
        visible={drawerVisible}
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onClose={toggleDrawer}
        onNewChat={startNewChat}
        onLoadChat={loadChat}
        onDeleteChat={deleteChat}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
});
