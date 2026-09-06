import os
from supabase import create_client
from dotenv import load_dotenv
from getpass import getpass

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(url, key)

email = "hospitaladmin@shos.com"
password = getpass("Hospital Admin Password: ")

# Login
auth = supabase.auth.sign_in_with_password({
    "email": email,
    "password": password
})

print("Admin login successful")

# Latest resource demand recommendation
rec = (
    supabase.table("ai_recommendations")
    .select("*")
    .eq("recommendation_type", "resource")
    .order("created_at", desc=True)
    .limit(1)
    .execute()
)

if not rec.data:
    print("No resource demand recommendation found.")
    exit()

recommendation = rec.data[0]

print("\nRecommendation found:")
print("ID:", recommendation["id"])
print("Title:", recommendation["title"])
print("Priority:", recommendation["priority"])
print("Status:", recommendation["status"])

# Approve
result = supabase.rpc(
    "approve_ai_recommendation",
    {
        "p_recommendation_id": recommendation["id"],
        "p_implementation_notes":
            "Approved for resource planning. Monitor equipment availability, utilization and upcoming demand."
    }
).execute()

print("\nApproval successful!")
print("Recommendation ID:", result.data)

# Verify
verify = (
    supabase.table("ai_recommendations")
    .select("id,title,status,reviewed_by,reviewed_at,implementation_notes")
    .eq("id", recommendation["id"])
    .single()
    .execute()
)

print("\nFinal status:")
print(verify.data)