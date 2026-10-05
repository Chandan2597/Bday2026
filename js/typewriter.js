/**
 * ==========================================================
 * 💌 LOVE LETTER TYPEWRITER ENGINE ✍️
 * Renders the heartfelt love letter with realistic typing cadence,
 * scroll trigger observer, replay controls, and wax seal stamp.
 * ==========================================================
 */

class TypewriterEngine {
  constructor() {
    this.letterContainer = document.getElementById('letter-content');
    this.sectionEl = document.getElementById('section-letter');
    this.sealBtn = document.getElementById('wax-seal-stamp');
    this.replayBtn = document.getElementById('letter-replay-btn');
    this.fastForwardBtn = document.getElementById('letter-ff-btn');
    this.pauseBtn = document.getElementById('letter-pause-btn');

    this.paragraphs = (window.CONFIG && window.CONFIG.letter && window.CONFIG.letter.paragraphs) || [];
    this.recipient = (window.CONFIG && window.CONFIG.letter && window.CONFIG.letter.recipient) || "My Dearest Miss Universe,";
    this.signature = (window.CONFIG && window.CONFIG.letter && window.CONFIG.letter.signature) || "Forever & Always Yours,";
    this.authorName = (window.CONFIG && window.CONFIG.letter && window.CONFIG.letter.authorName) || "Your Biggest Admirer 💖";

    this.isTyping = false;
    this.isPaused = false;
    this.hasTriggered = false;
    this.typingTimeout = null;
    this.currentParaIndex = 0;
    this.currentCharIndex = 0;
  }

  init() {
    if (!this.letterContainer || !this.sectionEl) return;

    this.attachControls();
    this.setupScrollObserver();
  }

  setupScrollObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasTriggered) {
            this.hasTriggered = true;
            this.startTyping();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(this.sectionEl);
  }

  attachControls() {
    if (this.replayBtn) {
      this.replayBtn.addEventListener('click', () => {
        this.resetAndRestart();
      });
    }

    if (this.fastForwardBtn) {
      this.fastForwardBtn.addEventListener('click', () => {
        this.fastForward();
      });
    }

    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => {
        this.togglePause();
      });
    }

    if (this.sealBtn) {
      this.sealBtn.addEventListener('click', () => {
        this.stampWaxSeal();
      });
    }
  }

  startTyping() {
    if (!this.letterContainer) return;
    this.isTyping = true;
    this.isPaused = false;
    this.letterContainer.innerHTML = '';

    // Create Recipient line
    const recipEl = document.createElement('h3');
    recipEl.className = 'letter-recipient';
    recipEl.textContent = this.recipient;
    this.letterContainer.appendChild(recipEl);

    // Create container for paragraphs
    this.paraElements = [];
    this.paragraphs.forEach(() => {
      const p = document.createElement('p');
      p.className = 'letter-paragraph';
      this.letterContainer.appendChild(p);
      this.paraElements.push(p);
    });

    // Create signature container (hidden initially)
    this.sigContainer = document.createElement('div');
    this.sigContainer.className = 'letter-signature-block hidden';
    this.sigContainer.innerHTML = `
      <p class="sig-line">${this.signature}</p>
      <p class="sig-author">${this.authorName}</p>
    `;
    this.letterContainer.appendChild(this.sigContainer);

    this.currentParaIndex = 0;
    this.currentCharIndex = 0;
    this.typeNextChar();
  }

  typeNextChar() {
    if (!this.isTyping || this.isPaused) return;

    if (this.currentParaIndex >= this.paragraphs.length) {
      this.onFinishTyping();
      return;
    }

    const currentText = this.paragraphs[this.currentParaIndex];
    const currentElem = this.paraElements[this.currentParaIndex];

    if (this.currentCharIndex < currentText.length) {
      const char = currentText[this.currentCharIndex];
      currentElem.textContent += char;
      this.currentCharIndex++;

      // Natural typing delay with variation
      let delay = 18 + Math.random() * 22;
      if (char === '.' || char === '!' || char === '?') {
        delay = 320; // Pause after sentence
      } else if (char === ',' || char === ';') {
        delay = 140; // Pause after comma
      }

      this.typingTimeout = setTimeout(() => {
        this.typeNextChar();
      }, delay);
    } else {
      // Paragraph finished, move to next
      this.currentParaIndex++;
      this.currentCharIndex = 0;
      this.typingTimeout = setTimeout(() => {
        this.typeNextChar();
      }, 400);
    }
  }

  togglePause() {
    if (!this.isTyping) return;
    this.isPaused = !this.isPaused;
    if (this.pauseBtn) {
      this.pauseBtn.innerHTML = this.isPaused ? '▶️ Resume' : '⏸️ Pause';
    }
    if (!this.isPaused) {
      this.typeNextChar();
    }
  }

  fastForward() {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    this.isTyping = false;
    this.isPaused = false;

    if (!this.paraElements || this.paraElements.length === 0) {
      this.startTyping();
    }

    this.paragraphs.forEach((text, idx) => {
      if (this.paraElements[idx]) {
        this.paraElements[idx].textContent = text;
      }
    });

    this.onFinishTyping();
  }

  resetAndRestart() {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    this.isTyping = false;
    this.isPaused = false;
    if (this.pauseBtn) this.pauseBtn.innerHTML = '⏸️ Pause';
    this.startTyping();
  }

  onFinishTyping() {
    this.isTyping = false;
    if (this.sigContainer) {
      this.sigContainer.classList.remove('hidden');
      this.sigContainer.classList.add('sig-appear');
    }
    if (this.sealBtn) {
      this.sealBtn.classList.remove('hidden');
      this.sealBtn.classList.add('pulse-glow');
    }
    if (window.soundEngine) {
      window.soundEngine.playChime(783.99, 1.5, 0.08);
    }
  }

  stampWaxSeal() {
    if (!this.sealBtn || this.sealBtn.classList.contains('stamped')) return;

    this.sealBtn.classList.add('stamped');
    this.sealBtn.innerHTML = `
      <div class="wax-stamp-inner">
        <span class="wax-monogram">💖</span>
        <span class="wax-text">Sealed With Warmth</span>
      </div>
    `;

    if (window.soundEngine) {
      window.soundEngine.playPop();
      window.soundEngine.playChime(1046.5, 2.0, 0.12);
    }

    // Spawn heart sparkles
    this.createStampSparkles(this.sealBtn);
  }

  createStampSparkles(btn) {
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
      const spark = document.createElement('span');
      spark.className = 'seal-sparkle-particle';
      spark.textContent = ['✨', '💖', '🌸', '⭐'][Math.floor(Math.random() * 4)];

      const angle = (i / 20) * Math.PI * 2;
      const distance = 40 + Math.random() * 60;
      spark.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
      spark.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);

      spark.style.left = `${rect.left + rect.width / 2}px`;
      spark.style.top = `${rect.top + rect.height / 2}px`;
      document.body.appendChild(spark);

      setTimeout(() => spark.remove(), 1200);
    }
  }
}

window.typewriterEngine = new TypewriterEngine();
