"use client";
import React, { useState } from "react";
import api from "../lib/axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 1: Login - cookie automatically set ho jaayegi browser mein
      const res = await api.post("/admin/login", {
        email: form.email,
        password: form.password,
      });

      if (!res.data?.success) {
        setError(res.data?.message || "Login failed");
        return;
      }

      // Step 2: Admin info localStorage mein save karo (optional, UI ke liye)
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      // Step 3: /me call karke verify karo ki cookie set hui ya nahi
      const meRes = await api.get("/admin/me");

      if (meRes.data?.success) {
             router.replace("/dashboard"); // 🔥 replace better than push
      } else {
        setError("Session verify nahi hua. Dobara try karo.");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      if (err.code === "ERR_NETWORK") {
        setError(" Backend se connect nahi ho pa raha. Check karo ki server chal raha hai aur CORS sahi hai.");
      } else if (err.response?.status === 401) {
        setError("Email ya password galat hai.");
      } else if (err.response) {
        setError(err.response.data?.message || "Authentication failed");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3 font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}