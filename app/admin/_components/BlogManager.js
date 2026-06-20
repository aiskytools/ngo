"use client";
import { useState, useEffect, useCallback } from "react";
import { Trash2, Plus, Edit3, X, Save, Loader2 } from "lucide-react";
import { jsonRequest, uploadImageToCloud, formatDate } from "../_lib/admin";
import ImageField from "./ImageField";

const CATEGORIES = ["General", "Education", "Health", "Relief", "Event"];

export default function BlogManager({ onAuthExpire }) {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [imgBase64, setImgBase64] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      const data = await jsonRequest("/api/blogs?limit=100", { onAuthExpire });
      setPosts(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      setError(err.message);
    }
  }, [onAuthExpire]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const resetForm = (form) => {
    form?.reset();
    setEditing(null);
    setImgBase64("");
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const fd = new FormData(e.target);
      const body = {
        title: fd.get("title"),
        category: fd.get("category"),
        description: fd.get("desc"),
      };
      if (imgBase64) {
        const uploaded = await uploadImageToCloud(imgBase64, onAuthExpire);
        body.image = uploaded.url;
        body.imagePublicId = uploaded.publicId;
        if (editing?.imagePublicId) body.oldImagePublicId = editing.imagePublicId;
      }
      if (editing) {
        await jsonRequest(`/api/blogs/${editing._id}`, { method: "PUT", body, onAuthExpire });
      } else {
        await jsonRequest("/api/blogs", { method: "POST", body, onAuthExpire });
      }
      resetForm(e.target);
      fetchPosts();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this post permanently?")) return;
    try {
      await jsonRequest(`/api/blogs/${id}`, { method: "DELETE", onAuthExpire });
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (p) => {
    setEditing(p);
    setImgBase64("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <form onSubmit={submit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">{editing ? "✏️ Edit Post" : "📝 New Blog Post"}</h3>
          {editing && (
            <button type="button" onClick={() => resetForm()} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          )}
        </div>

        <ImageField preview={imgBase64} existing={editing?.image} onChange={setImgBase64} onError={setError} />

        <input name="title" required maxLength={300} placeholder="Title... *" defaultValue={editing?.title || ""} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg font-semibold" />
        <select name="category" defaultValue={editing?.category || "General"} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <textarea name="desc" required rows={5} maxLength={20000} placeholder="Write something..." defaultValue={editing?.description || ""} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500" />

        {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}

        <button type="submit" disabled={busy} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          {busy ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editing ? <><Save size={16} /> Save Changes</> : <><Plus size={16} /> Publish Post</>}
        </button>
      </form>

      <h3 className="font-bold text-lg mb-4">Published Posts ({posts.length})</h3>
      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No posts yet. Create your first one above! 🚀</p>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p._id} className="bg-white rounded-2xl px-5 py-4 border border-gray-100 flex justify-between items-center hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <strong className="block truncate">{p.title}</strong>
                  <span className="text-xs text-gray-400">{formatDate(p.createdAt)}</span>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">{p.category}</span>
              </div>
              <div className="flex gap-1 ml-4">
                <button onClick={() => startEdit(p)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit3 size={16} /></button>
                <button onClick={() => remove(p._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
