"use client";
import { useState, useEffect, useCallback } from "react";
import { Trash2, Mail, Phone, Loader2 } from "lucide-react";
import { jsonRequest, formatDate } from "../_lib/admin";
import { CONTACT_STATUSES } from "@/lib/status";

const statusStyle = {
  new: "bg-amber-100 text-amber-700",
  read: "bg-blue-100 text-blue-700",
  responded: "bg-emerald-100 text-emerald-700",
  archived: "bg-gray-200 text-gray-600",
};

export default function ContactsManager({ onAuthExpire }) {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const qs = filter ? `?status=${filter}&limit=100` : "?limit=100";
      const data = await jsonRequest(`/api/contacts${qs}`, { onAuthExpire });
      setContacts(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, onAuthExpire]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const updateStatus = async (id, status) => {
    try {
      await jsonRequest(`/api/contacts/${id}`, { method: "PATCH", body: { status }, onAuthExpire });
      fetchContacts();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this message permanently?")) return;
    try {
      await jsonRequest(`/api/contacts/${id}`, { method: "DELETE", onAuthExpire });
      fetchContacts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg dark:text-gray-200">Messages ({contacts.length})</h3>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500">
          <option value="">All</option>
          {CONTACT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-gray-300" /></div>
      ) : contacts.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No messages{filter ? ` with status "${filter}"` : ""} yet.</p>
      ) : (
        <div className="space-y-3">
          {contacts.map(c => (
            <div key={c._id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-sm transition-shadow">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong>{c.name}</strong>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{c.subject}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle[c.status] || "bg-gray-100 text-gray-600"}`}>{c.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 flex-wrap">
                    <a href={`mailto:${c.email}`} className="flex items-center gap-1 hover:text-amber-600"><Mail size={12} /> {c.email}</a>
                    {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1 hover:text-amber-600"><Phone size={12} /> {c.phone}</a>}
                    <span>{formatDate(c.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={c.status} onChange={e => updateStatus(c._id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {CONTACT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => remove(c._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
