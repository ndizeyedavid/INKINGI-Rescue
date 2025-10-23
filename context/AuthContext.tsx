import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, userApi } from '@/services/api';
import { USE_MOCK_AUTH } from '@/config/api.config';
import { mockAuthService } from '@/services/api/mockAuth.service';

interface User {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  bloodType?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string, phoneNumber?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already signed in
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // Check for stored token
      const token = await AsyncStorage.getItem("authToken");
      
      if (token) {
        // Validate token by fetching user profile
        const response = USE_MOCK_AUTH
          ? await mockAuthService.getProfile()
          : await userApi.getProfile();
        
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          // Token is invalid, clear it
          await clearAuthData();
        }
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Use mock auth if enabled
      const response = USE_MOCK_AUTH 
        ? await mockAuthService.login(email, password)
        : await authApi.login(email, password);

      if (response.success && response.data) {
        const { token, refreshToken, user: userData } = response.data;

        // Store tokens securely
        await AsyncStorage.setItem("authToken", token);
        if (refreshToken) {
          await AsyncStorage.setItem("refreshToken", refreshToken);
        }
        
        // Store user data
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        
        // Update state
        setUser(userData);

        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || "Invalid email or password" 
        };
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      return { 
        success: false, 
        error: error.message || "Failed to sign in. Please try again." 
      };
    }
  };

  const signUp = async (
    name: string, 
    email: string, 
    password: string,
    phoneNumber?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Split name into firstName and lastName
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || firstName;

      // Use mock auth if enabled
      const response = USE_MOCK_AUTH
        ? await mockAuthService.register({ name, email, password, phoneNumber: phoneNumber || "" })
        : await authApi.register({ 
            firstName, 
            lastName, 
            email, 
            password, 
            phoneNumber: phoneNumber || "" 
          });

      if (response.success && response.data) {
        const { token, refreshToken, user: userData } = response.data;

        // Store tokens securely
        await AsyncStorage.setItem("authToken", token);
        if (refreshToken) {
          await AsyncStorage.setItem("refreshToken", refreshToken);
        }
        
        // Store user data
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        
        // Update state
        setUser(userData);

        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || "Failed to create account" 
        };
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      return { 
        success: false, 
        error: error.message || "Failed to create account. Please try again." 
      };
    }
  };

  const signOut = async () => {
    try {
      // Call logout API
      if (!USE_MOCK_AUTH) {
        await authApi.logout();
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear local data regardless of API call result
      await clearAuthData();
      setUser(null);
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove(["authToken", "refreshToken", "user"]);
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      // Update stored user data
      AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    try {
      const response = USE_MOCK_AUTH
        ? await mockAuthService.getProfile()
        : await userApi.getProfile();
      
      if (response.success && response.data) {
        setUser(response.data);
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        updateUser,
        refreshUser,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
