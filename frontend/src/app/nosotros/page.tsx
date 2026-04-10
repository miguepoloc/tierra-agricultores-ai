import React from "react";
import Image from "next/image";
import { Headline, BodyText } from "@/components/ui/Typography";

export default function Nosotros() {
  return (
    <div className="flex flex-col flex-grow py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full flex flex-col items-center">
        <Headline size="xl" className="text-center mb-12">Nuestra Historia</Headline>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden ambient-shadow">
            <Image 
              src="/images/about_us_farmer_1775674244307.png"
              alt="Farmer holding organic soil"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex flex-col gap-6">
            <Headline size="md" className="!text-[var(--color-secondary)]">Raíces Profundas</Headline>
            <BodyText size="lg">
              Todo comenzó con una idea simple: traer la pureza del campo directamente a la mesa moderna, sin perder el contacto humano ni el respeto por la tierra.
            </BodyText>
            <BodyText>
              En The Digital Orchard, no solo vendemos productos agrícolas; contamos la historia de las personas que madrugan todos los días para sembrar y cosechar con sus propias manos. Las imperfecciones en nuestros productos son el testimonio de que provienen de la naturaleza, no de una fábrica.
            </BodyText>
            
            <div className="mt-8 p-8 bg-[var(--color-surface-container-low)] rounded-2xl border-l-[6px] border-[var(--color-primary)]">
              <Headline size="sm" className="mb-4">"No heredamos la tierra de nuestros ancestros, la tomamos prestada de nuestros hijos."</Headline>
              <BodyText className="italic">- Filosofía del Agricultor</BodyText>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
