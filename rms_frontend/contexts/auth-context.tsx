"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi, type LoginCredentials } from "@/lib/api/auth";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp ? decoded.exp < currentTime : true;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("token");
      if (!token || isTokenExpired(token)) {
        setIsAuthenticated(false);
        setIsLoading(false);
        Cookies.remove("token");
        delete axios.defaults.headers.common["Authorization"];
        // Redirect to login if not on login page
        if (!pathname?.startsWith("/login")) {
          router.push("/login");
        }
        return;
      }

      // Set token in axios headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);

      // If on login page, redirect to dashboard

      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      const { access } = response;

      // Set token with expiration
      Cookies.set("token", access, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Set token in axios headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      setIsAuthenticated(true);

      router.push("/");
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Cookies.remove("token");
      delete axios.defaults.headers.common["Authorization"];
      setIsAuthenticated(false);
      router.push("/login");
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
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
