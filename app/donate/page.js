"use client";
import { useState } from "react";
import AnimatedSection from "@/app/components/AnimatedSection";
import { Heart, Copy, Check, Shield, Receipt, Users } from "lucide-react";

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

export default function DonatePage() {
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState(false);
  const [copied, setCopied] = useState(null);

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
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
                  <button key={a} onClick={() => { setSelected(a); setCustom(false); }}
                    className={`py-4 rounded-2xl font-bold text-lg transition-all duration-300 border-2 ${selected === a ? "border-amber-400 bg-amber-400 text-gray-900 scale-105 shadow-lg shadow-amber-400/25" : "border-gray-200 text-gray-700 hover:border-emerald-400"}`}
                  >₹{a.toLocaleString()}</button>
                ))}
                <button onClick={() => { setCustom(true); setSelected(null); }}
                  className={`py-4 rounded-2xl font-bold text-lg transition-all border-2 ${custom ? "border-amber-400 bg-amber-400 text-gray-900 scale-105" : "border-gray-200 text-gray-700 hover:border-emerald-400"}`}
                >Custom</button>
              </div>
              {custom && <input type="number" placeholder="Enter custom amount (₹)" className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500" />}

              <form onSubmit={e => { e.preventDefault(); alert("Thank you! Please complete payment via bank transfer."); }} className="space-y-4">
                <input required placeholder="Full Name *" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input required type="tel" placeholder="Phone *" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input type="email" placeholder="Email" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>General Fund</option>
                  <option>Education & Scholarships</option>
                  <option>Health Camps</option>
                  <option>Women Empowerment</option>
                  <option>Rural Development</option>
                </select>
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2">
                  <Heart size={20} fill="currentColor" /> Proceed to Donate
                </button>
                <p className="text-xs text-gray-400 text-center">🧾 All donations eligible for 80G Tax Exemption.</p>
              </form>
            </AnimatedSection>

            {/* Bank + Impact */}
            <AnimatedSection delay={0.2}>
              <div className="bg-gray-950 text-white rounded-3xl p-8 shadow-2xl mb-8">
                <h3 className="text-amber-400 font-bold text-lg mb-1">Bank Transfer Details</h3>
                <p className="text-gray-400 text-sm mb-6">For direct bank transfers, use the details below.</p>
                <div className="space-y-0 divide-y divide-white/10">
                  {bankDetails.map(b => (
                    <div key={b.label} className="flex justify-between items-center py-4">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{b.label}</div>
                        <div className="font-semibold">{b.value}</div>
                      </div>
                      <button onClick={() => copy(b.value, b.label)} className="text-amber-400 hover:text-amber-300 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1 hover:bg-white/5 transition-colors">
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
