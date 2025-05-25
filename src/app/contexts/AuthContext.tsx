"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContextType } from "@/types/ApiResponse";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {

      // Skipping auth check on public pages (required at initial mounting)
      if (
        window.location.pathname === "/sign-in" ||
        window.location.pathname === "/sign-up"
      ) {
        setIsLoading(false);
        return;
      }

      // rehydrating user from localstorage on initial mount
      // reason -  in some of the pages we will be using {user}, after mounting in rehydration takes time
      // and if that page is immediately forwarding it to sign-in in absence of user,
      // for that we are rehydrating using userData here from localStorage
      const storedUser = localStorage.getItem("userData");
      if(storedUser){
        setUser(JSON.parse(storedUser));
        setIsLoading(false);
        return;
      }

      try {
        console.log("AuthContext: Checking auth status...");
        // we need to make this verification call only if user is logged in
        const response = await axios.get("/api/me", { withCredentials: true });
        console.log("AuthContext: /api/me response:", response.data);

        if (response.data.success) {
          const serverUser = response.data.user;
          console.log("AuthContext: Setting user:", serverUser);
          setUser(serverUser);
          localStorage.setItem("userData", JSON.stringify(response.data.user)); // Persisting user
        } else {
          console.log("AuthContext: No user found, clearing state.");
          setUser(null);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log(
            "AuthContext: Not authenticated (expected on public pages)"
          );
        } else {
          // Log other unexpected errors
          console.error("AuthContext: Auth check error:", error);
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (data: any) => {
    try {
      const response = await axios.post(`/api/sign-in`, data, {
        withCredentials: true,
      });
      console.log("Login response:", response.data);

      if (response.data.success) {
        const userData = response.data.user || response.data.payload; // Handle different response structures
        console.log("Setting user data:", userData);
        setUser(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return {
          success: false,
          message: response.data.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An error occurred during login" };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/logout");
      localStorage.removeItem("userData");
      setUser(null);
      localStorage.removeItem("userData");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("userData");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, isLoading, logout }}>
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
