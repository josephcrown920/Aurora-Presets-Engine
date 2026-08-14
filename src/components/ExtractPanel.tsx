import { useRef, useState } from "react";
import { Upload, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Preset } from "@/lib/presets";

const MAX_BYTES = 18 * 1024 * 1024;

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export function ExtractPanel({ onExtracted }: { onExtracted: (p: Preset) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (file.size > MAX_BYTES) {
      setError("File is too large — keep it under 18MB (trim the clip first).");
      return;
    }
    const kind: "image" | "video" = file.type.startsWith("video") ? "video" : "image";
    setPreviewName(file.name);
    setBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await fetch("/api/extract-preset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, kind }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        if (res.status === 429) throw new Error("Rate limited — try again in a moment.");
        if (res.status === 402) throw new Error("AI credits exhausted for this workspace.");
        throw new Error(text.slice(0, 160) || "Extraction failed");
      }
      const d = (await res.json()) as Record<string, string> & { tags?: string[] };
      const objectUrl = kind === "image" ? URL.createObjectURL(file) : "";
      onExtracted({
        id: `x-${Date.now()}`,
        name: d.name || "Untitled Preset",
        source: kind,
        thumb: objectUrl,
        tags: (d.tags ?? []).slice(0, 4),
        dna: {
          subject: d.subject ?? "",
          camera: d.camera ?? "",
          lens: d.lens ?? "",
          lighting: d.lighting ?? "",
          grade: d.grade ?? "",
          texture: d.texture ?? "",
          motion: d.motion ?? "",
          mood: d.mood ?? "",
          negative: d.negative ?? "",
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Extraction failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="panel scan-lines p-5"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) void handleFile(f);
      }}
    >
      <p className="label-kicker">Swap in your own reference</p>
      <h2 className="mt-1 text-3xl">Drop a video or image</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        It gets read frame-by-frame for camera, lens, lighting, grade and motion — then rebuilt
        as a prompt preset you can point at any subject.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {busy ? "Reading style…" : "Choose file"}
        </Button>
        <span className="label-kicker">
          {previewName ? previewName.slice(0, 34) : "mp4 / mov / jpg / png — max 18MB"}
        </span>
      </div>

      {busy && (
        <p className="mt-3 flex items-center gap-2 text-xs text-accent">
          <Sparkles className="size-3.5" /> Reverse-engineering the look…
        </p>
      )}
      {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
    </div>
  );
}
