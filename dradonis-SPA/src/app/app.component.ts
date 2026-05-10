import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WhatsappBtnComponent } from './shared/whatsapp-btn/whatsapp-btn.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, WhatsappBtnComponent],
    templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Modernize Angular Admin Template';
}
