import os
import sys
import joblib
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
    raise ValueError("SUPABASE_URL or SUPABASE_SECRET_KEY is missing in .env file.")

supabase = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)

# =========================================================
# LOAD DATA
# =========================================================
response = (
    supabase
    .table("ai_patient_load_training_dataset")
    .select("*")
    .order("feature_date")
    .execute()
)

data = response.data

if len(data) < 30:
    print(f"Only {len(data)} rows available.")
    print("At least 30 historical days are recommended before initial training.")
    print("Training stopped safely as designed.")
    raise SystemExit(0)

df = pd.DataFrame(data)

# =========================================================
# FEATURES
# =========================================================
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
    "resources_in_use",
]

target = "actual_patient_load"

X = df[features].fillna(0)
y = df[target].fillna(0)

# =========================================================
# TIME-BASED SPLIT
# =========================================================
split_index = int(len(df) * 0.8)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]

# =========================================================
# MODEL
# =========================================================
model = RandomForestRegressor(
    n_estimators=200,
    max_depth=10,
    random_state=42,
    n_jobs=-1,
)

model.fit(X_train, y_train)

# =========================================================
# EVALUATION
# =========================================================
predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
rmse = mean_squared_error(y_test, predictions) ** 0.5
r2 = r2_score(y_test, predictions)

print()
print("================================")
print("PATIENT LOAD MODEL")
print("================================")
print("Training rows:", len(X_train))
print("Testing rows:", len(X_test))
print("MAE:", round(mae, 2))
print("RMSE:", round(rmse, 2))
print("R2:", round(r2, 3))

# =========================================================
# SAVE MODEL
# =========================================================
os.makedirs("models", exist_ok=True)
model_path = "models/patient_load_model.joblib"
joblib.dump(model, model_path)

print()
print("Model saved:", model_path)
