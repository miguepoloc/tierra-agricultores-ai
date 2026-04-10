import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-full font-heading font-semibold transition-all duration-300";
  
  const variantClasses = {
    primary: "gradient-primary text-white hover:ambient-shadow -translate-y-0.5 hover:-translate-y-1 active:translate-y-0",
    secondary: "bg-[var(--color-secondary-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-secondary)] hover:text-white",
    ghost: "border border-[var(--color-outline-variant)] border-opacity-15 text-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)]"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
