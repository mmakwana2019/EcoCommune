# EcoCommune Architecture Specification

## Overview
**EcoCommune** is a production-grade web application for the theme *"AI for Better Living and Smarter Communities"*. It enables household and neighborhood-level energy (kWh), water (liters), and waste (kg by category) optimization.

## Mandated Google Stack Architecture

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                Angular 19 Web App (Firebase Hosting)                      │
│ ┌───────────────────────┐ ┌──────────────────────┐ ┌────────────────────┐ ┌─────────────┐ │
│ │ Resource Logging UI   │ │  AI Insights Engine  │ │ BigQuery ML View   │ │ Benchmarks  │ │
│ └───────────────────────┘ └──────────────────────┘ └────────────────────┘ └─────────────┘ │
└─────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                              │ Firebase Auth (Google Sign-In + Email Link)
                                              │ Firebase App Check
                                              ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                         Cloud Functions for Firebase (2nd Gen TypeScript)                 │
│ ┌────────────────────────┐ ┌─────────────────────────┐ ┌────────────────────────────────┐ │
│ │  Zod Input Validator   │ │  24-Hr Firestore Cache  │ │  k-Anonymity Aggregator (k>=5) │ │
│ └────────────────────────┘ └─────────────────────────┘ └────────────────────────────────┘ │
└───────────┬─────────────────────────────────┬──────────────────────────────┬──────────────┘
            │                                 │                              │
            ▼                                 ▼                              ▼
┌─────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│     Cloud Firestore     │       │     Vertex AI SDK      │       │  BigQuery & BQ ML      │
│ (Operational Store)     │       │  (Gemini 1.5 & RAG)    │       │ (ARIMA_PLUS Model)     │
└─────────────────────────┘       └────────────────────────┘       └────────────────────────┘
            │                                 │                              │
            ▼                                 ▼                              ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│      Google Cloud Operations Suite, Cloud Translation API, Secret Manager, IaC (Terraform)│
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

## System Component Matrix

| Architectural Layer | Mandated Technology | Function in EcoCommune |
| :--- | :--- | :--- |
| **Frontend Framework** | Angular 19 (Standalone Components) | Single-page application with signals state management, WCAG 2.1 AA accessibility, and OnPush change detection |
| **Hosting** | Firebase Hosting | Production CDN hosting for Angular client artifacts |
| **Authentication** | Firebase Authentication | Google Sign-In and passwordless email link authentication |
| **Operational Store** | Cloud Firestore | Isolated document storage per household (`/users/{userId}/**`) |
| **Analytics Warehouse**| BigQuery | Partitioned (`log_date`) and clustered (`resource_type`, `household_id`) resource logging dataset |
| **Backend Functions** | Cloud Functions v2 (TypeScript) | Serverless API runtime with Zod input validation and server-side aggregation |
| **AI LLM Engine** | Vertex AI (Gemini 1.5 Flash/Pro) | Weekly personalized reduction insights and grounded RAG conversational assistant |
| **Time-Series ML** | BigQuery ML (`ARIMA_PLUS`) | 30-day consumption forecasting and continuous leak anomaly detection |
| **Translation** | Cloud Translation API | Dynamic multilingual translation support for English, Hindi, and Marathi |
| **Analytics Visualization** | Looker Studio | Embedded community benchmark reports sourced from BigQuery |
| **Secret Management** | Google Secret Manager | Secure storage for API keys and service account credentials |
| **Operations** | Cloud Operations Suite | Cloud Logging, Cloud Monitoring, and Error Reporting |

## Security & Privacy Rationale

### 1. Firestore Security Rules & Per-User Isolation
Every household document is stored under `/users/{userId}/resourceLogs/{logId}`. Firestore Security Rules enforce strict ownership:
`request.auth.uid == userId`
Clients cannot read or write another household's raw records.

### 2. Server-Side k-Anonymity (k ≥ 5) Threshold
To prevent re-identification of individual households in neighborhood comparison dashboards:
- Community benchmark metrics are aggregated server-side only in Cloud Functions and BigQuery views (`HAVING COUNT(DISTINCT household_id) >= 5`).
- If a neighborhood contains fewer than 5 registered households, detailed percentiles are suppressed and a safe baseline is returned.

### 3. Cold-Start Optimization & AI Response Caching
- Heavy Google Cloud SDK clients (`VertexAI`, `TranslationServiceClient`) are lazy-loaded inside Cloud Function invocation handlers.
- Weekly AI Insight recommendations are stored in a 24-hour TTL Firestore cache (`/users/{userId}/insights_cache/latest`) to avoid redundant Vertex AI calls.
