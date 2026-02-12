import { forwardRef, type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-xl border border-slate-800 bg-background-secondary ${className}`}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
