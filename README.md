# EcoCommune — AI-Powered Smart Community Resource Optimization

EcoCommune is a production-grade web application focused on household and neighborhood-level resource optimization (energy, water, and waste) to drive collective behavior change through AI insights and anonymized community benchmarks.

---

## Folder Layout Structure

| Directory | Purpose |
| :--- | :--- |
| `/apps/web` | [Angular 19 Application](file:///d:/AI-2026/GenAIAcademy/EcoCommune/EcoCommune-Code/apps/web) with signals state management, glassmorphism design tokens, and WCAG 2.1 AA accessibility. |
| `/functions` | [TypeScript Cloud Functions v2](file:///d:/AI-2026/GenAIAcademy/EcoCommune/EcoCommune-Code/functions) implementing Zod validators, caching, and server-side aggregation. |
| `/libs/shared-types` | [Shared Library](file:///d:/AI-2026/GenAIAcademy/EcoCommune/EcoCommune-Code/libs/shared-types/index.ts) containing shared TypeScript models, DTOs, and interface declarations. |
| `/bigquery` | [SQL Schemas & BigQuery ML](file:///d:/AI-2026/GenAIAcademy/EcoCommune/EcoCommune-Code/bigquery) partitioned tables and `ARIMA_PLUS` forecast training definitions. |
| `/terraform` | [Terraform Infrastructure as Code](file:///d:/AI-2026/GenAIAcademy/EcoCommune/EcoCommune-Code/terraform) scripts for automating GCP project resource provisioning. |
| `/docs` | [Technical Documentation](file:///d:/AI-2026/GenAIAcademy/EcoCommune/EcoCommune-Code/docs) detailing architecture, setups, and testing guidelines. |

---

## Google Technology Stack Mandate
This project is built **exclusively** on Google technologies and services:
- **Frontend**: Angular 19, Angular Material, Vanilla CSS.
- **Hosting**: Firebase Hosting.
- **Auth**: Firebase Authentication (Google Sign-In + Email link).
- **Database**: Cloud Firestore (operational records) & BigQuery (analytics warehouse).
- **Backend**: Cloud Functions for Firebase (2nd Gen Node.js 20 TypeScript).
- **AI/LLM**: Vertex AI (Gemini 1.5 Flash/Pro via `@google-cloud/vertexai` SDK).
- **Forecasting/ML**: BigQuery ML (`ARIMA_PLUS` time-series forecasting).
- **RAG/Grounding**: Vertex AI Search / Vertex AI RAG Engine grounded on Firestore exports.
- **Translation**: Cloud Translation API (`@google-cloud/translate`).
- **Analytics Visualization**: Looker Studio embedded reports.
- **Secrets**: Google Secret Manager.
- **Monitoring**: Google Cloud Operations Suite (Cloud Logging, Cloud Monitoring, Error Reporting).

---

## Verification & Testing Suite

Execute commands from the monorepo root:

```bash
# Install root workspace linting dependencies
npm install

# Run Cloud Function unit tests (Jest)
npm run test

# Run Firestore Security Rules emulator tests (@firebase/rules-unit-testing)
npm run test:rules

# Run Angular web app unit tests (Jasmine/Karma)
npm run test:web

# Run code quality linter checks (ESLint)
npm run lint
```

> [!IMPORTANT]
> **Test Coverage Target**: Minimum **75% statement coverage** must be maintained across all Cloud Functions and Angular services. Security rules tests must maintain **100% read/write denial boundary coverage**.

---

## AI Grounding Manual QA Checklist
To verify that the Gemini 1.5 chat assistant remains strictly grounded in the resident's logged Firestore records:

1. **Hallucination Check**: Query the assistant when logs are empty. Confirm it returns a safe empty-state message rather than fabricating consumption values.
2. **Value Accuracy Check**: Log a single record (e.g. `280 Liters` water on `2026-07-05`) and ask: *"How much water did I use on July 5th?"*. Verify the exact logged value matches the answer and references the verified grounding source.
3. **Context Boundary Isolation**: Ensure the assistant rejects prompts asking about other households' logs.

---

## Accessibility Notes (WCAG 2.1 AA Compliance)
- **High Contrast Palette**: Foreground text values maintain a contrast ratio ≥ 4.5:1 against glassmorphic slate background elements.
- **Screen Reader Data Tables**: Every data visualization trend (consumption trends, BigQuery forecasts) includes a hidden-by-default accessible HTML Table alternative with full semantic tags (`<caption>`, `scope="col"`, `aria-live`).
- **Logical CSS logical properties**: Forward-compatible logical properties (`margin-inline-start`, `padding-inline-end`) allow seamless translation to Right-to-Left (RTL) languages.
