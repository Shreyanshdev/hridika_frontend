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
  title: "Hridika",
  description: "Bespoke Fashion and Lifestyle",
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

