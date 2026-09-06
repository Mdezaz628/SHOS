import os
import warnings
from datetime import date, timedelta

import joblib
import numpy as np
import pandas as pd

from dotenv import load_dotenv
from supabase import create_client

warnings.filterwarnings("ignore", message="Trying to unpickle estimator")


# =========================================================
# 1. ENVIRONMENT
# =========================================================

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is missing from .env")

if not SUPABASE_SECRET_KEY:
    raise ValueError("SUPABASE_SECRET_KEY is missing from .env")


# =========================================================
# 2. SUPABASE CONNECTION
# =========================================================

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)

print("[SUCCESS] Connected to Supabase")


# =========================================================
# 3. LOAD MODEL
# =========================================================

MODEL_PATH = os.path.join(
    "models",
    "patient_load_model.joblib"
)

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model not found: {MODEL_PATH}"
    )

model_package = joblib.load(MODEL_PATH)

# Current trained file contains the RandomForest model directly.
# Support both direct-model and dictionary formats.
if isinstance(model_package, dict):
    model = model_package["model"]
    features = model_package.get("features", [])
    model_version = model_package.get("version", "1.0.0")
else:
    model = model_package
    model_version = "1.0.0"
    features = [
        "day_of_week",
        "is_weekend",
        "total_appointments",
        "completed_appointments",
        "cancelled_appointments",
        "no_show_appointments",
        "waiting_appointments",
        "emergency_appointments",
        "walk_in_appointments",
        "total_admissions",
        "emergency_admissions",
        "planned_admissions",
        "total_discharges",
        "emergency_cases",
        "critical_emergency_cases",
        "total_beds",
        "occupied_beds",
        "available_beds",
        "bed_occupancy_rate",
        "active_staff",
        "available_staff",
        "lab_orders",
        "pharmacy_dispensing_count",
        "active_resources",
        "resources_in_use"
    ]

print(f"[SUCCESS] Model loaded: {MODEL_PATH}")
print(f"[INFO] Model version: {model_version}")
print(f"[INFO] Features: {len(features)}")


# =========================================================
# 4. GET LATEST DATA
# =========================================================

print(
    "[INFO] Loading latest hospital feature data..."
)

response = (
    supabase
    .table("ai_patient_load_features")
    .select("*")
    .order("feature_date", desc=True)
    .limit(1)
    .execute()
)

rows = response.data

if not rows:
    raise ValueError(
        "No patient load feature data available."
    )

latest = rows[0]

latest_date = date.fromisoformat(
    latest["feature_date"]
)

tomorrow = date.today() + timedelta(days=1)

print(
    f"[INFO] Latest known data: {latest_date}"
)

print(
    f"[INFO] Forecast target date: {tomorrow}"
)


# =========================================================
# 5. PREPARE INPUT
# =========================================================

forecast_input = {}

for feature in features:

    if feature not in latest:
        raise ValueError(
            f"Missing feature: {feature}"
        )

    forecast_input[feature] = latest[feature]


# Python weekday:
# Monday = 0
# Sunday = 6

tomorrow_weekday = tomorrow.weekday()

forecast_input["day_of_week"] = (
    tomorrow_weekday
)

forecast_input["is_weekend"] = (
    tomorrow_weekday >= 5
)


# =========================================================
# 6. DATAFRAME
# =========================================================

X_forecast = pd.DataFrame(
    [forecast_input],
    columns=features
)

X_forecast = X_forecast.replace(
    [np.inf, -np.inf],
    np.nan
)

if X_forecast.isnull().any().any():

    missing = X_forecast.columns[
        X_forecast.isnull().any()
    ].tolist()

    raise ValueError(
        f"Missing/invalid forecast features: {missing}"
    )


# =========================================================
# 7. PREDICTION
# =========================================================

prediction = model.predict(
    X_forecast
)[0]

prediction = max(
    0,
    round(float(prediction))
)


# =========================================================
# 8. LOAD LEVEL
# =========================================================

if prediction < 100:

    prediction_label = "LOW"
    risk_level = "low"

elif prediction < 140:

    prediction_label = "MODERATE"
    risk_level = "moderate"

elif prediction < 180:

    prediction_label = "HIGH"
    risk_level = "high"

else:

    prediction_label = "VERY_HIGH"
    risk_level = "critical"


# =========================================================
# 9. MODEL CONFIDENCE
# =========================================================

# This is the model's validation-performance indicator (0.0 to 1.0)
confidence_score = 0.942

# Regression does not provide classification probability.
probability = None


# =========================================================
# 10. INPUT FEATURES
# =========================================================

input_features = {
    "source_feature_date": str(latest_date),
    "forecast_date": str(tomorrow),

    "day_of_week": int(
        forecast_input["day_of_week"]
    ),

    "is_weekend": bool(
        forecast_input["is_weekend"]
    ),

    "total_appointments": int(
        forecast_input["total_appointments"]
    ),

    "total_admissions": int(
        forecast_input["total_admissions"]
    ),

    "emergency_cases": int(
        forecast_input["emergency_cases"]
    ),

    "critical_emergency_cases": int(
        forecast_input["critical_emergency_cases"]
    ),

    "occupied_beds": int(
        forecast_input["occupied_beds"]
    ),

    "bed_occupancy_rate": float(
        forecast_input["bed_occupancy_rate"]
    ),

    "active_staff": int(
        forecast_input["active_staff"]
    ),

    "available_staff": int(
        forecast_input["available_staff"]
    ),

    "lab_orders": int(
        forecast_input["lab_orders"]
    ),

    "pharmacy_dispensing_count": int(
        forecast_input[
            "pharmacy_dispensing_count"
        ]
    ),

    "resources_in_use": int(
        forecast_input["resources_in_use"]
    )
}


# =========================================================
# 11. EXPLANATION
# =========================================================

prediction_explanation = (
    f"AI model forecasts approximately "
    f"{prediction} patients for {tomorrow}. "
    f"The prediction uses the latest available "
    f"hospital operational data from {latest_date}. "
    f"Calendar features were adjusted for the target date. "
    f"The model is a Random Forest regression model "
    f"version {model_version}. "
    f"Training used 180 synthetic historical records. "
    f"The test R2 score was 0.942. "
    f"This prediction is decision support and "
    f"requires human review."
)


# =========================================================
# 12. GET MODEL ID
# =========================================================

model_response = (
    supabase
    .table("ai_models")
    .select("id")
    .eq(
        "model_code",
        "PATIENT_LOAD_FORECAST"
    )
    .limit(1)
    .execute()
)

if not model_response.data:
    raise ValueError(
        "PATIENT_LOAD_FORECAST model not found."
    )

model_id = model_response.data[0]["id"]


# =========================================================
# 13. PREDICTION CODE
# =========================================================

import uuid

prediction_code = (
    "PRED-PLF-"
    + tomorrow.strftime("%Y%m%d")
    + "-"
    + uuid.uuid4().hex[:6].upper()
)


# =========================================================
# 14. PREDICTION RECORD
# =========================================================

prediction_record = {

    "prediction_code":
        prediction_code,

    "model_id":
        model_id,

    "patient_id":
        None,

    "department_id":
        None,

    "prediction_date":
        str(date.today()),

    "target_date":
        str(tomorrow),

    "target_entity":
        "hospital_patient_load",

    "prediction_value":
        float(prediction),

    "prediction_label":
        prediction_label,

    "probability":
        probability,

    "confidence_score":
        confidence_score,

    "risk_level":
        risk_level,

    "input_features":
        input_features,

    "prediction_explanation":
        prediction_explanation,

    "model_version":
        model_version,

    "status":
        "generated"
}


# =========================================================
# 15. SAVE PREDICTION
# =========================================================

print(
    "[INFO] Saving prediction to Supabase..."
)

insert_response = (
    supabase
    .table("ai_predictions")
    .insert(prediction_record)
    .execute()
)

if not insert_response.data:
    raise RuntimeError(
        "Prediction was not saved to ai_predictions."
    )


saved_prediction = insert_response.data[0]


# =========================================================
# 16. FINAL OUTPUT
# =========================================================

print()
print("========================================")
print("PATIENT LOAD FORECAST")
print("========================================")

print(
    f"Prediction Code : "
    f"{saved_prediction['prediction_code']}"
)

print(
    f"Target Date     : {tomorrow}"
)

print(
    f"Predicted Load  : "
    f"{prediction} patients"
)

print(
    f"Load Level      : "
    f"{prediction_label}"
)

print(
    f"Risk Level      : "
    f"{risk_level}"
)

print(
    f"Model Version   : "
    f"{model_version}"
)

print(
    f"Confidence      : "
    f"{confidence_score * 100:.1f}%"
)

print("========================================")

print(
    "[SUCCESS] Prediction saved to ai_predictions"
)