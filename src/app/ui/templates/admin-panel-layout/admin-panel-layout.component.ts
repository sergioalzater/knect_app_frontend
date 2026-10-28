import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-panel-layout',
  template: `
    <section class="template-admin-header" [style.--panel-accent]="accentColor">
      <div class="knect-container header-inner">
        <div class="header-copy">
          @if (badgeText) {
            <span class="admin-badge">
              <span class="admin-badge-dot" aria-hidden="true"></span>
              {{ badgeText }}
            </span>
          }
          <h1>{{ title }}</h1>
          @if (subtitle) {
            <p>{{ subtitle }}</p>
          }
        </div>
        <div class="header-actions">
          <ng-content select="[panelActions]" />
        </div>
      </div>
    </section>

    <section class="template-admin-body">
      <div class="knect-container">
        <ng-content />
      </div>
    </section>
  `,
  styles: [
    `
      .template-admin-header {
        background:
          radial-gradient(circle at 85% 0%, rgba(0, 112, 214, 0.28) 0%, rgba(0, 112, 214, 0) 55%),
          linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
        color: #ffffff;
        padding: 2.25rem 0;
        border-bottom: 4px solid var(--panel-accent, var(--knect-accent));
      }
      .header-inner {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 1.25rem;
      }
      .header-copy {
        max-width: 720px;
      }
      .admin-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.3rem 0.85rem;
        border-radius: var(--knect-radius-full);
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.24);
        color: #ffffff;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.02em;
      }
      .admin-badge-dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background: var(--panel-accent, #38bdf8);
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.45);
      }
      h1 {
        font-size: clamp(1.65rem, 3vw, 2.15rem);
        font-weight: 800;
        color: #ffffff;
        margin: 0.6rem 0 0.3rem;
        letter-spacing: -0.03em;
      }
      p {
        color: rgba(255, 255, 255, 0.88);
        font-size: 0.98rem;
        line-height: 1.5;
      }
      .header-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
      }
      .template-admin-body {
        padding: 2rem 0 4.5rem;
      }
    `,
  ],
})
export class AdminPanelLayoutComponent {
  @Input() badgeText?: string;
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() accentColor = '#0070D6';
}
