import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  highlight?: boolean;
}

@Component({
  selector: 'app-accessible-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container" [attr.aria-label]="title + ' Data Chart'">
      <div class="chart-header">
        <h3 id="chart-heading-{{id}}">{{ title }}</h3>
        <button
          type="button"
          class="btn-text-toggle"
          (click)="showTable = !showTable"
          [attr.aria-expanded]="showTable"
          [attr.aria-controls]="'data-table-' + id"
        >
          {{ showTable ? '📊 View Graph View' : '♿ View Accessible Data Table' }}
        </button>
      </div>

      <!-- Graphical SVG Visualization -->
      <div class="svg-chart-wrapper" *ngIf="!showTable" aria-hidden="true">
        <svg viewBox="0 0 500 150" class="svg-chart">
          <polyline
            fill="none"
            stroke="var(--primary-color)"
            stroke-width="3"
            [attr.points]="svgPoints"
          />
          <g *ngFor="let pt of calculatedPoints; let i = index">
            <circle
              [attr.cx]="pt.x"
              [attr.cy]="pt.y"
              r="5"
              [attr.fill]="pt.highlight ? '#ff1744' : '#00e676'"
            />
          </g>
        </svg>
        <div class="chart-labels">
          <span *ngFor="let item of data" class="chart-label-item">
            {{ item.label }}
          </span>
        </div>
      </div>

      <!-- WCAG 2.1 AA Accessible Data Table Alternative -->
      <div id="data-table-{{id}}" class="table-wrapper" [class.sr-only]="!showTable">
        <p class="sr-only" aria-live="polite">
          Table view active. Displaying {{ data.length }} data points for {{ title }}.
        </p>
        <table class="accessible-table" [attr.aria-labelledby]="'chart-heading-' + id">
          caption {{ title }} - Detailed Consumption Data
          <thead>
            <tr>
              <th scope="col">Time Period / Label</th>
              <th scope="col">Recorded Amount ({{ unit }})</th>
              <th scope="col" *ngIf="secondaryUnit">Benchmark ({{ secondaryUnit }})</th>
              <th scope="col">Status Flag</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of data" [class.highlight-row]="row.highlight">
              <td>{{ row.label }}</td>
              <td><strong>{{ row.value }} {{ unit }}</strong></td>
              <td *ngIf="secondaryUnit">{{ row.secondaryValue || 'N/A' }} {{ secondaryUnit }}</td>
              <td>
                <span *ngIf="row.highlight" class="badge-warning">⚠️ Anomaly Spike</span>
                <span *ngIf="!row.highlight" class="badge-normal">Normal</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 16px;
      margin-top: 12px;
    }
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .chart-header h3 {
      font-size: 1.1rem;
      color: var(--text-primary);
    }
    .btn-text-toggle {
      background: transparent;
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .btn-text-toggle:hover {
      background: rgba(0, 230, 118, 0.1);
    }
    .svg-chart-wrapper {
      padding: 10px 0;
    }
    .svg-chart {
      width: 100%;
      height: 120px;
      overflow: visible;
    }
    .chart-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    .accessible-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }
    .accessible-table th, .accessible-table td {
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px 12px;
      text-align: left;
      font-size: 0.9rem;
    }
    .accessible-table th {
      background: rgba(255, 255, 255, 0.05);
      color: var(--primary-color);
    }
    .highlight-row {
      background: rgba(255, 23, 68, 0.15);
    }
    .badge-warning {
      color: #ff1744;
      font-weight: bold;
    }
    .badge-normal {
      color: #00e676;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `],
})
export class AccessibleChartComponent {
  @Input() id: string = 'chart-1';
  @Input() title: string = 'Consumption Chart';
  @Input() unit: string = 'units';
  @Input() secondaryUnit?: string;
  @Input() data: ChartDataPoint[] = [];

  showTable: boolean = false;

  get calculatedPoints(): { x: number; y: number; highlight?: boolean }[] {
    if (!this.data || this.data.length === 0) return [];
    const maxVal = Math.max(...this.data.map((d) => d.value), 1);
    const stepX = 500 / (this.data.length - 1 || 1);

    return this.data.map((item, idx) => ({
      x: idx * stepX,
      y: 130 - (item.value / maxVal) * 100,
      highlight: item.highlight,
    }));
  }

  get svgPoints(): string {
    return this.calculatedPoints.map((p) => `${p.x},${p.y}`).join(' ');
  }
}
