import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const siteUrl = "https://yasargranit.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Yaşar Granit | Manavgat Mermer, Mermerit ve Granit Ürünleri",
    template: "%s | Yaşar Granit",
  },
  description:
    "Manavgat ve Antalya'nın güvenilir granit, mermer ve mermerit firması. 1999'dan bu yana kaliteli doğal taş ürünleri. Granit tezgah, mermer döşeme, mermerit kaplama ve çimstone çözümleri.",
  keywords: [
    "yaşar granit",
    "yaşar mermer",
    "yaşar mermerit",
    "manavgat granit",
    "manavgat mermer",
    "manavgat mermerit",
    "antalya granit",
    "antalya mermer",
    "antalya mermerit",
    "granit ürünleri",
    "mermerit ürünleri",
    "doğal taş",
    "granit tezgah",
    "mermer döşeme",
    "çimstone",
    "taş kaplama",
  ],
  authors: [{ name: "Yaşar Granit" }],
  creator: "Yaşar Granit",
  publisher: "Yaşar Granit",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "Yaşar Granit",
    title: "Yaşar Granit | Manavgat Mermer, Mermerit ve Granit Ürünleri",
    description:
      "Manavgat ve Antalya'nın güvenilir granit, mermer ve mermerit firması. 1999'dan bu yana kaliteli doğal taş ürünleri.",
    images: [
      {
        url: "/logo.png",
        alt: "Yaşar Granit - Manavgat Mermer ve Granit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yaşar Granit | Manavgat Mermer, Mermerit ve Granit Ürünleri",
    description:
      "Manavgat ve Antalya'nın güvenilir granit, mermer ve mermerit firması. 1999'dan bu yana kaliteli doğal taş ürünleri.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  verification: {
    google: "clqxpFzfZqjDQmyk5AQcKhqp3Sz3zOy_7LoqaoFQbg0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${montserrat.className} flex flex-col min-h-screen bg-white`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Yaşar Granit",
              description:
                "Manavgat ve Antalya'nın güvenilir granit, mermer ve mermerit firması. 1999'dan bu yana kaliteli doğal taş ürünleri.",
              url: siteUrl,
              telephone: ["+905337311846", "+905365228261"],
              email: "yasar07600@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Alanya Yolu Üzeri Ulualan Mevkii No: 42/1",
                addressLocality: "Manavgat",
                addressRegion: "Antalya",
                addressCountry: "TR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 36.7,
                longitude: 31.4,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ],
                  opens: "08:00",
                  closes: "18:00",
                },
              ],
              sameAs: [],
              image: `${siteUrl}/logo.png`,
              priceRange: "$$",
              servesCuisine: undefined,
              hasMap: "https://www.google.com/maps/place/Ya%C5%9Far+Granit",
            }),
          }}
        />
      </body>
    </html>
  );
}
