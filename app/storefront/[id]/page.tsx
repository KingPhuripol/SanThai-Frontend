"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BadgeCheck, ChevronLeft, MapPin, ShoppingBag } from "lucide-react";
import { artisanApi } from "@/lib/api";
import { useLanguage } from "@/components/LanguageProvider";

export default function StorefrontPage() {
  const params = useParams<{ id: string }>();
  const { locale, pick, t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    artisanApi.getStorefront(Number(params.id)).then(setData).catch(() => setError("not-found"));
  }, [params.id]);

  if (error) return <main className="min-h-screen bg-brand-50 px-4 pt-32 text-center"><p className="text-xl font-bold text-brand-900">{locale === "en" ? "This store could not be found or has not been verified yet." : "ไม่พบร้านค้านี้ หรือร้านยังไม่ได้รับการยืนยัน"}</p><Link href="/community" className="mt-5 inline-block rounded-xl bg-brand-900 px-5 py-3 text-sm font-bold text-white">{locale === "en" ? "Back to creative communities" : "กลับสู่ชุมชนผู้สร้างสรรค์"}</Link></main>;
  if (!data) return <main className="flex min-h-screen items-center justify-center bg-brand-50"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-900 border-t-transparent" /></main>;

  const { store, community, products } = data;
  const communityName = pick(community.name, community.name_en);
  return <main className="min-h-screen bg-brand-50 pb-16 pt-28"><div className="mx-auto max-w-6xl px-4 sm:px-6">
    <Link href="/community" className="inline-flex items-center gap-1 text-sm font-bold text-brand-900/60"><ChevronLeft size={17} />{locale === "en" ? "Creative communities" : "กลับชุมชนผู้สร้างสรรค์"}</Link>
    <section className="mt-5 overflow-hidden rounded-3xl bg-brand-900 p-7 text-white sm:p-10"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white/15">{store.avatar_url && <Image src={store.avatar_url} alt="" fill className="object-cover" />}</div><div><h1 className="flex items-center gap-2 text-3xl font-bold thai-serif">{store.name}<BadgeCheck className="text-gold-300" size={22} /></h1><p className="mt-2 flex items-center gap-1 text-sm text-white/70"><MapPin size={14} />{communityName} · {locale === "en" ? community.province_en || community.province : `จ.${community.province}`}</p><p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">{pick(store.bio_th, store.bio_en, locale === "en" ? "A Thai textile store verified by SanThai." : "ร้านค้าผ้าไทยที่ผ่านการตรวจสอบโดย SanThai")}</p></div></div></section>
    <section className="mt-8"><h2 className="text-2xl font-bold text-brand-900 thai-serif">{locale === "en" ? "Products from this store" : "สินค้าจากร้านนี้"}</h2>{products.length === 0 ? <p className="mt-5 rounded-2xl bg-white p-8 text-brand-900/60">{locale === "en" ? "This store is preparing products for publication." : "ร้านกำลังเตรียมสินค้าเพื่อเผยแพร่"}</p> : <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product: any) => <Link href={`/marketplace/${product.id}`} key={product.id} className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-[4/3] bg-brand-100">{product.image_url && <Image src={product.image_url} alt={pick(product.title_th, product.title_en)} fill className="object-cover" />}</div><div className="p-4"><p className="font-bold text-brand-900">{pick(product.title_th, product.title_en)}</p><p className="mt-1 text-xs text-brand-900/55">{pick(product.fabric_name, product.fabric_name_en)}</p><div className="mt-4 flex items-center justify-between"><span className="font-bold text-brand-900">{locale === "en" ? `$${(Number(product.price_thb || 0) / 35).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD` : `฿${Number(product.price_thb || 0).toLocaleString()}`}</span><span className="inline-flex items-center gap-1 text-xs font-bold text-gold-700"><ShoppingBag size={13} />{t("viewProduct")}</span></div></div></Link>)}</div>}</section>
  </div></main>;
}
