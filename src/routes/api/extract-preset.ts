import { createFileRoute } from "@tanstack/react-router";

const FIELDS = [
  "name",
  "subject",
  "camera",
  "lens",
  "lighting",
  "grade",
  "texture",
  "motion",
  "mood",
  "negative",
  "tags",
] as const;

const SYSTEM = `You are a cinematography and prompt-engineering analyst. You look at a reference image or video and reverse-engineer its VISUAL STYLE into a reusable preset that can be applied to any other subject.

Return ONLY minified JSON with these keys:
{"name":string (3-4 word preset title),"subject":string (what is literally in the reference, one sentence),"camera":string (framing, angle, staging),"lens":string (focal length, aperture, depth of field),"lighting":string (sources, direction, quality, contrast),"grade":string (color palette, contrast, blacks),"texture":string (grain, sharpness, artifacts, filtration),"motion":string (camera + subject movement, editing pace),"mood":string,"negative":string (comma separated things to avoid),"tags":string[] (3 short lowercase tags)}

Be concrete and technical. No markdown, no commentary.`;

export const Route = createFileRoute("/api/extract-preset")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const body = (await request.json()) as {
          dataUrl?: string;
          kind?: "image" | "video";
        };
        if (!body.dataUrl) return new Response("Missing media", { status: 400 });

        const block =
          body.kind === "video"
            ? { type: "video_url", video_url: { url: body.dataUrl } }
            : { type: "image_url", image_url: { url: body.dataUrl } };

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Lovable-API-Key": key,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3.6-flash",
            messages: [
              { role: "system", content: SYSTEM },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Extract the reusable style preset from this reference.",
                  },
                  block,
                ],
              },
            ],
          }),
        });

        if (!upstream.ok) {
          const text = await upstream.text().catch(() => "");
          return new Response(text || "Analysis failed", { status: upstream.status });
        }

        const json = (await upstream.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const raw = json.choices?.[0]?.message?.content ?? "";
        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) return new Response("Could not parse style", { status: 502 });

        let parsed: Record<string, unknown>;
        try {
          parsed = JSON.parse(match[0]) as Record<string, unknown>;
        } catch {
          return new Response("Could not parse style", { status: 502 });
        }

        const out: Record<string, unknown> = {};
        for (const f of FIELDS) {
          out[f] = parsed[f] ?? (f === "tags" ? [] : "");
        }

        return new Response(JSON.stringify(out), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
