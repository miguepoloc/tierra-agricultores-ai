import React from "react";
import Link from "next/link";
import { Headline, BodyText } from "../ui/Typography";

export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--color-primary)] pt-24 pb-12 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <Headline size="md" className="!text-white mb-6">AgriCommerce</Headline>
            <BodyText className="!text-[var(--color-on-primary-container)] max-w-sm">
              The Digital Orchard platform connecting premium organic agriculture with modern e-commerce.
            </BodyText>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div>
              <h3 className="font-heading font-semibold mb-4 text-white">Navegación</h3>
              <ul className="space-y-3 font-body text-sm text-[var(--color-on-primary-container)]">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/mercado" className="hover:text-white transition-colors">Mercado</Link></li>
                <li><Link href="/nosotros" className="hover:text-white transition-colors">Nuestra Historia</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-4 text-white">Soporte</h3>
              <ul className="space-y-3 font-body text-sm text-[var(--color-on-primary-container)]">
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contacto</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Envíos y Devoluciones</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-20 border-t border-[var(--color-primary-container)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-[var(--color-on-primary-container)]">
            &copy; {new Date().getFullYear()} AgriCommerce AI Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
