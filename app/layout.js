import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./Clientlayout";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QrAdmin | Smart Google Review System",
  description: "Admin Dashboard for Google Review QR Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-slate-50 text-slate-900`}
      >
        <ClientLayout>{children}</ClientLayout>
              <Footer />
      </body>
    </html>
  );
}