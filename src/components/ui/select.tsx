import { Check, ChevronDown } from "lucide-react";
import { Select as BaseSelect } from "@base-ui-components/react/select";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string | number;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  ariaLabel: string;
  placeholder?: string;
  className?: string;
}

export function Select({
  value,
  onValueChange,
  options,
  ariaLabel,
  placeholder = "Select an option",
  className = "",
}: SelectProps) {
  return (
    <BaseSelect.Root
      value={value === "" ? null : String(value)}
      onValueChange={(nextValue) => onValueChange(nextValue ?? "")}
    >
      <BaseSelect.Trigger
        aria-label={ariaLabel}
        className={`flex min-w-0 items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 transition-colors hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        <BaseSelect.Value>
          {(selectedValue: string | null) =>
            options.find((option) => option.value === selectedValue)?.label ??
            placeholder
          }
        </BaseSelect.Value>
        <BaseSelect.Icon>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={8} className="z-50 outline-none">
          <BaseSelect.Popup className="min-w-[var(--anchor-width)] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-1 shadow-xl shadow-black/30 outline-none">
            <BaseSelect.List className="max-h-72 overflow-y-auto">
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="flex cursor-default items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-colors data-[highlighted]:bg-slate-800 data-[highlighted]:text-slate-50 data-[selected]:text-slate-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator keepMounted>
                    <Check className="h-4 w-4 text-amber-400 opacity-0 transition-opacity data-[selected]:opacity-100" />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
