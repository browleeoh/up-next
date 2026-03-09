import type { ReactNode } from "react";
import { AlertDialog as BaseAlertDialog } from "@base-ui-components/react/alert-dialog";
import { Button } from "./button";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
}: AlertDialogProps) {
  return (
    <BaseAlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <BaseAlertDialog.Popup className="w-full max-w-md rounded-xl border border-slate-700 bg-background-secondary p-6 shadow-xl outline-none">
            <BaseAlertDialog.Title className="text-lg font-semibold text-slate-50">
              {title}
            </BaseAlertDialog.Title>
            <BaseAlertDialog.Description className="mt-3 text-sm text-slate-300">
              {description}
            </BaseAlertDialog.Description>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={onConfirm} variant="danger">
                {confirmLabel}
              </Button>
              <BaseAlertDialog.Close
                render={
                  <Button variant="secondary" type="button">
                    {cancelLabel}
                  </Button>
                }
              />
            </div>
          </BaseAlertDialog.Popup>
        </div>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
}
