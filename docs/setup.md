# Setup Instructions

## Prerequisites
- Node.js v22 or v24
- Angular CLI v19
- Firebase CLI
- A Google Cloud Platform (GCP) Project with billing enabled

## Local Development

1. **Install Dependencies:**
   - For frontend: `cd apps/web && npm install`
   - For backend: `cd functions && npm install`

2. **Firebase Emulator Setup (Prototype Mode):**
   - We use the Firebase Emulator Suite to run Firestore, Auth, and Functions locally without incurring cloud costs.
   - Run `firebase emulators:start` from the root directory.

3. **Running the Frontend:**
   - In a new terminal, run `cd apps/web && npm run start`
   - The application will be available at `http://localhost:4200`

## GCP Deployment (Production)

1. **Enable APIs:**
   Ensure the following APIs are enabled in your GCP project:
   - Vertex AI API
   - BigQuery API
   - Cloud Translation API

2. **Secret Manager:**
   - Add any necessary API keys or sensitive configurations to Google Secret Manager.
   - Grant the App Engine Default Service Account (used by Cloud Functions) access to these secrets.

3. **Deploy:**
   - Run `firebase deploy` to deploy Hosting, Firestore Rules, Indexes, and Cloud Functions.
