import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-knect-button',
  template: `
    <button
      [type]="type"
      class="btn-knect"
      [class.btn-knect-primary]="variant === 'primary'"
      [class.btn-knect-accent]="variant === 'accent'"
      [class.btn-knect-outline]="variant === 'outline'"
      [class.btn-knect-whatsapp]="variant === 'whatsapp'"
      [class.btn-danger]="variant === 'danger'"
      [class.btn-sm]="size === 'sm'"
      [class.btn-lg]="size === 'lg'"
      [class.btn-full]="fullWidth"
      [style.backgroundColor]="customColor || null"
      [style.borderColor]="customColor || null"
      [disabled]="disabled"
      (click)="clicked.emit($event)"
    >
      <ng-content />
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      :host(.w-full) {
        display: block;
        width: 100%;
      }
      .btn-full {
        width: 100%;
      }
      .btn-sm {
        padding: 0.42rem 0.85rem;
        font-size: 0.82rem;
      }
      .btn-lg {
        padding: 0.85rem 1.5rem;
        font-size: 1rem;
      }
      .btn-danger {
        background-color: var(--knect-error);
        color: #ffffff;
      }
    `,
  ],
})
export class KnectButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'accent' | 'outline' | 'whatsapp' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() customColor?: string;
  @Input() fullWidth = false;
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<MouseEvent>();
}
