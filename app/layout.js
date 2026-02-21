import { Modern_Antiqua, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { WishlistProvider } from "../context/WishlistContext";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import PageWrapper from "../components/PageWrapper";

// Primary Heading Font - Modern Antiqua
const modernAntiqua = Modern_Antiqua({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Alias for uppercase legacy mapping if needed, or just use the same variable
const modernAntiquaUpper = Modern_Antiqua({
  variable: "--font-heading-upper",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Body Font - Clean Sans-Serif
const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata = {
  title: "Hridika Jewels | Best Jeweller in Kanpur, UP | Real & Beautiful Jewellery",
  description: "Looking for the best jeweller in Kanpur, UP India? Welcome to Hridika Jewels! We make gorgeous and real jewellery for everyday and wedding. Shop rings, necklaces, bangles, and more right here in Kanpur.",
  keywords: "best jeweller in kanpur, kanpur jewellers, top jewellery shop in kanpur UP india, real jewellery kanpur, beautiful rings, necklaces kanpur, bridal jewellery kanpur, hridika jewels kanpur, fashion jewellery india",
  openGraph: {
    title: "Hridika Jewels | Best Jeweller in Kanpur",
    description: "Welcome to Hridika Jewels! The best jewellery shop in Kanpur, UP for modern and traditional designs.",
    url: "https://www.hridika.in",
    siteName: "Hridika Jewels",
    locale: "en_IN",
    type: "website",
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
};

import { GoogleOAuthProvider } from "@react-oauth/google";

// ... imports

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${modernAntiqua.variable} ${modernAntiquaUpper.variable} ${sourceSans.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE"}>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Navbar />
                <main>
                  <PageWrapper>
                    {children}
                  </PageWrapper>
                </main>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

