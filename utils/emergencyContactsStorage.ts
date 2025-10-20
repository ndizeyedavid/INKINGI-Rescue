import AsyncStorage from "@react-native-async-storage/async-storage";

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

const STORAGE_KEY = "@emergency_contacts";

/**
 * Simple storage utility for emergency contacts using AsyncStorage
 */
export const emergencyContactsStorage = {
  /**
   * Get all emergency contacts
   */
  async getContacts(): Promise<EmergencyContact[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading contacts:", error);
      return [];
    }
  },

  /**
   * Save a new contact
   */
  async saveContact(contact: Omit<EmergencyContact, "id">): Promise<EmergencyContact> {
    try {
      const contacts = await this.getContacts();
      const newContact: EmergencyContact = {
        ...contact,
        id: Date.now().toString(), // Simple ID generation
      };
      contacts.push(newContact);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
      return newContact;
    } catch (error) {
      console.error("Error saving contact:", error);
      throw error;
    }
  },

  /**
   * Update an existing contact
   */
  async updateContact(id: string, updates: Partial<Omit<EmergencyContact, "id">>): Promise<void> {
    try {
      const contacts = await this.getContacts();
      const index = contacts.findIndex((c) => c.id === id);
      if (index !== -1) {
        contacts[index] = { ...contacts[index], ...updates };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    }
  },

  /**
   * Delete a contact
   */
  async deleteContact(id: string): Promise<void> {
    try {
      const contacts = await this.getContacts();
      const filtered = contacts.filter((c) => c.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  },

  /**
   * Get a single contact by ID
   */
  async getContactById(id: string): Promise<EmergencyContact | null> {
    try {
      const contacts = await this.getContacts();
      return contacts.find((c) => c.id === id) || null;
    } catch (error) {
      console.error("Error getting contact:", error);
      return null;
    }
  },
};
