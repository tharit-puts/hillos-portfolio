import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Silkscreen } from "next/font/google";
import { profile } from "@/content/profile";
import "./globals.css";

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-silkscreen",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: `HillOS — ${profile.name}, ${profile.role}`,
  description: `Portfolio of ${profile.name} (${profile.nickname}), ${profile.role} in ${profile.location}.`,
};

export const viewport: Viewport = {
  themeColor: "#cbc4f3",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${silkscreen.variable} ${jetbrains.variable}`}>
      <body className="font-mono antialiased">{children}</body>
    </html>
  );
}
