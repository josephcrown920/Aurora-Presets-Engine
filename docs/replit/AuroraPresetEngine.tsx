/**
 * Aurora Preset Engine — drop-in embed component for the main Aurora project (Replit).
 *
 * Copy this single file into your Replit Aurora app (e.g. src/components/AuroraPresetEngine.tsx)
 * and render it anywhere. It needs no styling, no Tailwind config, and no shared tokens:
 * the Preset Engine ships its own fonts and CSS inside the iframe, so its form and
 * appearance are identical to the standalone app.
 *
 *   <AuroraPresetEngine src="https://<your-preset-engine-domain>/embed" />
 */
import { useEffect, useRef, useState } from "react";

const EMBED_SOURCE = "aurora-presets-engine";

type EmbedMessage =
  | { source: typeof EMBED_SOURCE; type: "ready" }
  | { source: typeof EMBED_SOURCE; type: "height"; height: number };

export function AuroraPresetEngine({
  src,
  title = "Aurora Preset Engine",
  minHeight = 900,
  className,
}: {
  src: string;
  title?: string;
  minHeight?: number;
  className?: string;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);

  // Pass the host origin so the iframe can target postMessage precisely.
  const url = (() => {
    try {
      const u = new URL(src);
      if (typeof window !== "undefined") u.searchParams.set("hostOrigin", window.location.origin);
      return u.toString();
    } catch {
      return src;
    }
  })();

  const embedOrigin = (() => {
    try {
      return new URL(src).origin;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (embedOrigin && event.origin !== embedOrigin) return;
      const data = event.data as EmbedMessage | undefined;
      if (!data || data.source !== EMBED_SOURCE) return;
      if (data.type === "height" && Number.isFinite(data.height)) {
        setHeight(Math.max(minHeight, Math.ceil(data.height)));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [embedOrigin, minHeight]);

  return (
    <iframe
      ref={frameRef}
      src={url}
      title={title}
      className={className}
      loading="lazy"
      allow="clipboard-write; clipboard-read"
      style={{
        display: "block",
        width: "100%",
        height,
        border: 0,
        background: "#08060d",
        colorScheme: "dark",
      }}
    />
  );
}

export default AuroraPresetEngine;
