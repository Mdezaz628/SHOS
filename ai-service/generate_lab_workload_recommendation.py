import os
from getpass import getpass
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)

EMAIL = "hospitaladmin@shos.com"
PASSWORD = getpass("Hospital Admin password: ")

# Login
login = supabase.auth.sign_in_with_password({
    "email": EMAIL,
    "password": PASSWORD
})

if not login.user:
    raise Exception("Hospital Admin login failed.")

print("Admin login successful.")

# Get latest lab workload prediction
prediction = (
    supabase
    .table("ai_predictions")
    .select("id, prediction_code, target_date, prediction_value, prediction_label, risk_level")
    .eq("target_entity", "lab_workload")
    .order("created_at", desc=True)
    .limit(1)
    .execute()
)

if not prediction.data:
    raise Exception("No lab workload prediction found.")

p = prediction.data[0]

print("\nLatest Prediction:")
print(f"ID       : {p['id']}")
print(f"Code     : {p['prediction_code']}")
print(f"Target   : {p['target_date']}")
print(f"Workload : {p['prediction_value']}")
print(f"Label    : {p['prediction_label']}")
print(f"Risk     : {p['risk_level']}")

# Generate recommendation
result = supabase.rpc(
    "generate_lab_workload_recommendation",
    {
        "p_prediction_id": p["id"]
    }
).execute()

recommendation_id = result.data

print("\n===== LAB RECOMMENDATION =====")
print(f"Recommendation ID : {recommendation_id}")
print("Status            : pending")
print("==============================")