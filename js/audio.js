/**
 * ==========================================================
 * ✨ ROMANTIC AUDIO & SOUND ENGINE ✨
 * Built with Web Audio API for zero-latency, beautiful,
 * relaxing lofi-chords & romantic sound effects.
 * ==========================================================
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.melodyInterval = null;
    this.step = 0;
    this.volume = 0.35;
    this.customAudio = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMusic() {
    this.init();
    if (this.isPlaying) {
      this.stopMelody();
      return false;
    } else {
      this.startMelody();
      return true;
    }
  }

  startMelody() {
    if (this.isPlaying) return;
    this.init();
    this.isPlaying = true;

    // Romantic chord progression in E-flat / C-minor (dreamy romantic lofi)
    // Chords: Ebmaj7 -> Cm9 -> Abmaj7 -> Bb9sus4
    const chordProgression = [
      [311.13, 392.00, 466.16, 587.33], // Ebmaj7 (Eb4, G4, Bb4, D5)
      [261.63, 311.13, 392.00, 466.16, 587.33], // Cm9 (C4, Eb4, G4, Bb4, D5)
      [207.65, 261.63, 311.13, 392.00, 466.16], // Abmaj7 (Ab3, C4, Eb4, G4, Bb4)
      [233.08, 293.66, 349.23, 466.16, 523.25]  // Bb9sus (Bb3, D4, F4, Bb4, C5)
    ];

    const arpeggioNotes = [
      587.33, 523.25, 466.16, 392.00, 466.16, 523.25, 587.33, 698.46
    ];

    let chordIndex = 0;
    let arpIndex = 0;

    const playChord = () => {
      if (!this.isPlaying || this.isMuted) return;
      const notes = chordProgression[chordIndex % chordProgression.length];
      notes.forEach((freq, idx) => {
        this.playWarmPad(freq, 3.8, idx * 0.08, 0.08);
      });
      chordIndex++;
    };

    const playArp = () => {
      if (!this.isPlaying || this.isMuted) return;
      const note = arpeggioNotes[arpIndex % arpeggioNotes.length];
      if (Math.random() > 0.2) {
        this.playChime(note * (Math.random() > 0.5 ? 1 : 1.5), 1.6, 0.04);
      }
      arpIndex++;
    };

    // Play initial chord
    playChord();
    
    // Play chord every 3.5s
    this.melodyInterval = setInterval(() => {
      playChord();
    }, 3600);

    // Arpeggio sparkle every 900ms
    this.arpInterval = setInterval(() => {
      playArp();
    }, 900);
  }

  stopMelody() {
    this.isPlaying = false;
    if (this.melodyInterval) clearInterval(this.melodyInterval);
    if (this.arpInterval) clearInterval(this.arpInterval);
  }

  // Soft electric piano pad sound
  playWarmPad(freq, duration = 3, delay = 0, gainLevel = 0.1) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime + delay;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Sub-harmonic richness
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + duration * 0.4);
    filter.frequency.exponentialRampToValueAtTime(400, now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainLevel * this.volume, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration + 0.1);
    subOsc.stop(now + duration + 0.1);
  }

  // Bell / Chime sound
  playChime(freq = 880, duration = 1.5, gainLevel = 0.08) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(gainLevel * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // PIN Click sound
  playPinClick() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

    gain.gain.setValueAtTime(0.12 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Wrong PIN shake sound
  playPinError() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(140, now + 0.1);

    gain.gain.setValueAtTime(0.15 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Grand Flower Bloom Magical Glissando / Harp Fanfare
  playGrandUnlockFanfare() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51]; // C major celestial run
    notes.forEach((freq, idx) => {
      const delay = idx * 0.12;
      this.playChime(freq, 2.5, 0.15);
      this.playWarmPad(freq / 2, 3.0, delay, 0.08);
    });
  }

  // Card / Gift Pop sound
  playPop() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

    gain.gain.setValueAtTime(0.2 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Candle Extinguish Puff Sound
  playCandleBlow() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // Firework Celebration Boom & Crackle
  playFirework() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);

    gain.gain.setValueAtTime(0.4 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);

    // Crackle sparkles
    setTimeout(() => {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => this.playChime(1200 + Math.random() * 600, 0.4, 0.05), i * 70);
      }
    }, 150);
  }
}

window.soundEngine = new SoundEngine();
