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

# Admin login
login = supabase.auth.sign_in_with_password({
    "email": EMAIL,
    "password": PASSWORD
})

if not login.user:
    raise Exception("Hospital Admin login failed.")

print("Admin login successful.")

# Latest pending laboratory recommendation
result = (
    supabase
    .table("ai_recommendations")
    .select(
        "id, recommendation_code, prediction_id, "
        "title, priority, status"
    )
    .eq("recommendation_type", "laboratory")
    .eq("status", "pending")
    .order("created_at", desc=True)
    .limit(1)
    .execute()
)

if not result.data:
    raise Exception("No pending laboratory recommendation found.")

rec = result.data[0]

print("\n===== RECOMMENDATION =====")
print(f"ID       : {rec['id']}")
print(f"Code     : {rec['recommendation_code']}")
print(f"Title    : {rec['title']}")
print(f"Priority : {rec['priority']}")
print(f"Status   : {rec['status']}")

# Approve
approval = supabase.rpc(
    "approve_ai_recommendation",
    {
        "p_recommendation_id": rec["id"],
        "p_implementation_notes":
            "Reviewed by hospital administration. "
            "Laboratory workload recommendation approved. "
            "Monitor lab workload, pending samples and reports "
            "and reallocate staff/resources as required."
    }
).execute()

print("\n===== APPROVAL COMPLETE =====")
print(f"Recommendation ID : {approval.data}")
print("Status            : approved")
print("==============================")