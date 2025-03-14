/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getAuthToken, setAuthToken, removeAuthToken } from "@/utils/auth";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  referralCode?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (data: SignupData) => Promise<void>;
  login: (phoneNumber: string) => Promise<void>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      setIsLoading(false);
    } catch (error) {
      removeAuthToken();
      setUser(null);
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const { firstName, lastName, email, phoneNumber, referralCode } = data;
      // Combine firstName and lastName into a single name field if needed
      const name = `${firstName} ${lastName}`;
      // TODO: Implement signup API call with the data
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      throw new Error("Failed to create account");
    }
  };

  const login = async (phoneNumber: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      throw new Error("Failed to send OTP");
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        phoneNumber: phoneNumber,
      };
      const mockToken = "mock-auth-token";
      setAuthToken(mockToken);
      setUser(mockUser);
    } catch (error) {
      throw new Error("Invalid OTP");
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signup,
    login,
    verifyOTP,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}