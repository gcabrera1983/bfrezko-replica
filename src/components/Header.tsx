"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search, User, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LogoText } from "./Logo";

const navLinks = [
  { name: "Inicio", href: "/" },
  { name: "Tienda", href: "/tienda" },
  { name: "Nosotros", href: "/nosotros" },
  { name: "Info", href: "/info" },
  { name: "Rastrear", href: "/rastreo" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-[#FDF9F3]/95 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#6B4423] hover:text-[#889E81] transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <LogoText variant="dark" size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "font-cormorant text-base tracking-wide uppercase transition-colors hover:text-[#889E81]",
                    pathname === link.href
                      ? "text-[#6B4423] font-semibold"
                      : "text-[#6B4423]/80"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                className="p-2 text-[#6B4423] hover:text-[#889E81] transition-colors hidden sm:block"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                className="p-2 text-[#6B4423] hover:text-[#889E81] transition-colors hidden sm:block"
                aria-label="Favoritos"
              >
                <Heart className="w-5 h-5" />
              </button>
              <Link
                href="/carrito"
                className="relative p-2 text-[#6B4423] hover:text-[#889E81] transition-colors"
                aria-label="Carrito"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-[#6B4423] text-[#F6D3B3] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center font-cinzel"
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#1A1A1A]/50 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-[#FDF9F3] z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-[#6B4423]/10">
                  <LogoText variant="dark" size="sm" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-[#6B4423] hover:text-[#889E81] transition-colors"
                    aria-label="Cerrar menú"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="flex-1 py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "block px-6 py-4 font-cormorant text-base uppercase tracking-wide transition-colors",
                        pathname === link.href
                          ? "bg-[#F6D3B3]/30 text-[#6B4423] font-semibold"
                          : "text-[#6B4423]/80 hover:bg-[#F6D3B3]/20"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t border-[#6B4423]/10 space-y-2">
                  <button className="flex items-center w-full px-6 py-3 font-cormorant text-[#6B4423] hover:bg-[#F6D3B3]/20 transition-colors">
                    <Search className="w-5 h-5 mr-3" />
                    Buscar
                  </button>
                  <button className="flex items-center w-full px-6 py-3 font-cormorant text-[#6B4423] hover:bg-[#F6D3B3]/20 transition-colors">
                    <Heart className="w-5 h-5 mr-3" />
                    Favoritos
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
