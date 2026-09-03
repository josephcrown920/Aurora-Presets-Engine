# Connecting the Preset Engine to the main Aurora project (Replit)

Three supported paths. The iframe path is recommended: nothing about the Preset Engine's
form, typography, or purple/black palette can be overridden by the host app.

## 1. Iframe embed (recommended, keeps appearance byte-for-byte)

1. Publish this project (Lovable → Publish). You get a stable URL, e.g.
   `https://project--<id>.lovable.app`. The embed route is `.../embed`.
2. In this project, set the env var `AURORA_EMBED_ALLOWED_ORIGINS` to the exact origins of
   your Replit Aurora app, comma-separated:

   ```text
   https://your-aurora.replit.app,https://aurora.yourdomain.com
   ```

   This drives CSP `frame-ancestors` on `/embed`. Framing from any other origin is blocked.
3. Copy `docs/replit/AuroraPresetEngine.tsx` into the Replit Aurora app
   (e.g. `src/components/AuroraPresetEngine.tsx`) and render it:

   ```tsx
   import AuroraPresetEngine from "@/components/AuroraPresetEngine";

   <AuroraPresetEngine src="https://project--<id>.lovable.app/embed" />
   ```

   The component auto-resizes to the engine's content height via `postMessage`
   (origin-checked) and injects no styles into the iframe.
4. Verify: the panel renders on the Replit page with Archivo Black headings, black
   background, purple accents, and the Studio upload/generate controls on each card.

Notes:
- Works with plain React, Next.js (client component), Vite — any Replit React app.
- Deep-linking: append `?preset=<id>` support later if you want the host to open a card.
- The engine's server routes (`/api/extract-preset`, `/api/generate-image`,
  `/api/generate-video`, `/api/video-status`) stay on this deployment and keep using
  `LOVABLE_API_KEY` here. No keys move to Replit.

## 2. Continuous deployment (one source of truth, two hosts)

1. In Lovable: Plus (+) menu → GitHub → connect and push this project to a repo.
2. In Replit: import that GitHub repo (or add it as a git submodule/subtree of the Aurora
   repo) and enable auto-deploy on push to `main`.
3. Every change made in Lovable lands on GitHub, and Replit redeploys. Keep the Replit
   Aurora app pointing at the iframe URL from step 1 if you want a single running instance,
   or run the repo directly on Replit for a fully self-hosted copy.
4. If you self-host on Replit, set these env vars there: `LOVABLE_API_KEY`,
   `AURORA_EMBED_ALLOWED_ORIGINS`.

## 3. Zip / manual copy

If you prefer a snapshot: take the exported zip, unpack it beside the Aurora app, then

```bash
bun install     # or npm install
bun run dev     # serves on :8080, /embed is the embeddable view
```

Everything visual is self-contained in `src/styles.css` plus the `/embed` route, so the
appearance survives the move. If you instead copy individual components into Aurora
directly, you must also copy `src/styles.css` (tokens + fonts) or the branding will break —
which is why the iframe path is preferred.
