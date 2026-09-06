import os
import getpass

from dotenv import load_dotenv
from supabase import create_client


# =========================================================
# LOAD ENVIRONMENT
# =========================================================

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
    raise ValueError("Supabase environment variables missing")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)

print("[SUCCESS] Connected to Supabase")


# =========================================================
# HOSPITAL ADMIN LOGIN
# =========================================================

admin_email = "hospitaladmin@shos.com"

admin_password = getpass.getpass(
    "Enter Hospital Admin password: "
)

login_response = supabase.auth.sign_in_with_password({
    "email": admin_email,
    "password": admin_password
})

if not login_response.user:
    raise Exception("Admin login failed")

print(
    f"[SUCCESS] Logged in as: "
    f"{login_response.user.email}"
)


# =========================================================
# RECOMMENDATION ID
# =========================================================

recommendation_id = 8


# =========================================================
# APPROVE RECOMMENDATION
# =========================================================

print()
print(
    f"[INFO] Approving recommendation "
    f"ID: {recommendation_id}"
)

response = supabase.rpc(
    "approve_ai_recommendation",
    {
        "p_recommendation_id": recommendation_id,
        "p_implementation_notes": (
            "Staff requirement forecast reviewed by "
            "Hospital Admin. Critical shortage detected. "
            "Consider appropriate shift reallocation, "
            "staff deployment and additional staffing "
            "arrangements. Final operational action "
            "requires hospital management approval."
        )
    }
).execute()


if not response.data:
    raise Exception(
        "Recommendation approval failed"
    )


# =========================================================
# RESULT
# =========================================================

print()
print("========================================")
print("STAFF RECOMMENDATION APPROVAL")
print("========================================")

print(
    f"Recommendation ID : {recommendation_id}"
)

print(
    "Status             : APPROVED"
)

print(
    "Reviewed By        : Hospital Admin"
)

print(
    "Audit Log          : CREATED"
)

print("========================================")

print()
print(
    "[SUCCESS] Staff recommendation approved"
)