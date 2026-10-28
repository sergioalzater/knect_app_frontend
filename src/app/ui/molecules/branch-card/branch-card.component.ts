import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { EstablishmentBranch } from '../../../shared/models';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-branch-card',
  template: `
    <article
      class="knect-card-white molecule-branch-card"
      [class.selected-branch]="isSelected"
      (click)="branchSelected.emit(branch)"
    >
      <div class="branch-header">
        <div>
          <span class="branch-neighborhood">
            <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
            {{ branch.neighborhood }}
          </span>
          <h3>
            <button
              type="button"
              class="branch-select"
              [attr.aria-pressed]="isSelected"
              (click)="$event.stopPropagation(); branchSelected.emit(branch)"
            >
              {{ branch.name }}
            </button>
          </h3>
        </div>
        @if (isSelected) {
          <span class="badge-active-pin">
            <span class="pin-dot" aria-hidden="true"></span>
            {{ i18n.t('biz.selectedBranch') }}
          </span>
        }
      </div>

      <p class="branch-info">
        <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>
        <span>{{ branch.address }}</span>
      </p>
      @if (branch.schedules) {
        <p class="branch-info">
          <i class="fa-regular fa-clock" aria-hidden="true"></i>
          <span>{{ branch.schedules }}</span>
        </p>
      }
      @if (branch.description) {
        <p class="branch-info">{{ branch.description }}</p>
      }

      <div class="branch-footer">
        @if (branch.phone || branch.whatsapp) {
          <a
            class="branch-phone"
            [href]="'tel:' + (branch.phone || branch.whatsapp)"
            (click)="$event.stopPropagation()"
          >
            <i class="fa-solid fa-phone" aria-hidden="true"></i>
            {{ branch.phone || branch.whatsapp }}
          </a>
        }
        <button
          type="button"
          class="btn-knect btn-knect-whatsapp btn-sm"
          [attr.aria-label]="i18n.t('card.whatsappTitle') + ' – ' + branch.name"
          (click)="$event.stopPropagation(); whatsappClicked.emit(branch)"
        >
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
          {{ i18n.t('card.whatsappBtn') }}
        </button>
      </div>
    </article>
  `,
  styles: [
    `
      .molecule-branch-card {
        padding: 1.35rem;
        cursor: pointer;
        border: 1px solid var(--knect-border);
        border-radius: 18px;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .molecule-branch-card:hover {
        transform: translateY(-2px);
        border-color: rgba(0, 163, 255, 0.45);
        box-shadow: var(--knect-shadow-md);
      }
      .molecule-branch-card.selected-branch {
        background-color: var(--knect-bg-card);
        border-color: var(--knect-accent);
        box-shadow: var(--knect-shadow-md);
      }
      .molecule-branch-card:has(.branch-select:focus-visible) {
        outline: 2px solid var(--knect-accent);
        outline-offset: 2px;
      }
      .branch-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
      }
      .branch-neighborhood {
        font-size: 0.74rem;
        font-weight: 600;
        color: var(--knect-accent);
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }
      .branch-header h3 {
        font-size: 1.05rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--knect-primary);
      }
      .branch-select {
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        color: inherit;
        text-align: left;
        cursor: pointer;
      }
      .branch-select:focus-visible {
        outline: none;
      }
      .badge-active-pin {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: rgba(0, 163, 255, 0.1);
        color: var(--knect-primary);
        font-size: 0.72rem;
        font-weight: 600;
        padding: 0.25rem 0.65rem;
        border-radius: 999px;
        white-space: nowrap;
      }
      .pin-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--knect-accent);
      }
      .branch-info {
        font-size: 0.86rem;
        color: var(--knect-text-muted);
        margin-bottom: 0.35rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .branch-info i {
        color: var(--knect-accent);
        width: 16px;
        text-align: center;
      }
      .branch-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.85rem;
        padding-top: 0.75rem;
        border-top: 1px solid var(--knect-border);
      }
      .branch-phone {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        min-height: 40px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--knect-primary);
      }
      .branch-phone i {
        color: var(--knect-accent);
      }
      .branch-phone:hover {
        color: var(--knect-accent);
      }
    `,
  ],
})
export class BranchCardComponent {
  protected readonly i18n = inject(I18nService);
  @Input({ required: true }) branch!: EstablishmentBranch;
  @Input() isSelected = false;
  @Input() brandColor = '#00A3FF';
  @Output() branchSelected = new EventEmitter<EstablishmentBranch>();
  @Output() whatsappClicked = new EventEmitter<EstablishmentBranch>();
}
