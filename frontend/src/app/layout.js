import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Import ang Analytics component
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Puyatan-GG",
  description: "Dito ang tambayan ng mga puyatero.", // Pinalitan ko na rin description para mas solid!
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* 2. Ilagay dito ang Analytics para ma-track ang buong app */}
        <Analytics />
      </body>
    </html>
  );
}