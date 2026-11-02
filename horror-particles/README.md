# ASTRAL HORROR // Volumetric Particle Nightmares

An interactive 3D WebGL horror experience inspired by Astral Kreativ's award-winning WebGL point-cloud engine (`xmas.astral.de`).

Built with **Three.js**, **custom GLSL Shaders**, and procedural **Web Audio API soundscapes**, this project renders **55,000 volumetric 3D particles** that dynamically morph into terrifying mathematical nightmare creatures on mouse hover, cursor motion, and clicks anywhere on screen.

---

## 👁️ Features

### 1. Astral-Style Volumetric Particle Engine
- **55,000 GPU-Accelerated Particles** computed via custom vertex and fragment shaders running at 60–120 FPS.
- **Organic Staggered Morphing**: Per-particle randomized delay attributes create fluid, non-uniform spatial snapping as particles dissolve from one horror to the next.
- **Writhing / Breathing Noise**: Real-time sine and cosine trigonometric distortion simulating an undulating, living organism.
- **Astral Parallax Camera**: Smooth mouse-following camera rotation and 3D eye gaze tracking.

### 2. The 12 Horrifying Entities
1. **The Smiling Wendigo**: Gaunt elongated cranial bone structure, sunken hollow eye cavities, razor needle teeth, and piercing crimson pupils that lock onto your cursor.
2. **The Eldritch Behemoth**: 9 cyclopean glowing eyes and 12 thick writhing tentacles cascading downwards in 3D depth with undulating physics.
3. **The Horned Blood Demon**: Swept-back curved horns with incandescent magma ribs, flared predatory ridges, obsidian bone, and blazing amber cat-slit eyes.
4. **The Screaming Void Wraith**: Agonized open maw forming a deep black hole vortex, with spectral ectoplasm and particulate tears streaming upward into the void.
5. **The Fractured Doll**: Smooth porcelain face split by a jagged deep fracture line, stitched mouth threads, and pitch-black dripping ink tears.
6. **The Glitch Poltergeist**: Unstable digital entity suffering horizontal chromatic shear, pixel noise dispersion, and rapid jitter lunges.
7. **The Plague Doctor**: Aged leather cowl, elongated bone beak, and toxic luminescent green goggles.
8. **The Arachnid Mother**: 8 burning scarlet spider eyes, interlocking chelicerae, and acid venom droplets.
9. **Cyber Demon Protocol 66**: Biomechanical titanium skull plating, data grill, laser target ocular lock.
10. **Leviathan of the Trench**: Abyssal deep-sea angler fish with an overhead bioluminescent lure and glass fangs.
11. **The Soul Reaper**: Cavernous cowl, 9 jagged bone crown spikes, and violet soul-flame eyes.
12. **The Cosmic Oculus**: Interdimensional celestial eye encircled by dual tilted stardust rings.
13. **The Cosmic Void**: The Astral-inspired origin starfield of 55,000 spiraling nebular particles.

---

## 🚀 How to Run

1. Open a terminal in this directory:
   ```bash
   cd horror-particles
   python3 -m http.server 8089
   ```

2. Open your browser:
   [http://localhost:8089](http://localhost:8089)

3. Click **"ENTER THE NIGHTMARE"** to engage audio and dive in!

---

## ⌨️ Controls & Shortcuts
- **Click Anywhere**: Blast particles with a shockwave & morph to the next horror.
- **Space / Enter / Arrow Right**: Blast shockwave & cycle entity.
- **Keys 1–9**: Directly summon a specific entity.
- **Key M**: Toggle sound mute.
- **Key F**: Toggle full-screen mode.
