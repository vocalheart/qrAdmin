"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./components/sidebar/page";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";

export default function ClientLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { loading, isAuthenticated } = useAuth();

  const hideLayoutRoutes = ["/login", "/signup"];
  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  const protectedRoutes = ["/dashboard", "/admin", "/qr", "/settings"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  //  Redirect to login if NOT authenticated
  useEffect(() => {
    if (!loading && isProtectedRoute && !isAuthenticated) {
      router.replace("/login"); // replace instead of push
    }
  }, [loading, isAuthenticated, isProtectedRoute, router]);

  //  Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, pathname, router]);

  //  VERY IMPORTANT: wait until auth check completes
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Checking authentication...
      </div>
    );
  }

  return (
    <>
      {!shouldHideLayout && isAuthenticated && (
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      )}

      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          shouldHideLayout
            ? "ml-0"
            : isAuthenticated
            ? isCollapsed
              ? "ml-0 md:ml-16"
              : "ml-0 md:ml-64"
            : "ml-0"
        }`}
      >
        {!shouldHideLayout && isAuthenticated && <Navbar />}

        <main className="flex-grow p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>

        {!shouldHideLayout && isAuthenticated && <Footer />}
      </div>
    </>
  );
}