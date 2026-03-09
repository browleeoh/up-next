import type { ReactNode } from "react";
import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onClose}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <BaseDialog.Popup className="relative z-10 w-full max-w-lg rounded-xl border border-slate-700 bg-background-secondary p-6 shadow-xl outline-none">
            {title && (
              <div className="mb-4 flex items-center justify-between">
                <BaseDialog.Title className="text-lg font-semibold">
                  {title}
                </BaseDialog.Title>
                <BaseDialog.Close className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                  <X className="h-5 w-5" />
                </BaseDialog.Close>
              </div>
            )}
            {children}
          </BaseDialog.Popup>
        </div>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
