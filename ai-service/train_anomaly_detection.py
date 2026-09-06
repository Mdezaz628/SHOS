import os
import joblib
import numpy as np
from dotenv import load_dotenv
from supabase import create_client
from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report, confusion_matrix

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

# Fetch data
result = (
    supabase.table("ai_anomaly_detection_features")
    .select("*")
    .eq("data_source", "synthetic_training_data")
    .order("feature_date")
    .execute()
)

data = result.data

if len(data) < 50:
    raise Exception(f"Not enough training data: {len(data)} rows")

features = [
    "day_of_week",
    "is_weekend",
    "patient_load",
    "emergency_cases",
    "critical_emergency_cases",
    "occupied_beds",
    "bed_occupancy_rate",
    "appointment_count",
    "no_show_count",
    "lab_orders",
    "pharmacy_transactions",
    "staff_workload_score",
    "resource_utilization_rate",
    "ambulance_requests",
    "blood_requests",
    "total_active_resources"
]

X = np.array([
    [
        float(row[f]) if row[f] is not None else 0
        for f in features
    ]
    for row in data
])

# Actual labels only for evaluation
y_actual = np.array([
    1 if row["actual_anomaly"] else 0
    for row in data
])

print(f"Training rows: {len(X)}")
print(f"Features: {len(features)}")
print(f"Actual anomaly days: {sum(y_actual)}")

# Isolation Forest
model = IsolationForest(
    n_estimators=300,
    contamination=5 / len(X),
    max_samples="auto",
    random_state=42,
    n_jobs=-1
)

model.fit(X)

# Isolation Forest:
# -1 = anomaly
#  1 = normal

raw_predictions = model.predict(X)

predicted_anomaly = np.where(
    raw_predictions == -1,
    1,
    0
)

# Anomaly score
decision_scores = model.decision_function(X)

# Convert score so higher = more anomalous
anomaly_scores = -decision_scores

print("\n===== ANOMALY DETECTION MODEL =====")

print("\nConfusion Matrix:")
print(confusion_matrix(y_actual, predicted_anomaly))

print("\nClassification Report:")
print(
    classification_report(
        y_actual,
        predicted_anomaly,
        target_names=["Normal", "Anomaly"],
        zero_division=0
    )
)

print("\nDetected anomalies:", int(sum(predicted_anomaly)))

# Save model
os.makedirs("models", exist_ok=True)

model_path = "models/anomaly_detection_model.joblib"

joblib.dump(
    {
        "model": model,
        "features": features
    },
    model_path
)

print(f"\nModel saved: {model_path}")