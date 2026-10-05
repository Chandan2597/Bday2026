/**
 * ==========================================================
 * 🌟 MAIN APPLICATION CONTROLLER & SPARKLE PARTICLES 🌟
 * Orchestrates all subsystems, cursor trails, music controls,
 * and page transitions.
 * ==========================================================
 */

class AppController {
  constructor() {
    this.musicPlayerEl = document.getElementById('floating-music-player');
    this.musicToggleBtn = document.getElementById('music-toggle-btn');
    this.musicIcon = document.getElementById('music-icon');
    this.musicStatus = document.getElementById('music-status-text');
    this.isMuted = false;
  }

  init() {
    // 1. Initialize ambient falling petals canvas
    if (window.flowerEngine) {
      window.flowerEngine.initAmbientCanvas('ambient-canvas');
    }

    // 2. Initialize Lock Screen
    if (window.lockScreen) {
      window.lockScreen.init();
    }

    // 3. Attach Music Toggle
    this.setupMusicPlayer();

    // 4. Attach Sparkle Cursor Trail
    this.setupSparkleTrail();

    // 5. Populate Dynamic Header Names from CONFIG
    this.populateConfigData();
  }

  populateConfigData() {
    if (!window.CONFIG) return;
    
    // Update recipient nicknames across elements
    const nameElements = document.querySelectorAll('.recipient-nickname');
    nameElements.forEach((el) => {
      el.textContent = window.CONFIG.nickname || "Miss Universe";
    });

    const bdayDates = document.querySelectorAll('.recipient-birthday-date');
    bdayDates.forEach((el) => {
      el.textContent = window.CONFIG.birthdayDate || "October 6";
    });
  }

  onSiteUnlocked() {
    // Initialize ribbons, typewriter, and mini-games
    if (window.photoRibbonEngine) {
      window.photoRibbonEngine.init();
    }
    if (window.typewriterEngine) {
      window.typewriterEngine.init();
    }
    if (window.birthdayGamesEngine) {
      window.birthdayGamesEngine.init();
    }

    // Reveal floating music controller
    if (this.musicPlayerEl) {
      this.musicPlayerEl.classList.remove('hidden');
      this.musicPlayerEl.classList.add('visible');
    }

    // Start background melody if allowed
    this.updateMusicUI(true);
  }

  setupMusicPlayer() {
    if (!this.musicToggleBtn) return;

    this.musicToggleBtn.addEventListener('click', () => {
      if (window.soundEngine) {
        const isPlaying = window.soundEngine.toggleMusic();
        this.updateMusicUI(isPlaying);
      }
    });
  }

  updateMusicUI(isPlaying) {
    if (!this.musicIcon || !this.musicStatus) return;
    if (isPlaying) {
      this.musicIcon.textContent = '🎵';
      this.musicIcon.classList.add('pulse-music');
      this.musicStatus.textContent = 'Playing Romantic Melody ✨';
    } else {
      this.musicIcon.textContent = '🔇';
      this.musicIcon.classList.remove('pulse-music');
      this.musicStatus.textContent = 'Music Paused';
    }
  }

  setupSparkleTrail() {
    let lastTime = 0;
    const handleMove = (x, y) => {
      const now = Date.now();
      if (now - lastTime < 45) return; // Throttle
      lastTime = now;

      const sparkle = document.createElement('span');
      sparkle.className = 'cursor-sparkle';
      
      const symbols = ['✨', '💖', '🌸', '⭐', '💫'];
      sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

      const size = 12 + Math.random() * 12;
      const offsetX = (Math.random() - 0.5) * 15;
      const offsetY = (Math.random() - 0.5) * 15;

      sparkle.style.fontSize = `${size}px`;
      sparkle.style.left = `${x + offsetX}px`;
      sparkle.style.top = `${y + offsetY}px`;
      document.body.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 750);
    };

    window.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }
}

window.appMain = new AppController();

// Boot up once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.appMain.init();
});
