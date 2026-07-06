# EcoCommune Testing Specification

## 1. Automated Test Execution

### Root Monorepo Commands
- Run all Cloud Function unit tests:
  ```bash
  npm run test
  ```
- Run Firestore Security Rules emulator tests:
  ```bash
  npm run test:rules
  ```
- Run Angular frontend unit tests:
  ```bash
  npm run test:web
  ```
- Run code quality linter checks:
  ```bash
  npm run lint
  ```

### Test Coverage Targets
We maintain a strict code coverage target:
- **Minimum Statement Coverage**: **75%** across all Cloud Functions and Angular services.
- **Rules Coverage**: **100%** coverage for read/write denial boundaries in `firestore.rules`.

---

## 2. AI Grounding Manual QA Checklist
To ensure the Vertex AI (Gemini 1.5) RAG conversational assistant does not fabricate numbers or hallucinate context:

1. **Verify Empty-State RAG Response**:
   - Create a clean test user account with zero logged records.
   - Send query: *"Why did my water usage spike this month?"*
   - **Expected Behavior**: The assistant must output a polite fallback message indicating no logs were found, rather than fabricating consumption values.

2. **Verify Correct RAG Association**:
   - Log exactly one record: `electricity = 45.2 kWh` on `2026-07-06`.
   - Ask the chat assistant: *"Tell me about my electricity logs."*
   - **Expected Behavior**: Response must strictly reference `45.2 kWh` and `2026-07-06` as documented in the "Verified Grounding Sources" metadata box.

3. **Verify Context Boundary Rejection**:
   - Ask the chat assistant: *"What is my neighborhood's water average?"*
   - **Expected Behavior**: Response must draw only on neighborhood aggregates or indicate lack of authorization rather than fabricating other household metrics.
