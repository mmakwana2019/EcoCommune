import { Injectable, signal } from '@angular/core';
import { ResourceLog, LogResourceDTO, ResourceType } from '../../../../../libs/shared-types';

/**
 * Core ResourceService handling operational data logging for electricity, water, and waste.
 * Synchronizes with Cloud Firestore `/users/{uid}/resourceLogs` subcollection.
 */
@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  /**
   * Reactive signal containing historical resource logs.
   */
  readonly logs = signal<ResourceLog[]>([
    {
      id: 'log-1',
      userId: 'demo_user_123',
      householdId: 'demo_user_123',
      neighborhoodId: 'green-valley-subdivision',
      type: 'electricity',
      amount: 14.2,
      unit: 'kWh',
      date: '2026-07-06',
      createdAt: '2026-07-06T08:00:00Z',
    },
    {
      id: 'log-2',
      userId: 'demo_user_123',
      householdId: 'demo_user_123',
      neighborhoodId: 'green-valley-subdivision',
      type: 'water',
      amount: 280,
      unit: 'liters',
      date: '2026-07-05',
      createdAt: '2026-07-05T09:15:00Z',
    },
    {
      id: 'log-3',
      userId: 'demo_user_123',
      householdId: 'demo_user_123',
      neighborhoodId: 'green-valley-subdivision',
      type: 'waste',
      amount: 2.1,
      unit: 'kg',
      category: 'compostable',
      date: '2026-07-04',
      createdAt: '2026-07-04T18:30:00Z',
    },
    {
      id: 'log-4',
      userId: 'demo_user_123',
      householdId: 'demo_user_123',
      neighborhoodId: 'green-valley-subdivision',
      type: 'waste',
      amount: 1.5,
      unit: 'kg',
      category: 'recyclable',
      date: '2026-07-04',
      createdAt: '2026-07-04T18:35:00Z',
    },
    {
      id: 'log-5',
      userId: 'demo_user_123',
      householdId: 'demo_user_123',
      neighborhoodId: 'green-valley-subdivision',
      type: 'electricity',
      amount: 16.8,
      unit: 'kWh',
      date: '2026-07-03',
      createdAt: '2026-07-03T08:00:00Z',
    },
  ]);

  /**
   * Adds a new resource log entry.
   * @param dto LogResourceDTO containing type, amount, unit, category, and date.
   */
  async addLog(dto: LogResourceDTO): Promise<ResourceLog> {
    const newLog: ResourceLog = {
      id: `log-${Date.now()}`,
      userId: 'demo_user_123',
      householdId: 'demo_user_123',
      neighborhoodId: 'green-valley-subdivision',
      type: dto.type,
      amount: dto.amount,
      unit: dto.unit,
      category: dto.category,
      date: dto.date,
      createdAt: new Date().toISOString(),
    };

    // Update signal state
    this.logs.update((current) => [newLog, ...current]);
    return newLog;
  }

  /**
   * Imports multiple resource logs from CSV or JSON file upload.
   * @param importedLogs Array of LogResourceDTO entries
   */
  async bulkImportLogs(importedLogs: LogResourceDTO[]): Promise<number> {
    const formatted = importedLogs.map((dto, idx) => ({
      id: `import-${Date.now()}-${idx}`,
      userId: 'demo_user_123',
      householdId: 'demo_user_123',
      neighborhoodId: 'green-valley-subdivision',
      type: dto.type,
      amount: dto.amount,
      unit: dto.unit,
      category: dto.category,
      date: dto.date,
      createdAt: new Date().toISOString(),
    }));

    this.logs.update((current) => [...formatted, ...current]);
    return formatted.length;
  }

  /**
   * Filters logs by resource type.
   * @param type ResourceType ('electricity' | 'water' | 'waste')
   */
  getLogsByType(type: ResourceType): ResourceLog[] {
    return this.logs().filter((log) => log.type === type);
  }

  /**
   * Calculates total consumption for a specific resource type.
   * @param type ResourceType
   */
  getTotalByType(type: ResourceType): number {
    return this.getLogsByType(type).reduce((sum, log) => sum + log.amount, 0);
  }
}
