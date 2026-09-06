import os
import getpass
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "SUPABASE_URL or SUPABASE_SECRET_KEY missing in .env"
    )

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

ADMIN_EMAIL = "hospitaladmin@shos.com"


# =========================================================
# 1. LOGIN
# =========================================================

password = getpass.getpass("Hospital Admin Password: ")

login = supabase.auth.sign_in_with_password({
    "email": ADMIN_EMAIL,
    "password": password
})

print("Admin login successful")


# =========================================================
# 2. FIND LATEST PENDING PLAN
# =========================================================

plan_result = (
    supabase
    .table("ai_hospital_plans")
    .select("*")
    .eq("overall_status", "pending_review")
    .order("created_at", desc=True)
    .limit(1)
    .execute()
)

plans = plan_result.data

if not plans:
    print("\nNo pending hospital plan found.")
    raise SystemExit(0)

plan = plans[0]

PLAN_ID = plan["id"]


# =========================================================
# 3. DISPLAY PLAN
# =========================================================

print("\n========================================")
print("HOSPITAL PLAN FOUND")
print("========================================")

print("ID:", plan["id"])
print("Plan Code:", plan["plan_code"])
print("Plan Date:", plan["plan_date"])
print("Risk Level:", plan["overall_risk_level"])
print("Status:", plan["overall_status"])
print("Summary:", plan["summary"])

print("\nRecommendations:")

recommendations = plan.get("recommendations") or []

for recommendation in recommendations:
    print("-", recommendation)


# =========================================================
# 4. APPROVE PLAN
# =========================================================

result = supabase.rpc(
    "approve_hospital_plan",
    {
        "p_plan_id": PLAN_ID,
        "p_implementation_notes":
            "Approved for hospital operations planning. "
            "AI recommendations are decision support only "
            "and require human administrative review."
    }
).execute()


print("\n========================================")
print("HOSPITAL PLAN APPROVED")
print("========================================")

print("Plan ID:", result.data)


# =========================================================
# 5. VERIFY FINAL STATUS
# =========================================================

final_result = (
    supabase
    .table("ai_hospital_plans")
    .select(
        "id, plan_code, plan_date, overall_risk_level, "
        "overall_status, reviewed_by, reviewed_at, "
        "implementation_notes"
    )
    .eq("id", PLAN_ID)
    .single()
    .execute()
)

final_plan = final_result.data

print("\n========================================")
print("FINAL STATUS")
print("========================================")

print(final_plan)


# =========================================================
# 6. VERIFY AUDIT LOG
# =========================================================

audit_result = (
    supabase
    .table("audit_logs")
    .select(
        "id, action, module, entity_type, entity_id, "
        "description, severity, created_at"
    )
    .eq("action", "HOSPITAL_PLAN_APPROVED")
    .eq("module", "AI_HOSPITAL_PLANS")
    .eq("entity_type", "ai_hospital_plan")
    .eq("entity_id", str(PLAN_ID))
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
print("HOSPITAL PLAN APPROVAL COMPLETE")
print("========================================")