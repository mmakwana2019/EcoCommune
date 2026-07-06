output "firestore_database_name" {
  value       = google_firestore_database.default.name
  description = "Name of provisioned Cloud Firestore native database"
}

output "bigquery_dataset_id" {
  value       = google_bigquery_dataset.ecocommune_dataset.dataset_id
  description = "ID of provisioned BigQuery analytics dataset"
}

output "backend_service_account" {
  value       = google_service_account.ecocommune_backend.email
  description = "Email of Cloud Functions service account"
}
