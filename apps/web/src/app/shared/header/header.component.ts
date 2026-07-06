import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { TranslationService } from '../../core/translation.service';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent],
  template: `
    <header class="app-header glass-panel" role="banner">
      <div class="header-brand">
        <a routerLink="/" class="logo-link" aria-label="EcoCommune Home">
          <span class="logo-icon">🌿</span>
          <span class="logo-text">{{ translationService.translate('app.title') }}</span>
        </a>
        <span class="tech-badge" title="Google Stack Mandate">Google Cloud AI Native</span>
      </div>

      <nav class="header-nav" role="navigation" aria-label="Main Navigation">
        <ul class="nav-list">
          <li>
            <a routerLink="/logging" routerLinkActive="active-link" class="nav-link">
              📊 {{ translationService.translate('nav.logging') }}
            </a>
          </li>
          <li>
            <a routerLink="/insights" routerLinkActive="active-link" class="nav-link">
              💡 {{ translationService.translate('nav.insights') }}
            </a>
          </li>
          <li>
            <a routerLink="/forecasting" routerLinkActive="active-link" class="nav-link">
              📈 {{ translationService.translate('nav.forecasting') }}
            </a>
          </li>
          <li>
            <a routerLink="/benchmarks" routerLinkActive="active-link" class="nav-link">
              🏆 {{ translationService.translate('nav.benchmarks') }}
            </a>
          </li>
          <li>
            <a routerLink="/assistant" routerLinkActive="active-link" class="nav-link">
              🤖 {{ translationService.translate('nav.assistant') }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <app-language-selector></app-language-selector>

        <div class="user-profile" *ngIf="authService.currentUser() as user">
          <span class="user-avatar" aria-hidden="true">👤</span>
          <span class="user-name">{{ user.displayName }}</span>
          <button type="button" class="btn-logout" (click)="authService.logout()" aria-label="Sign Out">
            🔒 Logout
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 28px;
      margin-bottom: 24px;
      border-radius: 0 0 16px 16px;
    }
    .header-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-link {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: var(--text-primary);
    }
    .logo-icon {
      font-size: 1.6rem;
    }
    .logo-text {
      font-size: 1.4rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .tech-badge {
      font-size: 0.75rem;
      background: rgba(0, 230, 118, 0.15);
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 500;
    }
    .nav-list {
      display: flex;
      list-style: none;
      gap: 16px;
    }
    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }
    .nav-link:hover, .active-link {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.08);
      border-bottom: 2px solid var(--primary-color);
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.05);
      padding: 6px 12px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.85rem;
    }
    .btn-logout {
      background: transparent;
      border: 1px solid rgba(255, 23, 68, 0.4);
      color: #ff1744;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      cursor: pointer;
      margin-left: 6px;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      background: rgba(255, 23, 68, 0.15);
      border-color: #ff1744;
    }
  `],
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    public translationService: TranslationService,
  ) {}
}
