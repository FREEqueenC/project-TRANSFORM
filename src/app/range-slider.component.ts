import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-range-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <label class="block text-xs text-magick-600 mb-1">{{ label }}</label>
      <input
        type="range"
        [min]="min"
        [max]="max"
        [step]="step"
        [value]="value"
        (input)="onInput($event)"
        class="w-full h-1 bg-magick-900/30 rounded-lg appearance-none cursor-pointer accent-magick-500"
      />
      <div class="flex justify-between mt-1">
        <span class="text-xs text-magick-800">{{ value }} {{ unit }}</span>
      </div>
    </div>
  `
})
export class RangeSliderComponent {
  @Input() label: string = '';
  @Input() min: number | string = 0;
  @Input() max: number | string = 100;
  @Input() step: number | string = 1;
  @Input() value: number = 0;
  @Input() unit: string = '';

  @Output() valueChange = new EventEmitter<number>();

  onInput(event: Event) {
    const newValue = parseFloat((event.target as HTMLInputElement).value);
    this.valueChange.emit(newValue);
  }
}
