# EcoCommune Architecture

EcoCommune is designed entirely on Google Cloud Platform to ensure seamless integration, high security, and performance.

## Data Flow & Architecture

1. **Frontend (Angular on Firebase Hosting):**
   - The user interacts with the Angular web app.
   - Authentication is handled via Firebase Authentication.
   - The app reads directly from Cloud Firestore using the Firebase JS SDK, governed by strict Firestore Security Rules.

2. **Resource Logging & Backend (Cloud Functions):**
   - When a user logs a resource (energy/water/waste), the frontend calls a Cloud Function (`processResourceLog`).
   - The Cloud Function validates the payload using Zod.
   - The function saves the log to Firestore.
   - The function invokes the **AI Insights Engine**.

3. **AI Insights Engine & Chatbot (Vertex AI):**
   - The backend uses the Vertex AI Node.js SDK to send context (the user's recent logs) and a prompt to Gemini 1.5 Pro.
   - The generated insights are stored in Firestore, which the Angular app receives via real-time listeners.
   - The Conversational Assistant uses Vertex AI Search/RAG Engine to ground the chat responses in the user's historical data, preventing hallucinations.

4. **Forecasting (BigQuery ML):**
   - Operational data is continuously exported from Firestore to BigQuery.
   - A BigQuery ML `ARIMA_PLUS` model runs scheduled queries to forecast next-month consumption based on time-series data.
   - These forecasts are materialized into a BigQuery table, which Looker Studio or Cloud Functions can query for dashboard presentation.

5. **Community Benchmarking:**
   - Raw user data is never exposed. A scheduled Cloud Function or BigQuery query aggregates data at the neighborhood level (k-anonymity enforced, e.g., >5 households).
   - Looker Studio connects to BigQuery to visualize the aggregated percentiles and benchmarks.

6. **Translation (Cloud Translation API):**
   - Static strings are handled by Angular i18n.
   - Dynamic AI responses can be translated on-the-fly using the Cloud Translation API if the user's preferred language is non-English.
