import type { SoundSystem, SoundTheme, SoundEffect } from '../types/sound';

export class RetroSoundSynth implements SoundSystem {
  private static instance: RetroSoundSynth;
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private backgroundMusic: OscillatorNode | null = null;
  private backgroundGain: GainNode | null = null;

  private constructor() {}

  public static get Instance() {
    return this.instance || (this.instance = new this());
  }

  public initAudio(): void {
    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
      }

      // Resume audio context if it was suspended
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  public playBackgroundMusic(): void {
    try {
      if (!this.audioContext || this.audioContext.state === 'suspended') {
        this.initAudio();
      }

      if (!this.audioContext || !this.gainNode) return;

      // Stop existing background music if any
      this.stopBackgroundMusic();

      // Create and configure background music oscillator
      this.backgroundMusic = this.audioContext.createOscillator();
      this.backgroundGain = this.audioContext.createGain();
      
      this.backgroundMusic.connect(this.backgroundGain);
      this.backgroundGain.connect(this.audioContext.destination);

      // Set very low gain for background music
      this.backgroundGain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
      
      // Create a simple ambient sound
      this.backgroundMusic.frequency.setValueAtTime(220, this.audioContext.currentTime);
      this.backgroundMusic.type = 'sine';
      
      this.backgroundMusic.start();
    } catch (error) {
      console.error('Failed to play background music:', error);
    }
  }

  public stopBackgroundMusic(): void {
    try {
      if (this.backgroundMusic) {
        this.backgroundMusic.stop();
        this.backgroundMusic.disconnect();
        this.backgroundMusic = null;
      }
      if (this.backgroundGain) {
        this.backgroundGain.disconnect();
        this.backgroundGain = null;
      }
    } catch (error) {
      console.error('Failed to stop background music:', error);
    }
  }

  public playEffect(effect: SoundEffect): void {
    if (!this.audioContext || this.audioContext.state === 'suspended') {
      this.initAudio();
    }

    if (!this.audioContext || !this.gainNode) return;

    // Create and configure oscillator
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Configure effect parameters
    switch (effect) {
      case 'xp':
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
        break;
      case 'levelUp':
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(880, this.audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
        break;
      case 'powerUp':
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
        break;
      case 'achievement':
        oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1760, this.audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.4);
        break;
      case 'error':
        oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
        break;
    }
  }

  public setTheme(theme: SoundTheme): void {
    // Theme setting is not used in the current implementation
  }
} 