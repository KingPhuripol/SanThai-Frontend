import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import TrafficTracker from "@/components/TrafficTracker";
import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata: Metadata = {
  title: "สานไทย — ถักทอภูมิปัญญาไทย สู่โลกดิจิทัล",
  description:
    "แพลตฟอร์มเทคโนโลยีที่เชื่อมงานหัตถกรรมไทยสู่ตลาดยุคใหม่ ด้วยพลัง AI และ Blockchain",
  keywords: "ผ้าไทย, หัตถกรรม, มัดหมี, ขิด, SACIT, สานไทย",
  openGraph: {
    title: "สานไทย — Thai Craft Marketplace",
    description: "Connect Thai textile heritage to the modern market",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&family=Noto+Serif+Thai:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sarabun bg-brand-900 text-brand-950">
        <LanguageProvider>
          <Navbar />
          <TrafficTracker />
          <main className="min-h-screen">{children}</main>
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
