import type { Metadata } from "next";
import "./globals.css";

import { Jost } from "next/font/google"; // Importing the Jost font from Google Fonts using Next.js
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import EmailModal from "../components/shared/EmailModal";
import { CartProvider } from "../providers/CartProvider";
import { WishlistProvider } from "../providers/WishlistProvider";

// Initializing the Jost font with the Latin subset
const jost = Jost({ subsets: ["latin"] });

// Defining the metadata for the application
export const metadata: Metadata = {
  title: "Aleebansparks | Premium Fashion & Accessories",
  description: "Discover premium quality outfits, handcrafted shoes, and exclusive accessories at Aleebansparks. Crafting elegance through fashion.",
  keywords: "fashion, outfits, handmade shoes, accessories, premium quality, Nigerian fashion, online shopping",
  authors: [{ name: "Aleebansparks" }],
  openGraph: {
    title: "Aleebansparks | Premium Fashion & Accessories",
    description: "Discover premium quality outfits, handcrafted shoes, and exclusive accessories at Aleebansparks.",
    url: "https://aleebansparks.com",
    siteName: "Aleebansparks",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aleebansparks | Premium Fashion & Accessories",
    description: "Discover premium quality outfits, handcrafted shoes, and exclusive accessories at Aleebansparks.",
    creator: "@aleebansparks",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// RootLayout component to wrap the entire application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Children components to be rendered inside the layout
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <CartProvider>
        <WishlistProvider>
          <body className={jost.className}>
            <Navbar />
            {children}
            <Footer />
            
            {/* Email subscription modal - shows after 3 seconds on first visit */}
            <EmailModal delayMs={3000} />
          </body>
        </WishlistProvider>
      </CartProvider>
    </html>
  );
}