import type { ReactNode } from "react";
import { Toggle } from "@base-ui-components/react/toggle";
import { ToggleGroup } from "@base-ui-components/react/toggle-group";

interface SegmentedControlItem {
  value: string;
  label: ReactNode;
  ariaLabel?: string;
}

interface SegmentedControlProps {
  value: string;
  onValueChange: (value: string) => void;
  items: SegmentedControlItem[];
  ariaLabel: string;
  className?: string;
  itemClassName?: string;
}

export function SegmentedControl({
  value,
  onValueChange,
  items,
  ariaLabel,
  className = "",
  itemClassName = "",
}: SegmentedControlProps) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(values) => {
        const nextValue = values[0];
        if (nextValue && nextValue !== value) {
          onValueChange(nextValue);
        }
      }}
      aria-label={ariaLabel}
      className={`flex flex-wrap items-center gap-1 rounded-lg bg-slate-800 p-1 ${className}`}
    >
      {items.map((item) => (
        <Toggle
          key={item.value}
          value={item.value}
          aria-label={item.ariaLabel}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 data-[pressed]:bg-amber-500 data-[pressed]:text-slate-900 ${itemClassName}`}
        >
          {item.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
