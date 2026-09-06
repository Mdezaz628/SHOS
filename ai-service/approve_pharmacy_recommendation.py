import os
import getpass
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL or SUPABASE_SECRET_KEY missing")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

ADMIN_EMAIL = "hospitaladmin@shos.com"
RECOMMENDATION_ID = 9


# ==================================================
# 1. LOGIN
# ==================================================

password = getpass.getpass("Hospital Admin Password: ")

login = supabase.auth.sign_in_with_password({
    "email": ADMIN_EMAIL,
    "password": password
})

print("Admin login successful")


# ==================================================
# 2. FIND RECOMMENDATION
# ==================================================

result = (
    supabase
    .table("ai_recommendations")
    .select(
        "id, recommendation_code, prediction_id, "
        "recommendation_type, title, recommendation, "
        "priority, status"
    )
    .eq("id", RECOMMENDATION_ID)
    .single()
    .execute()
)

rec = result.data

print("\n========================================")
print("PHARMACY RECOMMENDATION FOUND")
print("========================================")
print("ID:", rec["id"])
print("Code:", rec["recommendation_code"])
print("Prediction ID:", rec["prediction_id"])
print("Type:", rec["recommendation_type"])
print("Title:", rec["title"])
print("Priority:", rec["priority"])
print("Status:", rec["status"])
print("Recommendation:", rec["recommendation"])


# ==================================================
# 3. APPROVE
# ==================================================

if rec["status"] != "pending":
    print("\nRecommendation is already:", rec["status"])
    raise SystemExit(0)

approval = supabase.rpc(
    "approve_ai_recommendation",
    {
        "p_recommendation_id": RECOMMENDATION_ID,
        "p_implementation_notes":
            "Reviewed by hospital administration. "
            "Pharmacy demand recommendation approved. "
            "Review medicine inventory, low-stock items and "
            "upcoming demand before operational action."
    }
).execute()

print("\n========================================")
print("PHARMACY RECOMMENDATION APPROVED")
print("========================================")
print("Recommendation ID:", approval.data)


# ==================================================
# 4. VERIFY FINAL STATUS
# ==================================================

final_result = (
    supabase
    .table("ai_recommendations")
    .select(
        "id, recommendation_code, title, priority, status, "
        "reviewed_by, reviewed_at, implementation_notes"
    )
    .eq("id", RECOMMENDATION_ID)
    .single()
    .execute()
)

print("\n========================================")
print("FINAL STATUS")
print("========================================")
print(final_result.data)


# ==================================================
# 5. VERIFY AUDIT LOG
# ==================================================

audit_result = (
    supabase
    .table("audit_logs")
    .select(
        "id, action, module, entity_type, entity_id, "
        "description, severity, created_at"
    )
    .eq("action", "AI_RECOMMENDATION_APPROVED")
    .eq("module", "AI_RECOMMENDATIONS")
    .eq("entity_type", "ai_recommendation")
    .eq("entity_id", str(RECOMMENDATION_ID))
    .order("created_at", desc=True)
    .limit(1)
    .execute()
)

print("\n========================================")
print("AUDIT VERIFICATION")
print("========================================")

if audit_result.data:
    print(audit_result.data[0])
    print("\nAudit log verified successfully.")
else:
    print("WARNING: Audit log not found.")


print("\n========================================")
print("PHARMACY RECOMMENDATION APPROVAL COMPLETE")
print("========================================")