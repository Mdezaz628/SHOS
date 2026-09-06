import os
import joblib
import numpy as np
from dotenv import load_dotenv
from supabase import create_client
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

# Fetch training data
result = (
    supabase.table("ai_staff_workload_features")
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

X = np.array([
    [
        float(row[f]) if row[f] is not None else 0
        for f in features
    ]
    for row in data
])

y = np.array([
    float(row["actual_workload_score"])
    for row in data
])

# Chronological split
split = int(len(X) * 0.80)

X_train = X[:split]
X_test = X[split:]

y_train = y[:split]
y_test = y[split:]

print(f"Training rows: {len(X_train)}")
print(f"Testing rows: {len(X_test)}")
print(f"Features: {len(features)}")

# Model
model = RandomForestRegressor(
    n_estimators=300,
    max_depth=12,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# Evaluation
predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(mean_squared_error(y_test, predictions))
r2 = r2_score(y_test, predictions)

print("\n===== STAFF WORKLOAD MODEL =====")
print(f"MAE  : {mae:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"R2   : {r2:.3f}")

# Feature importance
print("\nTop Features:")
importance = sorted(
    zip(features, model.feature_importances_),
    key=lambda x: x[1],
    reverse=True
)

for name, score in importance[:10]:
    print(f"{name}: {score:.4f}")

# Save
os.makedirs("models", exist_ok=True)

model_path = "models/staff_workload_model.joblib"
joblib.dump(model, model_path)

print(f"\nModel saved: {model_path}")