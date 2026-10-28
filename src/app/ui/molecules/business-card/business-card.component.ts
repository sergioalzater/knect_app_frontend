import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Business } from '../../../shared/models';
import { I18nService } from '../../../core/services/i18n.service';
import { KnectRatingStarsComponent } from '../../atoms';

@Component({
  selector: 'app-business-card',
  imports: [RouterLink, KnectRatingStarsComponent],
  template: `
    <article class="modern-business-card">
      <div class="card-media-wrapper">
        <img
          [src]="business.bannerUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'"
          alt=""
          class="card-cover-img"
          loading="lazy"
          decoding="async"
        />
        <div class="card-media-overlay" aria-hidden="true"></div>

        <div class="badges-floating">
          <span class="category-tag">
            {{ i18n.lang() === 'es' ? business.category : (business.categoryEn || business.category) }}
          </span>
          @if (business.isGhostKitchen) {
            <span class="badge-dark-kitchen">
              <i class="fa-solid fa-fire-burner" aria-hidden="true"></i>
              {{ i18n.t('card.darkKitchen') }}
            </span>
          } @else if (business.hasDineIn) {
            <span class="badge-dine-in">
              <i class="fa-solid fa-utensils" aria-hidden="true"></i>
              {{ i18n.t('card.dineIn') }}
            </span>
          }
        </div>

        <div class="logo-floating">
          <img
            [src]="business.logoUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80'"
            alt=""
            class="card-avatar"
            width="46"
            height="46"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div class="card-content">
        <div class="card-header-row">
          <div class="card-title-group">
            <h3 class="card-title">
              <a [routerLink]="['/businesses', business.id]" class="card-link">{{ business.name }}</a>
            </h3>
            <span class="card-neighborhood">
              <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
              {{ business.neighborhood }}
            </span>
          </div>
          <div class="card-rating">
            <app-knect-rating-stars [rating]="business.ratingAvg || 5" [showScore]="true" />
          </div>
        </div>

        <p class="card-desc">
          {{ i18n.lang() === 'es' ? business.description : (business.descriptionEn || business.description) }}
        </p>

        <div class="card-footer-info">
          <span class="branches-count">
            <i class="fa-solid fa-store" aria-hidden="true"></i>
            {{ business.establishments?.length || 1 }}
            {{ (business.establishments?.length || 1) === 1 ? i18n.t('card.branchSingle') : i18n.t('card.branchMany') }}
          </span>
          @if (business.whatsapp) {
            <span class="status-online">
              <span class="online-dot" aria-hidden="true"></span>
              {{ i18n.t('card.whatsappActive') }}
            </span>
          }
        </div>

        <div class="card-actions">
          <span class="btn-knect btn-knect-outline btn-sm btn-full card-cta" aria-hidden="true">
            {{ i18n.t('card.viewProfile') }} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.72rem"></i>
          </span>
          @if (business.whatsapp) {
            <a
              [href]="'https://wa.me/' + business.whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-knect btn-knect-whatsapp btn-sm card-whatsapp"
              (click)="onWhatsappClick()"
              [attr.aria-label]="i18n.t('card.whatsappTitle') + ' – ' + business.name"
              [title]="i18n.t('card.whatsappTitle')"
            >
              <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
              {{ i18n.t('card.whatsappBtn') }}
            </a>
          }
        </div>
      </div>
    </article>
  `,
  styles: [
    `
      .modern-business-card {
        background: var(--knect-bg-main);
        border: 1px solid var(--knect-border);
        border-radius: 20px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition:
          transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
          box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1),
          border-color 0.25s ease;
        box-shadow: var(--knect-shadow-sm);
        height: 100%;
        position: relative;
      }

      .modern-business-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--knect-shadow-lg);
        border-color: rgba(0, 163, 255, 0.38);
      }

      .modern-business-card:has(.card-link:focus-visible) {
        outline: 2px solid var(--knect-accent);
        outline-offset: 2px;
      }

      .card-media-wrapper {
        position: relative;
        aspect-ratio: 16 / 10;
        overflow: hidden;
        background: var(--knect-bg-card);
      }

      .card-cover-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .modern-business-card:hover .card-cover-img {
        transform: scale(1.04);
      }

      .card-media-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(16, 38, 66, 0.04) 0%, rgba(16, 38, 66, 0.55) 100%);
      }

      .badges-floating {
        position: absolute;
        top: 0.85rem;
        left: 0.85rem;
        right: 0.85rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 2;
        gap: 0.5rem;
      }

      .category-tag {
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(12px);
        color: var(--knect-primary);
        font-size: 0.73rem;
        font-weight: 600;
        padding: 0.28rem 0.75rem;
        border-radius: 999px;
        letter-spacing: -0.01em;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .badge-dark-kitchen,
      .badge-dine-in {
        backdrop-filter: blur(12px);
        color: #FFFFFF;
        font-size: 0.72rem;
        font-weight: 600;
        padding: 0.28rem 0.7rem;
        border-radius: 999px;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }

      .badge-dark-kitchen {
        background: rgba(26, 54, 93, 0.88);
      }

      .badge-dark-kitchen i {
        color: var(--knect-accent);
      }

      .badge-dine-in {
        background: rgba(0, 163, 255, 0.9);
      }

      .logo-floating {
        position: absolute;
        bottom: 0.85rem;
        left: 1.15rem;
        z-index: 2;
      }

      .card-avatar {
        width: 46px;
        height: 46px;
        border-radius: 12px;
        object-fit: cover;
        background: #FFFFFF;
        padding: 2px;
        border: 1.5px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 4px 12px rgba(16, 38, 66, 0.18);
      }

      .card-content {
        padding: 1.35rem;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }

      .card-header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 0.75rem;
        margin-bottom: 0.6rem;
      }

      .card-title-group {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        min-width: 0;
      }

      .card-title {
        font-size: 1.12rem;
        font-weight: 700;
        letter-spacing: -0.025em;
        line-height: 1.25;
      }

      .card-title a {
        color: var(--knect-primary);
      }

      .card-title a:hover {
        color: var(--knect-accent);
      }

      .card-link::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 1;
      }

      .card-link:focus-visible {
        outline: none;
      }

      .card-neighborhood {
        font-size: 0.8rem;
        color: var(--knect-text-muted);
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }

      .card-neighborhood i {
        color: var(--knect-accent);
        font-size: 0.75rem;
      }

      .card-desc {
        font-size: 0.875rem;
        color: var(--knect-text-muted);
        line-height: 1.55;
        margin-bottom: 1.1rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        flex-grow: 1;
      }

      .card-footer-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
        padding: 0.7rem 0;
        border-top: 1px solid var(--knect-border);
        margin-bottom: 0.9rem;
        font-size: 0.76rem;
        font-weight: 600;
      }

      .branches-count {
        color: var(--knect-primary);
        background: var(--knect-bg-card);
        padding: 0.25rem 0.65rem;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }

      .branches-count i {
        color: var(--knect-accent);
      }

      .status-online {
        color: var(--knect-text-muted);
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
      }

      .online-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--knect-success);
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.16);
      }

      .card-actions {
        display: flex;
        gap: 0.5rem;
      }

      .card-cta {
        flex: 1;
        pointer-events: none;
      }

      .modern-business-card:hover .card-cta {
        border-color: var(--knect-primary);
        color: #FFFFFF;
        background: var(--knect-primary);
      }

      .card-whatsapp {
        position: relative;
        z-index: 2;
      }
    `,
  ],
})
export class BusinessCardComponent {
  protected readonly i18n = inject(I18nService);
  @Input({ required: true }) business!: Business;
  @Input() showReviewCount = true;
  @Output() whatsappClick = new EventEmitter<number>();

  onWhatsappClick(): void {
    this.whatsappClick.emit(this.business.id);
  }
}
