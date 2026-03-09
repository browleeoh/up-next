import { forwardRef, type InputHTMLAttributes } from "react";
import { Input as BaseInput } from "@base-ui-components/react/input";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <BaseInput
        ref={ref}
        className={`w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
