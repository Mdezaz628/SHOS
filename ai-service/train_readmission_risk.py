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
    classification_report
)

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

# Fetch data
result = (
    supabase.table("ai_readmission_risk_features")
    .select("*")
    .eq("data_source", "synthetic_training_data")
    .order("feature_date")
    .execute()
)

data = result.data

if len(data) < 100:
    raise Exception(f"Not enough training data: {len(data)} rows")

features = [
    "patient_age",
    "previous_admissions",
    "previous_emergency_visits",
    "previous_readmissions",
    "days_since_last_admission",
    "length_of_stay",
    "emergency_admission",
    "icu_admission",
    "chronic_condition_count",
    "medication_count",
    "lab_test_count",
    "abnormal_lab_count",
    "follow_up_required",
    "follow_up_completed",
    "age_risk_score",
    "clinical_risk_score",
    "utilization_risk_score"
]

X = np.array([
    [
        float(row[f]) if row[f] is not None else 0
        for f in features
    ]
    for row in data
])

y = np.array([
    1 if row["actual_readmission"] else 0
    for row in data
])

# Chronological 80/20 split
split = int(len(X) * 0.80)

X_train = X[:split]
X_test = X[split:]

y_train = y[:split]
y_test = y[split:]

print(f"Total rows: {len(X)}")
print(f"Training rows: {len(X_train)}")
print(f"Testing rows: {len(X_test)}")
print(f"Features: {len(features)}")
print(f"Training readmissions: {sum(y_train)}")
print(f"Testing readmissions: {sum(y_test)}")

# Random Forest classifier
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    min_samples_leaf=2,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# Prediction
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(
    y_test,
    y_pred,
    zero_division=0
)
recall = recall_score(
    y_test,
    y_pred,
    zero_division=0
)
f1 = f1_score(
    y_test,
    y_pred,
    zero_division=0
)

print("\n===== READMISSION RISK MODEL =====")
print(f"Accuracy : {accuracy:.3f}")
print(f"Precision: {precision:.3f}")
print(f"Recall   : {recall:.3f}")
print(f"F1 Score : {f1:.3f}")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=["No Readmission", "Readmission"],
        zero_division=0
    )
)

# Feature importance
print("\nTop Features:")

importance = sorted(
    zip(features, model.feature_importances_),
    key=lambda x: x[1],
    reverse=True
)

for name, score in importance[:10]:
    print(f"{name}: {score:.4f}")

# Save model
os.makedirs("models", exist_ok=True)

model_path = "models/readmission_risk_model.joblib"

joblib.dump(
    {
        "model": model,
        "features": features
    },
    model_path
)

print(f"\nModel saved: {model_path}")