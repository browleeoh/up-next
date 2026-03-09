import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  ariaLabel?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  autoFocus = false,
  ariaLabel = "Search",
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number>();
  const [localValue, setLocalValue] = useState(value);

  // Sync from parent when the prop changes (e.g. browser back/forward)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      onChange(newValue);
    }, 300);
  };

  const handleClear = () => {
    setLocalValue("");
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
      <Input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="pl-10 pr-10"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-700 hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
