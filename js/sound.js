// ============================================================
// Sound Manager – Centralized audio system
// ============================================================

const VOLUME = {
    JUMP: 0.7,
    SLASH: 0.7,
    HIT: 0.7,
    LAND: 0.7
};

class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = false;
        this.audioContext = null;
        
        // Try to create AudioContext for fallback sounds
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
        
        // Load all sounds (only existing files)
        this.loadSound('jump', 'assets/sounds/Jump sound.mpeg', VOLUME.JUMP);
        this.loadSound('slash', 'assets/sounds/Katana slash.mpeg', VOLUME.SLASH);
        this.loadSound('hit', 'assets/sounds/Katana slash.mpeg', VOLUME.HIT);
        this.loadSound('land', 'assets/sounds/Landing sound.mpeg', VOLUME.LAND);
    }

    loadSound(name, path, volume = 1.0) {
        const audio = new Audio();
        audio.volume = volume;
        audio.preload = 'auto';
        
        // Handle load errors gracefully
        audio.addEventListener('error', () => {
            console.warn(`Sound file not found: ${path} - Using fallback`);
        });
        
        audio.src = path;
        this.sounds[name] = { audio, volume, loaded: false };
        
        audio.addEventListener('canplaythrough', () => {
            this.sounds[name].loaded = true;
        }, { once: true });
    }

    enable() {
        this.enabled = true;
        // Resume audio context if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    playSound(name) {
        if (!this.enabled || !this.sounds[name]) return;
        
        const soundData = this.sounds[name];
        const sound = soundData.audio;
        
        // Reset and play
        sound.currentTime = 0;
        sound.play().catch(err => {
            // If file doesn't exist, play fallback beep
            if (!soundData.loaded) {
                this.playFallbackSound(name);
            }
        });
    }

    playFallbackSound(name) {
        if (!this.audioContext) return;
        
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        // Different frequencies for different sounds
        const frequencies = {
            jump: 400,
            slash: 600,
            hit: 200,
            land: 150,
            intro: 300
        };
        
        oscillator.frequency.value = frequencies[name] || 300;
        oscillator.type = name === 'hit' ? 'sawtooth' : 'sine';
        
        const vol = this.sounds[name]?.volume || 0.3;
        gainNode.gain.setValueAtTime(vol * 0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    }

    playJump() {
        this.playSound('jump');
    }

    playSlash() {
        this.playSound('slash');
    }

    playHit() {
        this.playSound('hit');
    }

    playLand() {
        this.playSound('land');
    }
}
