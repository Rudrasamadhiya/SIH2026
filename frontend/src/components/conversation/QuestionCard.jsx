import React from "react";

export default function QuestionCard({ question, hint = "Take your time. Speak naturally." }) {
  return (
    <div className="text-center animate-fade-slide-up">
      <p className="mx-auto max-w-xl text-[26px] font-semibold leading-snug text-text-primary sm:text-[30px]">
        {question}
      </p>
      {hint && <p className="mt-3 text-sm text-text-muted">{hint}</p>}
    </div>
  );
}
