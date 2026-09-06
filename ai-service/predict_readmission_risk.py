import os
import joblib
import numpy as np
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

MODEL_CODE = "READMISSION_RISK"

# ============================================================
# 1. GET AI MODEL
# ============================================================

model_result = (
    supabase.table("ai_models")
    .select("id")
    .eq("model_code", MODEL_CODE)
    .single()
    .execute()
)

model_id = model_result.data["id"]

# ============================================================
# 2. LOAD TRAINED MODEL
# ============================================================

saved = joblib.load(
    "models/readmission_risk_model.joblib"
)

model = saved["model"]
features = saved["features"]

# ============================================================
# 3. GET LATEST PATIENT FEATURE DATA
# ============================================================

result = (
    supabase.table("ai_readmission_risk_features")
    .select("*")
    .eq("data_source", "synthetic_training_data")
    .order("feature_date", desc=True)
    .limit(1)
    .execute()
)

if not result.data:
    raise Exception(
        "No readmission feature data found."
    )

row = result.data[0]

# ============================================================
# 4. PREPARE FEATURES
# ============================================================

X = np.array([
    [
        float(row[f]) if row[f] is not None else 0
        for f in features
    ]
])

# ============================================================
# 5. PREDICT READMISSION PROBABILITY
# ============================================================

probabilities = model.predict_proba(X)[0]

readmission_probability = float(
    probabilities[1]
)

# ============================================================
# 6. RISK CLASSIFICATION
# ============================================================

if readmission_probability >= 0.80:

    label = "CRITICAL"
    risk = "critical"

elif readmission_probability >= 0.60:

    label = "HIGH"
    risk = "high"

elif readmission_probability >= 0.35:

    label = "MODERATE"
    risk = "moderate"

else:

    label = "LOW"
    risk = "low"

# ============================================================
# 7. TARGET DATE
#
# Latest synthetic feature date = 2026-09-04
# Tomorrow's Hospital Plan date = 2026-09-06
#
# Therefore +2 days is used here.
# ============================================================

feature_date = datetime.strptime(
    row["feature_date"],
    "%Y-%m-%d"
).date()

target_date = (
    feature_date + timedelta(days=2)
).strftime("%Y-%m-%d")

# ============================================================
# 8. PREDICTION CODE
# ============================================================

prediction_code = (
    f"PRED-RRP-"
    f"{target_date.replace('-', '')}-"
    f"{datetime.now().strftime('%H%M%S')}"
)

# ============================================================
# 9. INPUT FEATURES FOR AUDIT / EXPLANATION
# ============================================================

input_features = {
    "patient_age": row["patient_age"],
    "previous_admissions": row["previous_admissions"],
    "previous_emergency_visits": row["previous_emergency_visits"],
    "previous_readmissions": row["previous_readmissions"],
    "days_since_last_admission": row["days_since_last_admission"],
    "length_of_stay": row["length_of_stay"],
    "emergency_admission": row["emergency_admission"],
    "icu_admission": row["icu_admission"],
    "chronic_condition_count": row["chronic_condition_count"],
    "medication_count": row["medication_count"],
    "abnormal_lab_count": row["abnormal_lab_count"],
    "follow_up_required": row["follow_up_required"],
    "follow_up_completed": row["follow_up_completed"],
    "age_risk_score": row["age_risk_score"],
    "clinical_risk_score": row["clinical_risk_score"],
    "utilization_risk_score": row["utilization_risk_score"]
}

# ============================================================
# 10. SAVE PREDICTION
# ============================================================

insert_result = (
    supabase
    .table("ai_predictions")
    .insert({
        "prediction_code": prediction_code,

        "model_id": model_id,

        "patient_id": row["patient_id"],

        "prediction_date":
            datetime.now().strftime("%Y-%m-%d"),

        "target_date": target_date,

        "target_entity":
            "patient_readmission_risk",

        "prediction_value":
            round(readmission_probability, 4),

        "prediction_label":
            label,

        "probability":
            round(readmission_probability, 4),

        # IMPORTANT:
        # confidence_score must be between 0 and 1
        "confidence_score":
            round(float(max(probabilities)), 4),

        "risk_level":
            risk,

        "input_features":
            input_features,

        "prediction_explanation":
            "The model estimates readmission risk using "
            "prior admissions, emergency visits, clinical "
            "risk indicators, length of stay, ICU admission, "
            "abnormal laboratory results and follow-up "
            "information.",

        "model_version":
            "1.0.0",

        "status":
            "generated"
    })
    .execute()
)

prediction_id = insert_result.data[0]["id"]

# ============================================================
# 11. DISPLAY RESULT
# ============================================================

print("\n========================================")
print("READMISSION RISK PREDICTION")
print("========================================")

print(
    "Prediction ID:",
    prediction_id
)

print(
    "Prediction Code:",
    prediction_code
)

print(
    "Patient ID:",
    row["patient_id"]
)

print(
    "Feature Date:",
    row["feature_date"]
)

print(
    "Target Date:",
    target_date
)

print(
    "Readmission Probability:",
    f"{readmission_probability * 100:.2f}%"
)

print(
    "Label:",
    label
)

print(
    "Risk:",
    risk
)

print(
    "Model Version:",
    "1.0.0"
)

print(
    "Saved successfully!"
)

print("========================================")