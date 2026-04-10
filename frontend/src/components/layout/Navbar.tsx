import React from "react";
import Link from "next/link";
import { Button } from "../ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="absolute inset-0 glass-panel border-b border-white/20"></div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-2xl tracking-tight text-[var(--color-primary)]">
          AgriCommerce
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-body text-sm font-medium text-[var(--color-on-surface-variant)]">
          <Link href="/" className="hover:text-[var(--color-secondary)] transition-colors">Home</Link>
          <Link href="/mercado" className="hover:text-[var(--color-secondary)] transition-colors">Mercado</Link>
          <Link href="/nosotros" className="hover:text-[var(--color-secondary)] transition-colors">Nuestra Historia</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/carrito">
            <button className="relative p-2 text-[var(--color-on-surface)] hover:text-[var(--color-secondary)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-error)] text-[10px] font-bold text-white">2</span>
            </button>
          </Link>
          <Button variant="primary" size="sm">Ingresar</Button>
        </div>
      </div>
    </header>
  );
}
