import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { Field, Textarea } from "@/components/ui/field";

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
      <Field
        label="Your review"
        description="Write your thoughts about this movie or show."
      >
        <Textarea
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
            if (!isEditing) setIsEditing(true);
          }}
          onFocus={() => setIsEditing(true)}
          placeholder="Write your thoughts about this movie or show..."
        />
      </Field>

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
