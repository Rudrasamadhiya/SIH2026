import React, { useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, Info } from "lucide-react";
import Logo from "../components/branding/Logo";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useLanguage } from "../context/LanguageContext";

const ABHA_PATTERN = /^\d{2}-\d{4}-\d{4}-\d{4}$|^\d{14}$/;

function formatAbha(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 14);
  const parts = [digits.slice(0, 2), digits.slice(2, 6), digits.slice(6, 10), digits.slice(10, 14)];
  return parts.filter(Boolean).join("-");
}

export default function Login({ abhaId, setAbhaId, onBack, onContinue }) {
  const { t } = useLanguage();
  const [touched, setTouched] = useState(false);
  const isValid = ABHA_PATTERN.test(abhaId) || abhaId.replace(/\D/g, "").length === 14;
  const error = touched && !isValid ? t("login.error") : undefined;

  function handleContinue() {
    setTouched(true);
    if (isValid) onContinue();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("login.title")}</h2>
          <p className="text-gray-600 mb-6">
            {t("login.subtitle")}
          </p>

          <div className="mb-6">
            <Input
              label={t("login.abhaLabel")}
              placeholder={t("login.abhaPlaceholder")}
              value={abhaId}
              onChange={(e) => setAbhaId(formatAbha(e.target.value))}
              onBlur={() => setTouched(true)}
              error={error}
              inputMode="numeric"
              autoFocus
            />
          </div>

          <div className="mb-6 flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-gray-900 mb-1">{t("login.secureAuth")}</p>
              <p className="text-gray-600">
                {t("login.secureAuth.desc")}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Button 
              variant="secondary" 
              icon={ArrowLeft} 
              onClick={onBack}
            >
              {t("common.back")}
            </Button>
            <Button 
              fullWidth 
              icon={ArrowRight} 
              iconPosition="right" 
              onClick={handleContinue}
            >
              {t("common.continue")}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t("login.dontHave")}{" "}
              <a 
                href="https://abha.abdm.gov.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                {t("login.createOne")}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <ShieldCheck className="h-4 w-4" />
          <span>{t("login.encryption")}</span>
        </div>
      </div>
    </div>
  );
}
