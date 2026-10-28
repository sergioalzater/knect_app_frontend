import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { KnectDataService } from '../../core/services/knect-data.service';
import { AuthService } from '../../core/services/auth.service';
import {
  Business,
  EstablishmentType,
  BlogPost,
  HomeCms,
  GlobalAnalytics,
  BusinessAnalytics,
  User,
} from '../../shared/models';
import { KpiStatCardComponent } from '../../ui/molecules';

@Component({
  selector: 'app-super-admin',
  imports: [FormsModule, DatePipe, KeyValuePipe, RouterLink, KpiStatCardComponent],
  templateUrl: './super-admin.component.html',
  styleUrl: './super-admin.component.css',
})
export class SuperAdminComponent implements OnInit {
  private readonly dataService = inject(KnectDataService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly activeTab = signal<'ANALYTICS' | 'DIRECTORY' | 'CMS_HOME' | 'CMS_NEWS'>('ANALYTICS');
  protected readonly analytics = signal<GlobalAnalytics | null>(null);
  protected readonly businesses = signal<Business[]>([]);
  protected readonly allBusinessesList = signal<Business[]>([]);
  protected readonly categories = signal<EstablishmentType[]>([]);
  protected readonly users = signal<User[]>([]);
  protected readonly posts = signal<BlogPost[]>([]);
  protected readonly feedbackMsg = signal('');
  protected readonly confirmDeleteBusiness = signal<Business | null>(null);
  protected readonly confirmDeletePost = signal<BlogPost | null>(null);

  /** Estado para el Dashboard Individual de cada Local dentro del SuperAdmin */
  protected readonly selectedDashboardBizId = signal<number>(1);
  protected readonly selectedBizAnalytics = signal<BusinessAnalytics | null>(null);
  protected readonly selectedBizDetail = signal<Business | null>(null);

  protected readonly selectedBizConversionRate = computed(() => {
    const an = this.selectedBizAnalytics();
    if (!an || !an.viewCount) return 0;
    return Math.min(100, Math.round((an.whatsappClickCount / an.viewCount) * 100));
  });

  protected readonly selectedBizReplyRate = computed(() => {
    const an = this.selectedBizAnalytics();
    if (!an || !an.reviewCount) return 100;
    return Math.min(100, Math.round(((an.repliedReviewsCount || 0) / an.reviewCount) * 100));
  });

  protected adminSearch = '';
  protected readonly adminPage = signal(0);
  protected readonly adminPageSize = 6;
  protected readonly adminTotalPages = signal(1);
  protected readonly adminTotalElements = signal(0);

  protected editingBusinessId: number | null = null;
  protected readonly showBusinessEditor = signal(false);
  protected businessForm: Partial<Business> = this.getEmptyBusinessForm();

  protected homeCmsForm: HomeCms = {
    heroTitleEs: '',
    heroTitleEn: '',
    heroSubtitleEs: '',
    heroSubtitleEn: '',
    heroBannerUrl: '',
    heroCtaTextEs: '',
    heroCtaTextEn: '',
    featuredTitleEs: '',
    featuredTitleEn: '',
    newsTitleEs: '',
    newsTitleEn: '',
    contactTitleEs: '',
    contactTitleEn: '',
    contactSubtitleEs: '',
    contactSubtitleEn: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
  };

  protected editingPostId: number | null = null;
  protected readonly showPostEditor = signal(false);
  protected postForm: Partial<BlogPost> = this.getEmptyPostForm();

  ngOnInit(): void {
    this.loadAllAdminData();
  }

  private getEmptyBusinessForm(): Partial<Business> {
    return {
      name: '',
      legalName: '',
      taxNumber: '',
      establishmentTypeId: 1,
      neighborhood: 'El Cable',
      address: '',
      phone: '',
      whatsapp: '',
      email: '',
      website: '',
      primaryColor: '#00A3FF',
      description: '',
      descriptionEn: '',
      logoUrl: '',
      bannerUrl: '',
      isGhostKitchen: false,
      hasDineIn: true,
      isFeatured: false,
      isActive: true,
    };
  }

  private getEmptyPostForm(): Partial<BlogPost> {
    return {
      title: '',
      titleEn: '',
      summary: '',
      summaryEn: '',
      content: '',
      contentEn: '',
      imageUrl: '',
      authorName: 'Equipo Editorial Knect',
      isActive: true,
    };
  }

  loadAllAdminData(): void {
    this.dataService.getGlobalAnalytics().subscribe((an) => this.analytics.set(an));
    this.dataService.getCategories().subscribe((cats) => this.categories.set(cats));
    this.dataService.getAllUsers().subscribe((u) => this.users.set(u));
    this.dataService.getHomeCms().subscribe((cms) => (this.homeCmsForm = { ...cms }));
    this.dataService.getAdminBlogPosts().subscribe((p) => this.posts.set(p));
    this.loadAdminBusinesses();

    this.dataService.getAdminBusinesses('', 0, 100).subscribe((res) => {
      this.allBusinessesList.set(res.content);
      if (res.content.length > 0) {
        const currentId = this.selectedDashboardBizId() || res.content[0].id;
        this.selectDashboardBusiness(currentId);
      }
    });
  }

  selectDashboardBusiness(bizId: number | string): void {
    const id = Number(bizId);
    if (!id) return;
    this.selectedDashboardBizId.set(id);
    this.dataService.getMyBusiness(id).subscribe((biz) => this.selectedBizDetail.set(biz));
    this.dataService.getMyAnalytics(id).subscribe((an) => this.selectedBizAnalytics.set(an));
  }

  inspectBusinessDashboard(bizId: number): void {
    this.selectDashboardBusiness(bizId);
    this.activeTab.set('ANALYTICS');
  }

  editSelectedDashboardBusiness(): void {
    const biz = this.selectedBizDetail();
    if (!biz) return;
    this.startEditBusiness(biz);
    this.activeTab.set('DIRECTORY');
  }

  loadAdminBusinesses(): void {
    this.dataService
      .getAdminBusinesses(this.adminSearch, this.adminPage(), this.adminPageSize)
      .subscribe((res) => {
        this.businesses.set(res.content);
        this.adminTotalPages.set(res.totalPages);
        this.adminTotalElements.set(res.totalElements);
      });
  }

  onSearchAdminDirectory(): void {
    this.adminPage.set(0);
    this.loadAdminBusinesses();
  }

  changeAdminPage(p: number): void {
    if (p < 0 || p >= this.adminTotalPages()) return;
    this.adminPage.set(p);
    this.loadAdminBusinesses();
  }

  startNewBusiness(): void {
    this.editingBusinessId = null;
    this.businessForm = this.getEmptyBusinessForm();
    this.showBusinessEditor.set(true);
  }

  startEditBusiness(biz: Business): void {
    this.editingBusinessId = biz.id;
    this.businessForm = { ...biz };
    this.showBusinessEditor.set(true);
  }

  resetBusinessForm(): void {
    this.editingBusinessId = null;
    this.businessForm = this.getEmptyBusinessForm();
    this.showBusinessEditor.set(false);
  }

  onBusinessImageChange(event: Event, field: 'logoUrl' | 'bannerUrl'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.businessForm[field] = reader.result;
      }
    };
    reader.readAsDataURL(input.files[0]);
  }

  saveBusiness(): void {
    if (!this.businessForm.name?.trim()) return;
    this.businessForm.establishmentTypeId = Number(this.businessForm.establishmentTypeId) || 1;
    if (this.editingBusinessId) {
      this.dataService
        .updateAdminBusiness(this.editingBusinessId, this.businessForm)
        .subscribe(() => {
          this.resetBusinessForm();
          this.loadAllAdminData();
          this.showFeedback('Restaurante / Local actualizado correctamente en el catálogo maestro.');
        });
    } else {
      this.dataService.createAdminBusiness(this.businessForm).subscribe(() => {
        this.resetBusinessForm();
        this.loadAllAdminData();
        this.showFeedback('Nuevo Restaurante / Local registrado exitosamente en Knect.');
      });
    }
  }

  toggleFeatured(biz: Business): void {
    this.dataService.toggleFeaturedBusiness(biz.id).subscribe(() => {
      this.loadAdminBusinesses();
      this.showFeedback(`Estado de Destacado actualizado para ${biz.name}.`);
    });
  }

  toggleActive(biz: Business): void {
    this.dataService.toggleActiveBusiness(biz.id).subscribe(() => {
      this.loadAdminBusinesses();
      this.showFeedback(`Estado Activo/Inactivo actualizado para ${biz.name}.`);
    });
  }

  onChangeOwner(biz: Business, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const ownerUserId = Number(select.value);
    this.onChangeOwnerById(biz, ownerUserId);
  }

  onChangeOwnerById(biz: Business, ownerUserId: number | string | undefined): void {
    const id = Number(ownerUserId);
    if (!id) return;
    this.dataService.transferBusinessOwner(biz.id, id).subscribe(() => {
      this.loadAdminBusinesses();
      this.showFeedback(`Titularidad de ${biz.name} asignada exitosamente.`);
    });
  }

  deleteBusiness(biz: Business): void {
    this.confirmDeleteBusiness.set(null);
    this.dataService.deleteAdminBusiness(biz.id).subscribe(() => {
      this.loadAllAdminData();
      this.showFeedback('Restaurante / Local eliminado del directorio.');
    });
  }

  saveHomeCms(): void {
    this.dataService.updateHomeCms(this.homeCmsForm).subscribe(() => {
      this.showFeedback('Contenidos de la Página de Inicio actualizados correctamente.');
    });
  }

  startNewPost(): void {
    this.editingPostId = null;
    this.postForm = this.getEmptyPostForm();
    this.showPostEditor.set(true);
  }

  startEditPost(post: BlogPost): void {
    this.editingPostId = post.postId || post.id || null;
    this.postForm = { ...post };
    this.showPostEditor.set(true);
  }

  resetPostForm(): void {
    this.editingPostId = null;
    this.postForm = this.getEmptyPostForm();
    this.showPostEditor.set(false);
  }

  onPostImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.postForm.imageUrl = reader.result;
      }
    };
    reader.readAsDataURL(input.files[0]);
  }

  insertPostFormat(tag: string): void {
    const current = this.postForm.content || '';
    if (tag === 'h2') {
      this.postForm.content = current + '\n\nSubtítulo Destacado\n';
    } else if (tag === 'list') {
      this.postForm.content = current + '\n• Punto clave 1\n• Punto clave 2\n';
    } else if (tag === 'quote') {
      this.postForm.content = current + '\n\n"Cita destacada del artículo"\n';
    }
  }

  togglePostActive(post: BlogPost): void {
    const id = post.postId || post.id;
    if (!id) return;
    const updated = { ...post, isActive: post.isActive === false ? true : false };
    this.dataService.updateAdminBlogPost(id, updated).subscribe(() => {
      this.dataService.getAdminBlogPosts().subscribe((p) => this.posts.set(p));
      this.showFeedback(`Estado de la noticia "${post.title}" actualizado.`);
    });
  }

  savePost(): void {
    if (!this.postForm.title?.trim()) return;
    if (this.editingPostId) {
      this.dataService.updateAdminBlogPost(this.editingPostId, this.postForm).subscribe(() => {
        this.resetPostForm();
        this.dataService.getAdminBlogPosts().subscribe((p) => this.posts.set(p));
        this.showFeedback('Nota de Interés / Noticia actualizada exitosamente.');
      });
    } else {
      this.dataService.createAdminBlogPost(this.postForm).subscribe(() => {
        this.resetPostForm();
        this.dataService.getAdminBlogPosts().subscribe((p) => this.posts.set(p));
        this.showFeedback('Nueva Nota de Interés publicada en el portal Knect.');
      });
    }
  }

  deletePost(post: BlogPost): void {
    const id = post.postId || post.id;
    if (!id) return;
    this.confirmDeletePost.set(null);
    this.dataService.deleteAdminBlogPost(id).subscribe(() => {
      this.dataService.getAdminBlogPosts().subscribe((p) => this.posts.set(p));
      this.showFeedback('Nota de Interés eliminada.');
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  protected get breadcrumbLabel(): string {
    switch (this.activeTab()) {
      case 'ANALYTICS':
        return 'DASHBOARD WEB Y POR LOCAL';
      case 'DIRECTORY':
        return 'RESTAURANTES Y LOCALES';
      case 'CMS_NEWS':
        return 'NOTAS DE INTERÉS / NOTICIAS';
      case 'CMS_HOME':
        return 'PÁGINA DE INICIO';
    }
  }

  protected get pageTitle(): string {
    switch (this.activeTab()) {
      case 'ANALYTICS':
        return 'Dashboard Global de la Web y por Local';
      case 'DIRECTORY':
        return 'Editor de Restaurantes y Locales';
      case 'CMS_NEWS':
        return 'Editor de Notas de Interés y Noticias';
      case 'CMS_HOME':
        return 'Editor de Página de Inicio';
    }
  }

  private showFeedback(msg: string): void {
    this.feedbackMsg.set(msg);
    setTimeout(() => this.feedbackMsg.set(''), 4000);
  }
}
