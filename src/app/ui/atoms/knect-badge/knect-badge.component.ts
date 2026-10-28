import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-knect-badge',
  template: `
    <span
      class="badge"
      [class.badge-accent]="variant === 'accent'"
      [class.badge-success]="variant === 'success'"
      [class.badge-warning]="variant === 'warning'"
      [class.badge-error]="variant === 'error'"
      [class.badge-primary]="variant === 'primary'"
      [class.badge-solid]="variant === 'solid'"
      [style.backgroundColor]="customBg || null"
      [style.color]="customColor || null"
    >
      <ng-content />
    </span>
  `,
  styles: [
    `
      .badge-solid {
        background-color: var(--knect-accent);
        color: #ffffff;
      }
    `,
  ],
})
export class KnectBadgeComponent {
  @Input() variant: 'accent' | 'success' | 'warning' | 'error' | 'primary' | 'solid' = 'accent';
  @Input() customBg?: string;
  @Input() customColor?: string;
}
