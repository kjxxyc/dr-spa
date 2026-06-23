import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleService, Article } from '../../../../core/services/article.service';
import { MatIconModule } from '@angular/material/icon';
import { SeoService } from '../../../../shared/seo/seo.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-articles-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, FormsModule, TranslateModule],
  templateUrl: './articles-list.component.html',
  styleUrl: './articles-list.component.scss'
})
export class ArticlesListComponent implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  displayedArticles: Article[] = [];
  
  pageSize = 12;
  currentPage = 1;
  hasMore = false;

  searchText = '';
  selectedLanguage: 'all' | 'en' | 'es' = 'all';

  constructor(
    private articleService: ArticleService,
    private seo: SeoService,
    private translate: TranslateService
  ) {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'all';
    if (lang === 'es' || lang === 'en') {
      this.selectedLanguage = lang;
    }
  }

  ngOnInit(): void {
    this.seo.apply({
      title: 'Blog & Articles - Dr. Adonis Maiquez',
      description: 'Insights on functional medicine, wellness, hormones, and longevity by Dr. Adonis.',
      url: this.seo.absoluteUrl('/articles'),
      lang: 'es',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        'name': 'Dr. Adonis Blog',
        'description': 'Insights on functional medicine, wellness, hormones, and longevity by Dr. Adonis.',
        'url': this.seo.absoluteUrl('/articles')
      }
    });

    this.articleService.getArticles().subscribe(data => {
      this.articles = data;
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.seo.reset();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredArticles = this.articles.filter(a => {
      const matchLang = this.selectedLanguage === 'all' || a.language === this.selectedLanguage;
      const matchText = this.searchText.trim() === '' || 
        a.title.toLowerCase().includes(this.searchText.toLowerCase()) || 
        a.excerpt.toLowerCase().includes(this.searchText.toLowerCase());
      return matchLang && matchText;
    });
    this.updateDisplayed();
  }

  loadMore(): void {
    if (this.hasMore) {
      this.currentPage++;
      this.updateDisplayed();
    }
  }

  private updateDisplayed(): void {
    const end = this.currentPage * this.pageSize;
    this.displayedArticles = this.filteredArticles.slice(0, end);
    this.hasMore = end < this.filteredArticles.length;
  }
}

