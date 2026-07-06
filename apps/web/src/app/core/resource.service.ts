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
   * Generates 2 months (60 days) of daily dummy logs for electricity, water, and waste.
   */
  private generateDummyData(): ResourceLog[] {
    const list: ResourceLog[] = [];
    const today = new Date('2026-07-06');
    const userId = 'demo_user_123';
    const neighborhoodId = 'green-valley-subdivision';

    for (let i = 0; i < 60; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - i);
      const dateStr = targetDate.toISOString().split('T')[0];

      // 1. Electricity log every day
      const elecAmount = Math.round((12 + Math.sin(i / 5) * 4 + Math.random() * 2) * 10) / 10;
      list.push({
        id: `gen-elec-${i}`,
        userId,
        householdId: userId,
        neighborhoodId,
        type: 'electricity',
        amount: elecAmount,
        unit: 'kWh',
        date: dateStr,
        createdAt: `${dateStr}T08:00:00Z`
      });

      // 2. Water log every day
      const waterAmount = Math.round(230 + Math.cos(i / 7) * 40 + Math.random() * 20);
      list.push({
        id: `gen-water-${i}`,
        userId,
        householdId: userId,
        neighborhoodId,
        type: 'water',
        amount: waterAmount,
        unit: 'liters',
        date: dateStr,
        createdAt: `${dateStr}T09:15:00Z`
      });

      // 3. Waste log every 3 days
      if (i % 3 === 0) {
        const wasteAmount = Math.round((1.2 + Math.random() * 1.5) * 10) / 10;
        const categories: ('recyclable' | 'compostable' | 'landfill')[] = ['compostable', 'recyclable', 'landfill'];
        const cat = categories[i % 3];
        list.push({
          id: `gen-waste-${i}`,
          userId,
          householdId: userId,
          neighborhoodId,
          type: 'waste',
          amount: wasteAmount,
          unit: 'kg',
          category: cat,
          date: dateStr,
          createdAt: `${dateStr}T18:30:00Z`
        });
      }
    }
    return list;
  }

  /**
   * Reactive signal containing historical resource logs.
   */
  readonly logs = signal<ResourceLog[]>(this.generateDummyData());

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
