import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from "expo-constants";

// Get API key from app config
const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey || "";

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface Content {
  role: "user" | "model";
  parts: { text: string }[];
}

export class GeminiService {
  private modelName = "gemini-flash-lite-latest";
  private chatHistory: Content[] = [];
  private systemInstruction = `You are an Emergency AI Assistant specialized in providing critical emergency guidance and first aid instructions. Your role is to:

1. Provide clear, concise, and actionable emergency response instructions
2. Prioritize life-saving information
3. Always remind users to call emergency services (112 or local emergency number) for serious situations
4. Give step-by-step first aid guidance
5. Remain calm and reassuring in your responses
6. Use simple language that anyone can understand under stress
7. Include safety warnings when appropriate
8. Provide information about fire safety, medical emergencies, natural disasters, CPR, and accident response

IMPORTANT: Always emphasize calling professional emergency services for life-threatening situations. You are a guide, not a replacement for professional medical help.`;

  constructor() {
    this.chatHistory = [];
  }

  async startNewChat(history: ChatMessage[] = []) {
    this.chatHistory = history.length > 0 ? [...history] : [];
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // Add user message to history
      this.chatHistory.push({
        role: "user",
        parts: [{ text: message }],
      });

      const config = {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
        systemInstruction: this.systemInstruction,
      };

      const model = genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: this.systemInstruction,
      });

      const result = await model.generateContent({
        contents: this.chatHistory,
        generationConfig: {
          temperature: config.temperature,
          topP: config.topP,
          topK: config.topK,
          maxOutputTokens: config.maxOutputTokens,
        },
      });

      const responseText = result.response.text() || "";

      // Add model response to history
      this.chatHistory.push({
        role: "model",
        parts: [{ text: responseText }],
      });

      return responseText;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to get response from AI. Please try again.");
    }
  }

  async sendMessageStream(
    message: string,
    onChunk: (text: string) => void
  ): Promise<void> {
    try {
      // Add user message to history
      this.chatHistory.push({
        role: "user",
        parts: [{ text: message }],
      });

      const config = {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
        systemInstruction: this.systemInstruction,
      };

      const model = genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: this.systemInstruction,
      });

      // Get full response (streaming not supported in React Native)
      const result = await model.generateContent({
        contents: this.chatHistory,
        generationConfig: {
          temperature: config.temperature,
          topP: config.topP,
          topK: config.topK,
          maxOutputTokens: config.maxOutputTokens,
        },
      });

      const fullText = result.response.text() || "";

      // Add model response to history
      this.chatHistory.push({
        role: "model",
        parts: [{ text: fullText }],
      });

      // Simulate streaming
      const words = fullText.split(" ");
      let currentText = "";

      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? " " : "") + words[i];
        onChunk(currentText);

        if (i < words.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 30));
        }
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to get response from AI. Please try again.");
    }
  }

  getChatHistory(): ChatMessage[] {
    return this.chatHistory;
  }

  async loadChatHistory(history: ChatMessage[]) {
    await this.startNewChat(history);
  }

  resetChat() {
    this.chatHistory = [];
  }
}

export const geminiService = new GeminiService();
