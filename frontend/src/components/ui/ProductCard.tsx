import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

export function ProductCard({ id, title, description, price, imageUrl }: ProductCardProps) {
  return (
    <div className="group flex flex-col bg-[var(--color-surface-container-lowest)] p-4 hover:ambient-shadow transition-shadow duration-300">
      <Link href={`/mercado/${id}`} className="block relative overflow-hidden rounded-xl aspect-[4/3] mb-6">
        <Image 
          src={imageUrl} 
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      
      <div className="flex flex-col flex-grow">
        <Link href={`/mercado/${id}`}>
          <h3 className="font-heading text-xl font-bold text-[var(--color-primary)] mb-2">{title}</h3>
        </Link>
        <p className="font-body text-[var(--color-on-surface-variant)] text-sm mb-6 flex-grow">{description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="inline-flex py-1 px-3 bg-[var(--color-surface-container-highest)] rounded-full">
            <span className="font-heading font-bold text-lg">${price.toFixed(2)}</span>
          </div>
          <Button variant="secondary" size="sm">Add</Button>
        </div>
      </div>
    </div>
  );
}
