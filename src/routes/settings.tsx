import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/database";
import { exportService } from "@/lib/services/export.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [exportStatus, setExportStatus] = useState<"idle" | "success" | "error">("idle");
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const counts = useLiveQuery(async () => {
    const mediaCount = await db.mediaItems.count();
    const episodeCount = await db.episodeProgress.count();
    return { mediaCount, episodeCount };
  }, [], { mediaCount: 0, episodeCount: 0 });

  const handleExport = async () => {
    try {
      const data = await exportService.exportAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `up-next-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportStatus("success");
      setTimeout(() => setExportStatus("idle"), 3000);
    } catch {
      setExportStatus("error");
      setTimeout(() => setExportStatus("idle"), 3000);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await exportService.importAll(data);
      setImportStatus("success");
      setImportError(null);
      setTimeout(() => setImportStatus("idle"), 3000);
    } catch (err) {
      setImportStatus("error");
      setImportError(err instanceof Error ? err.message : "Import failed");
      setTimeout(() => setImportStatus("idle"), 5000);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClearData = async () => {
    await db.mediaItems.clear();
    await db.episodeProgress.clear();
    await db.tmdbCache.clear();
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-slate-700 p-2">
          <SettingsIcon className="h-6 w-6 text-slate-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-slate-400">
            Manage your data and preferences
          </p>
        </div>
      </div>

      {/* Data Summary */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Your Data</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-800/50 p-4">
            <p className="text-2xl font-bold">{counts.mediaCount}</p>
            <p className="text-sm text-slate-400">Movies & TV Shows</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <p className="text-2xl font-bold">{counts.episodeCount}</p>
            <p className="text-sm text-slate-400">Episode Progress Records</p>
          </div>
        </div>
      </Card>

      {/* Export/Import */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Backup & Restore</h2>
        <p className="text-sm text-slate-400">
          Export your data as a JSON file or import from a previous backup.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleExport} variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            {exportStatus === "success" ? "Exported!" : "Export Data"}
            {exportStatus === "success" && <Check className="h-4 w-4 ml-2 text-emerald-400" />}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <Button onClick={handleImportClick} variant="secondary">
            <Upload className="h-4 w-4 mr-2" />
            {importStatus === "success" ? "Imported!" : "Import Data"}
            {importStatus === "success" && <Check className="h-4 w-4 ml-2 text-emerald-400" />}
            {importStatus === "error" && <X className="h-4 w-4 ml-2 text-red-400" />}
          </Button>
        </div>

        {importError && (
          <p className="text-sm text-red-400">{importError}</p>
        )}
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-900/50">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        </div>

        {!showClearConfirm ? (
          <div>
            <p className="text-sm text-slate-400 mb-4">
              Permanently delete all your data. This action cannot be undone.
            </p>
            <Button
              onClick={() => setShowClearConfirm(true)}
              variant="danger"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        ) : (
          <div className="rounded-lg bg-red-900/20 p-4">
            <p className="text-sm text-red-300 mb-4">
              Are you sure? This will delete {counts.mediaCount} items and{" "}
              {counts.episodeCount} episode records permanently.
            </p>
            <div className="flex gap-3">
              <Button onClick={handleClearData} variant="danger">
                Yes, Delete Everything
              </Button>
              <Button
                onClick={() => setShowClearConfirm(false)}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* About */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-2">About Up Next</h2>
        <p className="text-sm text-slate-400">
          A local-first movie and TV show tracker. Your data is stored locally
          in your browser using IndexedDB and never leaves your device.
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Powered by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:underline"
          >
            TMDB
          </a>
        </p>
      </Card>
    </div>
  );
}
