import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ArticleService, Article } from '../../../../core/services/article.service';
import { MatIconModule } from '@angular/material/icon';
import { switchMap } from 'rxjs';

import { SeoService } from '../../../../shared/seo/seo.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ArticleDetailComponent implements OnInit {
  article?: Article;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private seo: SeoService
  ) {}

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
        const cleanDescription = article.excerpt.replace(/<[^>]*>?/gm, '').substring(0, 155).trim();
        
        this.seo.apply({
          title: `${article.title.replace(/<[^>]*>?/gm, '')} - Dr. Adonis Maiquez`,
          description: cleanDescription,
          url: this.seo.absoluteUrl(`/articles/${article.slug}`),
          lang: article.language || 'es',
          ogType: 'article',
          image: article.imageUrl ? (article.imageUrl.startsWith('http') ? article.imageUrl : this.seo.absoluteUrl(article.imageUrl)) : undefined,
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': article.title.replace(/<[^>]*>?/gm, ''),
            'image': article.imageUrl ? (article.imageUrl.startsWith('http') ? article.imageUrl : this.seo.absoluteUrl(article.imageUrl)) : undefined,
            'datePublished': article.date,
            'dateModified': article.date,
            'author': {
              '@type': 'Person',
              'name': 'Dr. Adonis Maiquez',
              'url': 'https://dradonis.com/landing/meet-doctor'
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
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.seo.reset();
  }
}
