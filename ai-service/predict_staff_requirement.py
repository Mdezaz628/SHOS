import os
import joblib
import pandas as pd
from datetime import timedelta

from dotenv import load_dotenv
from supabase import create_client


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
# LOAD MODELS
# =========================================================

MODEL_PATHS = {
    "doctors": "models/staff_requirement_doctors_model.joblib",
    "nurses": "models/staff_requirement_nurses_model.joblib",
    "support_staff": "models/staff_requirement_support_staff_model.joblib"
}

models = {}

for role, path in MODEL_PATHS.items():

    if not os.path.exists(path):
        raise FileNotFoundError(
            f"Model not found: {path}"
        )

    models[role] = joblib.load(path)

    print(
        f"[SUCCESS] {role.upper()} model loaded"
    )


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


# =========================================================
# LOAD LATEST DATA
# =========================================================

print("[INFO] Loading latest hospital feature data...")

response = (
    supabase
    .table("ai_staff_requirement_features")
    .select("*")
    .order("feature_date", desc=True)
    .limit(1)
    .execute()
)

if not response.data:
    raise ValueError(
        "No staff requirement feature data found"
    )

latest = response.data[0]

latest_date = pd.to_datetime(
    latest["feature_date"]
).date()

target_date = latest_date + timedelta(days=2)

print(
    f"[INFO] Latest known data: {latest_date}"
)

print(
    f"[INFO] Forecast target date: {target_date}"
)


# =========================================================
# PREPARE INPUT
# =========================================================

input_data = {}

for feature in FEATURES:
    input_data[feature] = latest[feature]

input_data["day_of_week"] = (
    target_date.isoweekday()
)

input_data["is_weekend"] = (
    target_date.isoweekday() in [6, 7]
)

X = pd.DataFrame([input_data])

X["is_weekend"] = X["is_weekend"].astype(int)


# =========================================================
# ROLE-WISE PREDICTIONS
# =========================================================

predicted = {}

for role, model in models.items():

    value = float(
        model.predict(X)[0]
    )

    predicted[role] = max(
        1,
        round(value)
    )


# =========================================================
# AVAILABLE STAFF
# =========================================================

available = {
    "doctors": int(
        latest["available_doctors"]
    ),

    "nurses": int(
        latest["available_nurses"]
    ),

    "support_staff": int(
        latest["available_support_staff"]
    )
}


# =========================================================
# SHORTAGE / SURPLUS
# =========================================================

staff_analysis = {}

total_required = 0
total_available = 0
total_shortage = 0
total_surplus = 0

for role in predicted:

    required = predicted[role]
    available_count = available[role]

    gap = required - available_count

    if gap > 0:
        shortage = gap
        surplus = 0
    else:
        shortage = 0
        surplus = abs(gap)

    staff_analysis[role] = {
        "required": required,
        "available": available_count,
        "shortage": shortage,
        "surplus": surplus
    }

    total_required += required
    total_available += available_count
    total_shortage += shortage
    total_surplus += surplus


# =========================================================
# OVERALL RISK
# =========================================================

if total_shortage >= 15:

    overall_label = "CRITICAL"
    risk_level = "critical"

elif total_shortage >= 8:

    overall_label = "HIGH"
    risk_level = "high"

elif total_shortage >= 3:

    overall_label = "MODERATE"
    risk_level = "moderate"

else:

    overall_label = "LOW"
    risk_level = "low"


# =========================================================
# MODEL INFO
# =========================================================

model_response = (
    supabase
    .table("ai_models")
    .select("id, model_code, version")
    .eq(
        "model_code",
        "STAFF_REQUIREMENT_FORECAST"
    )
    .limit(1)
    .execute()
)

if not model_response.data:
    raise ValueError(
        "STAFF_REQUIREMENT_FORECAST model not found"
    )

model_info = model_response.data[0]

model_id = model_info["id"]

model_version = (
    model_info.get("version")
    or "1.0.0"
)


# =========================================================
# PREDICTION CODE
# =========================================================

prediction_code = (
    f"PRED-SRF-{target_date.strftime('%Y%m%d')}-"
    f"{os.urandom(3).hex().upper()}"
)


# =========================================================
# INPUT FEATURES FOR JSON
# =========================================================

input_features_json = {
    **input_data,

    # Predicted staff requirement
    "predicted_doctors":
        predicted["doctors"],

    "predicted_nurses":
        predicted["nurses"],

    "predicted_support_staff":
        predicted["support_staff"],

    # Currently available staff
    "available_doctors":
        available["doctors"],

    "available_nurses":
        available["nurses"],

    "available_support_staff":
        available["support_staff"],

    # Calculated shortage
    "doctors_shortage":
        staff_analysis["doctors"]["shortage"],

    "nurses_shortage":
        staff_analysis["nurses"]["shortage"],

    "support_staff_shortage":
        staff_analysis["support_staff"]["shortage"],

    "total_required":
        total_required,

    "total_available":
        total_available,

    "total_shortage":
        total_shortage,

    "total_surplus":
        total_surplus
}


# =========================================================
# EXPLANATION
# =========================================================

explanation = (
    f"Forecast for {target_date}: "
    f"{predicted['doctors']} doctors, "
    f"{predicted['nurses']} nurses and "
    f"{predicted['support_staff']} support staff "
    f"may be required. "
    f"Current available staff is "
    f"{total_available}. "
    f"Expected total requirement is "
    f"{total_required}. "
    f"Expected shortage is "
    f"{total_shortage}."
)


# =========================================================
# SAVE PREDICTION
# =========================================================

prediction_data = {

    "prediction_code":
        prediction_code,

    "model_id":
        model_id,

    "prediction_date":
        str(latest_date),

    "target_date":
        str(target_date),

    "target_entity":
        "hospital_staff_requirement",

    "prediction_value":
        total_required,

    "prediction_label":
        overall_label,

    "probability":
        None,

    "confidence_score":
        None,

    "risk_level":
        risk_level,

    "input_features":
        input_features_json,

    "prediction_explanation":
        explanation,

    "model_version":
        model_version,

    "status":
        "generated"
}


print(
    "[INFO] Saving prediction to Supabase..."
)

insert_response = (
    supabase
    .table("ai_predictions")
    .insert(prediction_data)
    .execute()
)

if not insert_response.data:
    raise ValueError(
        "Failed to save prediction"
    )

prediction_id = (
    insert_response.data[0]["id"]
)


# =========================================================
# FINAL OUTPUT
# =========================================================

print()
print("========================================")
print("STAFF REQUIREMENT FORECAST")
print("========================================")

print(
    f"Prediction ID       : {prediction_id}"
)

print(
    f"Prediction Code     : {prediction_code}"
)

print(
    f"Target Date         : {target_date}"
)

print()
print("DOCTORS")
print("----------------------------------------")
print(
    f"Required            : "
    f"{staff_analysis['doctors']['required']}"
)
print(
    f"Available           : "
    f"{staff_analysis['doctors']['available']}"
)
print(
    f"Shortage            : "
    f"{staff_analysis['doctors']['shortage']}"
)
print(
    f"Surplus             : "
    f"{staff_analysis['doctors']['surplus']}"
)

print()
print("NURSES")
print("----------------------------------------")
print(
    f"Required            : "
    f"{staff_analysis['nurses']['required']}"
)
print(
    f"Available           : "
    f"{staff_analysis['nurses']['available']}"
)
print(
    f"Shortage            : "
    f"{staff_analysis['nurses']['shortage']}"
)
print(
    f"Surplus             : "
    f"{staff_analysis['nurses']['surplus']}"
)

print()
print("SUPPORT STAFF")
print("----------------------------------------")
print(
    f"Required            : "
    f"{staff_analysis['support_staff']['required']}"
)
print(
    f"Available           : "
    f"{staff_analysis['support_staff']['available']}"
)
print(
    f"Shortage            : "
    f"{staff_analysis['support_staff']['shortage']}"
)
print(
    f"Surplus             : "
    f"{staff_analysis['support_staff']['surplus']}"
)

print()
print("OVERALL")
print("----------------------------------------")

print(
    f"Total Required      : {total_required}"
)

print(
    f"Total Available     : {total_available}"
)

print(
    f"Total Shortage      : {total_shortage}"
)

print(
    f"Total Surplus       : {total_surplus}"
)

print(
    f"Overall Level       : {overall_label}"
)

print(
    f"Risk Level          : {risk_level}"
)

print(
    f"Model Version       : {model_version}"
)

print("========================================")

print(
    "[SUCCESS] Prediction saved to ai_predictions"
)