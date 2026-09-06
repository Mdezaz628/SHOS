import os
import joblib
import uuid
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)

FEATURES = [
    "day_of_week",
    "is_weekend",
    "total_resources",
    "active_resources",
    "resources_in_use",
    "available_resources",
    "equipment_requests",
    "completed_resource_requests",
    "pending_resource_requests",
    "emergency_resource_requests",
    "inpatient_resource_requests",
    "outpatient_resource_requests",
    "maintenance_resources",
    "critical_resources",
    "resource_utilization_rate"
]

MODEL_PATH = "models/resource_demand_model.joblib"

model = joblib.load(MODEL_PATH)

# Latest feature row
response = (
    supabase
    .table("ai_resource_demand_features")
    .select("*")
    .order("feature_date", desc=True)
    .limit(1)
    .execute()
)

if not response.data:
    raise Exception("No resource demand feature data found.")

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

predicted_demand = float(
    model.predict([input_values])[0]
)

predicted_demand = max(
    0,
    round(predicted_demand)
)

# Demand classification
if predicted_demand >= 150:
    label = "CRITICAL"
    risk_level = "critical"

elif predicted_demand >= 120:
    label = "HIGH"
    risk_level = "high"

elif predicted_demand >= 90:
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
    .eq("model_code", "RESOURCE_DEMAND_FORECAST")
    .limit(1)
    .execute()
)

if not model_response.data:
    raise Exception(
        "RESOURCE_DEMAND_FORECAST model not found in ai_models."
    )

model_id = model_response.data[0]["id"]

prediction_code = (
    f"PRED-RDF-"
    f"{target_date.strftime('%Y%m%d')}-"
    f"{uuid.uuid4().hex[:6].upper()}"
)

input_features = {
    "source_feature_date": str(latest_date),
    "total_resources": latest["total_resources"],
    "active_resources": latest["active_resources"],
    "resources_in_use": latest["resources_in_use"],
    "available_resources": latest["available_resources"],
    "equipment_requests": latest["equipment_requests"],
    "pending_resource_requests": latest["pending_resource_requests"],
    "emergency_resource_requests": latest["emergency_resource_requests"],
    "inpatient_resource_requests": latest["inpatient_resource_requests"],
    "outpatient_resource_requests": latest["outpatient_resource_requests"],
    "maintenance_resources": latest["maintenance_resources"],
    "critical_resources": latest["critical_resources"],
    "resource_utilization_rate": latest["resource_utilization_rate"]
}

explanation = (
    f"AI predicts resource demand of {predicted_demand} "
    f"for {target_date}. Current resource utilization is "
    f"{round(float(latest['resource_utilization_rate']) * 100, 2)}%. "
    f"Pending resource requests are "
    f"{latest['pending_resource_requests']} and "
    f"emergency resource requests are "
    f"{latest['emergency_resource_requests']}."
)

prediction = {
    "prediction_code": prediction_code,
    "model_id": model_id,
    "prediction_date": str(latest_date),
    "target_date": str(target_date),
    "target_entity": "hospital_resource_demand",
    "prediction_value": predicted_demand,
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

print("\n===== RESOURCE DEMAND PREDICTION =====")
print(f"Prediction Code : {prediction_code}")
print(f"Target Date     : {target_date}")
print(f"Predicted Demand: {predicted_demand}")
print(f"Label           : {label}")
print(f"Risk Level      : {risk_level}")
print("Saved to        : ai_predictions")
print("=======================================\n")