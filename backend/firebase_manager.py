# backend/firebase_manager.py
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def save_to_timeline(abha_id: str, record_data: dict):
    """
    Saves a medical record to the patient's timeline.
    Structure: patients/{abha_id}/health_timeline/{timestamp}
    """
    try:
        # Reference to the patient document
        patient_ref = db.collection("patients").document(abha_id)
        
        # Ensure patient document exists (create if not)
        patient_ref.set({
            "last_updated": datetime.now(),
            "abha_id": abha_id
        }, merge=True)

        # Add the record to the 'health_timeline' sub-collection
        # We use a timestamp as the document ID for the timeline
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        timeline_ref = patient_ref.collection("health_timeline").document(timestamp)
        
        timeline_ref.set({
            "timestamp": datetime.now(),
            "data": record_data, # The extracted JSON from the extractor
            "type": "Prescription Extraction"
        })
        return True
    except Exception as e:
        print(f"Firebase Error: {e}")
        return False

def get_patient_timeline(abha_id: str):
    """Retrieves all records for a patient sorted by date."""
    try:
        docs = db.collection("patients").document(abha_id).collection("health_timeline").order_by("timestamp", direction="DESCENDING").stream()
        return [doc.to_dict() for doc in docs]
    except Exception as e:
        print(f"Firebase Error: {e}")
        return []