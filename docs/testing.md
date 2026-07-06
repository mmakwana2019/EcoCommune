# Testing Guide

## Unit Tests

### Cloud Functions
We use Jest for testing Cloud Functions.
1. `cd functions`
2. `npm install`
3. Run `npm run test`
*Coverage requirement: At least 75% statement coverage, specifically testing the happy path, invalid inputs (Zod schema validation), and unauthenticated access rejections.*

### Angular App
We use Karma/Jasmine (default Angular scaffold) for frontend tests.
1. `cd apps/web`
2. Run `npm run test`

## Integration Tests (Firestore Security Rules)
We use the `@firebase/rules-unit-testing` library to ensure data isolation.
1. Start the emulators: `firebase emulators:start`
2. In another terminal, run `npm run test:rules`
This will verify that `Alice` cannot read `Bob`'s resource logs.

## Manual QA Checklist

### AI Grounding Verification
To ensure the Gemini assistant is properly grounded via RAG and not hallucinating:
- [ ] Log a unique electricity value (e.g., `432.1 kWh`) for a specific date.
- [ ] Ask the Conversational Assistant: "How much electricity did I use on [Date]?"
- [ ] Verify the assistant responds with `432.1 kWh` and does not provide an external average or fabricated number.
- [ ] Ask the assistant: "Why did my bill spike?" and verify its explanation references only the data present in your recent logs (e.g., if water usage was high, it mentions water, not unlogged gas usage).

### Accessibility Verification
- [ ] Run Lighthouse Accessibility audit on `localhost:4200` (Target: 100).
- [ ] Navigate the entire dashboard and logging forms using only the `Tab` key.
- [ ] Activate VoiceOver (Mac) or NVDA (Windows) and ensure form validation errors are announced immediately via `aria-live` regions.
