import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import {
  GHL_EMBED_SCRIPT_ID,
  GHL_EMBED_SCRIPT_URL,
  GHL_FORM_ORIGIN,
  GHL_FORM_URL,
} from './ghl-form.constants';

/** Uncover the iframe at the latest after this, even if GHL never posts "iframeLoaded". */
const FORM_READY_FALLBACK_MS = 12_000;
/** After the iframe's own load event the GHL app still boots for a moment before it posts. */
const FRAME_LOAD_GRACE_MS = 2_500;

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.scss']
})
export class AppointmentDialogComponent implements OnInit, OnDestroy {
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  public dialogRef = inject(MatDialogRef<AppointmentDialogComponent>);

  @ViewChild('formFrame') private formFrame?: ElementRef<HTMLIFrameElement>;

  formUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(GHL_FORM_URL);

  /** True once the GHL form reports it is rendered (or the fallback timers expire). */
  formReady = false;
  private readyTimers: ReturnType<typeof setTimeout>[] = [];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof window !== 'undefined') {
        const existingScript = document.getElementById(GHL_EMBED_SCRIPT_ID);
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = GHL_EMBED_SCRIPT_ID;
          script.src = GHL_EMBED_SCRIPT_URL;
          script.async = true;
          document.body.appendChild(script);
        }
      }
      this.readyTimers.push(setTimeout(() => this.markReady(), FORM_READY_FALLBACK_MS));
    }
  }

  ngOnDestroy(): void {
    this.readyTimers.forEach(clearTimeout);
  }

  /**
   * The embedded form posts ["iframeLoaded", ...] to its parent once it has
   * rendered — the same message the GHL embed script uses to un-hide the
   * iframe. Only our own iframe counts (the /contact page has another one).
   */
  @HostListener('window:message', ['$event'])
  onFormMessage(event: MessageEvent): void {
    if (event.origin !== GHL_FORM_ORIGIN) {
      return;
    }
    if (event.source !== this.formFrame?.nativeElement.contentWindow) {
      return;
    }
    const action = Array.isArray(event.data) ? event.data[0] : undefined;
    if (action === 'iframeLoaded') {
      this.markReady();
    }
  }

  /** Document received; give its app a moment to boot before uncovering it. */
  onFrameLoad(): void {
    this.readyTimers.push(setTimeout(() => this.markReady(), FRAME_LOAD_GRACE_MS));
  }

  private markReady(): void {
    this.formReady = true;
  }

  close(): void {
    this.dialogRef.close();
  }
}
