import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { KnectDataService } from '../../core/services/knect-data.service';
import { I18nService } from '../../core/services/i18n.service';
import { Business, BlogPost, HomeCms, EstablishmentType } from '../../shared/models';
import { KnectSectionTitleComponent } from '../../ui/atoms';
import { BusinessCardComponent, NewsCardComponent } from '../../ui/molecules';
import { ContactFormSectionComponent } from '../../ui/organisms';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    RouterLink,
    KnectSectionTitleComponent,
    BusinessCardComponent,
    NewsCardComponent,
    ContactFormSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly dataService = inject(KnectDataService);
  private readonly router = inject(Router);
  protected readonly i18n = inject(I18nService);

  protected readonly cms = signal<HomeCms | null>(null);
  protected readonly featuredBusinesses = signal<Business[]>([]);
  protected readonly latestPosts = signal<BlogPost[]>([]);
  protected readonly categories = signal<EstablishmentType[]>([]);
  protected readonly neighborhoods = signal<string[]>([]);
  protected readonly featuredLoading = signal(true);
  protected readonly skeletons = [1, 2, 3];

  protected quickSearch = '';
  protected quickNeighborhood = '';

  ngOnInit(): void {
    this.dataService.getHomeCms().subscribe((data) => this.cms.set(data));
    this.dataService.getFeaturedBusinesses().subscribe({
      next: (list) => {
        this.featuredBusinesses.set(list);
        this.featuredLoading.set(false);
      },
      error: () => this.featuredLoading.set(false),
    });
    this.dataService.getBlogPosts().subscribe((posts) => this.latestPosts.set(posts.slice(0, 3)));
    this.dataService.getCategories().subscribe((cats) => this.categories.set(cats));
    this.dataService.getNeighborhoods().subscribe((nb) => this.neighborhoods.set(nb));
  }

  onQuickSearch(): void {
    const queryParams: Record<string, string> = {};
    if (this.quickSearch.trim()) queryParams['search'] = this.quickSearch.trim();
    if (this.quickNeighborhood) queryParams['neighborhood'] = this.quickNeighborhood;
    this.router.navigate(['/businesses'], { queryParams });
  }

  filterByCategory(categoryId: number): void {
    this.router.navigate(['/businesses'], { queryParams: { categoryId } });
  }
}
