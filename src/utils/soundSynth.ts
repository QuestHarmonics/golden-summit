import { AudioContext, OscillatorNode, GainNode } from 'standardized-audio-context';

export class ChiptuneSynth {
  private ctx: AudioContext;
  private oscillator: OscillatorNode<AudioContext> | null = null;
  private gainNode: GainNode<AudioContext> | null = null;
  private lfoGainNode: GainNode<AudioContext> | null = null;

  constructor() {
    this.ctx = new AudioContext();
  }

  playNote(frequency: number, duration: number, effect?: string) {
    this.oscillator = this.ctx.createOscillator();
    this.gainNode = this.ctx.createGain();

    this.oscillator.type = 'square';
    this.oscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    
    this.gainNode.gain.setValueAtTime(0.3, this.ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    if (effect) {
      this.addEffect(effect, this.oscillator, this.gainNode);
    }

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.oscillator.start();
    this.oscillator.stop(this.ctx.currentTime + duration);
  }

  private addEffect(type: string, oscillator: OscillatorNode<AudioContext>, gainNode: GainNode<AudioContext>) {
    switch(type) {
      case 'echo':
        const delay = this.ctx.createDelay();
        const feedback = this.ctx.createGain();
        delay.delayTime.value = 0.2;
        feedback.gain.value = 0.4;
        
        oscillator.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(this.ctx.destination);
        break;

      case 'vibrato':
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 6;
        lfoGain.gain.value = 10;
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        lfo.start();
        break;

      case 'bitcrush':
        const crusher = this.ctx.createWaveShaper();
        crusher.curve = this.makeDistortionCurve(100);
        oscillator.connect(crusher);
        crusher.connect(gainNode);
        break;
    }
  }

  private makeDistortionCurve(amount: number) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < samples; ++i) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  public setLFOGain(gain: number) {
    if (this.lfoGainNode) {
      this.lfoGainNode.gain.value = gain;
    }
  }

  playDrum(type: 'kick' | 'snare' | 'hihat') {
    const ctx = this.ctx;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    const bufferSize = ctx.sampleRate;

    switch (type) {
      case 'kick':
        const kickOsc = ctx.createOscillator();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(150, ctx.currentTime);
        kickOsc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        kickOsc.connect(gainNode);
        gainNode.connect(ctx.destination);
        kickOsc.start(ctx.currentTime);
        kickOsc.stop(ctx.currentTime + 0.5);
        break;
      case 'snare':
        const snareNoise = ctx.createBufferSource();
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        snareNoise.buffer = buffer;
        const snareFilter = ctx.createBiquadFilter();
        snareFilter.type = 'highpass';
        snareFilter.frequency.setValueAtTime(1000, ctx.currentTime);
        snareNoise.connect(snareFilter);
        snareFilter.connect(gainNode);
        gainNode.connect(ctx.destination);
        snareNoise.start(ctx.currentTime);
        snareNoise.stop(ctx.currentTime + 0.2);
        break;
      case 'hihat':
        const hihatNoise = ctx.createBufferSource();
        const hihatBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const hihatOutput = hihatBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          hihatOutput[i] = Math.random() * 2 - 1;
        }
        hihatNoise.buffer = hihatBuffer;
        const hihatFilter = ctx.createBiquadFilter();
        hihatFilter.type = 'highpass';
        hihatFilter.frequency.setValueAtTime(5000, ctx.currentTime);
        hihatNoise.connect(hihatFilter);
        hihatFilter.connect(gainNode);
        gainNode.connect(ctx.destination);
        hihatNoise.start(ctx.currentTime);
        hihatNoise.stop(ctx.currentTime + 0.1);
        break;
    }
  }
} 