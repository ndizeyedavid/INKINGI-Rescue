import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: any[];
}

interface ChatDrawerProps {
  visible: boolean;
  chatHistory: ChatHistory[];
  currentChatId: string;
  onClose: () => void;
  onNewChat: () => void;
  onLoadChat: (chat: ChatHistory) => void;
  onDeleteChat: (chatId: string) => void;
}

export default function ChatDrawer({
  visible,
  chatHistory,
  currentChatId,
  onClose,
  onNewChat,
  onLoadChat,
  onDeleteChat,
}: ChatDrawerProps) {
  const drawerAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(drawerAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, drawerAnim]);

  const formatChatTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalSafeArea}>
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View
            style={[
              styles.drawer,
              {
                transform: [{ translateX: drawerAnim }],
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Chat History</Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color="#1a1a1a" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.newChatButton}
              onPress={onNewChat}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={24} color="#ffffff" />
              <Text style={styles.newChatText}>Start New Chat</Text>
            </TouchableOpacity>

            <ScrollView
              style={styles.chatHistoryList}
              showsVerticalScrollIndicator={false}
            >
              {chatHistory.length === 0 ? (
                <View style={styles.emptyHistory}>
                  <Ionicons
                    name="chatbubbles-outline"
                    size={48}
                    color="#cccccc"
                  />
                  <Text style={styles.emptyHistoryText}>
                    No chat history yet
                  </Text>
                  <Text style={styles.emptyHistorySubtext}>
                    Start a conversation to see it here
                  </Text>
                </View>
              ) : (
                chatHistory.map((chat) => (
                  <TouchableOpacity
                    key={chat.id}
                    style={[
                      styles.chatHistoryItem,
                      currentChatId === chat.id &&
                        styles.chatHistoryItemActive,
                    ]}
                    onPress={() => onLoadChat(chat)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.chatHistoryIcon}>
                      <Ionicons name="chatbubble" size={20} color="#e6491e" />
                    </View>
                    <View style={styles.chatHistoryContent}>
                      <Text style={styles.chatHistoryTitle} numberOfLines={1}>
                        {chat.title}
                      </Text>
                      <Text
                        style={styles.chatHistoryMessage}
                        numberOfLines={2}
                      >
                        {chat.lastMessage}
                      </Text>
                      <Text style={styles.chatHistoryTime}>
                        {formatChatTime(chat.timestamp)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteChatButton}
                      onPress={() => onDeleteChat(chat.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#999999"
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalSafeArea: {
    flex: 1,
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    paddingVertical: 35,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e6491e",
    margin: 16,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  newChatText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  chatHistoryList: {
    flex: 1,
  },
  emptyHistory: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyHistoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
    marginTop: 16,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: "#999999",
    marginTop: 8,
    textAlign: "center",
  },
  chatHistoryItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "flex-start",
  },
  chatHistoryItemActive: {
    backgroundColor: "#fff5f2",
  },
  chatHistoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff5f2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  chatHistoryContent: {
    flex: 1,
  },
  chatHistoryTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  chatHistoryMessage: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
    marginBottom: 4,
  },
  chatHistoryTime: {
    fontSize: 11,
    color: "#999999",
  },
  deleteChatButton: {
    padding: 8,
  },
});
