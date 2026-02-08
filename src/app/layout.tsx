import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://suedpfote.de'),
  title: {
    default: "Südpfote | Premium Linkshänder-Produkte | Der Shop für die anderen 10%",
    template: "%s | Südpfote"
  },
  description: "Entdecke hochwertige Produkte speziell für Linkshänder. Scheren, Füller, Küchenwerkzeug & mehr - endlich richtig herum! ✓ Schneller Versand ✓ 30 Tage Rückgabe ✓ Made for Lefties",
  keywords: [
    "Linkshänder",
    "Linkshänder Produkte",
    "Linkshänder Shop",
    "Linkshänder Schere",
    "Linkshänder Füller",
    "Linkshänder Küche",
    "Linkshänder Werkzeug",
    "Linke Hand",
    "Lefty",
    "Left handed products",
    "Linkshänder Deutschland",
    "Produkte für Linkshänder",
    "Scheren für Linkshänder",
    "Küchenhelfer Linkshänder",
    "ergonomische Maus Linkshänder"
  ],
  authors: [{ name: "Südpfote" }],
  creator: "Südpfote",
  publisher: "Südpfote",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://suedpfote.de",
    siteName: "Südpfote",
    title: "Südpfote | Premium Linkshänder-Produkte",
    description: "Der Shop für die anderen 10%. Hochwertige Produkte speziell für Linkshänder - endlich richtig herum!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Südpfote - Premium Linkshänder-Produkte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Südpfote | Premium Linkshänder-Produkte",
    description: "Der Shop für die anderen 10%. Hochwertige Produkte speziell für Linkshänder.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://suedpfote.de",
  },
  category: "E-Commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Südpfote",
    "description": "Premium Produkte für Linkshänder",
    "url": "https://suedpfote.de",
    "logo": "https://suedpfote.de/logo.png",
    "image": "https://suedpfote.de/og-image.png",
    "priceRange": "€€",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "DE"
    },
    "sameAs": [],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://suedpfote.de/suche?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="de">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#18181b" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
