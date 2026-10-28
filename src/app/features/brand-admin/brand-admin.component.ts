import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { KnectDataService } from '../../core/services/knect-data.service';
import { AuthService } from '../../core/services/auth.service';
import {
  Business,
  EstablishmentBranch,
  EstablishmentType,
  Review,
  BusinessAnalytics,
} from '../../shared/models';
import { KpiStatCardComponent } from '../../ui/molecules';

@Component({
  selector: 'app-brand-admin',
  imports: [FormsModule, DatePipe, RouterLink, KpiStatCardComponent],
  templateUrl: './brand-admin.component.html',
  styleUrl: './brand-admin.component.css',
})
export class BrandAdminComponent implements OnInit {
  private readonly dataService = inject(KnectDataService);
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly activeTab = signal<'ANALYTICS' | 'BRAND' | 'BRANCHES' | 'REVIEWS'>('ANALYTICS');
  protected readonly business = signal<Business | null>(null);
  protected readonly allBusinesses = signal<Business[]>([]);
  protected readonly analytics = signal<BusinessAnalytics | null>(null);
  protected readonly categories = signal<EstablishmentType[]>([]);
  protected readonly reviews = signal<Review[]>([]);
  protected readonly feedbackMsg = signal('');
  protected readonly isSaving = signal(false);
  protected readonly confirmDeleteBranch = signal<EstablishmentBranch | null>(null);

  protected selectedBusinessId: number | null = null;
  protected brandForm: Partial<Business> = {};

  protected editingBranchId: number | null = null;
  protected branchForm: Partial<EstablishmentBranch> = {
    name: '',
    neighborhood: 'El Cable',
    address: '',
    latitude: 5.0563,
    longitude: -75.4864,
    phone: '',
    whatsapp: '',
    schedules: 'Lun - Dom: 11:00 AM - 10:00 PM',
    description: '',
  };

  protected replyDrafts: Record<number, string> = {};

  protected readonly whatsappConversionRate = computed(() => {
    const an = this.analytics();
    if (!an || !an.viewCount) return 0;
    return Math.min(100, Math.round((an.whatsappClickCount / an.viewCount) * 100));
  });

  protected readonly reviewReplyRate = computed(() => {
    const an = this.analytics();
    if (!an || !an.reviewCount) return 100;
    return Math.min(100, Math.round(((an.repliedReviewsCount || 0) / an.reviewCount) * 100));
  });

  ngOnInit(): void {
    this.dataService.getCategories().subscribe((cats) => this.categories.set(cats));

    if (this.authService.isSuperAdmin()) {
      this.dataService.getAdminBusinesses('', 0, 100).subscribe((res) => {
        this.allBusinesses.set(res.content);
      });
    }

    this.route.queryParamMap.subscribe((params) => {
      const bId = params.get('businessId');
      if (bId) {
        this.selectedBusinessId = Number(bId);
      }
      this.loadMyBusinessData();
    });
  }

  onSelectBusiness(bizId: number | string): void {
    this.selectedBusinessId = Number(bizId);
    this.loadMyBusinessData();
  }

  loadMyBusinessData(): void {
    const idParam = this.selectedBusinessId || undefined;
    this.dataService.getMyBusiness(idParam).subscribe((biz) => {
      this.business.set(biz);
      this.selectedBusinessId = biz.id;
      this.brandForm = { ...biz };
    });
    this.dataService.getMyAnalytics(idParam).subscribe((an) => this.analytics.set(an));
    this.dataService.getMyReviews(idParam).subscribe((revs) => {
      this.reviews.set(revs);
      revs.forEach((r) => {
        const key = r.reviewId || r.id;
        this.replyDrafts[key] = r.adminReply || '';
      });
    });
  }

  saveBrandIdentity(): void {
    if (this.isSaving()) return;
    this.isSaving.set(true);
    this.brandForm.establishmentTypeId = Number(this.brandForm.establishmentTypeId) || 1;
    const idParam = this.selectedBusinessId || undefined;
    this.dataService.updateMyBusiness(this.brandForm, idParam).subscribe({
      next: (updated) => {
        this.isSaving.set(false);
        this.business.set(updated);
        this.showFeedback('Información e identidad de tu restaurante actualizadas exitosamente.');
      },
      error: () => this.isSaving.set(false),
    });
  }

  onImageFileChange(event: Event, targetField: 'logoUrl' | 'bannerUrl'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.brandForm[targetField] = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  startEditBranch(branch: EstablishmentBranch): void {
    this.editingBranchId = branch.establishmentId || branch.id || null;
    this.branchForm = { ...branch };
  }

  resetBranchForm(): void {
    this.editingBranchId = null;
    this.branchForm = {
      name: '',
      neighborhood: 'El Cable',
      address: '',
      latitude: 5.0563,
      longitude: -75.4864,
      phone: '',
      whatsapp: '',
      schedules: 'Lun - Dom: 11:00 AM - 10:00 PM',
      description: '',
    };
  }

  saveBranch(): void {
    if (!this.branchForm.name?.trim() || !this.branchForm.address?.trim() || this.isSaving()) return;
    this.isSaving.set(true);

    if (this.editingBranchId) {
      this.dataService.updateMyEstablishment(this.editingBranchId, this.branchForm).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.resetBranchForm();
          this.loadMyBusinessData();
          this.showFeedback('Sede actualizada correctamente.');
        },
        error: () => this.isSaving.set(false),
      });
    } else {
      const idParam = this.selectedBusinessId || undefined;
      this.dataService.createMyEstablishment(this.branchForm, idParam).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.resetBranchForm();
          this.loadMyBusinessData();
          this.showFeedback('Nueva sede registrada y georreferenciada exitosamente.');
        },
        error: () => this.isSaving.set(false),
      });
    }
  }

  deleteBranch(branch: EstablishmentBranch): void {
    const id = branch.establishmentId || branch.id;
    if (!id) return;
    this.confirmDeleteBranch.set(null);
    this.dataService.deleteMyEstablishment(id).subscribe(() => {
      this.loadMyBusinessData();
      this.showFeedback('Sede eliminada del directorio.');
    });
  }

  submitReply(review: Review): void {
    const id = review.reviewId || review.id;
    const reply = this.replyDrafts[id] || '';
    this.dataService.replyToReview(id, reply).subscribe(() => {
      this.loadMyBusinessData();
      this.showFeedback('Respuesta oficial publicada en la reseña del cliente.');
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  protected get pageTitle(): string {
    const bizName = this.business()?.name || 'Mi Restaurante / Local';
    switch (this.activeTab()) {
      case 'ANALYTICS':
        return `Dashboard de Rendimiento – ${bizName}`;
      case 'BRAND':
        return `Gestión de Información – ${bizName}`;
      case 'BRANCHES':
        return `Sedes, Horarios y WhatsApp – ${bizName}`;
      case 'REVIEWS':
        return `Reseñas y Calificaciones – ${bizName}`;
    }
  }

  protected get breadcrumbLabel(): string {
    switch (this.activeTab()) {
      case 'ANALYTICS':
        return 'DASHBOARD DE MI LOCAL';
      case 'BRAND':
        return 'INFORMACIÓN E IDENTIDAD';
      case 'BRANCHES':
        return 'SEDES Y HORARIOS';
      case 'REVIEWS':
        return 'RESEÑAS DE CLIENTES';
    }
  }

  private showFeedback(msg: string): void {
    this.feedbackMsg.set(msg);
    setTimeout(() => this.feedbackMsg.set(''), 4000);
  }
}
