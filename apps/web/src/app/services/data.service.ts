import { Injectable } from '@angular/core';
import { ResourceLog, AIInsight, CommunityBenchmark } from '../../../../../libs/shared-types';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() {}

  getInsights(): Observable<AIInsight[]> {
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        householdId: 'user123',
        title: 'Electricity Spike Detected',
        description: 'Your electricity usage yesterday was 20% higher than your average. AC usage might be the cause.',
        actionableSteps: [
          'Set AC thermostat 2 degrees higher.',
          'Use ceiling fans to circulate air.'
        ],
        dateGenerated: new Date().toISOString()
      },
      {
        id: '2',
        householdId: 'user123',
        title: 'Great Job on Water Conservation!',
        description: 'You used 10% less water this week compared to last week.',
        actionableSteps: [
          'Keep up the short showers!',
          'Check for any running toilets to maintain this streak.'
        ],
        dateGenerated: new Date().toISOString()
      }
    ];
    return of(mockInsights).pipe(delay(500));
  }

  getBenchmarks(): Observable<CommunityBenchmark[]> {
    const mockBenchmarks: CommunityBenchmark[] = [
      {
        neighborhoodId: 'nh_1',
        resourceType: 'electricity',
        averageConsumption: 450,
        percentile: 25, // User is in top 25% (doing better than 75%)
        period: '2026-06'
      },
      {
        neighborhoodId: 'nh_1',
        resourceType: 'water',
        averageConsumption: 3000,
        percentile: 60, // User is using more than average
        period: '2026-06'
      }
    ];
    return of(mockBenchmarks).pipe(delay(600));
  }
}
