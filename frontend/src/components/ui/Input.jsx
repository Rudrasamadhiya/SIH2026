import React from "react";

export default function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "w-full rounded-xl border bg-surface px-4 py-3.5 text-[16px] text-text-primary",
          "placeholder:text-text-muted transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-primary/30",
          error
            ? "border-danger focus:border-danger"
            : "border-border focus:border-primary",
          className,
        ].join(" ")}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
