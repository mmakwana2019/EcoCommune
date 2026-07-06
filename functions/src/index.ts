import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { ResourceLog, AIInsight } from '../../libs/shared-types';

admin.initializeApp();

// Zod schema for input validation
const resourceLogSchema = z.object({
  type: z.enum(['electricity', 'water', 'waste']),
  amount: z.number().positive(),
  unit: z.string(),
  category: z.string().optional(),
  date: z.string()
});

/**
 * Cloud Function to process a new resource log and generate AI insights.
 * Uses Vertex AI (Gemini 1.5 Pro) in a real deployment. This prototype uses a mock implementation.
 */
export const processResourceLog = functions.https.onCall(async (request) => {
  // Validate Authentication
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const data = request.data;

  // Validate Input
  const parseResult = resourceLogSchema.safeParse(data);
  if (!parseResult.success) {
    functions.logger.error('Invalid resource log payload', parseResult.error);
    throw new functions.https.HttpsError('invalid-argument', 'Invalid resource log payload.');
  }

  const log: ResourceLog = {
    userId: request.auth.uid,
    householdId: request.auth.uid, // Assuming householdId is uid for prototype
    ...parseResult.data
  };

  try {
    // 1. Save log to Firestore
    await admin.firestore().collection(`users/${log.userId}/resourceLogs`).add(log);

    // 2. Generate AI Insight (Mocked for prototype)
    // In production, this would call Vertex AI with context from the user's past data (RAG)
    const mockInsight: AIInsight = {
      householdId: log.householdId,
      title: 'Water Usage Spike Detected',
      description: 'Your water usage today is 15% higher than your neighborhood average. This could be due to summer watering.',
      actionableSteps: [
        'Consider watering plants early in the morning to reduce evaporation.',
        'Check your sprinkler system for leaks.'
      ],
      dateGenerated: new Date().toISOString()
    };

    await admin.firestore().collection(`users/${log.userId}/insights`).add(mockInsight);

    return { success: true, insightGenerated: true };
  } catch (error) {
    functions.logger.error('Error processing log', error);
    throw new functions.https.HttpsError('internal', 'An error occurred while processing the log.');
  }
});
