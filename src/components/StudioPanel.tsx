import { useRef, useState } from "react";
import { Loader2, Wand2, ImagePlus, Download, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { streamImage } from "@/lib/streamImage";
import {
  IMAGE_ENGINES,
  VIDEO_ENGINES,
  VIDEO_SECONDS,
  VIDEO_SIZES,
  type GenEngine,
} from "@/lib/genModels";

const MAX_BYTES = 8 * 1024 * 1024;

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Could not read file"));
    r.readAsDataURL(file);
  });
}

export function StudioPanel({ prompt, presetName }: { prompt: string; presetName: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"image" | "video">("image");
  const [engine, setEngine] = useState<GenEngine>(IMAGE_ENGINES[0]!);
  const [seconds, setSeconds] = useState<string>("8");
  const [size, setSize] = useState<string>("1280x720");
  const [reference, setReference] = useState<string | null>(null);
  const [refName, setRefName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageFinal, setImageFinal] = useState(false);
  const [video, setVideo] = useState<string | null>(null);

  const engines = mode === "image" ? IMAGE_ENGINES : VIDEO_ENGINES;

  const pickMode = (m: "image" | "video") => {
    setMode(m);
    setEngine((m === "image" ? IMAGE_ENGINES : VIDEO_ENGINES)[0]!);
  };

  const onFile = async (file: File) => {
    setError(null);
    if (file.size > MAX_BYTES) {
      setError("Keep the reference under 8MB.");
      return;
    }
    if (!file.type.startsWith("image")) {
      setError("Reference must be a photo — drop clips into the extractor above.");
      return;
    }
    setRefName(file.name);
    setReference(await fileToDataUrl(file));
  };

  const generate = async () => {
    setBusy(true);
    setError(null);
    setImage(null);
    setVideo(null);
    setImageFinal(false);
    try {
      if (mode === "image") {
        setStatus("Rendering with " + engine.label + "…");
        await streamImage({ prompt, engine: engine.id, reference: reference ?? undefined }, (url, final) => {
          setImage(url);
          if (final) setImageFinal(true);
        });
        setStatus(null);
      } else {
        setStatus("Queuing the clip…");
        const res = await fetch("/api/generate-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            engine: engine.id,
            seconds,
            size,
            reference: reference ?? undefined,
          }),
        });
        const created = (await res.json()) as { id?: string; error?: string };
        if (!res.ok || !created.id) throw new Error(created.error ?? "Could not start the job");

        // Poll until the clip is ready — generation runs 1-3 minutes.
        for (;;) {
          await new Promise((r) => setTimeout(r, 7000));
          const poll = await fetch(`/api/video-status?id=${created.id}`);
          const job = (await poll.json()) as {
            status: string;
            progress?: number;
            url?: string;
            error?: string;
          };
          if (job.status === "completed" && job.url) {
            setVideo(job.url);
            setStatus(null);
            break;
          }
          if (job.status === "failed") throw new Error(job.error ?? "Generation failed");
          setStatus(`Rendering… ${job.progress ?? 0}%`);
        }
      }
    } catch (e) {
      setStatus(null);
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 border-t border-border pt-3">
      <div className="flex flex-wrap items-center gap-2">
        {(["image", "video"] as const).map((m) => (
          <button
            key={m}
            onClick={() => pickMode(m)}
            className={`rounded-sm border px-2.5 py-1 font-mono text-[11px] uppercase transition-colors ${
              mode === m
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "image" ? "still" : "clip"}
          </button>
        ))}
        <span className="label-kicker ml-auto">generate in studio</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {engines.map((e) => (
          <button
            key={e.id}
            onClick={() => setEngine(e)}
            title={e.note}
            className={`rounded-sm border px-2 py-1 font-mono text-[10px] transition-colors ${
              e.id === engine.id
                ? "border-accent text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      {mode === "video" && (
        <div className="flex flex-wrap gap-1.5">
          {VIDEO_SIZES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSize(s.id)}
              className={`rounded-sm border px-2 py-1 font-mono text-[10px] ${
                s.id === size ? "border-accent text-accent" : "border-border text-muted-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
          {VIDEO_SECONDS.map((s) => (
            <button
              key={s}
              onClick={() => setSeconds(s)}
              className={`rounded-sm border px-2 py-1 font-mono text-[10px] ${
                s === seconds ? "border-accent text-accent" : "border-border text-muted-foreground"
              }`}
            >
              {s}s
            </button>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onFile(f);
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>
          <ImagePlus className="size-3.5" />
          {reference ? "Swap photo" : "Your photo"}
        </Button>
        <Button size="sm" onClick={generate} disabled={busy}>
          {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Wand2 className="size-3.5" />}
          {busy ? "Working…" : `Generate ${mode === "image" ? "still" : "clip"}`}
        </Button>
        <span className="label-kicker truncate">
          {refName ? refName.slice(0, 22) : "optional reference"}
        </span>
      </div>

      {status && <p className="text-xs text-accent">{status}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}

      {image && (
        <div className="space-y-2">
          <img
            src={image}
            alt={`${presetName} generated still`}
            className={`w-full rounded-sm transition-[filter] duration-300 ${
              imageFinal ? "blur-0" : "blur-xl"
            }`}
          />
          {imageFinal && (
            <a
              href={image}
              download={`${presetName.replace(/\s+/g, "-").toLowerCase()}.png`}
              className="label-kicker inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <Download className="size-3.5" /> download still
            </a>
          )}
        </div>
      )}

      {video && (
        <div className="space-y-2">
          <video src={video} controls playsInline className="w-full rounded-sm" />
          <a
            href={video}
            download={`${presetName.replace(/\s+/g, "-").toLowerCase()}.mp4`}
            className="label-kicker inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <Video className="size-3.5" /> download clip
          </a>
        </div>
      )}
    </div>
  );
}
