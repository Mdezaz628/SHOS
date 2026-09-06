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

# Latest readmission recommendation
recommendation = (
    supabase.table("ai_recommendations")
    .select("id,title,priority,status,recommendation")
    .eq("recommendation_type", "general")
    .ilike("title", "%Readmission%")
    .order("created_at", desc=True)
    .limit(1)
    .execute()
)

if not recommendation.data:
    raise Exception("No readmission recommendation found.")

rec = recommendation.data[0]

print("\nRecommendation found:")
print("ID:", rec["id"])
print("Title:", rec["title"])
print("Priority:", rec["priority"])
print("Status:", rec["status"])

result = supabase.rpc(
    "approve_ai_recommendation",
    {
        "p_recommendation_id": rec["id"],
        "p_implementation_notes":
            "Approved for clinical review workflow. "
            "Use as decision support only and require clinician review."
    }
).execute()

print("\n===== RECOMMENDATION APPROVED =====")
print("Recommendation ID:", result.data)

verify = (
    supabase.table("ai_recommendations")
    .select(
        "id,title,priority,status,reviewed_by,"
        "reviewed_at,implementation_notes"
    )
    .eq("id", rec["id"])
    .single()
    .execute()
)

print("\nFinal status:")
print(verify.data)