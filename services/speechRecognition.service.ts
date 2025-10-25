// Voice input is disabled - microphone button hidden
// Users should type their emergency messages

export class SpeechRecognitionService {
  async requestPermissions(): Promise<boolean> {
    return false;
  }

  async startListening(
    language: string = "en-US",
    onResult: (text: string) => void,
    onError: (error: string) => void
  ): Promise<void> {
    onError("Voice input is not available. Please type your message.");
  }

  async stopListening(): Promise<void> {
    // No-op
  }

  getIsListening(): boolean {
    return false;
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
