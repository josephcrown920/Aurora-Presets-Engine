# Embedding Aurora Preset Engine

The full Preset Engine is available at `/embed`. The route mounts the same editor as the standalone page, inside an iframe document, so its existing typography, spacing, and controls remain unchanged in Aurora.

## Deployment configuration

Set `AURORA_EMBED_ALLOWED_ORIGINS` to a comma-separated list of exact origins that may frame the editor:

```text
https://your-aurora.replit.app,https://your-production-domain.example
```

Framing is controlled by CSP `frame-ancestors`. `X-Frame-Options` is intentionally not set for `/embed`, because it would block cross-origin Aurora embeds.

## Host integration

```tsx
<AuroraEmbed
  kind="presets-engine"
  src="https://your-presets-engine-domain/embed"
  title="Aurora Preset Engine"
/>
```

Aurora Global's `AuroraEmbed` component listens only to this iframe's origin and adjusts its height without injecting any host styling into the editor.