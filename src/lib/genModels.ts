/** Generation engines available in the Studio (client-safe metadata). */
export type GenEngine = {
  id: string;
  label: string;
  kind: "image" | "video";
  note: string;
};

export const IMAGE_ENGINES: GenEngine[] = [
  { id: "google/gemini-3.1-flash-image", label: "Nano Banana 2", kind: "image", note: "fast, keeps your reference" },
  { id: "google/gemini-3-pro-image", label: "Gemini 3 Pro Image", kind: "image", note: "highest fidelity" },
  { id: "openai/gpt-image-2", label: "GPT-Image-2", kind: "image", note: "text & typography" },
];

export const VIDEO_ENGINES: GenEngine[] = [
  { id: "google/veo-3.1-lite", label: "Veo 3.1 Lite", kind: "video", note: "cheapest, ~40s" },
  { id: "google/veo-3.1-fast", label: "Veo 3.1 Fast", kind: "video", note: "better motion" },
  { id: "google/veo-3.1", label: "Veo 3.1", kind: "video", note: "top quality, priciest" },
];

export const VIDEO_SIZES = [
  { id: "1280x720", label: "16:9 720p" },
  { id: "720x1280", label: "9:16 720p" },
] as const;

export const VIDEO_SECONDS = ["4", "6", "8"] as const;
