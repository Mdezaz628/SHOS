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
# LOAD TRAINING DATA
# =========================================================

print("[INFO] Loading pharmacy demand training data...")

response = (
    supabase
    .table("ai_pharmacy_demand_features")
    .select("*")
    .eq("data_source", "synthetic_training_data")
    .order("feature_date")
    .execute()
)

data = response.data

if not data:
    raise ValueError("No pharmacy training data found")

df = pd.DataFrame(data)

print(f"[INFO] Total rows: {len(df)}")


# =========================================================
# FEATURES
# =========================================================

FEATURES = [
    "day_of_week",
    "is_weekend",

    "total_prescriptions",
    "total_dispensing_transactions",
    "total_medicines_dispensed",

    "outpatient_medicine_demand",
    "inpatient_medicine_demand",
    "emergency_medicine_demand",

    "total_medicine_items",
    "low_stock_items",
    "expiring_items",

    "stock_received_quantity",
    "stock_issued_quantity"
]


TARGET = "actual_medicine_demand"


# =========================================================
# PREPARE DATA
# =========================================================

df = df.dropna(
    subset=FEATURES + [TARGET]
).copy()

X = df[FEATURES].copy()

y = df[TARGET].copy()

X["is_weekend"] = X["is_weekend"].astype(int)

print(f"[INFO] Features: {len(FEATURES)}")
print(f"[INFO] Valid rows: {len(df)}")


# =========================================================
# TRAIN / TEST SPLIT
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
# RANDOM FOREST MODEL
# =========================================================

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


# =========================================================
# EVALUATION
# =========================================================

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


# =========================================================
# RESULTS
# =========================================================

print()
print("========================================")
print("PHARMACY DEMAND MODEL")
print("========================================")

print(
    f"MAE  : {mae:.2f}"
)

print(
    f"RMSE : {rmse:.2f}"
)

print(
    f"R2   : {r2:.3f}"
)

print("========================================")


# =========================================================
# SAVE MODEL
# =========================================================

os.makedirs(
    "models",
    exist_ok=True
)

model_path = (
    "models/pharmacy_demand_model.joblib"
)

joblib.dump(
    model,
    model_path
)

print()
print(
    f"[SUCCESS] Model saved: {model_path}"
)


# =========================================================
# FEATURE IMPORTANCE
# =========================================================

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

for _, row in importance.head(10).iterrows():

    print(
        f"{row['feature']:<35}"
        f"{row['importance']:.4f}"
    )

print("----------------------------------------")

print(
    "[SUCCESS] Pharmacy demand training completed"
)