# 🌌 threejs-inspirations

A curated showcase and production library of interactive **Three.js** creative experiments, WebGL particle systems, and drop-in dynamic website backgrounds — inspired by award-winning digital experiences like [xmas.astral.de](https://xmas.astral.de/).

---

## 📁 Library Directory

### 1. `horror-particles/` // Volumetric Particle Nightmares
A 55,000-particle interactive WebGL horror experience featuring **12 mathematically sculpted 3D nightmare entities**, organic fluid morphing transitions, explosive shockwave physics, and synthesized **Web Audio API** soundscapes with zero external media dependencies.

- **Live Demo**: `horror-particles/index.html`
- **Drop-in Embed Demo**: `horror-particles/embed-demo.html`
- **One-line Embed Component**: `horror-particles/embed.js`

---

## 🔮 How to Use Any Screen as a Background in Your Website

You can embed any of the volumetric 3D particle screens behind your website's content in less than 3 minutes.

### Step 1: Include Three.js & the Embed Component
Add these script tags to your HTML:

```html
<!-- 1. Three.js Library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- 2. Entity Math Models & Embed Script -->
<script src="horror-particles/entities.js"></script>
<script src="horror-particles/embed.js"></script>
```

### Step 2: Create a Background Container Behind Your UI
```html
<div id="horror-background" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0;"></div>

<!-- Your Regular Website Content (Placed on top) -->
<div style="position: relative; z-index: 1; pointer-events: none;">
  <h1 style="color: white; padding: 40px;">Welcome To The Void</h1>
  <!-- Use pointer-events: auto on clickable buttons -->
  <button style="pointer-events: auto;">Click Me</button>
</div>
```

### Step 3: Initialize with Your Chosen Character
```javascript
const bg = new AstralHorrorBackground({
  containerId: 'horror-background',
  entity: 'demon',         // Choose from any of the 12 characters
  particleCount: 45000,    // 30k to 60k
  enableShockwave: true,   // Clicks anywhere trigger 3D particle explosions
  interactive: true        // Mouse cursor tracks gaze & creates parallax
});

// To dynamically switch characters on the fly:
bg.setEntity('wendigo');
```

---

## 👹 Character Library (12 Volumetric Monsters)

| Entity ID | Character Name | Visual Description |
| :--- | :--- | :--- |
| `wendigo` | **The Smiling Wendigo** | Gaunt elongated skull, needle fangs, razor smile, crimson pupils tracking cursor |
| `eldritch` | **Eldritch Behemoth** | 9 glowing cyclopean eyes, 12 writhing tentacles with 3D depth curvature |
| `demon` | **Horned Blood Demon** | Swept-back curved horns with incandescent magma ribs, obsidian bone, amber eyes |
| `wraith` | **Screaming Void Wraith** | Agonized open maw forming a vortex, upward streaming ectoplasmic tear trails |
| `doll` | **The Fractured Doll** | Cracked porcelain visage, stitched thread lips, dripping black void tears |
| `glitch` | **Glitch Poltergeist** | Horizontal chromatic shear, fragmented digital scanline noise, rapid jitter |
| `plague` | **The Plague Doctor** | Aged leather cowl, elongated bone beak, and toxic luminescent green goggles |
| `arachnid` | **The Arachnid Mother** | 8 burning scarlet spider eyes, interlocking chelicerae, acid venom droplets |
| `cyber` | **Cyber Demon Protocol 66** | Biomechanical titanium skull plating, data grill, laser target ocular lock |
| `leviathan` | **Leviathan of the Trench** | Abyssal deep-sea angler fish with an overhead bioluminescent lure and glass fangs |
| `reaper` | **The Soul Reaper** | Cavernous cowl, 9 jagged bone crown spikes, and violet soul-flame eyes |
| `oculus` | **The Cosmic Oculus** | Interdimensional celestial eye encircled by dual tilted stardust rings |
| `void` | **Cosmic Void** | Origin starfield of 55,000 spiraling nebular particles |

---

## 🔊 Procedural Audio & Horror Sound Effects

The audio engine (`audio.js`) runs purely on the browser's native **Web Audio API** (zero `.mp3` download latency, zero CORS issues, 100% synthesized):

1. **Atmospheric Soundtrack Modes**:
   - `Cavern of the Damned`: Subterranean sub-bass rumble (42 Hz) with breathing LFO cutoff filters.
   - `The Catacombs`: Cold bandpass drones with a synthesized periodic heartbeat pulse (`lub-dub`).
   - `Abyssal Trench`: Low-frequency oceanic pressure rumble (32 Hz).
   - `Cyber Poltergeist`: 60 Hz electrical mains hum and notch-filtered noise.
2. **Procedural Horror Stingers**:
   - Sub-bass void blast on clicks
   - Dissonant tritone screech
   - Bone snapping transient
   - Spectral exhaled breath gasp
   - Glissando abyssal moan
3. **Cursor Proximity Tension**: Dynamic filter sweeping that intensifies as you hover closer to the creature's facial core.

---

## 🚀 Running Locally

```bash
cd threejs-inspirations/horror-particles
python3 -m http.server 8089
```
Open [http://localhost:8089](http://localhost:8089) for the full interactive app, or [http://localhost:8089/embed-demo.html](http://localhost:8089/embed-demo.html) to test the background integration.

---

## 📜 License
MIT License. Inspired by Astral Kreativ GmbH (`xmas.astral.de`). Free to use for personal and commercial projects.
