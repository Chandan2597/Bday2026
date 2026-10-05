/**
 * ==========================================================
 * 🎉 INTERACTIVE BIRTHDAY GAMES & REVEALS ENGINE 🎂
 * Handles:
 * 1. 10 Things I Love About You (Pop reveal cards + counter)
 * 2. Virtual Birthday Cake with blow-out candles & fireworks
 * 3. Scratch-off Date Voucher Ticket
 * 4. Star Catching Love Note Mini-Game
 * ==========================================================
 */

class BirthdayGamesEngine {
  constructor() {
    this.openedReasonsCount = 0;
    this.totalReasons = 10;
    this.isCandleBlown = false;
    this.isScratched = false;
  }

  init() {
    this.initTenThingsCards();
    this.initBirthdayCake();
    this.initScratchCard();
    this.initStarCatcher();
  }

  /* =========================================================
     1. 10 THINGS I LOVE ABOUT YOU (INTERACTIVE CARDS)
     ========================================================= */
  initTenThingsCards() {
    const grid = document.getElementById('ten-things-grid');
    const counterEl = document.getElementById('reasons-counter-badge');
    const items = (window.CONFIG && window.CONFIG.tenThings) || [];

    if (!grid) return;
    grid.innerHTML = '';
    this.totalReasons = items.length;

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'reason-card unopened';
      card.id = `reason-card-${item.id}`;

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <div class="gift-box-icon">🎁</div>
            <span class="reason-number">#${item.number}</span>
            <span class="tap-hint">Tap to Open ✨</span>
          </div>
          <div class="card-back">
            <div class="reason-icon">${item.icon}</div>
            <h4 class="reason-title">${item.title}</h4>
            <p class="reason-short">${item.shortDescription}</p>
            <p class="reason-full">${item.fullDescription}</p>
            <div class="reason-check">💖 Unlocked</div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        if (card.classList.contains('unopened')) {
          card.classList.remove('unopened');
          card.classList.add('opened');
          this.openedReasonsCount++;
          
          if (counterEl) {
            counterEl.innerHTML = `✨ Discovered <b>${this.openedReasonsCount} / ${this.totalReasons}</b> Reasons Why You're Magic`;
          }

          if (window.soundEngine) {
            window.soundEngine.playPop();
          }

          this.spawnCardConfetti(card);

          // All 10 unlocked surprise!
          if (this.openedReasonsCount === this.totalReasons) {
            setTimeout(() => this.celebrateAllReasonsUnlocked(), 700);
          }
        }
      });

      grid.appendChild(card);
    });
  }

  spawnCardConfetti(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 15; i++) {
      const conf = document.createElement('div');
      conf.className = 'mini-confetti-particle';
      const colors = ['#ff6b81', '#ffa502', '#2ed573', '#1e90ff', '#ff4757', '#eccc68'];
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 50;
      conf.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      conf.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);

      conf.style.left = `${rect.left + rect.width / 2}px`;
      conf.style.top = `${rect.top + rect.height / 2}px`;
      document.body.appendChild(conf);

      setTimeout(() => conf.remove(), 900);
    }
  }

  celebrateAllReasonsUnlocked() {
    if (window.soundEngine) {
      window.soundEngine.playGrandUnlockFanfare();
    }
    const banner = document.getElementById('all-reasons-badge');
    if (banner) {
      banner.classList.remove('hidden');
      banner.classList.add('badge-celebrate');
    }
  }

  /* =========================================================
     2. VIRTUAL BIRTHDAY CAKE & CANDLE BLOW-OUT
     ========================================================= */
  initBirthdayCake() {
    const cakeContainer = document.getElementById('birthday-cake-container');
    const blowBtn = document.getElementById('blow-candles-btn');
    const flames = document.querySelectorAll('.candle-flame');
    const wishModal = document.getElementById('wish-modal');
    const closeWishBtn = document.getElementById('close-wish-modal');

    const blowCandlesAction = () => {
      if (this.isCandleBlown) return;
      this.isCandleBlown = true;

      if (window.soundEngine) {
        window.soundEngine.playCandleBlow();
      }

      flames.forEach((flame) => {
        flame.classList.add('extinguished');
      });

      if (blowBtn) {
        blowBtn.innerHTML = '✨ Candles Extinguished! Wish Made ✨';
        blowBtn.classList.add('btn-disabled');
      }

      // Fireworks & Sound
      setTimeout(() => {
        if (window.soundEngine) {
          window.soundEngine.playFirework();
        }
        this.launchFireworksShow();
      }, 400);

      // Open Make-A-Wish Modal
      setTimeout(() => {
        if (wishModal) {
          wishModal.classList.remove('hidden');
          wishModal.classList.add('modal-visible');
        }
      }, 1400);
    };

    if (blowBtn) blowBtn.addEventListener('click', blowCandlesAction);
    if (cakeContainer) cakeContainer.addEventListener('click', blowCandlesAction);

    if (closeWishBtn && wishModal) {
      closeWishBtn.addEventListener('click', () => {
        wishModal.classList.remove('modal-visible');
        setTimeout(() => wishModal.classList.add('hidden'), 250);
      });
    }
  }

  launchFireworksShow() {
    const container = document.getElementById('fireworks-container');
    if (!container) return;

    for (let f = 0; f < 8; f++) {
      setTimeout(() => {
        const firework = document.createElement('div');
        firework.className = 'firework-burst';
        firework.style.left = `${15 + Math.random() * 70}vw`;
        firework.style.top = `${20 + Math.random() * 50}vh`;

        // Generate spark particles
        for (let s = 0; s < 30; s++) {
          const spark = document.createElement('span');
          spark.className = 'firework-spark';
          const angle = (s / 30) * Math.PI * 2;
          const dist = 60 + Math.random() * 100;
          spark.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
          spark.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
          const colors = ['#ff4d4d', '#fffa65', '#32ff7e', '#7d5fff', '#18dcff', '#ff3838'];
          spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          firework.appendChild(spark);
        }

        container.appendChild(firework);
        if (window.soundEngine && f % 2 === 0) {
          window.soundEngine.playFirework();
        }

        setTimeout(() => firework.remove(), 1600);
      }, f * 350);
    }
  }

  /* =========================================================
     3. GOLDEN SCRATCH-OFF DATE VOUCHER
     ========================================================= */
  initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    const wrapper = document.getElementById('scratch-card-wrapper');
    const voucherData = (window.CONFIG && window.CONFIG.scratchCard) || {};

    // Populate voucher text behind canvas
    const titleEl = document.getElementById('scratch-voucher-title');
    const prizeEl = document.getElementById('scratch-voucher-prize');
    const descEl = document.getElementById('scratch-voucher-desc');
    const codeEl = document.getElementById('scratch-voucher-code');

    if (titleEl) titleEl.textContent = voucherData.title || "✨ VIP Birthday Voucher ✨";
    if (prizeEl) prizeEl.textContent = voucherData.prizeText || "🎉 SPECIAL SURPRISE 🎉";
    if (descEl) descEl.textContent = voucherData.rewardDescription || "1 Day of pure pampering & love!";
    if (codeEl) codeEl.textContent = `CODE: ${voucherData.voucherCode || 'UNIVERSE-0610'}`;

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set internal resolution
    const rect = wrapper ? wrapper.getBoundingClientRect() : { width: 360, height: 220 };
    canvas.width = rect.width || 360;
    canvas.height = rect.height || 220;

    // Draw luxury golden foil cover
    const drawFoil = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#e0c068');
      gradient.addColorStop(0.3, '#fff2a8');
      gradient.addColorStop(0.5, '#d4af37');
      gradient.addColorStop(0.7, '#fff2a8');
      gradient.addColorStop(1, '#b8860b');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gold shimmer pattern & text
      ctx.fillStyle = 'rgba(74, 45, 10, 0.85)';
      ctx.font = 'bold 16px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ SCRATCH WITH LOVE ✨', canvas.width / 2, canvas.height / 2 - 10);
      
      ctx.font = '13px "Outfit", sans-serif';
      ctx.fillStyle = 'rgba(74, 45, 10, 0.7)';
      ctx.fillText('Swipe cursor or finger to reveal surprise!', canvas.width / 2, canvas.height / 2 + 18);
    };

    drawFoil();

    // Scratching logic
    let isDrawing = false;
    let scratchedPixels = 0;

    const scratch = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      if (!this.isScratched) {
        scratchedPixels++;
        if (scratchedPixels % 8 === 0 && window.soundEngine) {
          window.soundEngine.playChime(1100 + Math.random() * 300, 0.1, 0.02);
        }

        // When sufficient area is scratched, reveal completely
        if (scratchedPixels > 45) {
          this.isScratched = true;
          canvas.style.transition = 'opacity 0.6s ease';
          canvas.style.opacity = '0';
          setTimeout(() => {
            canvas.style.display = 'none';
            if (window.soundEngine) {
              window.soundEngine.playGrandUnlockFanfare();
            }
          }, 600);
        }
      }
    };

    const getPos = (e) => {
      const r = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - r.left) * (canvas.width / r.width),
        y: (clientY - r.top) * (canvas.height / r.height)
      };
    };

    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      const p = getPos(e);
      scratch(p.x, p.y);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const p = getPos(e);
      scratch(p.x, p.y);
    });

    window.addEventListener('mouseup', () => (isDrawing = false));

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
      isDrawing = true;
      const p = getPos(e);
      scratch(p.x, p.y);
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (!isDrawing) return;
      const p = getPos(e);
      scratch(p.x, p.y);
    }, { passive: true });

    canvas.addEventListener('touchend', () => (isDrawing = false));
  }

  /* =========================================================
     4. STAR CATCHER MINI-GAME (FALLING LOVE NOTES)
     ========================================================= */
  initStarCatcher() {
    const container = document.getElementById('star-catcher-arena');
    const spawnBtn = document.getElementById('spawn-stars-btn');
    const notes = (window.CONFIG && window.CONFIG.starNotes) || [
      "You are the most precious person in my world! ✨"
    ];

    const noteModal = document.getElementById('star-note-modal');
    const noteTextEl = document.getElementById('star-note-text');
    const closeNoteBtn = document.getElementById('close-star-note');

    if (closeNoteBtn && noteModal) {
      closeNoteBtn.addEventListener('click', () => {
        noteModal.classList.remove('modal-visible');
        setTimeout(() => noteModal.classList.add('hidden'), 250);
      });
    }

    const spawnStar = () => {
      if (!container) return;
      const star = document.createElement('div');
      star.className = 'drifting-game-star';
      
      const starSymbols = ['⭐', '🌟', '✨', '💫', '💖'];
      star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
      
      const startLeft = 5 + Math.random() * 85;
      const duration = 6 + Math.random() * 5;
      star.style.left = `${startLeft}%`;
      star.style.animationDuration = `${duration}s`;

      const note = notes[Math.floor(Math.random() * notes.length)];

      star.addEventListener('click', (e) => {
        e.stopPropagation();
        star.classList.add('star-caught');

        if (window.soundEngine) {
          window.soundEngine.playChime(1046.5, 1.2, 0.1);
        }

        if (noteTextEl) noteTextEl.textContent = note;
        if (noteModal) {
          noteModal.classList.remove('hidden');
          noteModal.classList.add('modal-visible');
        }

        setTimeout(() => star.remove(), 400);
      });

      container.appendChild(star);

      // Clean up if not clicked
      setTimeout(() => {
        if (star.parentNode) star.remove();
      }, duration * 1000);
    };

    if (spawnBtn) {
      spawnBtn.addEventListener('click', () => {
        for (let i = 0; i < 5; i++) {
          setTimeout(spawnStar, i * 300);
        }
      });
    }

    // Periodically drop a star in the interactive zone
    setInterval(() => {
      if (document.getElementById('section-games')) {
        spawnStar();
      }
    }, 4500);
  }
}

window.birthdayGamesEngine = new BirthdayGamesEngine();
