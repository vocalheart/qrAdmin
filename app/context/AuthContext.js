"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  //  Load admin from localStorage instantly (for refresh);
  
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  //  Verify session from cookie
  const fetchAdmin = async () => {
    try {
      const res = await api.get("/admin/me", {
        withCredentials: true,
      });

      if (res.data?.success) {
        setAdmin(res.data.admin);
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
      } else {
        setAdmin(null);
        localStorage.removeItem("admin");
      }
    } catch (error) {
      setAdmin(null);
      localStorage.removeItem("admin");
    } finally {
      setLoading(false);
    }
  };

  //  Auto session check on app load
  useEffect(() => {
    fetchAdmin();
  }, []);

  //  LOGIN
  const login = async (email, password) => {
    try {
      setLoading(true);

      const res = await api.post(
        "/admin/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data?.success) {
        // Save instantly (no flicker on refresh)
        setAdmin(res.data.admin);
        localStorage.setItem("admin", JSON.stringify(res.data.admin));

        return { success: true };
      }

      return { success: false, message: "Login failed" };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Authentication failed",
      };
    } finally {
      setLoading(false);
    }
  };

  //  LOGOUT
  const logout = async () => {
    try {
      await api.post("/admin/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAdmin(null);
      localStorage.removeItem("admin"); //  IMPORTANT
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
        refreshSession: fetchAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);