import os
import sys
from dotenv import load_dotenv
from supabase import create_client

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
    raise ValueError("Supabase environment variables (SUPABASE_URL and SUPABASE_SECRET_KEY) are missing in .env!")

if "your-project-id" in SUPABASE_URL:
    print("[ERROR] SUPABASE_URL is still placeholder: 'https://your-project-id.supabase.co'")
    print("Please paste your real Supabase Project URL in ai-service/.env and save the file.")
    sys.exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)
print("[SUCCESS] AI Service connected to Supabase successfully!")

try:
    response = (
        supabase
        .table("ai_patient_load_training_dataset")
        .select("*")
        .order("feature_date")
        .execute()
    )

    data = response.data
    print(f"Rows received: {len(data)}")

    if data:
        print("First row sample:")
        print(data[0])
    else:
        print("No historical training data available yet (0 rows).")
        print("This is completely normal at this stage.")
except Exception as e:
    print("[ERROR] Error querying Supabase table/view:", e)