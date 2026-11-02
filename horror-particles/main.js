/**
 * ASTRAL HORROR // Main Application Controller
 * Handles user interactions, click-to-summon shockwaves,
 * scary keypress jumpscare actions, entity pill navigation, and HUD updates.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Engine
  const engine = new HorrorParticleEngine('canvas-container');

  // 2. DOM Elements
  const audioModal = document.getElementById('audio-modal');
  const btnEnter = document.getElementById('btn-enter');
  const btnSound = document.getElementById('btn-sound');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const audioTrackSelect = document.getElementById('audio-track-select');
  const currentEntityName = document.getElementById('current-entity-name');
  const pillsContainer = document.getElementById('entity-pills');
  const customCursor = document.getElementById('custom-cursor');
  const pulseDisplay = document.getElementById('pulse-display');

  let experienceStarted = false;

  // 3. Populate Entity Navigation Pills
  engine.entities.forEach((ent, index) => {
    const pill = document.createElement('button');
    pill.className = `entity-pill ${index === 0 ? 'active' : ''}`;
    pill.innerText = ent.name;
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      switchToEntity(index, true);
    });
    pillsContainer.appendChild(pill);
  });

  function updateHUD(entity, index) {
    currentEntityName.innerText = entity.name;
    const pills = document.querySelectorAll('.entity-pill');
    pills.forEach((p, idx) => {
      if (idx === index) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    const pulseModes = ['TERROR', 'DREAD', 'AGONY', 'PARALYSIS', 'VOID', 'CORRUPT', 'CHAOS', 'NIGHTMARE', 'POSSESSED', 'ABYSS'];
    pulseDisplay.innerText = pulseModes[index % pulseModes.length];
  }

  function switchToEntity(index = null, fromPill = false) {
    const newEntity = engine.morphToEntity(index);
    if (!newEntity) return;

    updateHUD(newEntity, engine.currentEntityIndex);

    if (window.horrorAudio) {
      window.horrorAudio.triggerHorrorStinger(fromPill ? 0.8 : 1.0);
    }
  }

  // 4. Start Experience / Audio Modal
  btnEnter.addEventListener('click', () => {
    experienceStarted = true;
    audioModal.classList.add('modal-hidden');

    if (window.horrorAudio) {
      window.horrorAudio.init();
      window.horrorAudio.resume();
    }

    setTimeout(() => {
      if (window.horrorAudio) {
        window.horrorAudio.triggerHorrorStinger(0.6, 'screech');
      }
    }, 400);
  });

  // 5. Click Anywhere to Blast Particles & Morph to Next Nightmare
  window.addEventListener('click', (e) => {
    if (!experienceStarted) return;
    if (e.target && typeof e.target.closest === 'function') {
      if (e.target.closest('#hud') || e.target.closest('#audio-modal')) return;
    }

    engine.triggerClickExplosion(e.clientX, e.clientY);
    switchToEntity();
  });

  // 6. Custom Cursor & Hover Tracking
  window.addEventListener('mousemove', (e) => {
    if (customCursor) {
      customCursor.style.left = `${e.clientX}px`;
      customCursor.style.top = `${e.clientY}px`;
    }
  });

  // 7. Header Controls (Sound & Fullscreen)
  btnSound.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.horrorAudio) {
      const isSoundOn = window.horrorAudio.toggleMute();
      btnSound.innerText = isSoundOn ? '🔊' : '🔇';
    }
  });

  if (audioTrackSelect) {
    audioTrackSelect.addEventListener('change', (e) => {
      e.stopPropagation();
      if (window.horrorAudio) {
        window.horrorAudio.playAtmosphereTrack(e.target.value);
      }
    });
    audioTrackSelect.addEventListener('click', (e) => e.stopPropagation());
  }

  btnFullscreen.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
      btnFullscreen.innerText = '✕';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        btnFullscreen.innerText = '⛶';
      }
    }
  });

  // 8. Scary Actions, Audio Stinger & Glitch VFX on ANY KEYPRESS
  window.addEventListener('keydown', (e) => {
    if (!experienceStarted) {
      btnEnter.click();
      return;
    }

    // Trigger scary VFX: camera lunge, screen invert glitch, shockwave explosion
    engine.triggerScaryJumpscare(1.0);

    // Audio SFX: Play a visceral procedural horror stinger
    if (window.horrorAudio) {
      const stingers = ['bassDrop', 'screech', 'boneCrack', 'ghostGasp', 'abyssalMoan'];
      const picked = stingers[Math.floor(Math.random() * stingers.length)];
      window.horrorAudio.triggerHorrorStinger(1.1, picked);
    }

    // Specific key controls
    if (e.code === 'KeyM') {
      btnSound.click();
    } else if (e.code === 'KeyF') {
      btnFullscreen.click();
    } else if (e.key >= '1' && e.key <= '9') {
      const idx = parseInt(e.key) - 1;
      if (idx < engine.entities.length) {
        switchToEntity(idx, true);
      }
    } else {
      // Space, Enter, or any letter/arrow morphs to next terrifying nightmare
      switchToEntity();
    }
  });
});
