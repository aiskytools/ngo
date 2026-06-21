"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { analytics } from "@/lib/analytics";

export default function LanguageSwitcher({ scrolled = true }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("language");

  const change = (e) => {
    const next = e.target.value;
    analytics.languageSelect(next);
    router.replace(pathname, { locale: next });
  };

  return (
    <label className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition-colors ${scrolled ? "text-gray-600" : "text-white/90"}`}>
      <Globe size={16} className="flex-shrink-0" />
      <span className="sr-only">{t("label")}</span>
      <select
        value={locale}
        onChange={change}
        aria-label={t("label")}
        className="bg-transparent font-medium focus:outline-none cursor-pointer"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="text-gray-800">{t(l)}</option>
        ))}
      </select>
    </label>
  );
}
