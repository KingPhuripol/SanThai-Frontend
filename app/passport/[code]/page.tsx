"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BadgeCheck, ChevronLeft, Clock3, QrCode, ShieldCheck } from "lucide-react";
import { productsApi } from "@/lib/api";
import { useLanguage } from "@/components/LanguageProvider";

const STATUS: Record<string, { label: string; className: string }> = {
  verified: { label: "ตรวจสอบโดย SanThai", className: "bg-green-50 text-green-700 border-green-200" },
  pending_verification: { label: "อยู่ระหว่างตรวจสอบ", className: "bg-amber-50 text-amber-700 border-amber-200" },
  seller_declared: { label: "ข้อมูลที่ร้านค้าระบุ", className: "bg-brand-50 text-brand-900 border-brand-200" },
};

export default function PassportPage() {
  const { locale, pick, t } = useLanguage();
  const params = useParams<{ code: string }>();
  const [passport, setPassport] = useState<any>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.code) return;
    productsApi.getPassport(params.code).then(setPassport).catch(() => setError(locale === "en" ? "This SanThai Passport was not found or has been suspended." : "ไม่พบ SanThai Passport นี้ หรือ Passport ถูกระงับการใช้งาน"));
    productsApi.getPassportQr(params.code).then((result) => setQr(result.image_data_url)).catch(() => setQr(null));
  }, [params.code]);

  if (error) return <main className="min-h-screen bg-brand-50 px-6 pb-16 pt-32 text-center text-brand-900"><ShieldCheck className="mx-auto text-brand-900/30" size={48} /><h1 className="mt-4 text-2xl font-bold thai-serif">{error}</h1><Link href="/marketplace" className="mt-6 inline-block rounded-xl bg-brand-900 px-5 py-3 text-sm font-bold text-white">กลับสู่ตลาดผ้า</Link></main>;
  if (!passport) return <main className="min-h-screen bg-brand-50 pt-32 text-center text-brand-900"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-900 border-t-transparent" /></main>;

  const state = STATUS[passport.status] || STATUS.seller_declared;
  const englishStates: Record<string, string> = { verified: "Verified by SanThai", pending_verification: "Verification pending", seller_declared: "Store-declared information" };
  const stateLabel = locale === "en" ? (englishStates[String(passport.status)] || "Store-declared information") : state.label;
  const details = [
    [locale === "en" ? "Product code" : "รหัสสินค้า", passport.product?.code], [locale === "en" ? "Pattern" : "ลวดลาย", passport.product?.pattern_name], [locale === "en" ? "Colour" : "สี", passport.product?.color],
    [locale === "en" ? "Dye method" : "การย้อม", passport.product?.dye_method], [locale === "en" ? "Production method" : "วิธีผลิต", passport.product?.production_method], [locale === "en" ? "Texture" : "ผิวสัมผัส", passport.product?.texture],
    [locale === "en" ? "Production origin" : "แหล่งผลิต", passport.product?.production_origin], [locale === "en" ? "Fibre" : "เส้นใย", passport.fabric?.fiber_type],
  ].filter(([, value]) => value);

  return (
    <main className="min-h-screen bg-brand-50 pb-16 pt-28 text-brand-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Link href={passport.product?.id ? `/marketplace/${passport.product.id}` : "/marketplace"} className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-900/60 hover:text-brand-900"><ChevronLeft size={18} /> {locale === "en" ? "Back to product" : "กลับไปยังสินค้า"}</Link>
        <section className="mt-6 overflow-hidden rounded-[28px] border border-amber-100 bg-white shadow-xl">
          <div className="bg-brand-900 p-7 text-white sm:p-10"><p className="text-xs font-bold tracking-[0.18em] text-gold-300">SANTHAI PASSPORT</p><div className="mt-4 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold thai-serif">{pick(passport.product?.title_th, passport.product?.title_en)}</h1><p className="mt-2 font-mono text-sm text-white/70">{passport.code}</p></div><span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${state.className}`}>{stateLabel}</span></div></div>
          <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[0.8fr_1.2fr]">
            <div>{passport.product?.image ? <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-50"><Image src={passport.product.image} alt={pick(passport.product?.title_th, passport.product?.title_en, "Product")} fill unoptimized className="object-cover" /></div> : <div className="aspect-square rounded-2xl bg-brand-50" />}<Link href={`/marketplace/${passport.product.id}`} className="mt-4 block rounded-xl border border-brand-200 py-3 text-center text-sm font-bold hover:border-brand-900">{t("viewProduct")}</Link>{qr && <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-center"><p className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-brand-900"><QrCode size={15} />{locale === "en" ? "Scan this Passport" : "สแกนเพื่อเปิด Passport นี้"}</p><img src={qr} alt={`QR SanThai Passport ${passport.code}`} className="mx-auto h-32 w-32 rounded-lg bg-white p-2" /><p className="mt-2 text-[11px] text-brand-900/55">{locale === "en" ? "This QR opens the latest product Passport." : "รหัสและ QR นี้พาไปยังข้อมูลสินค้าฉบับล่าสุด"}</p></div>}</div>
            <div><p className="text-sm leading-7 text-brand-900/70">{passport.public_note || "Passport นี้สรุปข้อมูลสินค้าและแหล่งผลิตที่เผยแพร่ได้"}</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{details.map(([label, value]) => <div key={label} className="rounded-xl bg-brand-50 p-4"><p className="text-xs font-bold text-brand-900/50">{label}</p><p className="mt-1 font-bold">{value}</p></div>)}</div>{passport.product?.care_instructions && <div className="mt-5 rounded-xl border border-amber-100 p-4"><p className="font-bold">การดูแลรักษา</p><p className="mt-2 text-sm leading-6 text-brand-900/70">{passport.product.care_instructions}</p></div>}</div>
          </div>
        </section>
        <section className="mt-8 rounded-[28px] border border-amber-100 bg-white p-6 sm:p-10"><h2 className="text-2xl font-bold thai-serif">เส้นทางของสินค้า</h2><p className="mt-2 text-sm text-brand-900/60">ข้อมูลตามลำดับเหตุการณ์ที่ร้านค้าและ SanThai บันทึกไว้</p><ol className="mt-7 space-y-5 border-l-2 border-gold-300 pl-6">{passport.events?.map((event: any) => <li key={event.id} className="relative"><span className="absolute -left-[34px] top-1 h-4 w-4 rounded-full border-4 border-white bg-gold-400" /><p className="font-bold">{event.description_th || event.type}</p><p className="mt-1 text-sm text-brand-900/60">{event.actor_name}{event.location ? ` · ${event.location}` : ""}</p><p className="mt-1 flex items-center gap-1 text-xs text-brand-900/45"><Clock3 size={12} />{event.created_at ? new Date(event.created_at).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" }) : "ไม่ระบุเวลา"}</p></li>)}</ol><p className="mt-8 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-900">ผลการสแกนภาพให้ผลเป็นการค้นหารายการที่ใกล้เคียงเท่านั้น การยืนยัน Passport ให้ตรวจจากรหัสและหน้านี้โดยตรง</p></section>
      </div>
    </main>
  );
}
