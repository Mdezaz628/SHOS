import os
from getpass import getpass
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)

EMAIL = "hospitaladmin@shos.com"
PASSWORD = getpass("Hospital Admin password: ")

login = supabase.auth.sign_in_with_password({
    "email": EMAIL,
    "password": PASSWORD
})

if not login.user:
    raise Exception("Hospital Admin login failed.")

print("Admin login successful.")

# Latest no-show prediction
result = (
    supabase
    .table("ai_predictions")
    .select(
        "id, prediction_code, target_date, "
        "prediction_value, prediction_label, "
        "probability, risk_level"
    )
    .eq("target_entity", "appointment_no_show")
    .order("created_at", desc=True)
    .limit(1)
    .execute()
)

if not result.data:
    raise Exception("No no-show prediction found.")

prediction = result.data[0]

print("\n===== NO-SHOW PREDICTION =====")
print(f"ID          : {prediction['id']}")
print(f"Code        : {prediction['prediction_code']}")
print(f"Probability : {prediction['prediction_value']}%")
print(f"Label       : {prediction['prediction_label']}")
print(f"Risk        : {prediction['risk_level']}")

# Generate recommendation
rpc_result = supabase.rpc(
    "generate_no_show_recommendation",
    {
        "p_prediction_id": prediction["id"]
    }
).execute()

recommendation_id = rpc_result.data

print("\n===== RECOMMENDATION =====")
print(f"Recommendation ID : {recommendation_id}")
print("Status            : pending")
print("==========================")