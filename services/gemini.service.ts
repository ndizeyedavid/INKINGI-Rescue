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

interface IncidentReportDraft {
  title: string;
  description: string;
}

interface ResponderBrief {
  priority: "Critical" | "High" | "Medium" | "Low";
  risks: string[];
  bring: string[];
  firstActions: string[];
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

  /**
   * Generate emergency-specific safety tips
   */
  async generateEmergencyTips(emergencyData: {
    type: string;
    title: string;
    description: string;
    address: string;
  }): Promise<string[]> {
    try {
      const prompt = `Based on this emergency situation, provide 5 specific, actionable safety tips:

Emergency Type: ${emergencyData.type}
Title: ${emergencyData.title}
Description: ${emergencyData.description}
Location: ${emergencyData.address}

Provide exactly 5 numbered tips that are:
1. Specific to this emergency type and situation
2. Immediately actionable
3. Prioritized by importance (most critical first)
4. Clear and concise (one sentence each)
5. Focused on safety and survival

Format your response as a numbered list (1. 2. 3. 4. 5.) with no additional text before or after the list.`;

      const model = genAI.getGenerativeModel({
        model: this.modelName,
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        },
      });

      const responseText = result.response.text() || "";

      // Parse the numbered list into an array
      const tips = responseText
        .split("\n")
        .filter((line) => line.trim().match(/^\d+\./))
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((tip) => tip.length > 0);

      return tips.length > 0
        ? tips
        : [
            "Stay calm and assess the situation carefully.",
            "Call emergency services (112) immediately if needed.",
            "Ensure your own safety before helping others.",
            "Follow instructions from emergency responders.",
            "Keep emergency contacts readily available.",
          ];
    } catch (error) {
      console.error("Error generating emergency tips:", error);
      // Return fallback tips
      return [
        "Stay calm and assess the situation carefully.",
        "Call emergency services (112) immediately if needed.",
        "Ensure your own safety before helping others.",
        "Follow instructions from emergency responders.",
        "Keep emergency contacts readily available.",
      ];
    }
  }

  async generateIncidentReportDraft(input: {
    type: string;
    location: string;
    userNotes: string;
    preferredLanguage?: string;
  }): Promise<IncidentReportDraft> {
    try {
      const prompt = `Create a concise, high-quality emergency incident report draft based on the user's notes.

Emergency Type: ${input.type}
Location: ${input.location}
User Notes: ${input.userNotes}
Preferred Language: ${input.preferredLanguage || "English"}

Return ONLY valid JSON with exactly these keys:
{
  "title": string,
  "description": string
}

Rules:
- Title: max 10 words, clear and specific.
- Description: 4-8 lines, structured and actionable, include severity cues if present, avoid medical diagnosis, and include what help is needed.
- Do not include markdown, code fences, or extra keys.`;

      const model = genAI.getGenerativeModel({
        model: this.modelName,
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 512,
        },
      });

      const raw = (result.response.text() || "").trim();

      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}");
      const maybeJson =
        jsonStart >= 0 && jsonEnd > jsonStart
          ? raw.slice(jsonStart, jsonEnd + 1)
          : raw;

      const parsed = JSON.parse(maybeJson) as Partial<IncidentReportDraft>;

      const title = typeof parsed.title === "string" ? parsed.title.trim() : "";
      const description =
        typeof parsed.description === "string" ? parsed.description.trim() : "";

      if (!title || !description) {
        return {
          title: title || `${input.type} Emergency`,
          description: description || input.userNotes.trim(),
        };
      }

      return { title, description };
    } catch (error) {
      console.error("Error generating incident report draft:", error);
      return {
        title: `${input.type} Emergency`,
        description: input.userNotes.trim(),
      };
    }
  }

  async generateResponderBrief(input: {
    type: string;
    title: string;
    description: string;
    address: string;
    status?: string;
    preferredLanguage?: string;
  }): Promise<ResponderBrief> {
    try {
      const prompt = `You are assisting a responder/volunteer.

Emergency Type: ${input.type}
Title: ${input.title}
Description: ${input.description}
Location: ${input.address}
Status: ${input.status || "unknown"}
Preferred Language: ${input.preferredLanguage || "English"}

Return ONLY valid JSON with exactly these keys:
{
  "priority": "Critical" | "High" | "Medium" | "Low",
  "risks": string[],
  "bring": string[],
  "firstActions": string[]
}

Rules:
- Keep each list item short (max ~8 words).
- risks: 2-4 items.
- bring: 3-6 items.
- firstActions: 3-6 items.
- No markdown, no code fences, no extra keys.`;

      const model = genAI.getGenerativeModel({
        model: this.modelName,
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 700,
        },
      });

      const raw = (result.response.text() || "").trim();
      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}");
      const maybeJson =
        jsonStart >= 0 && jsonEnd > jsonStart
          ? raw.slice(jsonStart, jsonEnd + 1)
          : raw;

      const parsed = JSON.parse(maybeJson) as Partial<ResponderBrief>;

      const priority =
        parsed.priority === "Critical" ||
        parsed.priority === "High" ||
        parsed.priority === "Medium" ||
        parsed.priority === "Low"
          ? parsed.priority
          : "Medium";

      const risks = Array.isArray(parsed.risks)
        ? parsed.risks.filter((x) => typeof x === "string").map((x) => x.trim())
        : [];
      const bring = Array.isArray(parsed.bring)
        ? parsed.bring.filter((x) => typeof x === "string").map((x) => x.trim())
        : [];
      const firstActions = Array.isArray(parsed.firstActions)
        ? parsed.firstActions
            .filter((x) => typeof x === "string")
            .map((x) => x.trim())
        : [];

      if (
        risks.length === 0 ||
        bring.length === 0 ||
        firstActions.length === 0
      ) {
        return {
          priority,
          risks: risks.length
            ? risks.slice(0, 4)
            : ["Scene hazards", "Crowd control"],
          bring: bring.length
            ? bring.slice(0, 6)
            : ["Phone", "Gloves", "First-aid kit"],
          firstActions: firstActions.length
            ? firstActions.slice(0, 6)
            : ["Call emergency services", "Assess safety", "Provide basic aid"],
        };
      }

      return {
        priority,
        risks: risks.slice(0, 4),
        bring: bring.slice(0, 6),
        firstActions: firstActions.slice(0, 6),
      };
    } catch (error) {
      console.error("Error generating responder brief:", error);
      return {
        priority: "Medium",
        risks: ["Scene hazards", "Crowd control"],
        bring: ["Phone", "Gloves", "First-aid kit"],
        firstActions: [
          "Call emergency services",
          "Assess safety",
          "Provide basic aid",
        ],
      };
    }
  }
}

export const geminiService = new GeminiService();
