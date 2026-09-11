import React from "react";
import { AlertTriangle, Phone } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function EmergencyModal({ open, onClose, triggeredByAI = false }) {
  return (
    <Modal open={open} onClose={onClose} title="" tone="danger" dismissible={!triggeredByAI}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft">
          <AlertTriangle className="h-7 w-7 text-danger" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">
            {triggeredByAI ? "Please remain at the kiosk" : "Emergency staff notified"}
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            {triggeredByAI
              ? "Based on what you've shared, this may need urgent attention. Medical staff have been notified and are on their way to you."
              : "Medical staff at this facility have been notified and are on their way to assist you."}
          </p>
        </div>

        <div className="w-full space-y-2.5 pt-1">
          <Button variant="danger" fullWidth icon={Phone}>
            Call for Immediate Help
          </Button>
          {!triggeredByAI && (
            <Button variant="secondary" fullWidth onClick={onClose}>
              I'm okay, close this
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
