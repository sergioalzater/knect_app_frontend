import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KnectDataService } from '../../../core/services/knect-data.service';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { Business, EstablishmentBranch, Review } from '../../../shared/models';
import { KnectRatingStarsComponent } from '../../../ui/atoms';
import { BranchCardComponent } from '../../../ui/molecules';
import { InteractiveBranchMapComponent } from '../../../ui/organisms';

@Component({
  selector: 'app-business-detail',
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    KnectRatingStarsComponent,
    BranchCardComponent,
    InteractiveBranchMapComponent,
  ],
  templateUrl: './business-detail.component.html',
  styleUrl: './business-detail.component.css',
})
export class BusinessDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly dataService = inject(KnectDataService);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly authService = inject(AuthService);
  protected readonly i18n = inject(I18nService);

  protected readonly business = signal<Business | null>(null);
  protected readonly reviews = signal<Review[]>([]);
  protected readonly selectedBranch = signal<EstablishmentBranch | null>(null);
  protected readonly isLoading = signal(true);

  protected reviewRating = 5;
  protected reviewComment = '';
  protected reviewBranchId: number | undefined = undefined;
  protected readonly reviewSavedMsg = signal('');
  protected readonly reviewError = signal('');
  protected readonly isSubmitting = signal(false);

  protected readonly brandColor = computed(() => this.business()?.primaryColor || '#0070D6');

  protected readonly userExistingReview = computed(() => {
    const currentUser = this.authService.user();
    if (!currentUser) return null;
    return this.reviews().find((r) => r.userId === currentUser.id) || null;
  });

  /** Distribución de reseñas por estrellas (5 → 1) para las barras del resumen. */
  protected readonly ratingDistribution = computed(() => {
    const list = this.reviews();
    const total = list.length;
    return [5, 4, 3, 2, 1].map((star) => {
      const count = list.filter((r) => Math.round(r.rating) === star).length;
      return { star, count, percent: total ? Math.round((count * 100) / total) : 0 };
    });
  });

  /** Enlace tel: de la sede seleccionada (o del comercio) para la barra de acciones móvil. */
  protected callHref(): string | null {
    const phone = this.selectedBranch()?.phone || this.selectedBranch()?.whatsapp || this.business()?.phone;
    if (!phone) return null;
    const clean = phone.replace(/[^0-9+]/g, '');
    return clean ? `tel:${clean}` : null;
  }

  /** Enlace de indicaciones de Google Maps hacia la sede seleccionada. */
  protected directionsHref(): string | null {
    const branch = this.selectedBranch();
    if (branch?.latitude && branch?.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`;
    }
    if (branch?.address) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.address)}`;
    }
    return null;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBusiness(id);
    }
  }

  private loadBusiness(id: string): void {
    this.dataService.getBusinessById(id).subscribe({
      next: (data) => {
        this.business.set(data);
        const branches = data.establishments || [];
        if (branches.length > 0) {
          this.selectedBranch.set(branches[0]);
          this.reviewBranchId = branches[0].establishmentId || branches[0].id;
        } else {
          this.selectedBranch.set({
            id: 1,
            establishmentId: 1,
            name: data.name + ' - Sede Principal',
            address: data.address || 'Medellín, Colombia',
            neighborhood: data.neighborhood || 'El Poblado',
            latitude: 6.2092,
            longitude: -75.5656,
            phone: data.phone,
            whatsapp: data.whatsapp || data.phone,
            schedules: 'Lun - Dom: 9:00 AM - 9:00 PM',
          });
        }
        this.isLoading.set(false);
        this.loadReviews(id);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  private loadReviews(businessId: string): void {
    this.dataService.getBusinessReviews(businessId).subscribe({
      next: (list) => {
        this.reviews.set(list);
        const existing = this.userExistingReview();
        if (existing) {
          this.reviewRating = existing.rating;
          this.reviewComment = existing.comment || '';
        }
      },
    });
  }

  // RF-09: Selección y resaltado visual de sede en el mapa por encima de las demás
  selectBranch(branch: EstablishmentBranch): void {
    this.selectedBranch.set(branch);
    this.reviewBranchId = branch.establishmentId || branch.id;
  }

  // RF-08: Acción rápida directa a WhatsApp wa.me con registro analítico
  openWhatsapp(branch?: EstablishmentBranch | null): void {
    const targetBranch = branch || this.selectedBranch();
    const biz = this.business();
    if (!biz) return;

    const rawPhone =
      targetBranch?.whatsapp || targetBranch?.phone || biz.whatsapp || biz.phone || '573004128890';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const branchName = targetBranch?.name || biz.name;
    const text = encodeURIComponent(
      `Hola ${biz.name} (${branchName}), te vi en el directorio Knect y me gustaría recibir información.`,
    );

    this.dataService
      .registerWhatsappClick(biz.id, targetBranch?.establishmentId || targetBranch?.id)
      .subscribe();

    if (isPlatformBrowser(this.platformId)) {
      window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank', 'noopener');
    }
  }

  submitReview(): void {
    const biz = this.business();
    if (!biz || !this.authService.isLoggedIn() || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.reviewSavedMsg.set('');
    this.reviewError.set('');

    this.dataService
      .createOrUpdateReview(biz.id, {
        rating: this.reviewRating,
        comment: this.reviewComment,
        establishmentId: this.reviewBranchId,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.reviewSavedMsg.set(
            this.i18n.lang() === 'es'
              ? '¡Tu calificación y reseña han sido publicadas correctamente!'
              : 'Your rating and review have been posted successfully!',
          );
          this.loadReviews(String(biz.id));
          this.dataService.getBusinessById(biz.id).subscribe((updated) => this.business.set(updated));
        },
        error: () => {
          this.isSubmitting.set(false);
          this.reviewError.set(this.i18n.t('biz.reviewError'));
        },
      });
  }
}
