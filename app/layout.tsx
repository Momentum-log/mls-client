import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import QueryProvider from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/providers/toast-provider";
import GuestIDInitializer from "@/components/auth/guest-id-initializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: "Momentum Logistics - Fast & Reliable Logistics Services",
  description:
    "Momentum Logistics provides fast and reliable logistics services. Ship packages, track deliveries, and manage your logistics needs with ease. From local to international shipping, we&apos;ve got you covered",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Momentum Logistics Service",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ToastProvider>
            <GuestIDInitializer />
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
