"use client";

import React, { useState } from "react";

interface QuantitySelectorProps {
  initialQuantity?: number;
  onChange?: (quantity: number) => void;
}

export function QuantitySelector({ initialQuantity = 1, onChange }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
      onChange?.(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(q => q + 1);
    onChange?.(quantity + 1);
  };

  return (
    <div className="inline-flex items-center rounded-full bg-[var(--color-secondary-container)] p-1 text-[var(--color-primary)]">
      <button 
        onClick={handleDecrement}
        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--color-secondary)] hover:text-white transition-colors"
      >
        <span className="text-xl leading-none">-</span>
      </button>
      <span className="w-10 text-center font-heading font-bold">{quantity}</span>
      <button 
        onClick={handleIncrement}
        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--color-secondary)] hover:text-white transition-colors"
      >
        <span className="text-xl leading-none">+</span>
      </button>
    </div>
  );
}
