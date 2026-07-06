/**
 * Shared Type Definitions for EcoCommune Monorepo
 * Shared between Angular Web Frontend and Firebase Cloud Functions backend.
 */

export type ResourceType = 'electricity' | 'water' | 'waste';

export type WasteCategory = 'recyclable' | 'compostable' | 'landfill';

export type LanguageCode = 'en' | 'hi' | 'mr';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  householdId: string;
  neighborhoodId: string;
  preferredLanguage?: LanguageCode;
  createdAt: string;
}

export interface ResourceLog {
  id?: string;
  userId: string;
  householdId: string;
  neighborhoodId: string;
  type: ResourceType;
  amount: number; // kWh for electricity, Liters for water, kg for waste
  unit: string;   // 'kWh' | 'liters' | 'kg'
  category?: WasteCategory;
  date: string;   // YYYY-MM-DD
  createdAt?: string;
}

export interface LogResourceDTO {
  type: ResourceType;
  amount: number;
  unit: string;
  category?: WasteCategory;
  date: string;
}

export interface ReductionAction {
  id: string;
  title: string;
  description: string;
  estimatedSavings: string; // e.g. "12 kWh/month" or "$15/month"
  impactLevel: 'high' | 'medium' | 'low';
  category: ResourceType;
}

export interface AIInsight {
  id?: string;
  householdId: string;
  title: string;
  description: string;
  actionableSteps: ReductionAction[];
  dateGenerated: string;
  isCached?: boolean;
}

export interface ForecastDataPoint {
  date: string;
  predictedValue: number;
  lowerBound: number;
  upperBound: number;
  isAnomaly?: boolean;
  anomalyReason?: string;
}

export interface PredictiveForecast {
  householdId: string;
  resourceType: ResourceType;
  period: string; // e.g., "Next 30 Days"
  totalPredicted: number;
  unit: string;
  forecastPoints: ForecastDataPoint[];
  anomalyAlert?: {
    flagged: boolean;
    message: string;
    detectedDate?: string;
  };
}

export interface CommunityBenchmark {
  neighborhoodId: string;
  resourceType: ResourceType;
  householdPercentile: number; // User's percentile (e.g. 75th percentile)
  neighborhoodAverage: number;
  householdAverage: number;
  totalHouseholdsInBenchmark: number;
  kAnonymityMet: boolean;
  period: string; // e.g. "July 2026"
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  groundedSources?: {
    logDate: string;
    resourceType: ResourceType;
    amount: number;
    unit: string;
  }[];
}

export interface ChatRequestDTO {
  message: string;
  language?: LanguageCode;
}

export interface TranslationRequestDTO {
  text: string;
  targetLanguage: LanguageCode;
}

export interface TranslationResponseDTO {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: LanguageCode;
}
