/**
 * animations.js - Orquestación de Animaciones GSAP, Canvas de Pétalos y Confeti
 * Maneja el flujo interactivo del sobre 3D y la experiencia sensorial
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de subsistemas
  initPetalsCanvas();
  initEnvelopeInteraction();
  initAudioControls();
});

/* ==========================================================================
   1. Canvas de Pétalos Amarillos Caída Libre y Brisa Suave
   ========================================================================== */
function initPetalsCanvas() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Paleta de pétalos y motas de luz doradas
  const petalColors = [
    { fill: '#FFE066', stroke: '#F59E0B' },
    { fill: '#FFD700', stroke: '#D97706' },
    { fill: '#FDE047', stroke: '#CA8A04' },
    { fill: '#FBBF24', stroke: '#B45309' },
    { fill: '#FFF9DB', stroke: '#FDE047' }
  ];

  const PETAL_COUNT = window.innerWidth < 640 ? 28 : 45;
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -25;
      this.size = Math.random() * 11 + 9;
      this.speedY = Math.random() * 1.2 + 0.7;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.035;
      this.swayAmplitude = Math.random() * 25 + 15;
      this.swayFrequency = Math.random() * 0.015 + 0.008;
      this.swayStep = Math.random() * 100;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.opacity = Math.random() * 0.45 + 0.55;
      this.isSparkle = Math.random() > 0.75;
    }

    update() {
      this.swayStep += this.swayFrequency;
      this.x += Math.sin(this.swayStep) * 0.9 + this.speedX;
      this.y += this.speedY;
      this.angle += this.angularSpeed;

      if (this.y > height + 30 || this.x < -40 || this.x > width + 40) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity;

      if (this.isSparkle) {
        // Mota de polen / destello de luz dorado
        ctx.fillStyle = '#FFE57F';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.22, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Pétalo curvado estilizado
        ctx.fillStyle = this.color.fill;
        ctx.strokeStyle = this.color.stroke;
        ctx.lineWidth = 0.8;

        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(
          this.size * 0.7, -this.size * 0.5,
          this.size * 0.6, this.size * 0.7,
          0, this.size
        );
        ctx.bezierCurveTo(
          -this.size * 0.6, this.size * 0.7,
          -this.size * 0.7, -this.size * 0.5,
          0, -this.size
        );
        ctx.fill();
        ctx.stroke();

        // Nervadura central sutil
        ctx.strokeStyle = this.color.stroke;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.7);
        ctx.lineTo(0, this.size * 0.6);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. Línea de Tiempo GSAP para Apertura 3D del Sobre, Centrado y Desdoble
   ========================================================================== */
function initEnvelopeInteraction() {
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const flap = document.getElementById('envelope-flap');
  const seal = document.getElementById('envelope-seal');
  const slip = document.getElementById('envelope-paper-slip');
  const letter = document.getElementById('letter-paper');
  const backdrop = document.getElementById('letter-backdrop');
  const hint = document.getElementById('open-hint');
  const closeBtn = document.getElementById('close-letter-btn');

  if (!envelopeWrapper || !flap || !seal || !letter) return;

  let isOpen = false;
  let isAnimating = false;

  // Estado inicial limpio y sin sobreposiciones:
  gsap.set(flap, {
    rotateX: 0,
    transformOrigin: 'top center',
    zIndex: 4
  });
  if (slip) {
    gsap.set(slip, { y: 0, zIndex: 2 });
  }
  gsap.set(backdrop, {
    opacity: 0,
    pointerEvents: 'none'
  });
  gsap.set(letter, {
    top: '50%',
    left: '50%',
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 60,
    scale: 0.7,
    rotateX: -20,
    opacity: 0,
    visibility: 'hidden',
    pointerEvents: 'none',
    zIndex: 100
  });

  // 1. Función de apertura (Abre sobre -> Emerge hoja -> Centrado exacto en pantalla)
  const openEnvelope = () => {
    if (isOpen || isAnimating) return;
    isAnimating = true;

    if (window.soundManager) {
      window.soundManager.playPaperOpen();
      window.soundManager.playMusic();
    }

    const openTl = gsap.timeline({
      onComplete: () => {
        isOpen = true;
        isAnimating = false;
        envelopeWrapper.classList.add('is-open');
      }
    });

    openTl
      // A. Ocultar pista y despegar sello de lacre dorado
      .to(hint, {
        opacity: 0,
        scale: 0.8,
        duration: 0.25,
        ease: 'power1.out',
        onComplete: () => gsap.set(hint, { display: 'none' })
      })
      .to(seal, {
        opacity: 0,
        scale: 1.25,
        duration: 0.35,
        ease: 'back.in(1.7)'
      }, '-=0.1')
      // B. Abrir solapa en 3D (pasa a z-index: 1 al superar 90deg)
      .to(flap, {
        rotateX: 180,
        duration: 0.75,
        ease: 'power2.inOut',
        onUpdate: function () {
          if (this.progress() > 0.5) {
            flap.style.zIndex = '1';
          }
        }
      }, '-=0.15')
      // C. La hoja asoma saliendo de la boca del sobre
      .to(slip, {
        y: -140,
        duration: 0.7,
        ease: 'power2.out',
        onStart: () => {
          setTimeout(triggerGoldenConfetti, 100);
        }
      }, '-=0.25')
      // D. Aparece el backdrop oscuro suave con blur
      .to(backdrop, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.45,
        ease: 'power2.out'
      }, '-=0.3')
      // E. CARTA MODAL CENTRADA: Se abre en el centro exacto de la pantalla y se desdobla en 3D
      .fromTo(letter, 
        {
          opacity: 0,
          visibility: 'visible',
          pointerEvents: 'auto',
          scale: 0.65,
          y: 70,
          rotateX: -25,
          xPercent: -50,
          yPercent: -50
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          duration: 0.65,
          ease: 'back.out(1.2)'
        },
        '-=0.35'
      )
      .fromTo(
        '.letter-paragraph',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.12, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(
        closeBtn,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' },
        '-=0.15'
      );
  };

  // 2. Función de cierre (Plegar en 3D -> Regresa al sobre -> Entra al bolsillo -> Cierra solapa)
  const closeEnvelope = (e) => {
    if (e) e.stopPropagation();
    if (!isOpen || isAnimating) return;
    isAnimating = true;

    if (window.soundManager) {
      window.soundManager.playPaperOpen();
    }

    // Resetear scroll interno
    letter.scrollTop = 0;

    const closeTl = gsap.timeline({
      onComplete: () => {
        gsap.set(letter, {
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          y: 60,
          scale: 0.7,
          rotateX: -20
        });
        gsap.set(flap, { zIndex: 4 });
        gsap.set(hint, { opacity: 1, scale: 1, display: 'flex' });

        isOpen = false;
        isAnimating = false;
        envelopeWrapper.classList.remove('is-open');
      }
    });

    closeTl
      // A. Ocultar botón de cierre
      .to(closeBtn, {
        opacity: 0,
        scale: 0.85,
        duration: 0.2
      })
      // B. La carta se pliega y vuelve hacia la posición del sobre
      .to(letter, {
        opacity: 0,
        scale: 0.65,
        y: 70,
        rotateX: -25,
        duration: 0.45,
        ease: 'power2.in'
      })
      // C. Desvanecer backdrop
      .to(backdrop, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.4,
        ease: 'power2.in'
      }, '<')
      // D. La hoja dentro del sobre se desliza hacia adentro del bolsillo
      .to(slip, {
        y: 0,
        duration: 0.55,
        ease: 'power2.out'
      }, '-=0.15')
      // E. Solapa superior se cierra en 3D pasando a Capa 4 (z-index: 4)
      .to(flap, {
        rotateX: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        onUpdate: function () {
          if (this.progress() > 0.5) {
            flap.style.zIndex = '4';
          }
        }
      }, '-=0.25')
      // F. Reaparece el sello de cera dorado
      .to(seal, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(2)'
      }, '-=0.15');
  };

  // Event Listeners (Sobre, Sello, Botón de Cerrar y Clic Fuera en Backdrop)
  envelopeWrapper.addEventListener('click', (e) => {
    if (!isOpen) openEnvelope();
  });

  seal.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isOpen) openEnvelope();
  });

  closeBtn.addEventListener('click', (e) => {
    closeEnvelope(e);
  });

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      closeEnvelope(e);
    });
  }
}

/* ==========================================================================
   3. Ráfaga de Confeti Dorado con Canvas-Confetti
   ========================================================================== */
function triggerGoldenConfetti() {
  if (typeof confetti !== 'function') return;

  const goldColors = ['#FFD700', '#FFA500', '#FFFFE0', '#F4C430', '#EAB308'];

  // Disparo central principal
  confetti({
    particleCount: 75,
    spread: 70,
    origin: { y: 0.55 },
    colors: goldColors,
    scalar: 1.1,
    ticks: 200,
    shapes: ['circle', 'square'],
    disableForReducedMotion: true
  });

  // Disparos laterales con retraso para un efecto envolvente
  setTimeout(() => {
    confetti({
      particleCount: 35,
      angle: 60,
      spread: 55,
      origin: { x: 0.2, y: 0.65 },
      colors: goldColors,
      scalar: 0.9,
      ticks: 180
    });
    confetti({
      particleCount: 35,
      angle: 120,
      spread: 55,
      origin: { x: 0.8, y: 0.65 },
      colors: goldColors,
      scalar: 0.9,
      ticks: 180
    });
  }, 220);
}

/* ==========================================================================
   4. Control de Botón de Audio (Mute / Unmute)
   ========================================================================== */
function initAudioControls() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const iconSoundOn = document.getElementById('icon-sound-on');
  const iconSoundOff = document.getElementById('icon-sound-off');

  if (!audioBtn) return;

  audioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!window.soundManager) return;

    const isMuted = window.soundManager.toggleMute();

    if (isMuted) {
      if (iconSoundOn) iconSoundOn.style.display = 'none';
      if (iconSoundOff) iconSoundOff.style.display = 'block';
      audioBtn.setAttribute('aria-label', 'Activar sonido');
      audioBtn.title = 'Activar sonido';
    } else {
      if (iconSoundOn) iconSoundOn.style.display = 'block';
      if (iconSoundOff) iconSoundOff.style.display = 'none';
      audioBtn.setAttribute('aria-label', 'Silenciar sonido');
      audioBtn.title = 'Silenciar sonido';
    }
  });
}
