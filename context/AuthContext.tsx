import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
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
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        // Here you would typically validate the token with your backend
        // For now, we'll just set a mock user
        setUser({
          id: "1",
          name: "John Doe",
          email: "john@example.com",
        });
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would typically:
    // 1. Validate credentials with your backend
    // 2. Receive a token
    // 3. Store the token securely

    // For demo purposes, we'll just set a mock user
    setUser({
      id: "1",
      name: "John Doe",
      email: email,
    });

    // Store token securely
    await SecureStore.setItemAsync("userToken", "mock-token");
  };

  const signUp = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would typically:
    // 1. Create user account with your backend
    // 2. Receive a token
    // 3. Store the token securely

    // For demo purposes, we'll just set a mock user
    setUser({
      id: "1",
      name: name,
      email: email,
    });

    // Store token securely
    await SecureStore.setItemAsync("userToken", "mock-token");
  };

  const signOut = async () => {
    // Remove token from secure storage
    await SecureStore.deleteItemAsync("userToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        isLoading,
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
