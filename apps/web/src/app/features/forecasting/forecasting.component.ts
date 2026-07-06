import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../core/ai.service';
import { TranslationService } from '../../core/translation.service';
import { AccessibleChartComponent, ChartDataPoint } from '../../shared/accessible-chart/accessible-chart.component';
import { PredictiveForecast, ResourceType } from '../../../../../../libs/shared-types';

@Component({
  selector: 'app-forecasting',
  standalone: true,
  imports: [CommonModule, FormsModule, AccessibleChartComponent],
  template: `
    <section class="forecasting-page glass-panel" aria-labelledby="forecasting-heading">
      <div class="page-header">
        <h1 id="forecasting-heading">{{ translationService.translate('forecasting.title') }}</h1>
        <p>30-Day Automated Time-Series Model (BigQuery ML ARIMA_PLUS)</p>
      </div>

      <div class="controls-bar glass-panel">
        <label for="resource-select">Select Resource Domain:</label>
        <select
          id="resource-select"
          class="form-control inline-select"
          [(ngModel)]="selectedType"
          (change)="loadForecast()"
        >
          <option value="electricity">⚡ Electricity Consumption</option>
          <option value="water">💧 Water Consumption</option>
          <option value="waste">♻️ Waste Mass Generation</option>
        </select>
      </div>

      <!-- Anomaly Alert Banner -->
      <div
        *ngIf="forecast?.anomalyAlert?.flagged"
        class="anomaly-alert-banner"
        role="alert"
        aria-live="assertive"
      >
        <div class="alert-icon">⚠️</div>
        <div class="alert-content">
          <h3>{{ translationService.translate('forecasting.anomaly') }}</h3>
          <p>{{ forecast?.anomalyAlert?.message }}</p>
        </div>
      </div>

      <div class="forecast-content" *ngIf="forecast">
        <div class="summary-cards">
          <div class="stat-card glass-panel">
            <span class="stat-label">PROJECTED 30-DAY TOTAL</span>
            <span class="stat-value">{{ forecast.totalPredicted }} {{ forecast.unit }}</span>
          </div>
          <div class="stat-card glass-panel">
            <span class="stat-label">TIME-SERIES ALGORITHM</span>
            <span class="stat-value">BigQuery ML ARIMA_PLUS</span>
          </div>
          <div class="stat-card glass-panel">
            <span class="stat-label">CONFIDENCE INTERVAL</span>
            <span class="stat-value">95% Upper / Lower</span>
          </div>
        </div>

        <!-- Accessible Visualization Component -->
        <app-accessible-chart
          id="forecast-chart"
          [title]="'Next 30-Day Forecast Trend (' + forecast.resourceType + ')'"
          [unit]="forecast.unit"
          [data]="chartPoints"
        ></app-accessible-chart>
      </div>
    </section>
  `,
  styles: [`
    .controls-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 16px 0;
      padding: 12px 20px;
    }
    .inline-select {
      max-width: 280px;
    }
    .anomaly-alert-banner {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      background: rgba(255, 23, 68, 0.15);
      border: 1px solid #ff1744;
      border-radius: 12px;
      padding: 16px;
      margin: 16px 0;
    }
    .alert-icon { font-size: 1.8rem; }
    .alert-content h3 { color: #ff1744; margin-bottom: 4px; }
    .alert-content p { color: #f8fafc; margin: 0; font-size: 0.95rem; }
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    .stat-card {
      display: flex;
      flex-direction: column;
      padding: 16px;
    }
    .stat-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-bottom: 6px;
    }
    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-color);
    }
  `],
})
export class ForecastingComponent implements OnInit {
  selectedType: ResourceType = 'water';
  forecast: PredictiveForecast | null = null;
  chartPoints: ChartDataPoint[] = [];

  constructor(
    private aiService: AiService,
    public translationService: TranslationService,
  ) {}

  ngOnInit(): void {
    this.loadForecast();
  }

  loadForecast(): void {
    this.aiService.fetchPredictiveForecast(this.selectedType).then((res) => {
      this.forecast = res;
      this.chartPoints = res.forecastPoints.map((pt) => ({
        label: pt.date.substring(5), // MM-DD
        value: pt.predictedValue,
        highlight: pt.isAnomaly,
      }));
    });
  }
}
