import { Component, Input, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeCms } from '../../../shared/models';
import { I18nService } from '../../../core/services/i18n.service';
import { KnectDataService } from '../../../core/services/knect-data.service';

@Component({
  selector: 'app-contact-form-section',
  imports: [FormsModule],
  template: `
    <div class="unal-contact-container">
      <div class="unal-contact-header">
        <span class="contact-kicker">
          <span class="kicker-dot" aria-hidden="true"></span>
          {{ i18n.lang() === 'es' ? 'Canal de Vinculación y Soporte' : 'Partnership & Support Channel' }}
        </span>
        <h2 class="unal-section-title">
          {{ (i18n.lang() === 'es' ? cms?.contactTitleEs : cms?.contactTitleEn) || 'Contáctanos' }}
        </h2>
        <p class="unal-contact-lead">
          {{
            (i18n.lang() === 'es' ? cms?.contactSubtitleEs : cms?.contactSubtitleEn) ||
              '¿Deseas vincular tu restaurante, cocina oculta o comercio al Directorio Knect? Escríbenos.'
          }}
        </p>
      </div>

      <div class="unal-contact-grid">
        <div class="unal-contact-info">
          <div class="unal-info-item">
            <span class="unal-info-label">
              <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
              {{ i18n.lang() === 'es' ? 'Sede Central' : 'Headquarters' }}
            </span>
            <p class="unal-info-value">{{ cms?.contactAddress || 'Centro Empresarial Ciudad del Río, Medellín - Colombia' }}</p>
          </div>

          <div class="unal-info-item">
            <span class="unal-info-label">
              <i class="fa-solid fa-envelope" aria-hidden="true"></i>
              {{ i18n.lang() === 'es' ? 'Correo Electrónico' : 'Email' }}
            </span>
            <p class="unal-info-value">{{ cms?.contactEmail || 'administracion@knect.co' }}</p>
          </div>

          <div class="unal-info-item">
            <span class="unal-info-label">
              <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
              {{ i18n.lang() === 'es' ? 'Línea Directa y WhatsApp' : 'Direct Line & WhatsApp' }}
            </span>
            <p class="unal-info-value">{{ cms?.contactPhone || '+57 300 800 9000' }}</p>
          </div>

          <div class="unal-campus-card">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80"
              alt="Red Gastronómica y Comercial Knect"
              loading="lazy"
            />
            <div class="unal-campus-overlay">
              <span><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Red de Restaurantes, Cafés y Cocinas Ocultas Verificadas</span>
            </div>
          </div>
        </div>

        <form class="unal-contact-form" (ngSubmit)="submitContact()" novalidate>
          @if (contactSent()) {
            <div class="alert-banner alert-success" role="status" aria-live="polite">
              <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
              <span>{{ contactFeedback() }}</span>
            </div>
          }
          @if (contactError()) {
            <div class="alert-banner alert-error" role="alert">
              <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
              <span>{{ contactError() }}</span>
            </div>
          }

          <div class="unal-form-group">
            <label class="unal-input-label" for="contact-name">
              <i class="fa-solid fa-user" aria-hidden="true"></i>
              {{ i18n.t('home.contactName') }} *
            </label>
            <input
              id="contact-name"
              type="text"
              class="unal-line-input"
              [(ngModel)]="contactForm.name"
              name="name"
              required
              autocomplete="name"
              [placeholder]="i18n.t('home.contactName')"
            />
          </div>

          <div class="unal-form-row">
            <div class="unal-form-group">
              <label class="unal-input-label" for="contact-email">
                <i class="fa-solid fa-at" aria-hidden="true"></i>
                {{ i18n.t('home.contactEmail') }} *
              </label>
              <input
                id="contact-email"
                type="email"
                class="unal-line-input"
                [(ngModel)]="contactForm.email"
                name="email"
                required
                autocomplete="email"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div class="unal-form-group">
              <label class="unal-input-label" for="contact-subject">
                <i class="fa-solid fa-tag" aria-hidden="true"></i>
                {{ i18n.t('home.contactSubject') }} *
              </label>
              <input
                id="contact-subject"
                type="text"
                class="unal-line-input"
                [(ngModel)]="contactForm.subject"
                name="subject"
                required
                [placeholder]="i18n.t('home.contactSubject')"
              />
            </div>
          </div>

          <div class="unal-form-group">
            <label class="unal-input-label" for="contact-message">
              <i class="fa-solid fa-comment-dots" aria-hidden="true"></i>
              {{ i18n.t('home.contactMessage') }} *
            </label>
            <textarea
              id="contact-message"
              rows="5"
              class="unal-box-textarea"
              [(ngModel)]="contactForm.message"
              name="message"
              required
              [placeholder]="i18n.t('home.contactMessage')"
            ></textarea>
          </div>

          <div class="unal-form-actions">
            <button
              type="submit"
              class="unal-submit-btn"
              [disabled]="contactSending()"
              [attr.aria-busy]="contactSending()"
            >
              <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
              <span>{{ contactSending() ? '...' : i18n.t('home.contactSend') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .unal-contact-container {
        background: var(--knect-bg-main);
        border: 1px solid var(--knect-border);
        border-radius: 24px;
        padding: 2.25rem 1.5rem;
        box-shadow: var(--knect-shadow-md);
      }
      @media (min-width: 900px) {
        .unal-contact-container {
          padding: 3.25rem 3.5rem;
        }
      }
      .unal-contact-header {
        margin-bottom: 2.5rem;
      }
      .contact-kicker {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--knect-accent-hover);
        background: rgba(0, 163, 255, 0.08);
        border: 1px solid rgba(0, 163, 255, 0.18);
        padding: 0.28rem 0.75rem;
        border-radius: 999px;
        margin-bottom: 0.65rem;
      }
      .kicker-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--knect-accent);
      }
      .unal-section-title {
        font-size: clamp(1.65rem, 3vw, 2.25rem);
        font-weight: 700;
        letter-spacing: -0.035em;
        color: var(--knect-primary);
        margin: 0;
      }
      .unal-contact-lead {
        color: var(--knect-text-muted);
        font-size: 0.98rem;
        max-width: 640px;
        margin-top: 0.45rem;
      }
      .unal-contact-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
      @media (min-width: 900px) {
        .unal-contact-grid {
          grid-template-columns: 1fr 1.25fr;
          gap: 3.5rem;
          align-items: start;
        }
      }
      .unal-contact-info {
        display: flex;
        flex-direction: column;
        gap: 0.95rem;
      }
      .unal-info-item {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        padding: 1rem 1.2rem;
        background: var(--knect-bg-card);
        border-radius: 16px;
        border: 1px solid var(--knect-border);
      }
      .unal-info-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--knect-text-muted);
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
      }
      .unal-info-label i {
        color: var(--knect-accent);
      }
      .unal-info-value {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--knect-primary);
        margin: 0;
      }
      .unal-campus-card {
        position: relative;
        margin-top: 0.25rem;
        border-radius: 18px;
        overflow: hidden;
        height: 180px;
        border: 1px solid var(--knect-border);
      }
      .unal-campus-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .unal-campus-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, transparent 25%, rgba(16, 38, 66, 0.85) 100%);
        display: flex;
        align-items: flex-end;
        padding: 1rem 1.25rem;
        color: #ffffff;
        font-weight: 600;
        font-size: 0.84rem;
      }
      .unal-campus-overlay i {
        color: var(--knect-accent);
        margin-right: 0.35rem;
      }
      .unal-contact-form {
        display: flex;
        flex-direction: column;
        gap: 1.15rem;
      }
      .unal-form-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.15rem;
      }
      @media (min-width: 640px) {
        .unal-form-row {
          grid-template-columns: 1fr 1fr;
        }
      }
      .unal-form-group {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .unal-input-label {
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--knect-primary);
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
      }
      .unal-input-label i {
        color: var(--knect-accent);
      }
      .unal-line-input {
        width: 100%;
        min-height: 44px;
        padding: 0.65rem 0.95rem;
        border: 1px solid var(--knect-border);
        border-radius: 12px;
        background: var(--knect-bg-card);
        font-size: 0.94rem;
        color: var(--knect-primary);
        transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
      }
      .unal-line-input:hover {
        background: #ffffff;
        border-color: #CBD5E1;
      }
      .unal-line-input:focus {
        outline: none;
        border-color: var(--knect-accent);
        box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.16);
        background: #ffffff;
      }
      .unal-box-textarea {
        width: 100%;
        padding: 0.85rem 1rem;
        border: 1px solid var(--knect-border);
        border-radius: 14px;
        background: var(--knect-bg-card);
        font-size: 0.94rem;
        color: var(--knect-primary);
        resize: vertical;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      }
      .unal-box-textarea:hover {
        background: #ffffff;
        border-color: #CBD5E1;
      }
      .unal-box-textarea:focus {
        outline: none;
        border-color: var(--knect-accent);
        box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.16);
        background: #ffffff;
      }
      .unal-form-actions {
        display: flex;
        justify-content: flex-end;
      }
      .unal-submit-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--knect-accent);
        color: #ffffff;
        font-weight: 600;
        font-size: 0.92rem;
        padding: 0.8rem 2rem;
        border: none;
        border-radius: 999px;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.15s ease;
        box-shadow: var(--shadow-primary);
      }
      .unal-submit-btn:hover:not(:disabled) {
        background: var(--knect-accent-hover);
        transform: translateY(-1px);
      }
      .unal-submit-btn:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
    `,
  ],
})
export class ContactFormSectionComponent {
  private readonly dataService = inject(KnectDataService);
  protected readonly i18n = inject(I18nService);

  @Input() cms: HomeCms | null = null;

  protected contactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };
  protected readonly contactSending = signal(false);
  protected readonly contactSent = signal(false);
  protected readonly contactFeedback = signal('');
  protected readonly contactError = signal('');

  submitContact(): void {
    this.contactError.set('');
    if (
      !this.contactForm.name.trim() ||
      !this.contactForm.email.trim() ||
      !this.contactForm.subject.trim() ||
      !this.contactForm.message.trim()
    ) {
      this.contactError.set(
        this.i18n.lang() === 'es'
          ? 'Por favor completa todos los campos requeridos.'
          : 'Please complete all required fields.',
      );
      return;
    }
    this.contactSending.set(true);
    this.dataService.submitContactForm(this.contactForm).subscribe({
      next: (res) => {
        this.contactSending.set(false);
        this.contactSent.set(true);
        this.contactFeedback.set(res.message || this.i18n.t('home.contactSuccess'));
        this.contactForm = { name: '', email: '', subject: '', message: '' };
      },
      error: () => {
        this.contactSending.set(false);
        this.contactError.set(
          this.i18n.lang() === 'es'
            ? 'No se pudo enviar el mensaje. Intenta nuevamente.'
            : 'Could not send message. Please try again.',
        );
      },
    });
  }
}
