import React from "react";

export function Headline({ children, className = "", as: Component = "h1", size = "lg" }: { children: React.ReactNode, className?: string, as?: any, size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl leading-tight",
    xl: "text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight",
  };
  
  return (
    <Component className={`font-heading font-bold text-[var(--color-primary)] ${sizes[size]} ${className}`}>
      {children}
    </Component>
  );
}

export function BodyText({ children, className = "", size = "md" }: { children: React.ReactNode, className?: string, size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg md:text-xl",
  };

  return (
    <p className={`font-body text-[var(--color-on-surface-variant)] ${sizes[size]} ${className}`}>
      {children}
    </p>
  );
}
