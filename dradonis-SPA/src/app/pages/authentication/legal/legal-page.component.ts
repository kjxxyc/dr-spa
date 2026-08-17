import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../shared/seo/seo.service';
import { getLegalPage, LegalPage, LegalPageContent } from '../../../shared/legal/legal-pages';

/**
 * Renders one legal/compliance page (Privacy Policy, NPP, Terms, Telehealth
 * Consent, Refund Policy) from the bilingual LEGAL_PAGES data. The route
 * provides the slug via `data.slug`; the language follows the site-wide
 * ngx-translate toggle.
 */
@Component({
    selector: 'app-legal-page',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="legal-page" *ngIf="content">
            <h1>{{ content.title }}</h1>
            <p class="legal-updated">{{ content.updated }}</p>
            <div class="legal-body" [innerHTML]="content.html"></div>
        </div>
    `,
    styles: [`
        :host {
            display: block;
            background: linear-gradient(180deg, #ffffff 0%, #fafffa 100%);
        }
        .legal-page {
            max-width: 820px;
            margin: 0 auto;
            padding: 110px 1.25rem 64px;
        }
        h1 {
            font-size: 2rem;
            line-height: 1.2;
            margin: 0 0 0.4rem;
            color: #14532d;
        }
        .legal-updated {
            color: #6b7280;
            font-size: 0.9rem;
            margin: 0 0 1.75rem;
        }
        .legal-body {
            color: #1f2937;
            line-height: 1.7;
            font-size: 1rem;
        }
        .legal-body h2 {
            font-size: 1.2rem;
            margin: 1.6rem 0 0.5rem;
            color: #14532d;
        }
        .legal-body ul {
            padding-left: 1.4rem;
            margin: 0.5rem 0 1rem;
        }
        .legal-body li { margin-bottom: 0.4rem; }
        .legal-body a { color: #3d6218; text-decoration: underline; }
        @media (max-width: 600px) {
            .legal-page { padding-top: 96px; }
            h1 { font-size: 1.55rem; }
        }
    `],
})
export class LegalPageComponent implements OnInit, OnDestroy {
    page?: LegalPage;
    content?: LegalPageContent;
    private langSub?: Subscription;

    constructor(
        private route: ActivatedRoute,
        private translate: TranslateService,
        private seo: SeoService,
    ) {}

    ngOnInit(): void {
        const slug = this.route.snapshot.data['slug'] as string;
        this.page = getLegalPage(slug);
        this.refresh();
        this.langSub = this.translate.onLangChange.subscribe(() => this.refresh());
    }

    ngOnDestroy(): void {
        this.langSub?.unsubscribe();
        this.seo.reset();
    }

    private refresh(): void {
        if (!this.page) return;
        const lang: 'en' | 'es' = this.translate.currentLang === 'es' ? 'es' : 'en';
        this.content = this.page[lang];
        this.seo.apply({
            title: `${this.content.title} | Dr. Adonis`,
            description: lang === 'es'
                ? `${this.content.title} de Dr. Adonis Clinic (Miami, Florida).`
                : `${this.content.title} of Dr. Adonis Clinic (Miami, Florida).`,
            url: this.seo.absoluteUrl(`/${this.page.slug}`),
            lang,
        });
    }
}
