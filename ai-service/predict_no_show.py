import os
import joblib
import uuid
from dotenv import load_dotenv
from supabase import create_client

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

MODEL_PATH = "models/no_show_model.joblib"

model = joblib.load(MODEL_PATH)

# Latest appointment feature
response = (
    supabase
    .table("ai_no_show_features")
    .select("*")
    .order("id", desc=True)
    .limit(1)
    .execute()
)

if not response.data:
    raise Exception("No no-show feature data found.")

row = response.data[0]

input_values = []

for feature in FEATURES:
    value = row[feature]

    if isinstance(value, bool):
        value = int(value)

    input_values.append(float(value))

# Prediction
prediction_class = int(
    model.predict([input_values])[0]
)

probability = float(
    model.predict_proba([input_values])[0][1]
)

probability_percent = round(probability * 100, 2)

# Risk classification
if probability >= 0.70:
    label = "HIGH"
    risk_level = "high"

elif probability >= 0.40:
    label = "MODERATE"
    risk_level = "moderate"

else:
    label = "LOW"
    risk_level = "low"

prediction_code = (
    f"PRED-NSP-"
    f"{row['feature_date'].replace('-', '')}-"
    f"{uuid.uuid4().hex[:6].upper()}"
)

# Get AI model
model_response = (
    supabase
    .table("ai_models")
    .select("id")
    .eq("model_code", "NO_SHOW_PREDICTION")
    .limit(1)
    .execute()
)

if not model_response.data:
    raise Exception(
        "NO_SHOW_PREDICTION model not found in ai_models."
    )

model_id = model_response.data[0]["id"]

input_features = {
    feature: row[feature]
    for feature in FEATURES
}

input_features["predicted_no_show"] = bool(prediction_class)
input_features["no_show_probability"] = probability_percent

explanation = (
    f"AI predicts a {probability_percent}% probability "
    f"of appointment no-show. "
    f"Previous no-shows: {row['previous_no_shows']}, "
    f"previous appointments: {row['previous_appointments']}, "
    f"days until appointment: {row['days_until_appointment']}, "
    f"reminder sent: {row['reminder_sent']}."
)

prediction = {
    "prediction_code": prediction_code,
    "model_id": model_id,
    "prediction_date": str(row["feature_date"]),
    "target_date": str(row["feature_date"]),
    "target_entity": "appointment_no_show",
    "prediction_value": probability_percent,
    "prediction_label": label,
    "probability": probability,
    "confidence_score": None,
    "risk_level": risk_level,
    "input_features": input_features,
    "prediction_explanation": explanation,
    "model_version": "1.0.0",
    "status": "generated"
}

result = (
    supabase
    .table("ai_predictions")
    .insert(prediction)
    .execute()
)

print("\n===== NO-SHOW PREDICTION =====")
print(f"Prediction Code : {prediction_code}")
print(f"Appointment ID  : Feature #{row['id']}")
print(f"No-Show         : {'YES' if prediction_class else 'NO'}")
print(f"Probability     : {probability_percent}%")
print(f"Label           : {label}")
print(f"Risk Level      : {risk_level}")
print("Saved to        : ai_predictions")
print("===============================\n")