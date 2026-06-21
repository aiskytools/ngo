"use client";
import { useState } from "react";
import AnimatedSection from "@/app/components/AnimatedSection";
import { analytics } from "@/lib/analytics";
import { MapPin, Phone, Mail, Globe, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const INFO = [
  { icon: MapPin, label: "Address", value: "Shivajinagar, Bank Colony, Jogaiwadi, Ambajogai, Beed – 431517, Maharashtra" },
  { icon: Phone, label: "Phone", value: "+91 9422242106", href: "tel:+919422242106" },
  { icon: Mail, label: "Email", value: "santgadgebabango1@gmail.com", href: "mailto:santgadgebabango1@gmail.com" },
  { icon: Globe, label: "Website", value: "www.santgadgebabango.com", href: "https://www.santgadgebabango.com" },
];

const SUBJECTS = [
  "Donation Inquiry",
  "Volunteer With Us",
  "Partnership Proposal",
  "Scholarship Inquiry",
  "General Query",
];

export default function ContactPage() {
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status.state === "submitting") return;

    const fd = new FormData(e.target);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      subject: fd.get("subject"),
      message: fd.get("message"),
      website: fd.get("website"), // honeypot
    };

    setStatus({ state: "submitting", message: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ state: "error", message: data.error || "Failed to send. Please try again." });
        return;
      }
      analytics.contactSubmit();
      setStatus({ state: "success", message: "Thank you! Your message has been received." });
      e.target.reset();
    } catch {
      setStatus({ state: "error", message: "Network error. Please try again." });
    }
  };

  const submitting = status.state === "submitting";

  return (
    <>
      <section className="relative pt-32 pb-20 gradient-mesh overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Whether you have questions, want to volunteer, or wish to partner with us — reach out.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
            {/* Info */}
            <AnimatedSection>
              <div className="text-white rounded-3xl p-8 shadow-2xl h-full" style={{ backgroundColor: "#432723" }}>
                <h3 className="text-amber-400 font-bold text-lg mb-1">Reach Us</h3>
                <p className="text-gray-400 text-sm mb-8">We are always happy to connect with people who share our vision.</p>
                <div className="space-y-6">
                  {INFO.map(c => (
                    <div key={c.label} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-amber-400"><c.icon size={18} /></div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{c.label}</div>
                        {c.href ? (
                          <a href={c.href} className="font-semibold text-sm hover:text-amber-400 transition-colors block leading-tight pt-0.5">{c.value}</a>
                        ) : (
                          <span className="font-semibold text-sm text-white block leading-tight pt-0.5">{c.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 rounded-3xl overflow-hidden shadow-lg">
                <iframe
                  title="Aadhar Manuskicha office location, Ambajogai"
                  src="https://www.google.com/maps?q=18.729091,76.393908&z=15&output=embed"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </AnimatedSection>

            {/* Form */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
                <p className="text-gray-500 text-sm mb-8">We typically respond within 24–48 hours.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input name="name" required placeholder="Full Name *" aria-label="Full name" maxLength={200} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <input name="email" required type="email" placeholder="Email *" aria-label="Email" maxLength={254} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <input name="phone" type="tel" placeholder="Phone" aria-label="Phone" maxLength={20} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <select name="subject" defaultValue="General Query" aria-label="Subject" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <textarea name="message" required rows={5} maxLength={5000} placeholder="Write your message here..." aria-label="Message" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
                  {/* Honeypot — must remain empty for the submission to be accepted. */}
                  <input name="website" type="text" tabIndex={-1} aria-hidden="true" autoComplete="off" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                  <button type="submit" disabled={submitting} className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
                    {submitting ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : <><Send size={18} /> Send Message</>}
                  </button>
                  {status.state === "success" && (
                    <div role="status" className="flex items-start gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm border border-emerald-100">
                      <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
                      <span>{status.message}</span>
                    </div>
                  )}
                  {status.state === "error" && (
                    <div role="alert" className="flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-50 text-rose-700 text-sm border border-rose-100">
                      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                      <span>{status.message}</span>
                    </div>
                  )}
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
