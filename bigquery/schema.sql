-- BigQuery Schema for EcoCommune Resource Logging
-- Create Dataset: ecocommune_data

CREATE TABLE IF NOT EXISTS `ecocommune_data.resource_logs` (
  log_id STRING NOT NULL,
  user_id STRING NOT NULL,
  household_id STRING NOT NULL,
  resource_type STRING NOT NULL, -- 'electricity', 'water', 'waste'
  amount FLOAT64 NOT NULL,
  unit STRING NOT NULL, -- 'kWh', 'liters', 'kg'
  category STRING, -- e.g., 'recyclable', 'landfill', 'compostable' for waste
  log_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY log_date
CLUSTER BY resource_type, household_id;
