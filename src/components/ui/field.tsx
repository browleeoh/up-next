import { forwardRef, type ReactNode, type TextareaHTMLAttributes } from "react";
import { Field as BaseField } from "@base-ui-components/react/field";

interface FieldProps {
  label: string;
  description?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  description,
  error,
  className = "",
  children,
}: FieldProps) {
  return (
    <BaseField.Root className={`space-y-2 ${className}`}>
      <BaseField.Label className="block text-sm font-medium text-slate-200">
        {label}
      </BaseField.Label>
      {description ? (
        <BaseField.Description className="text-sm text-slate-400">
          {description}
        </BaseField.Description>
      ) : null}
      {children}
      {error ? (
        <BaseField.Error className="text-sm text-red-400">
          {error}
        </BaseField.Error>
      ) : null}
    </BaseField.Root>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error = false, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={error || undefined}
        className={`min-h-[120px] w-full resize-y rounded-lg border bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 ${
          error
            ? "border-red-500 focus:border-red-400 focus:ring-red-400"
            : "border-slate-700 focus:border-amber-500 focus:ring-amber-500"
        } ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
