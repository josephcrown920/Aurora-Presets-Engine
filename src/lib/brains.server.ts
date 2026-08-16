/**
 * "Brain" routing: a chain of reasoning models tried in order.
 * If a model is unavailable, rate limited (429) or errors (5xx / 400 model
 * rejection), we fall through to the next one. The label is what the UI shows.
 */
export type Brain = { label: string; model: string };

export const BRAIN_CHAIN: Brain[] = [
  { label: "Gemini 3.6 Flash", model: "google/gemini-3.6-flash" },
  { label: "GPT-5.2", model: "openai/gpt-5.2" },
  { label: "Gemini 3.1 Pro", model: "google/gemini-3.1-pro-preview" },
  { label: "Gemini 2.5 Pro", model: "google/gemini-2.5-pro" },
  { label: "Gemini 2.5 Flash", model: "google/gemini-2.5-flash" },
];

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: unknown;
};

export type BrainResult = { text: string; brain: Brain };

/** Calls the brain chain until one returns text. Throws if all fail. */
export async function callBrain(
  key: string,
  messages: ChatMessage[],
  opts: { chain?: Brain[] } = {},
): Promise<BrainResult> {
  const chain = opts.chain?.length ? opts.chain : BRAIN_CHAIN;
  const failures: string[] = [];

  for (const brain of chain) {
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: brain.model, messages }),
      });

      if (!res.ok) {
        const detail = (await res.text().catch(() => "")).slice(0, 200);
        failures.push(`${brain.model}: ${res.status} ${detail}`);
        // 402 (no credits) is terminal for every model in the chain.
        if (res.status === 402) throw new Error("AI credits exhausted for this workspace.");
        continue;
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: unknown } }[];
      };
      const content = json.choices?.[0]?.message?.content;
      const text =
        typeof content === "string"
          ? content
          : Array.isArray(content)
            ? content
                .map((c) =>
                  typeof c === "object" && c && "text" in c ? String((c as { text: unknown }).text) : "",
                )
                .join("")
            : "";
      if (!text.trim()) {
        failures.push(`${brain.model}: empty response`);
        continue;
      }
      return { text, brain };
    } catch (e) {
      if (e instanceof Error && e.message.includes("credits")) throw e;
      failures.push(`${brain.model}: ${e instanceof Error ? e.message : "failed"}`);
    }
  }

  throw new Error(`All brains failed — ${failures.join(" | ")}`);
}

/** Pulls the first JSON object out of a model response. */
export function extractJson(text: string): Record<string, unknown> | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as Record<string, unknown>;
  } catch {
    return null;
  }
}
