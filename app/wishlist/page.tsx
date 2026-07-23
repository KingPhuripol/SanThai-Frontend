"use client";

import Link from "next/link";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function WishlistPage() {
  const { locale } = useLanguage();

  return (
    <div className="min-h-screen bg-brand-50 thai-diamond-bg px-4 pt-28 pb-16 sm:px-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-amber-200/70 bg-white p-6 shadow-xl sm:p-10">
        <div className="flex items-center gap-3 border-b border-amber-100 pb-6">
          <Link
            href="/marketplace"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-900 transition-colors hover:bg-brand-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-brand-950 thai-serif">
              {locale === "en" ? "My Wishlist" : "รายการที่ถูกใจ"}
            </h1>
            <p className="text-xs text-brand-900/60">
              {locale === "en" ? "Saved Thai textiles and artisanal products" : "สินค้าและผ้าไทยที่คุณบันทึกไว้"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-gold-600 ring-8 ring-amber-50/50">
            <Heart size={32} />
          </div>
          <h2 className="text-lg font-bold text-brand-900">
            {locale === "en" ? "Your wishlist is empty" : "ยังไม่มีรายการที่ถูกใจ"}
          </h2>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-brand-900/60">
            {locale === "en"
              ? "Browse our marketplace and tap the heart icon on any fabric to save it for later."
              : "สำรวจตลาดผ้าไทยของเรา แล้วกดไอคอนหัวใจบนสินค้าที่คุณสนใจเพื่อบันทึกไว้ดูภายหลัง"}
          </p>

          <Link
            href="/marketplace"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-900 px-6 py-3 text-xs font-bold text-white shadow-md transition-colors hover:bg-brand-800"
          >
            <ShoppingBag size={16} />
            {locale === "en" ? "Explore Marketplace" : "เลือกชมสินค้าในตลาด"}
          </Link>
        </div>
      </div>
    </div>
  );
}
