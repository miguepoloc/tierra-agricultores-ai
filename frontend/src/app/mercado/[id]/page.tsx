import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Headline, BodyText } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProductDetail({ params }: Props) {
  const { id } = await params;
  
  return (
    <div className="flex flex-col flex-grow bg-[var(--color-surface)] py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <Link href="/mercado" className="inline-flex items-center text-[var(--color-primary)] font-body text-sm hover:underline mb-10">
          &larr; Volver al mercado
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden ambient-shadow">
            <Image 
              src="/images/product_tomatoes_1775674213902.png"
              alt="Producto"
              fill
              className="object-cover"
            />
          </div>
          
          {/* Details */}
          <div className="flex flex-col justify-center">
            <div className="inline-block px-3 py-1 bg-[var(--color-secondary-container)] text-[var(--color-secondary)] font-heading font-bold text-xs rounded-full mb-6 w-max">
              Cosecha 100% Orgánica
            </div>
            
            <Headline size="lg" className="mb-4">Tomates Heirloom Orgánicos</Headline>
            <div className="text-3xl font-heading font-bold text-[var(--color-on-surface)] mb-6">
              $18.50 <span className="text-lg text-[var(--color-outline)] font-normal">/ 2kg</span>
            </div>
            
            <BodyText className="mb-10 text-[var(--color-on-surface-variant)]">
              Cultivados bajo el sol y respetando los ciclos naturales de la tierra. Estos tomates heirloom están llenos de sabor auténtico, perfectos para ensaladas frescas, salsas caseras o simplemente para comer cortados con un poco de aceite de oliva y sal.
            </BodyText>
            
            <div className="bg-[var(--color-surface-container-low)] p-8 rounded-3xl mb-10 border border-[var(--color-outline-variant)] border-opacity-30">
              <div className="flex items-center gap-6 mb-8">
                <span className="font-heading font-bold text-[var(--color-primary)]">Cantidad:</span>
                <QuantitySelector initialQuantity={1} />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" className="flex-1">Añadir al Carrito</Button>
                <Link href="/checkout" className="flex-1">
                  <Button variant="secondary" size="lg" className="w-full">Comprar Ahora</Button>
                </Link>
              </div>
            </div>
            
            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-[var(--color-surface-container-high)] flex flex-col gap-2">
                <span className="text-2xl">🌱</span>
                <span className="font-heading font-bold text-sm text-[var(--color-primary)]">Suelo Vivo</span>
                <p className="font-body text-xs text-[var(--color-on-surface-variant)]">Cultivados conservando la microbiota natural.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[var(--color-surface-container-high)] flex flex-col gap-2">
                <span className="text-2xl">🚚</span>
                <span className="font-heading font-bold text-sm text-[var(--color-primary)]">Del agricultor a ti</span>
                <p className="font-body text-xs text-[var(--color-on-surface-variant)]">Sin intermediarios, frescura garantizada.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
