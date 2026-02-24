"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, QrCode } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/features", label: "Features" },
    { href: "/contact", label: "Contact" },
  ];

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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 rounded-xl hover:bg-slate-50 transition-all">
              Login
            </Link>
            <Link href="/signup"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
              Sign Up
            </Link>
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
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              {label}
            </Link>
          ))}
          <div className="pt-2 pb-1 border-t border-slate-100 flex flex-col gap-2 mt-2">
            <Link href="/login" onClick={() => setIsOpen(false)}
              className="block text-center py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all">
              Login
            </Link>
            <Link href="/signup" onClick={() => setIsOpen(false)}
              className="block text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}