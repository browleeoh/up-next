import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-lg rounded-xl border border-slate-700 bg-background-secondary p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
