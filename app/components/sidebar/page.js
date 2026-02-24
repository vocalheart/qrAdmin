"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, QrCode, Star, FileText,
  Menu, X, ChevronLeft, ChevronRight, QrCode as LogoIcon,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard",    path: "/dashboard",    icon: LayoutDashboard },
  { name: "QR Codes",     path: "/generate-qr",  icon: QrCode },
  { name: "Subscription", path: "/subscribe",    icon: FileText },
  { name: "Reviews",      path: "/submissions",  icon: Star },
];

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef(null);

  // Close on outside click (mobile)
  useEffect(() => {
    const handler = (e) => {
      if (mobileOpen && drawerRef.current && !drawerRef.current.contains(e.target))
        setMobileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  // Lock scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const NavLinks = ({ mobile = false }) => {
    const collapsed = isCollapsed && !mobile;
    return (
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {menuItems.map(({ name, path, icon: Icon }) => {
          const active = pathname.startsWith(path);
          return (
            <Link key={path} href={path}
              title={collapsed ? name : undefined}
              className={`flex items-center gap-3 py-2.5 rounded-xl transition-all duration-150 group relative
                ${collapsed ? "justify-center px-2" : "px-3"}
                ${active
                  ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
            >
              <Icon size={20} className={`shrink-0 ${active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
              {!collapsed && <span className="text-sm whitespace-nowrap">{name}</span>}
              {/* Tooltip */}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg transition-opacity">
                  {name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    );
  };

  return (
    <>
      {/* ── Mobile Hamburger (fixed top-left) ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3.5 left-3 z-50 md:hidden p-2.5 rounded-xl bg-white border border-slate-200 shadow-md text-slate-700 hover:bg-slate-50 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Mobile Backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/35 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <aside
        ref={drawerRef}
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 shadow-2xl z-50 flex flex-col md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-slate-900">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <LogoIcon className="w-4 h-4 text-white" />
            </div>
            QrAdmin
          </Link>
          <button onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <NavLinks mobile={true} />
      </aside>

      {/* ── Desktop Sidebar ── */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-100 shadow-sm z-40 hidden md:flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Desktop Header */}
        <div className={`flex items-center h-16 border-b border-slate-100 transition-all duration-300 ${
          isCollapsed ? "justify-center px-2" : "justify-between px-4"
        }`}>
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2 font-extrabold text-slate-900 overflow-hidden">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                <LogoIcon className="w-4 h-4 text-white" />
              </div>
              <span className="whitespace-nowrap text-base">QrAdmin</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        <NavLinks mobile={false} />
      </aside>
    </>
  );
}