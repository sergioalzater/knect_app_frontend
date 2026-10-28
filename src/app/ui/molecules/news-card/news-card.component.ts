import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogPost } from '../../../shared/models';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-news-card',
  imports: [RouterLink, DatePipe],
  template: `
    <article class="unal-note-card molecule-news-card">
      <div class="news-image-wrap">
        <img
          [src]="
            post.imageUrl ||
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80'
          "
          [alt]="i18n.lang() === 'es' ? post.title : (post.titleEn || post.title)"
          class="news-image"
          loading="lazy"
        />
      </div>
      <div class="news-content">
        <div class="news-meta-row">
          <span class="note-type-tag">
            {{ post.authorName || (i18n.lang() === 'es' ? 'Nota Editorial' : 'Editorial Note') }}
          </span>
          <time class="note-date" [attr.datetime]="post.publishedAt">
            {{ post.publishedAt | date: 'mediumDate' }}
          </time>
        </div>
        <h3>
          <a [routerLink]="['/blog', post.slug]" class="news-card-link">
            {{ i18n.lang() === 'es' ? post.title : (post.titleEn || post.title) }}
          </a>
        </h3>
        <p>{{ i18n.lang() === 'es' ? post.summary : (post.summaryEn || post.summary) }}</p>
        <span class="news-link" aria-hidden="true">
          {{ i18n.t('home.readMore') }} <i class="fa-solid fa-arrow-right"></i>
        </span>
      </div>
    </article>
  `,
  styles: [
    `
      .unal-note-card {
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 360px;
        background: var(--knect-bg-main);
        border-radius: 20px;
        border: 1px solid var(--knect-border);
        box-shadow: var(--knect-shadow-sm);
        transition:
          transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
          border-color 0.25s ease,
          box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .unal-note-card:hover {
        border-color: rgba(0, 163, 255, 0.38);
        transform: translateY(-4px);
        box-shadow: var(--knect-shadow-lg);
      }
      .news-image-wrap {
        width: 100%;
        height: 200px;
        overflow: hidden;
        background: var(--knect-bg-card);
        flex-shrink: 0;
      }
      .news-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .unal-note-card:hover .news-image {
        transform: scale(1.04);
      }
      .news-content {
        padding: 1.35rem;
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
      }
      .news-meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.76rem;
      }
      .note-type-tag {
        font-weight: 600;
        color: var(--knect-accent-hover);
        background: rgba(0, 163, 255, 0.08);
        padding: 0.2rem 0.65rem;
        border-radius: 999px;
      }
      .note-date {
        color: var(--knect-text-muted);
        font-size: 0.75rem;
        font-weight: 500;
      }
      .news-content h3 {
        font-size: 1.1rem;
        font-weight: 700;
        letter-spacing: -0.025em;
        color: var(--knect-primary);
        line-height: 1.32;
        margin: 0.1rem 0;
      }
      .news-card-link {
        color: inherit;
        text-decoration: none;
      }
      .news-card-link::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 1;
      }
      .news-card-link:focus-visible {
        outline: none;
      }
      .unal-note-card:has(.news-card-link:focus-visible) {
        outline: 2px solid var(--knect-accent);
        outline-offset: 2px;
      }
      .news-content p {
        font-size: 0.875rem;
        color: var(--knect-text-muted);
        line-height: 1.55;
        flex: 1;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin: 0;
      }
      .news-link {
        font-weight: 600;
        font-size: 0.84rem;
        color: var(--knect-primary);
        margin-top: 0.45rem;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        transition: transform 0.2s ease, color 0.2s ease;
      }
      .unal-note-card:hover .news-link {
        transform: translateX(4px);
        color: var(--knect-accent);
      }
    `,
  ],
})
export class NewsCardComponent {
  protected readonly i18n = inject(I18nService);
  @Input({ required: true }) post!: BlogPost;
}
