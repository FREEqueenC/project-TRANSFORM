import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhysicsService {
  constructor() { }

  /**
   * Calculates the resonant frequency for TM010 Mode
   * @param radiusMm Cavity radius in millimeters
   * @param isPhaseConjugated Whether Φ phase conjugation is active
   * @returns frequency in GHz
   */
  calculateResonantFrequency(radiusMm: number, isPhaseConjugated: boolean): number {
    // Convert mm to cm for the formula: f = (j01 * c) / (2 * PI * R)
    // j01 is the first zero of the Bessel function J0(x) ≈ 2.404825
    // Note: 2.405 is used here to align the 4.2mm resonance precisely with the 
    // Lunar Sidereal Period (27.3216 days), creating a perfect planetary sync.
    const radiusCm = radiusMm / 10.0;
    const c = 29979245800; // speed of light in cm/s
    const root = 2.405; // Synchronistic Lunar Constant
    const freqHz = (root * c) / (2 * Math.PI * radiusCm);
    const rawFreq = freqHz / 1e9; // Convert to GHz (Lunar Orbital Frequency Sync)
    
    // Phase Conjugation (Golden Ratio Shift)
    return isPhaseConjugated ? rawFreq * 1.6180339887 : rawFreq;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private panner: StereoPannerNode | null = null;
  private dataArray: Uint8Array | null = null;
  private loopTimer: any = null;
  public isPlaying = false;

  public activeGroupRange: number[] = [-1, -1];

  async startAudio(frequency: number, cipherTokens: string[], onSync: (range: number[]) => void): Promise<void> {
    if (this.isPlaying) {
      this.stopAudio();
      return;
    }

    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('AudioContext created, state:', this.audioCtx.state);
      }

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      if (this.audioCtx.state !== 'running') {
        throw new Error(`AudioContext failed to start. State: ${this.audioCtx.state}`);
      }

      this.isPlaying = true;

      if (!this.analyser) {
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.7;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      }

      this.analyser.connect(this.audioCtx.destination);

      this.startDroneProtocol(frequency, cipherTokens, onSync);
      console.log('Audio protocol initiated successfully');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      this.isPlaying = false;
      alert('Audio failed to start. Please try clicking the button again. Error: ' + (error as Error).message);
    }
  }

  stopAudio() {
    this.isPlaying = false;
    this.activeGroupRange = [-1, -1];
    if (this.loopTimer) clearTimeout(this.loopTimer);

    if (this.audioCtx) {
      this.audioCtx.suspend();
    }
  }

  private startDroneProtocol(frequency: number, cipherTokens: string[], onSync: (range: number[]) => void) {
    if (!this.audioCtx || !this.analyser) return;

    const oscillator = this.audioCtx.createOscillator();
    const dynamisNode = this.audioCtx.createGain();
    this.panner = this.audioCtx.createStereoPanner();

    oscillator.type = 'sine';
    const baseTone = 220 + (frequency * 5);

    oscillator.connect(dynamisNode);
    dynamisNode.connect(this.panner);
    this.panner.connect(this.analyser);

    const now = this.audioCtx.currentTime;

    oscillator.frequency.setValueAtTime(baseTone, now);
    dynamisNode.gain.setValueAtTime(0, now);
    dynamisNode.gain.linearRampToValueAtTime(0.5, now + 1);

    oscillator.start(now);

    this.scheduleDroneLoop(oscillator, dynamisNode, baseTone, cipherTokens, onSync);
  }

  private scheduleDroneLoop(oscillator: OscillatorNode, gainNode: GainNode, baseFreq: number, cipherTokens: string[], onSync: (range: number[]) => void) {
    if (!this.isPlaying || !this.audioCtx) return;

    const tokens = cipherTokens;
    const baseDurations = [1.2, 1.2, 0.8, 0.6, 0.8, 1.0, 1.0, 0.7, 1.5];

    const baseContours: number[][] = [
      [1.0, 1.02, 1.0],
      [1.0, 0.98, 1.0],
      [1.0, 1.01, 0.99, 1.0],
      [1.0, 0.99, 1.0],
      [1.0, 1.05, 0.95, 1.0],
      [1.0, 1.02, 1.0],
      [1.0, 1.03, 1.0],
      [1.0, 0.98, 1.02, 1.0],
      [1.0, 0.9, 0.6, 1.0]
    ];

    // BASE-9 SACRED GEOMETRY: Convert each cipher token into a Base-9 modulo 
    // to dynamically select the auditory contour. The word essentially "plays" itself.
    const getBase9Index = (token: string) => {
      let sum = 0;
      for (let i = 0; i < token.length; i++) sum += token.charCodeAt(i);
      return sum % 9;
    };

    const tokenDurations = tokens.map(t => baseDurations[getBase9Index(t)]);
    const pitchContours = tokens.map(t => baseContours[getBase9Index(t)]);

    const overlapTime = 0.5;

    let cursorTime = this.audioCtx.currentTime + 0.1;

    tokens.forEach((token, index) => {
      const duration = tokenDurations[index];
      const contour = pitchContours[index];

      const timeUntilStart = (cursorTime - this.audioCtx!.currentTime) * 1000;
      if (timeUntilStart >= -100) {
        this.loopTimer = setTimeout(() => {
          if (this.isPlaying) {
            this.activeGroupRange = [index, index];
            onSync([index, index]);
          }
        }, timeUntilStart);
      }

      gainNode.gain.cancelScheduledValues(cursorTime);
      gainNode.gain.setValueAtTime(0.4, cursorTime);
      gainNode.gain.linearRampToValueAtTime(0.8, cursorTime + (duration * 0.2));
      gainNode.gain.linearRampToValueAtTime(0.4, cursorTime + duration);

      const stepTime = duration / (contour.length - 1);

      oscillator.frequency.cancelScheduledValues(cursorTime);
      oscillator.frequency.setValueAtTime(baseFreq * contour[0], cursorTime);

      for (let i = 1; i < contour.length; i++) {
        const timeT = cursorTime + (stepTime * i);
        oscillator.frequency.linearRampToValueAtTime(baseFreq * contour[i], timeT);
      }

      cursorTime += duration;
    });

    const totalLoopDuration = cursorTime - this.audioCtx.currentTime;

    this.loopTimer = setTimeout(() => {
      if (this.isPlaying) {
        this.scheduleDroneLoop(oscillator, gainNode, baseFreq, cipherTokens, onSync);
      } else {
        const stopTime = this.audioCtx!.currentTime;
        gainNode.gain.linearRampToValueAtTime(0, stopTime + 1);
        oscillator.stop(stopTime + 1.1);
      }
    }, (totalLoopDuration * 1000) - (overlapTime * 1000));
  }

  getAudioIntensity(): number {
    if (this.analyser && this.dataArray && this.isPlaying) {
      this.analyser.getByteFrequencyData(this.dataArray as any);
      let sum = 0;
      for (let i = 0; i < this.dataArray.length; i++) sum += this.dataArray[i];
      const avg = sum / this.dataArray.length;
      // Boosted sensitivity: Lower divisor (25) and higher multiplier (2.2)
      return Math.min((avg / 25) * 2.2, 1);
    }
    return 0;
  }

  updatePanner(rotation: number) {
    if (this.panner && this.audioCtx && this.isPlaying) {
      this.panner.pan.setValueAtTime(Math.sin(rotation), this.audioCtx.currentTime);
    }
  }
}
