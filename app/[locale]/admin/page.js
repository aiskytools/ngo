"use client";
import { useState, useEffect, useCallback } from "react";
import { Lock, LogOut, LayoutDashboard, FileText, Bell, Star, IndianRupee, Inbox, MessageSquare, Moon, Sun, Loader2 } from "lucide-react";
import Overview from "./_components/Overview";
import BlogManager from "./_components/BlogManager";
import NoticeManager from "./_components/NoticeManager";
import StoryManager from "./_components/StoryManager";
import DonationsManager from "./_components/DonationsManager";
import ContactsManager from "./_components/ContactsManager";
import EnquiryManager from "./_components/EnquiryManager";

const TABS = [
  { key: "overview", icon: LayoutDashboard, label: "Overview" },
  { key: "blog", icon: FileText, label: "Blog" },
  { key: "notices", icon: Bell, label: "Notices" },
  { key: "stories", icon: Star, label: "Stories" },
  { key: "donations", icon: IndianRupee, label: "Donations" },
  { key: "enquiries", icon: MessageSquare, label: "Enquiries" },
  { key: "contacts", icon: Inbox, label: "Messages" },
];

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [enquiryUnread, setEnquiryUnread] = useState(0);
  const [dark, setDark] = useState(false);

  const onAuthExpire = useCallback(() => setLoggedIn(false), []);

  // Restore saved theme preference.
  useEffect(() => {
    try { if (localStorage.getItem("admin-theme") === "dark") setDark(true); } catch {}
  }, []);

  const toggleTheme = () => {
    setDark((d) => {
      const next = !d;
      try { localStorage.setItem("admin-theme", next ? "dark" : "light"); } catch {}
      return next;
    });
  };

  // Keep the Enquiries badge in sync (also refreshed by the manager via onCountChange).
  useEffect(() => {
    if (!loggedIn) return;
    fetch("/api/enquiries?limit=1")
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (typeof d?.newCount === "number") setEnquiryUnread(d.newCount); })
      .catch(() => {});
  }, [loggedIn]);

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
    <section className={`min-h-screen bg-gray-50 dark:bg-gray-950 pt-28 pb-16 ${dark ? "dark" : ""}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8 gap-3">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">⚙ Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"><LogOut size={16} /> Logout</button>
          </div>
        </div>

        <div className="flex gap-0 border-b-2 border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto" role="tablist">
          {TABS.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] whitespace-nowrap ${tab === t.key ? "border-amber-500 text-amber-700 dark:text-amber-400" : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"}`}
            >
              <t.icon size={16} /> {t.label}
              {t.key === "enquiries" && enquiryUnread > 0 && (
                <span className="ml-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center" aria-label={`${enquiryUnread} unread enquiries`}>
                  {enquiryUnread > 99 ? "99+" : enquiryUnread}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "overview" && <Overview onAuthExpire={onAuthExpire} />}
        {tab === "blog" && <BlogManager onAuthExpire={onAuthExpire} />}
        {tab === "notices" && <NoticeManager onAuthExpire={onAuthExpire} />}
        {tab === "stories" && <StoryManager onAuthExpire={onAuthExpire} />}
        {tab === "donations" && <DonationsManager onAuthExpire={onAuthExpire} />}
        {tab === "enquiries" && <EnquiryManager onAuthExpire={onAuthExpire} onCountChange={setEnquiryUnread} />}
        {tab === "contacts" && <ContactsManager onAuthExpire={onAuthExpire} />}
      </div>
    </section>
  );
}
