/**
 * ==========================================================
 * 📷 DUAL CLIPBOARD PHOTO RIBBONS ENGINE 🎞️
 * Renders two moving ribbons (Childhood -> Young -> Adult)
 * traveling continuously in the left direction with interactive
 * 3D hover effects, heart reactions, and lightbox modals.
 * ==========================================================
 */

class PhotoRibbonEngine {
  constructor() {
    this.topTrack = document.getElementById('ribbon-track-top');
    this.bottomTrack = document.getElementById('ribbon-track-bottom');
    this.thirdTrack = document.getElementById('ribbon-track-third');
    this.modal = document.getElementById('photo-modal');
    this.modalImg = document.getElementById('modal-photo-img');
    this.modalTitle = document.getElementById('modal-photo-title');
    this.modalAge = document.getElementById('modal-photo-age');
    this.modalCaption = document.getElementById('modal-photo-caption');
    this.modalTag = document.getElementById('modal-photo-tag');
    this.modalHeartBtn = document.getElementById('modal-heart-btn');
    this.modalHeartCount = document.getElementById('modal-heart-count');
    this.closeModalBtn = document.getElementById('modal-close-btn');

    this.likes = {};
  }

  init() {
    if (!this.topTrack || !this.bottomTrack) return;

    this.renderRibbons();
    this.attachModalListeners();
  }

  renderRibbons() {
    const childhood = (window.CONFIG && window.CONFIG.photoRibbon1) || [];
    const adult = (window.CONFIG && window.CONFIG.photoRibbon2) || [];
    const third = (window.CONFIG && window.CONFIG.photoRibbon3) || [];

    // Duplicate arrays 3 times to ensure a completely seamless infinite loop
    const topPhotos = [...childhood, ...childhood, ...childhood];
    const bottomPhotos = [...adult, ...adult, ...adult];
    const thirdPhotos = [...third, ...third, ...third];

    this.topTrack.innerHTML = '';
    this.bottomTrack.innerHTML = '';
    if (this.thirdTrack) this.thirdTrack.innerHTML = '';

    topPhotos.forEach((photo, idx) => {
      const card = this.createPolaroidCard(photo, idx, 'top');
      this.topTrack.appendChild(card);
    });

    bottomPhotos.forEach((photo, idx) => {
      const card = this.createPolaroidCard(photo, idx, 'bottom');
      this.bottomTrack.appendChild(card);
    });

    thirdPhotos.forEach((photo, idx) => {
      const card = this.createPolaroidCard(photo, idx, 'third');
      if (this.thirdTrack) this.thirdTrack.appendChild(card);
    });
  }

  createPolaroidCard(photo, idx, ribbonType) {
    const card = document.createElement('div');
    card.className = 'polaroid-card';

    // Slight organic rotation for realistic clipboard aesthetic
    const rotations = [-2.5, 1.8, -1.2, 2.8, -3.1, 1.5, -2.0, 2.2];
    const rot = rotations[idx % rotations.length];
    card.style.setProperty('--card-rot', `${rot}deg`);

    // Decorative washi tape colors
    const tapeColors = ['tape-pink', 'tape-gold', 'tape-lavender', 'tape-mint'];
    const tapeClass = tapeColors[idx % tapeColors.length];

    card.innerHTML = `
      <div class="washi-tape ${tapeClass}"></div>
      <div class="polaroid-clip">📎</div>
      <div class="polaroid-image-wrapper">
        <img src="${photo.image}" alt="Memory" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80'" />
        <div class="polaroid-tag-badge">${photo.tag || '✨ Memory'}</div>
      </div>
      <div class="polaroid-details">

        <div class="polaroid-footer">
          <span class="view-btn">View</span>
          <span class="heart-indicator">💖</span>
        </div>
      </div>
    `;

    // Click to view modal
    card.addEventListener('click', () => {
      this.openModal(photo);
    });

    return card;
  }

  attachModalListeners() {
    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }

    if (this.modalHeartBtn) {
      this.modalHeartBtn.addEventListener('click', () => {
        const photoKey = photo.image || 'default';
        this.likes[photoKey] = (this.likes[photoKey] || 0) + 1;
        this.modalHeartCount.textContent = this.likes[photoKey];
        this.modalHeartBtn.classList.add('heart-pop');
        setTimeout(() => this.modalHeartBtn.classList.remove('heart-pop'), 300);

        if (window.soundEngine) {
          window.soundEngine.playPop();
        }

        // Mini heart explosion
        this.createFloatingHeartOnBtn(this.modalHeartBtn);
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && !this.modal.classList.contains('hidden')) {
        this.closeModal();
      }
    });
  }

  openModal(photo) {
    if (!this.modal) return;
    this.currentPhotoKey = photo.image;

    if (this.modalImg) this.modalImg.src = photo.image;
    if (this.modalTag) this.modalTag.textContent = photo.tag || '✨ Precious Memory';

    const currentLikes = this.likes[this.currentPhotoKey] || 1;
    if (this.modalHeartCount) this.modalHeartCount.textContent = currentLikes;

    this.modal.classList.remove('hidden');
    this.modal.classList.add('modal-visible');

    if (window.soundEngine) {
      window.soundEngine.playChime(659.25, 0.8, 0.06);
    }
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('modal-visible');
    setTimeout(() => this.modal.classList.add('hidden'), 250);
  }

  createFloatingHeartOnBtn(btn) {
    const heart = document.createElement('span');
    heart.className = 'btn-floating-heart';
    heart.textContent = '💖';
    const rect = btn.getBoundingClientRect();
    heart.style.left = `${rect.left + rect.width / 2}px`;
    heart.style.top = `${rect.top}px`;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1000);
  }
}

window.photoRibbonEngine = new PhotoRibbonEngine();
