"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./components/sidebar/page";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function ClientLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Auth pages jahan layout clean chahiye
  const hideLayoutRoutes = ["/login", "/signup"];
  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  return (
    <>
      {/* Sidebar hide on login & signup */}
      {!shouldHideLayout && (
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}

      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          shouldHideLayout
            ? "ml-0"
            : isCollapsed
            ? "ml-0 md:ml-16"
            : "ml-0 md:ml-64"
        }`}
      >
        {/* Navbar hide on login & signup */}
        {!shouldHideLayout && <Navbar />}

        <main className="flex-grow p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>

        {/* Footer hide on login & signup */}
        {!shouldHideLayout && <Footer />}
      </div>
    </>
  );
};




