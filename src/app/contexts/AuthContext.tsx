"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContextType, User } from "@/types/ApiResponse";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // First check localStorage
        const storedData = localStorage.getItem("userData");
        let userData = null;
        
        if (storedData) {
          userData = JSON.parse(storedData);
          setUser(userData);
        }
        
        // Then verify with server
        const response = await axios.get('/api/me');
        if (response.data.success) {
          const serverUser = response.data.user;
          setUser(serverUser);
          localStorage.setItem("userData", JSON.stringify(serverUser));
        } else {
          localStorage.removeItem("userData");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("userData");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
  
    checkAuthStatus();
  }, []);

  // Logout function - doesn't handle navigation
  const logout = async () => {
    try {
      await axios.post('/api/logout');
      localStorage.removeItem("userData");
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem("userData");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
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