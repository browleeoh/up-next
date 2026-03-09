import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Accordion as BaseAccordion } from "@base-ui-components/react/accordion";

interface AccordionItem {
  value: string;
  header: ReactNode;
  panel: ReactNode;
}

interface AccordionProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  items: AccordionItem[];
  className?: string;
}

export function Accordion({
  value,
  onValueChange,
  items,
  className = "",
}: AccordionProps) {
  return (
    <BaseAccordion.Root
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue.map(String))}
      className={`space-y-2 ${className}`}
    >
      {items.map((item) => (
        <BaseAccordion.Item
          key={item.value}
          value={item.value}
          className="overflow-hidden rounded-lg border border-slate-700"
        >
          <BaseAccordion.Header>
            <BaseAccordion.Trigger className="group flex w-full items-center gap-3 p-4 text-left outline-none transition-colors hover:bg-slate-800/50 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset">
              <span className="text-slate-500 group-data-[panel-open]:hidden">
                <ChevronRight className="h-5 w-5" />
              </span>
              <span className="hidden text-slate-500 group-data-[panel-open]:block">
                <ChevronDown className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">{item.header}</span>
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>
          <BaseAccordion.Panel className="border-t border-slate-700 bg-slate-800/30 p-4">
            {item.panel}
          </BaseAccordion.Panel>
        </BaseAccordion.Item>
      ))}
    </BaseAccordion.Root>
  );
}
