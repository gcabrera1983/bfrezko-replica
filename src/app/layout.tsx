import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import { ProductsProvider } from "@/context/ProductsContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Ágape Studio | Ropa Cristiana con Propósito",
  description: "Un estudio de ropa cristiana con un propósito claro: expandir el mensaje del amor y la misericordia del Padre. Cada prenda es un recordatorio de su amor incondicional.",
  keywords: ["ropa cristiana", "agape", "amor incondicional", "fe", "esperanza", "guatemala", "playeras cristianas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${cinzel.variable} ${playfair.variable} ${cormorant.variable} font-sans antialiased`}>
        <ProductsProvider>
          <CartProvider>
            <AdminProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 pt-[72px] lg:pt-[88px]">
                  {children}
                </main>
                <Footer />
              </div>
            </AdminProvider>
          </CartProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
