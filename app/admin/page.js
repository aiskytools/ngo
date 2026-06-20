"use client";
import { useState, useEffect, useCallback } from "react";
import { Lock, LogOut, FileText, Bell, Star, IndianRupee, Inbox, Loader2 } from "lucide-react";
import BlogManager from "./_components/BlogManager";
import NoticeManager from "./_components/NoticeManager";
import StoryManager from "./_components/StoryManager";
import DonationsManager from "./_components/DonationsManager";
import ContactsManager from "./_components/ContactsManager";

const TABS = [
  { key: "blog", icon: FileText, label: "Blog" },
  { key: "notices", icon: Bell, label: "Notices" },
  { key: "stories", icon: Star, label: "Stories" },
  { key: "donations", icon: IndianRupee, label: "Donations" },
  { key: "contacts", icon: Inbox, label: "Messages" },
];

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("blog");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const onAuthExpire = useCallback(() => setLoggedIn(false), []);

  // Check auth on mount.
  useEffect(() => {
    let active = true;
    fetch("/api/auth/check")
      .then(r => { if (active) setLoggedIn(r.ok); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  // While logged in, poll session validity so an expired 2h token sends the
  // admin back to the login screen instead of silently failing on the next save.
  useEffect(() => {
    if (!loggedIn) return;
    const id = setInterval(() => {
      fetch("/api/auth/check").then(r => { if (!r.ok) setLoggedIn(false); }).catch(() => {});
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [loggedIn]);

  const login = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: e.target.password.value }),
      });
      if (r.ok) { setLoggedIn(true); return; }
      const data = await r.json().catch(() => ({}));
      setLoginError(data.error || "Login failed");
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setLoggedIn(false);
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </section>
    );
  }

  if (!loggedIn) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-4">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6 text-amber-600"><Lock size={28} /></div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-500 text-sm mb-6">Enter the admin password to continue.</p>
          <form onSubmit={login}>
            <input name="password" type="password" required placeholder="Password" autoComplete="current-password" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-center text-lg mb-4" />
            {loginError && <p className="text-sm text-rose-600 mb-4">{loginError}</p>}
            <button type="submit" disabled={loggingIn} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {loggingIn ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : <>🔓 Login</>}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-gray-900">⚙ Admin Dashboard</h1>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors text-sm"><LogOut size={16} /> Logout</button>
        </div>

        <div className="flex gap-0 border-b-2 border-gray-200 mb-8 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] whitespace-nowrap ${tab === t.key ? "border-amber-500 text-amber-700" : "border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "blog" && <BlogManager onAuthExpire={onAuthExpire} />}
        {tab === "notices" && <NoticeManager onAuthExpire={onAuthExpire} />}
        {tab === "stories" && <StoryManager onAuthExpire={onAuthExpire} />}
        {tab === "donations" && <DonationsManager onAuthExpire={onAuthExpire} />}
        {tab === "contacts" && <ContactsManager onAuthExpire={onAuthExpire} />}
      </div>
    </section>
  );
}
