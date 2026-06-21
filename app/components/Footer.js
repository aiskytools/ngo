import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { href: "/about", key: "aboutUs" },
  { href: "/focus", key: "focusAreas" },
  { href: "/stories", key: "successStories" },
  { href: "/blog", key: "blogUpdates" },
  { href: "/enquiry", key: "enquiry" },
  { href: "/donate", key: "donate" },
];

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-gray-950 text-gray-400 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold text-lg">
                आ
              </div>
              <div>
                <div className="font-[family-name:var(--font-heading)] font-bold text-white text-lg">
                  Aadhar Manuskicha
                </div>
                <div className="text-xs text-emerald-400">आधार माणुसकीचा</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">{t("tagline")}</p>
            <p className="text-xs text-amber-400 font-medium italic">&quot;{t("quote")}&quot;</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t("quickLinks")}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t("contact")}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3"><MapPin size={16} className="mt-0.5 flex-shrink-0 text-emerald-400" /><span>Shivajinagar, Bank Colony, Jogaiwadi, Ambajogai, Beed – 431517</span></div>
              <div className="flex gap-3"><Phone size={16} className="flex-shrink-0 text-emerald-400" /><a href="tel:+919422242106" className="hover:text-emerald-400 transition-colors">+91 9422242106</a></div>
              <div className="flex gap-3"><Mail size={16} className="flex-shrink-0 text-emerald-400" /><a href="mailto:santgadgebabango1@gmail.com" className="hover:text-emerald-400 transition-colors">santgadgebabango1@gmail.com</a></div>
            </div>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t("supportUs")}</h4>
            <p className="text-sm mb-4">{t("supportText")}</p>
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold hover:scale-105 transition-transform shadow-lg shadow-amber-500/20"
            >
              <Heart size={16} fill="currentColor" />
              {t("donateNow")}
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Sant Gadgebaba Sevabhavi Sanstha. {t("rights")}
          </p>
          <Link href="/admin" className="text-gray-700 hover:text-gray-400 transition-colors text-xs" aria-label="Admin">
            ⚙
          </Link>
        </div>
      </div>
    </footer>
  );
}
