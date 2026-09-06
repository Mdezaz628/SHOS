import os
import joblib
import numpy as np
from dotenv import load_dotenv
from supabase import create_client
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)

FEATURES = [
    "appointment_type",
    "day_of_week",
    "is_weekend",
    "days_until_appointment",
    "patient_age",
    "previous_appointments",
    "previous_no_shows",
    "previous_no_show_rate",
    "is_new_patient",
    "is_emergency",
    "appointment_hour",
    "distance_km",
    "reminder_sent"
]

TARGET = "actual_no_show"

response = (
    supabase
    .table("ai_no_show_features")
    .select("*")
    .order("feature_date")
    .execute()
)

data = response.data

if not data:
    raise Exception("No no-show training data found.")

X = np.array([
    [
        float(row[f]) if not isinstance(row[f], bool)
        else int(row[f])
        for f in FEATURES
    ]
    for row in data
])

y = np.array([
    int(row[TARGET])
    for row in data
])

print(f"Total rows: {len(X)}")
print(f"No-show cases: {y.sum()}")
print(f"Show cases: {len(y) - y.sum()}")

# 80/20 chronological split
split_index = int(len(X) * 0.8)

X_train = X[:split_index]
X_test = X[split_index:]

y_train = y[:split_index]
y_test = y[split_index:]

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    min_samples_leaf=2,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)
probabilities = model.predict_proba(X_test)[:, 1]

accuracy = accuracy_score(y_test, predictions)
precision = precision_score(
    y_test,
    predictions,
    zero_division=0
)
recall = recall_score(
    y_test,
    predictions,
    zero_division=0
)
f1 = f1_score(
    y_test,
    predictions,
    zero_division=0
)
roc_auc = roc_auc_score(
    y_test,
    probabilities
)

os.makedirs("models", exist_ok=True)

MODEL_PATH = "models/no_show_model.joblib"

joblib.dump(model, MODEL_PATH)

print("\n===== NO-SHOW MODEL =====")
print(f"Training rows : {len(X_train)}")
print(f"Testing rows  : {len(X_test)}")
print(f"Accuracy      : {accuracy:.3f}")
print(f"Precision     : {precision:.3f}")
print(f"Recall        : {recall:.3f}")
print(f"F1 Score      : {f1:.3f}")
print(f"ROC-AUC       : {roc_auc:.3f}")
print(f"Model saved   : {MODEL_PATH}")
print("=========================\n")