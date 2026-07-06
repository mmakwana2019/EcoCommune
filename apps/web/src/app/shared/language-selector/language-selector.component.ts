import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/translation.service';
import { LanguageCode } from '../../../../../../libs/shared-types';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-selector">
      <label for="lang-select" class="sr-only">Select UI Language</label>
      <select
        id="lang-select"
        class="form-control lang-select"
        [value]="translationService.currentLanguage()"
        (change)="onLanguageChange($event)"
        aria-label="Select Interface Language"
      >
        <option value="en">🌐 English (EN)</option>
        <option value="hi">🇮🇳 हिंदी (Hindi)</option>
        <option value="mr">🇮🇳 मराठी (Marathi)</option>
      </select>
    </div>
  `,
  styles: [`
    .lang-select {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #f8fafc;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
    }
    .lang-select option {
      background: #0f172a;
      color: #f8fafc;
    }
  `],
})
export class LanguageSelectorComponent {
  constructor(public translationService: TranslationService) {}

  onLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.translationService.setLanguage(select.value as LanguageCode);
  }
}
