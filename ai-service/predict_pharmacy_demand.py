import os
import joblib
import pandas as pd
from datetime import timedelta

from dotenv import load_dotenv
from supabase import create_client


# =========================================================
# LOAD ENVIRONMENT
# =========================================================

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
    raise ValueError("Supabase environment variables missing")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)

print("[SUCCESS] Connected to Supabase")


# =========================================================
# LOAD MODEL
# =========================================================

MODEL_PATH = "models/pharmacy_demand_model.joblib"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model not found: {MODEL_PATH}"
    )

model = joblib.load(MODEL_PATH)

print(
    f"[SUCCESS] Model loaded: {MODEL_PATH}"
)


# =========================================================
# FEATURES
# =========================================================

FEATURES = [
    "day_of_week",
    "is_weekend",

    "total_prescriptions",
    "total_dispensing_transactions",
    "total_medicines_dispensed",

    "outpatient_medicine_demand",
    "inpatient_medicine_demand",
    "emergency_medicine_demand",

    "total_medicine_items",
    "low_stock_items",
    "expiring_items",

    "stock_received_quantity",
    "stock_issued_quantity"
]


# =========================================================
# LOAD LATEST DATA
# =========================================================

print(
    "[INFO] Loading latest pharmacy feature data..."
)

response = (
    supabase
    .table("ai_pharmacy_demand_features")
    .select("*")
    .order("feature_date", desc=True)
    .limit(1)
    .execute()
)

if not response.data:
    raise ValueError(
        "No pharmacy feature data found"
    )

latest = response.data[0]

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
# PREPARE INPUT
# =========================================================

input_data = {}

for feature in FEATURES:
    input_data[feature] = latest[feature]


# Update calendar features
input_data["day_of_week"] = (
    target_date.isoweekday()
)

input_data["is_weekend"] = (
    target_date.isoweekday() in [6, 7]
)


X = pd.DataFrame([input_data])

X["is_weekend"] = (
    X["is_weekend"].astype(int)
)


# =========================================================
# PREDICT DEMAND
# =========================================================

predicted_demand = float(
    model.predict(X)[0]
)

predicted_demand = max(
    0,
    round(predicted_demand)
)


# =========================================================
# DEMAND LEVEL
# =========================================================

if predicted_demand >= 350:

    demand_label = "CRITICAL"
    risk_level = "critical"

elif predicted_demand >= 300:

    demand_label = "HIGH"
    risk_level = "high"

elif predicted_demand >= 220:

    demand_label = "MODERATE"
    risk_level = "moderate"

else:

    demand_label = "LOW"
    risk_level = "low"


# =========================================================
# MODEL INFO
# =========================================================

model_response = (
    supabase
    .table("ai_models")
    .select("id, model_code, version")
    .eq(
        "model_code",
        "PHARMACY_DEMAND_FORECAST"
    )
    .limit(1)
    .execute()
)

if not model_response.data:
    raise ValueError(
        "PHARMACY_DEMAND_FORECAST model not found"
    )

model_info = model_response.data[0]

model_id = model_info["id"]

model_version = (
    model_info.get("version")
    or "1.0.0"
)


# =========================================================
# PREDICTION CODE
# =========================================================

prediction_code = (
    f"PRED-PDF-{target_date.strftime('%Y%m%d')}-"
    f"{os.urandom(3).hex().upper()}"
)


# =========================================================
# EXPLANATION
# =========================================================

explanation = (
    f"Expected medicine demand for "
    f"{target_date} is approximately "
    f"{predicted_demand} medicine units. "
    f"Forecast level is {demand_label}. "
    f"Current low-stock items: "
    f"{latest['low_stock_items']}. "
    f"Current expiring items: "
    f"{latest['expiring_items']}."
)


# =========================================================
# SAVE PREDICTION
# =========================================================

prediction_data = {

    "prediction_code":
        prediction_code,

    "model_id":
        model_id,

    "prediction_date":
        str(latest_date),

    "target_date":
        str(target_date),

    "target_entity":
        "pharmacy_medicine_demand",

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
        input_data,

    "prediction_explanation":
        explanation,

    "model_version":
        model_version,

    "status":
        "generated"
}


print(
    "[INFO] Saving prediction to Supabase..."
)

insert_response = (
    supabase
    .table("ai_predictions")
    .insert(prediction_data)
    .execute()
)

if not insert_response.data:
    raise ValueError(
        "Failed to save pharmacy prediction"
    )

prediction_id = (
    insert_response.data[0]["id"]
)


# =========================================================
# RESULT
# =========================================================

print()
print("========================================")
print("PHARMACY DEMAND FORECAST")
print("========================================")

print(
    f"Prediction ID       : {prediction_id}"
)

print(
    f"Prediction Code     : {prediction_code}"
)

print(
    f"Target Date         : {target_date}"
)

print(
    f"Predicted Demand    : {predicted_demand}"
)

print(
    f"Demand Level        : {demand_label}"
)

print(
    f"Risk Level          : {risk_level}"
)

print(
    f"Low Stock Items     : "
    f"{latest['low_stock_items']}"
)

print(
    f"Expiring Items      : "
    f"{latest['expiring_items']}"
)

print(
    f"Model Version       : {model_version}"
)

print("========================================")

print(
    "[SUCCESS] Pharmacy prediction "
    "saved to ai_predictions"
)