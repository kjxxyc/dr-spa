import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ArticleService, Article } from '../../../core/services/article.service';

@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {
  articles: Article[] = [];
  lang = 'en';

  constructor(private articleService: ArticleService, private translate: TranslateService) {}

  ngOnInit() {
    this.lang = (this.translate.currentLang as 'en' | 'es') || 'en';

    this.translate.onLangChange.subscribe(event => {
      this.lang = event.lang;
    });

    // ArticleService already sorts by date desc and cache-busts with BUILD_VERSION.
    this.articleService.getArticles().subscribe(data => {
      this.articles = data;
    });
  }

  get localizedArticles() {
    return this.articles.filter(a => a.language === this.lang);
  }
}
