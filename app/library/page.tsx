"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight } from "lucide-react";
import { fabricsApi } from "@/lib/api";
import type { FabricPattern } from "@/lib/types";

// ─── SVG Region Icons ──────────────────────────────────────────────────────────

function IconAllRegions({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <polygon points="8,1 15,8 8,15 1,8" stroke="currentColor" strokeWidth="1.2" />
      <polygon points="8,4.5 11.5,8 8,11.5 4.5,8" fill="currentColor" fillOpacity="0.4" />
      <circle cx="8" cy="8" r="1.4" fill="currentColor" />
    </svg>
  );
}

function IconMountain({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 2L14 13H2L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M5.5 8.5L8 5.5L10.5 8.5" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" />
    </svg>
  );
}

function IconGrain({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <line x1="8" y1="14" x2="8" y2="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4C8 4 5,5 5,7C5,9 8,8.5 8,8.5" stroke="currentColor" strokeWidth="1" />
      <path d="M8 4C8 4 11,5 11,7C11,9 8,8.5 8,8.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function IconTemple({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <line x1="8" y1="1" x2="8" y2="4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="6.5" y="4" width="3" height="2" stroke="currentColor" strokeWidth="1" />
      <rect x="5" y="6" width="6" height="2" stroke="currentColor" strokeWidth="1" />
      <rect x="3" y="8" width="10" height="6" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function IconWave({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M1 6C3 4 5 8 8 6C11 4 13 8 15 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M1 10C3 8 5 12 8 10C11 8 13 12 15 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────

const REGIONS = [
  { value: "",          label: "ทุกภูมิภาค", Icon: IconAllRegions, accent: "#52221a" },
  { value: "north",     label: "ภาคเหนือ",   Icon: IconMountain,   accent: "#1a6b5a" },
  { value: "northeast", label: "ภาคอีสาน",   Icon: IconGrain,      accent: "#8b1a1a" },
  { value: "central",   label: "ภาคกลาง",    Icon: IconTemple,     accent: "#7a6010" },
  { value: "south",     label: "ภาคใต้",     Icon: IconWave,       accent: "#1a3f8b" },
];

const TECHNIQUES = ["มัดหมี่", "ขิด", "จก", "ยกดอก", "ทอมือ", "เกาะหรือล้วง"];

const TECHNIQUE_DETAIL: Record<string, { desc: string; origin: string }> = {
  "มัดหมี่":       { desc: "มัดเส้นด้ายก่อนย้อมสีเพื่อให้เกิดลวดลายบนตัวเส้นด้าย ก่อนนำมาทอ", origin: "ภาคอีสาน / ภาคเหนือ" },
  "ขิด":           { desc: "สอดด้ายพุ่งพิเศษเพิ่มเข้าไปในผ้าพื้นเพื่อสร้างลายนูนแบบเฉพาะตัว", origin: "ภาคเหนือ / ภาคอีสาน" },
  "จก":            { desc: "ใช้นิ้วมือหรือขอเกี่ยวเก็บด้ายยืนขึ้นทีละเส้น เป็นเทคนิคที่ซับซ้อนที่สุด", origin: "ภาคเหนือ (แม่แจ่ม)" },
  "ยกดอก":         { desc: "ยกด้ายยืนขึ้นตามลวดลาย สร้างผิวสัมผัสดอกนูนบนเนื้อผ้า", origin: "ภาคกลาง / ภาคเหนือ" },
  "ทอมือ":         { desc: "ทอบนกี่พื้นบ้านแบบดั้งเดิม แต่ละผืนมีเอกลักษณ์ไม่ซ้ำกัน", origin: "ทั่วประเทศไทย" },
  "เกาะหรือล้วง": { desc: "สอดเส้นด้ายพิเศษสร้างพื้นผิวลายที่มีความลึกและมิติ", origin: "ภาคเหนือ / ภาคใต้" },
};

const REGION_LABELS: Record<string, string> = {
  north: "ภาคเหนือ", northeast: "ภาคอีสาน", central: "ภาคกลาง", south: "ภาคใต้",
};

const REGION_ACCENTS: Record<string, string> = {
  north: "#1a6b5a", northeast: "#8b1a1a", central: "#7a6010", south: "#1a3f8b",
};

// ─── Pattern Card ──────────────────────────────────────────────────────────────

function PatternCard({ fabric }: { fabric: FabricPattern }) {
  const imageUrl =
    (fabric.image_url as string) ||
    "/uploads/thai_fabric_image_01.jpg";

  const region = fabric.community?.region ?? "";
  const accent = REGION_ACCENTS[region] ?? "#52221a";

  return (
    <Link href={`/library/${fabric.id}`} className="group block bg-white rounded-[20px] overflow-hidden shadow-lg border border-brand-200/50 hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden bg-brand-100 aspect-[3/4]">
        <Image
          src={imageUrl}
          alt={fabric.name_th}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/10 transition-colors duration-300" />
        {region && (
          <div
            className="absolute top-3 left-3 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-md"
            style={{ background: accent + "e0" }}
          >
            {REGION_LABELS[region]}
          </div>
        )}
      </div>

      {/* Caption */}
      <div className="p-5">
        <h3 className="text-base font-bold text-brand-900 thai-serif leading-snug line-clamp-2 group-hover:text-gold-600 transition-colors">
          {fabric.name_th}
        </h3>
        {fabric.name_en && (
          <p className="text-[11px] text-brand-900/50 mt-1 truncate">
            {fabric.name_en}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold text-brand-900/60 tracking-widest uppercase">
          {fabric.weave_technique && (
            <span className="bg-brand-50 px-2.5 py-1 rounded-md">{fabric.weave_technique.split(" ")[0]}</span>
          )}
          {fabric.community?.province && (
            <span className="bg-brand-50 px-2.5 py-1 rounded-md">{fabric.community.province}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-[20px] overflow-hidden shadow-sm border border-brand-100">
      <div className="bg-brand-100 aspect-[3/4]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-brand-100 rounded-md w-4/5" />
        <div className="h-3 bg-brand-50 rounded-md w-1/2" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 bg-brand-50 rounded-md" />
          <div className="h-6 w-20 bg-brand-50 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LibraryPage() {
  const [fabrics, setFabrics] = useState<FabricPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedTechnique, setSelectedTechnique] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fabricsApi.list({
        region: selectedRegion || undefined,
        weave_technique: selectedTechnique || undefined,
        limit: 60,
      });
      setFabrics(data);
    } catch {
      console.error("Failed to load library");
    } finally {
      setLoading(false);
    }
  }, [selectedRegion, selectedTechnique]);

  useEffect(() => { load(); }, [load]);

  const filtered = searchQuery
    ? fabrics.filter(
        (f) =>
          f.name_th.includes(searchQuery) ||
          f.name_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.weave_technique?.includes(searchQuery) ||
          f.community?.province?.includes(searchQuery),
      )
    : fabrics;

  const activeRegion = REGIONS.find((r) => r.value === selectedRegion);

  return (
    <div className="min-h-screen bg-brand-900 pt-[80px]">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gold-400 mb-4">
            Digital Heritage Archive
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white thai-serif leading-tight tracking-tight mb-6">
            ห้องสมุด<br />ลายผ้าไทย
          </h1>
          <p className="text-brand-200 text-base md:text-lg leading-relaxed mb-10">
            ลวดลายผ้าทอมือจากทุกภูมิภาค พร้อมประวัติ ความหมาย และภูมิปัญญาช่างทอ 
            ที่ถูกรวบรวมและจัดเก็บไว้ในรูปแบบดิจิทัลบนแพลตฟอร์มสานไทย
          </p>
          
          <div className="flex items-center gap-8 md:gap-12 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 w-fit">
            {[
              { val: loading ? "—" : String(fabrics.length), label: "ลายผ้า" },
              { val: String(TECHNIQUES.length), label: "เทคนิค" },
              { val: "4", label: "ภูมิภาค" },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-gold-400 thai-serif mb-1">{val}</span>
                <span className="text-xs text-white/50 uppercase tracking-widest font-bold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content Container ───────────────────────────────── */}
      <div className="bg-[#FAF6ED] min-h-screen rounded-t-[40px] pt-8 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        
        {/* ── Filter Bar ──────────────────────────────────────────── */}
        <div className="sticky top-[80px] z-30 bg-[#FAF6ED]/95 backdrop-blur-md border-b border-brand-200/50 shadow-sm">
          {/* Region tabs */}
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8 flex gap-2 overflow-x-auto scrollbar-hide py-3">
            {REGIONS.map((r) => {
              const active = selectedRegion === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => setSelectedRegion(r.value)}
                  className={`relative flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wide transition-all rounded-full whitespace-nowrap ${
                    active 
                      ? "bg-brand-900 text-white shadow-md" 
                      : "bg-white text-brand-900/60 hover:bg-brand-100 hover:text-brand-900 border border-brand-200"
                  }`}
                >
                  <r.Icon size={14} />
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Technique + Search */}
          <div className="border-t border-brand-200/50">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-3 flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-bold text-brand-900/50 tracking-widest uppercase mr-2">เทคนิค:</span>
              <div className="flex flex-wrap gap-2 flex-1">
                {TECHNIQUES.map((t) => {
                  const active = selectedTechnique === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedTechnique(active ? "" : t)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                        active
                          ? "bg-gold-400 text-brand-950 shadow-sm"
                          : "bg-white border border-brand-200 text-brand-900/70 hover:border-gold-400 hover:text-brand-900"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
                {selectedTechnique && (
                  <button
                    onClick={() => setSelectedTechnique("")}
                    className="text-[10px] text-red-500 hover:text-red-700 flex items-center gap-1 font-bold bg-red-50 px-3 rounded-lg"
                  >
                    <X size={12} /> ล้าง
                  </button>
                )}
              </div>
              
              <div className="relative w-full md:w-64 mt-2 md:mt-0">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-900/40" />
                <input
                  type="text"
                  placeholder="ค้นหาลาย, จังหวัด..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 text-xs font-medium rounded-xl border border-brand-200 bg-white placeholder:text-brand-900/40 text-brand-900 focus:outline-none focus:border-brand-900 focus:ring-1 focus:ring-brand-900 shadow-inner"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-900/40 hover:text-brand-900">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Grid ────────────────────────────────────────────────── */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-brand-900 thai-serif">
              {activeRegion?.label ? `ลายผ้า${activeRegion.label}` : 'ลายผ้าทั้งหมด'}
            </h2>
            <p className="text-[10px] font-bold text-brand-900/50 tracking-widest uppercase">
              {loading ? "กำลังโหลด..." : `พบ ${filtered.length} ลาย`}
              {selectedTechnique && ` · ${selectedTechnique}`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-brand-200 border-dashed">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-brand-900/50 text-sm font-bold tracking-widest uppercase">ไม่พบข้อมูลที่ตรงกัน</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((fabric) => (
                <PatternCard key={fabric.id} fabric={fabric} />
              ))}
            </div>
          )}
        </div>

        {/* ── Technique Guide ─────────────────────────────────────── */}
        <div className="bg-brand-900 mt-20 border-t border-brand-800">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-gold-400 mb-3">Knowledge Base</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white thai-serif">
                เรียนรู้เทคนิคการทอผ้าไทย
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TECHNIQUES.map((t) => {
                const detail = TECHNIQUE_DETAIL[t];
                return (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedTechnique(t);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group bg-brand-800/50 hover:bg-brand-800 border border-white/10 p-8 rounded-[24px] text-left transition-all duration-300 hover:-translate-y-1 shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-xl font-bold text-white thai-serif group-hover:text-gold-400 transition-colors">
                        {t}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold-400 transition-colors">
                        <ArrowRight size={14} className="text-white/50 group-hover:text-brand-900 transition-colors" />
                      </div>
                    </div>
                    <p className="text-sm text-brand-200 leading-relaxed mb-6">
                      {detail?.desc}
                    </p>
                    {detail?.origin && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-[10px] font-bold text-gold-400/80 tracking-widest uppercase">
                        {detail.origin}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
