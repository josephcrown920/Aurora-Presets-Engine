import { createParser } from "eventsource-parser";
import { flushSync } from "react-dom";

type ImageEventPayload =
  | { type: "image_generation.partial_image"; b64_json: string }
  | { type: "image_generation.completed"; b64_json: string }
  | { type: "error"; error: { message: string } };

export type ImageRequest = {
  prompt: string;
  engine: string;
  /** Optional reference image as a data URL (your own photo swapped in). */
  reference?: string;
};

/** POSTs to /api/generate-image and renders every SSE frame it receives. */
export async function streamImage(
  req: ImageRequest,
  onFrame: (dataUrl: string, isFinal: boolean) => void,
): Promise<void> {
  const post = (stream: boolean) =>
    fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...req, stream }),
    });

  const res = await post(true);
  if (!res.ok || !res.body) {
    throw new Error((await res.text().catch(() => "")).slice(0, 200) || `Failed (${res.status})`);
  }

  let sawAny = false;
  let sawFinal = false;
  let streamError: string | undefined;

  const parser = createParser({
    onEvent(event) {
      let payload: ImageEventPayload | undefined;
      try {
        payload = JSON.parse(event.data) as ImageEventPayload;
      } catch {
        /* ignore */
      }
      if (event.event === "error" || payload?.type === "error") {
        sawAny = true;
        streamError =
          (payload as { error?: { message?: string } } | undefined)?.error?.message ??
          "Image generation failed";
        return;
      }
      const names = [
        "image_generation.partial_image",
        "image_generation.completed",
        "image_edit.partial_image",
        "image_edit.completed",
      ];
      if (!names.includes(event.event ?? "") || !payload) return;
      const b64 = (payload as { b64_json?: string }).b64_json;
      if (!b64) return;
      sawAny = true;
      const isFinal = (event.event ?? "").endsWith(".completed");
      flushSync(() => onFrame(`data:image/png;base64,${b64}`, isFinal));
      if (isFinal) sawFinal = true;
    },
  });

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      parser.feed(value);
    }
  } finally {
    reader.cancel().catch(() => {});
  }

  if (streamError) throw new Error(streamError);

  if (!sawAny) {
    const replay = await post(false);
    if (!replay.ok) throw new Error(`Failed (${replay.status})`);
    const json = (await replay.json()) as { data?: { b64_json?: string }[] };
    const b64 = json.data?.[0]?.b64_json;
    if (!b64) throw new Error("No image returned");
    onFrame(`data:image/png;base64,${b64}`, true);
    return;
  }
  if (!sawFinal) throw new Error("Image stream ended early");
}
