import os
import getpass

from dotenv import load_dotenv
from supabase import create_client


# =========================================================
# LOAD ENV
# =========================================================

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)

print("[SUCCESS] Connected to Supabase")


# =========================================================
# ADMIN LOGIN
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
    f"[SUCCESS] Logged in as: {login_response.user.email}"
)


# =========================================================
# GET LATEST STAFF PREDICTION
# =========================================================

print("[INFO] Finding latest staff requirement prediction...")

prediction_response = (
    supabase
    .table("ai_predictions")
    .select(
        "id, prediction_code, target_date, "
        "prediction_value, prediction_label, risk_level"
    )
    .eq(
        "target_entity",
        "hospital_staff_requirement"
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
        "No staff requirement prediction found"
    )

prediction = prediction_response.data[0]

prediction_id = prediction["id"]


print()
print("LATEST STAFF PREDICTION")
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
    f"Required Staff  : {prediction['prediction_value']}"
)
print(
    f"Risk Level      : {prediction['risk_level']}"
)
print("----------------------------------------")


# =========================================================
# GENERATE RECOMMENDATION
# =========================================================

print(
    "[INFO] Generating AI staff recommendation..."
)

response = supabase.rpc(
    "generate_staff_requirement_recommendation",
    {
        "p_prediction_id": prediction_id
    }
).execute()


if not response.data:
    raise Exception(
        "Recommendation generation failed"
    )


recommendation_id = response.data


print()
print("========================================")
print("STAFF AI RECOMMENDATION")
print("========================================")
print(
    f"Prediction ID       : {prediction_id}"
)
print(
    f"Recommendation ID   : {recommendation_id}"
)
print("Status              : PENDING")
print("========================================")

print()
print(
    "[SUCCESS] Staff recommendation generated"
)