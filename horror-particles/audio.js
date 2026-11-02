/**
 * ASTRAL HORROR // Procedural Web Audio API Soundscape & Horror SFX
 * 
 * Includes:
 * - 4 Selectable Atmospheric Background Tracks:
 *    1. "Cavern of the Damned" (Subterranean sub-bass rumble & breathing drone)
 *    2. "The Catacombs" (Cold bowed dissonant metal & binaural heartbeat pulse)
 *    3. "Abyssal Trench" (Eerie underwater resonance & low-frequency ocean drones)
 *    4. "Cyber Poltergeist" (High-frequency glitch static & electrical hum)
 * - 5 Distinct Procedural Horror Stingers:
 *    1. Sub-Bass Void Blast (Shockwave impact)
 *    2. Dissonant Tritone Screech (Violin / bowed metal shriek)
 *    3. Whispering Spirit Gasp (Filtered noise burst)
 *    4. Metallic Spine Crack (Piercing percussive transient)
 *    5. Abyssal Whale Moan (Glissando downward pitch dive)
 * - Cursor Proximity Static & Interactive Whispers
 */

class HorrorAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isInitialized = false;

    // Master bus
    this.masterGain = null;

    // Background soundtrack nodes
    this.currentTrack = "cavern";
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.droneGain = null;
    this.heartbeatOsc = null;
    this.heartbeatGain = null;
    this.heartbeatInterval = null;

    // Ethereal wind / whisper nodes
    this.windNode = null;
    this.windFilter = null;
    this.windGain = null;

    // Hover dynamic resonance
    this.hoverFilter = null;
    this.hoverGain = null;
  }

  init() {
    if (this.isInitialized) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Start default atmospheric ambient soundtrack
      this.playAtmosphereTrack("cavern");
      this.startSpectralWind();

      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Switch between procedural horror music atmospheres
   */
  playAtmosphereTrack(trackName) {
    if (!this.ctx) return;
    this.currentTrack = trackName;
    const now = this.ctx.currentTime;

    // Stop previous drone gracefully
    if (this.droneGain) {
      this.droneGain.gain.linearRampToValueAtTime(0.001, now + 0.4);
      setTimeout(() => {
        try {
          if (this.droneOsc1) this.droneOsc1.stop();
          if (this.droneOsc2) this.droneOsc2.stop();
        } catch(e) {}
      }, 450);
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Spawn new track
    setTimeout(() => {
      const t = this.ctx.currentTime;
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, t);
      this.droneGain.gain.linearRampToValueAtTime(0.28, t + 0.8);
      this.droneGain.connect(this.masterGain);

      if (trackName === "cavern") {
        // Deep subterranean D-minor drone (42Hz & 63Hz)
        this.droneOsc1 = this.ctx.createOscillator();
        this.droneOsc1.type = 'sawtooth';
        this.droneOsc1.frequency.setValueAtTime(42, t);

        this.droneOsc2 = this.ctx.createOscillator();
        this.droneOsc2.type = 'sine';
        this.droneOsc2.frequency.setValueAtTime(63.2, t); // microtonal detune

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(115, t);
        filter.Q.setValueAtTime(3.5, t);

        this.droneOsc1.connect(filter);
        this.droneOsc2.connect(filter);
        filter.connect(this.droneGain);

        this.droneOsc1.start(t);
        this.droneOsc2.start(t);
      } else if (trackName === "catacombs") {
        // Cold catacombs with slow terrifying heartbeat pulse
        this.droneOsc1 = this.ctx.createOscillator();
        this.droneOsc1.type = 'triangle';
        this.droneOsc1.frequency.setValueAtTime(55, t);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(160, t);
        filter.Q.setValueAtTime(6.0, t);

        this.droneOsc1.connect(filter);
        filter.connect(this.droneGain);
        this.droneOsc1.start(t);

        // Heartbeat thud every 1.8s
        this.heartbeatInterval = setInterval(() => {
          if (this.isMuted || !this.ctx) return;
          this.playHeartbeat();
        }, 1800);
      } else if (trackName === "abyssal") {
        // Low-frequency underwater rumble
        this.droneOsc1 = this.ctx.createOscillator();
        this.droneOsc1.type = 'sine';
        this.droneOsc1.frequency.setValueAtTime(32, t); // Sub-audible pressure

        this.droneOsc2 = this.ctx.createOscillator();
        this.droneOsc2.type = 'sine';
        this.droneOsc2.frequency.setValueAtTime(48.5, t);

        this.droneOsc1.connect(this.droneGain);
        this.droneOsc2.connect(this.droneGain);
        this.droneOsc1.start(t);
        this.droneOsc2.start(t);
      } else if (trackName === "cyber") {
        // Glitch electrical hum & harsh square waves
        this.droneOsc1 = this.ctx.createOscillator();
        this.droneOsc1.type = 'sawtooth';
        this.droneOsc1.frequency.setValueAtTime(60, t); // 60Hz mains hum

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'notch';
        filter.frequency.setValueAtTime(240, t);

        this.droneOsc1.connect(filter);
        filter.connect(this.droneGain);
        this.droneOsc1.start(t);
      }
    }, 400);
  }

  playHeartbeat() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Dual thud: lub-dub
    [0, 0.22].forEach((offset) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, now + offset);
      osc.frequency.exponentialRampToValueAtTime(30, now + offset + 0.15);

      gain.gain.setValueAtTime(0.35, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + offset);
      osc.stop(now + offset + 0.2);
    });
  }

  startSpectralWind() {
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.06;
      b6 = white * 0.115926;
    }

    this.windNode = this.ctx.createBufferSource();
    this.windNode.buffer = noiseBuffer;
    this.windNode.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    this.windFilter.Q.setValueAtTime(5.0, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    this.windNode.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    this.windNode.start();
  }

  updateHoverTension(proximity, speed) {
    if (!this.isInitialized || this.isMuted) return;

    const t = this.ctx.currentTime;
    const targetFreq = 180 + proximity * 480 + speed * 180;
    this.windFilter.frequency.setTargetAtTime(targetFreq, t, 0.1);

    if (this.droneGain) {
      const targetDrone = 0.22 + proximity * 0.22;
      this.droneGain.gain.setTargetAtTime(targetDrone, t, 0.1);
    }
  }

  /**
   * Visceral Jumpscare / Horror Stinger triggered on click or entity morph
   */
  triggerHorrorStinger(intensity = 1.0, type = null) {
    if (!this.isInitialized || this.isMuted) return;

    const now = this.ctx.currentTime;
    const stingerTypes = ["bassDrop", "screech", "boneCrack", "ghostGasp", "abyssalMoan"];
    const chosen = type || stingerTypes[Math.floor(Math.random() * stingerTypes.length)];

    // 1. Sub-Bass Void Blast (Always present as tactile impact)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(155, now);
    subOsc.frequency.exponentialRampToValueAtTime(26, now + 0.65);

    subGain.gain.setValueAtTime(0.85 * intensity, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 0.8);

    // 2. Specialized Stinger Layer
    if (chosen === "screech") {
      // Dissonant violin screech
      [440, 466.16, 622.25, 880, 932].forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * 0.08), now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.45, now + 0.45);

        gain.gain.setValueAtTime(0.18 * intensity, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.55);
      });
    } else if (chosen === "boneCrack") {
      // High-frequency wooden / bone snapping transient
      const snapBuf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.08, this.ctx.sampleRate);
      const snapData = snapBuf.getChannelData(0);
      for (let i = 0; i < snapData.length; i++) {
        snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.008));
      }
      const snapSrc = this.ctx.createBufferSource();
      snapSrc.buffer = snapBuf;
      const snapGain = this.ctx.createGain();
      snapGain.gain.setValueAtTime(0.7 * intensity, now);
      snapSrc.connect(snapGain);
      snapGain.connect(this.masterGain);
      snapSrc.start(now);
    } else if (chosen === "ghostGasp") {
      // Spectral exhaled breath
      const gaspBuf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.35, this.ctx.sampleRate);
      const gaspData = gaspBuf.getChannelData(0);
      for (let i = 0; i < gaspData.length; i++) {
        gaspData[i] = (Math.random() * 2 - 1) * Math.sin((i / gaspData.length) * Math.PI);
      }
      const gaspSrc = this.ctx.createBufferSource();
      gaspSrc.buffer = gaspBuf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.35);

      const gaspGain = this.ctx.createGain();
      gaspGain.gain.setValueAtTime(0.5 * intensity, now);
      gaspSrc.connect(filter);
      filter.connect(gaspGain);
      gaspGain.connect(this.masterGain);
      gaspSrc.start(now);
    } else if (chosen === "abyssalMoan") {
      // Glissando creature moan
      const moanOsc = this.ctx.createOscillator();
      const moanGain = this.ctx.createGain();
      moanOsc.type = 'sawtooth';
      moanOsc.frequency.setValueAtTime(280, now);
      moanOsc.frequency.exponentialRampToValueAtTime(55, now + 0.85);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      moanGain.gain.setValueAtTime(0.4 * intensity, now);
      moanGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      moanOsc.connect(filter);
      filter.connect(moanGain);
      moanGain.connect(this.masterGain);
      moanOsc.start(now);
      moanOsc.stop(now + 0.9);
    }
  }

  toggleMute() {
    if (!this.isInitialized) {
      this.init();
      return true;
    }
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.7, now, 0.05);
    }
    return !this.isMuted;
  }
}

window.horrorAudio = new HorrorAudioEngine();
