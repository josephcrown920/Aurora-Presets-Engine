import { useState } from "react";
import { Copy, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrompt, type Preset, type TargetModel } from "@/lib/presets";

export function PresetCard({
  preset,
  model,
  subject,
}: {
  preset: Preset;
  model: TargetModel;
  subject: string;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const prompt = formatPrompt(preset, model, subject);

  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <article className="panel overflow-hidden">
      <div className="relative aspect-video overflow-hidden bg-secondary">
        {preset.thumb ? (
          <img
            src={preset.thumb}
            alt={`${preset.name} style reference`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="label-kicker">extracted clip</span>
          </div>
        )}

        <div className="film-grain absolute inset-0" />
        <span className="label-kicker absolute left-2 top-2 rounded-sm bg-background/80 px-2 py-1 text-foreground">
          {preset.source}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-2xl">{preset.name}</h3>
          <Button size="sm" variant="secondary" onClick={copy} className="shrink-0">
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {preset.tags.map((t) => (
            <span
              key={t}
              className="label-kicker rounded-sm border border-border px-2 py-1 text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        <pre className="max-h-44 overflow-auto rounded-sm bg-background/60 p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-foreground/90">
          {prompt}
        </pre>

        <button
          onClick={() => setOpen((v) => !v)}
          className="label-kicker flex w-full items-center justify-between hover:text-foreground"
        >
          Style DNA
          <ChevronDown
            className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <dl className="grid gap-2 border-t border-border pt-3 text-xs">
            {Object.entries(preset.dna).map(([k, v]) => (
              <div key={k}>
                <dt className="label-kicker">{k}</dt>
                <dd className="text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}
