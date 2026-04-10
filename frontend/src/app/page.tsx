import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Headline, BodyText } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero_orchard_1775674187784.png"
            alt="Organic Orchard at sunrise"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface)] via-[var(--color-surface)]/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="max-w-2xl bg-[var(--color-surface-container-lowest)]/80 backdrop-blur-md p-10 md:p-14 rounded-3xl ambient-shadow">
            <Headline size="xl" className="mb-6">
              El Huerto Digital.
            </Headline>
            <BodyText size="lg" className="mb-10 text-[var(--color-on-surface)]">
              Bridging the gap between the raw, tactile world of agriculture and the precision of modern e-commerce. Premium, farm-to-table organic produce.
            </BodyText>
            <div className="flex flex-wrap gap-4">
              <Link href="/mercado">
                <Button variant="primary" size="lg">Explorar Mercado</Button>
              </Link>
              <Link href="/nosotros">
                <Button variant="secondary" size="lg">Nuestra Historia</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-32 bg-[var(--color-surface-container-low)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 flex flex-col items-start">
              <Headline size="md" className="mb-6">Cosecha del Día</Headline>
              <BodyText className="mb-8">
                Seleccionamos meticulosamente los mejores productos de nuestra tierra. Cada tomate, cada hoja, es cultivada con un compromiso inquebrantable con la calidad y la sostenibilidad.
              </BodyText>
              <Link href="/mercado">
                <Button variant="ghost">Ver Todos los Productos</Button>
              </Link>
            </div>
            <div className="order-1 lg:order-2 relative aspect-[4/5] rounded-2xl overflow-hidden ambient-shadow">
              <Image 
                src="/images/product_tomatoes_1775674213902.png"
                alt="Fresh tomatoes"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
