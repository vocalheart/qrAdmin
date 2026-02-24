"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "../llb/axios";
import {
  Mail, Lock, Eye, EyeOff, Loader2, QrCode,
  User, ArrowRight, CheckCircle, Star, Phone,
} from "lucide-react";

/* ── Password strength ── */
function getStrength(pwd) {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}
const STRENGTH_LABELS = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
const STRENGTH_COLORS = ["", "bg-red-500", "bg-orange-400", "bg-amber-400", "bg-emerald-500", "bg-emerald-600"];
const STRENGTH_TEXT   = ["", "text-red-500", "text-orange-500", "text-amber-500", "text-emerald-600", "text-emerald-600"];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.username.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Invalid email address.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError("");
    try {
      const { data } = await axios.post("/register", {
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      }, { withCredentials: true });

      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(form.password);
  const passwordsMatch = form.confirm && form.password === form.confirm;

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Account Created!</h2>
          <p className="text-slate-500 text-sm">Redirecting you to login...</p>
          <div className="mt-5 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-1 bg-emerald-500 rounded-full animate-[width_2s_ease-in-out]" style={{ width: "100%", transition: "width 2s" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left Decorative Panel ── */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden flex-col justify-between p-12">
        {/* Background deco */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/15 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/30 rounded-xl flex items-center justify-center border border-indigo-400/30">
              <QrCode className="w-6 h-6 text-indigo-300" />
            </div>
            <span className="text-white font-extrabold text-xl">QrAdmin</span>
          </Link>
        </div>

        {/* Middle content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Star className="w-3.5 h-3.5 fill-indigo-300" />
            FREE 7-DAY TRIAL • JUST ₹2
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Start collecting<br />
            <span className="text-indigo-400">5-star reviews</span><br />
            today
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-10">
            Set up your review funnel in minutes. Your QR code is auto-generated the moment you register.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { step: "1", text: "Create your free account" },
              { step: "2", text: "Customise your QR code" },
              { step: "3", text: "Print & place at your store" },
              { step: "4", text: "Watch your ratings grow 🚀" },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 text-xs font-bold shrink-0">
                  {s.step}
                </div>
                <p className="text-slate-300 text-sm">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-slate-500 text-xs">Trusted by 500+ businesses across India</p>
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="w-full lg:w-3/5 flex items-center justify-center bg-slate-50 px-4 py-10 sm:px-8 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg text-slate-900">QrAdmin</span>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Create your account</h2>
            <p className="text-slate-500 text-sm mt-1">Get started free — no credit card required</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text" name="username" value={form.username} onChange={handleChange}
                    placeholder="Ritesh Kumar" autoComplete="name"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com" autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>

              {/* Phone (optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Phone <span className="text-slate-400 normal-case font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+91 98765 43210" autoComplete="tel"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPwd ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                    placeholder="Min. 6 characters" autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Strength meter */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map((s) => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${strength >= s ? STRENGTH_COLORS[strength] : "bg-slate-100"}`} />
                      ))}
                    </div>
                    <p className={`text-xs font-semibold ${STRENGTH_TEXT[strength]}`}>{STRENGTH_LABELS[strength]}</p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showConfirm ? "text" : "password"} name="confirm" value={form.confirm} onChange={handleChange}
                    placeholder="Repeat your password" autoComplete="new-password"
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      form.confirm
                        ? passwordsMatch
                          ? "border-emerald-300 focus:ring-emerald-200"
                          : "border-red-300 focus:ring-red-200"
                        : "border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {form.confirm && (
                    <div className={`absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs ${
                      passwordsMatch ? "bg-emerald-500" : "bg-red-400"
                    }`}>
                      {passwordsMatch ? "✓" : "✕"}
                    </div>
                  )}
                </div>
                {form.confirm && !passwordsMatch && (
                  <p className="text-red-500 text-xs mt-1.5">Passwords don't match</p>
                )}
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
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-sm mt-1"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                  : <><ArrowRight className="w-4 h-4" /> Create Account</>}
              </button>

              {/* Terms note */}
              <p className="text-center text-xs text-slate-400">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-indigo-600 hover:underline">Terms</Link> &{" "}
                <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
              </p>
            </form>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}