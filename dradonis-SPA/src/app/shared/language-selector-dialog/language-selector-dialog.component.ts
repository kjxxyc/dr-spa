import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

export type LangChoice = 'en' | 'es';

@Component({
  selector: 'app-language-selector-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './language-selector-dialog.component.html',
  styleUrls: ['./language-selector-dialog.component.scss']
})
export class LanguageSelectorDialogComponent {
  hovered: LangChoice | null = null;

  constructor(private dialogRef: MatDialogRef<LanguageSelectorDialogComponent, LangChoice>) {}

  select(lang: LangChoice): void {
    this.dialogRef.close(lang);
  }
}
