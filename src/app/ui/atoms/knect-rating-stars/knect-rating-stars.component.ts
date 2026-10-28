import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-knect-rating-stars',
  template: `
    @if (interactive) {
      <div class="stars-container interactive" role="group" [attr.aria-label]="i18n.t('biz.starRatingLabel')">
        @for (s of stars; track s) {
          <button
            type="button"
            class="star-atom"
            [style.color]="s <= Math.round(rating) ? activeColor : inactiveColor"
            [style.fontSize]="size"
            [attr.aria-pressed]="s === Math.round(rating)"
            [attr.aria-label]="s + ' ' + (s === 1 ? i18n.t('card.starSingle') : i18n.t('card.starMany'))"
            (click)="onSelect(s)"
          >
            <i class="fa-solid fa-star" aria-hidden="true"></i>
          </button>
        }
        @if (showScore) {
          <span class="score-label" aria-live="polite">{{ rating.toFixed(1) }}</span>
        }
      </div>
    } @else {
      <div class="stars-container" role="img" [attr.aria-label]="rating.toFixed(1) + ' ' + i18n.t('card.ratingOf')">
        @for (s of stars; track s) {
          <i
            class="fa-solid fa-star star-atom"
            aria-hidden="true"
            [style.color]="s <= Math.round(rating) ? activeColor : inactiveColor"
            [style.fontSize]="size"
          ></i>
        }
        @if (showScore) {
          <span class="score-label" aria-hidden="true">{{ rating.toFixed(1) }}</span>
        }
      </div>
    }
  `,
  styles: [
    `
      .stars-container {
        display: inline-flex;
        align-items: center;
        gap: 0.2rem;
      }
      .star-atom {
        background: transparent;
        border: none;
        padding: 0;
        line-height: 1;
        cursor: default;
      }
      .stars-container.interactive {
        gap: 0.1rem;
      }
      .stars-container.interactive .star-atom {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: var(--touch-target, 44px);
        min-height: var(--touch-target, 44px);
        cursor: pointer;
        border-radius: 8px;
        transition: transform 0.15s ease;
      }
      .stars-container.interactive .star-atom:hover {
        transform: scale(1.18);
      }
      .stars-container.interactive .star-atom:active {
        transform: scale(0.95);
      }
      .score-label {
        font-weight: 800;
        font-size: 0.9rem;
        margin-left: 0.35rem;
        color: var(--knect-primary);
        font-variant-numeric: tabular-nums;
      }
    `,
  ],
})
export class KnectRatingStarsComponent {
  protected readonly Math = Math;
  protected readonly i18n = inject(I18nService);
  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly inactiveColor = '#CBD5E1';
  @Input() rating = 5;
  @Input() interactive = false;
  @Input() showScore = false;
  @Input() size = '1rem';
  @Input() activeColor = '#F59E0B';
  @Output() ratingChange = new EventEmitter<number>();

  onSelect(value: number): void {
    if (!this.interactive) return;
    this.rating = value;
    this.ratingChange.emit(value);
  }
}
