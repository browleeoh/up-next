import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
}

export function StarRating({ value, onChange, max = 10 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          onClick={() => onChange(star === value ? 0 : star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(null)}
          className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= displayValue
                ? "fill-amber-500 text-amber-500"
                : "text-slate-600 hover:text-slate-500"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-slate-400">
        {value > 0 ? `${value}/${max}` : "Not rated"}
      </span>
    </div>
  );
}
