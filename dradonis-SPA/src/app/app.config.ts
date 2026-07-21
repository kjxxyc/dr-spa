import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
  withJsonpSupport,
} from '@angular/common/http';
import { routes } from './app.routes';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BUILD_VERSION } from './build-version';



//Import all material modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// `?v=<build id>` busts browser/CDN caches on every deploy so a stale
// translations file can never miss newly added keys.
export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/i18n/', `.json?v=${BUILD_VERSION}`);
}

// If a key is ever missing anyway (stale cache edge case, typo), render
// nothing instead of exposing the raw key (e.g. "HEADER.CTABUBBLE") to users.
export class EmptyMissingTranslationHandler implements MissingTranslationHandler {
  handle(_params: MissingTranslationHandlerParams): string {
    return '';
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withComponentInputBinding()
    ),
    provideHttpClient(withInterceptorsFromDi(), withJsonpSupport()),
    // Hydration with event replay (Angular 20): replays clicks/keystrokes that
    // happened before the app hydrated. Called once — the previous duplicate
    // `provideClientHydration()` call was overridden anyway.
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
        missingTranslationHandler: {
          provide: MissingTranslationHandler,
          useClass: EmptyMissingTranslationHandler,
        },
      })
    ),
  ],
};
