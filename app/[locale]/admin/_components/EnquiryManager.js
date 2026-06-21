"use client";
import { useState, useEffect, useCallback } from "react";
import { Trash2, Mail, Phone, Loader2, Search, ChevronDown, Tag } from "lucide-react";
import { jsonRequest, formatDate } from "../_lib/admin";
import { ENQUIRY_STATUSES } from "@/lib/status";

const statusStyle = {
  New: "bg-amber-100 text-amber-700",
  Read: "bg-blue-100 text-blue-700",
  Replied: "bg-emerald-100 text-emerald-700",
  Archived: "bg-gray-200 text-gray-600",
};

export default function EnquiryManager({ onAuthExpire, onCountChange }) {
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (filter) params.set("status", filter);
      if (debouncedQuery) params.set("q", debouncedQuery);
      const data = await jsonRequest(`/api/enquiries?${params.toString()}`, { onAuthExpire });
      setEnquiries(Array.isArray(data?.items) ? data.items : []);
      if (typeof data?.newCount === "number") onCountChange?.(data.newCount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, debouncedQuery, onAuthExpire, onCountChange]);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  const updateStatus = async (id, status) => {
    try {
      await jsonRequest(`/api/enquiries/${id}`, { method: "PATCH", body: { status }, onAuthExpire });
      fetchEnquiries();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this enquiry permanently?")) return;
    try {
      await jsonRequest(`/api/enquiries/${id}`, { method: "DELETE", onAuthExpire });
      fetchEnquiries();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggle = (e) => {
    setOpenId(prev => (prev === e._id ? null : e._id));
    if (e.status === "New") updateStatus(e._id, "Read"); // auto-mark read on open
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h3 className="font-bold text-lg dark:text-gray-200">Enquiries ({enquiries.length})</h3>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search…"
              aria-label="Search enquiries"
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 w-40 sm:w-52"
            />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter by status" className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="">All</option>
            {ENQUIRY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-gray-300" /></div>
      ) : enquiries.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No enquiries{filter ? ` with status "${filter}"` : ""}{debouncedQuery ? " matching your search" : ""} yet.</p>
      ) : (
        <div className="space-y-3">
          {enquiries.map(e => {
            const open = openId === e._id;
            return (
              <div key={e._id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow overflow-hidden">
                <button onClick={() => toggle(e)} aria-expanded={open} className="w-full text-left p-5 flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="truncate">{e.name}</strong>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1"><Tag size={11} /> {e.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle[e.status] || "bg-gray-100 text-gray-600"}`}>{e.status}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1 truncate">{e.subject}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{formatDate(e.createdAt)}</div>
                  </div>
                  <ChevronDown size={18} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>

                {open && (
                  <div className="px-5 pb-5 -mt-1 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 flex-wrap">
                      <a href={`mailto:${e.email}`} className="flex items-center gap-1 hover:text-amber-600"><Mail size={12} /> {e.email}</a>
                      <a href={`tel:${e.phone}`} className="flex items-center gap-1 hover:text-amber-600"><Phone size={12} /> {e.phone}</a>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed mb-4">{e.message}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400">Status:</span>
                      <select value={e.status} onChange={ev => updateStatus(e._id, ev.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500">
                        {ENQUIRY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <a href={`mailto:${e.email}?subject=Re: ${encodeURIComponent(e.subject)}`} className="text-xs px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100">Reply by email</a>
                      <button onClick={() => remove(e._id)} className="text-xs px-3 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center gap-1 ml-auto"><Trash2 size={12} /> Delete</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
