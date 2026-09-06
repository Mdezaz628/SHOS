import os
import joblib
import pandas as pd

from dotenv import load_dotenv
from supabase import create_client

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


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
# LOAD DATA
# =========================================================

print("[INFO] Loading staff requirement data...")

response = (
    supabase
    .table("ai_staff_requirement_features")
    .select("*")
    .eq("data_source", "synthetic_training_data")
    .order("feature_date")
    .execute()
)

data = response.data

if not data:
    raise ValueError("No training data found")

df = pd.DataFrame(data)

print(f"[INFO] Total rows: {len(df)}")


# =========================================================
# FEATURES
# =========================================================

FEATURES = [
    "day_of_week",
    "is_weekend",

    "total_appointments",
    "completed_appointments",
    "waiting_appointments",

    "total_admissions",
    "total_discharges",

    "emergency_cases",
    "critical_emergency_cases",

    "occupied_beds",
    "bed_occupancy_rate",

    "available_doctors",
    "available_nurses",
    "available_support_staff"
]


TARGETS = {
    "doctors": "required_doctors",
    "nurses": "required_nurses",
    "support_staff": "required_support_staff"
}


# =========================================================
# PREPARE FEATURES
# =========================================================

df = df.dropna(
    subset=FEATURES
).copy()

X = df[FEATURES].copy()

X["is_weekend"] = X["is_weekend"].astype(int)

print(f"[INFO] Features: {len(FEATURES)}")
print(f"[INFO] Valid rows: {len(df)}")


# =========================================================
# MODEL TRAINING FUNCTION
# =========================================================

def train_role_model(role_name, target_column):

    print()
    print("========================================")
    print(f"TRAINING: {role_name.upper()}")
    print("========================================")

    role_df = df.dropna(
        subset=[target_column]
    ).copy()

    y = role_df[target_column]

    role_X = role_df[FEATURES].copy()
    role_X["is_weekend"] = role_X["is_weekend"].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        role_X,
        y,
        test_size=0.20,
        random_state=42
    )

    print(f"[INFO] Training rows: {len(X_train)}")
    print(f"[INFO] Testing rows: {len(X_test)}")

    model = RandomForestRegressor(
        n_estimators=300,
        max_depth=12,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )

    print("[INFO] Training Random Forest...")

    model.fit(
        X_train,
        y_train
    )

    predictions = model.predict(
        X_test
    )

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

    print()
    print(f"MAE  : {mae:.2f}")
    print(f"RMSE : {rmse:.2f}")
    print(f"R2   : {r2:.3f}")

    # -----------------------------------------------------
    # SAVE MODEL
    # -----------------------------------------------------

    os.makedirs(
        "models",
        exist_ok=True
    )

    model_path = (
        f"models/staff_requirement_{role_name}_model.joblib"
    )

    joblib.dump(
        model,
        model_path
    )

    print(
        f"[SUCCESS] Model saved: {model_path}"
    )

    # -----------------------------------------------------
    # TOP FEATURES
    # -----------------------------------------------------

    importance = pd.DataFrame({
        "feature": FEATURES,
        "importance": model.feature_importances_
    }).sort_values(
        "importance",
        ascending=False
    )

    print()
    print("TOP FEATURES")
    print("----------------------------------------")

    for _, row in importance.head(5).iterrows():

        print(
            f"{row['feature']:<35}"
            f"{row['importance']:.4f}"
        )

    print("----------------------------------------")

    return {
        "role": role_name,
        "mae": mae,
        "rmse": rmse,
        "r2": r2,
        "model_path": model_path
    }


# =========================================================
# TRAIN ALL THREE MODELS
# =========================================================

results = []

for role_name, target_column in TARGETS.items():

    result = train_role_model(
        role_name,
        target_column
    )

    results.append(result)


# =========================================================
# FINAL SUMMARY
# =========================================================

print()
print()
print("========================================")
print("STAFF ROLE MODEL SUMMARY")
print("========================================")

for result in results:

    print(
        f"{result['role'].upper():<15}"
        f"MAE={result['mae']:.2f}  "
        f"RMSE={result['rmse']:.2f}  "
        f"R2={result['r2']:.3f}"
    )

print("========================================")

print()
print("[SUCCESS] All staff role models trained")