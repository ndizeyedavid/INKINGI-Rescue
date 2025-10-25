# Gemini AI Integration Setup Guide

## 📋 Overview
This guide will help you set up the Gemini AI integration for the Emergency AI Assistant feature.

## 🔑 Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## ⚙️ Step 2: Configure Environment Variables

### Option 1: Using .env file (Recommended for development)

1. Open the `.env` file in the root directory
2. Replace `your_gemini_api_key_here` with your actual API key:

```env
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

3. The `app.config.js` will automatically load this from the `.env` file

### Option 2: Direct configuration (For testing)

1. Open `app.config.js`
2. Replace the `geminiApiKey` value:

```javascript
extra: {
  geminiApiKey: "YOUR_ACTUAL_API_KEY_HERE",
}
```

⚠️ **IMPORTANT**: Never commit your API key directly in `app.config.js` to version control!

## 📦 Step 3: Install Dependencies

Run the following command to install required packages:

```bash
npm install @google/generative-ai @react-native-async-storage/async-storage react-native-dotenv
```

## 🔄 Step 4: Restart Development Server

After installing dependencies and setting up your API key:

1. Stop your current development server (Ctrl+C)
2. Clear the cache and restart:

```bash
npx expo start -c
```

## ✅ Features Implemented

### 1. **Gemini AI Integration**
- Real-time streaming responses
- Context-aware emergency guidance
- Specialized emergency response system instruction

### 2. **Local Storage with AsyncStorage**
- Chat history persistence
- Current chat session restoration
- Automatic save on every message
- Load previous conversations

### 3. **Chat Management**
- Create new chats
- Load previous chats
- Delete chats
- Auto-save functionality

## 📁 File Structure

```
services/
├── gemini.service.ts          # Gemini AI service
└── chatStorage.service.ts     # AsyncStorage service

app/
└── emergency-ai.tsx           # Main AI chat screen (updated)

components/ai/
├── ChatMessage.tsx
├── ChatHeader.tsx
├── ChatInput.tsx
├── ChatDrawer.tsx
├── SuggestionPills.tsx
└── TypingIndicator.tsx
```

## 🎯 How It Works

### Message Flow:
1. User sends a message
2. Message is saved to AsyncStorage
3. Sent to Gemini API with streaming
4. Response streams back in real-time
5. Full conversation saved locally

### Chat History:
- Automatically loads on app start
- Persists across app restarts
- Maintains Gemini conversation context
- Supports multiple chat sessions

## 🔧 Troubleshooting

### Issue: "API Key not found"
- Ensure `.env` file exists in root directory
- Verify API key is correctly set
- Restart development server with cache clear

### Issue: "Failed to load chat history"
- Check AsyncStorage permissions
- Clear app data and try again
- Check console for specific errors

### Issue: Streaming not working
- Verify internet connection
- Check API key validity
- Ensure Gemini API is not rate-limited

## 🚀 Usage

1. Open the Emergency AI screen
2. Type your emergency question or use suggestion pills
3. Watch the AI response stream in real-time
4. All conversations are automatically saved
5. Access chat history from the side drawer

## 💡 Tips

- The AI is specialized for emergency situations
- Always call 911 for life-threatening emergencies
- Chat history is stored locally on your device
- You can have multiple chat sessions
- Conversations maintain context within each session

## 🔒 Security Notes

- API key is stored in `.env` (not committed to git)
- Chat data is stored locally on device
- No data is sent to third-party servers except Gemini API
- Add `.env` to `.gitignore` to prevent accidental commits

## 📝 Environment Variables

```env
# Required
GEMINI_API_KEY=your_api_key_here

# Optional (with defaults)
# GEMINI_MODEL=gemini-1.5-flash
# GEMINI_TEMPERATURE=0.7
```

---

**Need Help?** Check the [Gemini API Documentation](https://ai.google.dev/docs)
