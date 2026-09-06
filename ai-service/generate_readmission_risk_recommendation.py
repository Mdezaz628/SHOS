import os
from dotenv import load_dotenv
from supabase import create_client
from getpass import getpass

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

email = "hospitaladmin@shos.com"
password = getpass("Hospital Admin Password: ")

supabase.auth.sign_in_with_password({
    "email": email,
    "password": password
})

print("Admin login successful")

prediction = (
    supabase.table("ai_predictions")
    .select(
        "id,prediction_code,prediction_value,"
        "prediction_label,risk_level,target_date"
    )
    .eq("target_entity", "patient_readmission_risk")
    .order("created_at", desc=True)
    .limit(1)
    .execute()
)

if not prediction.data:
    raise Exception("No readmission risk prediction found.")

p = prediction.data[0]

print("\nLatest prediction:")
print("ID:", p["id"])
print("Code:", p["prediction_code"])
print("Probability:", p["prediction_value"])
print("Label:", p["prediction_label"])
print("Risk:", p["risk_level"])

result = supabase.rpc(
    "generate_readmission_risk_recommendation",
    {
        "p_prediction_id": p["id"]
    }
).execute()

print("\n===== RECOMMENDATION GENERATED =====")
print("Recommendation ID:", result.data)

recommendation = (
    supabase.table("ai_recommendations")
    .select(
        "id,title,priority,status,recommendation"
    )
    .eq("id", result.data)
    .single()
    .execute()
)

print(recommendation.data)