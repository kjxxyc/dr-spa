import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ArticleService, Article } from '../../../../core/services/article.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs';

import { SeoService } from '../../../../shared/seo/seo.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatDialogModule, TranslateModule],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ArticleDetailComponent implements OnInit {
  article?: Article;
  lang = 'en';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private seo: SeoService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.lang = this.translate.currentLang || 'en';
    this.translate.onLangChange.subscribe(e => this.lang = e.lang);
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('slug') || '';
        return this.articleService.getArticleBySlug(slug);
      })
    ).subscribe(article => {
      this.article = article;
      
      if (article) {
        // Strip HTML tags for the description
        const cleanDescription = article.metaDescription || article.excerpt.replace(/<[^>]*>?/gm, '').substring(0, 155).trim();
        const cleanTitle = article.metaTitle || `${article.title.replace(/<[^>]*>?/gm, '')} - Dr. Adonis Maiquez`;
        
        const blogPostingSchema: Record<string, unknown> = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': article.title.replace(/<[^>]*>?/gm, ''),
          'image': article.imageUrl ? (article.imageUrl.startsWith('http') ? article.imageUrl : this.seo.absoluteUrl(article.imageUrl)) : undefined,
          'datePublished': article.date,
          'dateModified': article.date,
          'author': {
            '@type': 'Person',
            'name': 'Dr. Adonis Maiquez',
            'url': 'https://dradonis.com/meet-doctor'
          },
          'publisher': {
            '@type': 'MedicalBusiness',
            'name': 'Dr. Adonis Maiquez',
            'logo': {
              '@type': 'ImageObject',
              'url': this.seo.absoluteUrl('/assets/images/logos/Logo_720x192.jpg')
            }
          },
          'description': cleanDescription,
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': this.seo.absoluteUrl(`/articles/${article.slug}`)
          }
        };

        const jsonLd = article.faqSchema ? [blogPostingSchema, article.faqSchema] : blogPostingSchema;

        this.seo.apply({
          title: cleanTitle,
          description: cleanDescription,
          url: this.seo.absoluteUrl(`/articles/${article.slug}`),
          lang: article.language || 'es',
          ogType: 'article',
          image: article.imageUrl ? (article.imageUrl.startsWith('http') ? article.imageUrl : this.seo.absoluteUrl(article.imageUrl)) : undefined,
          jsonLd
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.seo.reset();
  }

  async openAppointment(): Promise<void> {
    const { AppointmentDialogComponent } = await import('../../../../shared/appointment-dialog/appointment-dialog.component');
    this.dialog.open(AppointmentDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      autoFocus: false
    });
  }

  onContentClick(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest('a');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href) return;

    // Handle appointment triggers
    if (href === '/makeanappointment' || href === '#appointment' || target.classList.contains('open-appointment-dialog')) {
      event.preventDefault();
      this.openAppointment();
      return;
    }

    // Handle internal routing without page reload
    if (href.startsWith('/') && !href.startsWith('//')) {
      event.preventDefault();
      this.router.navigateByUrl(href);
    }
  }
}
