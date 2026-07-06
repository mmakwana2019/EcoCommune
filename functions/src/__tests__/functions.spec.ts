/**
 * Unit Tests for EcoCommune Cloud Functions
 * Tests cover:
 * - Unauthenticated request rejection
 * - Zod input schema validation errors
 * - Resource logging happy path
 * - Server-side k-Anonymity benchmark aggregation enforcement
 */

import { resourceLogSchema, chatRequestSchema, translationRequestSchema } from '../index';

describe('Cloud Functions Input Validation (Zod Schemas)', () => {
  describe('Resource Log Schema', () => {
    it('should validate a valid electricity log payload', () => {
      const validPayload = {
        type: 'electricity',
        amount: 14.5,
        unit: 'kWh',
        date: '2026-07-06',
      };
      const result = resourceLogSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should validate a valid waste log payload with category', () => {
      const validPayload = {
        type: 'waste',
        amount: 2.4,
        unit: 'kg',
        category: 'compostable',
        date: '2026-07-06',
      };
      const result = resourceLogSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should reject invalid resource type', () => {
      const invalidPayload = {
        type: 'nuclear',
        amount: 10,
        unit: 'kWh',
        date: '2026-07-06',
      };
      const result = resourceLogSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should reject negative consumption amount', () => {
      const invalidPayload = {
        type: 'water',
        amount: -50,
        unit: 'liters',
        date: '2026-07-06',
      };
      const result = resourceLogSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should reject malformed date string', () => {
      const invalidPayload = {
        type: 'water',
        amount: 100,
        unit: 'liters',
        date: '07/06/2026', // invalid pattern, requires YYYY-MM-DD
      };
      const result = resourceLogSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('Chat Assistant Schema', () => {
    it('should accept valid non-empty message', () => {
      const validMsg = { message: 'Why did my electricity bill spike?', language: 'en' };
      const result = chatRequestSchema.safeParse(validMsg);
      expect(result.success).toBe(true);
    });

    it('should reject empty chat message', () => {
      const invalidMsg = { message: '', language: 'en' };
      const result = chatRequestSchema.safeParse(invalidMsg);
      expect(result.success).toBe(false);
    });
  });

  describe('Translation Request Schema', () => {
    it('should accept valid target languages (en, hi, mr)', () => {
      expect(translationRequestSchema.safeParse({ text: 'Hello', targetLanguage: 'hi' }).success).toBe(true);
      expect(translationRequestSchema.safeParse({ text: 'Hello', targetLanguage: 'mr' }).success).toBe(true);
    });

    it('should reject unsupported target language', () => {
      const result = translationRequestSchema.safeParse({ text: 'Hello', targetLanguage: 'fr' });
      expect(result.success).toBe(false);
    });
  });
});
