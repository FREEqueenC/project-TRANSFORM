import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VisualService {
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId = 0;
  public gateIntensity = 0;
  private rotation = 0;

  initialize(canvas: ElementRef<HTMLCanvasElement>) {
    this.ctx = canvas.nativeElement.getContext('2d')!;
    this.resizeCanvas(canvas);
  }

  resizeCanvas(canvas: ElementRef<HTMLCanvasElement>) {
    const el = canvas.nativeElement;
    if (el.parentElement) {
      el.width = el.parentElement.clientWidth;
      el.height = el.parentElement.clientHeight;
    }
  }

  startAnimation(
      canvas: ElementRef<HTMLCanvasElement>, 
      getIntensity: () => number, 
      updatePanner: (rot: number) => void, 
      renderParams: () => { radius: number, height: number, isPhaseConjugated: boolean, currentHue: number }
  ) {
    const loop = () => {
      this.renderScene(canvas, getIntensity, updatePanner, renderParams());
      this.animationFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  stopAnimation() {
    cancelAnimationFrame(this.animationFrameId);
  }

  private renderScene(
      canvasRef: ElementRef<HTMLCanvasElement>, 
      getIntensity: () => number, 
      updatePanner: (rot: number) => void, 
      params: { radius: number, height: number, isPhaseConjugated: boolean, currentHue: number }
  ) {
    if (!this.ctx) return;
    const w = canvasRef.nativeElement.width;
    const h = canvasRef.nativeElement.height;
    const cx = w / 2;
    const cy = h / 2;

    const audioIntensity = getIntensity();
    if (audioIntensity > 0) {
      this.gateIntensity = audioIntensity;
      updatePanner(this.rotation);
    } else {
      this.gateIntensity *= 0.95; // Decay
    }

    // Sync CSS variable for Pulsing Typography
    document.documentElement.style.setProperty('--gate-pulse', this.gateIntensity.toFixed(3));

    // B. CLEAR
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; // Softer fading trail for smoother motion
    this.ctx.fillRect(0, 0, w, h);

    this.rotation += 0.012 + (this.gateIntensity * 0.05); // Boosted base rotation and reactivity

    const perspective = 400;
    const r = (params.radius * 16) + (this.gateIntensity * 25); // Increased pulse impact
    const depth = params.height * 10;

    // LUNAR SYNC: Shift to Pure Gold (45-50 hue) when aligned
    const isLunarSync = Math.abs(params.radius - 4.2) < 0.001;
    const baseHue = isLunarSync ? 45 : params.currentHue; 

    const hue = baseHue + (this.gateIntensity * 30); 
    const lightColor = `hsla(${hue}, 100%, ${50 + (this.gateIntensity * 30)}%, 1)`;
    const darkColor = `hsla(${hue}, 100%, 20%, 0.8)`;
      
    const points: any[] = [];
    const segments = 32;

    const project = (point: { x: number, y: number, z: number }) => {
      const x1 = point.x * Math.cos(this.rotation) - point.z * Math.sin(this.rotation);
      const z1 = point.x * Math.sin(this.rotation) + point.z * Math.cos(this.rotation);

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

    if (params.isPhaseConjugated) {
        const PHI = 1.6180339887;
        const vortexSegments = 164; 
        const cycles = 5;
        
        for (let i = 0; i <= vortexSegments; i++) {
            const t = (i / vortexSegments) * Math.PI * 2 * cycles; 
            
            const pulse = this.gateIntensity * 10;
            const vortexR = r * (0.8 + 0.3 * Math.sin(t * PHI));
            
            const x = Math.cos(t) * (vortexR + Math.cos(t * PHI) * (30 + pulse));
            const y = Math.sin(t * PHI) * (depth / 1.5);
            const z = Math.sin(t) * (vortexR + Math.cos(t * PHI) * (30 + pulse));
            
            points.push({ x, y, z });
        }

        this.ctx.strokeStyle = lightColor;
        this.ctx.lineWidth = 1.5 + (this.gateIntensity * 3);
        this.ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
            const p = project(points[i]);
            if (i === 0) this.ctx.moveTo(p.x, p.y);
            else this.ctx.lineTo(p.x, p.y);
        }
        this.ctx.stroke();

        this.ctx.strokeStyle = darkColor;
        this.ctx.lineWidth = 1 + this.gateIntensity;
        this.ctx.beginPath();
        for (let i = 0; i < points.length; i += Math.floor(PHI * 2) + 1) {
             const p = project(points[i]);
             if (i === 0) this.ctx.moveTo(p.x, p.y);
             else this.ctx.lineTo(p.x, p.y);
        }
        this.ctx.stroke();

    } else {
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          points.push({ x: Math.cos(angle) * r, y: -depth / 2, z: Math.sin(angle) * r });
          points.push({ x: Math.cos(angle) * r, y: depth / 2, z: Math.sin(angle) * r });
        }

        this.ctx.lineWidth = 1 + (this.gateIntensity * 2);

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
    }

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
      this.ctx.fillStyle = `rgba(140, 10, 192, 1)`;
      this.ctx.font = `${10 * p.scale}px monospace`;
      this.ctx.fillText('α', p.x + 10, p.y);
    });
  }

  getGateIntensity(): number {
      return this.gateIntensity;
  }
}
