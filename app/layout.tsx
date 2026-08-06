import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import { AuthProvider } from "../context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
});

export const metadata: Metadata = {
  title: "KhetSaathi - AI-Powered Smart Farming Platform",
  description:
    "Empowering Indian farmers with real-time AI crop disease detection, satellite precision irrigation, and mandi price intelligence in English, Hindi, and Marathi.",
  keywords: [
    "KhetSaathi",
    "Smart Farming",
    "AI Agriculture",
    "Indian Farmers",
    "Crop Disease Scanner",
    "Precision Irrigation",
    "Mandi Price Prediction",
    "खेतीसाथी",
    "शेतीसाथी",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSansDevanagari.variable} scroll-smooth dark`}
    >
      <body className="bg-slate-950 text-slate-100 font-sans min-h-screen antialiased selection:bg-emerald-500 selection:text-slate-950">
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
