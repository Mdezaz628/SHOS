import os
import getpass

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
# HOSPITAL ADMIN LOGIN
# =========================================================

admin_email = "hospitaladmin@shos.com"

admin_password = getpass.getpass(
    "Enter Hospital Admin password: "
)

login_response = supabase.auth.sign_in_with_password({
    "email": admin_email,
    "password": admin_password
})

if not login_response.user:
    raise Exception("Admin login failed")

print(
    f"[SUCCESS] Logged in as: "
    f"{login_response.user.email}"
)


# =========================================================
# GET LATEST PHARMACY PREDICTION
# =========================================================

print(
    "[INFO] Finding latest pharmacy demand prediction..."
)

prediction_response = (
    supabase
    .table("ai_predictions")
    .select(
        "id, prediction_code, target_date, "
        "prediction_value, prediction_label, risk_level"
    )
    .eq(
        "target_entity",
        "pharmacy_medicine_demand"
    )
    .order(
        "created_at",
        desc=True
    )
    .limit(1)
    .execute()
)

if not prediction_response.data:
    raise Exception(
        "No pharmacy demand prediction found"
    )

prediction = prediction_response.data[0]

prediction_id = prediction["id"]


print()
print("LATEST PHARMACY PREDICTION")
print("----------------------------------------")

print(
    f"Prediction ID   : {prediction_id}"
)

print(
    f"Prediction Code : {prediction['prediction_code']}"
)

print(
    f"Target Date     : {prediction['target_date']}"
)

print(
    f"Predicted Demand: "
    f"{prediction['prediction_value']}"
)

print(
    f"Demand Level    : "
    f"{prediction['prediction_label']}"
)

print(
    f"Risk Level      : "
    f"{prediction['risk_level']}"
)

print("----------------------------------------")


# =========================================================
# GENERATE RECOMMENDATION
# =========================================================

print(
    "[INFO] Generating AI pharmacy recommendation..."
)

response = supabase.rpc(
    "generate_pharmacy_demand_recommendation",
    {
        "p_prediction_id": prediction_id
    }
).execute()


if not response.data:
    raise Exception(
        "Pharmacy recommendation generation failed"
    )


recommendation_id = response.data


# =========================================================
# RESULT
# =========================================================

print()
print("========================================")
print("PHARMACY AI RECOMMENDATION")
print("========================================")

print(
    f"Prediction ID       : {prediction_id}"
)

print(
    f"Recommendation ID   : {recommendation_id}"
)

print(
    "Status              : PENDING"
)

print("========================================")

print()
print(
    "[SUCCESS] Pharmacy recommendation generated"
)