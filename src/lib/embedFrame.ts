/**
 * Safe host ↔ iframe messaging for the Aurora Presets Engine embed.
 */
export const EMBED_SOURCE = "aurora-presets-engine";

type EmbedMessage =
  | { source: typeof EMBED_SOURCE; type: "ready" }
  | { source: typeof EMBED_SOURCE; type: "height"; height: number };

function hostOrigin(): string | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("hostOrigin");
  if (!value) return null;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.origin : null;
  } catch {
    return null;
  }
}

function post(message: EmbedMessage) {
  if (typeof window === "undefined" || window.parent === window) return;
  window.parent.postMessage(message, hostOrigin() ?? "*");
}

export function postEmbedReady() {
  post({ source: EMBED_SOURCE, type: "ready" });
}

export function startEmbedHeightReporting(): () => void {
  if (typeof window === "undefined") return () => {};

  let lastHeight = 0;
  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      const body = document.body;
      const html = document.documentElement;
      const height = Math.ceil(
        Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.scrollHeight,
          html.offsetHeight,
          html.getBoundingClientRect().height,
        ),
      );
      if (height > 0 && Math.abs(height - lastHeight) > 1) {
        lastHeight = height;
        post({ source: EMBED_SOURCE, type: "height", height });
      }
    });
  };

  const resizeObserver = new ResizeObserver(schedule);
  resizeObserver.observe(document.body);
  resizeObserver.observe(document.documentElement);
  const mutations = new MutationObserver(schedule);
  mutations.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style", "hidden"],
  });

  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule);
  document.addEventListener("transitionend", schedule);
  document.addEventListener("animationend", schedule);
  const timers = [50, 250, 750, 1500].map((delay) => window.setTimeout(schedule, delay));
  schedule();

  return () => {
    resizeObserver.disconnect();
    mutations.disconnect();
    window.removeEventListener("resize", schedule);
    window.removeEventListener("load", schedule);
    document.removeEventListener("transitionend", schedule);
    document.removeEventListener("animationend", schedule);
    timers.forEach((timer) => window.clearTimeout(timer));
    if (frame) window.cancelAnimationFrame(frame);
  };
}