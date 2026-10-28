import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-knect-section-title',
  template: `
    <div class="section-title-atom" [style.textAlign]="align" [style.alignItems]="align === 'center' ? 'center' : 'flex-start'">
      @if (tag) {
        <span class="atom-tag" [style.color]="accentColor || 'var(--knect-accent-hover)'">
          <span class="atom-tag-dot" aria-hidden="true"></span>
          {{ tag }}
        </span>
      }
      <h2 class="unal-section-title" [style.color]="titleColor || 'var(--knect-primary)'">{{ title }}</h2>
      @if (subtitle) {
        <p class="atom-subtitle">{{ subtitle }}</p>
      }
    </div>
  `,
  styles: [
    `
      .section-title-atom {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.45rem;
      }
      .atom-tag {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        background: rgba(0, 163, 255, 0.08);
        border: 1px solid rgba(0, 163, 255, 0.18);
        padding: 0.28rem 0.75rem;
        border-radius: 999px;
      }
      .atom-tag-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--knect-accent);
      }
      .unal-section-title {
        font-size: clamp(1.65rem, 2.8vw, 2.25rem);
        font-weight: 700;
        letter-spacing: -0.035em;
        line-height: 1.15;
        margin: 0;
      }
      .atom-subtitle {
        color: var(--knect-text-muted);
        font-size: 0.96rem;
        line-height: 1.6;
        max-width: 640px;
        margin-top: 0.15rem;
      }
    `,
  ],
})
export class KnectSectionTitleComponent {
  @Input() tag?: string;
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() align: 'left' | 'center' = 'left';
  @Input() accentColor?: string;
  @Input() titleColor?: string;
}
