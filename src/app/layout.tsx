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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://designoraa.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  title: {
    default: "Designora - Free AI Image Tools Online",
    template: "%s | Designora",
  },
  description:
    "Free online image tools to upscale, crop, rotate, resize, compress, convert HEIC photos, and prepare images for social media.",
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
    "crop image online",
    "rotate image online",
    "batch image resizer",
    "social media image resizer",
    "instagram image size",
    "facebook image size",
    "heic to jpg converter",
    "heif to jpg converter",
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
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Designora free online image tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Designora - Free AI Image Tools Online",
    description:
      "Upscale images, remove backgrounds, erase watermarks, and optimize visuals with AI.",
    images: ["/og-image.svg"],
  },
};

const adsenseClient = (() => {
  const raw = process.env.NEXT_PUBLIC_ADSENSE_ID || "pub-9874232911110694";
  return raw.startsWith("ca-") ? raw : `ca-${raw}`;
})();

const gaId = process.env.NEXT_PUBLIC_GA_ID || "";
const adProvider = (process.env.NEXT_PUBLIC_AD_PROVIDER || "adsense").toLowerCase();

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Designora",
      url: siteUrl,
      logo: `${siteUrl}/logo.svg`,
    },
    {
      "@type": "WebSite",
      name: "Designora",
      url: siteUrl,
      description: "Free online image tools for resizing, compression, conversion, and AI enhancement.",
      publisher: { "@type": "Organization", name: "Designora", url: siteUrl },
    },
  ],
};

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
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {adProvider === "adsense" ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
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
