import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ErrorBoundaryProvider from "@/components/error/ErrorBoundaryProvider";
import NoScriptFallback from "@/components/ui/NoScriptFallback";

export const dynamic = 'force-dynamic';

const montserrat = localFont({
  src: [
    {
      path: "../public/fonts/Montserrat-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../public/fonts/Montserrat-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

const nunito = localFont({
  src: [
    {
      path: "../public/fonts/Nunito-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../public/fonts/Nunito-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AddressMe - Personalized Hong Kong Policy Address Summary",
  description:
    "Get a personalized AI-powered summary of Hong Kong's Policy Address tailored to your circumstances. Understand what policies matter most to you.",
  keywords: [
    "Hong Kong",
    "Policy Address",
    "AI",
    "Personalized",
    "Government",
    "Policies",
  ],
  authors: [{ name: "AddressMe Team" }],
  creator: "AddressMe",
  publisher: "AddressMe",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "AddressMe - Personalized Hong Kong Policy Address Summary",
    description:
      "Get a personalized AI-powered summary of Hong Kong's Policy Address tailored to your circumstances.",
    type: "website",
    locale: "en_HK",
    siteName: "AddressMe",
  },
  twitter: {
    card: "summary_large_image",
    title: "AddressMe - Personalized Hong Kong Policy Address Summary",
    description:
      "Get a personalized AI-powered summary of Hong Kong's Policy Address tailored to your circumstances.",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${montserrat.variable} ${nunito.variable} antialiased font-nunito bg-background text-foreground`}
      >
        <NoScriptFallback />
        <ErrorBoundaryProvider enableGlobalNotifications={true}>
          {children}
        </ErrorBoundaryProvider>
      </body>
    </html>
  );
}
