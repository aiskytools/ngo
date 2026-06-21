"use client";
import { useState, useEffect, useCallback } from "react";
import { IndianRupee, HeartHandshake, MessageSquare, Inbox, FileText, Star, Loader2 } from "lucide-react";
import { jsonRequest } from "../_lib/admin";

function BarChart({ labels, values, color, format = (v) => v, title }) {
  const max = Math.max(1, ...values);
  const total = values.reduce((a, b) => a + b, 0);
  return (
    <div role="img" aria-label={`${title}. ${labels.map((l, i) => `${l}: ${format(values[i])}`).join(", ")}.`}>
      <div className="flex items-end gap-2 h-36">
        {values.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full" title={`${labels[i]}: ${format(v)}`}>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums">{v > 0 ? format(v) : ""}</span>
            <div
              className="w-full rounded-t transition-all"
              style={{ height: `${(v / max) * 100}%`, background: color, minHeight: v > 0 ? 4 : 0 }}
            />
            <span className="text-[10px] text-gray-400 dark:text-gray-500">{labels[i]}</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">Total (6 mo): {format(total)}</div>
    </div>
  );
}

const inr = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

export default function Overview({ onAuthExpire }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await jsonRequest("/api/admin/stats", { onAuthExpire });
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [onAuthExpire]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-gray-300" /></div>;
  }
  if (error || !stats) {
    return <p className="text-sm text-rose-600 dark:text-rose-400 py-8 text-center">{error || "No data."}</p>;
  }

  const cards = [
    { label: "Amount Raised", value: inr(stats.donations.raised), icon: IndianRupee, accent: "text-emerald-600 bg-emerald-50" },
    { label: "Donations", value: stats.counts.donations, sub: `${stats.donations.paidCount} confirmed`, icon: HeartHandshake, accent: "text-rose-600 bg-rose-50" },
    { label: "Enquiries", value: stats.counts.enquiries, sub: stats.pending.newEnquiries ? `${stats.pending.newEnquiries} new` : null, icon: MessageSquare, accent: "text-amber-600 bg-amber-50" },
    { label: "Messages", value: stats.counts.contacts, sub: stats.pending.newContacts ? `${stats.pending.newContacts} new` : null, icon: Inbox, accent: "text-blue-600 bg-blue-50" },
    { label: "Blog Posts", value: stats.counts.blogs, icon: FileText, accent: "text-indigo-600 bg-indigo-50" },
    { label: "Stories", value: stats.counts.stories, icon: Star, accent: "text-purple-600 bg-purple-50" },
  ];

  const m = stats.monthly;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.accent}`}><c.icon size={18} /></div>
            <div className="text-2xl font-bold text-gray-900 tabular-nums">{c.value}</div>
            <div className="text-xs text-gray-500">{c.label}{c.sub ? <span className="text-amber-600"> · {c.sub}</span> : null}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">Donations by month (₹)</h4>
          <BarChart labels={m.labels} values={m.donationAmount} color="#059669" format={inr} title="Donations by month" />
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">Enquiries by month</h4>
          <BarChart labels={m.labels} values={m.enquiries} color="#d97706" title="Enquiries by month" />
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">Messages by month</h4>
          <BarChart labels={m.labels} values={m.contacts} color="#2563eb" title="Messages by month" />
        </div>
      </div>
    </div>
  );
}
