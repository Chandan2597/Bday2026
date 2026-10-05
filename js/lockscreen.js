/**
 * ==========================================================
 * 🔒 MISS UNIVERSE LOCK SCREEN LOGIC 💖
 * Validates PIN (0610), handles on-screen keypad and physical
 * keyboard, triggers the 4-direction flower bloom transition.
 * ==========================================================
 */

class LockScreen {
  constructor() {
    this.enteredPin = '';
    this.correctPinHash = (window.CONFIG && window.CONFIG.pinHash) || '2088259052';
    this.isUnlocked = false;

    this.lockScreenEl = document.getElementById('lock-screen');
    this.pinDotsEl = document.getElementById('pin-dots');
    this.pinInputs = document.querySelectorAll('.pin-digit-input');
    this.keypadBtns = document.querySelectorAll('.keypad-btn');
    this.errorMsgEl = document.getElementById('lock-error-msg');
    this.mainContentEl = document.getElementById('main-content');
  }

  init() {
    if (!this.lockScreenEl) return;

    // Attach keypad buttons
    this.keypadBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        if (val === 'clear') {
          this.clearPin();
        } else if (val === 'backspace') {
          this.backspace();
        } else if (val) {
          this.appendDigit(val);
        }
      });
    });

    // Support physical keyboard typing
    window.addEventListener('keydown', (e) => {
      if (this.isUnlocked) return;
      if (e.key >= '0' && e.key <= '9') {
        this.appendDigit(e.key);
      } else if (e.key === 'Backspace') {
        this.backspace();
      } else if (e.key === 'Escape') {
        this.clearPin();
      }
    });

    // Auto-focus first input on desktop if visible
    if (this.pinInputs && this.pinInputs.length > 0) {
      this.pinInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
          const val = e.target.value;
          if (val.length >= 1) {
            this.enteredPin = Array.from(this.pinInputs).map(i => i.value).join('');
            this.updateDots();
            if (index < this.pinInputs.length - 1) {
              this.pinInputs[index + 1].focus();
            } else {
              this.checkPin();
            }
          }
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !input.value && index > 0) {
            this.pinInputs[index - 1].focus();
          }
        });
      });
    }
  }

  appendDigit(digit) {
    if (this.enteredPin.length >= 4 || this.isUnlocked) return;
    this.enteredPin += digit;
    
    if (window.soundEngine) {
      window.soundEngine.playPinClick();
    }

    this.updateDots();

    // Trigger subtle bounce animation on active dot
    const activeDot = document.querySelector(`.pin-dot:nth-child(${this.enteredPin.length})`);
    if (activeDot) {
      activeDot.classList.add('pulse');
      setTimeout(() => activeDot.classList.remove('pulse'), 200);
    }

    if (this.enteredPin.length === 4) {
      setTimeout(() => this.checkPin(), 120);
    }
  }

  backspace() {
    if (this.enteredPin.length > 0) {
      this.enteredPin = this.enteredPin.slice(0, -1);
      this.updateDots();
      if (this.errorMsgEl) this.errorMsgEl.textContent = '';
    }
  }

  clearPin() {
    this.enteredPin = '';
    this.updateDots();
    if (this.pinInputs) {
      this.pinInputs.forEach(i => (i.value = ''));
      if (this.pinInputs[0]) this.pinInputs[0].focus();
    }
    if (this.errorMsgEl) this.errorMsgEl.textContent = '';
  }

  updateDots() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, idx) => {
      if (idx < this.enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }

  simpleHash(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    return hash.toString();
  }

  checkPin() {
    try {
      if (this.simpleHash(this.enteredPin) === this.correctPinHash) {
        this.decryptPhotos(this.enteredPin);
        this.onSuccess();
      } else {
        this.onError();
      }
    } catch (e) {
      console.error(e);
      alert("Error checking PIN: " + e.message);
      this.onError();
    }
  }

  decryptPhotos(pin) {
    if (!window.ENCODED_PHOTOS) return;
    const decodeXOR = (base64Str, key) => {
      const xored = atob(base64Str);
      const len = xored.length;
      const keyLen = key.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = xored.charCodeAt(i) ^ key.charCodeAt(i % keyLen);
      }
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(bytes);
    };
    
    const ribbons = ['photoRibbon1', 'photoRibbon2', 'photoRibbon3'];
    for (const r of ribbons) {
      if (window.CONFIG[r]) {
        for (const item of window.CONFIG[r]) {
          if (window.ENCODED_PHOTOS[item.image]) {
            item.image = decodeXOR(window.ENCODED_PHOTOS[item.image], pin);
          }
        }
      }
    }
  }

  onSuccess() {
    this.isUnlocked = true;
    const card = document.querySelector('.lock-card');
    if (card) {
      card.classList.add('unlocked-glow');
    }

    // Success sound
    if (window.soundEngine) {
      window.soundEngine.playGrandUnlockFanfare();
      if (window.CONFIG && window.CONFIG.music.autoplayOnUnlock) {
        setTimeout(() => window.soundEngine.startMelody(), 1500);
      }
    }

    // Hide lock screen and trigger 4-sided flower bloom transition!
    setTimeout(() => {
      this.lockScreenEl.classList.add('fade-away');
      
      if (window.flowerEngine) {
        window.flowerEngine.triggerFourSidedBloom(() => {
          this.lockScreenEl.style.display = 'none';
          if (this.mainContentEl) {
            this.mainContentEl.classList.remove('hidden');
            this.mainContentEl.classList.add('visible-reveal');
          }
          // Initialize scroll reveal triggers & typewriter observer
          if (window.appMain) {
            window.appMain.onSiteUnlocked();
          }
        });
      }
    }, 400);
  }

  onError() {
    if (window.soundEngine) {
      window.soundEngine.playPinError();
    }

    const card = document.querySelector('.lock-card');
    if (card) {
      card.classList.add('shake-error');
      setTimeout(() => card.classList.remove('shake-error'), 600);
    }

    if (this.errorMsgEl) {
      this.errorMsgEl.innerHTML = `<span>Oops! Think of your special birthdate 🎂 (DDMM)</span>`;
      this.errorMsgEl.classList.add('show');
    }

    // Clear after brief delay
    setTimeout(() => {
      this.clearPin();
    }, 700);
  }
}

window.lockScreen = new LockScreen();
