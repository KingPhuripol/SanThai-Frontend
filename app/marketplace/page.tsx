"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, X } from "lucide-react";
import { productsApi, searchApi } from "@/lib/api";
import FabricCard from "@/components/FabricCard";
import type { Product, SearchResult } from "@/lib/types";

const REGIONS = ["ภาคเหนือ", "ภาคอีสาน", "ภาคกลาง", "ภาคใต้"];
const TECHNIQUES = ["มัดหมี", "ขิด", "จก", "ยกดอก", "ทอมือ"];
const PRICE_RANGES = [
  { label: "ทั้งหมด", max: undefined },
  { label: "ไม่เกิน ฿3,000", max: 3000 },
  { label: "ไม่เกิน ฿6,000", max: 6000 },
  { label: "ไม่เกิน ฿10,000", max: 10000 },
];

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState("");
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<
    number | undefined
  >();
  const [showFilters, setShowFilters] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productsApi.list({
        weave_technique: selectedTechnique || undefined,
        max_price_thb: selectedMaxPrice,
        limit: 24,
      });
      setProducts(data);
      setSearchResults(null);
    } catch {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [selectedTechnique, selectedMaxPrice]);

  useEffect(() => {
    if (!searchQuery) {
      loadProducts();
    }
  }, [loadProducts, searchQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }
    setSearching(true);
    try {
      const res = await searchApi.search(searchQuery.trim());
      setSearchResults(res.results);
    } catch {
      console.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    loadProducts();
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Page header — Thai themed */}
      <div className="bg-brand-900 thai-diamond-bg thai-ornament-stripe relative overflow-hidden py-14 px-4 text-white text-center">
        {/* Decorative diamond — top right */}
        <div
          className="absolute top-0 right-0 opacity-[0.08] pointer-events-none"
          aria-hidden
        >
          <svg viewBox="0 0 120 120" className="w-32 h-32">
            <polygon
              points="60,5 115,60 60,115 5,60"
              fill="none"
              stroke="#d4af37"
              strokeWidth="2"
            />
            <polygon
              points="60,25 95,60 60,95 25,60"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.5"
            />
            <polygon
              points="60,45 75,60 60,75 45,60"
              fill="#d4af37"
              fillOpacity="0.5"
            />
          </svg>
        </div>
        {/* Decorative diamond — bottom left */}
        <div
          className="absolute bottom-0 left-0 opacity-[0.06] pointer-events-none"
          aria-hidden
        >
          <svg viewBox="0 0 80 80" className="w-20 h-20">
            <polygon
              points="40,3 77,40 40,77 3,40"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.5"
            />
            <polygon
              points="40,18 62,40 40,62 18,40"
              fill="#d4af37"
              fillOpacity="0.4"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="h-px w-10"
              style={{
                background: "linear-gradient(to right, transparent, #d4af37)",
              }}
            />
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <polygon
                points="9,1 17,9 9,17 1,9"
                fill="none"
                stroke="#d4af37"
                strokeWidth="1.2"
              />
              <polygon
                points="9,5 13,9 9,13 5,9"
                fill="#d4af37"
                fillOpacity="0.5"
              />
            </svg>
            <div
              className="h-px w-10"
              style={{
                background: "linear-gradient(to left, transparent, #d4af37)",
              }}
            />
          </div>
          <h1 className="text-3xl font-bold mb-2 thai-serif">ตลาดผ้าไทย</h1>
          <p className="text-amber-200/80 text-sm max-w-lg mx-auto">
            ลายผ้าจากช่างทอทั่วไทย ทุกชิ้นมี Digital ID และ Provenance
            ยืนยันความแท้
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-6 max-w-xl mx-auto">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาด้วย AI เช่น 'ลายสำหรับงานแต่ง' หรือ 'ผ้าความหมายเรื่องความรัก'"
                className="w-full pl-11 pr-20 py-3.5 rounded-full bg-white text-brand-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 placeholder-brand-300"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-16 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="submit"
                disabled={searching}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold-500 hover:bg-gold-400 text-brand-950 text-sm font-bold px-4 py-1.5 rounded-full transition-colors disabled:opacity-60"
              >
                {searching ? "…" : "ค้นหา"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0 flex items-center gap-1.5 text-sm px-3 py-1.5 border border-amber-200 rounded-full text-brand-700 hover:bg-amber-50"
          >
            <Filter size={14} />
            ตัวกรอง
          </button>

          {TECHNIQUES.map((t) => (
            <button
              key={t}
              onClick={() =>
                setSelectedTechnique(selectedTechnique === t ? "" : t)
              }
              className={`shrink-0 text-sm px-3 py-1.5 rounded-full border transition-colors ${
                selectedTechnique === t
                  ? "bg-brand-900 text-white border-brand-900"
                  : "border-amber-200 text-brand-600 hover:bg-amber-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Price filter */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white rounded-2xl border border-amber-100 shadow-sm">
            <p className="text-sm font-semibold text-brand-700 mb-3">
              ช่วงราคา
            </p>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((pr) => (
                <button
                  key={pr.label}
                  onClick={() => setSelectedMaxPrice(pr.max)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    selectedMaxPrice === pr.max
                      ? "bg-gold-500 text-brand-950 border-gold-500 font-medium"
                      : "border-amber-200 text-brand-600 hover:bg-amber-50"
                  }`}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-brand-500">
            {searchResults !== null
              ? `พบ ${searchResults.length} ผลลัพธ์ สำหรับ "${searchQuery}"`
              : loading
                ? "กำลังโหลด…"
                : `${products.length} รายการ`}
          </p>
        </div>

        {/* Grid */}
        {loading && !searchResults ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-80 animate-pulse border border-amber-50"
              />
            ))}
          </div>
        ) : searchResults !== null ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {searchResults.map((r) => (
              <a
                key={r.fabric_id}
                href={
                  r.product_id
                    ? `/marketplace/${r.product_id}`
                    : `/fabric/${r.fabric_id}`
                }
                className="group block bg-white rounded-2xl overflow-hidden border border-amber-100 hover:border-gold-400 hover:shadow-lg transition-all"
              >
                <div className="relative h-48 bg-stone-100">
                  {r.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.image_url}
                      alt={r.name_th}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute bottom-2 right-2 bg-gold-500/90 text-brand-950 text-xs font-bold px-2 py-0.5 rounded-full">
                    {r.relevance_score.toFixed(0)}% ตรงกัน
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-brand-900 text-sm">
                    {r.name_th}
                  </h3>
                  <p className="text-xs text-brand-500 mt-0.5">
                    {r.province} · {r.artisan_name}
                  </p>
                  {r.cultural_meaning_th && (
                    <p className="text-xs text-brand-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {r.cultural_meaning_th}
                    </p>
                  )}
                  {r.price_thb && (
                    <p className="mt-2 font-bold text-brand-900">
                      ฿{r.price_thb.toLocaleString()}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <FabricCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && searchResults === null && (
          <div className="text-center py-20 text-brand-400">
            <p className="text-4xl mb-3">🧵</p>
            <p>ยังไม่มีสินค้า — ลองรัน seed script ก่อน</p>
          </div>
        )}
      </div>
    </div>
  );
}
