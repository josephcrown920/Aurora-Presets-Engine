import { createFileRoute } from "@tanstack/react-router";

function toBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

export const Route = createFileRoute("/api/video-status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const id = new URL(request.url).searchParams.get("id");
        if (!id) return new Response("Missing id", { status: 400 });

        const jobRes = await fetch(`https://ai.gateway.lovable.dev/v1/videos/${id}`, {
          headers: { Authorization: `Bearer ${key}` },
        });
        if (!jobRes.ok) {
          return new Response(await jobRes.text(), { status: jobRes.status });
        }
        const job = (await jobRes.json()) as {
          status: string;
          progress?: number;
          error?: { message?: string };
        };

        if (job.status === "failed") {
          return new Response(
            JSON.stringify({
              status: "failed",
              error: job.error?.message ?? "Generation was rejected",
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        }

        if (job.status !== "completed") {
          return new Response(
            JSON.stringify({ status: job.status, progress: job.progress ?? 0 }),
            { headers: { "Content-Type": "application/json" } },
          );
        }

        const contentRes = await fetch(
          `https://ai.gateway.lovable.dev/v1/videos/${id}/content`,
          { headers: { Authorization: `Bearer ${key}` } },
        );
        if (!contentRes.ok) {
          return new Response(
            JSON.stringify({ status: "failed", error: "Could not download the clip" }),
            { status: 502, headers: { "Content-Type": "application/json" } },
          );
        }
        const mp4 = await contentRes.arrayBuffer();
        return new Response(
          JSON.stringify({
            status: "completed",
            url: `data:video/mp4;base64,${toBase64(mp4)}`,
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});
