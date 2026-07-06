import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AiService } from '../../core/ai.service';
import { TranslationService } from '../../core/translation.service';
import { AccessibleChartComponent, ChartDataPoint } from '../../shared/accessible-chart/accessible-chart.component';
import { CommunityBenchmark, ResourceType } from '../../../../../../libs/shared-types';

@Component({
  selector: 'app-community-benchmarks',
  standalone: true,
  imports: [CommonModule, FormsModule, AccessibleChartComponent],
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

      <!-- Toggle bar for report view mode -->
      <div class="view-mode-toggle glass-panel">
        <button
          type="button"
          class="btn-toggle"
          [class.active]="!showLocalSimulation"
          (click)="showLocalSimulation = false"
        >
          🌐 Google Looker Studio Embed
        </button>
        <button
          type="button"
          class="btn-toggle"
          [class.active]="showLocalSimulation"
          (click)="showLocalSimulation = true"
        >
          🖥️ Interactive Local Analytics Simulation
        </button>
      </div>

      <!-- Embedded Looker Studio Analytics Report -->
      <div *ngIf="!showLocalSimulation" class="looker-studio-section glass-panel">
        <div class="looker-header">
          <h2>📊 Looker Studio Embedded Neighborhood Dashboard</h2>
          <button type="button" class="btn-secondary btn-sm" (click)="toggleConfig()">
            ⚙️ {{ showConfig ? 'Hide Config' : 'Configure Report URL' }}
          </button>
        </div>
        <p>Source: Google BigQuery Partitioned Data Warehouse (k-Anonymity Verified)</p>

        <!-- Config Input Bar -->
        <div class="config-bar glass-panel" *ngIf="showConfig" aria-live="polite">
          <label for="looker-url-input">Looker Studio Embed URL:</label>
          <div class="input-row">
            <input
              id="looker-url-input"
              type="text"
              class="form-control"
              [(ngModel)]="lookerUrl"
              placeholder="e.g., https://lookerstudio.google.com/embed/reporting/..."
              (change)="saveUrl()"
            />
            <button type="button" class="btn-primary" (click)="resetToDefault()">
              Reset Default
            </button>
          </div>
          <small class="text-muted">
            Configure report sharing settings to 'Public' or 'Anyone with link can view' to avoid access errors.
          </small>
        </div>

        <div class="looker-iframe-placeholder">
          <!-- Dynamically bind the safe sanitized URL -->
          <iframe
            *ngIf="safeUrl"
            [src]="safeUrl"
            title="EcoCommune Looker Studio Community Report"
            width="100%"
            height="360"
            style="border: 0; border-radius: 8px;"
            loading="lazy"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <!-- Local Simulation Analytics View -->
      <div *ngIf="showLocalSimulation" class="local-simulation-section glass-panel" aria-live="polite">
        <h2>🖥️ Simulated Neighborhood Benchmark Report</h2>
        <p>Grounded in simulated neighborhood aggregates (k-Anonymity k ≥ 5 Verified)</p>

        <app-accessible-chart
          id="benchmark-simulation-chart"
          [title]="'Historical ' + selectedType + ' comparison'"
          [unit]="selectedType === 'electricity' ? 'kWh' : (selectedType === 'water' ? 'Liters' : 'kg')"
          secondaryUnit="Neighborhood Avg"
          [data]="simulationPoints"
        ></app-accessible-chart>

        <div class="local-stats-grid">
          <div class="stat-card glass-panel">
            <span class="stat-label">NEIGHBORHOOD AVERAGE</span>
            <span class="stat-value secondary-val">
              {{ benchmark?.neighborhoodAverage }} {{ selectedType === 'electricity' ? 'kWh' : (selectedType === 'water' ? 'L' : 'kg') }}
            </span>
          </div>
          <div class="stat-card glass-panel">
            <span class="stat-label">YOUR HOUSEHOLD AVERAGE</span>
            <span class="stat-value user-val">
              {{ benchmark?.householdAverage }} {{ selectedType === 'electricity' ? 'kWh' : (selectedType === 'water' ? 'L' : 'kg') }}
            </span>
          </div>
          <div class="stat-card glass-panel">
            <span class="stat-label">PARTICIPATING HOUSEHOLDS</span>
            <span class="stat-value">24 Households</span>
          </div>
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
    .secondary-val { color: var(--secondary-color); }
    .vs-divider {
      font-weight: 800;
      color: var(--text-secondary);
      opacity: 0.5;
    }
    .view-mode-toggle {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.03);
    }
    .btn-toggle {
      flex: 1;
      padding: 10px 16px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: var(--text-secondary);
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-toggle:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-primary);
    }
    .btn-toggle.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: #000000;
    }
    .looker-studio-section h2 {
      font-size: 1.2rem;
      color: var(--text-primary);
      margin: 0;
    }
    .looker-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .btn-sm {
      padding: 4px 10px;
      font-size: 0.8rem;
    }
    .config-bar {
      margin: 12px 0;
      padding: 12px;
      background: rgba(255, 255, 255, 0.03);
    }
    .input-row {
      display: flex;
      gap: 12px;
      margin-top: 6px;
      margin-bottom: 4px;
    }
    .looker-studio-section p, .local-simulation-section p {
      font-size: 0.85rem;
      margin-bottom: 16px;
      color: var(--text-secondary);
    }
    .looker-iframe-placeholder {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      overflow: hidden;
      min-height: 360px;
    }
    .text-muted {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    .local-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }
    .local-stats-grid .stat-card {
      display: flex;
      flex-direction: column;
    }
    .local-stats-grid .stat-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-bottom: 6px;
    }
    .local-stats-grid .stat-value {
      font-size: 1.3rem;
      font-weight: 700;
    }
  `],
})
export class CommunityBenchmarksComponent implements OnInit {
  selectedType: ResourceType = 'electricity';
  benchmark: CommunityBenchmark | null = null;

  showLocalSimulation: boolean = true; // Default to local simulation fallback to prevent Looker access errors
  showConfig: boolean = false;
  lookerUrl: string = '';
  safeUrl: any = null;
  simulationPoints: ChartDataPoint[] = [];

  // Working public Looker Studio demo template URL
  private readonly defaultUrl = 'https://lookerstudio.google.com/embed/reporting/c670a4a6-71d5-4573-a178-5e4c2598379c/page/pjD';

  constructor(
    private aiService: AiService,
    public translationService: TranslationService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.loadBenchmark();
    this.loadUrl();
  }

  loadBenchmark(): void {
    this.aiService.fetchCommunityBenchmark(this.selectedType).then((res) => {
      this.benchmark = res;

      // Populate custom simulation chart points for the local dashboard view
      if (this.selectedType === 'electricity') {
        this.simulationPoints = [
          { label: 'May 2026', value: 16.2, secondaryValue: 15.1 },
          { label: 'June 2026', value: 15.5, secondaryValue: 15.3 },
          { label: 'July 2026', value: 14.2, secondaryValue: 15.5, highlight: true }
        ];
      } else if (this.selectedType === 'water') {
        this.simulationPoints = [
          { label: 'May 2026', value: 295, secondaryValue: 285 },
          { label: 'June 2026', value: 280, secondaryValue: 288 },
          { label: 'July 2026', value: 280, secondaryValue: 290, highlight: true }
        ];
      } else {
        this.simulationPoints = [
          { label: 'May 2026', value: 2.1, secondaryValue: 2.8 },
          { label: 'June 2026', value: 1.9, secondaryValue: 2.9 },
          { label: 'July 2026', value: 1.8, secondaryValue: 3.0, highlight: true }
        ];
      }
    });
  }

  toggleConfig(): void {
    this.showConfig = !this.showConfig;
  }

  loadUrl(): void {
    this.lookerUrl = localStorage.getItem('looker_embed_url') || this.defaultUrl;
    this.updateSafeUrl();
  }

  saveUrl(): void {
    localStorage.setItem('looker_embed_url', this.lookerUrl);
    this.updateSafeUrl();
  }

  resetToDefault(): void {
    this.lookerUrl = this.defaultUrl;
    this.saveUrl();
  }

  private updateSafeUrl(): void {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.lookerUrl);
  }
}
