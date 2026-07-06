-- BigQuery ML Model for Forecasting Next-Month Consumption
-- Uses ARIMA_PLUS for time-series forecasting.

CREATE OR REPLACE MODEL `ecocommune_data.energy_forecast_model`
OPTIONS(
  model_type='ARIMA_PLUS',
  time_series_timestamp_col='log_month',
  time_series_data_col='total_amount',
  time_series_id_col='household_id',
  data_frequency='MONTHLY'
) AS
SELECT
  household_id,
  DATE_TRUNC(log_date, MONTH) AS log_month,
  SUM(amount) AS total_amount
FROM
  `ecocommune_data.resource_logs`
WHERE
  resource_type = 'electricity'
GROUP BY
  household_id, log_month;
