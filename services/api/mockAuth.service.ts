/**
 * Mock Authentication Service
 * 
 * This service provides mock authentication for testing without a backend.
 * Set USE_MOCK_AUTH to true in api.config.ts to enable.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock user database
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'test@example.com',
    password: 'password123',
    phoneNumber: '+250788123456',
    location: 'Kigali',
    bloodType: 'O+',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phoneNumber: '+250788654321',
    location: 'Musanze',
    bloodType: 'A+',
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  /**
   * Mock login
   */
  login: async (email: string, password: string) => {
    await delay(1000); // Simulate network delay

    const user = MOCK_USERS.find(u => u.email === email);

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        error: 'Invalid password',
      };
    }

    // Generate mock tokens
    const token = `mock-token-${Date.now()}`;
    const refreshToken = `mock-refresh-${Date.now()}`;

    // Remove password from user object
    const { password: _, ...userData } = user;

    return {
      success: true,
      data: {
        token,
        refreshToken,
        user: userData,
      },
    };
  },

  /**
   * Mock registration
   */
  register: async (data: { name: string; email: string; password: string; phoneNumber: string }) => {
    await delay(1000); // Simulate network delay

    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === data.email);

    if (existingUser) {
      return {
        success: false,
        error: 'Email already registered',
      };
    }

    // Create new user
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      location: 'Kigali',
      bloodType: 'Unknown',
    };

    // Generate mock tokens
    const token = `mock-token-${Date.now()}`;
    const refreshToken = `mock-refresh-${Date.now()}`;

    return {
      success: true,
      data: {
        token,
        refreshToken,
        user: newUser,
      },
    };
  },

  /**
   * Mock get profile
   */
  getProfile: async () => {
    await delay(500);

    // Get stored user data
    const userJson = await AsyncStorage.getItem('user');
    
    if (!userJson) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const user = JSON.parse(userJson);

    return {
      success: true,
      data: user,
    };
  },

  /**
   * Mock logout
   */
  logout: async () => {
    await delay(300);
    return {
      success: true,
    };
  },
};
