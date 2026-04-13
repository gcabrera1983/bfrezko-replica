"use client";

import Link from "next/link";
import Logo, { LogoText } from "./Logo";

const footerLinks = {
  shop: [
    { name: "Todas las Playeras", href: "/tienda" },
    { name: "Nuevas Llegadas", href: "/tienda?tag=nuevo" },
    { name: "Más Vendidos", href: "/tienda" },
    { name: "Colecciones", href: "/tienda" },
  ],
  about: [
    { name: "Nuestra Historia", href: "/nosotros" },
    { name: "Visión y Misión", href: "/nosotros" },
    { name: "El Significado del Logo", href: "/nosotros" },
  ],
  help: [
    { name: "Preguntas Frecuentes", href: "#" },
    { name: "Envíos", href: "#" },
    { name: "Devoluciones", href: "#" },
    { name: "Tallas", href: "#" },
    { name: "Contacto", href: "#" },
  ],
};

// Simple SVG icons
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#F6D3B3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Logo variant="light" size="lg" showTagline />
            </div>
            <p className="text-[#F6D3B3]/70 text-sm mb-6 max-w-xs font-cormorant leading-relaxed">
              Un estudio de ropa cristiana con un propósito claro: expandir el mensaje 
              del amor y la misericordia del Padre. Cada prenda es un recordatorio de 
              su amor incondicional.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#F6D3B3]/30 flex items-center justify-center hover:bg-[#F6D3B3]/10 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#F6D3B3]/30 flex items-center justify-center hover:bg-[#F6D3B3]/10 transition-colors"
                aria-label="Email"
              >
                <MailIcon />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-cinzel text-sm uppercase tracking-[0.2em] mb-4">
              Tienda
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#F6D3B3]/70 text-sm hover:text-[#F6D3B3] transition-colors font-cormorant"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-cinzel text-sm uppercase tracking-[0.2em] mb-4">
              Nosotros
            </h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#F6D3B3]/70 text-sm hover:text-[#F6D3B3] transition-colors font-cormorant"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-cinzel text-sm uppercase tracking-[0.2em] mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-[#F6D3B3]/70 text-sm font-cormorant">
                <span className="mr-2 mt-0.5"><MapPinIcon /></span>
                <span>Guatemala</span>
              </li>
              <li className="flex items-center text-[#F6D3B3]/70 text-sm font-cormorant">
                <span className="mr-2"><PhoneIcon /></span>
                <span>+502 XXXX XXXX</span>
              </li>
              <li className="flex items-center text-[#F6D3B3]/70 text-sm font-cormorant">
                <span className="mr-2"><MailIcon /></span>
                <span>hola@agapestudio.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#F6D3B3]/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#F6D3B3]/50 text-xs font-cormorant">
              © {new Date().getFullYear()} Ágape Studio. Con amor incondicional.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-[#F6D3B3]/50 text-xs hover:text-[#F6D3B3] transition-colors font-cormorant">
                Términos
              </Link>
              <Link href="#" className="text-[#F6D3B3]/50 text-xs hover:text-[#F6D3B3] transition-colors font-cormorant">
                Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
