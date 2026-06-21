"use client";
import { useState, useEffect, useCallback } from "react";
import { Trash2, Plus, Edit3, X, Save, Loader2, Star } from "lucide-react";
import { jsonRequest } from "../_lib/admin";
import RichEditor from "./RichEditor";
import { STORY_TAGS, STORY_THEME_KEYS, tagColor, themeGradient } from "@/lib/storyMeta";

export default function StoryManager({ onAuthExpire }) {
  const [stories, setStories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [bgHtml, setBgHtml] = useState("");
  const [intervHtml, setIntervHtml] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const fetchStories = useCallback(async () => {
    try {
      const data = await jsonRequest("/api/stories?limit=100", { onAuthExpire });
      setStories(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      setError(err.message);
    }
  }, [onAuthExpire]);

  useEffect(() => { fetchStories(); }, [fetchStories]);

  // Seed the rich-text fields when switching between create / edit.
  useEffect(() => {
    setBgHtml(editing?.background || "");
    setIntervHtml(editing?.intervention || "");
  }, [editing]);

  const reset = (form) => { form?.reset(); setEditing(null); setBgHtml(""); setIntervHtml(""); setError(""); };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (bgHtml.replace(/<[^>]*>/g, "").trim() === "" || intervHtml.replace(/<[^>]*>/g, "").trim() === "") {
      setError("Background and What we did are required.");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData(e.target);
      const body = {
        name: fd.get("name"),
        location: fd.get("location"),
        tag: fd.get("tag"),
        theme: fd.get("theme"),
        icon: fd.get("icon"),
        background: bgHtml,
        intervention: intervHtml,
        outcome: fd.get("outcome"),
        featured: fd.get("featured") === "on",
      };
      if (editing) {
        await jsonRequest(`/api/stories/${editing._id}`, { method: "PUT", body, onAuthExpire });
      } else {
        await jsonRequest("/api/stories", { method: "POST", body, onAuthExpire });
      }
      reset(e.target);
      fetchStories();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this story permanently?")) return;
    try {
      await jsonRequest(`/api/stories/${id}`, { method: "DELETE", onAuthExpire });
      fetchStories();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (s) => { setEditing(s); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const field = "w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500";

  return (
    <div>
      {/* key forces defaultValues to reset between create/edit */}
      <form key={editing?._id || "new"} onSubmit={submit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">{editing ? "✏️ Edit Story" : "🌟 Add a Success Story"}</h3>
          {editing && <button type="button" onClick={() => reset()} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <input name="name" required maxLength={200} placeholder="Person's name *" defaultValue={editing?.name || ""} className={field} />
          <input name="location" required maxLength={200} placeholder="Location / context *" defaultValue={editing?.location || ""} className={field} />
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <select name="tag" defaultValue={editing?.tag || "Education"} className={field}>
            {STORY_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select name="theme" defaultValue={editing?.theme || "teal"} className={field}>
            {STORY_THEME_KEYS.map(t => <option key={t} value={t}>{t} theme</option>)}
          </select>
          <input name="icon" maxLength={16} placeholder="Emoji (e.g. 🎓)" defaultValue={editing?.icon || ""} className={field} />
        </div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Background — their situation before *</label>
        <div className="mb-3">
          <RichEditor defaultValue={editing?.background || ""} onChange={setBgHtml} onAuthExpire={onAuthExpire} variant="minimal" ariaLabel="Story background editor" />
        </div>
        <label className="block text-sm font-medium text-gray-600 mb-1">What we did *</label>
        <div className="mb-3">
          <RichEditor defaultValue={editing?.intervention || ""} onChange={setIntervHtml} onAuthExpire={onAuthExpire} variant="minimal" ariaLabel="Story intervention editor" />
        </div>
        <textarea name="outcome" required rows={2} maxLength={2000} placeholder="Outcome today * (short highlight)" defaultValue={editing?.outcome || ""} className={`${field} resize-none`} />

        <label className="flex items-center gap-2 mb-4 text-sm text-gray-600 cursor-pointer select-none">
          <input type="checkbox" name="featured" defaultChecked={editing?.featured || false} className="w-4 h-4 accent-amber-500" />
          <Star size={14} className="text-amber-500" /> Feature on the home page (up to 3 shown)
        </label>

        {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}

        <button type="submit" disabled={busy} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          {busy ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editing ? <><Save size={16} /> Save Changes</> : <><Plus size={16} /> Add Story</>}
        </button>
      </form>

      <h3 className="font-bold text-lg mb-4 dark:text-gray-200">Stories ({stories.length})</h3>
      {stories.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No stories yet. The public page shows built-in samples until you add your own. ✨</p>
      ) : (
        <div className="space-y-3">
          {stories.map(s => (
            <div key={s._id} className="bg-white rounded-2xl px-5 py-4 border border-gray-100 flex justify-between items-center hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${themeGradient(s.theme)} flex items-center justify-center text-xl flex-shrink-0`}>{s.icon}</div>
                <div className="min-w-0">
                  <strong className="block truncate">{s.name}</strong>
                  <span className="text-xs text-gray-400 truncate block">{s.location}</span>
                </div>
                <span className={`text-xs ${tagColor(s.tag)} text-white px-2 py-0.5 rounded-full ml-2 flex-shrink-0`}>{s.tag}</span>
                {s.featured && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1"><Star size={11} /> Featured</span>}
              </div>
              <div className="flex gap-1 ml-4">
                <button onClick={() => startEdit(s)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit3 size={16} /></button>
                <button onClick={() => remove(s._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
