"use client";
import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/focus", key: "focus" },
  { href: "/stories", key: "stories" },
  { href: "/blog", key: "blog" },
  { href: "/notices", key: "notices" },
  { href: "/enquiry", key: "enquiry" },
  { href: "/contact", key: "contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
              आ
            </div>
            <div>
              <div className={`font-[family-name:var(--font-heading)] font-bold text-lg leading-tight ${scrolled ? "text-gray-900" : "text-white"}`}>
                Aadhar Manuskicha
              </div>
              <div className={`text-xs font-medium ${scrolled ? "text-emerald-700" : "text-emerald-300"}`}>
                आधार माणुसकीचा
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? scrolled
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-white/15 text-white"
                    : scrolled
                    ? "text-gray-600 hover:text-emerald-700 hover:bg-gray-50"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {t(link.key)}
              </Link>
            ))}
            <LanguageSwitcher scrolled={scrolled} />
            <Link
              href="/donate"
              className="ml-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Heart size={16} fill="currentColor" />
              {t("donate")}
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-1">
            <LanguageSwitcher scrolled={scrolled} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={isOpen}
              className={`p-2 rounded-lg ${scrolled ? "text-gray-700" : "text-white"}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-2xl"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === link.href
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t(link.key)}
                </Link>
              ))}
              <Link
                href="/donate"
                onClick={closeMenu}
                className="block mt-4 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-center text-sm font-semibold"
              >
                💛 {t("donate")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
