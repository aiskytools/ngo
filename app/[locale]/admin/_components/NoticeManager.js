"use client";
import { useState, useEffect, useCallback } from "react";
import { Trash2, Plus, Edit3, X, Save, Loader2 } from "lucide-react";
import { jsonRequest } from "../_lib/admin";

const TYPES = ["Event", "Invitation", "Program", "Urgent", "Update"];

export default function NoticeManager({ onAuthExpire }) {
  const [notices, setNotices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const fetchNotices = useCallback(async () => {
    try {
      const data = await jsonRequest("/api/notices?limit=100", { onAuthExpire });
      setNotices(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      setError(err.message);
    }
  }, [onAuthExpire]);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  const reset = (form) => { form?.reset(); setEditing(null); setError(""); };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const fd = new FormData(e.target);
      const body = {
        title: fd.get("title"),
        date: fd.get("date"),
        type: fd.get("type"),
        description: fd.get("desc"),
      };
      if (editing) {
        await jsonRequest(`/api/notices/${editing._id}`, { method: "PUT", body, onAuthExpire });
      } else {
        await jsonRequest("/api/notices", { method: "POST", body, onAuthExpire });
      }
      reset(e.target);
      fetchNotices();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this notice permanently?")) return;
    try {
      await jsonRequest(`/api/notices/${id}`, { method: "DELETE", onAuthExpire });
      fetchNotices();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (n) => { setEditing(n); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div>
      <form key={editing?._id || "new"} onSubmit={submit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">{editing ? "✏️ Edit Notice" : "📢 Post a Notice"}</h3>
          {editing && <button type="button" onClick={() => reset()} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>}
        </div>
        <input name="title" required maxLength={300} placeholder="Notice Title *" defaultValue={editing?.title || ""} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg font-semibold" />
        <input name="date" type="date" required defaultValue={editing?.date || ""} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
        <select name="type" defaultValue={editing?.type || "Event"} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500">
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <textarea name="desc" required rows={3} maxLength={20000} placeholder="Description *" defaultValue={editing?.description || ""} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500" />
        {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}
        <button type="submit" disabled={busy} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          {busy ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editing ? <><Save size={16} /> Save Changes</> : <><Plus size={16} /> Post Notice</>}
        </button>
      </form>

      <h3 className="font-bold text-lg mb-4 dark:text-gray-200">Posted Notices ({notices.length})</h3>
      {notices.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No notices yet. Post your first one! 📋</p>
      ) : (
        <div className="space-y-3">
          {notices.map(n => (
            <div key={n._id} className="bg-white rounded-2xl px-5 py-4 border border-gray-100 flex justify-between items-center hover:shadow-sm transition-shadow">
              <div className="min-w-0">
                <strong className="block truncate">{n.title}</strong>
                <span className="text-xs text-gray-400">{n.date} · {n.type}</span>
              </div>
              <div className="flex gap-1 ml-4">
                <button onClick={() => startEdit(n)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit3 size={16} /></button>
                <button onClick={() => remove(n._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
