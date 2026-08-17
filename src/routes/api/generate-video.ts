import { createFileRoute } from "@tanstack/react-router";

const FALLBACKS = ["google/veo-3.1-lite", "google/veo-3.1-fast", "google/veo-3.1"];

export const Route = createFileRoute("/api/generate-video")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const {
          prompt,
          engine,
          reference,
          seconds = "8",
          size = "1280x720",
        } = (await request.json()) as {
          prompt?: string;
          engine?: string;
          reference?: string;
          seconds?: string;
          size?: string;
        };
        if (!prompt) return new Response("Missing prompt", { status: 400 });

        const chain = [engine, ...FALLBACKS].filter(
          (m, i, a): m is string => Boolean(m) && a.indexOf(m) === i,
        );

        let lastStatus = 502;
        let lastMsg = "Video generation failed";

        for (const model of chain) {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/videos", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model,
              prompt,
              seconds,
              size,
              ...(reference?.startsWith("data:image") ? { input_reference: reference } : {}),
            }),
          });

          if (!res.ok) {
            const err = (await res.json().catch(() => null)) as { message?: string } | null;
            lastStatus = res.status;
            lastMsg = err?.message ?? lastMsg;
            if (res.status === 402 || res.status === 429) break;
            continue;
          }

          const job = (await res.json()) as { id: string };
          return new Response(JSON.stringify({ id: job.id, engine: model }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ error: lastMsg }), {
          status: lastStatus,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
