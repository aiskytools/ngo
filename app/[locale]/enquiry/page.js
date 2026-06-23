"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import AnimatedSection from "@/app/components/AnimatedSection";
import { ENQUIRY_CATEGORIES } from "@/lib/status";
import { analytics } from "@/lib/analytics";
import { Send, Loader2, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";

const field = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500";

export default function EnquiryPage() {
  const t = useTranslations("enquiry");
  const categoryLabels = t.raw("categories");
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const submitting = status.state === "submitting";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const fd = new FormData(e.target);
    const payload = {
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      subject: fd.get("subject"),
      category: fd.get("category"),
      message: fd.get("message"),
      website: fd.get("website"), // honeypot
    };

    setStatus({ state: "submitting", message: "" });
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ state: "error", message: data.error || t("errorFailed") });
        return;
      }
      analytics.enquirySubmit(payload.category);
      setStatus({ state: "success", message: t("success") });
      e.target.reset();
    } catch {
      setStatus({ state: "error", message: t("errorNetwork") });
    }
  };

  return (
    <>
      <section className="relative pt-32 pb-20 gradient-mesh overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold text-white mb-4">{t("heroTitle")}</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t("heroSubtitle")}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><MessageSquare size={20} /></div>
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-gray-900">{t("formTitle")}</h2>
                  <p className="text-gray-500 text-sm">{t("formSubtitle")}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="enq-name" className="block text-sm font-medium text-gray-600 mb-1">{t("fullName")} <span className="text-rose-500">*</span></label>
                    <input id="enq-name" name="name" required maxLength={200} autoComplete="name" placeholder={t("phName")} className={field} />
                  </div>
                  <div>
                    <label htmlFor="enq-phone" className="block text-sm font-medium text-gray-600 mb-1">{t("phoneLabel")} <span className="text-rose-500">*</span></label>
                    <input id="enq-phone" name="phone" required type="tel" maxLength={20} autoComplete="tel" placeholder={t("phPhone")} className={field} />
                  </div>
                </div>
                <div>
                  <label htmlFor="enq-email" className="block text-sm font-medium text-gray-600 mb-1">{t("emailLabel")} <span className="text-rose-500">*</span></label>
                  <input id="enq-email" name="email" required type="email" maxLength={254} autoComplete="email" placeholder={t("phEmail")} className={field} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="enq-category" className="block text-sm font-medium text-gray-600 mb-1">{t("categoryLabel")} <span className="text-rose-500">*</span></label>
                    <select id="enq-category" name="category" defaultValue="General" className={`${field} text-gray-600`}>
                      {ENQUIRY_CATEGORIES.map(c => <option key={c} value={c}>{categoryLabels[c]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="enq-subject" className="block text-sm font-medium text-gray-600 mb-1">{t("subjectLabel")} <span className="text-rose-500">*</span></label>
                    <input id="enq-subject" name="subject" required maxLength={300} placeholder={t("phSubject")} className={field} />
                  </div>
                </div>
                <div>
                  <label htmlFor="enq-message" className="block text-sm font-medium text-gray-600 mb-1">{t("messageLabel")} <span className="text-rose-500">*</span></label>
                  <textarea id="enq-message" name="message" required rows={5} maxLength={5000} placeholder={t("phMessage")} className={`${field} resize-none`} />
                </div>

                {/* Honeypot — visually hidden; must stay empty. */}
                <input name="website" type="text" tabIndex={-1} aria-hidden="true" autoComplete="off" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

                <button type="submit" disabled={submitting} className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? <><Loader2 size={18} className="animate-spin" /> {t("sending")}</> : <><Send size={18} /> {t("submit")}</>}
                </button>

                <div aria-live="polite">
                  {status.state === "success" && (
                    <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm border border-emerald-100">
                      <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" /><span>{status.message}</span>
                    </div>
                  )}
                  {status.state === "error" && (
                    <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-50 text-rose-700 text-sm border border-rose-100">
                      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" /><span>{status.message}</span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
