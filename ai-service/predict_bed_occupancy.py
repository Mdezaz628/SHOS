import os
import joblib
import pandas as pd

from datetime import timedelta
from dotenv import load_dotenv
from supabase import create_client


# =========================================================
# 1. ENVIRONMENT
# =========================================================

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "SUPABASE_URL or SUPABASE_SECRET_KEY missing"
    )

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

print("[SUCCESS] Connected to Supabase")


# =========================================================
# 2. LOAD MODEL
# =========================================================

MODEL_PATH = "models/bed_occupancy_model.joblib"

model_package = joblib.load(MODEL_PATH)

model = model_package["model"]
FEATURES = model_package["features"]
MODEL_VERSION = model_package.get(
    "model_version",
    "1.0.0"
)

print(
    f"[SUCCESS] Model loaded: {MODEL_PATH}"
)

print(
    f"[INFO] Model version: {MODEL_VERSION}"
)

print(
    f"[INFO] Features: {len(FEATURES)}"
)


# =========================================================
# 3. LOAD LATEST DATA
# =========================================================

print(
    "[INFO] Loading latest bed occupancy data..."
)

response = (
    supabase
    .table("ai_bed_occupancy_features")
    .select("*")
    .order("feature_date", desc=True)
    .limit(1)
    .execute()
)

data = response.data

if not data:
    raise RuntimeError(
        "No bed occupancy feature data found"
    )

latest = data[0]

latest_date = pd.to_datetime(
    latest["feature_date"]
).date()

target_date = latest_date + timedelta(days=2)

print(
    f"[INFO] Latest known data: {latest_date}"
)

print(
    f"[INFO] Forecast target date: {target_date}"
)


# =========================================================
# 4. PREPARE FEATURES
# =========================================================

feature_data = {}

for feature in FEATURES:
    feature_data[feature] = latest.get(
        feature,
        0
    )


# Update calendar features
feature_data["day_of_week"] = (
    target_date.isoweekday()
)

feature_data["is_weekend"] = (
    target_date.isoweekday() in [6, 7]
)


X = pd.DataFrame(
    [feature_data],
    columns=FEATURES
)

X["is_weekend"] = (
    X["is_weekend"].astype(int)
)


# =========================================================
# 5. PREDICTION
# =========================================================

prediction = model.predict(X)[0]

predicted_occupancy = max(
    0,
    min(
        100,
        round(float(prediction), 2)
    )
)


# =========================================================
# 6. OCCUPANCY LEVEL
# =========================================================

if predicted_occupancy >= 90:

    occupancy_label = "CRITICAL"
    risk_level = "critical"

elif predicted_occupancy >= 80:

    occupancy_label = "HIGH"
    risk_level = "high"

elif predicted_occupancy >= 65:
    occupancy_label = "MODERATE"
    risk_level = "moderate"

else:

    occupancy_label = "LOW"
    risk_level = "low"


# =========================================================
# 7. PREDICTION CODE
# =========================================================

prediction_code = (
    "PRED-BOF-"
    + target_date.strftime("%Y%m%d")
    + "-"
    + os.urandom(3).hex().upper()
)


# =========================================================
# 8. SAVE TO AI_PREDICTIONS
# =========================================================

print(
    "[INFO] Saving prediction to Supabase..."
)

prediction_record = {
    "prediction_code": prediction_code,

    "model_id": 3,

    "patient_id": None,

    "department_id": None,

    "prediction_date":
        latest_date.isoformat(),

    "target_date":
        target_date.isoformat(),

    "target_entity":
        "hospital_bed_occupancy",

    "prediction_value":
        predicted_occupancy,

    "prediction_label":
        occupancy_label,

    "probability": None,

    "confidence_score": None,

    "risk_level":
        risk_level,

    "input_features":
        feature_data,

    "prediction_explanation":
        "Bed occupancy forecast generated "
        "using Random Forest model.",

    "model_version":
        MODEL_VERSION,

    "status":
        "generated"
}

result = (
    supabase
    .table("ai_predictions")
    .insert(prediction_record)
    .execute()
)


# =========================================================
# 9. OUTPUT
# =========================================================

print()
print("=" * 45)
print("BED OCCUPANCY FORECAST")
print("=" * 45)

print(
    f"Prediction Code   : {prediction_code}"
)

print(
    f"Target Date       : {target_date}"
)

print(
    f"Predicted Occupancy: {predicted_occupancy}%"
)

print(
    f"Occupancy Level   : {occupancy_label}"
)

print(
    f"Risk Level        : {risk_level}"
)

print(
    f"Model Version     : {MODEL_VERSION}"
)

print("=" * 45)

print(
    "[SUCCESS] Prediction saved to ai_predictions"
)