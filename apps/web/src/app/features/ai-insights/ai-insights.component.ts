import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../core/ai.service';
import { TranslationService } from '../../core/translation.service';
import { AIInsight } from '../../../../../../libs/shared-types';

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="insights-page glass-panel" aria-labelledby="insights-heading">
      <div class="page-header">
        <h1 id="insights-heading">{{ translationService.translate('insights.title') }}</h1>
        <p>Grounded in actual logged resource consumption patterns</p>
      </div>

      <div class="insights-dashboard" *ngIf="insight">
        <!-- Cache Warning Alert -->
        <div class="cache-badge" role="status" aria-live="polite">
          <span class="cache-icon">⚡</span>
          <span>{{ translationService.translate('insights.cached') }}</span>
          <span class="timestamp">Last Updated: {{ insight.dateGenerated | date:'short' }}</span>
        </div>

        <div class="insight-overview glass-panel">
          <h2>{{ insight.title }}</h2>
          <p class="overview-desc">{{ insight.description }}</p>
        </div>

        <div class="action-list">
          <h2>🎯 Recommended Actions for This Week</h2>

          <div class="action-grid">
            <div
              *ngFor="let step of insight.actionableSteps"
              class="action-card glass-panel"
              [class.high-impact]="step.impactLevel === 'high'"
            >
              <div class="card-header">
                <span class="impact-badge" [class]="step.impactLevel">
                  {{ step.impactLevel | uppercase }} IMPACT
                </span>
                <span class="cat-icon" [ngSwitch]="step.category">
                  <span *ngSwitchCase="'electricity'">⚡</span>
                  <span *ngSwitchCase="'water'">💧</span>
                  <span *ngSwitchCase="'waste'">♻️</span>
                </span>
              </div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
              <div class="savings-container">
                <span class="savings-label">EST. SAVINGS:</span>
                <strong class="savings-value">{{ step.estimatedSavings }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .insights-dashboard {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 20px;
    }
    .cache-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      align-self: flex-start;
      background: rgba(255, 215, 0, 0.1);
      border: 1px solid rgba(255, 215, 0, 0.3);
      color: #ffd700;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .cache-badge .timestamp {
      opacity: 0.7;
      margin-left: auto;
      padding-left: 8px;
      border-left: 1px solid rgba(255, 215, 0, 0.3);
    }
    .insight-overview h2 {
      font-size: 1.3rem;
      color: var(--text-primary);
      margin-bottom: 8px;
    }
    .overview-desc {
      font-size: 1rem;
      line-height: 1.6;
    }
    .action-list h2 {
      font-size: 1.25rem;
      margin-bottom: 16px;
      color: var(--primary-color);
    }
    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    .action-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      border-left: 4px solid rgba(255, 255, 255, 0.1);
    }
    .action-card.high-impact {
      border-left-color: var(--primary-color);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .impact-badge {
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
    }
    .impact-badge.high { background: rgba(0, 230, 118, 0.2); color: var(--primary-color); }
    .impact-badge.medium { background: rgba(0, 176, 255, 0.2); color: var(--secondary-color); }
    .action-card h3 {
      font-size: 1.1rem;
      margin-bottom: 8px;
      color: var(--text-primary);
    }
    .action-card p {
      font-size: 0.9rem;
      margin-bottom: 16px;
    }
    .savings-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.04);
      padding: 8px 12px;
      border-radius: 6px;
    }
    .savings-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    .savings-value {
      font-size: 0.9rem;
      color: var(--primary-color);
    }
  `],
})
export class AiInsightsComponent implements OnInit {
  insight: AIInsight | null = null;

  constructor(
    private aiService: AiService,
    public translationService: TranslationService,
  ) {}

  ngOnInit(): void {
    this.aiService.fetchInsights().then((data) => (this.insight = data));
  }
}
