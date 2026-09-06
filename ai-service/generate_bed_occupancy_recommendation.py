import os
import getpass

from dotenv import load_dotenv
from supabase import create_client


# =========================================================
# 1. LOAD ENVIRONMENT
# =========================================================

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "SUPABASE_URL or SUPABASE_SECRET_KEY missing"
    )


# =========================================================
# 2. CONNECT
# =========================================================

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

print("[SUCCESS] Connected to Supabase")


# =========================================================
# 3. HOSPITAL ADMIN LOGIN
# =========================================================

admin_email = input(
    "Hospital Admin Email: "
).strip()

admin_password = getpass.getpass(
    "Hospital Admin Password: "
)

login_response = supabase.auth.sign_in_with_password({
    "email": admin_email,
    "password": admin_password
})

if not login_response.user:
    raise RuntimeError(
        "Hospital Admin login failed"
    )

print("[SUCCESS] Hospital Admin authenticated")

print(
    f"[INFO] Admin User ID: "
    f"{login_response.user.id}"
)


# =========================================================
# 4. GET LATEST BED OCCUPANCY PREDICTION
# =========================================================

print(
    "[INFO] Finding latest bed occupancy prediction..."
)

prediction_response = (
    supabase
    .table("ai_predictions")
    .select(
        "id, prediction_code, prediction_value, "
        "prediction_label, risk_level, target_date"
    )
    .eq("model_id", 3)
    .eq("target_entity", "hospital_bed_occupancy")
    .order("id", desc=True)
    .limit(1)
    .execute()
)

predictions = prediction_response.data

if not predictions:
    raise RuntimeError(
        "No Bed Occupancy prediction found"
    )

prediction = predictions[0]

prediction_id = prediction["id"]


print(
    f"[SUCCESS] Prediction found: ID {prediction_id}"
)

print(
    f"[INFO] Prediction Code: "
    f"{prediction['prediction_code']}"
)

print(
    f"[INFO] Predicted Occupancy: "
    f"{prediction['prediction_value']}%"
)


# =========================================================
# 5. GENERATE RECOMMENDATION
# =========================================================

print()
print(
    f"[INFO] Generating recommendation "
    f"for prediction ID: {prediction_id}"
)

response = supabase.rpc(
    "generate_bed_occupancy_recommendation",
    {
        "p_prediction_id": prediction_id
    }
).execute()

recommendation_id = response.data


# =========================================================
# 6. RESULT
# =========================================================

print()
print("=" * 55)
print("BED OCCUPANCY AI RECOMMENDATION")
print("=" * 55)

print(
    f"Prediction ID      : {prediction_id}"
)

print(
    f"Prediction Code    : "
    f"{prediction['prediction_code']}"
)

print(
    f"Predicted Occupancy: "
    f"{prediction['prediction_value']}%"
)

print(
    f"Recommendation ID  : {recommendation_id}"
)

print(
    "Status             : PENDING"
)

print(
    "[SUCCESS] Bed occupancy AI recommendation generated"
)

print("=" * 55)