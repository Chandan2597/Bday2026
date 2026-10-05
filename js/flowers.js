/**
 * ==========================================================
 * 🌺 HIGH-PERFORMANCE FLOWER BLOOM & CURTAIN ENGINE 🌸
 * Features:
 * 1. Offscreen Sprite Caching for 0ms rasterization overhead.
 * 2. 4-Directional Inflow: 100+ vibrant flowers converge to blanket the screen.
 * 3. Full-Screen Floral Blanket: Screen is completely filled with blooming flowers.
 * 4. Center-Outward Parting: Flowers part like an enchanted iris starting from the
 *    center outward to the corners to reveal the main celebration website.
 * 5. Ambient Falling Petals Canvas: Constant 60/120 FPS drifting physics.
 * ==========================================================
 */

class FlowerEngine {
  constructor() {
    this.ambientCanvas = null;
    this.ambientCtx = null;
    this.ambientPetals = [];
    this.ambientAnimId = null;

    this.bloomCanvas = null;
    this.bloomCtx = null;
    this.bloomAnimId = null;
    this.sprites = {};

    // Realistic Flower Image URLs with Emoji Fallbacks
    this.flowerTypes = [
      { id: 'rose_pink', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Pink_rose_transparent_background.png/320px-Pink_rose_transparent_background.png', emoji: '🌸', size: 60 },
      { id: 'rose_red', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Red_Rose_Transparent.png/320px-Red_Rose_Transparent.png', emoji: '🌹', size: 65 },
      { id: 'flower_yellow', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flower_PNG_Transparent_Image.png/320px-Flower_PNG_Transparent_Image.png', emoji: '🌻', size: 55 },
      { id: 'flower_white', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/White_flower_transparent_background.png/320px-White_flower_transparent_background.png', emoji: '🌼', size: 50 },
      { id: 'flower_purple', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Purple_flower_transparent_background.png/320px-Purple_flower_transparent_background.png', emoji: '🌺', size: 55 }
    ];

    // Pre-cache all sprite textures onto offscreen canvases
    this.initSprites();
  }

  async initSprites() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    const loadPromises = this.flowerTypes.map((ft) => {
      return new Promise((resolve) => {
        const off = document.createElement('canvas');
        const pixelSize = Math.round(ft.size * dpr);
        const pad = Math.round(16 * dpr);
        off.width = pixelSize + pad * 2;
        off.height = pixelSize + pad * 2;
        const oCtx = off.getContext('2d');
        
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          if (oCtx) oCtx.drawImage(img, pad, pad, pixelSize, pixelSize);
          this.sprites[ft.id] = { canvas: off, width: ft.size + 32, height: ft.size + 32, baseSize: ft.size };
          resolve();
        };
        img.onerror = () => {
          // Fallback to emoji if image fails to load
          if (oCtx) {
            oCtx.textAlign = 'center';
            oCtx.textBaseline = 'middle';
            oCtx.font = `${pixelSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
            oCtx.fillText(ft.emoji, off.width / 2, off.height / 2);
          }
          this.sprites[ft.id] = { canvas: off, width: ft.size + 32, height: ft.size + 32, baseSize: ft.size };
          resolve();
        };
        img.src = ft.url;
      });
    });

    await Promise.all(loadPromises);
  }

  /* ---------------------------------------------------------
     1. CONTINUOUS AMBIENT PETALS DRIFTING CANVAS
     --------------------------------------------------------- */
  initAmbientCanvas(canvasId = 'ambient-canvas') {
    this.ambientCanvas = document.getElementById(canvasId);
    if (!this.ambientCanvas) return;
    this.ambientCtx = this.ambientCanvas.getContext('2d');
    this.resizeAmbient();
    window.addEventListener('resize', () => this.resizeAmbient(), { passive: true });

    this.createAmbientPetals(32);
    this.startAmbientLoop();
  }

  resizeAmbient() {
    if (!this.ambientCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.ambientCanvas.width = window.innerWidth * dpr;
    this.ambientCanvas.height = window.innerHeight * dpr;
    this.ambientCanvas.style.width = `${window.innerWidth}px`;
    this.ambientCanvas.style.height = `${window.innerHeight}px`;
    if (this.ambientCtx) {
      this.ambientCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  createAmbientPetals(count = 32) {
    this.ambientPetals = [];
    for (let i = 0; i < count; i++) {
      this.ambientPetals.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 8 + Math.random() * 10,
        speedX: -0.3 + Math.random() * 0.7,
        speedY: 0.6 + Math.random() * 1.0,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.2,
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: 0.015 + Math.random() * 0.02,
        opacity: 0.3 + Math.random() * 0.4,
        color: Math.random() > 0.4 ? 'rgba(255, 182, 193, ' : 'rgba(255, 105, 180, '
      });
    }
  }

  startAmbientLoop() {
    if (this.ambientAnimId) cancelAnimationFrame(this.ambientAnimId);
    let lastTime = performance.now();

    const loop = (currentTime) => {
      if (!this.ambientCtx || !this.ambientCanvas) return;
      const delta = Math.min((currentTime - lastTime) / 16.67, 2.0);
      lastTime = currentTime;

      const w = window.innerWidth;
      const h = window.innerHeight;
      this.ambientCtx.clearRect(0, 0, w, h);

      for (let i = 0; i < this.ambientPetals.length; i++) {
        const p = this.ambientPetals[i];
        p.swayAngle += p.swaySpeed * delta;
        p.x += (p.speedX + Math.sin(p.swayAngle) * 0.5) * delta;
        p.y += p.speedY * delta;
        p.rotation += p.rotationSpeed * delta;

        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }
        if (p.x > w + 20) p.x = -20;
        if (p.x < -20) p.x = w + 20;

        this.ambientCtx.save();
        this.ambientCtx.translate(p.x, p.y);
        this.ambientCtx.rotate((p.rotation * Math.PI) / 180);
        this.ambientCtx.fillStyle = p.color + p.opacity + ')';
        this.ambientCtx.beginPath();
        this.ambientCtx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        this.ambientCtx.fill();
        this.ambientCtx.restore();
      }

      this.ambientAnimId = requestAnimationFrame(loop);
    };
    this.ambientAnimId = requestAnimationFrame(loop);
  }

  /* ---------------------------------------------------------
     2. 4-DIRECTION FULL SCREEN FLOWER CURTAIN & CENTER PARTING
     --------------------------------------------------------- */
  triggerFourSidedBloom(onCompleteCallback) {
    const overlay = document.getElementById('flower-bloom-overlay');
    if (!overlay) {
      if (onCompleteCallback) onCompleteCallback();
      return;
    }

    overlay.classList.remove('hidden', 'fade-out');
    overlay.innerHTML = '';

    // Create high-performance bloom canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'bloom-canvas';
    overlay.appendChild(canvas);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Create center welcome card DOM overlay
    const centerCard = document.createElement('div');
    centerCard.className = 'bloom-center-text';
    centerCard.innerHTML = `
      <div class="glow-heart">💖</div>
      <h2>Welcome, Miss Universe ✨</h2>
      <p>Today is all about you...</p>
    `;
    overlay.appendChild(centerCard);

    // Sound fanfare
    if (window.soundEngine) {
      window.soundEngine.playGrandUnlockFanfare();
    }

    // Generate Full-Screen Flower Blanket (Stratified distribution for full coverage)
    const flowers = [];
    const centerX = W / 2;
    const centerY = H / 2;
    const maxRadius = Math.hypot(centerX, centerY);

    // 1. Grid of flowers covering the entire viewport
    const cols = Math.max(7, Math.round(W / 120));
    const rows = Math.max(5, Math.round(H / 120));
    const cellW = W / cols;
    const cellH = H / rows;

    const directions = ['from-top', 'from-bottom', 'from-left', 'from-right'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Stratified randomized target position in this cell
        const targetX = (c + 0.5 + (Math.random() - 0.5) * 0.7) * cellW;
        const targetY = (r + 0.5 + (Math.random() - 0.5) * 0.7) * cellH;
        const dir = directions[(r * cols + c) % directions.length];
        flowers.push(this.createBloomFlower(targetX, targetY, dir, W, H, centerX, centerY, maxRadius));
      }
    }

    // 2. Extra dense flowers near and around the center for lushness
    const extraCenterCount = 30;
    for (let i = 0; i < extraCenterCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const rad = 30 + Math.random() * (Math.min(W, H) * 0.38);
      const targetX = centerX + Math.cos(angle) * rad;
      const targetY = centerY + Math.sin(angle) * rad;
      const dir = directions[i % directions.length];
      flowers.push(this.createBloomFlower(targetX, targetY, dir, W, H, centerX, centerY, maxRadius, true));
    }

    // Timing parameters (in seconds)
    const exitHoldTime = 2.1;   // Center flowers start opening outward at t = 2.1s
    const totalDuration = 3.2;  // Complete handover at t = 3.2s

    // Reveal center welcome card when screen is blanketed
    setTimeout(() => {
      centerCard.classList.add('show');
    }, 700);

    // Dismiss center welcome card right as center flowers start parting
    setTimeout(() => {
      centerCard.classList.add('hide-out');
    }, 2050);

    // Animation Loop
    let startTimestamp = null;

    const renderLoop = (now) => {
      if (!startTimestamp) startTimestamp = now;
      const elapsed = (now - startTimestamp) / 1000;

      ctx.clearRect(0, 0, W, H);

      // Render all flowers
      for (let i = 0; i < flowers.length; i++) {
        const f = flowers[i];
        let x, y, rot, scale, opacity;

        if (elapsed < f.inDelay) {
          // Hasn't started flying in yet
          continue;
        } else if (elapsed < f.inDelay + f.inDuration) {
          // Phase 1: Inflow rushing from 4 sides towards coverage point
          const t = (elapsed - f.inDelay) / f.inDuration;
          const ease = 1 - Math.pow(1 - t, 3); // Cubic ease out
          x = f.startX + (f.targetX - f.startX) * ease;
          y = f.startY + (f.targetY - f.startY) * ease;
          scale = f.startScale + (f.midScale - f.startScale) * ease;
          rot = f.startRot + (f.midRot - f.startRot) * ease;
          opacity = Math.min(1, ease * 2.5);
        } else if (elapsed < exitHoldTime + f.exitDelay) {
          // Phase 2: Full Screen Bloom Blanket & Gentle Floating Sway
          const swayTime = elapsed - (f.inDelay + f.inDuration);
          const sway = Math.sin(swayTime * f.swaySpeed + f.swayOffset) * f.swayAmp;
          x = f.targetX + sway;
          y = f.targetY + Math.cos(swayTime * f.swaySpeed + f.swayOffset) * (f.swayAmp * 0.6);
          scale = f.midScale * (1 + 0.04 * Math.sin(swayTime * 3 + f.swayOffset));
          rot = f.midRot + sway * 0.015;
          opacity = 1;
        } else {
          // Phase 3: Center-Outward Parting Wave (Starts from center, ripples outward)
          const exitElapsed = elapsed - (exitHoldTime + f.exitDelay);
          const t = Math.min(1, exitElapsed / f.exitDuration);
          if (t >= 1) {
            continue; // Flower has fully cleared the screen
          }
          const ease = t * t * (2.2 - 1.2 * t); // Smooth outward burst acceleration
          x = f.targetX + (f.exitX - f.targetX) * ease;
          y = f.targetY + (f.exitY - f.targetY) * ease;
          scale = f.midScale + (f.exitScale - f.midScale) * ease;
          rot = f.midRot + (f.exitRot - f.midRot) * ease;
          opacity = Math.max(0, 1 - Math.pow(t, 1.6));
        }

        if (opacity > 0.01) {
          const sprite = this.sprites[f.id];
          if (sprite) {
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.translate(x, y);
            ctx.rotate(rot);
            ctx.scale(scale, scale);
            ctx.drawImage(
              sprite.canvas,
              -sprite.width / 2,
              -sprite.height / 2,
              sprite.width,
              sprite.height
            );
            ctx.restore();
          }
        }
      }

      if (elapsed < totalDuration) {
        this.bloomAnimId = requestAnimationFrame(renderLoop);
      } else {
        // Complete transition smoothly
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.classList.add('hidden');
          overlay.innerHTML = '';
          if (onCompleteCallback) onCompleteCallback();
        }, 350);
      }
    };

    this.bloomAnimId = requestAnimationFrame(renderLoop);
  }

  createBloomFlower(targetX, targetY, dir, W, H, centerX, centerY, maxRadius, isCenterExtra = false) {
    const fData = this.flowerTypes[Math.floor(Math.random() * this.flowerTypes.length)];

    // Starting positions placed offscreen along 4 edges
    let startX, startY;
    const margin = 80 + Math.random() * 120;
    if (dir === 'from-top') {
      startX = Math.random() * W;
      startY = -margin;
    } else if (dir === 'from-bottom') {
      startX = Math.random() * W;
      startY = H + margin;
    } else if (dir === 'from-left') {
      startX = -margin;
      startY = Math.random() * H;
    } else {
      startX = W + margin;
      startY = Math.random() * H;
    }

    // Distance and radial angle from center
    const dx = targetX - centerX;
    const dy = targetY - centerY;
    const distFromCenter = Math.hypot(dx, dy);
    const angleFromCenter = Math.atan2(dy, dx);
    const normDist = Math.min(1, distFromCenter / maxRadius);

    // Outward exit trajectory starting from center outward
    const exitDist = distFromCenter + Math.max(W, H) * 0.8 + Math.random() * 200;
    const exitX = centerX + Math.cos(angleFromCenter) * exitDist;
    const exitY = centerY + Math.sin(angleFromCenter) * exitDist;

    // Center-outward stagger: Flowers nearest to center start moving first!
    const exitDelay = normDist * 0.45; // 0s at dead center, up to 0.45s at edges

    return {
      id: fData.id,
      startX,
      startY,
      targetX,
      targetY,
      exitX,
      exitY,
      startRot: Math.random() * Math.PI * 2,
      midRot: Math.random() * Math.PI * 2,
      exitRot: (Math.random() - 0.5) * Math.PI * 4,
      startScale: 0.15,
      midScale: isCenterExtra ? 1.0 + Math.random() * 0.5 : 0.85 + Math.random() * 0.5,
      exitScale: 1.4 + Math.random() * 0.6,
      inDelay: Math.random() * 0.22,
      inDuration: 0.85 + Math.random() * 0.2,
      exitDelay,
      exitDuration: 0.75 + Math.random() * 0.2,
      swaySpeed: 1.8 + Math.random() * 1.6,
      swayAmp: 6 + Math.random() * 8,
      swayOffset: Math.random() * Math.PI * 2
    };
  }
}

window.flowerEngine = new FlowerEngine();
