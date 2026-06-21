"use client";
import { useState, useEffect, useCallback } from "react";
import { Trash2, Plus, Loader2, IndianRupee } from "lucide-react";
import { jsonRequest, formatDate } from "../_lib/admin";
import { DONATION_STATUSES, DONATION_FUNDS } from "@/lib/status";

const statusStyle = {
  paid: "bg-emerald-100 text-emerald-700",
  manual: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-rose-100 text-rose-700",
  refunded: "bg-gray-200 text-gray-600",
};

export default function DonationsManager({ onAuthExpire }) {
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState({ raised: 0, paidCount: 0 });
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const fetchDonations = useCallback(async () => {
    try {
      const qs = filter ? `?status=${filter}&limit=100` : "?limit=100";
      const data = await jsonRequest(`/api/donations${qs}`, { onAuthExpire });
      setDonations(Array.isArray(data?.items) ? data.items : []);
      if (data?.summary) setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    }
  }, [filter, onAuthExpire]);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);

  const addManual = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const fd = new FormData(e.target);
      const body = {
        amount: Number(fd.get("amount")),
        donor: {
          name: fd.get("name"),
          phone: fd.get("phone") || "",
          email: fd.get("email") || "",
          fund: fd.get("fund"),
        },
        method: fd.get("method") || "",
        reference: fd.get("reference") || "",
        note: fd.get("note") || "",
      };
      await jsonRequest("/api/donations", { method: "POST", body, onAuthExpire });
      e.target.reset();
      setShowForm(false);
      fetchDonations();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await jsonRequest(`/api/donations/${id}`, { method: "PATCH", body: { status }, onAuthExpire });
      fetchDonations();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this donation record permanently?")) return;
    try {
      await jsonRequest(`/api/donations/${id}`, { method: "DELETE", onAuthExpire });
      fetchDonations();
    } catch (err) {
      setError(err.message);
    }
  };

  const field = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500";

  return (
    <div>
      {/* Summary + actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="bg-white rounded-2xl px-6 py-4 border border-gray-100 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><IndianRupee size={20} /></div>
          <div>
            <div className="text-2xl font-bold text-gray-900">₹{Number(summary.raised || 0).toLocaleString("en-IN")}</div>
            <div className="text-xs text-gray-400">Raised across {summary.paidCount || 0} confirmed donations</div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="">All statuses</option>
            {DONATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold">
            <Plus size={16} /> Record offline
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}

      {/* Manual entry */}
      {showForm && (
        <form onSubmit={addManual} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
          <h3 className="font-bold text-lg mb-1">Record an offline / bank-transfer donation</h3>
          <p className="text-gray-400 text-sm mb-6">For cheques, cash, or direct bank transfers received outside the online flow.</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <input name="amount" required type="number" min={1} placeholder="Amount (₹) *" className={field} />
            <select name="fund" defaultValue="General Fund" className={field}>
              {DONATION_FUNDS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <input name="name" required maxLength={200} placeholder="Donor name *" className={field} />
            <input name="phone" maxLength={20} placeholder="Phone" className={field} />
            <input name="email" type="email" maxLength={254} placeholder="Email" className={field} />
            <input name="method" maxLength={60} placeholder="Method (Cash / Cheque / NEFT)" className={field} />
            <input name="reference" maxLength={120} placeholder="Reference / txn no." className={field} />
            <input name="note" maxLength={1000} placeholder="Note" className={field} />
          </div>
          <button type="submit" disabled={busy} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {busy ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Plus size={16} /> Save Donation</>}
          </button>
        </form>
      )}

      <h3 className="font-bold text-lg mb-4 dark:text-gray-200">Donations ({donations.length})</h3>
      {donations.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No donations recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {donations.map(d => (
            <div key={d._id} className="bg-white rounded-2xl px-5 py-4 border border-gray-100 flex flex-wrap justify-between items-center gap-3 hover:shadow-sm transition-shadow">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <strong className="truncate">{d.donor?.name || "—"}</strong>
                  <span className="font-bold text-emerald-700">₹{Number(d.amountInr || 0).toLocaleString("en-IN")}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {d.donor?.fund || "General Fund"} · {formatDate(d.createdAt)}
                  {d.source === "offline" ? ` · ${d.method || "offline"}` : ""}
                  {d.donor?.phone ? ` · ${d.donor.phone}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle[d.status] || "bg-gray-100 text-gray-600"}`}>{d.status}</span>
                <select value={d.status} onChange={e => updateStatus(d._id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  {DONATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => remove(d._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
