# backend/alerts.py
import logging

def trigger_emergency_alert(patient_context: str, kiosk_id: str = "KIOSK-001"):
    """
    Called when AI sets emergency=true.
    Returns payload for Frontend: Red Screen + Siren Sound.
    (No Twilio/WhatsApp for now — just visual + audio alert.)
    """
    frontend_payload = {
        "alert_type": "EMERGENCY",
        "message": "EMERGENCY DETECTED. PLEASE REMAIN AT THE KIOSK. MEDICAL STAFF HAS BEEN NOTIFIED.",
        "sound": "siren",
        "color": "red",
        "kiosk_id": kiosk_id,
        "context": patient_context
    }

    logging.warning(f"EMERGENCY TRIGGERED at {kiosk_id}: {patient_context}")
    return frontend_payload