export declare class ChiptuneSynth {
  constructor();
  playNote(frequency: number, duration: number, effect?: string): void;
  private addEffect(type: string, oscillator: OscillatorNode, gainNode: GainNode): void;
  private makeDistortionCurve(amount: number): Float32Array;
} 