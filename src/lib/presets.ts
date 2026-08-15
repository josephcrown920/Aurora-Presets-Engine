import p1 from "@/assets/p1.asset.json";
import p2 from "@/assets/p2.asset.json";
import p3 from "@/assets/p3.asset.json";
import p4 from "@/assets/p4.asset.json";
import p5 from "@/assets/p5.asset.json";
import p6 from "@/assets/p6.asset.json";
import p7 from "@/assets/p7.asset.json";
import p8 from "@/assets/p8.asset.json";
import q1 from "@/assets/q1.asset.json";
import q2 from "@/assets/q2.asset.json";
import q3 from "@/assets/q3.asset.json";
import q4 from "@/assets/q4.asset.json";
import q5 from "@/assets/q5.asset.json";
import q6 from "@/assets/q6.asset.json";
import q7 from "@/assets/q7.asset.json";
import q8 from "@/assets/q8.asset.json";
import q9 from "@/assets/q9.asset.json";

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
    /** Optional VFX / transition recipe: glitch, teleport, morph, datamosh, etc. */
    vfx?: string;
    negative: string;
  };
};

export const SEED_PRESETS: Preset[] = [
  {
    id: "desert-newspaper",
    name: "Calm Amid Wreckage",
    source: "image",
    thumb: q1.url,
    tags: ["overcast desert", "burning car", "fashion editorial"],
    dna: {
      subject: "a young man in a slim black suit and tie sitting cross-legged on a red folding chair in an empty desert, reading a broadsheet newspaper while a graffitied car burns behind him",
      camera: "vertical 9:16 full-body frame, eye-level slightly low, subject centered with the burning car upper-right and a huge empty foreground of cracked dirt",
      lens: "35mm, f/4, deep enough focus that the car and horizon stay legible",
      lighting: "flat white overcast sky as a giant softbox, no shadows on the subject, the fire adding a small warm kick on the right",
      grade: "desaturated sand and bone-grey palette with the fire and chair red as the only saturated notes, milky lifted blacks",
      texture: "high-res editorial digital capture, fine dust in the air, gentle film curve",
      motion: "locked wide shot, only smoke rolling and newspaper pages flexing in the wind",
      mood: "detached luxury nihilism, absurdist fashion editorial",
      negative: "golden hour, blue sky, crowds, dramatic camera moves, heavy vignette",
    },
  },
  {
    id: "indoor-range",
    name: "Lane 11 Profile",
    source: "image",
    thumb: q2.url,
    tags: ["fluorescent", "hard flash", "profile"],
    dna: {
      subject: "a lean figure in a laced black leather vest, grey cap and ear defenders, arms extended down a shooting lane, brass casing frozen in the air",
      camera: "tight vertical profile from behind-left, subject occupying the left half, lane geometry receding to a paper target on the right",
      lens: "28mm, f/2.8, close subject with the lane falling away into soft depth",
      lighting: "overhead fluorescent tubes plus a hard direct on-camera flash, hot specular sheen on skin and leather, black surroundings swallowing all fill",
      grade: "near-monochrome charcoal with warm skin and a single orange target accent, deep clipped blacks",
      texture: "phone-flash look, crisp micro-contrast, slight highlight clipping",
      motion: "held stance with a single recoil snap, casing arcing out of frame",
      mood: "clinical, controlled, cold adrenaline",
      negative: "warm ambient light, wide establishing shot, soft diffusion, colorful background",
    },
  },
  {
    id: "vfx-breakdown",
    name: "VFX Breakdown Split",
    source: "video",
    thumb: q3.url,
    tags: ["breakdown", "annotation", "acid green"],
    dna: {
      subject: "a driver mugging to camera in a red convertible on a black stage, shown as a finished shot with an inset ORIGINAL reference and a top-down diagram of the car with a robot arm path",
      camera: "stacked layout: hero shot on top, small labelled inset in the lower-right corner, orthographic top-down plate below, separated by black title bands",
      lens: "hero on 50mm at f/2.8, inset on a wider lens, top-down as a flat orthographic render",
      lighting: "black-limbo studio lighting, hard specular streaks along the car body, faces lit by a single soft key",
      grade: "crushed black stage, saturated red bodywork and orange leather, neutral skin",
      texture: "clean commercial polish plus UI overlay graphics, acid-green vector callouts and bold white caption type",
      motion: "hard cut between original and final on beat, animated green arrows drawing the rig path, caption cards punching in",
      mood: "technical flex, behind-the-scenes bragging",
      vfx: "split-screen before/after wipe, inset picture-in-picture with rounded label pill, animated vector rig-path overlay, kinetic caption cards on cut",
      negative: "handheld shake, daylight location, muted graphics, slow dissolves",
    },
  },
  {
    id: "vfx-reflections",
    name: "Reflection Pass Breakdown",
    source: "video",
    thumb: q4.url,
    tags: ["mirror shot", "breakdown", "limbo"],
    dna: {
      subject: "a face seen only in a rear-view mirror of a red convertible, with an ORIGINAL inset and a top-down rig diagram labelled below",
      camera: "hood-level frame filling with dark dashboard and windshield, the mirror as the sole point of interest in the upper third",
      lens: "24mm close on the mirror, f/4, deep focus so the reflection and dash both read",
      lighting: "very low-key stage light, most of the frame in shadow, a narrow soft source on the reflected face",
      grade: "near-black frame with red bodywork bleeding in from the edges, cool shadow tint",
      texture: "sharp commercial render, faint dust on glass, bold overlay typography",
      motion: "static plate with a slow reveal of the reflection, then a cut to the diagram with green arrows animating in",
      mood: "sleek, mysterious, technical",
      vfx: "mirror/reflection-only reveal, before-after inset, animated annotation arrows, hard graphic title band transitions",
      negative: "bright ambient light, full face in direct frame, shaky camera, warm daylight",
    },
  },
  {
    id: "blue-cyc-inferno",
    name: "Blue Cyc Inferno",
    source: "image",
    thumb: q5.url,
    tags: ["blue cyc", "dobermans", "burning car"],
    dna: {
      subject: "a man in an all-black tee, beanie and locs seated on a wooden apple box flanked by two chained dobermans, a yellow convertible engulfed in flame behind him",
      camera: "symmetrical square frontal portrait, subject dead center at eye level, dogs anchoring both lower corners",
      lens: "50mm, f/4, whole tableau in focus, mild compression",
      lighting: "even studio key on the subject plus enormous orange firelight from behind, cool blue cyc ambience filling the shadows",
      grade: "electric cobalt background against blown orange fire, rich blacks, warm skin held neutral",
      texture: "clean AI-render sheen, glossy highlights, crisp flame edges",
      motion: "statue-still subject and dogs, only the fire and black smoke alive",
      mood: "cold-blooded album-cover power pose",
      negative: "location background, natural daylight, off-center framing, motion blur",
    },
  },
  {
    id: "balaclava-cyc",
    name: "Balaclava Blue VHS",
    source: "image",
    thumb: q6.url,
    tags: ["VHS", "balaclava", "grid backdrop"],
    dna: {
      subject: "a figure in a black balaclava and crew neck with a heavy silver chain seated on a stool between two dobermans, a burning supercar to the right",
      camera: "slightly loose eye-level frame with a visible grid-marked backdrop edge on the left, subject left of center",
      lens: "40mm, f/4, softly resolved, mild edge smear",
      lighting: "flat blue-grey studio wash with a warm fire glow spilling from the right side",
      grade: "muted steel blue, low saturation, milky blacks, warm fire kept dim",
      texture: "degraded VHS-transfer look: soft detail, chroma bleed, faint scanlines and tape noise",
      motion: "near-static tableau, tape wobble in the frame edges, flickering fire",
      mood: "anonymous, menacing, lo-fi archive",
      vfx: "VHS chroma bleed, scanline overlay, tracking-error jitter, occasional one-frame glitch displacement",
      negative: "crisp 4K clarity, warm overall grade, daylight, clean stabilized frame",
    },
  },
  {
    id: "red-limbo-quad",
    name: "Red Limbo Quad Grid",
    source: "video",
    thumb: q7.url,
    tags: ["2x2 grid", "red gradient", "supercar"],
    dna: {
      subject: "a man in a red pinstripe shirt over a white tank, durag and black shades, posted across four angles on and beside a white Lamborghini",
      camera: "2x2 coverage grid: full-car wide with door up, low frontal hero on the hood, tight macro on the face and wheel, and a three-quarter seated pose",
      lens: "mixed 24mm wide for the car and 85mm for the face, f/2.8, subject always sharp",
      lighting: "studio limbo with a warm orange gradient wash on the backdrop, hard side kickers raking the white bodywork, one angle dropped to near black",
      grade: "hot orange-to-crimson background against pure white car and deep blacks, high saturation",
      texture: "slightly compressed music-video look, mild grain, glossy specular highlights",
      motion: "slow push and orbit moves per angle, cuts on the beat every 1-2 seconds",
      mood: "expensive, cocky, early-2010s luxury video revival",
      vfx: "quad-split grid layout, beat-synced hard cuts, occasional strobe flash frame between angles",
      negative: "outdoor location, daylight, muted palette, static single angle",
    },
  },
  {
    id: "boot-macro",
    name: "Boot Macro Pin",
    source: "image",
    thumb: q8.url,
    tags: ["extreme close-up", "wide crop", "sunlit grass"],
    dna: {
      subject: "an extreme close-up of a man's face flat in dry grass with red-tipped locs, a black Chelsea boot pressed onto his head, a two-tone car blurred behind",
      camera: "letterboxed wide crop, camera resting in the grass inches from the face, boot entering from the top of frame",
      lens: "35mm at close focus, f/2.0, eyelashes sharp while the car and buildings dissolve",
      lighting: "bright natural sun from the upper left, sweat-sheen specular on skin, soft bounced fill from the grass",
      grade: "punchy naturalistic color, teal-green car against warm skin, deep but detailed blacks",
      texture: "cinema-sensor clarity with visible skin pores, gentle highlight rolloff",
      motion: "locked macro frame, eyes flicking to lens, grass trembling",
      mood: "comic humiliation played straight, uncomfortably intimate",
      negative: "wide establishing shot, flat overcast light, background in focus, handheld shake",
    },
  },
  {
    id: "suburban-cereal",
    name: "Suburban Autumn Deadpan",
    source: "image",
    thumb: q9.url,
    tags: ["autumn street", "symmetrical", "surreal prop"],
    dna: {
      subject: "a man in a red-and-blue striped knit sweater, black durag with beaded braids and huge black trousers standing in a suburban street pouring milk into a cereal bowl mid-verse",
      camera: "vertical 9:16 full-body centered frame, eye-level, road leading straight back to a canopy of autumn trees",
      lens: "35mm, f/2.8, subject sharp with a softly compressed street behind",
      lighting: "warm low-angle afternoon sun filtering through leaves, soft even light on the face, gentle rim on the shoulders",
      grade: "warm amber and rust foliage against sweater red and powder blue, creamy filmic highlights",
      texture: "clean digital cinema with a soft diffusion filter and light bloom",
      motion: "static locked frame, subject rapping to lens while milk pours in slow steady stream",
      mood: "deadpan absurdist comedy, cozy but off-kilter",
      negative: "night scene, cool grade, cluttered crowd, fast whip pans",
    },
  },
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
        ...(d.vfx ? { vfx: d.vfx } : {}),
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
      ...(d.vfx ? [d.vfx] : []),
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
      d.vfx ? `Effects: ${d.vfx}.` : null,
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
    d.vfx ? `VFX: ${d.vfx}` : null,
    `MOOD: ${d.mood}`,
    `NEGATIVE: ${d.negative}`,
  ]
    .filter(Boolean)
    .join("\n");
}
