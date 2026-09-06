import os
import joblib
import uuid
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)

FEATURES = [
    "day_of_week",
    "is_weekend",
    "total_lab_orders",
    "completed_lab_orders",
    "pending_lab_orders",
    "total_samples",
    "collected_samples",
    "pending_samples",
    "total_reports",
    "completed_reports",
    "pending_reports",
    "emergency_lab_orders",
    "inpatient_lab_orders",
    "outpatient_lab_orders",
    "active_lab_staff",
    "available_lab_staff"
]

MODEL_PATH = "models/lab_workload_model.joblib"

model = joblib.load(MODEL_PATH)

# Latest feature row
response = (
    supabase
    .table("ai_lab_workload_features")
    .select("*")
    .order("feature_date", desc=True)
    .limit(1)
    .execute()
)

if not response.data:
    raise Exception("No lab workload feature data found.")

latest = response.data[0]

latest_date = datetime.strptime(
    latest["feature_date"],
    "%Y-%m-%d"
).date()

target_date = latest_date + timedelta(days=2)

input_values = [
    float(latest[f])
    for f in FEATURES
]

predicted_workload = float(
    model.predict([input_values])[0]
)

predicted_workload = max(0, round(predicted_workload))

# Workload classification
if predicted_workload >= 500:
    label = "CRITICAL"
    risk_level = "critical"
elif predicted_workload >= 400:
    label = "HIGH"
    risk_level = "high"
elif predicted_workload >= 300:
    label = "MODERATE"
    risk_level = "moderate"
else:
    label = "LOW"
    risk_level = "low"

# Get AI model
model_response = (
    supabase
    .table("ai_models")
    .select("id")
    .eq("model_code", "LAB_WORKLOAD_FORECAST")
    .limit(1)
    .execute()
)

if not model_response.data:
    raise Exception(
        "LAB_WORKLOAD_FORECAST model not found in ai_models."
    )

model_id = model_response.data[0]["id"]

prediction_code = (
    f"PRED-LWF-{target_date.strftime('%Y%m%d')}-"
    f"{uuid.uuid4().hex[:6].upper()}"
)

input_features = {
    "source_feature_date": str(latest_date),
    "total_lab_orders": latest["total_lab_orders"],
    "pending_lab_orders": latest["pending_lab_orders"],
    "total_samples": latest["total_samples"],
    "pending_samples": latest["pending_samples"],
    "total_reports": latest["total_reports"],
    "pending_reports": latest["pending_reports"],
    "emergency_lab_orders": latest["emergency_lab_orders"],
    "inpatient_lab_orders": latest["inpatient_lab_orders"],
    "outpatient_lab_orders": latest["outpatient_lab_orders"],
    "active_lab_staff": latest["active_lab_staff"],
    "available_lab_staff": latest["available_lab_staff"]
}

explanation = (
    f"Predicted lab workload for {target_date} is "
    f"{predicted_workload}. "
    f"Current pending lab orders are "
    f"{latest['pending_lab_orders']}, "
    f"pending samples are {latest['pending_samples']}, "
    f"and pending reports are {latest['pending_reports']}."
)

prediction = {
    "prediction_code": prediction_code,
    "model_id": model_id,
    "prediction_date": str(latest_date),
    "target_date": str(target_date),
    "target_entity": "lab_workload",
    "prediction_value": predicted_workload,
    "prediction_label": label,
    "probability": None,
    "confidence_score": None,
    "risk_level": risk_level,
    "input_features": input_features,
    "prediction_explanation": explanation,
    "model_version": "1.0.0",
    "status": "generated"
}

result = (
    supabase
    .table("ai_predictions")
    .insert(prediction)
    .execute()
)

print("\n===== LAB WORKLOAD PREDICTION =====")
print(f"Prediction Code : {prediction_code}")
print(f"Target Date     : {target_date}")
print(f"Predicted Load  : {predicted_workload}")
print(f"Label           : {label}")
print(f"Risk Level      : {risk_level}")
print("Saved to        : ai_predictions")
print("===================================\n")