/* eslint-disable react-hooks/exhaustive-deps */
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
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  fullName?: string; // Optional full name
  email?: string; // Optional email
  phoneNumber: string; // Required phone number
  role?: string; // Optional role
}

interface SignupData {
  fullName: string;
  email: string;
  phoneNumber: string;
  referralCode?: string;
  role?: string;
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const decoded: { exp: number; id: string; role: string } =
            jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            removeAuthToken();
            setUser(null);
          } else {
            await validateToken(token);
          }
        } catch (error) {
          console.error("Token decode/validation error:", error);
          removeAuthToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${baseUrl}/auth/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Invalid token");
      const userData: User = await response.json();
      // Ensure all fields are set (adjust based on your API response)
      setUser(userData);
    } catch (error) {
      console.error("Token validation error:", error);
      removeAuthToken();
      setUser(null);
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const { fullName, email, phoneNumber, referralCode, role } = data;
      const response = await fetch(`${baseUrl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phoneNumber,
          referralCode,
          role,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }
    } catch (error) {
      throw new Error("Failed to create account");
    }
  };

  const login = async (phoneNumber: string) => {
    try {
      const response = await fetch(`${baseUrl}/users/login/phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send OTP");
      }
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    try {
      const response = await fetch(`${baseUrl}/users/login/phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid OTP");
      }
      const data = await response.json();
      const token = data.token;

      setAuthToken(token);
      await validateToken(token); // Fetch and set user data
    } catch (error) {
      throw error;
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
