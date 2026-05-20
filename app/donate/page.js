"use client";
import { useState } from "react";
import Script from "next/script";
import AnimatedSection from "@/app/components/AnimatedSection";
import { Heart, Copy, Check, Shield, Receipt, Users, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const amounts = [500, 1000, 2500, 5000, 11000];
const impacts = [
  { amount: "₹500", desc: "📚 Books & stationery for 1 child" },
  { amount: "₹1,000", desc: "👟 School uniform + shoes" },
  { amount: "₹2,500", desc: "🏥 Health camp for 10 patients" },
  { amount: "₹5,000", desc: "🎓 Full annual scholarship" },
  { amount: "₹11,000", desc: "🏠 One family's livelihood support" },
];
const bankDetails = [
  { label: "Account Name", value: "Sant Gadgebaba Sevabhavi Sanstha" },
  { label: "Account Number", value: "988020000229" },
  { label: "IFSC Code", value: "BARB0AMBJ52" },
  { label: "MICR Code", value: "431012152" },
  { label: "Bank", value: "Bank of Baroda, Ambajogai" },
];
const funds = [
  "General Fund",
  "Education & Scholarships",
  "Health Camps",
  "Women Empowerment",
  "Rural Development",
];

export default function DonatePage() {
  const [selected, setSelected] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [copied, setCopied] = useState(null);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const resolvedAmount = selected ?? (customAmount ? parseInt(customAmount, 10) : 0);

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const openRazorpay = ({ key, orderId, amount, donor }) =>
    new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.Razorpay) {
        reject(new Error("Payment SDK not loaded yet. Please retry in a moment."));
        return;
      }
      const rzp = new window.Razorpay({
        key,
        order_id: orderId,
        amount,
        currency: "INR",
        name: "Aadhar Manuskicha",
        description: `Donation — ${donor.fund}`,
        prefill: { name: donor.name, email: donor.email, contact: donor.phone },
        theme: { color: "#d97706" },
        handler: (response) => resolve(response),
        modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
      });
      rzp.on("payment.failed", (err) =>
        reject(new Error(err?.error?.description || "Payment failed"))
      );
      rzp.open();
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status.state === "submitting") return;

    if (!resolvedAmount || resolvedAmount < 100) {
      setStatus({ state: "error", message: "Please select or enter an amount of at least ₹100." });
      return;
    }

    const fd = new FormData(e.target);
    const donor = {
      name: fd.get("fullName"),
      phone: fd.get("phone"),
      email: fd.get("email") || "",
      fund: fd.get("fund"),
    };

    setStatus({ state: "submitting", message: "" });
    try {
      const orderRes = await fetch("/api/donate/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: resolvedAmount, donor }),
      });
      const orderData = await orderRes.json().catch(() => ({}));
      if (!orderRes.ok) throw new Error(orderData.error || "Could not create order");

      const payment = await openRazorpay({
        key: orderData.key,
        orderId: orderData.orderId,
        amount: orderData.amount,
        donor,
      });

      const verifyRes = await fetch("/api/donate/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: payment.razorpay_order_id,
          paymentId: payment.razorpay_payment_id,
          signature: payment.razorpay_signature,
        }),
      });
      const verifyData = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");

      setStatus({
        state: "success",
        message: `Thank you, ${donor.name}! Your donation of ₹${resolvedAmount.toLocaleString("en-IN")} has been received. A receipt will be emailed shortly.`,
      });
      e.target.reset();
      setSelected(null);
      setCustomAmount("");
    } catch (err) {
      setStatus({ state: "error", message: err.message || "Something went wrong." });
    }
  };

  const submitting = status.state === "submitting";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <section className="relative pt-32 pb-20 bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold text-white mb-4">Be Someone&apos;s Aadhar Today</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Your generosity directly funds education, healthcare, and livelihoods for families in Marathwada.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-start">
            {/* Form */}
            <AnimatedSection>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-gray-900 mb-2">Make a Donation</h2>
              <p className="text-gray-500 mb-8">Choose an amount or enter your own.</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {amounts.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => { setSelected(a); setCustomAmount(""); }}
                    className={`py-4 rounded-2xl font-bold text-lg transition-all duration-300 border-2 ${selected === a ? "border-amber-400 bg-amber-400 text-gray-900 scale-105 shadow-lg shadow-amber-400/25" : "border-gray-200 text-gray-700 hover:border-emerald-400"}`}
                  >₹{a.toLocaleString()}</button>
                ))}
                <button
                  type="button"
                  onClick={() => { setSelected(null); }}
                  className={`py-4 rounded-2xl font-bold text-lg transition-all border-2 ${selected === null ? "border-amber-400 bg-amber-400 text-gray-900 scale-105" : "border-gray-200 text-gray-700 hover:border-emerald-400"}`}
                >Custom</button>
              </div>
              {selected === null && (
                <input
                  type="number"
                  min={100}
                  max={1000000}
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  placeholder="Enter custom amount (₹)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="fullName" required maxLength={200} placeholder="Full Name *" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input name="phone" required type="tel" maxLength={20} placeholder="Phone *" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input name="email" type="email" maxLength={254} placeholder="Email (for receipt)" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <select name="fund" defaultValue="General Fund" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {funds.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <button type="submit" disabled={submitting} className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting
                    ? <><Loader2 size={20} className="animate-spin" /> Processing…</>
                    : <><Heart size={20} fill="currentColor" /> Proceed to Donate {resolvedAmount > 0 ? `(₹${resolvedAmount.toLocaleString("en-IN")})` : ""}</>}
                </button>
                <p className="text-xs text-gray-400 text-center">🧾 All donations eligible for 80G Tax Exemption.</p>
                {status.state === "success" && (
                  <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm border border-emerald-100">
                    <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
                    <span>{status.message}</span>
                  </div>
                )}
                {status.state === "error" && (
                  <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-50 text-rose-700 text-sm border border-rose-100">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <span>{status.message}</span>
                  </div>
                )}
              </form>
            </AnimatedSection>

            {/* Bank + Impact */}
            <AnimatedSection delay={0.2}>
              <div className="bg-gray-950 text-white rounded-3xl p-8 shadow-2xl mb-8">
                <h3 className="text-amber-400 font-bold text-lg mb-1">Bank Transfer Details</h3>
                <p className="text-gray-400 text-sm mb-6">Prefer a direct bank transfer? Use the details below.</p>
                <div className="space-y-0 divide-y divide-white/10">
                  {bankDetails.map(b => (
                    <div key={b.label} className="flex justify-between items-center py-4">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{b.label}</div>
                        <div className="font-semibold">{b.value}</div>
                      </div>
                      <button type="button" onClick={() => copy(b.value, b.label)} className="text-amber-400 hover:text-amber-300 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1 hover:bg-white/5 transition-colors">
                        {copied === b.label ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-100">
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-gray-900 mb-6">Your Impact</h3>
                <div className="space-y-0 divide-y divide-gray-100">
                  {impacts.map(im => (
                    <div key={im.amount} className="flex items-center gap-4 py-3">
                      <span className="font-[family-name:var(--font-heading)] font-bold text-emerald-700 min-w-[80px]">{im.amount}</span>
                      <span className="text-gray-600 text-sm">{im.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-6 flex-wrap">
                {[{ icon: Shield, label: "100% Transparent" }, { icon: Receipt, label: "80G Tax Benefit" }, { icon: Users, label: "Direct to Beneficiaries" }].map(b => (
                  <div key={b.label} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                    <b.icon size={14} /> {b.label}
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
