import React, { useRef } from "react";

export default function OTPInput({ length = 6, value, onChange, error, disabled }) {
  const inputsRef = useRef([]);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  function setDigit(index, digit) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(""));
  }

  function handleChange(e, index) {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setDigit(index, "");
      return;
    }
    const chars = raw.split("");
    let i = index;
    chars.forEach((c) => {
      if (i < length) {
        setDigit(i, c);
        i++;
      }
    });
    const nextIndex = Math.min(index + chars.length, length - 1);
    inputsRef.current[nextIndex]?.focus();
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        setDigit(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    onChange(pasted.padEnd(length, "").slice(0, length).replace(/\s/g, ""));
    const focusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  }

  return (
    <div
      className="flex justify-center gap-2 sm:gap-3"
      role="group"
      aria-label={`${length}-digit one-time passcode`}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          aria-label={`Digit ${index + 1} of ${length}`}
          className={[
            "h-14 w-11 sm:h-16 sm:w-12 rounded-xl border text-center text-2xl font-semibold",
            "text-text-primary bg-surface transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-primary/30",
            error ? "border-danger" : "border-border focus:border-primary",
            digit ? "border-primary/60" : "",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
