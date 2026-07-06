# EcoCommune

**EcoCommune** is a production-grade web application focused on household and neighborhood-level energy, water, and waste optimization. Built exclusively on Google technologies.

## Features
- **Resource Logging:** Track electricity, water, and waste.
- **AI Insights Engine:** Gemini-powered personalized reduction actions.
- **Predictive Forecasting:** BigQuery ML ARIMA_PLUS models.
- **Community Benchmarks:** Looker Studio embedded reports for social proof.
- **Conversational Assistant:** Vertex AI RAG grounded on user data.

## Project Structure
- `/apps/web` — Angular frontend application
- `/functions` — Firebase Cloud Functions backend (TypeScript)
- `/libs/shared-types` — Shared TypeScript interfaces
- `/docs` — Architecture, setup, and testing documentation
- `/bigquery` — SQL schemas and BQML definitions

## Quick Start
See `/docs/setup.md` for local emulation and deployment instructions.

## Accessibility Notes
- Target: WCAG 2.1 AA.
- High contrast themes and CSS variables implemented for dark/light modes.
- ARIA labels included on core interactive elements.
- RTL layout support via CSS Logical Properties (e.g., `margin-inline-start`) for future multilingual scaling.

## Testing & QA
See `/docs/testing.md` for unit and integration testing commands, as well as a QA checklist for the AI Grounding features.
