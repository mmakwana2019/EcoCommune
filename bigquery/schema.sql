-- BigQuery Schema for EcoCommune Analytics Warehouse
-- Optimization Strategy:
-- 1. Partitioned by `log_date` (MONTH resolution): Ensures queries filtering by date ranges scan only relevant partition slots, drastically reducing BQ processing bytes & costs.
-- 2. Clustered by `resource_type` and `household_id`: Co-locates rows by resource type and household ID for ultra-fast time-series analysis and k-anonymity benchmark aggregations.
-- 3. Avoids `SELECT *` by providing targeted view projections.

CREATE SCHEMA IF NOT EXISTS `ecocommune_data`
OPTIONS (
  location = 'US'
);

CREATE TABLE IF NOT EXISTS `ecocommune_data.resource_logs` (
  log_id STRING NOT NULL,
  user_id STRING NOT NULL,
  household_id STRING NOT NULL,
  neighborhood_id STRING NOT NULL,
  resource_type STRING NOT NULL, -- 'electricity', 'water', 'waste'
  amount FLOAT64 NOT NULL,       -- kWh, Liters, or kg
  unit STRING NOT NULL,         -- 'kWh', 'liters', 'kg'
  category STRING,              -- 'recyclable', 'compostable', 'landfill' for waste
  log_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE_TRUNC(log_date, MONTH)
CLUSTER BY resource_type, household_id;

-- Server-side k-Anonymity aggregated benchmark view
-- Enforces k >= 5 household minimum threshold to prevent individual household re-identification
CREATE OR REPLACE VIEW `ecocommune_data.v_community_benchmarks_k5` AS
SELECT
  neighborhood_id,
  resource_type,
  DATE_TRUNC(log_date, MONTH) AS benchmark_month,
  AVG(amount) AS avg_household_consumption,
  COUNT(DISTINCT household_id) AS total_households_count
FROM
  `ecocommune_data.resource_logs`
GROUP BY
  neighborhood_id, resource_type, benchmark_month
HAVING
  COUNT(DISTINCT household_id) >= 5; -- Strict k-Anonymity (k >= 5)
