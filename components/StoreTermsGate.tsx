"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, Loader2, ShieldCheck } from "lucide-react";
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
      .catch(() => setError(locale === "en" ? "We could not verify the store agreement. Please sign in again." : "ไม่สามารถตรวจสอบข้อตกลงร้านค้าได้ กรุณาเข้าสู่ระบบอีกครั้ง"))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) return <div className="flex min-h-[280px] items-center justify-center"><Loader2 className="animate-spin text-brand-900" /></div>;
  if (accepted) return <>{children}</>;

  return <section className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-9">
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-900 text-gold-300"><ShieldCheck size={25} /></span>
    <h1 className="mt-5 text-2xl font-bold text-brand-900 thai-serif">{locale === "en" ? "Accept Store Terms" : "ยอมรับข้อตกลงสำหรับร้านค้า"}</h1>
    <p className="mt-3 text-sm leading-7 text-brand-900/65">{locale === "en" ? "Before adding or publishing products, invited stores must read and accept the Store Terms. The system records the version, accepter, and time for audit." : "ก่อนเพิ่มหรือเผยแพร่สินค้า ร้านค้าที่ได้รับคำเชิญต้องอ่านและยอมรับข้อกำหนดฉบับร้านค้า ระบบจะบันทึกเวอร์ชัน ผู้ยอมรับ และเวลาไว้เพื่อการตรวจสอบ"}</p>
    <div className="mt-5 rounded-2xl bg-brand-50 p-4 text-sm text-brand-900/75"><p className="font-bold">{locale === "en" ? "Key points" : "สาระสำคัญ"}</p><ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5">{locale === "en" ? <><li>Stores confirm the accuracy of origin, techniques, prices, and preparation time.</li><li>SanThai is a marketplace intermediary with policies for payments, disputes, and personal data.</li><li>Stores must communicate delays against the published lead time.</li></> : <><li>ร้านรับรองความถูกต้องของแหล่งผลิต เทคนิค ราคา และระยะเวลาจัดเตรียม</li><li>SanThai เป็นตัวกลาง และมีนโยบายเรื่องการชำระเงิน ข้อพิพาท และข้อมูลส่วนบุคคล</li><li>ร้านต้องแจ้งความล่าช้าตาม Lead time ที่ประกาศไว้</li></>}</ul></div>
    <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-100 p-4 text-sm text-brand-900"><input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} className="mt-1" /><span>{locale === "en" ? "I have read and accept the " : "ฉันได้อ่านและยอมรับ "}<Link href="/terms" target="_blank" className="font-bold underline">{locale === "en" ? "Store Terms of Service" : "ข้อกำหนดการใช้บริการสำหรับร้านค้า"}</Link> {locale === "en" ? "version " : "เวอร์ชัน "}2026-07-18-store-v1</span></label>
    {error && <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>}
    <button onClick={accept} disabled={!checked || saving} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-900 py-3.5 text-sm font-bold text-white disabled:opacity-50"><FileText size={16} />{saving ? (locale === "en" ? "Saving…" : "กำลังบันทึก…") : (locale === "en" ? "Accept and start managing store" : "ยอมรับและเริ่มจัดการร้านค้า")}</button>
    <p className="mt-3 flex items-center gap-1 text-[11px] text-brand-900/45"><CheckCircle2 size={12} />{locale === "en" ? "Public store registration is not open yet." : "ระบบยังไม่เปิดรับสมัครร้านค้าสาธารณะ"}</p>
  </section>;
}
