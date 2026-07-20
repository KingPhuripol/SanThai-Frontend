"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, ChevronLeft, Loader2, Palette, ShoppingBag, Store } from "lucide-react";
import { authApi } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { useLanguage } from "@/components/LanguageProvider";

const REGION_OPTIONS = [
  { value: "north", label: "ภาคเหนือ" },
  { value: "northeast", label: "ภาคอีสาน" },
  { value: "central", label: "ภาคกลาง" },
  { value: "south", label: "ภาคใต้" },
];

const ROLE_OPTIONS: { value: "artisan" | "designer" | "customer"; label: string }[] = [
  { value: "artisan", label: "ร้านค้า/ชุมชน" },
  { value: "designer", label: "นักออกแบบ" },
  { value: "customer", label: "ลูกค้า" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { locale } = useLanguage();
  const [form, setForm] = useState({
    role: "customer" as "artisan" | "designer" | "customer",
    email: "",
    password: "",
    full_name: "",
    community_name: "",
    province: "",
    region: "north",
    bio_th: "",
    accept_terms: false,
    accept_privacy: false,
  });

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const isArtisan = form.role === "artisan";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.full_name) {
      setError(locale === "en" ? "Please complete all required fields." : "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (isArtisan && (!form.community_name || !form.province)) {
      setError(locale === "en" ? "Please complete the community details." : "กรุณากรอกข้อมูลชุมชนให้ครบถ้วน");
      return;
    }
    if (form.password.length < 6) {
      setError(locale === "en" ? "Password must contain at least 6 characters." : "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (!form.accept_terms || !form.accept_privacy) {
      setError(locale === "en" ? "Please accept the Terms of Service and Privacy Notice." : "กรุณายอมรับข้อกำหนดการใช้บริการและประกาศความเป็นส่วนตัว");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const session = await authApi.register({
        role: form.role,
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        ...(isArtisan
          ? {
              community_name: form.community_name,
              province: form.province,
              region: form.region,
              bio_th: form.bio_th || undefined,
            }
          : {}),
        accept_terms: form.accept_terms,
        accept_privacy: form.accept_privacy,
      });
      saveSession(session);
      if (session.role === "artisan") {
        router.push("/artisan/dashboard");
      } else if (session.role === "designer") {
        router.push("/designer/dashboard");
      } else {
        router.push("/marketplace");
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || (locale === "en" ? "Registration failed. Please try again." : "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 thai-diamond-bg px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-brand-200/70 bg-white shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-brand-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 thai-diamond-bg opacity-20" aria-hidden />
          <div className="relative">
            <p className="text-sm font-bold tracking-[0.2em] text-gold-300">SANTHAI</p>
            <h1 className="mt-5 text-4xl font-bold leading-tight thai-serif">{locale === "en" ? <>Begin your story<br />with Thai textiles</> : <>เริ่มต้นเรื่องราว<br />ของคุณกับผ้าไทย</>}</h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">{locale === "en" ? "Create an account to shop from communities or use Thai textiles confidently in your designs." : "สร้างบัญชีเพื่อเลือกซื้อสินค้าจากชุมชน หรือนำผ้าไทยไปต่อยอดเป็นงานออกแบบได้อย่างมั่นใจ"}</p>
          </div>
          <div className="relative mt-12 space-y-5">
            {[
              { icon: Store, title: locale === "en" ? "Verified stores" : "ร้านค้ายืนยันแล้ว", text: locale === "en" ? "Stores join by invitation and are reviewed by SanThai" : "เปิดรับร้านค้าแบบคำเชิญและตรวจสอบโดย SanThai" },
              { icon: Palette, title: locale === "en" ? "Designer" : "นักออกแบบ", text: locale === "en" ? "Turn Thai textiles into new work" : "นำผ้าไทยไปต่อยอดเป็นผลงานใหม่" },
              { icon: ShoppingBag, title: locale === "en" ? "Customer" : "ลูกค้า", text: locale === "en" ? "Browse and purchase from real stores" : "เลือกชมและสั่งซื้อจากร้านค้าจริง" },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-400/40 bg-white/10 text-gold-300"><Icon size={17} /></span>
                <div><p className="font-bold">{title}</p><p className="mt-0.5 text-xs leading-5 text-white/60">{text}</p></div>
              </div>
            ))}
          </div>
          <p className="relative mt-10 flex items-center gap-2 text-xs text-white/60"><BadgeCheck size={15} className="text-gold-300" />{locale === "en" ? "Your data is used according to our Privacy Notice." : "ข้อมูลของคุณจะถูกใช้ตามประกาศความเป็นส่วนตัว"}</p>
        </aside>

        <div className="w-full bg-white">
          <div className="bg-brand-900 p-7 text-center text-white relative lg:bg-transparent lg:px-10 lg:pb-3 lg:pt-10 lg:text-left lg:text-brand-900">
          <Link
            href="/login"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200 hover:text-white lg:left-10 lg:text-brand-900/55 lg:hover:text-brand-900"
            aria-label={locale === "en" ? "Back to log in" : "กลับไปหน้าเข้าสู่ระบบ"}
          >
            <ChevronLeft size={20} />
          </Link>
            <h1 className="text-2xl font-bold thai-serif">{locale === "en" ? "Create an account" : "สมัครสมาชิก"}</h1>
            <p className="mt-2 text-sm text-brand-200 lg:text-brand-900/55">{locale === "en" ? "Choose a role and enter your account details." : "เลือกบทบาท แล้วกรอกข้อมูลสำหรับบัญชีของคุณ"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8 lg:px-10 lg:pb-10 lg:pt-6">
          <div>
            <label className="block text-sm font-semibold text-brand-900 mb-2">{locale === "en" ? "Register as *" : "สมัครในฐานะ *"}</label>
            <div className="flex bg-stone-100 p-1 rounded-xl">
              {ROLE_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => set("role", r.value)}
                  aria-pressed={form.role === r.value}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                    form.role === r.value
                      ? "bg-white text-brand-900 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  {locale === "en" ? (r.value === "designer" ? "Designer" : r.value === "artisan" ? "Store" : "Customer") : r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-900 mb-1">{locale === "en" ? "Full name *" : "ชื่อ-นามสกุล *"}</label>
            <input
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              autoComplete="name"
              className="w-full px-4 py-3 bg-stone-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder={locale === "en" ? "e.g. Somchai Jaidee" : "เช่น สมศรี ใจดี"}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-900 mb-1">{locale === "en" ? "Email *" : "อีเมล *"}</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              autoComplete="email"
              className="w-full px-4 py-3 bg-stone-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-900 mb-1">{locale === "en" ? "Password *" : "รหัสผ่าน *"}</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-3 bg-stone-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder={locale === "en" ? "At least 6 characters" : "อย่างน้อย 6 ตัวอักษร"}
            />
          </div>

          {isArtisan && (
            <>
              <div>
                <label className="block text-sm font-semibold text-brand-900 mb-1">{locale === "en" ? "Store name *" : "ชื่อร้านค้า *"}</label>
                <input
                  value={form.community_name}
                  onChange={(e) => set("community_name", e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="เช่น ร้านผ้าทอบ้านโนนกอก"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                <label className="block text-sm font-semibold text-brand-900 mb-1">{locale === "en" ? "Province *" : "จังหวัด *"}</label>
                  <input
                    value={form.province}
                    onChange={(e) => set("province", e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="เช่น ขอนแก่น"
                  />
                </div>
                <div>
                <label className="block text-sm font-semibold text-brand-900 mb-1">{locale === "en" ? "Region *" : "ภาค *"}</label>
                  <select
                    value={form.region}
                    onChange={(e) => set("region", e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {REGION_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {locale === "en" ? (({ north: "North", northeast: "Northeast", central: "Central", south: "South" } as Record<string, string>)[r.value] || r.label) : r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-900 mb-1">{locale === "en" ? "About your store (optional)" : "แนะนำตัว (ไม่บังคับ)"}</label>
                <textarea
                  value={form.bio_th}
                  onChange={(e) => set("bio_th", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-stone-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  placeholder={locale === "en" ? "Tell your story briefly…" : "เล่าเรื่องราวของคุณสั้นๆ..."}
                />
              </div>
            </>
          )}

          <div className="space-y-2 rounded-xl bg-stone-50 border border-amber-100 p-3 text-xs text-brand-900">
            <label className="flex gap-2 items-start cursor-pointer">
              <input type="checkbox" checked={form.accept_terms} onChange={(event) => set("accept_terms", event.target.checked)} className="mt-0.5" />
              <span>{locale === "en" ? "I accept the " : "ฉันยอมรับ "}<Link href="/terms" target="_blank" className="font-bold underline">{locale === "en" ? "Terms of Service" : "ข้อกำหนดการใช้บริการ"}</Link> <span className="text-red-500">*</span></span>
            </label>
            <label className="flex gap-2 items-start cursor-pointer">
              <input type="checkbox" checked={form.accept_privacy} onChange={(event) => set("accept_privacy", event.target.checked)} className="mt-0.5" />
              <span>{locale === "en" ? "I acknowledge the " : "ฉันรับทราบ "}<Link href="/privacy" target="_blank" className="font-bold underline">{locale === "en" ? "Privacy Notice" : "ประกาศความเป็นส่วนตัว"}</Link> <span className="text-red-500">*</span></span>
            </label>
          </div>

          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-brand-900 hover:bg-brand-800 text-white font-bold tracking-widest uppercase transition-colors rounded-xl shadow-md mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? (locale === "en" ? "Creating account…" : "กำลังสมัคร…") : (locale === "en" ? "Create account" : "สมัครสมาชิก")}
          </button>

          <p className="text-xs text-center text-stone-400 mt-2">
            {locale === "en" ? "Already have an account? " : "มีบัญชีอยู่แล้ว? "}
            <Link href="/login" className="text-brand-700 font-semibold hover:underline">
              {locale === "en" ? "Log in" : "เข้าสู่ระบบ"}
            </Link>
          </p>
          </form>
        </div>
      </div>
    </div>
  );
}
