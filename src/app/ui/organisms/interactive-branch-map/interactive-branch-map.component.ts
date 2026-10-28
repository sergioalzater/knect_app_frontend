import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  AfterViewInit,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EstablishmentBranch } from '../../../shared/models';
import { I18nService } from '../../../core/services/i18n.service';

declare const L: any;

@Component({
  selector: 'app-interactive-branch-map',
  template: `
    <div class="knect-card-white organism-map-card">
      <div class="map-card-header">
        <h3 class="map-title">
          <i class="fa-solid fa-map-location-dot" style="color: var(--knect-accent)" aria-hidden="true"></i>
          {{ i18n.t('biz.mapTitle') }}
        </h3>
        @if (selectedBranch) {
          <span class="selected-coords tabular-nums">
            <i class="fa-solid fa-location-crosshairs" aria-hidden="true"></i>
            {{ selectedBranch.name }} ({{ selectedBranch.latitude }}, {{ selectedBranch.longitude }})
          </span>
        }
      </div>
      <div
        id="knect-atomic-branches-map"
        class="interactive-map"
        role="region"
        [attr.aria-label]="i18n.t('biz.mapTitle')"
      ></div>
    </div>
  `,
  styles: [
    `
      .organism-map-card {
        padding: 1.25rem;
        position: sticky;
        top: 92px;
      }
      .map-card-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.85rem;
      }
      .map-title {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.05rem;
        color: var(--knect-primary);
      }
      .selected-coords {
        font-size: 0.78rem;
        color: var(--knect-text-muted);
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }
      .selected-coords i {
        color: var(--knect-accent);
      }
      .interactive-map {
        width: 100%;
        height: 440px;
        border-radius: 10px;
        border: 1px solid var(--knect-border);
        z-index: 1;
      }
    `,
  ],
})
export class InteractiveBranchMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly i18n = inject(I18nService);

  @Input() branches: EstablishmentBranch[] = [];
  @Input() selectedBranch: EstablishmentBranch | null = null;
  @Input() brandColor = '#00A3FF';
  @Output() branchSelected = new EventEmitter<EstablishmentBranch>();

  private mapInstance: any = null;
  private branchMarkers = new Map<number, any>();

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.initMap(), 150);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mapInstance && (changes['selectedBranch'] || changes['branches'] || changes['brandColor'])) {
      this.renderMarkers();
    }
  }

  ngOnDestroy(): void {
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }
  }

  private initMap(): void {
    if (!isPlatformBrowser(this.platformId) || typeof L === 'undefined') return;
    const container = document.getElementById('knect-atomic-branches-map');
    if (!container) return;

    if (this.mapInstance) {
      this.mapInstance.remove();
    }

    const list = this.branches.length
      ? this.branches
      : this.selectedBranch
        ? [this.selectedBranch]
        : [];
    const first = list[0] || { latitude: 5.0563, longitude: -75.4864 };

    this.mapInstance = L.map('knect-atomic-branches-map').setView(
      [first.latitude || 5.0563, first.longitude || -75.4864],
      list.length === 1 ? 16 : 13,
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.mapInstance);

    this.renderMarkers();
  }

  private renderMarkers(): void {
    if (!this.mapInstance || typeof L === 'undefined') return;

    this.branchMarkers.forEach((m) => this.mapInstance.removeLayer(m));
    this.branchMarkers.clear();

    const list = this.branches.length
      ? this.branches
      : this.selectedBranch
        ? [this.selectedBranch]
        : [];
    const activeId = this.selectedBranch?.establishmentId || this.selectedBranch?.id;

    list.forEach((branch, index) => {
      const bId = branch.establishmentId || branch.id || index + 1;
      const isSelected = bId === activeId;
      const lat = branch.latitude || 5.0563;
      const lng = branch.longitude || -75.4864;

      const markerHtml = isSelected
        ? `<div style="
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: #1A365D;
            border: 3px solid #00A3FF;
            box-shadow: 0 0 0 4px rgba(0, 163, 255, 0.25), 0 6px 14px rgba(26, 54, 93, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 15px;
            transform: scale(1.15);
          "><i class="fa-solid fa-star" style="color: #00A3FF;"></i></div>`
        : `<div style="
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: #1A365D;
            border: 3px solid #FFFFFF;
            box-shadow: 0 2px 6px rgba(26, 54, 93, 0.28);
            opacity: 0.88;
          "></div>`;

      const icon = L.divIcon({
        className: 'knect-custom-pin',
        html: markerHtml,
        iconSize: isSelected ? [38, 38] : [26, 26],
        iconAnchor: isSelected ? [19, 19] : [13, 13],
      });

      const marker = L.marker([lat, lng], {
        icon,
        zIndexOffset: isSelected ? 1000 : 100,
      }).addTo(this.mapInstance);

      marker.bindPopup(
        `<div style="font-family: Inter, sans-serif; min-width: 180px;">
          <strong style="color: #1A365D; font-size: 14px;">${branch.name}</strong><br/>
          <span style="font-size: 12px; color: #334155;">${branch.address}</span><br/>
          <span style="font-size: 11px; color: #00A3FF; font-weight: 700;">${branch.neighborhood || ''}</span>
        </div>`,
      );

      marker.on('click', () => {
        this.branchSelected.emit(branch);
      });

      this.branchMarkers.set(bId, marker);

      if (isSelected) {
        marker.openPopup();
        this.mapInstance.flyTo([lat, lng], list.length === 1 ? 16 : 15, {
          duration: 0.6,
        });
      }
    });
  }
}
