import { Star } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
}

export function StarRating({ value, onChange, max = 10 }: StarRatingProps) {
  return (
    <div className="space-y-3">
      <RadioGroup
        label="Your rating"
        description={value > 0 ? `${value}/${max}` : "Choose a rating from 1 to 10."}
        value={value > 0 ? String(value) : ""}
        onValueChange={(nextValue) => onChange(Number(nextValue))}
        orientation="horizontal"
        itemClassName="justify-center px-2.5 py-2"
        options={Array.from({ length: max }, (_, i) => i + 1).map((star) => ({
          value: String(star),
          ariaLabel: `${star} out of ${max} stars`,
          label: (
            <span className="flex items-center gap-1.5">
              <Star className="h-5 w-5 fill-current" />
              <span className="text-sm">{star}</span>
            </span>
          ),
        }))}
      />
      {value > 0 ? (
        <Button type="button" variant="ghost" size="sm" onClick={() => onChange(0)}>
          Clear rating
        </Button>
      ) : null}
    </div>
  );
}
