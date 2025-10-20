import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PanicButton {
  id: string;
  type: string;
  trigger: string;
  mode: string;
  icon: string;
  color: string;
}

const STORAGE_KEY = "@panic_buttons";

/**
 * Simple storage utility for panic buttons using AsyncStorage
 */
export const panicButtonsStorage = {
  /**
   * Get all panic buttons
   */
  async getButtons(): Promise<PanicButton[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading panic buttons:", error);
      return [];
    }
  },

  /**
   * Save a new panic button
   */
  async saveButton(button: Omit<PanicButton, "id">): Promise<PanicButton> {
    try {
      const buttons = await this.getButtons();
      const newButton: PanicButton = {
        ...button,
        id: Date.now().toString(),
      };
      buttons.push(newButton);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(buttons));
      return newButton;
    } catch (error) {
      console.error("Error saving panic button:", error);
      throw error;
    }
  },

  /**
   * Update an existing panic button
   */
  async updateButton(id: string, updates: Partial<Omit<PanicButton, "id">>): Promise<void> {
    try {
      const buttons = await this.getButtons();
      const index = buttons.findIndex((b) => b.id === id);
      if (index !== -1) {
        buttons[index] = { ...buttons[index], ...updates };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(buttons));
      }
    } catch (error) {
      console.error("Error updating panic button:", error);
      throw error;
    }
  },

  /**
   * Delete a panic button
   */
  async deleteButton(id: string): Promise<void> {
    try {
      const buttons = await this.getButtons();
      const filtered = buttons.filter((b) => b.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting panic button:", error);
      throw error;
    }
  },

  /**
   * Get a single panic button by ID
   */
  async getButtonById(id: string): Promise<PanicButton | null> {
    try {
      const buttons = await this.getButtons();
      return buttons.find((b) => b.id === id) || null;
    } catch (error) {
      console.error("Error getting panic button:", error);
      return null;
    }
  },
};
