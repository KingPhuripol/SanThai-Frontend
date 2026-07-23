"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  FileText, 
  Loader2, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  ExternalLink,
  Store,
  UserCheck,
  ArrowRight,
  Info
} from "lucide-react";
import { authApi } from "@/lib/api";
import { useLanguage } from "@/components/LanguageProvider";

export function StoreTermsGate({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    authApi.getStoreTermsStatus()
      .then((result) => setAccepted(result.accepted))
      .catch((err) => {
        const msg = err?.response?.data?.detail;
        if (msg === "Store account required") {
          setError(locale === "en" ? "Store account required. Your current account does not have store permissions." : "จำเป็นต้องใช้บัญชีร้านค้า บัญชีปัจจุบันของคุณยังไม่มีสิทธิ์ร้านค้า");
        } else {
          setError(locale === "en" ? "We could not verify the store agreement. Please sign in again." : "ไม่สามารถตรวจสอบข้อตกลงร้านค้าได้ กรุณาเข้าสู่ระบบอีกครั้ง");
        }
      })
      .finally(() => setLoading(false));
  }, [locale]);

  const accept = async () => {
    if (!checked) return;
    setSaving(true);
    setError("");
    try {
      await authApi.acceptStoreTerms();
      setAccepted(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail || (locale === "en" ? "We could not save your acceptance." : "บันทึกการยอมรับไม่สำเร็จ"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-amber-200/50 border-t-gold-500 animate-spin" />
          <ShieldCheck className="absolute h-5 w-5 text-brand-900" />
        </div>
        <p className="text-xs font-semibold text-brand-900/60 thai-serif">
          {locale === "en" ? "Verifying store access..." : "กำลังตรวจสอบสิทธิ์ร้านค้า..."}
        </p>
      </div>
    );
  }

  if (accepted) return <>{children}</>;

  return (
    <section className="mx-auto my-6 max-w-2xl overflow-hidden rounded-[28px] border border-amber-200/70 bg-gradient-to-b from-white via-white to-amber-50/30 p-6 shadow-xl shadow-brand-950/5 sm:p-10 transition-all">
      
      {/* Header Badge & Title */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-900 to-brand-950 text-gold-400 shadow-lg shadow-brand-900/20 ring-4 ring-gold-400/20">
          <ShieldCheck className="h-8 w-8" />
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-gold-400 animate-pulse" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/15 px-3.5 py-1 text-[11px] font-bold text-brand-900 ring-1 ring-gold-400/30">
          <Store className="h-3.5 w-3.5 text-gold-600" />
          {locale === "en" ? "Store Verification & Agreement" : "ข้อตกลงการใช้บริการสำหรับร้านค้า"}
        </span>

        <h1 className="mt-3 text-2xl font-extrabold text-brand-950 thai-serif sm:text-3xl">
          {locale === "en" ? "Accept Store Terms" : "ยอมรับข้อตกลงสำหรับร้านค้า"}
        </h1>
        
        <p className="mt-2.5 max-w-lg text-xs leading-relaxed text-brand-900/70 sm:text-sm">
          {locale === "en" 
            ? "Before adding or publishing products, invited stores must read and accept the Store Terms. The system records the version, accepter, and timestamp for transparency."
            : "ก่อนเพิ่มหรือเผยแพร่สินค้า ร้านค้าที่ได้รับคำเชิญต้องอ่านและยอมรับข้อกำหนดฉบับร้านค้า ระบบจะบันทึกเวอร์ชัน ผู้ยอมรับ และเวลาไว้เพื่อการตรวจสอบ"}
        </p>
      </div>

      {/* Error Alert Box with Solutions */}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-200/80 bg-red-50/80 p-4 text-red-900 shadow-sm backdrop-blur-sm animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">
              <p className="font-bold text-red-950">{locale === "en" ? "Unable to proceed" : "ไม่สามารถดำเนินการต่อได้"}</p>
              <p className="mt-1 leading-relaxed text-red-800/90">{error}</p>
              
              {/* Quick Actions depending on error */}
              <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-red-200/60">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition-colors"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  {locale === "en" ? "Sign in to Store Account" : "เข้าสู่ระบบด้วยบัญชีร้านค้า"}
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1 rounded-lg bg-white border border-red-200 px-3 py-1.5 text-xs font-bold text-red-900 hover:bg-red-50 transition-colors"
                >
                  {locale === "en" ? "Register Store" : "สมัครบัญชีร้านค้าใหม่"}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Points Summary Box */}
      <div className="mt-6 rounded-2xl border border-gold-400/25 bg-gradient-to-r from-amber-50/80 to-gold-50/40 p-4 sm:p-5">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-950">
          <Info className="h-4 w-4 text-gold-600" />
          {locale === "en" ? "Key Points Summary" : "สาระสำคัญของข้อตกลง"}
        </p>

        <div className="mt-3 grid gap-2.5 text-xs text-brand-900/80 sm:grid-cols-1">
          {[
            locale === "en" ? "Stores confirm the accuracy of origin, weave techniques, prices, and preparation time." : "ร้านค้ารับรองความถูกต้องของแหล่งผลิต เทคนิคการทอ ราคา และระยะเวลาจัดเตรียมสินค้า",
            locale === "en" ? "SanThai is a marketplace intermediary with clear policies for payments, disputes, and privacy." : "SanThai เป็นตัวกลางตลาดออนไลน์ พร้อมนโยบายคุ้มครองการชำระเงิน ข้อพิพาท และข้อมูลส่วนบุคคล",
            locale === "en" ? "Stores must communicate any delay in delivery against the stated lead time." : "ร้านค้าต้องแจ้งเตือนหากมีความล่าช้าเกินกว่าระยะเวลาจัดส่ง (Lead time) ที่ระบุไว้"
          ].map((point, idx) => (
            <div key={idx} className="flex items-start gap-2.5 rounded-xl bg-white/70 p-2.5 shadow-2xs border border-amber-100/50">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <span className="leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Checkbox Section */}
      <label className="group mt-6 flex cursor-pointer items-start gap-3.5 rounded-2xl border border-amber-200/80 bg-white p-4 shadow-sm transition-all hover:border-gold-400 hover:shadow-md">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={(e) => setChecked(e.target.checked)} 
          className="mt-1 h-4 w-4 rounded border-amber-300 text-brand-900 focus:ring-gold-400" 
        />
        <span className="text-xs leading-relaxed text-brand-900 sm:text-sm">
          {locale === "en" ? "I have read and accept the " : "ฉันได้อ่านและยอมรับ "}
          <Link 
            href="/terms" 
            target="_blank" 
            className="inline-flex items-center gap-1 font-bold text-brand-900 underline underline-offset-2 hover:text-gold-600"
          >
            {locale === "en" ? "Store Terms of Service" : "ข้อกำหนดการใช้บริการสำหรับร้านค้า"}
            <ExternalLink className="h-3 w-3" />
          </Link> 
          {locale === "en" ? " version " : " เวอร์ชัน "}
          <span className="rounded bg-brand-100/60 px-1.5 py-0.5 text-[11px] font-mono font-bold text-brand-900">
            2026-07-18-store-v1
          </span>
        </span>
      </label>

      {/* Primary Action Button */}
      <button 
        onClick={accept} 
        disabled={!checked || saving || Boolean(error)} 
        className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-900 via-brand-900 to-brand-950 py-4 text-sm font-bold text-white shadow-lg shadow-brand-900/20 transition-all hover:from-brand-800 hover:to-brand-900 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-gold-400" />
            <span>{locale === "en" ? "Saving agreement..." : "กำลังบันทึกการยอมรับ..."}</span>
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 text-gold-400" />
            <span>{locale === "en" ? "Accept and Start Managing Store" : "ยอมรับและเริ่มจัดการร้านค้า"}</span>
          </>
        )}
      </button>

      {/* Footer Helper Links */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-brand-900/60">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-gold-600" />
          {locale === "en" ? "Public store registration by invitation only" : "ระบบรับสมัครร้านค้าผ่านการยืนยันตัวตน"}
        </span>

        <div className="flex items-center gap-3 font-semibold">
          <Link href="/login" className="hover:text-brand-900 hover:underline">
            {locale === "en" ? "Switch Account" : "สลับบัญชีใช้งาน"}
          </Link>
          <span>•</span>
          <Link href="/register" className="hover:text-brand-900 hover:underline">
            {locale === "en" ? "Register Store" : "สมัครร้านค้าใหม่"}
          </Link>
        </div>
      </div>

    </section>
  );
}
