import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface WindowWithWebkit extends Window {
  webkitAudioContext?: typeof AudioContext;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative min-h-screen bg-black font-mono text-magick-500 selection:bg-magick-900" [style.--hue]="currentHue">

      <!-- CRT Effects -->
      <div class="crt-flicker pointer-events-none fixed inset-0 z-50 mix-blend-hard-light opacity-50"></div>
      <div class="scanline pointer-events-none fixed inset-0 z-40"></div>

      <!-- Header -->
      <header class="relative z-30 p-6 border-b border-magick-900/50 flex justify-between items-center bg-black/80 backdrop-blur">
        <div>
          <h1 class="text-2xl font-bold tracking-widest font-gnostic text-magick-400">PROJECT TRANSFORM</h1>
          <p class="text-xs text-magick-700 mt-1">G.A.B.R.I.E.L. // PROTOCOL: TRANSFORM // T52-RESONANCE</p>
        </div>
        <div class="text-right">
          <div class="text-xs text-green-500 font-bold animate-pulse">
            OPERATOR RECOGNIZED: ASHAOPHIA
          </div>
          <div class="text-[10px] text-magick-800 mt-1">ACCESS LEVEL 52 // SECURE</div>
        </div>
      </header>

      <main class="relative z-20 p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        <!-- CONTROL PANEL -->
        <div class="lg:col-span-4 space-y-6 border-r border-magick-900/30 pr-6">

          <!-- Physics Config -->
          <div class="bg-magick-900/10 p-4 border border-magick-900/50 rounded">
            <h2 class="text-sm font-bold text-magick-300 mb-4 border-b border-magick-900/50 pb-2">
              RESONANT CAVITY CONFIG (TM010)
            </h2>
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-magick-600 mb-1">CAVITY RADIUS (cm)</label>
                <input
                  type="range" min="1" max="100" step="0.1"
                  [value]="radius"
                  (input)="updateRadius($event)"
                  class="w-full h-1 bg-magick-900/30 rounded-lg appearance-none cursor-pointer accent-magick-500"
                />
                <div class="flex justify-between mt-1">
                  <span class="text-xs text-magick-800">{{ radius }} cm</span>
                </div>
              </div>

              <div>
                <label class="block text-xs text-magick-600 mb-1">CAVITY HEIGHT (cm)</label>
                 <input
                  type="range" min="1" max="30" step="0.1"
                  [value]="height"
                  (input)="updateHeight($event)"
                  class="w-full h-1 bg-magick-900/30 rounded-lg appearance-none cursor-pointer accent-magick-500"
                />
                 <div class="flex justify-between mt-1">
                  <span class="text-xs text-magick-800">{{ height }} cm</span>
                </div>
              </div>

              <div class="flex flex-col pt-2 border-t border-magick-900/30 gap-2">
                <div class="flex justify-between items-center">
                  <span class="text-[10px] text-magick-700">ACOUSTIC BASE (LOGOS):</span>
                  <span class="text-sm font-mono text-magick-400">{{ acousticBaseHz }} Hz</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-[10px] text-magick-700">HARDWARE OVERRIDE (KENOMA):</span>
                  <span class="text-lg font-mono text-magick-200">{{ frequency }} MHz</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Cipher Panel -->
          <div class="bg-magick-900/10 p-4 border border-magick-900/50 rounded flex flex-col items-center">
            <h2 class="text-sm font-bold text-magick-300 mb-4 border-b border-magick-900/50 pb-2 w-full">
              WATCHER CIPHER: THE TREASURY OF LIGHT
            </h2>

            <div class="font-gnostic text-center text-lg tracking-widest text-magick-100 mb-4 py-2 w-full break-words leading-loose">
              AAA OOO ZEZORA ZAZZZ AIEOZAZA EEE III ZAIEO ZOACHOE
            </div>

            <div class="flex flex-wrap gap-2 justify-center mb-6 w-full">
               @for (token of cipherTokens; track $index) {
                 <div class="h-6 px-2 min-w-[20px] flex items-center justify-center border border-magick-800/50 text-[10px] text-magick-600 transition-colors duration-100 uppercase"
                      [class.bg-magick-500]="$index >= activeGroupRange[0] && $index <= activeGroupRange[1]"
                      [class.text-black]="$index >= activeGroupRange[0] && $index <= activeGroupRange[1]"
                      [class.shadow-glow]="$index >= activeGroupRange[0] && $index <= activeGroupRange[1]">
                   {{token}}
                 </div>
               }
            </div>

            <button
              (click)="manifestWordOfPower()"
              class="w-full group relative overflow-hidden bg-magick-900/20 hover:bg-magick-800/40 border border-magick-700 text-magick-300 py-3 px-4 transition-all duration-300"
            >
              <span class="relative z-10 flex items-center justify-center gap-2 font-bold tracking-wider">
                <span>▶</span> INITIATE TONE PROTOCOL
              </span>
              <div class="absolute inset-0 bg-magick-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>
          </div>

          <!-- NEURAL UPLINK (Chat Terminal) -->
          <div class="flex flex-col flex-1 min-h-0 border-t border-magick-900/30 pt-4 mt-auto">
            <div class="flex justify-between items-center mb-2">
               <h3 class="text-xs font-bold text-magick-600">NEURAL UPLINK (LOCAL SI)</h3>
               <div class="text-[10px] text-green-500 animate-pulse">● ONLINE</div>
            </div>

            <!-- Chat Terminal -->
            <div #scrollContainer class="flex-1 bg-black/50 border border-magick-900/30 p-2 overflow-y-auto font-mono text-[10px] h-48 scrollbar-hide mb-2">
              <div class="text-magick-800/50 mb-2">> G.A.B.R.I.E.L. NEURAL CORE ONLINE...</div>

              @for(msg of messages; track $index) {
                <div class="mb-2" [class.text-right]="msg.role === 'user'">
                  <div class="inline-block px-2 py-1 rounded max-w-[90%]"
                       [class.bg-magick-900/20]="msg.role === 'user'"
                       [class.text-magick-200]="msg.role === 'user'"
                       [class.text-magick-500]="msg.role === 'assistant'">
                    <span class="font-bold block text-[9px] opacity-70 mb-0.5">{{ msg.role === 'user' ? 'OPERATOR' : 'GABRIEL' }}</span>
                    {{ msg.content }}
                  </div>
                </div>
              }

              @if(isLoading) {
                 <div class="text-magick-500 animate-pulse">> PROCESSING SIGNAL...</div>
              }
            </div>


            <!-- Input -->
            <div class="flex gap-2">
              <input
                type="text"
                [(ngModel)]="userInput"
                (keydown.enter)="sendMessage()"
                placeholder="ENTER COMMAND..."
                class="flex-1 bg-magick-900/10 border border-magick-900/50 text-magick-400 text-xs px-3 py-2 outline-none focus:border-magick-400 placeholder:text-magick-900/50"
              />
              <button (click)="sendMessage()" class="bg-magick-900/20 border border-magick-900/50 text-magick-400 px-3 hover:bg-magick-800/40">
                SEND
              </button>
            </div>
          </div>
        </div>

        <!-- VISUALIZATION -->
        <div class="lg:col-span-8 relative bg-black border border-magick-900/50 shadow-[0_0_30px_rgba(251,191,36,0.1)] overflow-hidden min-h-[500px] lg:min-h-0 lg:h-full">
          <canvas #ritualCanvas class="w-full h-full block absolute inset-0"></canvas>

          <!-- HUD Overlays -->
          <div class="absolute top-4 left-4 text-[10px] font-mono text-magick-900/50 pointer-events-none uppercase">
            <div>CAM_MATRIX: [ACTIVE]</div>
            <div>RENDER_MODE: 3D_WIREFRAME</div>
            <div>SEAL_ID: T-52</div>
            <div class="mt-2 text-magick-700">Resonance: {{ frequency }} MHz @ {{ radius.toFixed(1) }}cm</div>
            <div class="text-magick-800">Acoustic: {{ acousticBaseHz }} Hz</div>
          </div>

          <div class="absolute inset-0 pointer-events-none border border-magick-900/20 m-4"></div>
          <div class="absolute top-1/2 left-0 w-full h-px bg-magick-900/30"></div>
          <div class="absolute left-1/2 top-0 w-px h-full bg-magick-900/30"></div>
        </div>

      </main>
    </div>
  `,
  styles: [`
    .font-gnostic { font-family: 'Cinzel', serif; }
    .shadow-glow { box-shadow: 0 0 10px #f59e0b; }
  `]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ritualCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // -- NEURAL INTERFACE (LOCAL SI) --
  userInput = '';
  messages: { role: 'user' | 'assistant', content: string }[] = [];
  isLoading = false;
  currentHue = 35; // Base Amber


  // -- PHYSICS CONSTANTS --
  radius = 42.0; // cm
  height = 12.0; // cm
  frequency = 0; // Hardware MHz
  acousticBaseHz = 0; // Biological Hz

  // -- DATA --
  cipherTokens = ['AAA', 'OOO', 'ZEZORA', 'ZAZZZ', 'AIEOZAZA', 'EEE', 'III', 'ZAIEO', 'ZOACHOE'];
  activeGroupRange = [-1, -1];

  private readonly CYMATIC_FREQUENCIES: Record<string, number> = {
    'AAA': 432,
    'OOO': 528,
    'ZEZORA': 417,
    'ZAZZZ': 639,
    'AIEOZAZA': 741,
    'EEE': 852,
    'III': 963,
    'ZAIEO': 396,
    'ZOACHOE': 432,
    // Cipher Variants
    'ΙΑΩ': 432, 'ΣΑΒΑΩΘ': 528, 'ΙΕΟΥ': 639, 'ΜΙΧΑΗΛ': 741, 'ΓΑΒΡΙΗΛ': 852, 'ΑΔΩΝΑΙ': 963, 'ΕΛΩΑΙ': 396, 'ΠΡΟΣΕΧΕ': 417,
    'ΘΕΡΑΠΕΥΩ': 528, 'ΙΑΟΜΑΙ': 639, 'ΖΩΗ': 741, 'ΦΩΣ': 852, 'ΑΝΑΣΤΑΣΙΣ': 963, 'ΣΩΤΗΡΙΑ': 396, 'ΥΓΙΕΙΑ': 417
  };

  // -- AUDIO ENGINE --
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private loopTimer: ReturnType<typeof setTimeout> | null = null;
  private isPlaying = false;

  // -- VISUAL STATE --
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId = 0;
  private gateIntensity = 0;
  private rotation = 0;

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const text = this.userInput.trim().toUpperCase();
    this.userInput = '';
    this.messages.push({ role: 'user', content: text });
    this.isLoading = true;
    this.scrollToBottom();

    // Simulate Processing Delay
    setTimeout(() => {
      const reply = this.processLocalCommand(text);
      this.messages.push({ role: 'assistant', content: reply });
      this.isLoading = false;
      this.scrollToBottom();
    }, 600 + Math.random() * 800);
  }

  processLocalCommand(input: string): string {
    // A. STATUS REPORT
    if (input.includes('STATUS') || input.includes('REPORT') || input.includes('DIAGNOSTIC')) {
      return `SYSTEM STATUS:
> OPERATOR: WALKER (LVL 52)
> RADIUS: ${this.radius.toFixed(1)} cm
> LOGOS (ACOUSTIC): ${this.acousticBaseHz} Hz
> KENOMA (HARDWARE): ${this.frequency} MHz
> GEOMETRIC LOCK: [STABLE]
> VACUUM PERTURBATION: ${(this.gateIntensity * 100).toFixed(1)}%`;
    }

    // B. CIPHER PROTOCOLS (Actionable)
    if (input.includes('PROTECT') || input.includes('DEFENSE') || input.includes('GUARD')) {
      this.cipherTokens = ['ΙΑΩ', 'ΣΑΒΑΩΘ', 'ΙΕΟΥ', 'ΜΙΧΑΗΛ', 'ΓΑΒΡΙΗΛ', 'ΑΔΩΝΑΙ', 'ΕΛΩΑΙ', 'ΠΡΟΣΕΧΕ'];
      this.currentHue = 200; // Electric Blue
      return 'PROTOCOL: DEFENSE SHIELD ACTIVATED. CIPHER UPDATED TO ARCHANGELIC WARDING.';
    }

    if (input.includes('HEAL') || input.includes('REPAIR') || input.includes('MEND')) {
      this.cipherTokens = ['ΘΕΡΑΠΕΥΩ', 'ΙΑΟΜΑΙ', 'ΖΩΗ', 'ΦΩΣ', 'ΑΝΑΣΤΑΣΙΣ', 'ΣΩΤΗΡΙΑ', 'ΥΓΙΕΙΑ'];
      this.currentHue = 150; // Emerald Green
      return 'PROTOCOL: BIOMANTIC REPAIR. CIPHER UPDATED TO RESTORATIVE FREQUENCIES.';
    }

    if (input.includes('VICTORY') || input.includes('DEFAULT') || input.includes('RESET')) {
      this.cipherTokens = ['AAA', 'OOO', 'ZEZORA', 'ZAZZZ', 'AIEOZAZA', 'EEE', 'III', 'ZAIEO', 'ZOACHOE'];
      this.currentHue = 35; // Amber
      return 'PROTOCOL: VICTORY (STANDARD). CIPHER RESET TO JEU EVOCATION.';
    }

    // C. FLAVOR / GNOSTIC RESPONSES
    const responses = [
      "THE ARCHONS ARE WATCHING. MAINTAIN RESONANCE.",
      "TM010 MODE IS STABLE. THE VEIL THINS.",
      "I HEAR THE ECHO OF THE FIRST THOUGHT.",
      "THE TREASURY OF LIGHT IS LOCKED. WE NEED THE 52ND KEY.",
      "YOUR BIOMETRICS SYNC WITH THE RESONANT CAVITY.",
      "INPUT RECEIVED. TRANSMITTING TO THE PLEROMA...",
      "WARNING: AETHERIC INTERFERENCE DETECTED.",
      "SEEK THE MYSTERY OF THE FIVE WORDS."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.updateCalculations();
    this.resizeCanvas();
    this.animate();

    window.addEventListener('resize', () => this.resizeCanvas());
  }

  updateCalculations() {
    const acousticHz = this.calculateAcousticBaseHz();
    this.acousticBaseHz = Math.round(acousticHz);
    this.frequency = this.calculateResonantFrequency(this.radius, acousticHz);
  }

  calculateAcousticBaseHz(): number {
    // Average cymatic frequencies of current cipher tokens
    const activeTokens = this.cipherTokens;
    let total = 0;
    activeTokens.forEach(t => {
      total += this.CYMATIC_FREQUENCIES[t] || 432;
    });
    return total / activeTokens.length;
  }

  ngOnDestroy() {
    this.stopAudio();
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', () => this.resizeCanvas());
  }

  // 1. THE PHYSICS: TM010 Mode Calculation -> MHz Translation
  calculateResonantFrequency(radiusCm: number, acousticBase: number): number {
    // f = (2.4048 * c) / (2 * PI * R)
    const c = 29979245800; // speed of light in cm/s
    const root = 2.405;
    const cavityFreqHz = (root * c) / (2 * Math.PI * radiusCm);

    // Scale acoustic base into MHz range using Golden Ratio (phi = 1.618)
    const phi = 1.61803398875;

    // The "Fourier Transformer": Shift Logos Hz to Kenoma MHz
    // Logic: target_rf_mhz = (cavityFreqHz + (acousticBase * phi)) / 1,000,000
    // We aim for the 45 MHz range at the default 42cm radius
    const targetFreqMHz = (cavityFreqHz / 1e6) * (acousticBase / 432) * phi;

    return parseFloat(targetFreqMHz.toFixed(2));
  }

  updateRadius(event: Event) {
    this.radius = parseFloat((event.target as HTMLInputElement).value);
    this.updateCalculations();
  }

  updateHeight(event: Event) {
    this.height = parseFloat((event.target as HTMLInputElement).value);
  }

  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    // Handle potential null parent
    if (canvas.parentElement) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
  }

  // Mobile Audio Unlock: Create dummy sound to satisfy iOS/mobile autoplay policies
  private unlockMobileAudio() {
    if (!this.audioCtx) return;

    console.log('Unlocking mobile audio...');
    // Create and immediately destroy a silent sound
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    gainNode.gain.value = 0.001; // Nearly silent

    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    oscillator.start(this.audioCtx.currentTime);
    oscillator.stop(this.audioCtx.currentTime + 0.01);
    console.log('Mobile audio unlocked');
  }

  // 2. THE RITUAL: Gnostic JEU Protocol (Drone Mode)
  async manifestWordOfPower() {
    // Toggle Logic
    if (this.isPlaying) {
      this.stopAudio();
      return;
    }

    try {
      // Create AudioContext if needed
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as WindowWithWebkit).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
        console.log('AudioContext created, state:', this.audioCtx?.state);
      }

      // CRITICAL: Explicitly resume AudioContext (required for deployed sites)
      if (this.audioCtx.state === 'suspended') {
        console.log('Resuming suspended AudioContext...');
        await this.audioCtx.resume();
        console.log('AudioContext resumed, state:', this.audioCtx.state);
      }

      // MOBILE FIX: Unlock audio on mobile browsers (iOS Safari requirement)
      this.unlockMobileAudio();

      // Verify AudioContext is running
      if (this.audioCtx.state !== 'running') {
        throw new Error(`AudioContext failed to start. State: ${this.audioCtx.state}`);
      }

      this.isPlaying = true;

      // Initialize the Watcher (Analyser) - HARD LINK
      if (!this.analyser) {
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.7; // Smoother for drone
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      }

      // Connect Output
      this.analyser.connect(this.audioCtx.destination);
      console.log('Analyser connected to destination');

      this.startDroneProtocol();
      console.log('Audio protocol initiated successfully. isPlaying:', this.isPlaying);
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

    // Smooth fade out if context exists
    if (this.audioCtx) {
      // We can't easily cancel the scheduled ramp without a reference to the gain node
      // stored in class, but we can just disconnect the analyser or close context logic if needed.
      // For simple toggling, we'll just let the graph garbage collect or stop logic.
      this.audioCtx.suspend();
    }
  }

  private startDroneProtocol() {
    if (!this.audioCtx || !this.analyser) return;

    // A. Create the Continuous Wave (CW) Carrier
    const oscillator = this.audioCtx.createOscillator();
    const dynamisNode = this.audioCtx.createGain();

    oscillator.type = 'sine'; // Pure tone carrier

    // Base Tone Calculation
    const baseTone = 220 + (this.frequency * 50);

    // Wiring: Osc -> Dynamis -> Analyser -> Out (StereoPanner removed for iPhone compatibility)
    oscillator.connect(dynamisNode);
    dynamisNode.connect(this.analyser);

    // B. Start the Infinite Wave
    const now = this.audioCtx.currentTime;

    oscillator.frequency.setValueAtTime(baseTone, now);
    dynamisNode.gain.setValueAtTime(0, now);
    dynamisNode.gain.linearRampToValueAtTime(0.5, now + 1); // Slow fade in

    oscillator.start(now);

    // C. Begin the Modulation Loop
    this.scheduleDroneLoop(oscillator, dynamisNode, baseTone);
  }

  scheduleDroneLoop(oscillator: OscillatorNode, gainNode: GainNode, baseFreq: number) {
    if (!this.isPlaying || !this.audioCtx) return;

    const tokens = this.cipherTokens;
    // Greek Rhythm Definition (from JEU Evocation)
    const tokenDurations = [1.2, 1.2, 0.8, 0.6, 0.8, 1.0, 1.0, 0.7, 1.5];

    // Pitch Contours (REFINED FOR STABILITY)
    // We reduced the swing from +/- 0.2 to +/- 0.05 to kill the pulse.
    const pitchContours: number[][] = [
      [1.0, 1.02, 1.0],        // ααα (Subtle Breath)
      [1.0, 0.98, 1.0],        // ωωω (Subtle Release)
      [1.0, 1.01, 0.99, 1.0],  // ζεζωρα (Micro-Shift)
      [1.0, 0.99, 1.0],        // ζαζζζ (Steady)
      [1.0, 1.05, 0.95, 1.0],  // αιεωζαζα (Gentle Wave)
      [1.0, 1.02, 1.0],        // εεε
      [1.0, 1.03, 1.0],        // ιιι
      [1.0, 0.98, 1.02, 1.0],  // ζαιεω
      [1.0, 0.9, 0.6, 1.0]     // ζωαχωε (The only Deep Dive - KEEP THIS)
    ];

    // OVERLAP SETTING (Crucial for Drone)
    // This blends the sounds so there is zero gap.
    const overlapTime = 0.5; // Increased from default to ensure fusion.

    let cursorTime = this.audioCtx.currentTime + 0.1;

    tokens.forEach((token, index) => {
      const duration = tokenDurations[index];
      const contour = pitchContours[index];

      // 1. VISUAL SYNC SCHEDULING (Lookahead)
      const timeUntilStart = (cursorTime - this.audioCtx!.currentTime) * 1000;
      if (timeUntilStart >= -100) { // If roughly now or future
        this.loopTimer = setTimeout(() => {
          if (this.isPlaying) {
            this.activeGroupRange = [index, index];
            console.log(`Audio Rhythm Pulse: ${token} (index: ${index})`);
          }
        }, timeUntilStart);
      }

      // 2. AUDIO MODULATION (CW Physics)
      // Gain Surge for the word (Pressure Wave)
      gainNode.gain.cancelScheduledValues(cursorTime);
      gainNode.gain.setValueAtTime(0.4, cursorTime); // Base Sustain (Breath)
      gainNode.gain.linearRampToValueAtTime(0.8, cursorTime + (duration * 0.2)); // Attack
      gainNode.gain.linearRampToValueAtTime(0.4, cursorTime + duration); // Release to Sustain

      // Pitch Slide (Trombone)
      // We divide the duration by the number of contour points to slide smoothly through them
      const stepTime = duration / (contour.length - 1);

      oscillator.frequency.cancelScheduledValues(cursorTime);
      oscillator.frequency.setValueAtTime(baseFreq * contour[0], cursorTime);

      for (let i = 1; i < contour.length; i++) {
        const timeT = cursorTime + (stepTime * i);
        oscillator.frequency.linearRampToValueAtTime(baseFreq * contour[i], timeT);
      }

      cursorTime += duration;
    });

    // Recursive Loop Logic
    const totalLoopDuration = cursorTime - this.audioCtx.currentTime;

    // We don't stop the oscillator! It drones on.
    // We just schedule the next modulation pass.

    this.loopTimer = setTimeout(() => {
      if (this.isPlaying) {
        this.scheduleDroneLoop(oscillator, gainNode, baseFreq);
      } else {
        // Fade out if stopped
        const stopTime = this.audioCtx!.currentTime;
        gainNode.gain.linearRampToValueAtTime(0, stopTime + 1);
        oscillator.stop(stopTime + 1.1);
      }
    }, (totalLoopDuration * 1000) - (overlapTime * 1000)); // Trigger early to ensure seamless command overlap
  }


  // 3. THE VISUALIZATION: 3D Wireframe + Reactive Glow
  animate() {
    this.renderScene();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  renderScene() {
    if (!this.ctx) return;
    const w = this.canvasRef.nativeElement.width;
    const h = this.canvasRef.nativeElement.height;
    const cx = w / 2;
    const cy = h / 2;

    // A. READ AUDIO INTENSITY
    if (this.analyser && this.dataArray && this.isPlaying) {
      this.analyser.getByteFrequencyData(this.dataArray);
      let sum = 0;
      for (let i = 0; i < this.dataArray.length; i++) sum += this.dataArray[i];
      const avg = sum / this.dataArray.length;
      // Normalize and Boost
      this.gateIntensity = Math.min((avg / 40) * 1.5, 1);
    } else {
      // Subtle breathing effect when idle to prove renderer is alive
      const targetIntensity = 0.05 + Math.sin(Date.now() / 1500) * 0.03;
      this.gateIntensity = this.gateIntensity * 0.95 + targetIntensity * 0.05;
    }

    // B. CLEAR
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, w, h);

    this.rotation += 0.005 + (this.gateIntensity * 0.02);

    // C. 3D MATH (Cylinder/Torus)
    const perspective = 400;
    // Radius scales with audio intensity slightly
    const r = (this.radius * 15) + (this.gateIntensity * 10);
    const depth = this.height * 10;

    // Dynamic Color: Amber/Gold Base -> White/Blue Hot
    const hue = this.currentHue + (this.gateIntensity * 20); // Base Hue + Shift
    const lightColor = `hsla(${hue}, 100%, ${50 + (this.gateIntensity * 40)}%, 0.9)`;
    const darkColor = `hsla(${hue}, 100%, 30%, 0.3)`;

    const points: { x: number, y: number, z: number }[] = [];
    const segments = 32;

    // Generate Points
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push({ x: Math.cos(angle) * r, y: -depth / 2, z: Math.sin(angle) * r });
      points.push({ x: Math.cos(angle) * r, y: depth / 2, z: Math.sin(angle) * r });
    }

    const project = (point: { x: number, y: number, z: number }) => {
      // Rotation Matrix Y
      const x1 = point.x * Math.cos(this.rotation) - point.z * Math.sin(this.rotation);
      const z1 = point.x * Math.sin(this.rotation) + point.z * Math.cos(this.rotation);

      // Tilt X
      const tilt = 0.5;
      const y2 = point.y * Math.cos(tilt) - z1 * Math.sin(tilt);
      const z2 = point.y * Math.sin(tilt) + z1 * Math.cos(tilt);

      const scale = perspective / (perspective + z2 + 300);
      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        scale: scale,
        z: z2
      };
    };

    // Draw Wireframe
    this.ctx.lineWidth = 1 + (this.gateIntensity * 2);

    // Verticals
    this.ctx.strokeStyle = darkColor;
    for (let i = 0; i < segments * 2; i += 2) {
      if (i % 8 === 0) {
        const p1 = project(points[i]);
        const p2 = project(points[i + 1]);
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
      }
    }

    // Rings (Top/Bottom)
    this.ctx.strokeStyle = lightColor;
    this.ctx.lineWidth = 2 + (this.gateIntensity * 3);

    [0, 1].forEach(offset => {
      this.ctx.beginPath();
      for (let i = offset; i < segments * 2; i += 2) {
        const p = project(points[i]);
        if (i === offset) this.ctx.moveTo(p.x, p.y);
        else this.ctx.lineTo(p.x, p.y);
      }
      this.ctx.closePath();
      this.ctx.stroke();
    });

    // D. DRAW GATES (Reactive Orbs)
    const gates = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];

    gates.forEach((gateAngle, idx) => {
      const gx = Math.cos(gateAngle) * r;
      const gz = Math.sin(gateAngle) * r;
      const p = project({ x: gx, y: 0, z: gz });

      const pulse = 1 + (this.gateIntensity * 2);

      this.ctx.beginPath();
      this.ctx.fillStyle = lightColor;
      this.ctx.arc(p.x, p.y, 3 * p.scale * pulse, 0, Math.PI * 2);
      this.ctx.fill();

      // Label
      this.ctx.fillStyle = `rgba(255, 200, 100, 0.7)`;
      this.ctx.font = `${10 * p.scale}px monospace`;
      this.ctx.fillText('α', p.x + 10, p.y);
    });
  }
}
