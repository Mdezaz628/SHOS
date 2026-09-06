import os
import joblib
import numpy as np
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

MODEL_CODE = "ANOMALY_DETECTION"

# Get AI model
model_result = (
    supabase.table("ai_models")
    .select("id")
    .eq("model_code", MODEL_CODE)
    .single()
    .execute()
)

model_id = model_result.data["id"]

# Load trained model
saved = joblib.load("models/anomaly_detection_model.joblib")

model = saved["model"]
features = saved["features"]

# Latest operational feature row
result = (
    supabase.table("ai_anomaly_detection_features")
    .select("*")
    .eq("data_source", "synthetic_training_data")
    .order("feature_date", desc=True)
    .limit(1)
    .execute()
)

if not result.data:
    raise Exception("No anomaly detection feature data found.")

row = result.data[0]

X = np.array([[
    float(row[f]) if row[f] is not None else 0
    for f in features
]])

# Isolation Forest prediction
raw_prediction = model.predict(X)[0]

# -1 = anomaly
#  1 = normal
is_anomaly = raw_prediction == -1

# Higher value = more anomalous
decision_score = float(model.decision_function(X)[0])
anomaly_score = max(0.0, -decision_score)

# Classification
if is_anomaly:
    if anomaly_score >= 0.50:
        label = "CRITICAL_ANOMALY"
        risk = "critical"
    elif anomaly_score >= 0.30:
        label = "HIGH_ANOMALY"
        risk = "high"
    else:
        label = "ANOMALY"
        risk = "moderate"
else:
    label = "NORMAL"
    risk = "low"

target_date = (
    datetime.strptime(row["feature_date"], "%Y-%m-%d")
    + timedelta(days=2)
).strftime("%Y-%m-%d")

prediction_code = (
    f"PRED-ANM-{target_date.replace('-', '')}-"
    f"{datetime.now().strftime('%H%M%S')}"
)

input_features = {
    "patient_load": row["patient_load"],
    "emergency_cases": row["emergency_cases"],
    "critical_emergency_cases": row["critical_emergency_cases"],
    "occupied_beds": row["occupied_beds"],
    "bed_occupancy_rate": row["bed_occupancy_rate"],
    "appointment_count": row["appointment_count"],
    "lab_orders": row["lab_orders"],
    "pharmacy_transactions": row["pharmacy_transactions"],
    "staff_workload_score": row["staff_workload_score"],
    "resource_utilization_rate": row["resource_utilization_rate"],
    "ambulance_requests": row["ambulance_requests"],
    "blood_requests": row["blood_requests"],
    "anomaly_score": round(anomaly_score, 4)
}

# Save prediction
insert_result = (
    supabase.table("ai_predictions")
    .insert({
        "prediction_code": prediction_code,
        "model_id": model_id,
        "prediction_date": datetime.now().strftime("%Y-%m-%d"),
        "target_date": target_date,
        "target_entity": "hospital_operational_anomaly",
        "prediction_value": round(anomaly_score, 4),
        "prediction_label": label,
        "probability": None,
        "confidence_score": None,
        "risk_level": risk,
        "input_features": input_features,
        "prediction_explanation":
            "Isolation Forest evaluated multiple hospital operational "
            "signals including patient load, emergency demand, bed "
            "occupancy, laboratory workload, pharmacy activity, staff "
            "workload and resource utilization.",
        "model_version": "1.0.0",
        "status": "generated"
    })
    .execute()
)

prediction_id = insert_result.data[0]["id"]

print("\n===== ANOMALY DETECTION PREDICTION =====")
print("Prediction ID:", prediction_id)
print("Prediction Code:", prediction_code)
print("Target Date:", target_date)
print("Anomaly Score:", round(anomaly_score, 4))
print("Anomaly Detected:", is_anomaly)
print("Label:", label)
print("Risk:", risk)
print("Saved successfully!")