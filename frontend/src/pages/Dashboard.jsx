import React, { useEffect, useState } from "react";
import { 
  Activity, 
  Upload, 
  History, 
  FileText, 
  Clock,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Languages,
  LogOut
} from "lucide-react";
import Logo from "../components/branding/Logo";
import Button from "../components/ui/Button";
import EmergencyButton from "../components/emergency/EmergencyButton";
import Card from "../components/ui/Card";
import { useLanguage } from "../context/LanguageContext";

export default function Dashboard({
  abhaId,
  language,
  onToggleLanguage,
  onStartConsultation,
  onViewHistory,
  onUploadDocuments,
  onEmergency,
}) {
  const { t } = useLanguage();
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t("dashboard.greeting.morning"));
    else if (hour < 17) setGreeting(t("dashboard.greeting.afternoon"));
    else setGreeting(t("dashboard.greeting.evening"));

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [t]);

  const quickActions = [
    {
      icon: Activity,
      title: t("dashboard.startConsultation"),
      description: t("dashboard.startConsultation.desc"),
      color: "primary",
      gradient: "from-blue-500 to-blue-600",
      action: onStartConsultation,
    },
    {
      icon: Upload,
      title: t("dashboard.uploadDocuments"),
      description: t("dashboard.uploadDocuments.desc"),
      color: "success",
      gradient: "from-emerald-500 to-emerald-600",
      action: onUploadDocuments,
    },
    {
      icon: History,
      title: t("dashboard.medicalHistory"),
      description: t("dashboard.medicalHistory.desc"),
      color: "warning",
      gradient: "from-amber-500 to-amber-600",
      action: onViewHistory,
    },
  ];

  const recentActivity = [
    { label: t("dashboard.lastConsultation"), value: t("dashboard.daysAgo", { n: 2 }), icon: Clock },
    { label: t("dashboard.recordsUploaded"), value: t("dashboard.documents", { n: 5 }), icon: FileText },
    { label: t("dashboard.healthScore"), value: t("dashboard.good"), icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleLanguage}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-text-secondary transition-all hover:border-primary hover:text-primary hover:bg-primary-soft"
              >
                <Languages className="h-4 w-4" />
                {language === "hi" ? "हिन्दी" : "English"}
              </button>
              <EmergencyButton onActivate={onEmergency} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-slide-up">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
                {greeting}! 👋
              </h1>
              <p className="mt-2 text-lg text-text-secondary">
                {t("dashboard.welcome")}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-sm font-medium text-primary">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                {t("dashboard.abhaId")} {abhaId}
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-2xl font-bold text-text-primary">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-text-muted">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-text-primary">{t("dashboard.quickActions")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="group relative overflow-hidden rounded-2xl bg-white border border-border p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-transparent animate-fade-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                <div className="relative">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg mb-4`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">{action.description}</p>
                  <div className="flex items-center text-sm font-medium text-primary">
                    Get Started
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity & Health Tips */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-primary">{t("dashboard.recentActivity")}</h2>
                <AlertCircle className="h-5 w-5 text-text-muted" />
              </div>
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-surface-muted border border-border/50 transition-all hover:border-primary/30 hover:bg-primary-soft/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-text-primary">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Health Tips */}
          <div>
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
              <h3 className="text-lg font-semibold mb-3">💡 {t("dashboard.healthTip")}</h3>
              <p className="text-sm opacity-90 leading-relaxed mb-4">
                {t("dashboard.healthTip.content")}
              </p>
              <div className="inline-flex items-center text-sm font-medium opacity-90">
                <Clock className="h-4 w-4 mr-1" />
                {t("dashboard.updatedDaily")}
              </div>
            </Card>

            <div className="mt-4">
              <button
                onClick={() => {/* Logout logic */}}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:border-danger hover:text-danger hover:bg-danger-soft"
              >
                <LogOut className="h-4 w-4" />
                {t("dashboard.signOut")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
