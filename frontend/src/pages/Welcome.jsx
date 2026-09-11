import React from "react";
import { ShieldCheck, ArrowRight, Languages, FileHeart, Clock, Users } from "lucide-react";
import Logo from "../components/branding/Logo";
import Button from "../components/ui/Button";
import EmergencyButton from "../components/emergency/EmergencyButton";
import { useLanguage } from "../context/LanguageContext";

export default function Welcome({ language, onToggleLanguage, onStart, onEmergency }) {
  const { t } = useLanguage();
  
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      {/* Simple header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleLanguage}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Languages className="h-4 w-4" />
              {language === "en" ? "हिन्दी" : "English"}
            </button>
            <EmergencyButton onActivate={onEmergency} compact />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-center">
        <div className="mx-auto max-w-7xl px-6 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
                <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                {t("welcome.badge")}
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {t("welcome.title")}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t("welcome.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg"
                  onClick={onStart}
                  icon={ArrowRight}
                  iconPosition="right"
                  className="shadow-lg"
                >
                  {t("welcome.start")}
                </Button>
                <Button 
                  size="lg"
                  variant="secondary"
                  onClick={onStart}
                >
                  {t("welcome.learnMore")}
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span>{t("welcome.hipaa")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>{t("welcome.available")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>{t("welcome.users")}</span>
                </div>
              </div>
            </div>

            {/* Right side - Feature cards */}
            <div className="grid gap-6">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white flex-shrink-0">
                    <FileHeart className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t("welcome.feature1.title")}</h3>
                    <p className="text-sm text-gray-600">
                      {t("welcome.feature1.desc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white flex-shrink-0">
                    <Languages className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t("welcome.feature2.title")}</h3>
                    <p className="text-sm text-gray-600">
                      {t("welcome.feature2.desc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white flex-shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t("welcome.feature3.title")}</h3>
                    <p className="text-sm text-gray-600">
                      {t("welcome.feature3.desc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <p className="text-sm text-gray-600 text-center">
            {t("welcome.footer")}
          </p>
        </div>
      </footer>
    </div>
  );
}
