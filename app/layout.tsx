import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Mono, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "Andrew — Detail",
  description: "A cinematic film of one car being detailed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-bone">{children}</body>
    </html>
  );
}
