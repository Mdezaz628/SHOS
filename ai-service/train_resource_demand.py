import os
import joblib
import numpy as np
from dotenv import load_dotenv
from supabase import create_client
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

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

TARGET = "actual_resource_demand"

response = (
    supabase
    .table("ai_resource_demand_features")
    .select("*")
    .order("feature_date")
    .execute()
)

data = response.data

if not data:
    raise Exception("No resource demand training data found.")

X = np.array([
    [float(row[f]) for f in FEATURES]
    for row in data
])

y = np.array([
    float(row[TARGET])
    for row in data
])

split_index = int(len(X) * 0.8)

X_train = X[:split_index]
X_test = X[split_index:]

y_train = y[:split_index]
y_test = y[split_index:]

model = RandomForestRegressor(
    n_estimators=300,
    max_depth=12,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(mean_squared_error(y_test, predictions))
r2 = r2_score(y_test, predictions)

os.makedirs("models", exist_ok=True)

MODEL_PATH = "models/resource_demand_model.joblib"

joblib.dump(model, MODEL_PATH)

print("\n===== RESOURCE DEMAND MODEL =====")
print(f"Training rows : {len(X_train)}")
print(f"Testing rows  : {len(X_test)}")
print(f"MAE           : {mae:.2f}")
print(f"RMSE          : {rmse:.2f}")
print(f"R2 Score      : {r2:.3f}")
print(f"Model saved   : {MODEL_PATH}")
print("=================================\n")