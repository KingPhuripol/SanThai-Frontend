"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Store, Users } from "lucide-react";
import { artisanApi } from "@/lib/api";
import { useLanguage } from "@/components/LanguageProvider";

const REGIONS = [
  { id: "all", th: "ทั่วประเทศไทย", en: "All Thailand", tone: "bg-brand-900 text-white" },
  { id: "north", th: "ภาคเหนือ", en: "Northern", tone: "bg-emerald-700 text-white" },
  { id: "northeast", th: "ภาคอีสาน", en: "Northeastern", tone: "bg-rose-800 text-white" },
  { id: "central", th: "ภาคกลาง", en: "Central", tone: "bg-amber-700 text-white" },
  { id: "south", th: "ภาคใต้", en: "Southern", tone: "bg-sky-800 text-white" },
];

const FALLBACK_IMAGE = "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_image_01.jpg";

const MAP_COLORS: Record<string, { fill: string; stroke: string }> = {
  north: { fill: "#0f8a63", stroke: "#66e3b0" },
  northeast: { fill: "#bd1748", stroke: "#ff85a9" },
  central: { fill: "#cc6500", stroke: "#ffbd65" },
  south: { fill: "#1474a6", stroke: "#67c8f3" },
};

function ThailandMap({ communities, region, setRegion, locale }: { communities: any[]; region: string; setRegion: (value: string) => void; locale: "th" | "en" }) {
  const marker = (community: any) => {
    if (typeof community.latitude !== "number" || typeof community.longitude !== "number") return null;
    const x = 40 + (community.longitude - 97.3) * 55;
    const y = 20 + (20.5 - community.latitude) * 34;
    const selected = region === "all" || region === community.region;
    return <g key={community.id} className={`cursor-pointer transition ${selected ? "opacity-100" : "opacity-30"}`} onClick={() => setRegion(community.region)}><circle cx={x} cy={y} r="12" fill="#f7d46b" opacity=".25"/><circle cx={x} cy={y} r="6" fill="#f7d46b" stroke="#fff7df" strokeWidth="2"/><title>{community.name} · {community.store_count} {locale === "en" ? "stores" : "ร้านค้า"}</title></g>;
  };
  return <div className="relative mt-7 overflow-hidden rounded-3xl border border-white/10 bg-[#2b1749] p-3 sm:p-6"><div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#f6d878_1px,transparent_1px)] [background-size:22px_22px]" /><div className="relative mx-auto max-w-xl"><svg viewBox="20 0 520 550" className="h-[420px] w-full sm:h-[500px]" role="img" aria-label={locale === "en" ? "Interactive map of Thailand" : "แผนที่ประเทศไทยแบบโต้ตอบ"}>
    <defs><filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".35" /></filter></defs>
    <path d="M330.7 302.7 L281.3 287.0 L234.2 287.7 L242.3 261.0 L193.9 261.2 L189.5 298.6 L159.8 348.2 L142.0 378.3 L145.7 402.9 L181.6 403.9 L203.9 435.0 L213.8 464.4 L244.5 483.9 L277.8 487.8 L306.3 505.5 L288.3 519.4 L252.0 523.5 L247.7 506.0 L202.8 491.1 L193.2 497.2 L171.5 484.2 L162.1 467.3 L132.9 448.1 L106.2 432.0 L97.2 452.0 L86.8 433.1 L92.8 411.9 L108.9 379.3 L135.6 344.3 L165.8 312.6 L144.3 281.6 L145.2 265.8 L138.9 246.9 L102.2 219.9 L89.1 202.8 L108.1 196.5 L128.2 167.0 L105.7 144.5 L70.8 119.7 L44.2 89.9 L67.4 83.7 L92.5 46.9 L131.3 45.4 L163.4 30.7 L194.9 22.8 L218.7 33.3 L221.8 53.7 L259.0 55.3 L245.5 91.1 L246.8 121.6 L304.7 101.3 L321.2 107.3 L353.4 106.3 L364.5 94.5 L406.1 96.8 L447.9 124.4 L451.4 158.0 L495.9 187.6 L493.4 216.4 L475.5 231.7 L424.0 226.8 L352.9 233.3 L317.6 261.6 L330.7 302.7 Z" fill="#87527f" stroke="#f4d675" strokeWidth="3" filter="url(#mapShadow)"/>
    <path d="M189 299 L246 122 M246 122 L353 106 M246 122 L318 262 M318 262 L424 227 M318 262 L306 506" fill="none" stroke="#f4d675" strokeWidth="1.5" strokeDasharray="5 5" opacity=".65"/>
    {communities.map(marker)}
  </svg><div className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs text-white/60">{locale === "en" ? "Select a region or a gold marker to filter verified stores" : "กดภูมิภาคหรือหมุดสีทองเพื่อกรองร้านค้ายืนยันแล้ว"}</div></div></div>;
}

export default function CommunityPage() {
  const { locale, t } = useLanguage();
  const [communities, setCommunities] = useState<any[]>([]);
  const [region, setRegion] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    artisanApi.listCommunities().then(setCommunities).catch(() => setCommunities([])).finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => region === "all" ? communities : communities.filter((item) => item.region === region), [communities, region]);
  const totalStores = communities.reduce((sum, item) => sum + (item.store_count || 0), 0);

  return <main className="min-h-screen bg-brand-900 pb-20 pt-28 text-white">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <p className="text-xs font-bold tracking-[.2em] text-gold-300">SANTHAI CREATIVE COMMUNITY</p>
      <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><h1 className="text-4xl font-bold thai-serif sm:text-5xl">{t("community")}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">{locale === "en" ? "Explore verified Thai textile stores by region, then visit their products and stories directly." : "ค้นหาร้านผ้าไทยที่ผ่านการยืนยันตามภูมิภาค แล้วเข้าชมสินค้าและเรื่องราวของผู้ผลิตได้โดยตรง"}</p></div><div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4"><p className="text-2xl font-bold text-gold-300">{totalStores}</p><p className="text-xs text-white/65">{locale === "en" ? "verified stores" : "ร้านค้ายืนยันแล้วในระบบ"}</p></div></div>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7"><div className="flex flex-wrap gap-2">{REGIONS.map((item) => <button key={item.id} onClick={() => setRegion(item.id)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${region === item.id ? item.tone : "bg-white/10 text-white/70 hover:bg-white/20"}`}>{locale === "en" ? item.en : item.th}</button>)}</div><ThailandMap communities={communities} region={region} setRegion={setRegion} locale={locale} /></section>

      <section className="mt-10"><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-bold thai-serif">{locale === "en" ? "Stores in " : "ร้านค้าใน"}{region === "all" ? (locale === "en" ? "Thailand" : "ทุกภูมิภาค") : (() => { const selected = REGIONS.find((item) => item.id === region); return locale === "en" ? selected?.en : selected?.th; })()}</h2><Link href="/marketplace" className="inline-flex items-center gap-1 text-sm font-bold text-gold-300">{locale === "en" ? "Browse marketplace" : "ดูตลาดผ้า"} <ArrowRight size={15} /></Link></div>{loading ? <div className="grid grid-cols-1 gap-5 md:grid-cols-3">{[1, 2, 3].map((key) => <div key={key} className="h-72 animate-pulse rounded-3xl bg-white/10" />)}</div> : visible.length === 0 ? <div className="rounded-3xl border border-dashed border-white/20 p-12 text-center text-white/65">{locale === "en" ? "No verified stores are available in this region yet." : "ยังไม่มีร้านค้าที่ผ่านการยืนยันในภูมิภาคนี้"}</div> : <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.flatMap((community) => community.stores.map((store: any) => <article key={store.id} className="overflow-hidden rounded-3xl bg-[#FAF6ED] text-brand-900 shadow-xl"><div className="relative h-44"><Image src={store.image_url || FALLBACK_IMAGE} alt={store.name} fill className="object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 pt-12 text-sm font-bold text-white"><MapPin className="inline" size={14} /> {locale === "en" ? community.province_en || community.province : `จ.${community.province}`}</div></div><div className="p-5"><p className="text-lg font-bold thai-serif">{store.name}</p><p className="mt-2 line-clamp-2 min-h-10 text-sm text-brand-900/60">{locale === "en" ? store.bio_en || store.bio_th || `Thai textile store from ${community.name_en || community.name}` : store.bio_th || `ร้านผ้าไทยจาก${community.name}`}</p><div className="mt-4 flex items-center gap-4 text-xs text-brand-900/55"><span className="inline-flex items-center gap-1"><Store size={14} />{store.product_count} {locale === "en" ? "products" : "สินค้า"}</span><span className="inline-flex items-center gap-1"><Users size={14} />{locale === "en" ? "Verified" : "ร้านค้ายืนยันแล้ว"}</span></div><Link href={`/storefront/${store.id}`} className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-brand-900 py-3 text-sm font-bold text-white hover:bg-brand-800">{t("viewStore")} <ArrowRight size={15} /></Link></div></article>))}</div>}</section>
    </div>
  </main>;
}
