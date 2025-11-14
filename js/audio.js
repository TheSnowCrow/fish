// Retro audio system using Web Audio API

class AudioSystem {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.enabled = true;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = 0.3;
            this.initialized = true;
        } catch (e) {
            console.warn('Audio not supported:', e);
            this.enabled = false;
        }
    }

    // Resume audio context (needed for mobile)
    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    // Create a simple oscillator sound
    playTone(frequency, duration, type = 'square', volume = 0.3) {
        if (!this.enabled || !this.sfxEnabled || !this.context) return;

        this.resume();

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = type;
        osc.frequency.value = frequency;

        gain.gain.value = volume;
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

        osc.start(this.context.currentTime);
        osc.stop(this.context.currentTime + duration);
    }

    // Retro sound effects
    playLaunch() {
        if (!this.sfxEnabled) return;
        const time = this.context?.currentTime || 0;
        this.playTone(200, 0.1, 'sawtooth', 0.4);
        setTimeout(() => this.playTone(300, 0.15, 'square', 0.3), 50);
    }

    playBounce(strength = 1) {
        if (!this.sfxEnabled) return;
        const freq = 200 + strength * 200;
        this.playTone(freq, 0.08, 'triangle', 0.25);
    }

    playGoal() {
        if (!this.sfxEnabled) return;
        this.playTone(523, 0.1, 'square', 0.4);
        setTimeout(() => this.playTone(659, 0.1, 'square', 0.4), 100);
        setTimeout(() => this.playTone(784, 0.2, 'square', 0.4), 200);
    }

    playFail() {
        if (!this.sfxEnabled) return;
        this.playTone(300, 0.1, 'sawtooth', 0.4);
        setTimeout(() => this.playTone(200, 0.1, 'sawtooth', 0.4), 100);
        setTimeout(() => this.playTone(100, 0.2, 'sawtooth', 0.4), 200);
    }

    playSplash() {
        if (!this.sfxEnabled) return;
        this.playTone(400, 0.15, 'sine', 0.3);
        setTimeout(() => this.playTone(300, 0.1, 'sine', 0.2), 50);
    }

    playCollect() {
        if (!this.sfxEnabled) return;
        this.playTone(659, 0.08, 'square', 0.3);
        setTimeout(() => this.playTone(880, 0.12, 'square', 0.3), 80);
    }

    playClick() {
        if (!this.sfxEnabled) return;
        this.playTone(440, 0.05, 'square', 0.2);
    }

    playWater() {
        if (!this.sfxEnabled) return;
        this.playTone(200, 0.2, 'sine', 0.15);
    }

    playBubble() {
        if (!this.sfxEnabled) return;
        const freq = Utils.randomRange(400, 600);
        this.playTone(freq, 0.1, 'sine', 0.15);
    }

    // Simple background music
    startMusic() {
        if (!this.musicEnabled || !this.context) return;

        this.resume();

        // Simple looping melody pattern
        const melody = [
            { note: 523, duration: 0.2 }, // C
            { note: 587, duration: 0.2 }, // D
            { note: 659, duration: 0.2 }, // E
            { note: 587, duration: 0.2 }, // D
            { note: 523, duration: 0.2 }, // C
            { note: 392, duration: 0.2 }, // G
            { note: 440, duration: 0.4 }, // A
        ];

        let index = 0;
        const playNote = () => {
            if (!this.musicEnabled) return;
            const { note, duration } = melody[index];
            this.playTone(note, duration, 'triangle', 0.05);
            index = (index + 1) % melody.length;
            setTimeout(playNote, duration * 1000);
        };

        // Uncomment to enable background music
        // playNote();
    }
}

// Global audio instance
const Audio = new AudioSystem();
