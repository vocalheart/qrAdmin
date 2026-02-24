"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "../llb/axios";
import {
  Mail, Lock, Eye, EyeOff, Loader2, QrCode,
  ArrowRight, Star, Shield, Zap,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const { data } = await axios.post("/login", form, { withCredentials: true });
      if (data.success) router.push("/dashboard");
      else setError(data.message || "Login failed. Please try again.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <QrCode className="w-5 h-5" />, title: "Smart QR Generator", desc: "Create branded QR codes in seconds" },
    { icon: <Star className="w-5 h-5" />, title: "Review Filtering", desc: "Route unhappy customers privately" },
    { icon: <Shield className="w-5 h-5" />, title: "Reputation Guard", desc: "Protect your Google star rating" },
    { icon: <Zap className="w-5 h-5" />, title: "Real-time Analytics", desc: "Track submissions & ratings live" },
  ];
  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 relative overflow-hidden flex-col justify-between p-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute top-1/3 -right-16 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-white/5 rounded-full" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>
        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight">QrAdmin</span>
          </Link>
        </div>
        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
            Turn every scan into a<br />
            <span className="text-yellow-300">5-star review</span>
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed mb-10">
            The smartest Google Review QR system for businesses that care about reputation.
          </p>
          {/* Feature list */}
          <div className="grid grid-cols-1 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/15">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-indigo-200 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom quote */}
        <div className="relative z-10">
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            ))}
          </div>
          <p className="text-indigo-100 text-sm italic">"Our Google rating went from 3.8 to 4.7 in just 3 weeks!"</p>
          <p className="text-indigo-300 text-xs mt-1">— Rohan S., Restaurant Owner</p>
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg text-slate-900">QrAdmin</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in to your dashboard</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
                  <Link href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                  : <><ArrowRight className="w-4 h-4" /> Sign In</>}
              </button>
            </form>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}