import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { postEmbedReady, startEmbedHeightReporting } from "@/lib/embedFrame";
import { PresetsEngineStudio } from "./index";

const DEFAULT_FRAME_ANCESTORS = [
  "'self'",
  "https://*.replit.app",
  "https://*.replit.dev",
  "https://*.repl.co",
];

function frameAncestors(): string {
  const configured = (process.env["AURORA_EMBED_ALLOWED_ORIGINS"] ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => /^https:\/\/(\*\.)?[a-z0-9.-]+(?::\d{1,5})?$/i.test(origin));
  return (configured.length > 0 ? ["'self'", ...configured] : DEFAULT_FRAME_ANCESTORS).join(" ");
}

export const Route = createFileRoute("/embed")({
  component: EmbedPage,
  headers: () => ({
    "Content-Security-Policy": `frame-ancestors ${frameAncestors()}`,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(self), microphone=(), geolocation=()",
    "Cross-Origin-Resource-Policy": "cross-origin",
  }),
  head: () => ({
    meta: [
      { title: "Aurora Preset Engine — Embedded Editor" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function EmbedPage() {
  useEffect(() => {
    postEmbedReady();
    return startEmbedHeightReporting();
  }, []);

  return <PresetsEngineStudio />;
}