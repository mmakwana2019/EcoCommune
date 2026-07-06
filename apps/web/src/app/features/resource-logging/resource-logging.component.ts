import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourceService } from '../../core/resource.service';
import { TranslationService } from '../../core/translation.service';
import { ResourceType, WasteCategory, LogResourceDTO } from '../../../../../../libs/shared-types';

@Component({
  selector: 'app-resource-logging',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="logging-page glass-panel" aria-labelledby="logging-heading">
      <div class="page-header">
        <h1 id="logging-heading">{{ translationService.translate('logging.title') }}</h1>
        <p>{{ translationService.translate('logging.subtitle') }}</p>
      </div>

      <div class="logging-grid">
        <!-- Resource Log Input Form -->
        <div class="form-card glass-panel">
          <h2>➕ Record Consumption</h2>

          <form (ngSubmit)="onSubmitLog()" #logForm="ngForm" aria-label="Resource Logging Form">
            <div class="form-group">
              <label for="res-type">Resource Type</label>
              <select
                id="res-type"
                name="type"
                class="form-control"
                [(ngModel)]="formData.type"
                (change)="onTypeChange()"
                required
                aria-required="true"
              >
                <option value="electricity">⚡ Electricity (kWh)</option>
                <option value="water">💧 Water (Liters)</option>
                <option value="waste">♻️ Waste (kg)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="res-amount">
                Amount ({{ formData.unit }})
              </label>
              <input
                id="res-amount"
                type="number"
                name="amount"
                class="form-control"
                [(ngModel)]="formData.amount"
                min="0.1"
                step="0.1"
                required
                aria-required="true"
                placeholder="e.g. 14.5"
              />
            </div>

            <div class="form-group" *ngIf="formData.type === 'waste'">
              <label for="waste-cat">{{ translationService.translate('logging.category') }}</label>
              <select
                id="waste-cat"
                name="category"
                class="form-control"
                [(ngModel)]="formData.category"
              >
                <option value="recyclable">📦 Recyclable Dry Waste</option>
                <option value="compostable">🌱 Compostable Wet Organic</option>
                <option value="landfill">🗑️ Non-Recyclable Landfill</option>
              </select>
            </div>

            <div class="form-group">
              <label for="log-date">{{ translationService.translate('logging.date') }}</label>
              <input
                id="log-date"
                type="date"
                name="date"
                class="form-control"
                [(ngModel)]="formData.date"
                required
                aria-required="true"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" [disabled]="!logForm.form.valid">
                {{ translationService.translate('logging.submit') }}
              </button>
              <button type="button" class="btn-secondary" (click)="onSampleBatchImport()">
                📥 Import Sample CSV Data
              </button>
            </div>
          </form>

          <p class="status-msg" aria-live="polite" *ngIf="statusMessage">
            {{ statusMessage }}
          </p>
        </div>

        <!-- Log Summary & History Table -->
        <div class="history-card glass-panel">
          <h2>📜 Historical Consumption Logs</h2>

          <div class="log-table-wrapper">
            <table class="history-table" aria-label="Resource Log History">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Type</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Category</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of resourceService.logs()">
                  <td>{{ item.date }}</td>
                  <td>
                    <span class="type-badge" [class]="item.type">
                      {{ item.type | titlecase }}
                    </span>
                  </td>
                  <td><strong>{{ item.amount }} {{ item.unit }}</strong></td>
                  <td>
                    <span *ngIf="item.category" class="cat-pill">
                      {{ item.category }}
                    </span>
                    <span *ngIf="!item.category" class="text-muted">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .logging-grid {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 24px;
      margin-top: 20px;
    }
    @media (max-width: 900px) {
      .logging-grid {
        grid-template-columns: 1fr;
      }
    }
    .form-card h2, .history-card h2 {
      font-size: 1.25rem;
      margin-bottom: 16px;
      color: var(--primary-color);
    }
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-primary);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    .status-msg {
      margin-top: 12px;
      color: var(--primary-color);
      font-weight: 500;
    }
    .log-table-wrapper {
      max-height: 380px;
      overflow-y: auto;
    }
    .history-table {
      width: 100%;
      border-collapse: collapse;
    }
    .history-table th, .history-table td {
      padding: 10px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      text-align: left;
      font-size: 0.9rem;
    }
    .history-table th {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-secondary);
    }
    .type-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .type-badge.electricity { background: rgba(255, 215, 0, 0.2); color: #ffd700; }
    .type-badge.water { background: rgba(0, 176, 255, 0.2); color: #00b0ff; }
    .type-badge.waste { background: rgba(0, 230, 118, 0.2); color: #00e676; }
    .cat-pill {
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    .text-muted { color: var(--text-secondary); }
  `],
})
export class ResourceLoggingComponent {
  formData: LogResourceDTO = {
    type: 'electricity',
    amount: 14.5,
    unit: 'kWh',
    category: undefined,
    date: new Date().toISOString().split('T')[0],
  };

  statusMessage: string = '';

  constructor(
    public resourceService: ResourceService,
    public translationService: TranslationService,
  ) {}

  onTypeChange(): void {
    if (this.formData.type === 'electricity') {
      this.formData.unit = 'kWh';
      this.formData.category = undefined;
    } else if (this.formData.type === 'water') {
      this.formData.unit = 'liters';
      this.formData.category = undefined;
    } else if (this.formData.type === 'waste') {
      this.formData.unit = 'kg';
      this.formData.category = 'compostable';
    }
  }

  async onSubmitLog(): Promise<void> {
    const created = await this.resourceService.addLog({ ...this.formData });
    this.statusMessage = `Successfully recorded ${created.amount} ${created.unit} of ${created.type} for ${created.date}.`;

    setTimeout(() => (this.statusMessage = ''), 4000);
  }

  async onSampleBatchImport(): Promise<void> {
    const sampleBatch: LogResourceDTO[] = [
      { type: 'electricity', amount: 15.2, unit: 'kWh', date: '2026-07-02' },
      { type: 'water', amount: 260, unit: 'liters', date: '2026-07-02' },
      { type: 'waste', amount: 1.8, unit: 'kg', category: 'recyclable', date: '2026-07-02' },
    ];

    const importedCount = await this.resourceService.bulkImportLogs(sampleBatch);
    this.statusMessage = `Imported ${importedCount} historical records from sample dataset.`;
    setTimeout(() => (this.statusMessage = ''), 4000);
  }
}
