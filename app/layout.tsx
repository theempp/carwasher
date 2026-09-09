import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, Fraunces } from "next/font/google";
import { MotionProvider } from "./components/MotionProvider";
import { SmoothScroll } from "./components/SmoothScroll";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
  variable: "--font-fraunces",
});

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "CtLuxuryDetails",
  description:
    "A scroll-controlled film of one car being washed on a private estate driveway.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-panel-fg">
        <SmoothScroll />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
