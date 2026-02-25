"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./components/sidebar/page";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";

export default function ClientLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { admin, loading, isAuthenticated } = useAuth();

  // Auth pages jahan layout clean chahiye
  const hideLayoutRoutes = ["/login", "/signup"];
  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  //  Protect dashboard routes
  const protectedRoutes = ["/dashboard", "/admin", "/qr", "/settings"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // ⛔ Redirect if not logged in
  if (!loading && isProtectedRoute && !isAuthenticated) {
    router.push("/login");
    return null;
  }

  // ⏳ Loading state (while checking /admin/me)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Checking authentication...
      </div>
    );
  }

  return (
    <>
      {/*  Sidebar ONLY when logged in AND not auth pages */}
      {!shouldHideLayout && isAuthenticated && (
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      )}

      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          shouldHideLayout
            ? "ml-0"
            : isAuthenticated
            ? isCollapsed
              ? "ml-0 md:ml-16"
              : "ml-0 md:ml-64"
            : "ml-0"
        }`}
      >
        {/* Navbar only when logged */}
        {!shouldHideLayout && isAuthenticated && <Navbar />}

        <main className="flex-grow p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>

        {/* Footer only when logged */}
        {!shouldHideLayout && isAuthenticated && <Footer />}
      </div>
    </>
  );
}