/**
 * Unit Tests for Firestore Security Rules (@firebase/rules-unit-testing)
 * Ensures strict per-user data isolation:
 * - User A can read/write their own /users/userA documents
 * - User A CANNOT read or write User B's /users/userB documents
 */

import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import * as fs from 'fs';
import * as path from 'path';

describe('Firestore Security Rules', () => {
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    const rulesPath = path.resolve(__dirname, '../../../firestore.rules');
    const rules = fs.readFileSync(rulesPath, 'utf8');

    testEnv = await initializeTestEnvironment({
      projectId: 'ecocommune-test-project',
      firestore: {
        rules,
        host: '127.0.0.1',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  afterEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore();
    }
  });

  it('should allow authenticated user to write to their own resource logs collection', async () => {
    const aliceDb = testEnv.authenticatedContext('alice_123').firestore();
    const aliceLogRef = aliceDb.collection('users/alice_123/resourceLogs').doc('log_1');

    await assertSucceeds(aliceLogRef.set({
      userId: 'alice_123',
      type: 'electricity',
      amount: 12.5,
      unit: 'kWh',
      date: '2026-07-06',
    }));
  });

  it('should deny user B from reading user A resource logs collection', async () => {
    const bobDb = testEnv.authenticatedContext('bob_456').firestore();
    const aliceLogRef = bobDb.collection('users/alice_123/resourceLogs').doc('log_1');

    await assertFails(aliceLogRef.get());
  });

  it('should deny unauthenticated requests to any user collection', async () => {
    const unauthDb = testEnv.unauthenticatedContext().firestore();
    const anyLogRef = unauthDb.collection('users/alice_123/resourceLogs').doc('log_1');

    await assertFails(anyLogRef.get());
    await assertFails(anyLogRef.set({ amount: 100 }));
  });
});
