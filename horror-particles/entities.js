/**
 * ASTRAL HORROR // Volumetric 3D Entity Generators
 * 12 Distinct Procedural Nightmare Characters + Cosmic Void Background
 * Each entity generates 55,000 points with volumetric 3D coordinates (x, y, z)
 * and thematic RGB color attributes.
 */

const PARTICLE_COUNT = 55000;

class EntityGenerator {
  /**
   * 0. THE COSMIC VOID (Origin Starfield)
   */
  static generateCosmicVoid(count = PARTICLE_COUNT) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const arm = i % 4;
      const armAngle = (arm * Math.PI) / 2;
      const radius = Math.pow(Math.random(), 1.6) * 1250 + 40;
      const spin = radius * 0.0035;
      const angle = armAngle + spin + (Math.random() - 0.5) * 0.65;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.45 + (Math.random() - 0.5) * 220;
      const z = (Math.random() - 0.5) * 650 - radius * 0.2;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      const distRatio = radius / 1250;
      if (Math.random() < 0.15) {
        colors[i3] = 0.95; colors[i3 + 1] = 0.95; colors[i3 + 2] = 1.0;
      } else {
        colors[i3] = 0.12 + (1 - distRatio) * 0.25;
        colors[i3 + 1] = 0.22 + distRatio * 0.35;
        colors[i3 + 2] = 0.70 + distRatio * 0.30;
      }
    }

    return {
      name: "COSMIC VOID",
      id: "void",
      positions,
      colors,
      description: "Infinite expanse of dormant particulate cosmic matter"
    };
  }

  /**
   * 1. THE SMILING WENDIGO (Gaunt skull, razor needle fangs, piercing crimson gaze)
   */
  static generateSmilingWendigo(count = PARTICLE_COUNT) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x, y, z;
      let r = 0.75, g = 0.75, b = 0.75;
      const pType = i / count;

      if (pType < 0.45) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        const radX = 220 * Math.sin(v) * (0.85 + Math.cos(v) * 0.15);
        const radY = 320 * Math.cos(v);
        const radZ = 200 * Math.sin(v) * Math.sin(u);

        x = radX * Math.cos(u);
        y = radY + 40;
        z = radZ * (radZ > 0 ? 1.2 : 0.8);

        const isEyeRegion = y > 20 && y < 140 && Math.abs(x) > 50 && Math.abs(x) < 140 && z > 40;
        if (isEyeRegion) {
          z -= 110;
          r = 0.08; g = 0.03; b = 0.06;
        } else {
          r = 0.72 + (Math.random() - 0.5) * 0.1;
          g = 0.70 + (Math.random() - 0.5) * 0.1;
          b = 0.68 + (Math.random() - 0.5) * 0.1;
        }
      } else if (pType < 0.55) {
        const eyeSide = Math.random() < 0.5 ? -1 : 1;
        const eyeRadius = Math.pow(Math.random(), 2) * 25;
        const eyeAngle = Math.random() * Math.PI * 2;
        x = eyeSide * 95 + Math.cos(eyeAngle) * eyeRadius;
        y = 75 + Math.sin(eyeAngle) * eyeRadius;
        z = 100 + (Math.random() - 0.5) * 20;
        r = 1.0; g = 0.05; b = 0.05;
      } else if (pType < 0.82) {
        const t = (Math.random() - 0.5) * 2;
        const mouthWidth = 260;
        const smileArch = Math.pow(t, 2) * 90;

        x = t * mouthWidth;
        y = -120 + smileArch + (Math.random() - 0.5) * 45;
        z = 140 * Math.cos((t * Math.PI) / 2.2) + (Math.random() - 0.5) * 40;

        if (Math.random() < 0.35) {
          const fangLen = (1 - Math.abs(t) * 0.4) * (Math.random() * 65 + 20);
          y -= fangLen;
          r = 0.95; g = 0.95; b = 0.75;
        } else {
          r = 0.75 + Math.random() * 0.2; g = 0.08; b = 0.08;
        }
      } else {
        const t = Math.random() * 2 - 1;
        x = t * 180 + (Math.random() - 0.5) * 60;
        y = -220 - Math.random() * 300;
        z = (Math.random() - 0.5) * 160;
        r = 0.35; g = 0.05; b = 0.08;
      }

      positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
      colors[i3] = r; colors[i3 + 1] = g; colors[i3 + 2] = b;
    }

    return {
      name: "THE SMILING WENDIGO",
      id: "wendigo",
      positions,
      colors,
      description: "Gaunt, predatory horror with an eternal razor-toothed smile"
    };
  }

  /**
   * 2. THE ELDRITCH BEHEMOTH (9 Glowing eyes, 12 writhing tentacles)
   */
  static generateEldritchBehemoth(count = PARTICLE_COUNT) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x, y, z;
      let r = 0.05, g = 0.85, b = 0.65;
      const pType = i / count;

      if (pType < 0.35) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * (Math.PI / 1.7);
        const bump = Math.sin(theta * 6) * 20 + Math.cos(phi * 8) * 15;
        const radius = 260 + bump;

        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.cos(phi) + 120;
        z = radius * Math.sin(phi) * Math.sin(theta) * 0.85;

        r = 0.05 + Math.random() * 0.1;
        g = 0.45 + Math.random() * 0.35;
        b = 0.35 + Math.random() * 0.25;
      } else if (pType < 0.50) {
        const eyeConfigs = [
          { x: 0, y: 150, z: 230, r: 35 },
          { x: -90, y: 80, z: 200, r: 24 },
          { x: 90, y: 80, z: 200, r: 24 },
          { x: -140, y: 140, z: 170, r: 18 },
          { x: 140, y: 140, z: 170, r: 18 },
          { x: -50, y: 20, z: 210, r: 16 },
          { x: 50, y: 20, z: 210, r: 16 },
          { x: 0, y: -40, z: 190, r: 20 },
          { x: -110, y: -30, z: 160, r: 15 }
        ];
        const cfg = eyeConfigs[Math.floor(Math.random() * 9)];
        const rad = Math.pow(Math.random(), 2) * cfg.r;
        const ang = Math.random() * Math.PI * 2;
        x = cfg.x + Math.cos(ang) * rad;
        y = cfg.y + Math.sin(ang) * rad;
        z = cfg.z + (Math.random() - 0.5) * 15;

        r = 0.85 + Math.random() * 0.15; g = 0.95; b = 0.15;
      } else {
        const tentacleId = Math.floor(Math.random() * 12);
        const baseAngle = (tentacleId * Math.PI * 2) / 12;
        const progress = Math.random();

        const startRadius = 140;
        const baseX = Math.cos(baseAngle) * startRadius;
        const baseY = -20;
        const baseZ = Math.sin(baseAngle) * startRadius;

        const curl = progress * 6.5;
        const spread = progress * 160;
        x = baseX + Math.cos(baseAngle + curl) * spread;
        y = baseY - progress * 480 + Math.sin(curl * 2) * 40;
        z = baseZ + Math.sin(baseAngle + curl) * spread + Math.cos(progress * 5) * 80;

        const thickness = (1 - progress * 0.75) * 35;
        x += (Math.random() - 0.5) * thickness;
        y += (Math.random() - 0.5) * thickness;
        z += (Math.random() - 0.5) * thickness;

        r = 0.05 + progress * 0.2; g = 0.65 - progress * 0.3; b = 0.85 - progress * 0.25;
      }

      positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
      colors[i3] = r; colors[i3 + 1] = g; colors[i3 + 2] = b;
    }

    return {
      name: "ELDRITCH BEHEMOTH",
      id: "eldritch",
      positions,
      colors,
      description: "Nine-eyed abyssal deity with writhing volumetric tentacles"
    };
  }

  /**
   * 3. THE HORNED BLOOD DEMON (Swept curved horns, magma fissures)
   */
  static generateHornedDemon(count = PARTICLE_COUNT) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x, y, z;
      let r = 0.95, g = 0.2, b = 0.05;
      const pType = i / count;

      if (pType < 0.35) {
        const hornSide = Math.random() < 0.5 ? -1 : 1;
        const hProg = Math.random();
        const hornBaseX = hornSide * 120;
        const hornBaseY = 160;
        const hornBaseZ = 40;

        const curveX = hornSide * (Math.sin(hProg * 1.5) * 220);
        const curveY = Math.sin(hProg * 1.8) * 280;
        const curveZ = -Math.pow(hProg, 1.6) * 340;

        const thickness = (1 - hProg * 0.85) * 45;
        const rad = Math.random() * thickness;
        const ang = Math.random() * Math.PI * 2;

        x = hornBaseX + curveX + Math.cos(ang) * rad;
        y = hornBaseY + curveY + Math.sin(ang) * rad;
        z = hornBaseZ + curveZ + (Math.random() - 0.5) * rad;

        if (Math.sin(hProg * 35) > 0.4) {
          r = 1.0; g = 0.65; b = 0.1;
        } else {
          r = 0.18; g = 0.04; b = 0.02;
        }
      } else if (pType < 0.70) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;

        const radX = 180 * Math.sin(v) * (1 + 0.2 * Math.cos(u * 2));
        const radY = 220 * Math.cos(v);
        const radZ = 190 * Math.sin(v) * Math.sin(u);

        x = radX * Math.cos(u);
        y = radY;
        z = radZ * (radZ > 0 ? 1.4 : 0.7);

        if (y < -60 && z > 30) {
          z += 50;
          if (Math.abs(x) > 40 && Math.abs(x) < 80 && Math.random() < 0.3) {
            y += Math.random() * 45;
            r = 1.0; g = 0.9; b = 0.7;
          }
        }
        if (y > 60 && y < 130 && z > 60) {
          z += 35;
          r = 0.9; g = 0.15; b = 0.05;
        } else {
          r = 0.45 + (Math.random() - 0.5) * 0.15; g = 0.08; b = 0.04;
        }
      } else if (pType < 0.78) {
        const side = Math.random() < 0.5 ? -1 : 1;
        const t = (Math.random() - 0.5) * 2;
        x = side * 85 + (Math.random() - 0.5) * (1 - Math.abs(t)) * 14;
        y = 55 + t * 24;
        z = 130 + (Math.random() - 0.5) * 15;
        r = 1.0; g = 0.9; b = 0.1;
      } else {
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * 450 + 100;
        x = Math.cos(ang) * dist;
        y = (Math.random() - 0.5) * 600;
        z = Math.sin(ang) * dist;
        r = 1.0; g = 0.4 + Math.random() * 0.5; b = 0.05;
      }

      positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
      colors[i3] = r; colors[i3 + 1] = g; colors[i3 + 2] = b;
    }

    return {
      name: "HORNED BLOOD DEMON",
      id: "demon",
      positions,
      colors,
      description: "Swept-back recurved horns, obsidian fissures, and fiery ember eyes"
    };
  }

  /**
   * 4. THE SCREAMING VOID WRAITH (Agonized gaping maw, ectoplasmic tear tendrils)
   */
  static generateVoidWraith(count = PARTICLE_COUNT) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x, y, z;
      let r = 0.3, g = 0.75, b = 1.0;
      const pType = i / count;

      if (pType < 0.40) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        const radX = 180 * Math.sin(v);
        const radY = 260 * Math.cos(v);
        const radZ = 160 * Math.sin(v) * Math.sin(u);

        x = radX * Math.cos(u) + (Math.random() - 0.5) * 30;
        y = radY + 60;
        z = radZ * (radZ > 0 ? 1.2 : 0.6);
        r = 0.25; g = 0.65; b = 0.95;
      } else if (pType < 0.65) {
        const ang = Math.random() * Math.PI * 2;
        const prog = Math.random();
        const mouthRadiusX = 90 * prog;
        const mouthRadiusY = 160 * prog;

        x = Math.cos(ang) * mouthRadiusX;
        y = -100 + Math.sin(ang) * mouthRadiusY;
        z = 70 - prog * 180;

        if (prog < 0.6) {
          r = 0.02; g = 0.05; b = 0.15;
        } else {
          r = 0.7; g = 0.3; b = 1.0;
        }
      } else {
        const side = Math.random() < 0.5 ? -1 : 1;
        const streamProg = Math.random();
        const startX = side * (50 + Math.random() * 60);
        const startY = 40;
        const startZ = 90;

        x = startX + Math.sin(streamProg * 8) * 45 + (Math.random() - 0.5) * 30;
        y = startY + streamProg * 450 + (Math.random() - 0.5) * 20;
        z = startZ + Math.cos(streamProg * 6) * 60 - streamProg * 120;

        r = 0.65 * (1 - streamProg); g = 0.85; b = 1.0;
      }

      positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
      colors[i3] = r; colors[i3 + 1] = g; colors[i3 + 2] = b;
    }

    return {
      name: "SCREAMING VOID WRAITH",
      id: "wraith",
      positions,
      colors,
      description: "Agonized maw screaming into the void with upward ectoplasm streams"
    };
  }

  /**
   * 5. THE FRACTURED DOLL (Cracked porcelain, stitched lips, hollow tears)
   */
  static generateFracturedDoll(count = PARTICLE_COUNT) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x, y, z;
      let r = 0.95, g = 0.92, b = 0.90;
      const pType = i / count;

      if (pType < 0.55) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        let radX = 190 * Math.sin(v);
        let radY = 220 * Math.cos(v);
        let radZ = 190 * Math.sin(v) * Math.sin(u);

        x = radX * Math.cos(u);
        y = radY;
        z = radZ * (radZ > 0 ? 1.15 : 0.7);

        const crack = Math.abs(x - (y * 0.4 + 40)) < 18 && z > 20;
        if (crack) {
          z -= 55;
          r = 0.15; g = 0.05; b = 0.1;
        } else {
          r = 0.92 + (Math.random() - 0.5) * 0.06;
          g = 0.88 + (Math.random() - 0.5) * 0.06;
          b = 0.88 + (Math.random() - 0.5) * 0.06;
        }
      } else if (pType < 0.75) {
        const eyeSide = Math.random() < 0.5 ? -1 : 1;
        const tearProg = Math.random();
        x = eyeSide * 75 + (Math.random() - 0.5) * 16;
        y = 50 - tearProg * 260;
        z = 135 - tearProg * 30 + (Math.random() - 0.5) * 12;
        r = 0.05; g = 0.02; b = 0.05;
      } else if (pType < 0.90) {
        const stitchId = Math.floor(Math.random() * 8);
        const stitchX = -70 + stitchId * 20;
        const prog = (Math.random() - 0.5) * 2;
        x = stitchX + (Math.random() - 0.5) * 4;
        y = -90 + prog * 28;
        z = 135 + (Math.random() - 0.5) * 8;
        r = 0.65; g = 0.1; b = 0.15;
      } else {
        const ang = Math.random() * Math.PI * 2;
        const rad = 240 + Math.random() * 120;
        x = Math.cos(ang) * rad;
        y = (Math.random() - 0.5) * 400;
        z = Math.sin(ang) * rad;
        r = 0.9; g = 0.88; b = 0.9;
      }

      positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
      colors[i3] = r; colors[i3 + 1] = g; colors[i3 + 2] = b;
    }

    return {
      name: "THE FRACTURED DOLL",
      id: "doll",
      positions,
      colors,
      description: "Cracked porcelain visage, stitched thread lips, and dripping black ink tears"
    };
  }

  /**
   * 6. THE GLITCH POLTERGEIST (Chromatic shear, fragmented digital scanlines)
   */
  static generateGlitchPoltergeist(count = PARTICLE_COUNT) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x, y, z;
      let r = 0.0, g = 1.0, b = 0.9;

      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI;

      let radX = 200 * Math.sin(v);
      let radY = 250 * Math.cos(v);
      let radZ = 180 * Math.sin(v) * Math.sin(u);

      x = radX * Math.cos(u);
      y = radY;
      z = radZ;

      const slice = Math.floor(y / 28);
      const isGlitchRow = slice % 3 === 0;

      if (isGlitchRow) {
        const shift = Math.sin(slice * 13.5) * 95;
        x += shift;
        z += (Math.random() - 0.5) * 60;
        if (shift > 0) {
          r = 1.0; g = 0.1; b = 0.7;
        } else {
          r = 0.05; g = 1.0; b = 0.95;
        }
      } else {
        if (Math.random() < 0.2) {
          x += (Math.random() - 0.5) * 120;
          y += (Math.random() - 0.5) * 60;
          r = 1.0; g = 1.0; b = 1.0;
        } else {
          r = 0.15; g = 0.85; b = 0.75;
        }
      }

      positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
      colors[i3] = r; colors[i3 + 1] = g; colors[i3 + 2] = b;
    }

    return {
      name: "GLITCH POLTERGEIST",
      id: "glitch",
      positions,
      colors,
      description: "Unstable digital apparition suffering violent chromatic shears and noise bursts"
    };
  }

  /**
   * 7. THE PLAGUE DOCTOR (Beaked avian predator, hollow goggles, cowl shroud)
   */
  static generatePlagueDoctor(count = PARTICLE_COUNT) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x, y, z;
      let r = 0.1, g = 0.12, b = 0.15;
      const pType = i / count;

      if (pType < 0.32) {
        // Cowl / hood curving around head and shoulders
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * (Math.PI * 0.75);
        const radX = 230 * Math.sin(v);
        const radY = 280 * Math.cos(v);
        const radZ = 220 * Math.sin(v) * Math.sin(u);

        x = radX * Math.cos(u);
        y = radY + 60;
        z = radZ * (radZ > 0 ? 0.9 : 1.3);

        r = 0.12; g = 0.11; b = 0.14; // Worn dark leather
      } else if (pType < 0.65) {
        // Long curved predatory avian beak protruding outward and curving downward
        const beakProg = Math.random(); // 0 at base, 1 at beak tip
        const curveDown = Math.pow(beakProg, 1.8) * 140;
        const width = (1 - beakProg * 0.85) * 65;

        const ang = Math.random() * Math.PI * 2;
        const rad = Math.random() * width;

        x = Math.cos(ang) * rad;
        y = 20 - curveDown + Math.sin(ang) * (rad * 0.8);
        z = 120 + beakProg * 360; // Huge 3D beak projection!

        r = 0.85 - beakProg * 0.3;
        g = 0.80 - beakProg * 0.3;
        b = 0.65 - beakProg * 0.3; // Aged parchment bone ivory
      } else if (pType < 0.78) {
        // Glowing round plague goggle lenses
        const side = Math.random() < 0.5 ? -1 : 1;
        const lensAng = Math.random() * Math.PI * 2;
        const lensRad = Math.pow(Math.random(), 1.5) * 35;

        x = side * 85 + Math.cos(lensAng) * lensRad;
        y = 70 + Math.sin(lensAng) * lensRad;
        z = 135 + (Math.random() - 0.5) * 15;

        // Toxic sickly green luminescent glass
        r = 0.2; g = 0.95; b = 0.3;
      } else {
        // Swirling miasma / cloud particles around beak tip
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * 250;
        x = Math.cos(ang) * dist;
        y = -100 - Math.random() * 200;
        z = 320 + Math.sin(ang) * dist;

        r = 0.25; g = 0.65; b = 0.2; // Pestilent vapor
      }

      positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
      colors[i3] = r; colors[i3 + 1] = g; colors[i3 + 2] = b;
    }

    return {
      name: "THE PLAGUE DOCTOR",
      id: "plague",
      positions,
      colors,
      description: "Aged leather cowl, elongated bone beak, and luminescent toxic green goggle lenses"
    };
  }

  /**
   * 8. THE ARACHNID MOTHER (8 Clustered scarlet eyes, chittering chelicerae fangs)
   */
  static generateArachnidMother(count = PARTICLE_COUNT) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x, y, z;
      let r = 0.15, g = 0.05, b = 0.18;
      const pType = i / count;

      if (pType < 0.40) {
        // Chitinous cephalothorax skull dome
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        const radX = 240 * Math.sin(v);
        const radY = 190 * Math.cos(v);
        const radZ = 200 * Math.sin(v) * Math.sin(u);

        x = radX * Math.cos(u);
        y = radY + 20;
        z = radZ * (radZ > 0 ? 1.3 : 0.7);

        r = 0.18; g = 0.08; b = 0.20; // Deep chitinous carapace
      } else if (pType < 0.58) {
        // 8 Clustered glowing red spider eyes arranged in dual horizontal arcs
        const eyeConfigs = [
          { x: -35, y: 70, z: 220, r: 18 },
          { x: 35, y: 70, z: 220, r: 18 },
          { x: -95, y: 65, z: 195, r: 14 },
          { x: 95, y: 65, z: 195, r: 14 },
          { x: -45, y: 110, z: 190, r: 15 },
          { x: 45, y: 110, z: 190, r: 15 },
          { x: -115, y: 100, z: 165, r: 12 },
          { x: 115, y: 100, z: 165, r: 12 }
        ];
        const cfg = eyeConfigs[Math.floor(Math.random() * 8)];
        const rad = Math.pow(Math.random(), 1.5) * cfg.r;
        const ang = Math.random() * Math.PI * 2;
        x = cfg.x + Math.cos(ang) * rad;
        y = cfg.y + Math.sin(ang) * rad;
        z = cfg.z + (Math.random() - 0.5) * 12;

        r = 1.0; g = 0.1; b = 0.25; // Burning red ocelli
      } else if (pType < 0.82) {
        // Massive chittering chelicerae & venom fangs
        const side = Math.random() < 0.5 ? -1 : 1;
        const fangProg = Math.random();
        const baseFangX = side * 55;
        const baseFangY = -20;
        const baseFangZ = 160;

        // Inward curved dagger fangs
        const curveX = -side * Math.pow(fangProg, 1.4) * 45;
        const curveY = -fangProg * 180;
        const curveZ = Math.sin(fangProg * Math.PI) * 60;

        const thick = (1 - fangProg * 0.75) * 28;
        x = baseFangX + curveX + (Math.random() - 0.5) * thick;
        y = baseFangY + curveY + (Math.random() - 0.5) * thick;
        z = baseFangZ + curveZ + (Math.random() - 0.5) * thick;

        // Venomous tip glow
        if (fangProg > 0.75) {
          r = 0.8; g = 1.0; b = 0.1; // Acid dripping venom
        } else {
          r = 0.85; g = 0.85; b = 0.8; // Polished fang
        }
      } else {
        // Silk web filaments hanging downward
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * 320;
        x = Math.cos(ang) * dist;
        y = -120 - Math.random() * 350;
        z = Math.sin(ang) * dist;

        r = 0.6; g = 0.4; b = 0.7; // Violet silk
      }

      positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
      colors[i3] = r; colors[i3 + 1] = g; colors[i3 + 2] = b;
    }

    return {
      name: "THE ARACHNID MOTHER",
      id: "arachnid",
      positions,
      colors,
      description: "8 burning scarlet ocelli, interlocking chelicerae, and acid venom droplets"
    };
  }

  /**
   * 9. THE CYBER CYBORG PROTOCOL (Biomech titanium ribbing, exposed HUD circuits)
   */
  static generateCyberDemon(count = PARTICLE_COUNT) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x, y, z;
      let r = 0.05, g = 0.95, b = 1.0; // Neon cyber cyan & laser red
      const pType = i / count;

      if (pType < 0.50) {
        // Metallic biomechanical skull with exposed cranial plating
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        const radX = 200 * Math.sin(v);
        const radY = 240 * Math.cos(v);
        const radZ = 190 * Math.sin(v) * Math.sin(u);

        x = radX * Math.cos(u);
        y = radY + 20;
        z = radZ;

        // Split face: right side cybernetic, left side organic bone
        if (x > 0) {
          // Hard geometric titanium planes
          x = Math.round(x / 18) * 18;
          y = Math.round(y / 18) * 18;
          r = 0.1; g = 0.8; b = 0.95; // Cyan cyber circuits
        } else {
          r = 0.6; g = 0.55; b = 0.5; // Decayed organic flesh
        }
      } else if (pType < 0.72) {
        // Glowing laser HUD ocular implant on right eye
        const ang = Math.random() * Math.PI * 2;
        const rad = Math.random() * 45;
        x = 80 + Math.cos(ang) * rad;
        y = 65 + Math.sin(ang) * rad;
        z = 150 + (Math.random() - 0.5) * 15;

        r = 1.0; g = 0.05; b = 0.15; // Target locked laser red
      } else if (pType < 0.88) {
        // Cybernetic mandible grill / pneumatic breathers
        const gridX = (Math.random() - 0.5) * 160;
        const lineY = -80 + Math.floor(Math.random() * 6) * 16;
        x = gridX;
        y = lineY;
        z = 140 + (Math.random() - 0.5) * 10;

        r = 0.05; g = 1.0; b = 0.85; // Neon data grill
      } else {
        // Digital data packets floating outward
        x = (Math.random() - 0.5) * 500;
        y = (Math.random() - 0.5) * 500;
        z = (Math.random() - 0.5) * 400;

        r = 0.0; g = 1.0; b = 0.9;
      }

      positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
      colors[i3] = r; colors[i3 + 1] = g; colors[i3 + 2] = b;
    }

    return {
      name: "CYBER DEMON // PROTOCOL 66",
      id: "cyber",
      positions,
      colors,
      description: "Half-decayed organic skull fused with titanium cranial mesh and target laser eye"
    };
  }

  /**
   * 10. THE LEVIATHAN OF THE TRENCH (Abyssal deep-sea angler monstrosity)
   */
  static generateAbyssalLeviathan(count = PARTICLE_COUNT) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x, y, z;
      let r = 0.05, g = 0.2, b = 0.35;
      const pType = i / count;

      if (pType < 0.40) {
        // Gargantuan abyssal jaw & gaping oceanic maw
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        const radX = 260 * Math.sin(v);
        const radY = 220 * Math.cos(v);
        const radZ = 240 * Math.sin(v) * Math.sin(u);

        x = radX * Math.cos(u);
        y = radY - 40;
        z = radZ * (radZ > 0 ? 1.4 : 0.8);

        r = 0.04; g = 0.15; b = 0.28; // Deep oceanic midnight
      } else if (pType < 0.60) {
        // Massive bioluminescent lure dangling above the head
        const stalkProg = Math.random();
        const curveX = Math.sin(stalkProg * 2.8) * 80;
        const curveY = 160 + stalkProg * 280;
        const curveZ = 60 + Math.cos(stalkProg * 2.5) * 190;

        if (stalkProg > 0.88) {
          // The glowing bioluminescent bulb
          const bulbAng = Math.random() * Math.PI * 2;
          const bulbRad = Math.random() * 45;
          x = curveX + Math.cos(bulbAng) * bulbRad;
          y = curveY + Math.sin(bulbAng) * bulbRad;
          z = curveZ;
          r = 0.3; g = 1.0; b = 0.9; // Blinding sea-lantern lure
        } else {
          x = curveX + (Math.random() - 0.5) * 12;
          y = curveY;
          z = curveZ + (Math.random() - 0.5) * 12;
          r = 0.1; g = 0.35; b = 0.45;
        }
      } else if (pType < 0.85) {
        // Translucent needle glass-teeth protruding in random directions
        const t = (Math.random() - 0.5) * 2;
        const mouthX = t * 220;
        const mouthY = -120 + Math.pow(t, 2) * 50;
        const mouthZ = 180 + (Math.random() - 0.5) * 60;

        const toothLen = Math.random() * 85 + 25;
        const toothDir = Math.random() < 0.5 ? 1 : -1;

        x = mouthX + (Math.random() - 0.5) * 10;
        y = mouthY + toothDir * toothLen;
        z = mouthZ + Math.random() * 40;

        r = 0.7; g = 0.95; b = 1.0; // Translucent bioluminescent glass
      } else {
        // Marine snow / abyssal plankton floating in the dark
        x = (Math.random() - 0.5) * 600;
        y = (Math.random() - 0.5) * 600;
        z = (Math.random() - 0.5) * 500;
        r = 0.1; g = 0.5; b = 0.7;
      }

      positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
      colors[i3] = r; colors[i3 + 1] = g; colors[i3 + 2] = b;
    }

    return {
      name: "LEVIATHAN OF THE TRENCH",
      id: "leviathan",
      positions,
      colors,
      description: "Deep sea angler monstrosity with an overhead bioluminescent lure and glassy needle fangs"
    };
  }

  /**
   * 11. THE SHADOW GOLEM / REAPER OF SOULS (Hooded skeletal death, crown of bone spikes)
   */
  static generateShadowReaper(count = PARTICLE_COUNT) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x, y, z;
      let r = 0.08, g = 0.08, b = 0.12;
      const pType = i / count;

      if (pType < 0.42) {
        // Deep cavernous cowl with absolute empty void interior
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 0.7;
        const radX = 260 * Math.sin(v);
        const radY = 320 * Math.cos(v);
        const radZ = 240 * Math.sin(v) * Math.sin(u);

        x = radX * Math.cos(u);
        y = radY + 40;
        z = radZ * (radZ > 0 ? 0.7 : 1.4);

        r = 0.06; g = 0.04; b = 0.08; // Pitch black void cowl
      } else if (pType < 0.65) {
        // Crown of jagged vertical bone spikes piercing out of hood
        const spikeId = Math.floor(Math.random() * 9);
        const spikeAng = -Math.PI * 0.4 + (spikeId / 8) * Math.PI * 0.8;
        const prog = Math.random();

        const baseX = Math.sin(spikeAng) * 190;
        const baseY = 240;
        const baseZ = Math.cos(spikeAng) * 90;

        const spikeLen = (1 - Math.abs(spikeId - 4) * 0.18) * 190;
        x = baseX + (Math.random() - 0.5) * (1 - prog) * 20;
        y = baseY + prog * spikeLen;
        z = baseZ + (Math.random() - 0.5) * 20;

        r = 0.75; g = 0.72; b = 0.68; // Weathered ancient bone
      } else if (pType < 0.75) {
        // Burning spectral soul flames hovering in eye sockets
        const side = Math.random() < 0.5 ? -1 : 1;
        const flameProg = Math.random();
        x = side * 80 + (Math.random() - 0.5) * 35;
        y = 50 + flameProg * 80;
        z = 80 + (Math.random() - 0.5) * 20;

        r = 0.4; g = 0.1; b = 0.95; // Spectral soul purple
      } else {
        // Swirling vortex of souls streaming beneath the cloak
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * 260;
        x = Math.cos(ang) * dist;
        y = -100 - Math.random() * 380;
        z = Math.sin(ang) * dist;

        r = 0.25; g = 0.08; b = 0.55;
      }

      positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
      colors[i3] = r; colors[i3 + 1] = g; colors[i3 + 2] = b;
    }

    return {
      name: "THE SOUL REAPER",
      id: "reaper",
      positions,
      colors,
      description: "Pitch black cowl, 9 jagged bone crown spikes, and burning violet soul-flame eyes"
    };
  }

  /**
   * 12. THE COSMIC OCULUS (Interdimensional celestial eye surrounded by orbital rings)
   */
  static generateCosmicOculus(count = PARTICLE_COUNT) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x, y, z;
      let r = 0.95, g = 0.5, b = 0.1;
      const pType = i / count;

      if (pType < 0.45) {
        // Central giant celestial eyeball
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        const rad = 180;

        x = rad * Math.sin(v) * Math.cos(u);
        y = rad * Math.cos(v);
        z = rad * Math.sin(v) * Math.sin(u);

        // Iris and pupil definition
        const angleFromCenter = Math.acos(z / rad); // 0 at front center
        if (angleFromCenter < 0.45) {
          // Black hole pupil
          r = 0.01; g = 0.01; b = 0.02;
        } else if (angleFromCenter < 1.0) {
          // Radiant solar flare iris
          r = 1.0; g = 0.45 + Math.random() * 0.4; b = 0.1;
        } else {
          // Veined celestial sclera
          r = 0.85; g = 0.85; b = 0.92;
        }
      } else if (pType < 0.80) {
        // Dual interlocking orbital planetary rings spinning at 45 degree tilt
        const ringId = Math.random() < 0.5 ? 0 : 1;
        const ang = Math.random() * Math.PI * 2;
        const ringRad = 280 + Math.random() * 140;

        let rx = Math.cos(ang) * ringRad;
        let ry = (Math.random() - 0.5) * 30;
        let rz = Math.sin(ang) * ringRad;

        // Tilt rings
        const tilt = ringId === 0 ? 0.65 : -0.65;
        x = rx * Math.cos(tilt) - ry * Math.sin(tilt);
        y = rx * Math.sin(tilt) + ry * Math.cos(tilt);
        z = rz;

        r = 0.3 + Math.random() * 0.4;
        g = 0.15;
        b = 0.85; // Cosmic stardust violet
      } else {
        // Radial coronal mass ejections / solar flares
        const flareAng = Math.random() * Math.PI * 2;
        const flareDist = 200 + Math.random() * 350;
        x = Math.cos(flareAng) * flareDist;
        y = Math.sin(flareAng) * flareDist;
        z = (Math.random() - 0.5) * 120;

        r = 1.0; g = 0.6; b = 0.1;
      }

      positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
      colors[i3] = r; colors[i3 + 1] = g; colors[i3 + 2] = b;
    }

    return {
      name: "THE COSMIC OCULUS",
      id: "oculus",
      positions,
      colors,
      description: "Interdimensional celestial eye encircled by dual tilted stardust rings and solar flares"
    };
  }

  /**
   * Return all entities
   */
  static getAllEntities() {
    return [
      this.generateSmilingWendigo(),
      this.generateEldritchBehemoth(),
      this.generateHornedDemon(),
      this.generateVoidWraith(),
      this.generateFracturedDoll(),
      this.generateGlitchPoltergeist(),
      this.generatePlagueDoctor(),
      this.generateArachnidMother(),
      this.generateCyberDemon(),
      this.generateAbyssalLeviathan(),
      this.generateShadowReaper(),
      this.generateCosmicOculus(),
      this.generateCosmicVoid()
    ];
  }
}

window.EntityGenerator = EntityGenerator;
