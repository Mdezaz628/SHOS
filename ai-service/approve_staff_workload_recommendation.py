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

recommendation_id = 13

result = supabase.rpc(
    "approve_ai_recommendation",
    {
        "p_recommendation_id": recommendation_id,
        "p_implementation_notes":
            "Approved. Maintain normal staff allocation and continue workload monitoring."
    }
).execute()

print("\n===== STAFF WORKLOAD RECOMMENDATION APPROVED =====")
print("Recommendation ID:", result.data)

verify = (
    supabase.table("ai_recommendations")
    .select(
        "id,title,priority,status,reviewed_by,"
        "reviewed_at,implementation_notes"
    )
    .eq("id", recommendation_id)
    .single()
    .execute()
)

print("\nFinal status:")
print(verify.data)