-- BigQuery ML Model & Anomaly Detection Queries for EcoCommune
-- Model Rationale:
-- ARIMA_PLUS is Google BigQuery's native automated time-series forecasting model algorithm.
-- It automatically performs seasonal decomposition, trend fitting, outlier detection, and holiday adjustment
-- without requiring external python container runtimes or third-party ML frameworks.

-- 1. Create or replace the BigQuery ML ARIMA_PLUS model for monthly household energy forecasting
CREATE OR REPLACE MODEL `ecocommune_data.energy_forecast_model`
OPTIONS (
  model_type = 'ARIMA_PLUS',
  time_series_timestamp_col = 'log_month',
  time_series_data_col = 'total_monthly_amount',
  time_series_id_col = 'household_id',
  data_frequency = 'MONTHLY',
  auto_arima = TRUE
) AS
SELECT
  household_id,
  DATE_TRUNC(log_date, MONTH) AS log_month,
  SUM(amount) AS total_monthly_amount
FROM
  `ecocommune_data.resource_logs`
WHERE
  resource_type = 'electricity'
GROUP BY
  household_id, log_month;

-- 2. Forecasting Query: Predict next-month consumption for household
SELECT
  household_id,
  forecast_timestamp,
  forecast_value,
  standard_error,
  confidence_level,
  prediction_interval_lower_bound,
  prediction_interval_upper_bound
FROM
  ML.FORECAST(
    MODEL `ecocommune_data.energy_forecast_model`,
    STRUCT(1 AS horizon, 0.95 AS confidence_level)
  );

-- 3. Anomaly Detection Query: Flag unexpected consumption spikes (e.g. water leaks)
SELECT
  household_id,
  log_month,
  total_monthly_amount,
  is_anomaly,
  lower_bound,
  upper_bound,
  anomaly_probability
FROM
  ML.DETECT_ANOMALIES(
    MODEL `ecocommune_data.energy_forecast_model`,
    STRUCT(0.95 AS anomaly_prob_threshold)
  )
WHERE
  is_anomaly = TRUE;
