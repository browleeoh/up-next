import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface ReviewFormProps {
  value: string;
  onSave: (review: string) => void;
}

export function ReviewForm({ value, onSave }: ReviewFormProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const hasChanges = localValue !== value;

  const handleSave = () => {
    onSave(localValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(value);
    setIsEditing(false);
  };

  return (
    <div className="space-y-3">
      <textarea
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
          if (!isEditing) setIsEditing(true);
        }}
        onFocus={() => setIsEditing(true)}
        placeholder="Write your thoughts about this movie or show..."
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-[120px] resize-y"
      />

      {isEditing && hasChanges && (
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button onClick={handleCancel} variant="ghost" size="sm">
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
