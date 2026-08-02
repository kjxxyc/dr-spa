import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../core/services/product.service';
import { ArticleService } from '../../core/services/article.service';
import { VideoService } from '../../core/services/video.service';

/** Routes where the WhatsApp button must appear on the left side. */
const LEFT_ROUTES = ['/men-wellness', '/vitamins-prescription', '/men-wellness/evaluation', '/makeanappointment'];

@Component({
  selector: 'app-whatsapp-btn',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './whatsapp-btn.component.html',
  styleUrls: ['./whatsapp-btn.component.scss']
})
export class WhatsappBtnComponent implements OnInit {
  isLeftSide = false;

  /** Title of the article currently open (/articles/<slug>) — personalizes the message. */
  private articleTitle: string | null = null;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private products: ProductService,
    private articles: ArticleService,
    private videos: VideoService,
  ) {}

  ngOnInit(): void {
    this.updateState(this.router.url);

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateState(event.urlAfterRedirects);
    });
  }

  private updateState(url: string): void {
    this.isLeftSide = LEFT_ROUTES.some(route => url.startsWith(route));
    this.loadArticleTitle(url);
  }

  /**
   * On article detail pages, resolve the article title asynchronously
   * (ArticleService caches articles.json). Until it loads, whatsappHref
   * falls back to the generic articles message.
   */
  private loadArticleTitle(url: string): void {
    this.articleTitle = null;
    const slug = url.startsWith('/articles/')
      ? decodeURIComponent(url.slice('/articles/'.length).split(/[?#]/)[0])
      : null;
    if (!slug) {
      return;
    }
    this.articles.getArticleBySlug(slug).subscribe(article => {
      if (article) {
        // Titles may carry HTML markup/entities (rendered with innerHTML).
        this.articleTitle = article.title
          .replace(/<[^>]*>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&nbsp;/g, ' ')
          .trim();
      }
    });
  }

  get whatsappHref(): string {
    const url = this.router.url;
    let messageKey = 'whatsappMessages.default';
    let params: Record<string, string> | undefined;

    // Product detail (/shop/<slug>): personalized message with the product name.
    const productSlug = url.startsWith('/shop/')
      ? url.slice('/shop/'.length).split(/[?#]/)[0]
      : null;
    const product = productSlug ? this.products.getBySlug(productSlug) : undefined;

    // Video detail (/videos/<slug>): personalized with the translated title.
    const videoSlug = url.startsWith('/videos/')
      ? decodeURIComponent(url.slice('/videos/'.length).split(/[?#]/)[0])
      : null;
    const video = videoSlug ? this.videos.getBySlug(videoSlug) : undefined;
    const videoTitle = video ? this.translate.instant(video.titleKey) : null;
    const videoTitleReady =
      typeof videoTitle === 'string' && videoTitle.length > 0 && !videoTitle.includes('videos.list');

    if (product) {
      messageKey = 'whatsappMessages.product';
      params = { product: product.name };
    } else if (video && videoTitleReady) {
      messageKey = 'whatsappMessages.video';
      params = { video: videoTitle };
    } else if (url.startsWith('/services')) {
      messageKey = 'whatsappMessages.services';
    } else if (url.startsWith('/shop')) {
      messageKey = 'whatsappMessages.shop';
    } else if (url.startsWith('/cardecal')) {
      messageKey = 'whatsappMessages.cardecal';
    } else if (url.startsWith('/videos')) {
      messageKey = 'whatsappMessages.videos';
    } else if (url.startsWith('/vitamins-prescription')) {
      messageKey = 'whatsappMessages.vitamins';
    } else if (url.startsWith('/men-wellness')) {
      messageKey = 'whatsappMessages.menwellness';
    } else if (url.startsWith('/makeanappointment')) {
      messageKey = 'whatsappMessages.appointment';
    } else if (url.startsWith('/telemedicine') || url.startsWith('/teleconsulta')) {
      messageKey = 'whatsappMessages.telemedicine';
    } else if (url.startsWith('/articles/') && this.articleTitle) {
      // Article detail: personalized with the article title.
      messageKey = 'whatsappMessages.article';
      params = { article: this.articleTitle };
    } else if (url.startsWith('/articles')) {
      messageKey = 'whatsappMessages.articles';
    } else if (url.startsWith('/tools')) {
      messageKey = 'whatsappMessages.tools';
    } else if (url.startsWith('/meet-doctor')) {
      messageKey = 'whatsappMessages.meetDoctor';
    }

    const text = this.translate.instant(messageKey, params);
    // Fallback when translations aren't loaded yet: instant() may return the
    // raw key (default ngx-translate) or '' (our MissingTranslationHandler).
    const fallbackText = 'Hello, I saw your website and would like more information';
    const finalMessage = (typeof text === 'string' && text.length > 0 && !text.includes('whatsappMessages'))
      ? text
      : fallbackText;

    return `https://api.whatsapp.com/send/?phone=13053355424&text=${encodeURIComponent(finalMessage)}&type=phone_number&app_absent=0`;
  }
}
