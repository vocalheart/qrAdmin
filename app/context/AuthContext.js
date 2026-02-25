"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Fetch admin from cookie session
  const fetchAdmin = async () => {
    try {
      const res = await api.get("/admin/me", {
        withCredentials: true, // 🔥 MUST for cookie
      });

      if (res.data?.success) {
        setAdmin(res.data.admin);
      } else {
        setAdmin(null);
      }
    } catch (error) {
      // 401 = not logged in (normal case)
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Auto session check on app load
  useEffect(() => {
    fetchAdmin();
  }, []);

  // 🔐 LOGIN (Production Safe)
  const login = async (email, password) => {
    try {
      setLoading(true);

      const res = await api.post(
        "/admin/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data?.success) {
        // 🔥 IMPORTANT: wait for cookie to be stored
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Fetch fresh admin from cookie session
        const meRes = await api.get("/admin/me", {
          withCredentials: true,
        });

        if (meRes.data?.success) {
          setAdmin(meRes.data.admin);
          return { success: true };
        }
      }

      return { success: false, message: "Login failed" };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Authentication failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await api.post(
        "/admin/logout",
        {},
        { withCredentials: true }
      );
      setAdmin(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        isAuthenticated: !!admin,
        refreshSession: fetchAdmin, // manual refresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);