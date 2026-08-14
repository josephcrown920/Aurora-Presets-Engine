import p1 from "@/assets/p1.asset.json";
import p2 from "@/assets/p2.asset.json";
import p3 from "@/assets/p3.asset.json";
import p4 from "@/assets/p4.asset.json";
import p5 from "@/assets/p5.asset.json";
import p6 from "@/assets/p6.asset.json";
import p7 from "@/assets/p7.asset.json";
import p8 from "@/assets/p8.asset.json";

export type TargetModel = {
  id: string;
  label: string;
  kind: "video" | "image";
  /** How this engine likes prompts shaped. */
  style: "cinematic-block" | "tag-stack" | "natural" | "json-ish";
};

export const TARGET_MODELS: TargetModel[] = [
  { id: "wan", label: "Wan", kind: "video", style: "cinematic-block" },
  { id: "seedance-2.5", label: "Seedance 2.5", kind: "video", style: "cinematic-block" },
  { id: "seedance-5.0", label: "Seedance 5.0", kind: "video", style: "json-ish" },
  { id: "kling", label: "Kling", kind: "video", style: "natural" },
  { id: "omni", label: "Omni", kind: "video", style: "json-ish" },
  { id: "seedream", label: "Seedream", kind: "image", style: "tag-stack" },
  { id: "grok-imagine", label: "Grok Imagine", kind: "image", style: "natural" },
  { id: "gpt-2", label: "GPT-2 Image", kind: "image", style: "natural" },
  { id: "flux", label: "Flux", kind: "image", style: "tag-stack" },
];

export type Preset = {
  id: string;
  name: string;
  source: "image" | "video";
  thumb: string;
  tags: string[];
  /** The reusable style DNA. Subject is intentionally swappable. */
  dna: {
    subject: string;
    camera: string;
    lens: string;
    lighting: string;
    grade: string;
    texture: string;
    motion: string;
    mood: string;
    negative: string;
  };
};

export const SEED_PRESETS: Preset[] = [
  {
    id: "boot-grass",
    name: "Boot On The Beat",
    source: "image",
    thumb: p1.url,
    tags: ["ground-level", "midday sun", "red/green clash"],
    dna: {
      subject: "a rapper in a red leather jacket and iced-out chain lying flat in dry grass, a black Chelsea boot pressing down on his shoulder",
      camera: "ultra-low ground-level angle, camera resting in the grass, subject filling the lower two thirds of frame",
      lens: "24mm wide, f/2.0, close focus with soft falloff into blurred trees and sky",
      lighting: "harsh natural midday sun from behind camera-left, specular hot spots on leather and diamonds, deep contact shadows",
      grade: "saturated digital color, punchy reds pushed hot, cyan sky, warm dry-grass yellows, crushed neutral blacks",
      texture: "clean high-resolution capture, faint sharpening halo, slight chromatic edge on highlights",
      motion: "locked-off frame, only grass blades trembling in wind",
      mood: "defiant, humiliated-but-unbothed, street-editorial",
      negative: "studio lighting, flat grade, cluttered background, motion blur",
    },
  },
  {
    id: "burning-house",
    name: "This Is Fine (Inferno)",
    source: "image",
    thumb: p2.url,
    tags: ["meme frame", "fire backlight", "dusk"],
    dna: {
      subject: "a rapper in a washed black graphic tee, orange knit beanie and layered chains, arms crossed, looking off-frame while the house behind him burns",
      camera: "eye-level medium shot, subject right of center, burning two-story house filling the left background",
      lens: "35mm, f/2.8, subject sharp, flames slightly soft with visible ember bokeh",
      lighting: "massive orange firelight from behind and left, cool blue dusk ambient fill on the face, rim glow on shoulders",
      grade: "high-contrast orange-and-teal, blown fire core, smoke desaturated to charcoal grey",
      texture: "photoreal digital, floating embers and drifting smoke particles, mild lens flare",
      motion: "static subject, roaring animated flames and rising smoke column",
      mood: "deadpan calm inside catastrophe, meme-ready",
      negative: "cartoon fire, warm fill on the whole scene, tripod shake, extra people",
    },
  },
  {
    id: "studio-void",
    name: "Infinite Cyc Void",
    source: "image",
    thumb: p3.url,
    tags: ["vignette", "cyclorama", "muted"],
    dna: {
      subject: "several figures in oversized dark tailoring scattered across an empty seamless studio, one large in foreground with head bowed, mic cable snaking across the floor",
      camera: "wide static frame with a heavy circular lens vignette, deep-space staging from foreground to far background",
      lens: "40mm with strong optical vignette and edge softness, shallow-ish depth so background figures go slightly soft",
      lighting: "single huge soft toplight, gentle falloff to grey, no hard shadows",
      grade: "muted olive-grey palette, milky blacks, low saturation, film-scan warmth",
      texture: "16mm-style grain, soft halation, slight gate breathing",
      motion: "figures moving in slow disconnected gestures, camera perfectly still",
      mood: "isolated, art-film melancholy, dissociated",
      negative: "colorful set, hard rim light, busy props, fast cuts",
    },
  },
  {
    id: "pool-float",
    name: "Widescreen Float",
    source: "image",
    thumb: p4.url,
    tags: ["2.76:1", "golden hour", "water"],
    dna: {
      subject: "a shirtless man with crimson locs floating on his back in a pool, cuban chain around his neck, eyes closed, face breaking the surface",
      camera: "extreme letterbox crop, water-level side profile, subject centered horizontally",
      lens: "50mm, f/2.0, razor focus on face, background pool deck dissolved",
      lighting: "low golden-hour sun raking across the water, glittering specular highlights, soft warm skin sheen",
      grade: "teal water against warm skin, filmic rolloff, gentle bloom in highlights",
      texture: "film frame with visible black edge borders and grain, slight gate weave",
      motion: "barely-there drift, ripples radiating from the body",
      mood: "baptismal, exhausted peace",
      negative: "harsh noon light, splashing, wide aspect crop removed, oversharpening",
    },
  },
  {
    id: "mic-cops",
    name: "Golden Hour Standoff",
    source: "image",
    thumb: p5.url,
    tags: ["telephoto", "sun flare", "shallow"],
    dna: {
      subject: "a rapper in an oxblood leather jacket holding a chrome vintage mic, eyes closed mid-bar, two blurred officers charging in from behind",
      camera: "chest-up frontal shot, subject dead center, background compressed into layered bokeh",
      lens: "85mm telephoto, f/1.8, extremely shallow depth, background lights rendered as round bokeh",
      lighting: "sunset backlight blooming behind the head, warm practical street lights and police strobes as color accents",
      grade: "warm amber highlights, teal shadow blocks, gentle filmic contrast",
      texture: "clean cinema sensor look, soft anamorphic-ish flare, mild grain",
      motion: "subject still and locked, background figures motion-blurred toward camera",
      mood: "tense comedy, chased-but-focused",
      negative: "deep focus, flat daylight, background in sharp focus, wide lens distortion",
    },
  },
  {
    id: "desert-grid",
    name: "Rooftop Sunset Grid",
    source: "image",
    thumb: p6.url,
    tags: ["coverage grid", "haze", "mirror shades"],
    dna: {
      subject: "a rapper in a black tank with pendant chains and mirrored wrap sunglasses, red-tipped locs, posted on a bare concrete rooftop with a boom mic in frame",
      camera: "multi-angle coverage set: wide low hero, over-the-shoulder profile, macro on the sunglasses, top-down on the concrete",
      lens: "mixed 24mm wide and 85mm macro details, f/2.8, sun in frame at the horizon",
      lighting: "backlit sunset haze, warm dust in the air, subject falling into partial silhouette",
      grade: "dusty orange-brown highlights, blue-grey shadows, lifted milky blacks",
      texture: "hazy diffusion filter, heavy atmospheric bloom, fine grain",
      motion: "slow drifting handheld, subtle breathing frame, cut every 1-2 seconds",
      mood: "sun-bleached, cocky, low-budget-video-turned-cinematic",
      negative: "night scene, clean crisp air, neon colors, static tripod",
    },
  },
  {
    id: "clip-one",
    name: "Alley Pin (9:16)",
    source: "video",
    thumb: p7.url,
    tags: ["vertical", "overcast", "brick"],
    dna: {
      subject: "a man in a studded black leather jacket pinned face-down on wet alley asphalt, red locs spilling out, a boot on his back",
      camera: "vertical 9:16 frame with letterbox bars, low ground-level angle looking down the alley",
      lens: "28mm, f/2.8, mid-depth so graffiti brick stays readable",
      lighting: "flat overcast daylight, no direct sun, soft even shadows",
      grade: "desaturated cool grade, brick reds muted, greens pulled toward grey",
      texture: "slightly compressed social-video look, fine noise in shadows",
      motion: "near-static shot with micro handheld float, subject's eyes flicking to lens",
      mood: "cold, documentary street menace",
      negative: "sunny sky, saturated colors, drone move, crowd",
    },
  },
  {
    id: "clip-two",
    name: "Snow Umbrella Selfie",
    source: "video",
    thumb: p8.url,
    tags: ["selfie POV", "blue hour", "snow"],
    dna: {
      subject: "a man in a glossy black puffer under a clear dome umbrella, red-tipped twists, rapping straight into the lens at blue hour in a snowfield",
      camera: "handheld selfie POV, arm's-length low angle, subject filling the vertical frame, umbrella ribs framing the top",
      lens: "phone ultra-wide 16mm equivalent, deep focus, mild edge distortion",
      lighting: "cold ambient blue-hour skylight, distant warm city lights as bokeh points, soft specular sheen on the puffer",
      grade: "icy cyan-blue base with warm sodium accents, crushed but noisy blacks",
      texture: "phone-camera look, visible sensor noise, snow specks on the umbrella",
      motion: "constant small handheld sway, breath fog, snow drifting",
      mood: "raw, freezing, straight-to-camera confessional",
      negative: "cinema camera polish, tripod stability, daylight, warm overall grade",
    },
  },
];

export function formatPrompt(preset: Preset, model: TargetModel, subjectOverride?: string) {
  const d = preset.dna;
  const subject = (subjectOverride?.trim() || d.subject).replace(/\s+/g, " ");
  const isVideo = model.kind === "video";

  if (model.style === "json-ish") {
    return JSON.stringify(
      {
        subject,
        camera: d.camera,
        lens: d.lens,
        lighting: d.lighting,
        color_grade: d.grade,
        texture: d.texture,
        ...(isVideo ? { motion: d.motion } : {}),
        mood: d.mood,
        negative_prompt: d.negative,
      },
      null,
      2,
    );
  }

  if (model.style === "tag-stack") {
    const tags = [
      subject,
      d.camera,
      d.lens,
      d.lighting,
      d.grade,
      d.texture,
      d.mood,
      "highly detailed, photoreal",
    ];
    return `${tags.join(", ")}\n\n--no ${d.negative}`;
  }

  if (model.style === "natural") {
    return [
      `${subject}.`,
      `Shot ${d.camera.toLowerCase()} on a ${d.lens}.`,
      `${d.lighting.charAt(0).toUpperCase()}${d.lighting.slice(1)}.`,
      `Color: ${d.grade}. Texture: ${d.texture}.`,
      isVideo ? `Motion: ${d.motion}.` : null,
      `Overall mood: ${d.mood}.`,
      `Avoid: ${d.negative}.`,
    ]
      .filter(Boolean)
      .join(" ");
  }

  // cinematic-block
  return [
    `SUBJECT: ${subject}`,
    `SHOT: ${d.camera}`,
    `LENS: ${d.lens}`,
    `LIGHT: ${d.lighting}`,
    `GRADE: ${d.grade}`,
    `TEXTURE: ${d.texture}`,
    isVideo ? `MOTION: ${d.motion}` : null,
    `MOOD: ${d.mood}`,
    `NEGATIVE: ${d.negative}`,
  ]
    .filter(Boolean)
    .join("\n");
}
