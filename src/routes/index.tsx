import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Film } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ExtractPanel } from "@/components/ExtractPanel";
import { PresetCard } from "@/components/PresetCard";
import { SEED_PRESETS, TARGET_MODELS, type Preset } from "@/lib/presets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Style DNA — Turn Any Video or Image Into a Reusable Preset" },
      {
        name: "description",
        content:
          "Drop a clip or photo and get a reusable prompt preset — camera, lens, lighting, grade and motion — formatted for Wan, Seedance, Seedream, Kling, Grok Imagine, Flux and more.",
      },
      { property: "og:title", content: "Style DNA — Reusable Prompt Presets From Any Reference" },
      {
        property: "og:description",
        content:
          "Reverse-engineer the look of any video or image into a swappable prompt preset for your favorite generation model.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PresetsEngineStudio,
});

export function PresetsEngineStudio() {
  const [modelId, setModelId] = useState(TARGET_MODELS[0]!.id);
  const [subject, setSubject] = useState("");
  const [extracted, setExtracted] = useState<Preset[]>([]);

  const model = useMemo(
    () => TARGET_MODELS.find((m) => m.id === modelId) ?? TARGET_MODELS[0]!,
    [modelId],
  );
  const presets = [...extracted, ...SEED_PRESETS];

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-10 md:py-16">
          <p className="label-kicker flex items-center gap-2">
            <Film className="size-3.5" /> preset engine v1
          </p>
          <h1 className="mt-3 text-5xl md:text-7xl">
            Turn any clip into a<span className="text-primary"> reusable look</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            Every reference below has been broken down into its style DNA. Pick your engine, swap
            the subject, copy the prompt. Same look, new scene.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-8">
        <ExtractPanel onExtracted={(p) => setExtracted((prev) => [p, ...prev])} />
      </section>

      <section className="sticky top-0 z-10 border-y border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-6xl space-y-3 px-5 py-4">
          <div>
            <p className="label-kicker mb-2">Target engine</p>
            <div className="flex flex-wrap gap-2">
              {TARGET_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModelId(m.id)}
                  className={`rounded-sm border px-3 py-1.5 font-mono text-xs transition-colors ${
                    m.id === modelId
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                  }`}
                >
                  {m.label}
                  <span className="ml-1.5 opacity-60">{m.kind === "video" ? "▶" : "▣"}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="label-kicker mb-2">Swap the subject (optional)</p>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. a woman in a white fur coat holding a burning rose"
              className="font-mono text-xs"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <p className="label-kicker mb-4">
          {presets.length} presets · formatted for {model.label}
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {presets.map((p) => (
            <PresetCard key={p.id} preset={p} model={model} subject={subject} />
          ))}
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center">
        <p className="label-kicker">style dna — presets, not screenshots</p>
      </footer>
    </main>
  );
}
