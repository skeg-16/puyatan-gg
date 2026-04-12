import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  metadataBase: new URL("https://puyatan-gg.vercel.app"),
  title: "Puyatan.GG",
  description: "Anonymous late-night chat for students and night owls in the Philippines.",
  keywords: ["anonymous chat", "student chat", "late night chat", "Philippines", "Puyatan"],
  openGraph: {
    title: "Puyatan.GG",
    description: "Find a late-night chat buddy, match by vibe, and keep the convo respectful.",
    url: "https://puyatan-gg.vercel.app",
    siteName: "Puyatan.GG",
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Puyatan.GG",
    description: "Anonymous late-night chat for students and night owls in the Philippines.",
  },
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
