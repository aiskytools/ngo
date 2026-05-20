"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Lock, LogOut, FileText, Bell, Trash2, Upload, Plus, Edit3, X, Save, Loader2 } from "lucide-react";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("blog");
  const [posts, setPosts] = useState([]);
  const [notices, setNotices] = useState([]);
  const [imgPreview, setImgPreview] = useState("");
  const [imgBase64, setImgBase64] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);
  const fileRef = useRef(null);

  // Check auth on mount
  useEffect(() => {
    fetch("/api/auth/check").then(r => {
      setLoggedIn(r.ok);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Fetch data
  const fetchPosts = useCallback(async () => {
    const r = await fetch("/api/blogs?limit=100");
    if (r.ok) {
      const data = await r.json();
      setPosts(Array.isArray(data?.items) ? data.items : []);
    }
  }, []);

  const fetchNotices = useCallback(async () => {
    const r = await fetch("/api/notices?limit=100");
    if (r.ok) {
      const data = await r.json();
      setNotices(Array.isArray(data?.items) ? data.items : []);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) { fetchPosts(); fetchNotices(); }
  }, [loggedIn, fetchPosts, fetchNotices]);

  // Auth
  const login = async (e) => {
    e.preventDefault();
    const pw = e.target.password.value;
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (r.ok) { setLoggedIn(true); return; }
    const data = await r.json().catch(() => ({}));
    alert(data.error || "Login failed");
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setLoggedIn(false);
  };

  // Image handling
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const okTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!okTypes.includes(file.type)) {
      alert("Please choose a PNG, JPEG, or WebP image.");
      e.target.value = "";
      return;
    }
    const MAX = 5 * 1024 * 1024;
    if (file.size > MAX) {
      alert("Image must be 5MB or smaller.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImgPreview(ev.target.result);
      setImgBase64(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToCloud = async (base64) => {
    if (!base64) return { url: "", publicId: "" };
    setUploading(true);
    try {
      const r = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      if (!r.ok) throw new Error("Upload failed");
      return await r.json();
    } finally {
      setUploading(false);
    }
  };

  // BLOG CRUD
  const publishPost = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const fd = new FormData(e.target);
      let imageUrl = "", imagePublicId = "";
      if (imgBase64) {
        const uploaded = await uploadImageToCloud(imgBase64);
        imageUrl = uploaded.url;
        imagePublicId = uploaded.publicId;
      }
      const r = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: fd.get("title"),
          category: fd.get("category"),
          description: fd.get("desc"),
          image: imageUrl,
          imagePublicId,
        }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        alert(data.error || "Failed to publish post");
        return;
      }
      e.target.reset();
      setImgPreview("");
      setImgBase64("");
      fetchPosts();
    } finally {
      setUploading(false);
    }
  };

  const updatePost = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const fd = new FormData(e.target);
      const body = {
        title: fd.get("title"),
        category: fd.get("category"),
        description: fd.get("desc"),
      };
      if (imgBase64) {
        const uploaded = await uploadImageToCloud(imgBase64);
        body.image = uploaded.url;
        body.imagePublicId = uploaded.publicId;
        body.oldImagePublicId = editingPost.imagePublicId;
      }
      const r = await fetch(`/api/blogs/${editingPost._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        alert(data.error || "Failed to update post");
        return;
      }
      setEditingPost(null);
      setImgPreview("");
      setImgBase64("");
      fetchPosts();
    } finally {
      setUploading(false);
    }
  };

  const deletePost = async (id) => {
    if (!confirm("Delete this post permanently?")) return;
    const r = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      alert(data.error || "Failed to delete post");
      return;
    }
    fetchPosts();
  };

  // NOTICE CRUD
  const publishNotice = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const r = await fetch("/api/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        date: fd.get("date"),
        type: fd.get("type"),
        description: fd.get("desc"),
      }),
    });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      alert(data.error || "Failed to publish notice");
      return;
    }
    e.target.reset();
    fetchNotices();
  };

  const updateNotice = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const r = await fetch(`/api/notices/${editingNotice._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        date: fd.get("date"),
        type: fd.get("type"),
        description: fd.get("desc"),
      }),
    });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      alert(data.error || "Failed to update notice");
      return;
    }
    setEditingNotice(null);
    fetchNotices();
  };

  const deleteNotice = async (id) => {
    if (!confirm("Delete this notice permanently?")) return;
    const r = await fetch(`/api/notices/${id}`, { method: "DELETE" });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      alert(data.error || "Failed to delete notice");
      return;
    }
    fetchNotices();
  };

  // Loading state
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </section>
    );
  }

  // Login screen
  if (!loggedIn) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6 text-amber-600"><Lock size={28} /></div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-500 text-sm mb-6">Enter the admin password to continue.</p>
          <form onSubmit={login}>
            <input name="password" type="password" required placeholder="Password" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-center text-lg mb-4" />
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">🔓 Login</button>
          </form>
        </div>
      </section>
    );
  }

  // Admin Dashboard
  return (
    <section className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-gray-900">⚙ Admin Dashboard</h1>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors text-sm"><LogOut size={16} /> Logout</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b-2 border-gray-200 mb-8">
          {[{ key: "blog", icon: FileText, label: "Blog Manager" }, { key: "notices", icon: Bell, label: "Notice Manager" }].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setEditingPost(null); setEditingNotice(null); }}
              className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] ${tab === t.key ? "border-amber-500 text-amber-700" : "border-transparent text-gray-400 hover:text-gray-600"}`}
            ><t.icon size={16} /> {t.label}</button>
          ))}
        </div>

        {/* ===== BLOG TAB ===== */}
        {tab === "blog" && (
          <div>
            {/* Create / Edit Form */}
            <form onSubmit={editingPost ? updatePost : publishPost} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">{editingPost ? "✏️ Edit Post" : "📝 What's on your mind?"}</h3>
                {editingPost && <button type="button" onClick={() => { setEditingPost(null); setImgPreview(""); setImgBase64(""); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>}
              </div>

              <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-amber-400 transition-colors mb-4 text-gray-400">
                {(imgPreview || editingPost?.image) ? (
                  <img src={imgPreview || editingPost?.image} alt="Selected blog image preview" className="max-h-48 mx-auto rounded-xl object-cover" />
                ) : (
                  <><Upload size={24} className="mx-auto mb-2" /><p className="text-sm">📷 Click to add photo</p></>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </div>

              <input name="title" required placeholder="Title... *" defaultValue={editingPost?.title || ""} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg font-semibold" />
              <select name="category" defaultValue={editingPost?.category || "General"} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option>General</option><option>Education</option><option>Health</option><option>Relief</option><option>Event</option>
              </select>
              <textarea name="desc" required rows={5} placeholder="Write something..." defaultValue={editingPost?.description || ""} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <button type="submit" disabled={uploading} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : editingPost ? <><Save size={16} /> Save Changes</> : <><Plus size={16} /> Publish Post</>}
              </button>
            </form>

            {/* Posts List */}
            <h3 className="font-bold text-lg mb-4">Published Posts ({posts.length})</h3>
            {posts.length === 0 ? <p className="text-gray-400 text-center py-8">No posts yet. Create your first one above! 🚀</p> : (
              <div className="space-y-3">
                {posts.map((p) => (
                  <div key={p._id} className="bg-white rounded-2xl px-5 py-4 border border-gray-100 flex justify-between items-center hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {p.image && <img src={p.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />}
                      <div className="min-w-0">
                        <strong className="block truncate">{p.title}</strong>
                        <span className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">{p.category}</span>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <button onClick={() => { setEditingPost(p); setImgPreview(""); setImgBase64(""); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit3 size={16} /></button>
                      <button onClick={() => deletePost(p._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== NOTICES TAB ===== */}
        {tab === "notices" && (
          <div>
            <form onSubmit={editingNotice ? updateNotice : publishNotice} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">{editingNotice ? "✏️ Edit Notice" : "📢 Post a Notice"}</h3>
                {editingNotice && <button type="button" onClick={() => setEditingNotice(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>}
              </div>
              <input name="title" required placeholder="Notice Title *" defaultValue={editingNotice?.title || ""} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg font-semibold" />
              <input name="date" type="date" required defaultValue={editingNotice?.date || ""} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <select name="type" defaultValue={editingNotice?.type || "Event"} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option>Event</option><option>Invitation</option><option>Program</option><option>Urgent</option><option>Update</option>
              </select>
              <textarea name="desc" required rows={3} placeholder="Description *" defaultValue={editingNotice?.description || ""} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                {editingNotice ? <><Save size={16} /> Save Changes</> : <><Plus size={16} /> Post Notice</>}
              </button>
            </form>

            <h3 className="font-bold text-lg mb-4">Posted Notices ({notices.length})</h3>
            {notices.length === 0 ? <p className="text-gray-400 text-center py-8">No notices yet. Post your first one! 📋</p> : (
              <div className="space-y-3">
                {notices.map((n) => (
                  <div key={n._id} className="bg-white rounded-2xl px-5 py-4 border border-gray-100 flex justify-between items-center hover:shadow-sm transition-shadow">
                    <div className="min-w-0">
                      <strong className="block truncate">{n.title}</strong>
                      <span className="text-xs text-gray-400">{n.date} · {n.type}</span>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <button onClick={() => { setEditingNotice(n); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit3 size={16} /></button>
                      <button onClick={() => deleteNotice(n._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
