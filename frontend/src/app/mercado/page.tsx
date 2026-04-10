import React from "react";
import { Headline, BodyText } from "@/components/ui/Typography";
import { ProductCard } from "@/components/ui/ProductCard";

const DUMMY_PRODUCTS = [
  {
    id: "1",
    title: "Tomates Heirloom Orgánicos",
    description: "Cultivados al sol, llenos de sabor y riqueza del suelo. Caja de 2kg.",
    price: 18.50,
    imageUrl: "/images/product_tomatoes_1775674213902.png"
  },
  {
    id: "2",
    title: "Zanahorias de Tierra Viva",
    description: "Crujientes, dulces y recolectadas esta misma mañana.",
    price: 8.00,
    imageUrl: "/images/product_tomatoes_1775674213902.png" // Reusing image for demo
  },
  {
    id: "3",
    title: "Cesta de Vegetales Frescos",
    description: "Selección de temporada directamente del huerto a tu puerta.",
    price: 45.00,
    imageUrl: "/images/product_tomatoes_1775674213902.png" // Reusing image for demo
  },
  {
    id: "4",
    title: "Albahaca Genovesa",
    description: "Aromática y de hojas grandes. Ideal para pesto fresco.",
    price: 4.50,
    imageUrl: "/images/product_tomatoes_1775674213902.png" // Reusing image for demo
  }
];

export default function Mercado() {
  return (
    <div className="flex flex-col flex-grow bg-[var(--color-surface)] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="mb-16">
          <Headline size="xl" className="mb-4">Mercado Moderno</Headline>
          <BodyText size="lg" className="max-w-2xl">
            Explora nuestra colección de productos frescos de granja, cultivados con métodos orgánicos sostenibles en 'The Digital Orchard'.
          </BodyText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DUMMY_PRODUCTS.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
