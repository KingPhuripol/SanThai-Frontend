"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "th" | "en";

const COPY = {
  th: {
    home: "หน้าหลัก", identity: "ค้นหาตัวตน", marketplace: "ตลาดผ้า", community: "ชุมชนผู้สร้างสรรค์", about: "เกี่ยวกับเรา", store: "การจัดการร้านค้า", verifyFabric: "ตรวจสอบผ้า",
    login: "เข้าสู่ระบบ", logout: "ออกจากระบบ", cart: "ตะกร้าสินค้า", customer: "ผู้ซื้อ", artisan: "ร้านค้าผู้ผลิต", designer: "นักออกแบบ", admin: "ผู้ดูแลระบบ",
    thaiForEveryIdentity: "ผ้าไทย ใส่ได้ทุกตัวตน", thai: "ไทย", english: "English", language: "ภาษา", viewProduct: "ดูสินค้า", viewStore: "ดูหน้าร้านค้า",
  },
  en: {
    home: "Home", identity: "Find Your Style", marketplace: "Fabric Marketplace", community: "Creative Communities", about: "About Us", store: "Store Management", verifyFabric: "Verify Fabric",
    login: "Log in", logout: "Log out", cart: "Cart", customer: "Customer", artisan: "Verified Store", designer: "Designer", admin: "Administrator",
    thaiForEveryIdentity: "Thai textiles for every identity", thai: "ไทย", english: "English", language: "Language", viewProduct: "View product", viewStore: "Visit store",
  },
} as const;

type CopyKey = keyof typeof COPY.th;
type LanguageContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: CopyKey) => string; pick: (thai?: string | null, english?: string | null, fallback?: string) => string };

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th");
  useEffect(() => {
    const saved = window.localStorage.getItem("santhai_locale");
    if (saved === "en" || saved === "th") setLocaleState(saved);
  }, []);
  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("santhai_locale", next);
  };
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  const value = useMemo(() => ({
    locale, setLocale,
    t: (key: CopyKey) => COPY[locale][key],
    pick: (thai?: string | null, english?: string | null, fallback = "") => locale === "en" ? (english || thai || fallback) : (thai || english || fallback),
  }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { locale, setLocale, t } = useLanguage();
  return <div aria-label={t("language")} className={`flex items-center rounded-full border p-0.5 text-[11px] font-bold ${dark ? "border-white/20 bg-white/10 text-white" : "border-brand-200 bg-white text-brand-900"}`}>
    <button type="button" onClick={() => setLocale("th")} aria-pressed={locale === "th"} className={`rounded-full px-2.5 py-1 transition ${locale === "th" ? (dark ? "bg-gold-400 text-brand-950" : "bg-brand-900 text-white") : "opacity-65 hover:opacity-100"}`}>{t("thai")}</button>
    <button type="button" onClick={() => setLocale("en")} aria-pressed={locale === "en"} className={`rounded-full px-2.5 py-1 transition ${locale === "en" ? (dark ? "bg-gold-400 text-brand-950" : "bg-brand-900 text-white") : "opacity-65 hover:opacity-100"}`}>{t("english")}</button>
  </div>;
}
