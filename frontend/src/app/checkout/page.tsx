import React from "react";
import { Headline, BodyText } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

export default function Checkout() {
  return (
    <div className="flex flex-col flex-grow bg-[var(--color-surface)] py-16">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 w-full">
        <Headline size="lg" className="mb-8">Finalizar Compra</Headline>
        
        <div className="bg-[var(--color-surface-container-lowest)] p-8 lg:p-12 rounded-3xl ambient-shadow">
          <form className="space-y-8">
            <div>
              <h3 className="font-heading font-bold text-xl mb-4 text-[var(--color-primary)]">Información de Envío</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Nombre" className="w-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-1 focus:ring-[var(--color-primary)]" />
                <input type="text" placeholder="Apellidos" className="w-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-1 focus:ring-[var(--color-primary)]" />
                <input type="text" placeholder="Dirección" className="w-full md:col-span-2 bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-1 focus:ring-[var(--color-primary)]" />
                <input type="text" placeholder="Ciudad" className="w-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-1 focus:ring-[var(--color-primary)]" />
                <input type="text" placeholder="Código Postal" className="w-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-1 focus:ring-[var(--color-primary)]" />
              </div>
            </div>

            <div>
              <h3 className="font-heading font-bold text-xl mb-4 text-[var(--color-primary)]">Método de Pago</h3>
              <div className="bg-[var(--color-surface-container-low)] p-6 rounded-2xl">
                <label className="flex items-center gap-3 font-body cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-[var(--color-primary)]" />
                  <span className="font-medium text-[var(--color-on-surface)]">Tarjeta de Crédito / Débito</span>
                </label>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <input type="text" placeholder="Número de tarjeta" className="w-full bg-white text-[var(--color-on-surface)] rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[var(--color-primary)] border border-black/5" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/AA" className="w-full bg-white text-[var(--color-on-surface)] rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[var(--color-primary)] border border-black/5" />
                    <input type="text" placeholder="CVC" className="w-full bg-white text-[var(--color-on-surface)] rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[var(--color-primary)] border border-black/5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="button" variant="primary" className="w-full" size="lg">Confirmar Orden - $39.50</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
