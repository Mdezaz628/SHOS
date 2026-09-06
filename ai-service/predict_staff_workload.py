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

MODEL_CODE = "STAFF_WORKLOAD_PREDICTION"

# Get AI model
model_result = (
    supabase.table("ai_models")
    .select("id")
    .eq("model_code", MODEL_CODE)
    .single()
    .execute()
)

model_id = model_result.data["id"]

# Load model
model = joblib.load("models/staff_workload_model.joblib")

# Latest feature row
result = (
    supabase.table("ai_staff_workload_features")
    .select("*")
    .eq("data_source", "synthetic_training_data")
    .order("feature_date", desc=True)
    .limit(1)
    .execute()
)

if not result.data:
    raise Exception("No workload feature data found.")

row = result.data[0]

features = [
    "day_of_week",
    "is_weekend",
    "assigned_tasks",
    "completed_tasks",
    "pending_tasks",
    "overdue_tasks",
    "emergency_tasks",
    "routine_tasks",
    "high_priority_tasks",
    "total_work_minutes",
    "completed_work_minutes",
    "average_task_minutes",
    "shift_hours",
    "attendance_hours",
    "patient_load",
    "occupied_beds",
    "emergency_cases"
]

X = np.array([[
    float(row[f]) if row[f] is not None else 0
    for f in features
]])

predicted_score = float(model.predict(X)[0])
predicted_score = max(0, min(100, predicted_score))

# Workload classification
if predicted_score >= 85:
    label = "CRITICAL"
    risk = "critical"
elif predicted_score >= 70:
    label = "HIGH"
    risk = "high"
elif predicted_score >= 50:
    label = "MODERATE"
    risk = "moderate"
else:
    label = "LOW"
    risk = "low"

target_date = (
    datetime.strptime(row["feature_date"], "%Y-%m-%d")
    + timedelta(days=2)
).strftime("%Y-%m-%d")

prediction_code = (
    f"PRED-SWP-{target_date.replace('-', '')}-"
    f"{datetime.now().strftime('%H%M%S')}"
)

input_features = {
    "staff_role": row["staff_role"],
    "assigned_tasks": row["assigned_tasks"],
    "pending_tasks": row["pending_tasks"],
    "overdue_tasks": row["overdue_tasks"],
    "emergency_tasks": row["emergency_tasks"],
    "patient_load": row["patient_load"],
    "occupied_beds": row["occupied_beds"],
    "emergency_cases": row["emergency_cases"],
    "predicted_workload_score": round(predicted_score, 2)
}

# Save prediction
insert_result = (
    supabase.table("ai_predictions")
    .insert({
        "prediction_code": prediction_code,
        "model_id": model_id,
        "prediction_date": datetime.now().strftime("%Y-%m-%d"),
        "target_date": target_date,
        "target_entity": "staff_workload",
        "prediction_value": round(predicted_score, 2),
        "prediction_label": label,
        "probability": None,
        "confidence_score": None,
        "risk_level": risk,
        "input_features": input_features,
        "prediction_explanation":
            f"Predicted staff workload score is {predicted_score:.2f}/100 "
            f"for the next day.",
        "model_version": "1.0.0",
        "status": "generated"
    })
    .execute()
)

prediction_id = insert_result.data[0]["id"]

print("\n===== STAFF WORKLOAD PREDICTION =====")
print("Prediction ID:", prediction_id)
print("Prediction Code:", prediction_code)
print("Target Date:", target_date)
print("Predicted Workload:", round(predicted_score, 2))
print("Label:", label)
print("Risk:", risk)
print("Saved successfully!")