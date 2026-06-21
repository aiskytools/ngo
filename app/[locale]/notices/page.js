"use client";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import AnimatedSection from "@/app/components/AnimatedSection";

const defaultNotices = [
  { _id: "n1", title: "Sant Gadgebaba Birth Anniversary Celebration", date: "2025-02-23", type: "Event", description: "Join us for the annual celebration of Sant Gadgebaba Jayanti with a community gathering, cleanliness drive, and cultural program at our Ambajogai office." },
  { _id: "n2", title: "Scholarship Application Open 2025–26", date: "2025-03-01", type: "Update", description: "Applications for the annual Aadhar Manuskicha Scholarship for 2025–26 are now open. Students from 8th to 12th standard and from economically weaker sections are eligible. Last date: 30 April 2025." },
  { _id: "n3", title: "Volunteer Recruitment Drive", date: "2025-04-15", type: "Program", description: "We are looking for passionate volunteers for the upcoming year. If you are based in or around Ambajogai and wish to contribute — reach out to us." },
];

const typeIcons = { Event: "📅", Invitation: "🎉", Program: "🎪", Urgent: "🚨", Update: "📢" };
const typeColors = { Event: "bg-blue-500", Invitation: "bg-amber-500", Program: "bg-emerald-600", Urgent: "bg-red-600", Update: "bg-gray-600" };

export default function NoticesPage() {
  const [notices, setNotices] = useState(defaultNotices);

  useEffect(() => {
    fetch("/api/notices?limit=50")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const items = Array.isArray(data?.items) ? data.items : [];
        // Show real notices once any exist; the inline defaults are only a fallback
        // for a fresh database so the page is never empty.
        if (items.length > 0) setNotices(items);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="relative pt-32 pb-20 gradient-mesh overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold text-white mb-4">Notice Board</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Stay informed about our upcoming events, programs, and announcements.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {notices.map((n, i) => {
            const d = new Date(n.date);
            return (
              <AnimatedSection key={n._id} delay={i * 0.08}>
                <Link href={`/notices/${n._id}`} className="block">
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 flex gap-6 items-start hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    <div className="bg-gray-50 rounded-2xl px-4 py-3 text-center flex-shrink-0 min-w-[70px]">
                      <div className="font-[family-name:var(--font-heading)] text-2xl font-bold text-rose-600">{d.getDate()}</div>
                      <div className="text-xs text-gray-400 font-semibold uppercase">{d.toLocaleDateString("en-IN", { month: "short" })}</div>
                    </div>
                    <div className="flex-1">
                      <span className={`${typeColors[n.type] || typeColors.Update} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                        {typeIcons[n.type] || "📢"} {n.type}
                      </span>
                      <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-gray-900 mt-2 mb-2">{n.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{n.description?.substring(0, 150)}{n.description?.length > 150 ? "..." : ""}</p>
                      <span className="text-amber-600 font-semibold text-sm mt-3 inline-block">View Details →</span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </section>
    </>
  );
}
