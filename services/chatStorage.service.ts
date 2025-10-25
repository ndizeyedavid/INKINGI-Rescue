import AsyncStorage from "@react-native-async-storage/async-storage";

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

const CHAT_HISTORY_KEY = "@emergency_ai_chat_history";
const CURRENT_CHAT_KEY = "@emergency_ai_current_chat";

export class ChatStorageService {
  // Save chat history to AsyncStorage
  async saveChatHistory(chatHistory: ChatHistory[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(chatHistory);
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, jsonValue);
    } catch (error) {
      console.error("Error saving chat history:", error);
      throw error;
    }
  }

  // Load chat history from AsyncStorage
  async loadChatHistory(): Promise<ChatHistory[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      if (jsonValue != null) {
        const history = JSON.parse(jsonValue);
        // Convert timestamp strings back to Date objects
        return history.map((chat: any) => ({
          ...chat,
          timestamp: new Date(chat.timestamp),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error loading chat history:", error);
      return [];
    }
  }

  // Save current chat session
  async saveCurrentChat(
    messages: Message[],
    chatId: string
  ): Promise<void> {
    try {
      const currentChat = {
        chatId,
        messages,
        lastUpdated: new Date().toISOString(),
      };
      const jsonValue = JSON.stringify(currentChat);
      await AsyncStorage.setItem(CURRENT_CHAT_KEY, jsonValue);
    } catch (error) {
      console.error("Error saving current chat:", error);
      throw error;
    }
  }

  // Load current chat session
  async loadCurrentChat(): Promise<{
    chatId: string;
    messages: Message[];
  } | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(CURRENT_CHAT_KEY);
      if (jsonValue != null) {
        const currentChat = JSON.parse(jsonValue);
        return {
          chatId: currentChat.chatId,
          messages: currentChat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        };
      }
      return null;
    } catch (error) {
      console.error("Error loading current chat:", error);
      return null;
    }
  }

  // Delete a specific chat from history
  async deleteChat(chatId: string): Promise<void> {
    try {
      const history = await this.loadChatHistory();
      const updatedHistory = history.filter((chat) => chat.id !== chatId);
      await this.saveChatHistory(updatedHistory);
    } catch (error) {
      console.error("Error deleting chat:", error);
      throw error;
    }
  }

  // Clear all chat history
  async clearAllHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
      await AsyncStorage.removeItem(CURRENT_CHAT_KEY);
    } catch (error) {
      console.error("Error clearing chat history:", error);
      throw error;
    }
  }

  // Add a new chat to history
  async addChatToHistory(chat: ChatHistory): Promise<void> {
    try {
      const history = await this.loadChatHistory();
      const updatedHistory = [chat, ...history];
      await this.saveChatHistory(updatedHistory);
    } catch (error) {
      console.error("Error adding chat to history:", error);
      throw error;
    }
  }

  // Update an existing chat in history
  async updateChatInHistory(chatId: string, updatedChat: ChatHistory): Promise<void> {
    try {
      const history = await this.loadChatHistory();
      const updatedHistory = history.map((chat) =>
        chat.id === chatId ? updatedChat : chat
      );
      await this.saveChatHistory(updatedHistory);
    } catch (error) {
      console.error("Error updating chat in history:", error);
      throw error;
    }
  }
}

export const chatStorageService = new ChatStorageService();
