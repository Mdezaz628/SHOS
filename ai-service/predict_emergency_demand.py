import os
import joblib
import pandas as pd

from datetime import timedelta
from supabase import create_client
from dotenv import load_dotenv


# =========================================================
# 1. Environment
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
# 2. Model configuration
# =========================================================

MODEL_CODE = "EMERGENCY_DEMAND_FORECAST"

MODEL_PATH = "models/emergency_demand_model.joblib"


# =========================================================
# 3. Get correct AI model ID
# =========================================================

model_result = (
    supabase
    .table("ai_models")
    .select("id, model_code, model_name, is_active")
    .eq("model_code", MODEL_CODE)
    .eq("is_active", True)
    .single()
    .execute()
)

if not model_result.data:
    raise RuntimeError(
        f"Active AI model not found: {MODEL_CODE}"
    )

model_id = model_result.data["id"]

print(
    f"[SUCCESS] AI Model: "
    f"{model_result.data['model_name']}"
)

print(
    f"[INFO] Model ID: {model_id}"
)


# =========================================================
# 4. Load trained model
# =========================================================

model_package = joblib.load(MODEL_PATH)

if isinstance(model_package, dict):

    model = model_package["model"]

    FEATURES = model_package["features"]

    MODEL_VERSION = model_package.get(
        "model_version",
        "1.0.0"
    )

else:

    model = model_package

    FEATURES = [
        "day_of_week",
        "is_weekend",
        "total_emergency_cases",
        "critical_cases",
        "high_priority_cases",
        "medium_priority_cases",
        "low_priority_cases",
        "admitted_cases",
        "completed_cases",
        "active_cases",
        "ambulance_cases",
        "walk_in_cases",
        "emergency_department_cases"
    ]

    MODEL_VERSION = "1.0.0"


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
# 5. Load latest feature data
# =========================================================

print(
    "[INFO] Loading latest emergency feature data..."
)

response = (
    supabase
    .table("ai_emergency_demand_features")
    .select("*")
    .order("feature_date", desc=True)
    .limit(1)
    .execute()
)

data = response.data

if not data:
    raise RuntimeError(
        "No emergency feature data found"
    )

latest = data[0]

latest_date = pd.to_datetime(
    latest["feature_date"]
).date()


# =========================================================
# 6. Forecast target date
# =========================================================

target_date = (
    latest_date + timedelta(days=2)
)

print(
    f"[INFO] Latest known data: {latest_date}"
)

print(
    f"[INFO] Forecast target date: {target_date}"
)


# =========================================================
# 7. Prepare features
# =========================================================

feature_data = {}

for feature in FEATURES:

    feature_data[feature] = latest.get(
        feature,
        0
    )


# Update calendar features
# according to target date

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


# =========================================================
# 8. Prediction
# =========================================================

prediction = model.predict(X)[0]

predicted_demand = max(
    0,
    round(float(prediction))
)


# =========================================================
# 9. Demand level
# =========================================================

if predicted_demand >= 60:

    demand_label = "VERY_HIGH"
    risk_level = "very_high"

elif predicted_demand >= 50:

    demand_label = "HIGH"
    risk_level = "high"

elif predicted_demand >= 35:

    demand_label = "MODERATE"
    risk_level = "moderate"

else:

    demand_label = "LOW"
    risk_level = "low"


# =========================================================
# 10. Prediction code
# =========================================================

prediction_code = (
    "PRED-EDF-"
    + target_date.strftime("%Y%m%d")
    + "-"
    + os.urandom(3).hex().upper()
)


# =========================================================
# 11. Save prediction
# =========================================================

print(
    "[INFO] Saving prediction to Supabase..."
)

prediction_record = {

    "prediction_code":
        prediction_code,

    # IMPORTANT:
    # Dynamically fetched Emergency model ID
    "model_id":
        model_id,

    "patient_id":
        None,

    "department_id":
        None,

    "prediction_date":
        latest_date.isoformat(),

    "target_date":
        target_date.isoformat(),

    "target_entity":
        "hospital_emergency_department",

    "prediction_value":
        predicted_demand,

    "prediction_label":
        demand_label,

    "probability":
        None,

    "confidence_score":
        None,

    "risk_level":
        risk_level,

    "input_features":
        feature_data,

    "prediction_explanation":
        (
            "Emergency demand forecast generated "
            "using Random Forest model."
        ),

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
# 12. Output
# =========================================================

print()

print("=" * 45)

print(
    "EMERGENCY DEMAND FORECAST"
)

print("=" * 45)

print(
    f"Prediction Code : {prediction_code}"
)

print(
    f"Model ID        : {model_id}"
)

print(
    f"Target Date     : {target_date}"
)

print(
    f"Predicted Demand: "
    f"{predicted_demand} cases"
)

print(
    f"Demand Level    : "
    f"{demand_label}"
)

print(
    f"Risk Level      : "
    f"{risk_level}"
)

print(
    f"Model Version   : "
    f"{MODEL_VERSION}"
)

print("=" * 45)

print(
    "[SUCCESS] Prediction saved to ai_predictions"
)