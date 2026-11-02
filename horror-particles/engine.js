/**
 * ASTRAL HORROR // Three.js Particle Morphing & WebGL Shader Engine
 * Handles 55,000 volumetric particles, GPU-accelerated morph transitions,
 * organic writhing noise, 3D mouse tracking, and explosive click shockwaves.
 */

class HorrorParticleEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.count = PARTICLE_COUNT;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.geometry = null;
    this.material = null;
    this.points = null;

    // Morph state
    this.currentEntityIndex = 0;
    this.entities = [];
    this.morphProgress = 1.0;
    this.morphDuration = 1.35; // brisk, punchy morph
    this.isMorphing = false;
    this.lastMorphTime = 0;

    // Interaction state
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.mouse3D = new THREE.Vector3(0, 0, 150);
    this.raycaster = new THREE.Raycaster();
    this.interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.clock = new THREE.Clock();

    // Shockwave parameters
    this.shockwaveActive = false;
    this.shockwaveTime = 0;
    this.shockwaveDuration = 0.85;

    // Glitch burst state
    this.glitchIntensity = 0.0;

    // Camera shake & jumpscare lunge state
    this.shakeIntensity = 0.0;
    this.lungeZ = 0.0;

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030305, 0.00075);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 1, 6000);
    this.camera.position.set(0, 0, 850);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x030305, 1);
    this.container.appendChild(this.renderer.domElement);

    this.entities = EntityGenerator.getAllEntities();
    this.createParticleSystem();

    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });

    this.animate();
  }

  createParticleSystem() {
    this.geometry = new THREE.BufferGeometry();
    const initial = this.entities[0];

    const positions = new Float32Array(initial.positions);
    const colors = new Float32Array(initial.colors);
    const targetPositions = new Float32Array(initial.positions);
    const targetColors = new Float32Array(initial.colors);

    const randomSpeed = new Float32Array(this.count);
    const noiseOffset = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      randomSpeed[i] = 0.4 + Math.random() * 0.9;
      noiseOffset[i] = Math.random() * Math.PI * 2;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('targetPosition', new THREE.BufferAttribute(targetPositions, 3));
    this.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    this.geometry.setAttribute('targetColor', new THREE.BufferAttribute(targetColors, 3));
    this.geometry.setAttribute('aRandomSpeed', new THREE.BufferAttribute(randomSpeed, 1));
    this.geometry.setAttribute('aNoiseOffset', new THREE.BufferAttribute(noiseOffset, 1));

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorphProgress: { value: 1.0 },
        uMouse3D: { value: new THREE.Vector3(0, 0, 150) },
        uShockwaveCenter: { value: new THREE.Vector3(0, 0, 0) },
        uShockwaveRadius: { value: -100.0 },
        uShockwaveStrength: { value: 0.0 },
        uGlitchIntensity: { value: 0.0 },
        uPointSize: { value: window.innerWidth < 768 ? 20.0 : 26.0 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uMorphProgress;
        uniform vec3 uMouse3D;
        uniform vec3 uShockwaveCenter;
        uniform float uShockwaveRadius;
        uniform float uShockwaveStrength;
        uniform float uGlitchIntensity;
        uniform float uPointSize;

        attribute vec3 targetPosition;
        attribute vec3 aColor;
        attribute vec3 targetColor;
        attribute float aRandomSpeed;
        attribute float aNoiseOffset;

        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float localProgress = clamp((uMorphProgress * (1.0 + aRandomSpeed * 0.7)) - (aRandomSpeed * 0.35), 0.0, 1.0);
          float ease = localProgress < 0.5 
            ? 4.0 * localProgress * localProgress * localProgress 
            : 1.0 - pow(-2.0 * localProgress + 2.0, 3.0) / 2.0;

          vec3 basePos = mix(position, targetPosition, ease);
          vec3 baseCol = mix(aColor, targetColor, ease);

          // Living breath pulse
          float breath = sin(uTime * 2.2 + aNoiseOffset) * 4.5;
          basePos.y += breath;
          basePos.x += cos(uTime * 1.5 + aNoiseOffset) * 2.5;

          // 3D Mouse Parallax & Attraction
          vec3 toMouse = uMouse3D - basePos;
          float distToMouse = length(toMouse);
          if (distToMouse < 280.0) {
            float influence = (1.0 - distToMouse / 280.0);
            basePos += normalize(toMouse) * (influence * 35.0);
            baseCol += vec3(0.3, 0.05, 0.05) * influence;
          }

          // Click / Key Shockwave Explosion
          if (uShockwaveRadius > 0.0) {
            float distFromShock = length(basePos - uShockwaveCenter);
            float waveDelta = abs(distFromShock - uShockwaveRadius);
            if (waveDelta < 180.0) {
              float waveForce = (1.0 - waveDelta / 180.0) * uShockwaveStrength;
              vec3 blastDir = normalize(basePos - uShockwaveCenter + vec3(0.001));
              basePos += blastDir * (waveForce * 240.0);
              baseCol = mix(baseCol, vec3(1.0, 0.15, 0.15), waveForce * 0.85);
            }
          }

          // Chromatic / Glitch Displacement Burst
          if (uGlitchIntensity > 0.01) {
            float glitchNoise = sin(basePos.y * 0.18 + uTime * 45.0);
            if (abs(glitchNoise) > 0.5) {
              basePos.x += sign(glitchNoise) * uGlitchIntensity * 120.0;
              basePos.z += cos(glitchNoise * 5.0) * uGlitchIntensity * 80.0;
              baseCol.r += 0.8 * uGlitchIntensity;
              baseCol.b += 0.9 * uGlitchIntensity;
            }
          }

          vColor = baseCol;
          vAlpha = 0.85 + sin(uTime * 3.0 + aNoiseOffset) * 0.15;

          vec4 mvPosition = modelViewMatrix * vec4(basePos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = (uPointSize / -mvPosition.z) * (180.0 + sin(aNoiseOffset + uTime) * 25.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float intensity = pow(1.0 - (dist * 2.0), 1.8);
          vec3 finalColor = vColor * intensity;
          finalColor += vec3(0.8) * pow(1.0 - (dist * 2.0), 5.0);

          gl_FragColor = vec4(finalColor, vAlpha * intensity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  morphToEntity(index = null) {
    if (index !== null) {
      this.currentEntityIndex = index % this.entities.length;
    } else {
      this.currentEntityIndex = (this.currentEntityIndex + 1) % this.entities.length;
    }

    const currentTarget = this.entities[this.currentEntityIndex];

    const posAttr = this.geometry.attributes.position;
    const targetPosAttr = this.geometry.attributes.targetPosition;
    const colAttr = this.geometry.attributes.aColor;
    const targetColAttr = this.geometry.attributes.targetColor;

    const currentProgress = this.material.uniforms.uMorphProgress.value;
    const rSpeed = this.geometry.attributes.aRandomSpeed.array;

    for (let i = 0; i < this.count * 3; i++) {
      const pIdx = Math.floor(i / 3);
      const localProg = Math.min(Math.max((currentProgress * (1.0 + rSpeed[pIdx] * 0.7)) - (rSpeed[pIdx] * 0.35), 0.0), 1.0);
      const ease = localProg < 0.5 ? 4.0 * localProg * localProg * localProg : 1.0 - Math.pow(-2.0 * localProg + 2.0, 3.0) / 2.0;

      posAttr.array[i] = posAttr.array[i] + (targetPosAttr.array[i] - posAttr.array[i]) * ease;
      colAttr.array[i] = colAttr.array[i] + (targetColAttr.array[i] - colAttr.array[i]) * ease;

      targetPosAttr.array[i] = currentTarget.positions[i];
      targetColAttr.array[i] = currentTarget.colors[i];
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    targetPosAttr.needsUpdate = true;
    targetColAttr.needsUpdate = true;

    this.morphProgress = 0.0;
    this.isMorphing = true;
    this.material.uniforms.uMorphProgress.value = 0.0;
    this.lastMorphTime = this.clock.getElapsedTime();

    return currentTarget;
  }

  triggerClickExplosion(screenX, screenY) {
    const ndcX = (screenX / window.innerWidth) * 2 - 1;
    const ndcY = -(screenY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
    const targetPoint = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.interactionPlane, targetPoint);

    this.material.uniforms.uShockwaveCenter.value.copy(targetPoint);
    this.material.uniforms.uShockwaveRadius.value = 10.0;
    this.material.uniforms.uShockwaveStrength.value = 1.0;
    this.shockwaveActive = true;
    this.shockwaveTime = 0.0;

    this.glitchIntensity = 1.0;
    const glitchOverlay = document.getElementById('glitch-overlay');
    if (glitchOverlay) {
      glitchOverlay.classList.remove('shockwave-flash');
      void glitchOverlay.offsetWidth;
      glitchOverlay.classList.add('shockwave-flash');
    }
  }

  /**
   * Scary Sudden Jumpscare & Violent Camera Lunge (Triggered on any Keypress)
   */
  triggerScaryJumpscare(intensity = 1.0) {
    // 1. Violent camera lunge forward towards face
    this.lungeZ = 340.0 * intensity;
    this.shakeIntensity = 28.0 * intensity;

    // 2. Maximum particle glitch fragmentation
    this.glitchIntensity = 1.8 * intensity;

    // 3. Central shockwave eruption
    this.material.uniforms.uShockwaveCenter.value.set(
      (Math.random() - 0.5) * 120,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 60
    );
    this.material.uniforms.uShockwaveRadius.value = 15.0;
    this.material.uniforms.uShockwaveStrength.value = 1.4;
    this.shockwaveActive = true;
    this.shockwaveTime = 0.0;

    // 4. Trigger body screen glitch animation
    document.body.classList.remove('glitch-active');
    void document.body.offsetWidth;
    document.body.classList.add('glitch-active');

    // 5. Glitch flash overlay
    const glitchOverlay = document.getElementById('glitch-overlay');
    if (glitchOverlay) {
      glitchOverlay.classList.remove('shockwave-flash');
      void glitchOverlay.offsetWidth;
      glitchOverlay.classList.add('shockwave-flash');
    }
  }

  onMouseMove(e) {
    this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.targetMouse, this.camera);
    this.raycaster.ray.intersectPlane(this.interactionPlane, this.mouse3D);
    this.material.uniforms.uMouse3D.value.copy(this.mouse3D);

    const distToCenter = Math.sqrt(this.targetMouse.x * this.targetMouse.x + this.targetMouse.y * this.targetMouse.y);
    const proximity = Math.max(0, 1 - distToCenter);
    const speed = Math.abs(this.targetMouse.x - this.mouse.x) + Math.abs(this.targetMouse.y - this.mouse.y);

    if (window.horrorAudio) {
      window.horrorAudio.updateHoverTension(proximity, speed);
    }
  }

  onTouchMove(e) {
    if (e.touches.length > 0) {
      this.onMouseMove(e.touches[0]);
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.material.uniforms.uPointSize.value = window.innerWidth < 768 ? 20.0 : 26.0;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    this.material.uniforms.uTime.value = elapsedTime;

    // Parallax
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.06;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.06;

    // Camera shake decay
    let shakeX = 0, shakeY = 0;
    if (this.shakeIntensity > 0.01) {
      shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      shakeY = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity -= delta * 35.0;
      if (this.shakeIntensity < 0) this.shakeIntensity = 0;
    }

    // Camera lunge decay
    if (this.lungeZ > 0.1) {
      this.lungeZ -= delta * 280.0;
      if (this.lungeZ < 0) this.lungeZ = 0;
    }

    this.camera.position.x = this.mouse.x * 120.0 + shakeX;
    this.camera.position.y = this.mouse.y * 90.0 + shakeY;
    this.camera.position.z = 850.0 - this.lungeZ;
    this.camera.lookAt(0, 0, 0);

    // Morph progress
    if (this.isMorphing) {
      this.morphProgress += delta / this.morphDuration;
      if (this.morphProgress >= 1.0) {
        this.morphProgress = 1.0;
        this.isMorphing = false;
      }
      this.material.uniforms.uMorphProgress.value = this.morphProgress;
    }

    // Shockwave expansion & decay
    if (this.shockwaveActive) {
      this.shockwaveTime += delta;
      const progress = this.shockwaveTime / this.shockwaveDuration;
      if (progress >= 1.0) {
        this.shockwaveActive = false;
        this.material.uniforms.uShockwaveRadius.value = -100.0;
        this.material.uniforms.uShockwaveStrength.value = 0.0;
      } else {
        this.material.uniforms.uShockwaveRadius.value = progress * 950.0;
        this.material.uniforms.uShockwaveStrength.value = Math.pow(1.0 - progress, 2.0);
      }
    }

    // Glitch decay
    if (this.glitchIntensity > 0.001) {
      this.glitchIntensity -= delta * 3.0;
      this.material.uniforms.uGlitchIntensity.value = Math.max(0, this.glitchIntensity);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.HorrorParticleEngine = HorrorParticleEngine;
