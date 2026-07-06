export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  householdId: string;
}

export type ResourceType = 'electricity' | 'water' | 'waste';

export interface ResourceLog {
  id?: string;
  userId: string;
  householdId: string;
  type: ResourceType;
  amount: number;
  unit: string;
  category?: string; // e.g. recyclable, compostable, landfill
  date: string;
}

export interface AIInsight {
  id?: string;
  householdId: string;
  title: string;
  description: string;
  actionableSteps: string[];
  dateGenerated: string;
}

export interface CommunityBenchmark {
  neighborhoodId: string;
  resourceType: ResourceType;
  averageConsumption: number;
  percentile: number;
  period: string; // e.g. "2026-06"
}
