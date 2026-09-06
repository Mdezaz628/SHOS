import os
import getpass

from dotenv import load_dotenv
from supabase import create_client


# =========================================================
# 1. LOAD ENVIRONMENT
# =========================================================

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "SUPABASE_URL or SUPABASE_SECRET_KEY missing"
    )


# =========================================================
# 2. CONNECT
# =========================================================

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

print("[SUCCESS] Connected to Supabase")


# =========================================================
# 3. ADMIN LOGIN
# =========================================================

admin_email = input(
    "Hospital Admin Email: "
).strip()

admin_password = getpass.getpass(
    "Hospital Admin Password: "
)

login_response = supabase.auth.sign_in_with_password({
    "email": admin_email,
    "password": admin_password
})

if not login_response.user:
    raise RuntimeError(
        "Hospital Admin login failed"
    )

print("[SUCCESS] Hospital Admin authenticated")

print(
    f"[INFO] Admin User ID: {login_response.user.id}"
)


# =========================================================
# 4. APPROVE RECOMMENDATION
# =========================================================

recommendation_id = 3

print(
    f"[INFO] Approving recommendation ID: "
    f"{recommendation_id}"
)

response = supabase.rpc(
    "approve_ai_recommendation",
    {
        "p_recommendation_id": recommendation_id,
        "p_implementation_notes":
            "Emergency demand forecast reviewed by Hospital Admin. "
            "Maintain normal emergency readiness and monitor "
            "bed, ambulance and emergency resource availability."
    }
).execute()


# =========================================================
# 5. RESULT
# =========================================================

print()
print("=" * 50)
print("AI RECOMMENDATION APPROVAL")
print("=" * 50)

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
    "[SUCCESS] AI recommendation approved successfully"
)

print("=" * 50)