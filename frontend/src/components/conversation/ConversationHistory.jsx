import React from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";

/**
 * A clinical checklist/timeline of the consultation so far — deliberately
 * NOT a chat-bubble layout, since this is a medical interview rather than a
 * chatbot conversation.
 */
export default function ConversationHistory({ turns, currentLabel }) {
  if (!turns.length && !currentLabel) return null;

  return (
    <div className="mx-auto w-full max-w-md">
      <ul className="space-y-2.5">
        {turns.map((turn, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
            <span className="line-clamp-1">{turn.label || turn.transcript}</span>
          </li>
        ))}
        {currentLabel && (
          <li className="flex items-start gap-2.5 text-sm font-semibold text-primary">
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{currentLabel}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
