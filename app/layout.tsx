import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const editorial = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-editorial",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex",
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
      className={`${editorial.variable} ${plex.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-foam">{children}</body>
    </html>
  );
}
