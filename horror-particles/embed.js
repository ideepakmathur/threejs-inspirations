/**
 * ASTRAL HORROR // Drop-in Background Embed Component
 * 
 * Embed anywhere with ONE script tag or ES module:
 * <div id="my-horror-bg" style="width: 100%; height: 100vh;"></div>
 * <script src="embed.js"></script>
 * <script>
 *   const bg = new AstralHorrorBackground({
 *     containerId: 'my-horror-bg',
 *     entity: 'wendigo',       // or 'eldritch', 'demon', 'plague', etc.
 *     particleCount: 50000,
 *     enableAudio: false,      // true for ambient drone
 *     enableShockwave: true,   // clicks trigger explosions
 *     interactive: true        // parallax mouse movement
 *   });
 * </script>
 */

(function(global) {
  class AstralHorrorBackground {
    constructor(options = {}) {
      this.container = typeof options.containerId === 'string' 
        ? document.getElementById(options.containerId) 
        : (options.container || document.body);

      this.entityId = options.entity || 'wendigo';
      this.particleCount = options.particleCount || 45000;
      this.enableAudio = !!options.enableAudio;
      this.enableShockwave = options.enableShockwave !== false;
      this.interactive = options.interactive !== false;
      this.pointSize = options.pointSize || 22.0;

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.geometry = null;
      this.material = null;
      this.points = null;
      this.clock = null;

      this.mouse = { x: 0, y: 0 };
      this.targetMouse = { x: 0, y: 0 };
      this.mouse3D = null;
      this.raycaster = null;
      this.plane = null;

      this.shockwaveActive = false;
      this.shockwaveTime = 0;

      this.init();
    }

    init() {
      if (typeof THREE === 'undefined') {
        console.error("AstralHorrorBackground requires Three.js. Please include Three.js before embed.js.");
        return;
      }

      this.clock = new THREE.Clock();
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x030305, 0.00075);

      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;

      this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 6000);
      this.camera.position.set(0, 0, 850);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setClearColor(0x000000, 0); // transparent background for embedding behind website content!

      this.renderer.domElement.style.position = 'absolute';
      this.renderer.domElement.style.top = '0';
      this.renderer.domElement.style.left = '0';
      this.renderer.domElement.style.width = '100%';
      this.renderer.domElement.style.height = '100%';
      this.renderer.domElement.style.pointerEvents = this.enableShockwave ? 'auto' : 'none';

      this.container.style.position = 'relative';
      this.container.appendChild(this.renderer.domElement);

      this.mouse3D = new THREE.Vector3(0, 0, 150);
      this.raycaster = new THREE.Raycaster();
      this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

      // Fetch or generate entity
      const entityData = this.getEntityData(this.entityId);
      this.createParticles(entityData);

      // Event bindings
      if (this.interactive) {
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
      }
      if (this.enableShockwave) {
        this.renderer.domElement.addEventListener('click', this.onClick.bind(this));
      }
      window.addEventListener('resize', this.onResize.bind(this));

      this.animate();
    }

    getEntityData(id) {
      if (typeof EntityGenerator === 'undefined') {
        // Fallback procedural spiral
        const pos = new Float32Array(this.particleCount * 3);
        const col = new Float32Array(this.particleCount * 3);
        for(let i=0; i<this.particleCount; i++) {
          const a = i * 0.05; const r = Math.sqrt(i) * 5;
          pos[i*3] = Math.cos(a)*r; pos[i*3+1] = Math.sin(a)*r; pos[i*3+2] = (Math.random()-0.5)*100;
          col[i*3] = 0.8; col[i*3+1] = 0.2; col[i*3+2] = 0.2;
        }
        return { positions: pos, colors: col };
      }

      const map = {
        'wendigo': EntityGenerator.generateSmilingWendigo,
        'eldritch': EntityGenerator.generateEldritchBehemoth,
        'demon': EntityGenerator.generateHornedDemon,
        'wraith': EntityGenerator.generateVoidWraith,
        'doll': EntityGenerator.generateFracturedDoll,
        'glitch': EntityGenerator.generateGlitchPoltergeist,
        'plague': EntityGenerator.generatePlagueDoctor,
        'arachnid': EntityGenerator.generateArachnidMother,
        'cyber': EntityGenerator.generateCyberDemon,
        'leviathan': EntityGenerator.generateAbyssalLeviathan,
        'reaper': EntityGenerator.generateShadowReaper,
        'oculus': EntityGenerator.generateCosmicOculus,
        'void': EntityGenerator.generateCosmicVoid
      };

      const fn = map[id] || EntityGenerator.generateSmilingWendigo;
      return fn.call(EntityGenerator, this.particleCount);
    }

    createParticles(data) {
      this.geometry = new THREE.BufferGeometry();
      const rSpeed = new Float32Array(this.particleCount);
      const nOffset = new Float32Array(this.particleCount);

      for (let i = 0; i < this.particleCount; i++) {
        rSpeed[i] = 0.5 + Math.random() * 0.8;
        nOffset[i] = Math.random() * Math.PI * 2;
      }

      this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(data.positions), 3));
      this.geometry.setAttribute('targetPosition', new THREE.BufferAttribute(new Float32Array(data.positions), 3));
      this.geometry.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(data.colors), 3));
      this.geometry.setAttribute('targetColor', new THREE.BufferAttribute(new Float32Array(data.colors), 3));
      this.geometry.setAttribute('aRandomSpeed', new THREE.BufferAttribute(rSpeed, 1));
      this.geometry.setAttribute('aNoiseOffset', new THREE.BufferAttribute(nOffset, 1));

      this.material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMorphProgress: { value: 1.0 },
          uMouse3D: { value: new THREE.Vector3(0, 0, 150) },
          uShockwaveCenter: { value: new THREE.Vector3(0, 0, 0) },
          uShockwaveRadius: { value: -100.0 },
          uShockwaveStrength: { value: 0.0 },
          uPointSize: { value: this.pointSize }
        },
        vertexShader: `
          uniform float uTime;
          uniform float uMorphProgress;
          uniform vec3 uMouse3D;
          uniform vec3 uShockwaveCenter;
          uniform float uShockwaveRadius;
          uniform float uShockwaveStrength;
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

            // Undulating breath
            basePos.y += sin(uTime * 2.2 + aNoiseOffset) * 4.0;
            basePos.x += cos(uTime * 1.5 + aNoiseOffset) * 2.0;

            // Mouse proximity
            vec3 toMouse = uMouse3D - basePos;
            float dist = length(toMouse);
            if (dist < 260.0) {
              float inf = (1.0 - dist / 260.0);
              basePos += normalize(toMouse) * (inf * 30.0);
              baseCol += vec3(0.3, 0.05, 0.05) * inf;
            }

            // Shockwave
            if (uShockwaveRadius > 0.0) {
              float d = length(basePos - uShockwaveCenter);
              float delta = abs(d - uShockwaveRadius);
              if (delta < 180.0) {
                float force = (1.0 - delta / 180.0) * uShockwaveStrength;
                basePos += normalize(basePos - uShockwaveCenter + vec3(0.001)) * (force * 220.0);
                baseCol = mix(baseCol, vec3(1.0, 0.15, 0.15), force * 0.85);
              }
            }

            vColor = baseCol;
            vAlpha = 0.85 + sin(uTime * 3.0 + aNoiseOffset) * 0.15;

            vec4 mvPosition = modelViewMatrix * vec4(basePos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = (uPointSize / -mvPosition.z) * 190.0;
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
            vec3 finalCol = vColor * intensity + vec3(0.7) * pow(1.0 - (dist * 2.0), 4.5);
            gl_FragColor = vec4(finalCol, vAlpha * intensity);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      this.points = new THREE.Points(this.geometry, this.material);
      this.scene.add(this.points);
    }

    setEntity(id) {
      const data = this.getEntityData(id);
      const posAttr = this.geometry.attributes.position;
      const targetPosAttr = this.geometry.attributes.targetPosition;
      const colAttr = this.geometry.attributes.aColor;
      const targetColAttr = this.geometry.attributes.targetColor;

      for (let i = 0; i < this.particleCount * 3; i++) {
        posAttr.array[i] = targetPosAttr.array[i];
        colAttr.array[i] = targetColAttr.array[i];
        targetPosAttr.array[i] = data.positions[i];
        targetColAttr.array[i] = data.colors[i];
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      targetPosAttr.needsUpdate = true;
      targetColAttr.needsUpdate = true;

      this.material.uniforms.uMorphProgress.value = 0.0;
    }

    onClick(e) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
      const targetPoint = new THREE.Vector3();
      this.raycaster.ray.intersectPlane(this.plane, targetPoint);

      this.material.uniforms.uShockwaveCenter.value.copy(targetPoint);
      this.material.uniforms.uShockwaveRadius.value = 10.0;
      this.material.uniforms.uShockwaveStrength.value = 1.0;
      this.shockwaveActive = true;
      this.shockwaveTime = 0.0;

      if (window.horrorAudio && this.enableAudio) {
        window.horrorAudio.triggerHorrorStinger(1.0);
      }
    }

    onMouseMove(e) {
      this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(new THREE.Vector2(this.targetMouse.x, this.targetMouse.y), this.camera);
      this.raycaster.ray.intersectPlane(this.plane, this.mouse3D);
      this.material.uniforms.uMouse3D.value.copy(this.mouse3D);
    }

    onResize() {
      const w = this.container.clientWidth || window.innerWidth;
      const h = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }

    animate() {
      requestAnimationFrame(this.animate.bind(this));
      const delta = this.clock.getDelta();
      const time = this.clock.getElapsedTime();

      this.material.uniforms.uTime.value = time;

      if (this.interactive) {
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.06;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.06;
        this.camera.position.x = this.mouse.x * 110.0;
        this.camera.position.y = this.mouse.y * 85.0;
        this.camera.lookAt(0, 0, 0);
      }

      if (this.material.uniforms.uMorphProgress.value < 1.0) {
        this.material.uniforms.uMorphProgress.value = Math.min(1.0, this.material.uniforms.uMorphProgress.value + delta / 1.35);
      }

      if (this.shockwaveActive) {
        this.shockwaveTime += delta;
        const prog = this.shockwaveTime / 0.85;
        if (prog >= 1.0) {
          this.shockwaveActive = false;
          this.material.uniforms.uShockwaveRadius.value = -100.0;
        } else {
          this.material.uniforms.uShockwaveRadius.value = prog * 950.0;
          this.material.uniforms.uShockwaveStrength.value = Math.pow(1.0 - prog, 2.0);
        }
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  global.AstralHorrorBackground = AstralHorrorBackground;
})(window);
