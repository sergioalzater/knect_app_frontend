import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-stat-card',
  template: `
    <article class="knect-card-white molecule-kpi-card" [style.--kpi-accent]="valueColor || 'var(--knect-accent)'">
      <div class="kpi-top">
        <span class="kpi-label">
          @if (icon) {
            <span class="kpi-icon-box" aria-hidden="true">
              <i [class]="icon"></i>
            </span>
          }
          {{ label }}
        </span>
        @if (delta) {
          <span
            class="kpi-delta"
            [class.delta-up]="deltaType === 'up'"
            [class.delta-down]="deltaType === 'down'"
            [attr.aria-label]="deltaAriaLabel || delta"
          >
            <i
              class="fa-solid"
              [class.fa-arrow-trend-up]="deltaType === 'up'"
              [class.fa-arrow-trend-down]="deltaType === 'down'"
              [class.fa-minus]="deltaType === 'neutral'"
              aria-hidden="true"
            ></i>
            {{ delta }}
          </span>
        }
      </div>

      <strong class="kpi-value tabular-nums" [style.color]="valueColor || 'var(--knect-primary)'">
        {{ value }}
      </strong>

      <div class="kpi-bottom">
        @if (subtitle) {
          <small class="kpi-sub">{{ subtitle }}</small>
        }
        @if (sparklinePoints) {
          <svg class="kpi-sparkline" viewBox="0 0 80 24" aria-hidden="true" focusable="false">
            <polyline
              fill="none"
              [attr.stroke]="valueColor || 'var(--knect-accent)'"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.points]="sparklinePoints"
            />
          </svg>
        }
      </div>
    </article>
  `,
  styles: [
    `
      .molecule-kpi-card {
        padding: 1.35rem 1.45rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 0.55rem;
        border: 1px solid var(--knect-border);
        border-radius: 18px;
        height: 100%;
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
      }
      .molecule-kpi-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--knect-shadow-md);
        border-color: rgba(0, 163, 255, 0.3);
      }
      .kpi-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
      }
      .kpi-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--knect-text-muted);
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      .kpi-icon-box {
        width: 30px;
        height: 30px;
        border-radius: 9px;
        background: var(--knect-bg-card);
        color: var(--knect-accent);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.82rem;
      }
      .kpi-delta {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.73rem;
        font-weight: 600;
        padding: 0.2rem 0.6rem;
        border-radius: 999px;
        background: var(--knect-bg-card);
        color: var(--knect-primary);
        font-variant-numeric: tabular-nums;
      }
      .kpi-delta.delta-up {
        background: rgba(16, 185, 129, 0.1);
        color: #065f46;
      }
      .kpi-delta.delta-down {
        background: rgba(239, 68, 68, 0.1);
        color: #991b1b;
      }
      .kpi-value {
        font-size: clamp(1.65rem, 2.3vw, 2rem);
        font-weight: 700;
        line-height: 1.15;
        letter-spacing: -0.035em;
      }
      .kpi-bottom {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 0.5rem;
        margin-top: 0.1rem;
      }
      .kpi-sub {
        font-size: 0.8rem;
        color: var(--knect-text-muted);
        font-weight: 500;
      }
      .kpi-sparkline {
        width: 68px;
        height: 20px;
        flex-shrink: 0;
        opacity: 0.85;
      }
    `,
  ],
})
export class KpiStatCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() valueColor?: string;
  @Input() delta?: string;
  @Input() deltaType: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() deltaAriaLabel?: string;
  @Input() sparklinePoints?: string;
}
