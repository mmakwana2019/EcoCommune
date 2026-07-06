import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../core/ai.service';
import { TranslationService } from '../../core/translation.service';
import { CommunityBenchmark, ResourceType } from '../../../../../../libs/shared-types';

@Component({
  selector: 'app-community-benchmarks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="benchmarks-page glass-panel" aria-labelledby="benchmarks-heading">
      <div class="page-header">
        <h1 id="benchmarks-heading">{{ translationService.translate('benchmarks.title') }}</h1>
        <p>Anonymized neighborhood comparison via social proof nudging</p>
      </div>

      <div class="kanonymity-badge" role="status">
        <span class="shield-icon">🛡️</span>
        <span>{{ translationService.translate('benchmarks.kanonymity') }}</span>
      </div>

      <div class="controls-bar glass-panel">
        <label for="benchmark-res-select">Resource Category:</label>
        <select
          id="benchmark-res-select"
          class="form-control inline-select"
          [(ngModel)]="selectedType"
          (change)="loadBenchmark()"
        >
          <option value="electricity">⚡ Electricity</option>
          <option value="water">💧 Water</option>
          <option value="waste">♻️ Waste</option>
        </select>
      </div>

      <div class="benchmark-grid" *ngIf="benchmark">
        <!-- Social Proof Percentile Card -->
        <div class="percentile-card glass-panel">
          <h2>Your Neighborhood Efficiency Rank</h2>
          <div class="percentile-dial">
            <span class="percentile-number">{{ benchmark.householdPercentile }}th</span>
            <span class="percentile-label">PERCENTILE</span>
          </div>
          <p class="percentile-desc">
            You are using less {{ selectedType }} than <strong>{{ benchmark.householdPercentile }}%</strong> of households in Green Valley Subdivision!
          </p>
        </div>

        <!-- Comparative Metrics -->
        <div class="comparison-card glass-panel">
          <h2>Household vs. Neighborhood Average</h2>
          <div class="metric-row">
            <div class="metric-block">
              <span class="m-label">YOUR HOUSEHOLD AVG</span>
              <span class="m-value user-val">{{ benchmark.householdAverage }}</span>
            </div>
            <div class="vs-divider">VS</div>
            <div class="metric-block">
              <span class="m-label">NEIGHBORHOOD AVG (k ≥ 5)</span>
              <span class="m-value neigh-val">{{ benchmark.neighborhoodAverage }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Embedded Looker Studio Analytics Report -->
      <div class="looker-studio-section glass-panel">
        <h2>📊 Looker Studio Embedded Neighborhood Dashboard</h2>
        <p>Source: Google BigQuery Partitioned Data Warehouse (k-Anonymity Verified)</p>

        <div class="looker-iframe-placeholder">
          <iframe
            src="https://lookerstudio.google.com/embed/reporting/00000000-0000-0000-0000-000000000000/page/p_ecocommune"
            title="EcoCommune Looker Studio Community Report"
            width="100%"
            height="320"
            style="border: 0; border-radius: 8px;"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .kanonymity-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 230, 118, 0.1);
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin: 12px 0;
    }
    .controls-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      padding: 12px 20px;
    }
    .inline-select { max-width: 240px; }
    .benchmark-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    @media (max-width: 768px) {
      .benchmark-grid { grid-template-columns: 1fr; }
    }
    .percentile-card {
      text-align: center;
      padding: 28px;
    }
    .percentile-dial {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 140px;
      height: 140px;
      margin: 16px auto;
      border-radius: 50%;
      border: 4px solid var(--primary-color);
      box-shadow: var(--accent-glow);
    }
    .percentile-number {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--primary-color);
    }
    .percentile-label {
      font-size: 0.65rem;
      color: var(--text-secondary);
      letter-spacing: 0.1em;
    }
    .comparison-card { padding: 28px; }
    .metric-row {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 24px;
    }
    .metric-block {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .m-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-bottom: 6px;
    }
    .m-value {
      font-size: 1.8rem;
      font-weight: 700;
    }
    .user-val { color: var(--primary-color); }
    .neigh-val { color: var(--secondary-color); }
    .vs-divider {
      font-weight: 800;
      color: var(--text-secondary);
      opacity: 0.5;
    }
    .looker-studio-section h2 {
      font-size: 1.2rem;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    .looker-studio-section p {
      font-size: 0.85rem;
      margin-bottom: 16px;
    }
    .looker-iframe-placeholder {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      overflow: hidden;
    }
  `],
})
export class CommunityBenchmarksComponent implements OnInit {
  selectedType: ResourceType = 'electricity';
  benchmark: CommunityBenchmark | null = null;

  constructor(
    private aiService: AiService,
    public translationService: TranslationService,
  ) {}

  ngOnInit(): void {
    this.loadBenchmark();
  }

  loadBenchmark(): void {
    this.aiService.fetchCommunityBenchmark(this.selectedType).then((res) => {
      this.benchmark = res;
    });
  }
}
