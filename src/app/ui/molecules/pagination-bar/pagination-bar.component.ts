import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-pagination-bar',
  template: `
    @if (totalPages > 1) {
      <nav class="molecule-pagination" [attr.aria-label]="i18n.t('dir.pagination')">
        <button
          type="button"
          class="btn-knect btn-knect-outline"
          [disabled]="currentPage === 0"
          (click)="pageChange.emit(currentPage - 1)"
        >
          <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
          {{ i18n.t('dir.prevPage') }}
        </button>

        <span class="page-indicator" aria-live="polite" aria-atomic="true">
          {{ i18n.t('dir.page') }} {{ currentPage + 1 }} / {{ totalPages }}
        </span>

        <button
          type="button"
          class="btn-knect btn-knect-outline"
          [disabled]="currentPage + 1 >= totalPages"
          (click)="pageChange.emit(currentPage + 1)"
        >
          {{ i18n.t('dir.nextPage') }}
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
      </nav>
    }
  `,
  styles: [
    `
      .molecule-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.25rem;
        margin-top: 2rem;
      }
      .page-indicator {
        font-weight: 700;
        color: var(--knect-primary);
        font-variant-numeric: tabular-nums;
      }
      @media (max-width: 480px) {
        .molecule-pagination {
          gap: 0.65rem;
        }
        .molecule-pagination .btn-knect {
          padding-inline: 0.9rem;
        }
      }
    `,
  ],
})
export class PaginationBarComponent {
  protected readonly i18n = inject(I18nService);
  @Input() currentPage = 0;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();
}
