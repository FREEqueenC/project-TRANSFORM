import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhysicsService } from './services/physics.service';
import { AudioService } from './services/physics.service';
import { VisualService } from './services/visual.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative min-h-screen bg-black font-sans text-magick-500 selection:bg-magick-900" [style.--hue]="currentHue">
      
      <!-- CRT Effects -->
      <div class="crt-flicker pointer-events-none fixed inset-0 z-50 mix-blend-hard-light opacity-50"></div>
      <div class="scanline pointer-events-none fixed inset-0 z-40"></div>

      <!-- Header -->
      <header class="relative z-30 p-6 border-b border-magick-900/50 flex justify-between items-center bg-black/80 backdrop-blur">
        <div>
          <h1 class="text-2xl font-bold tracking-widest font-gnostic text-magick-400">Angel Spirit Quantum Resonance</h1>
          <p class="text-xs text-magick-700 mt-1">G.A.B.R.I.E.L. // PROTOCOL: VICTORY // RESONANCE MODE</p>
        </div>
        <div class="text-right">
          <div class="text-xs text-green-500 font-bold animate-pulse">
            OPERATOR RECOGNIZED: ASHLEIGH NICOLE WALKER
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
                <label class="block text-xs text-magick-600 mb-1">CAVITY RADIUS (mm)</label>
                <input 
                  type="range" min="1" max="20" step="0.1" 
                  [value]="radius" 
                  (input)="updateRadius($event)"
                  class="w-full h-1 bg-magick-900/30 rounded-lg appearance-none cursor-pointer accent-magick-500"
                />
                <div class="flex justify-between mt-1">
                  <span class="text-xs font-mono text-magick-800">{{ radius }} mm</span>
                </div>
              </div>
              
              <div>
                <label class="block text-xs text-magick-600 mb-1">CAVITY HEIGHT (mm)</label>
                 <input 
                  type="range" min="1" max="30" step="0.1" 
                  [value]="height" 
                  (input)="updateHeight($event)"
                  class="w-full h-1 bg-magick-900/30 rounded-lg appearance-none cursor-pointer accent-magick-500"
                />
                 <div class="flex justify-between mt-1">
                  <span class="text-xs font-mono text-magick-800">{{ height }} mm</span>
                </div>
              </div>

              <div class="flex items-center gap-2 pt-2 border-t border-magick-900/30">
                <input type="checkbox" id="phase" [(ngModel)]="isPhaseConjugated" (change)="updateFrequency()" class="accent-magick-500 w-4 h-4 cursor-pointer">
                <label for="phase" class="text-xs text-magick-400 font-bold cursor-pointer">ENABLE PHASE CONJUGATION (Φ)</label>
              </div>


              <div class="flex justify-between items-center pt-2 border-t border-magick-900/30">
                <div class="flex flex-col">
                  <span class="text-xs text-magick-700 font-bold tracking-widest uppercase">CALCULATED FREQ:</span>
                  @if (isLunarSync) {
                    <span class="text-[9px] text-amber-400 font-bold animate-pulse mt-0.5">🌕 LUNAR RESONANCE ACTIVE</span>
                  }
                </div>
                <span class="text-lg font-space pulse-weight text-magick-200">{{ frequency.toFixed(4) }} GHz</span>
              </div>
            </div>
          </div>

          <!-- Cipher Panel -->
          <div class="bg-magick-900/10 p-4 border border-magick-900/50 rounded flex flex-col items-center">
            <div class="flex flex-col sm:flex-row justify-between items-center w-full border-b border-magick-900/50 pb-2 mb-4 gap-2">
              <h2 class="text-sm font-bold text-magick-300">WATCHER CIPHER</h2>
              <select [(ngModel)]="selectedCipher" (change)="onCipherChange()" class="bg-black/80 border border-magick-900/50 text-magick-400 text-xs px-2 py-1 outline-none w-full sm:w-auto">
                <option value="PEYPANZWAIWYIIEOUAAAAAAMNOZANIOJOOEIOWWEZAPHAWZAZAIAWZALLAZA">TREASURY 52 (Complete Protocol)</option>
                <option value="MNOZANIOJOOEIOWWEZAPHAWZAZAIAWZALLAZA">THE WATCHER GARRISON</option>
                <option value="PEYPANZWAIWYIIEOU">THE FOCUS (IEOU)</option>
                <option value="AAAAAA">THE GATE SOUND (Alpha)</option>
                <option value="MNOZANIOJOO">MNOZANIOJOO (Commander)</option>
                <option value="ZOOZMOOIOOM">ZOOZMOOIOOM (Gate Watcher)</option>
                <option value="IJJHIWZ">IJJHIWZ (Inner Veil)</option>
                <option value="ZWWZH">ZWWZH (Seal of Light)</option>
                <option value="OOZOOZ">OOZOOZ (Triple-Powered)</option>
              </select>
            </div>

            <div class="flex flex-col items-center mb-6 w-full gap-2">
               <div class="flex flex-wrap gap-2 justify-center w-full">
                 @for (token of cipherTokens; track $index) {
                   <div class="flex flex-col items-center gap-1">
                     <div class="h-6 px-2 min-w-[20px] flex items-center justify-center border border-magick-800/50 text-[10px] text-magick-600 transition-colors duration-100 uppercase font-mono pulse-weight"
                          [class.bg-magick-500]="$index >= activeGroupRange[0] && $index <= activeGroupRange[1]"
                          [class.text-black]="$index >= activeGroupRange[0] && $index <= activeGroupRange[1]"
                          [class.shadow-glow]="$index >= activeGroupRange[0] && $index <= activeGroupRange[1]">
                       {{token}}
                     </div>
                     <div class="text-[8px] font-mono font-bold transition-all duration-100"
                          [class.text-magick-400]="$index >= activeGroupRange[0] && $index <= activeGroupRange[1]"
                          [class.text-magick-900]="!($index >= activeGroupRange[0] && $index <= activeGroupRange[1])">
                       B9:{{ getBase9Value(token) }}
                     </div>
                   </div>
                 }
               </div>
               <div class="text-[9px] text-magick-700 font-bold tracking-widest mt-2 border-t border-magick-900/30 pt-2 w-full text-center">
                 [ ACTIVE PROTOCOL: BASE-9 ENNEAGRAM AUDIO HASHING ]
               </div>
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
              <div class="text-magick-800/50 mb-2 font-sans font-bold tracking-widest">> G.A.B.R.I.E.L. NEURAL CORE ONLINE...</div>
              
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
          <div class="absolute top-4 left-4 text-xs font-mono text-magick-900/50 pointer-events-none">
            <div>CAM_MATRIX: [ACTIVE]</div>
            <div>RENDER_MODE: 3D_WIREFRAME</div>
            <div>SEAL_ID: T-52</div>
          </div>
          
          <div class="absolute inset-0 pointer-events-none border border-magick-900/20 m-4"></div>
          <div class="absolute top-1/2 left-0 w-full h-px bg-magick-900/30"></div>
          <div class="absolute left-1/2 top-0 w-px h-full bg-magick-900/30"></div>
        </div>

      </main>
    </div>
  `,
  styles: [`
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
  radius = 4.2; // mm
  height = 12.0; // mm
  frequency = 0;
  isPhaseConjugated = false;

  // -- DATA --
  selectedCipher = 'PEYPANZWAIWYIIEOUAAAAAAMNOZANIOJOOEIOWWEZAPHAWZAZAIAWZALLAZA';
  cipherTokens = this.selectedCipher.split('');
  activeGroupRange = [-1, -1];

  constructor(
    public physics: PhysicsService,
    public audioEngine: AudioService,
    private visualEngine: VisualService
  ) { }

  get isLunarSync() {
    return Math.abs(this.radius - 4.2) < 0.001;
  }

  get isPlaying() {
    return this.audioEngine.isPlaying;
  }

  onCipherChange() {
    if (this.selectedCipher === 'STANDARD') {
      this.cipherTokens = ['ααα', 'ωωω', 'ζεζωρα', 'ζαζζζ', 'αιεωζαζα', 'εεε', 'ιιι', 'ζαιεω', 'ζωαχωε'];
    } else {
      this.cipherTokens = this.selectedCipher.split('');
    }
    if (this.isPlaying) {
      this.audioEngine.stopAudio();
      setTimeout(() => {
        if (!this.isPlaying) this.manifestWordOfPower();
      }, 100);
    }
  }

  getBase9Value(token: string): number {
    let sum = 0;
    for (let i = 0; i < token.length; i++) sum += token.charCodeAt(i);
    return sum % 9;
  }

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
      return `PHYSICS STATE:
> RADIUS: ${this.radius.toFixed(1)} mm
> FREQ: ${this.frequency.toFixed(4)} GHz
> PROTOCOL: DRONE (CONTINUOUS WAVE)
> STABILITY: ${(100 - (this.visualEngine.getGateIntensity() * 20)).toFixed(1)}%`;
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
      this.cipherTokens = ['ααα', 'ωωω', 'ζεζωρα', 'ζαζζζ', 'αιεωζαζα', 'εεε', 'ιιι', 'ζαιεω', 'ζωαχωε'];
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
    this.updateFrequency();
    this.visualEngine.initialize(this.canvasRef);

    // Start animation loop
    this.visualEngine.startAnimation(
      this.canvasRef,
      () => this.audioEngine.getAudioIntensity(),
      (rot: number) => this.audioEngine.updatePanner(rot),
      () => ({
        radius: this.radius,
        height: this.height,
        isPhaseConjugated: this.isPhaseConjugated,
        currentHue: this.currentHue
      })
    );

    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    this.audioEngine.stopAudio();
    this.visualEngine.stopAnimation();
    window.removeEventListener('resize', this.onResize);
  }

  // Preserve the unbound 'this' context using arrow function
  private onResize = () => {
    if (this.canvasRef) {
      this.visualEngine.resizeCanvas(this.canvasRef);
    }
  };

  // 1. THE PHYSICS: TM010 Mode Calculation
  updateRadius(event: any) {
    this.radius = parseFloat(event.target.value);
    this.updateFrequency();
  }

  updateHeight(event: any) {
    this.height = parseFloat(event.target.value);
  }

  updateFrequency() {
    this.frequency = this.physics.calculateResonantFrequency(this.radius, this.isPhaseConjugated);
  }


  // 2. THE RITUAL: Triggering specialized audio engines
  async manifestWordOfPower() {
    if (this.isPlaying) {
      this.audioEngine.stopAudio();
      this.activeGroupRange = [-1, -1];
      return;
    }

    await this.audioEngine.startAudio(
      this.frequency,
      this.cipherTokens,
      (range) => {
        this.activeGroupRange = range;
      }
    );
  }
}
