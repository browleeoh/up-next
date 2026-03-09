import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { RadioGroup as BaseRadioGroup } from "@base-ui-components/react/radio-group";
import { Radio as BaseRadio } from "@base-ui-components/react/radio";
import { Field } from "./field";

interface RadioOption {
  value: string;
  label: ReactNode;
  description?: string;
  ariaLabel?: string;
}

interface RadioGroupProps {
  label: string;
  value?: string;
  onValueChange: (value: string) => void;
  options: RadioOption[];
  description?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
  itemClassName?: string;
}

export function RadioGroup({
  label,
  value,
  onValueChange,
  options,
  description,
  className = "",
  orientation = "vertical",
  itemClassName = "",
}: RadioGroupProps) {
  return (
    <Field label={label} description={description} className={className}>
      <BaseRadioGroup
        value={value}
        onValueChange={(nextValue) => onValueChange(String(nextValue))}
        className={`flex ${
          orientation === "horizontal"
            ? "flex-wrap items-center gap-2"
            : "flex-col gap-2"
        }`}
      >
        {options.map((option) => (
          <BaseRadio.Root
            key={option.value}
            value={option.value}
            aria-label={option.ariaLabel}
            className={`group flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-left text-slate-200 outline-none transition-colors hover:border-slate-600 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 data-[checked]:border-amber-500 data-[checked]:bg-amber-500/15 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${itemClassName}`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-500 text-transparent transition-colors group-data-[checked]:border-amber-400 group-data-[checked]:bg-amber-500/20 group-data-[checked]:text-amber-400">
              <BaseRadio.Indicator>
                <Check className="h-3.5 w-3.5" />
              </BaseRadio.Indicator>
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="flex items-center gap-2">{option.label}</span>
              {option.description ? (
                <span className="text-sm text-slate-400">{option.description}</span>
              ) : null}
            </span>
          </BaseRadio.Root>
        ))}
      </BaseRadioGroup>
    </Field>
  );
}
