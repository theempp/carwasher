import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { MotionProvider } from "./components/MotionProvider";
import { SmoothScroll } from "./components/SmoothScroll";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-instrument-sans",
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
      className={`${instrumentSerif.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-panel-fg">
        <SmoothScroll />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
