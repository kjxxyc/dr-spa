import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { BUILD_VERSION } from '../../build-version';

export interface Article {
  id: number;
  slug: string;
  date: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageAlt?: string;
  language: 'en' | 'es';
  faqSchema?: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private articles$?: Observable<Article[]>;

  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    if (!this.articles$) {
      this.articles$ = this.http.get<Article[]>(`/assets/data/articles.json?v=${BUILD_VERSION}`).pipe(
        map(articles => {
          // Sort by date descending
          return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }),
        shareReplay(1)
      );
    }
    return this.articles$;
  }

  getArticleBySlug(slug: string): Observable<Article | undefined> {
    return this.getArticles().pipe(
      map(articles => articles.find(a => a.slug === slug))
    );
  }
}
