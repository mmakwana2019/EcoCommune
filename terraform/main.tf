# Terraform Infrastructure as Code (IaC) for EcoCommune (Google Cloud Provider)

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.15.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# 1. Cloud Firestore Native Database
resource "google_firestore_database" "default" {
  project     = var.gcp_project_id
  name        = "(default)"
  location_id = var.gcp_region
  type        = "FIRESTORE_NATIVE"
}

# 2. BigQuery Analytics Warehouse Dataset
resource "google_bigquery_dataset" "ecocommune_dataset" {
  dataset_id                  = "ecocommune_data"
  friendly_name               = "EcoCommune Resource Logging Warehouse"
  description                 = "Analytics dataset for energy, water, and waste logs with ARIMA_PLUS forecasting"
  location                    = "US"
  default_table_expiration_ms = 315360000000 # 10 years
}

# 3. Google Secret Manager for production API keys and system secrets
resource "google_secret_manager_secret" "vertex_ai_key" {
  secret_id = "ecocommune-vertex-ai-key"

  replication {
    auto {}
  }
}

# 4. Cloud Storage Bucket for Cloud Functions deployment artifacts
resource "google_storage_bucket" "functions_bucket" {
  name                        = "${var.gcp_project_id}-functions-bucket"
  location                    = var.gcp_region
  uniform_bucket_level_access = true
  force_destroy               = true
}

# 5. Cloud Function v2 Service Account & IAM roles
resource "google_service_account" "ecocommune_backend" {
  account_id   = "ecocommune-backend-sa"
  display_name = "EcoCommune Cloud Functions Service Account"
}

resource "google_project_iam_member" "firestore_access" {
  project = var.gcp_project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.ecocommune_backend.email}"
}

resource "google_project_iam_member" "vertex_access" {
  project = var.gcp_project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.ecocommune_backend.email}"
}
