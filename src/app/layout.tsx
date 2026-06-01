import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://designoraa.in"),
  title: {
    default: "Designora - Free AI Image Tools Online",
    template: "%s | Designora",
  },
  description:
    "Free AI image tools to upscale images, remove backgrounds, erase watermarks, compress, convert, and resize online.",
  keywords: [
    "ai image tools",
    "image upscaler ai free",
    "upscale image online",
    "background remover ai",
    "remove background from image",
    "watermark remover ai",
    "remove watermark from image",
    "image compressor online",
    "compress image online",
    "png to jpg converter",
    "jpg to png converter",
    "image to pdf converter",
    "pdf to image converter",
    "resize image online",
    "batch image resizer",
    "color palette from image",
    "image dpi editor",
    "ai image enhancer",
    "free online image tools",
    "designora",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Designora - Free AI Image Tools Online",
    description:
      "Use free AI tools to upscale images, remove backgrounds, erase watermarks, and optimize visuals online.",
    url: "/",
    siteName: "Designora",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Designora - Free AI Image Tools Online",
    description:
      "Upscale images, remove backgrounds, erase watermarks, and optimize visuals with AI.",
  },
};

const adsenseClient = (() => {
  const raw = process.env.NEXT_PUBLIC_ADSENSE_ID || "pub-9874232911110694";
  return raw.startsWith("ca-") ? raw : `ca-${raw}`;
})();

const gaId = process.env.NEXT_PUBLIC_GA_ID || "";
const adProvider = (process.env.NEXT_PUBLIC_AD_PROVIDER || "adsense").toLowerCase();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        {adProvider === "adsense" ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body className="min-h-full flex flex-col">
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        ) : null}
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
