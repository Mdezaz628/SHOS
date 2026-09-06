import os
import pandas as pd
import joblib

from datetime import datetime
from supabase import create_client
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from dotenv import load_dotenv


# =========================================================
# 1. Environment
# =========================================================

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL or SUPABASE_SECRET_KEY missing")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

print("[SUCCESS] Connected to Supabase")


# =========================================================
# 2. Load training data
# =========================================================

print("[INFO] Loading emergency demand training data...")

response = (
    supabase
    .table("ai_emergency_demand_features")
    .select("*")
    .eq("data_source", "synthetic_training_data")
    .order("feature_date")
    .execute()
)

data = response.data

if not data:
    raise RuntimeError("No emergency training data found")

df = pd.DataFrame(data)

print(f"[INFO] Total rows: {len(df)}")


# =========================================================
# 3. Features
# =========================================================

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

TARGET = "actual_emergency_demand"


# =========================================================
# 4. Validate
# =========================================================

missing = [
    column
    for column in FEATURES + [TARGET]
    if column not in df.columns
]

if missing:
    raise RuntimeError(
        f"Missing columns: {missing}"
    )


# =========================================================
# 5. Prepare data
# =========================================================

df = df.dropna(
    subset=FEATURES + [TARGET]
).copy()

X = df[FEATURES]
y = df[TARGET]


# =========================================================
# 6. Train/Test split
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

print(f"[INFO] Training rows: {len(X_train)}")
print(f"[INFO] Testing rows: {len(X_test)}")


# =========================================================
# 7. Train model
# =========================================================

print("[INFO] Training Random Forest...")

model = RandomForestRegressor(
    n_estimators=300,
    max_depth=12,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

model.fit(
    X_train,
    y_train
)


# =========================================================
# 8. Evaluation
# =========================================================

predictions = model.predict(X_test)

mae = mean_absolute_error(
    y_test,
    predictions
)

rmse = mean_squared_error(
    y_test,
    predictions
) ** 0.5

r2 = r2_score(
    y_test,
    predictions
)


# =========================================================
# 9. Save model
# =========================================================

os.makedirs(
    "models",
    exist_ok=True
)

MODEL_PATH = "models/emergency_demand_model.joblib"

model_package = {
    "model": model,
    "features": FEATURES,
    "model_version": "1.0.0",
    "algorithm": "RandomForestRegressor",
    "trained_at": datetime.now().isoformat(),
    "metrics": {
        "mae": float(mae),
        "rmse": float(rmse),
        "r2": float(r2)
    }
}

joblib.dump(
    model_package,
    MODEL_PATH
)


# =========================================================
# 10. Final output
# =========================================================

print()
print("=" * 45)
print("EMERGENCY DEMAND MODEL TRAINING")
print("=" * 45)

print(f"Training Rows : {len(X_train)}")
print(f"Testing Rows  : {len(X_test)}")
print(f"Features      : {len(FEATURES)}")
print(f"MAE           : {mae:.2f}")
print(f"RMSE          : {rmse:.2f}")
print(f"R2 Score      : {r2:.3f}")
print("Model Version : 1.0.0")
print(f"Model Saved   : {MODEL_PATH}")

print("=" * 45)