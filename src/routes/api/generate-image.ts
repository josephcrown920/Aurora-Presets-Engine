import { createFileRoute } from "@tanstack/react-router";

const FALLBACKS = [
  "google/gemini-3.1-flash-image",
  "google/gemini-3-pro-image",
  "openai/gpt-image-2",
  "google/gemini-2.5-flash-image",
];

function dataUrlToBytes(dataUrl: string) {
  const [head, b64] = dataUrl.split(",");
  const mime = /data:([^;]+)/.exec(head ?? "")?.[1] ?? "image/png";
  const bin = atob(b64 ?? "");
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { bytes, mime };
}

function buildRequest(
  model: string,
  prompt: string,
  reference: string | undefined,
  stream: boolean,
) {
  const isOpenAI = model.startsWith("openai/");

  if (isOpenAI && reference) {
    const { bytes, mime } = dataUrlToBytes(reference);
    const form = new FormData();
    form.append("model", model);
    form.append("prompt", prompt);
    form.append("image", new Blob([bytes], { type: mime }), "reference.png");
    form.append("quality", "low");
    if (stream) {
      form.append("stream", "true");
      form.append("partial_images", "1");
    }
    return { url: "https://ai.gateway.lovable.dev/v1/images/edits", body: form, json: false };
  }

  if (isOpenAI) {
    return {
      url: "https://ai.gateway.lovable.dev/v1/images/generations",
      body: JSON.stringify({
        model,
        prompt,
        quality: "low",
        ...(stream ? { stream: true, partial_images: 1 } : {}),
      }),
      json: true,
    };
  }

  // Gemini image models: chat shape, reference image as an image_url block.
  const content = reference
    ? [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: reference } },
      ]
    : prompt;

  return {
    url: "https://ai.gateway.lovable.dev/v1/images/generations",
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content }],
      modalities: ["image", "text"],
      ...(stream ? { stream: true } : {}),
    }),
    json: true,
  };
}

export const Route = createFileRoute("/api/generate-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const {
          prompt,
          engine,
          reference,
          stream = true,
        } = (await request.json()) as {
          prompt?: string;
          engine?: string;
          reference?: string;
          stream?: boolean;
        };
        if (!prompt) return new Response("Missing prompt", { status: 400 });

        const chain = [engine, ...FALLBACKS].filter(
          (m, i, a): m is string => Boolean(m) && a.indexOf(m) === i,
        );

        let lastStatus = 502;
        let lastText = "Image generation failed";

        for (const model of chain) {
          const req = buildRequest(model, prompt, reference, stream);
          const upstream = await fetch(req.url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              ...(req.json ? { "Content-Type": "application/json" } : {}),
            },
            body: req.body as BodyInit,
          });

          if (!upstream.ok || !upstream.body) {
            lastStatus = upstream.status;
            lastText = (await upstream.text().catch(() => "")).slice(0, 300) || lastText;
            // Credits / rate limit are terminal — no point trying other engines.
            if (upstream.status === 402 || upstream.status === 429) break;
            continue;
          }

          return new Response(upstream.body, {
            headers: {
              "Content-Type": stream ? "text/event-stream" : "application/json",
              "Cache-Control": "no-cache",
              "X-Engine-Used": model,
            },
          });
        }

        return new Response(lastText, { status: lastStatus });
      },
    },
  },
});
