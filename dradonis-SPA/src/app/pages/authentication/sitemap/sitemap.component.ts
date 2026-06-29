import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {
  articles: any[] = [];
  lang = 'en';

  constructor(private http: HttpClient, private translate: TranslateService) {}

  ngOnInit() {
    this.lang = (this.translate.currentLang as 'en' | 'es') || 'en';
    
    this.translate.onLangChange.subscribe(event => {
      this.lang = event.lang;
    });

    this.http.get<any[]>('/assets/data/articles.json').subscribe(data => {
      this.articles = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }

  get localizedArticles() {
    return this.articles.filter(a => a.language === this.lang);
  }
}
