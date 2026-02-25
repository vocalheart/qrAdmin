"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, QrCode, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { admin, logout, isAuthenticated } = useAuth();

  return (
    <nav className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-slate-900 hover:text-indigo-600 transition-colors">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            QrAdmin
          </Link>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all"
                >
                  <UserCircle className="w-8 h-8 text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-700">{admin?.name}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                    <Link href="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); setShowDropdown(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 rounded-xl hover:bg-slate-50 transition-all">
                  Login
                </Link>
                <Link href="/signup"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden border-t border-slate-100 bg-white overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 py-3 space-y-1">
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-4 py-2">
                <UserCircle className="w-8 h-8 text-indigo-600" />
                <span className="text-sm font-semibold text-slate-700">{admin?.name}</span>
              </div>
              <Link href="/dashboard" onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 py-2">
              <Link href="/login" onClick={() => setIsOpen(false)}
                className="block text-center py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all">
                Login
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)}
                className="block text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}