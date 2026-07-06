# EcoCommune Setup & Deployment Guide

## Prerequisites
- **Node.js**: v20 LTS or higher
- **Firebase CLI**: `npm install -g firebase-tools`
- **Google Cloud SDK**: `gcloud` CLI installed and authenticated
- **Terraform** (optional): v1.5+ for IaC provisioning

## 1. GCP Project & Secret Manager Initialization
1. Create a Google Cloud Project or select an existing one:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```
2. Enable required Google Cloud APIs:
   ```bash
   gcloud services enable \
     firestore.googleapis.com \
     bigquery.googleapis.com \
     aiplatform.googleapis.com \
     translate.googleapis.com \
     secretmanager.googleapis.com \
     cloudfunctions.googleapis.com \
     firebaseappcheck.googleapis.com
   ```
3. Store production secrets in Google Secret Manager:
   ```bash
   gcloud secrets create ecocommune-vertex-ai-key --replication-policy="automatic"
   ```

## 2. BigQuery & BigQuery ML Provisioning
Execute the SQL schema definitions in your GCP console or via `bq` CLI:
```bash
bq query --use_legacy_sql=false < bigquery/schema.sql
bq query --use_legacy_sql=false < bigquery/model.sql
```

## 3. Local Emulator Suite Setup
Run the Firebase Local Emulator Suite for offline development:
```bash
firebase emulators:start
```
Emulators initialized:
- Firestore: `http://localhost:8080`
- Cloud Functions: `http://localhost:5001`
- Hosting: `http://localhost:5000`
- Emulator UI: `http://localhost:4000`

## 4. Angular Frontend Development & Deployment
Install dependencies and launch dev server:
```bash
cd apps/web
npm install
npm start
```
Open `http://localhost:4200` in your web browser.

Deploy to Firebase Hosting:
```bash
npm run build
firebase deploy --only hosting
```
