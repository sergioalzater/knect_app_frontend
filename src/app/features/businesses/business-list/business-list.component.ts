import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KnectDataService } from '../../../core/services/knect-data.service';
import { I18nService } from '../../../core/services/i18n.service';
import { Business, EstablishmentType } from '../../../shared/models';
import { BusinessCardComponent, PaginationBarComponent } from '../../../ui/molecules';

@Component({
  selector: 'app-business-list',
  imports: [FormsModule, RouterLink, BusinessCardComponent, PaginationBarComponent],
  templateUrl: './business-list.component.html',
  styleUrl: './business-list.component.css',
})
export class BusinessListComponent implements OnInit {
  private readonly dataService = inject(KnectDataService);
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly i18n = inject(I18nService);

  protected readonly businesses = signal<Business[]>([]);
  protected readonly categories = signal<EstablishmentType[]>([]);
  protected readonly neighborhoods = signal<string[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly loadError = signal(false);
  protected readonly filtersOpen = signal(false);
  protected readonly skeletons = [1, 2, 3, 4, 5, 6];

  protected searchQuery = '';
  protected selectedNeighborhood = '';
  protected selectedCategoryId: number | null = null;
  protected selectedOperatingMode: 'ALL' | 'DINE_IN' | 'DARK_KITCHEN' = 'ALL';

  protected readonly currentPage = signal(0);
  protected readonly pageSize = 6;
  protected readonly totalElements = signal(0);
  protected readonly totalPages = signal(1);

  ngOnInit(): void {
    this.dataService.getCategories().subscribe((cats) => this.categories.set(cats));
    this.dataService.getNeighborhoods().subscribe((nb) => this.neighborhoods.set(nb));

    this.route.queryParamMap.subscribe((params) => {
      this.searchQuery = params.get('search') || params.get('q') || '';
      this.selectedNeighborhood = params.get('neighborhood') || '';

      const rawCat = params.get('categoryId');
      if (rawCat !== null && rawCat !== '') {
        const cid = Number(rawCat);
        this.selectedCategoryId = isNaN(cid) ? null : cid;
      } else {
        this.selectedCategoryId = null;
      }

      if (params.has('ghostKitchen')) {
        this.selectedOperatingMode =
          params.get('ghostKitchen') === 'true' ? 'DARK_KITCHEN' : 'DINE_IN';
      } else {
        this.selectedOperatingMode = 'ALL';
      }

      this.currentPage.set(0);
      this.loadCatalog();
    });
  }

  protected activeFiltersCount(): number {
    let count = 0;
    if (this.searchQuery.trim()) count++;
    if (this.selectedNeighborhood) count++;
    if (this.selectedCategoryId !== null) count++;
    if (this.selectedOperatingMode !== 'ALL') count++;
    return count;
  }

  onSearchChange(val: string): void {
    this.searchQuery = val;
    this.currentPage.set(0);
    this.loadCatalog();
  }

  onNeighborhoodChange(val: string): void {
    this.selectedNeighborhood = val || '';
    this.currentPage.set(0);
    this.loadCatalog();
  }

  onCategoryChange(val: number | string | null): void {
    if (val === null || val === '' || val === 'null') {
      this.selectedCategoryId = null;
    } else {
      const parsed = Number(val);
      this.selectedCategoryId = isNaN(parsed) ? null : parsed;
    }
    this.currentPage.set(0);
    this.loadCatalog();
  }

  onModeChange(val: 'ALL' | 'DINE_IN' | 'DARK_KITCHEN'): void {
    this.selectedOperatingMode = val || 'ALL';
    this.currentPage.set(0);
    this.loadCatalog();
  }

  loadCatalog(): void {
    this.isLoading.set(true);
    this.loadError.set(false);
    let ghostFilter: boolean | null = null;
    if (this.selectedOperatingMode === 'DARK_KITCHEN') ghostFilter = true;
    if (this.selectedOperatingMode === 'DINE_IN') ghostFilter = false;

    this.dataService
      .getCatalog({
        search: this.searchQuery,
        neighborhood: this.selectedNeighborhood,
        categoryId: this.selectedCategoryId,
        isGhostKitchen: ghostFilter,
        page: this.currentPage(),
        size: this.pageSize,
      })
      .subscribe({
        next: (res) => {
          this.businesses.set(res.content);
          this.totalElements.set(res.totalElements);
          this.totalPages.set(res.totalPages);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.loadError.set(true);
        },
      });
  }

  applyFilters(): void {
    this.currentPage.set(0);
    this.loadCatalog();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedNeighborhood = '';
    this.selectedCategoryId = null;
    this.selectedOperatingMode = 'ALL';
    this.currentPage.set(0);
    this.loadCatalog();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    this.currentPage.set(page);
    this.loadCatalog();
    this.scrollToResults();
  }

  private scrollToResults(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const target = this.document.getElementById('catalog-results');
    target?.scrollIntoView({ block: 'start' });
    target?.focus({ preventScroll: true });
  }
}
