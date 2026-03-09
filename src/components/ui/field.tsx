import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  type ReactElement,
  type TextareaHTMLAttributes,
} from "react";
import { Field as BaseField } from "@base-ui-components/react/field";

interface FieldProps {
  label: string;
  description?: string;
  error?: string;
  id?: string;
  className?: string;
  children: ReactElement<{
    id?: string;
    "aria-describedby"?: string;
  }>;
}

export function Field({
  label,
  description,
  error,
  id,
  className = "",
  children,
}: FieldProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const describedByIds = [
    description ? `${controlId}-desc` : null,
    error ? `${controlId}-error` : null,
    children.props["aria-describedby"] ?? null,
  ]
    .filter(Boolean)
    .join(" ");

  const control = isValidElement(children)
    ? cloneElement(children, {
        id: controlId,
        "aria-describedby": describedByIds || undefined,
      })
    : children;

  return (
    <BaseField.Root className={`space-y-2 ${className}`}>
      <BaseField.Label
        htmlFor={controlId}
        className="block text-sm font-medium text-slate-200"
      >
        {label}
      </BaseField.Label>
      {description ? (
        <BaseField.Description
          id={`${controlId}-desc`}
          className="text-sm text-slate-400"
        >
          {description}
        </BaseField.Description>
      ) : null}
      {control}
      {error ? (
        <BaseField.Error id={`${controlId}-error`} className="text-sm text-red-400">
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
