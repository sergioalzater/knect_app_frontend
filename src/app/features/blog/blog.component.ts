import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { KnectDataService } from '../../core/services/knect-data.service';
import { I18nService } from '../../core/services/i18n.service';
import { BlogPost } from '../../shared/models';
import { NewsCardComponent, PaginationBarComponent } from '../../ui/molecules';

@Component({
  selector: 'app-blog',
  imports: [RouterLink, DatePipe, NewsCardComponent, PaginationBarComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
export class BlogComponent implements OnInit {
  private readonly dataService = inject(KnectDataService);
  private readonly route = inject(ActivatedRoute);
  protected readonly i18n = inject(I18nService);

  protected readonly posts = signal<BlogPost[]>([]);
  protected readonly selectedPost = signal<BlogPost | null>(null);
  protected readonly isLoading = signal(true);

  protected readonly currentPage = signal(0);
  protected readonly pageSize = 4;

  protected readonly pagedPosts = computed(() => {
    const start = this.currentPage() * this.pageSize;
    return this.posts().slice(start, start + this.pageSize);
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.posts().length / this.pageSize)),
  );

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.loadSinglePost(slug);
      } else {
        this.selectedPost.set(null);
        this.loadAllPosts();
      }
    });
  }

  private loadAllPosts(): void {
    this.isLoading.set(true);
    this.dataService.getBlogPosts().subscribe({
      next: (data) => {
        this.posts.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  private loadSinglePost(slug: string): void {
    this.isLoading.set(true);
    this.dataService.getBlogPostDetail(slug).subscribe({
      next: (post) => {
        this.selectedPost.set(post);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  paragraphs(text?: string): string[] {
    if (!text) return [];
    return text.split('\n\n').filter((p) => p.trim().length > 0);
  }
}
