import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Headline, BodyText } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";

export default function Carrito() {
  return (
    <div className="flex flex-col flex-grow bg-[var(--color-surface-container-low)] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <Headline size="lg" className="mb-12">Carrito de Compras</Headline>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6 bg-[var(--color-surface-container-lowest)] p-6 rounded-3xl ambient-shadow">
              <div className="relative aspect-square w-32 rounded-xl overflow-hidden shrink-0">
                <Image 
                  src="/images/product_tomatoes_1775674213902.png"
                  alt="Tomates"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="font-heading font-bold text-xl text-[var(--color-primary)]">Tomates Heirloom Orgánicos</h3>
                <p className="font-body text-sm text-[var(--color-on-surface-variant)] mb-4">Caja de 2kg</p>
                <div className="flex items-center justify-between mt-auto">
                  <QuantitySelector initialQuantity={1} />
                  <span className="font-heading font-bold text-xl">$18.50</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 bg-[var(--color-surface-container-lowest)] p-6 rounded-3xl ambient-shadow">
              <div className="relative aspect-square w-32 rounded-xl overflow-hidden shrink-0">
                <Image 
                  src="/images/product_tomatoes_1775674213902.png"
                  alt="Zanahorias"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="font-heading font-bold text-xl text-[var(--color-primary)]">Zanahorias de Tierra Viva</h3>
                <p className="font-body text-sm text-[var(--color-on-surface-variant)] mb-4">Manojo fresco</p>
                <div className="flex items-center justify-between mt-auto">
                  <QuantitySelector initialQuantity={2} />
                  <span className="font-heading font-bold text-xl">$16.00</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-[var(--color-surface-container-lowest)] p-8 rounded-3xl ambient-shadow sticky top-28">
              <h3 className="font-heading font-bold text-2xl mb-6 text-[var(--color-primary)]">Resumen de Orden</h3>
              
              <div className="space-y-4 mb-8 font-body text-[var(--color-on-surface-variant)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$34.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío (Hacienda)</span>
                  <span>$5.00</span>
                </div>
                <div className="border-t border-black/10 my-4"></div>
                <div className="flex justify-between font-heading font-bold text-xl text-[var(--color-on-surface)]">
                  <span>Total</span>
                  <span>$39.50</span>
                </div>
              </div>
              
              <Link href="/checkout" className="block w-full">
                <Button variant="primary" className="w-full">Proceder al Pago</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
