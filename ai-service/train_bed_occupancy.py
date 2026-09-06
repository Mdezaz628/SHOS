import os
import joblib
import pandas as pd

from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# =========================================================
# 1. ENVIRONMENT
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
# 2. FEATURES
# =========================================================

FEATURES = [
    "day_of_week",
    "is_weekend",
    "total_beds",
    "occupied_beds",
    "available_beds",
    "reserved_beds",
    "maintenance_beds",
    "new_admissions",
    "total_discharges",
    "emergency_admissions",
    "planned_admissions",
    "transfers_in",
    "transfers_out",
    "occupancy_rate",
    "icu_total_beds",
    "icu_occupied_beds",
    "general_total_beds",
    "general_occupied_beds"
]

TARGET = "actual_occupancy_rate"


# =========================================================
# 3. LOAD DATA
# =========================================================

print(
    "[INFO] Loading bed occupancy training data..."
)

response = (
    supabase
    .table("ai_bed_occupancy_features")
    .select("*")
    .eq("data_source", "synthetic_training_data")
    .order("feature_date")
    .execute()
)

data = response.data

if not data:
    raise RuntimeError(
        "No bed occupancy training data found"
    )

df = pd.DataFrame(data)

print(
    f"[INFO] Total rows: {len(df)}"
)


# =========================================================
# 4. PREPARE DATA
# =========================================================

required_columns = FEATURES + [TARGET]

missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]

if missing_columns:
    raise RuntimeError(
        f"Missing columns: {missing_columns}"
    )

df = df.dropna(
    subset=required_columns
)

X = df[FEATURES].copy()
y = df[TARGET].copy()


# Convert boolean to integer

X["is_weekend"] = (
    X["is_weekend"]
    .astype(int)
)


# =========================================================
# 5. TRAIN / TEST SPLIT
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

print(
    f"[INFO] Training rows: {len(X_train)}"
)

print(
    f"[INFO] Testing rows: {len(X_test)}"
)


# =========================================================
# 6. RANDOM FOREST
# =========================================================

print(
    "[INFO] Training Random Forest..."
)

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
# 7. EVALUATION
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
# 8. MODEL PACKAGE
# =========================================================

model_version = "1.0.0"

model_package = {
    "model": model,
    "features": FEATURES,
    "target": TARGET,
    "model_version": model_version,
    "algorithm": "RandomForestRegressor",
    "trained_at": datetime.now().isoformat(),
    "metrics": {
        "mae": float(mae),
        "rmse": float(rmse),
        "r2": float(r2)
    }
}


# =========================================================
# 9. SAVE MODEL
# =========================================================

os.makedirs(
    "models",
    exist_ok=True
)

model_path = (
    "models/bed_occupancy_model.joblib"
)

joblib.dump(
    model_package,
    model_path
)


# =========================================================
# 10. OUTPUT
# =========================================================

print()
print("=" * 45)
print("BED OCCUPANCY MODEL TRAINING")
print("=" * 45)

print(
    f"Training Rows : {len(X_train)}"
)

print(
    f"Testing Rows  : {len(X_test)}"
)

print(
    f"Features      : {len(FEATURES)}"
)

print(
    f"MAE           : {mae:.2f}"
)

print(
    f"RMSE          : {rmse:.2f}"
)

print(
    f"R2 Score      : {r2:.3f}"
)

print(
    f"Model Version : {model_version}"
)

print(
    f"Model Saved   : {model_path}"
)

print("=" * 45)