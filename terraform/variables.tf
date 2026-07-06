variable "gcp_project_id" {
  type        = string
  description = "Target Google Cloud Project ID"
  default     = "ecocommune-production"
}

variable "gcp_region" {
  type        = string
  description = "Google Cloud primary region"
  default     = "us-central1"
}

variable "environment" {
  type        = string
  description = "Deployment environment stage"
  default     = "production"
}
