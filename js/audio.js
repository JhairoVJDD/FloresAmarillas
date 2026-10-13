/**
 * audio.js - Gestor de Audio y Efectos Sonoros para Flores Amarillas
 * Implementa Howler.js con fallback a Web Audio API sintetizado
 */

class SoundManager {
  constructor() {
    this.isMuted = false;
    this.hasInteracted = false;
    this.bgmPlaying = false;
    this.howlBgm = null;
    this.howlSfx = null;
    this.audioCtx = null;
    this.synthBgmInterval = null;

    this.initAudioContext();
    this.initHowler();
  }

  // Inicializa Web Audio API para síntesis procedural en caso de que falten archivos locales
  initAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.audioCtx = new AudioContextClass();
    }
  }

  resumeAudioContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Inicializa Howler.js intentando cargar archivos locales o pistas web de alta calidad
  initHowler() {
    if (typeof Howl === 'undefined') {
      console.warn('Howler.js no detectado, usando sintetizador procedural Web Audio.');
      return;
    }

    // SFX: Sonido de papel abriéndose
    this.howlSfx = new Howl({
      src: [
        'assets/audio/paper-open.mp3',
        'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3' // Fallback online libre
      ],
      volume: 0.65,
      onloaderror: () => {
        console.info('Usando generador procedural para SFX de papel.');
        this.howlSfx = null;
      }
    });

    // BGM: Música instrumental romántica suave (piano y cuerdas)
    this.howlBgm = new Howl({
      src: [
        'assets/audio/background.mp3',
        'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3' // Fallback romántico
      ],
      html5: true,
      loop: true,
      volume: 0,
      onloaderror: () => {
        console.info('Usando melodía procedural relajante.');
        this.howlBgm = null;
      }
    });
  }

  // Reproducir sonido de papel al abrir el sobre
  playPaperOpen() {
    this.resumeAudioContext();
    if (this.isMuted) return;

    if (this.howlSfx) {
      try {
        this.howlSfx.play();
        return;
      } catch (e) {
        // Fallback procedural abajo
      }
    }

    // Procedural Paper Rustle & Magic Chime Synthesis (Web Audio API)
    this.synthesizePaperRustle();
  }

  // Sintetizador procedural de textura de papel crujiente y campanilla mágica
  synthesizePaperRustle() {
    if (!this.audioCtx || this.isMuted) return;
    try {
      const now = this.audioCtx.currentTime;

      // 1. Ruido blanco filtrado para textura de papel crujiendo
      const bufferSize = this.audioCtx.sampleRate * 0.45;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 0.35);
      filter.Q.value = 3.0;

      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.audioCtx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.46);

      // 2. Campanillas mágicas celestiales (arpegio brillante)
      const notes = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do agudo
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const startTime = now + (idx * 0.08);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch (err) {
      console.error('Error sintetizando SFX:', err);
    }
  }

  // Iniciar música ambiental suave
  playMusic() {
    this.resumeAudioContext();
    if (this.bgmPlaying) return;

    if (this.howlBgm) {
      try {
        this.howlBgm.play();
        this.howlBgm.fade(0, 0.4, 2500);
        this.bgmPlaying = true;
        return;
      } catch (e) {
        console.warn('Howler fallo, usando sintetizador.');
      }
    }

    // Melodía suave procedural
    this.startProceduralLofiMelody();
    this.bgmPlaying = true;
  }

  // Melodía procedural de caja de música acústica (pentatónica dulce)
  startProceduralLofiMelody() {
    if (!this.audioCtx || this.synthBgmInterval) return;

    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C D E G A C D E
    let step = 0;

    const playTone = () => {
      if (this.isMuted || !this.bgmPlaying || !this.audioCtx) return;
      const noteFreq = scale[step % scale.length];
      step = (step + Math.floor(Math.random() * 3) + 1) % scale.length;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(noteFreq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.9);
    };

    this.synthBgmInterval = setInterval(playTone, 1400);
    playTone();
  }

  stopProceduralMelody() {
    if (this.synthBgmInterval) {
      clearInterval(this.synthBgmInterval);
      this.synthBgmInterval = null;
    }
  }

  // Alternar silencio
  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.howlBgm) {
      this.howlBgm.mute(this.isMuted);
    }

    if (this.isMuted) {
      this.stopProceduralMelody();
    } else if (this.bgmPlaying && !this.howlBgm) {
      this.startProceduralLofiMelody();
    }

    return this.isMuted;
  }
}

// Exportar instancia singleton
window.soundManager = new SoundManager();
