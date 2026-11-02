/**
 * ASTRAL HORROR // Main Application Controller
 * Handles user interactions, click-to-summon shockwaves,
 * entity pill navigation, keyboard shortcuts, and HUD updates.
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
      e.stopPropagation(); // don't trigger general canvas click
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

    // Update pulse state text
    const pulseModes = ['TERROR', 'DREAD', 'AGONY', 'PARALYSIS', 'VOID', 'CORRUPT', 'CHAOS'];
    pulseDisplay.innerText = pulseModes[index % pulseModes.length];
  }

  function switchToEntity(index = null, fromPill = false) {
    const newEntity = engine.morphToEntity(index);
    if (!newEntity) return;

    updateHUD(newEntity, engine.currentEntityIndex);

    // Audio stinger & dread blast
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

    // Initial eerie stinger welcome
    setTimeout(() => {
      if (window.horrorAudio) {
        window.horrorAudio.triggerHorrorStinger(0.6);
      }
    }, 400);
  });

  // 5. Click Anywhere to Blast Particles & Morph to Next Nightmare
  window.addEventListener('click', (e) => {
    if (!experienceStarted) return;
    if (e.target && typeof e.target.closest === 'function') {
      if (e.target.closest('#hud') || e.target.closest('#audio-modal')) return;
    }

    // Trigger explosive shockwave at click position
    engine.triggerClickExplosion(e.clientX, e.clientY);

    // Morph to next horrifying creature
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

  // 8. Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (!experienceStarted) return;

    if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'Enter') {
      e.preventDefault();
      engine.triggerClickExplosion(window.innerWidth / 2, window.innerHeight / 2);
      switchToEntity();
    } else if (e.code === 'KeyM') {
      btnSound.click();
    } else if (e.code === 'KeyF') {
      btnFullscreen.click();
    } else if (e.key >= '1' && e.key <= '7') {
      const idx = parseInt(e.key) - 1;
      if (idx < engine.entities.length) {
        engine.triggerClickExplosion(window.innerWidth / 2, window.innerHeight / 2);
        switchToEntity(idx, true);
      }
    }
  });
});
