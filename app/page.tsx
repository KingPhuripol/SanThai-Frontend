"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { productsApi } from "@/lib/api";
import type { Product } from "@/lib/types";
import { useLanguage } from "@/components/LanguageProvider";

function getProductImage(product: Product) {
  return product.images?.[0] || product.fabric?.image_url || null;
}

export default function HomePage() {
  const { locale, pick } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    productsApi.list({ limit: 24 }).then((items) => {
      const usedImages = new Set<string>();
      setProducts(items.filter((product) => {
        const imageUrl = getProductImage(product);
        if (!imageUrl || usedImages.has(imageUrl)) return false;
        usedImages.add(imageUrl);
        return true;
      }).slice(0, 4));
    }).catch(() => setProducts([]));
  }, []);
  const featuredProduct = products[0];
  const featuredImage = featuredProduct ? getProductImage(featuredProduct) : null;

  return (
    <div className="min-h-screen bg-brand-900 selection:bg-brand-300 selection:text-white pb-20 overflow-hidden">
      
      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <section className="relative w-full h-[90vh] min-h-[700px] flex items-center pt-10">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-brand-900/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/80 to-transparent z-10 w-full lg:w-2/3" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/80 via-transparent to-brand-900 z-10" />
          {featuredImage && (
            <Image
              src={featuredImage}
              alt={pick(featuredProduct?.title_th, featuredProduct?.title_en, locale === "en" ? "Thai textile" : "ผ้าไทย")}
              fill
              sizes="100vw"
              className="object-cover object-center opacity-70 scale-105"
              priority
            />
          )}
        </div>

        {/* Content Container */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Typography */}
          <div className="text-white space-y-6 max-w-xl">
            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold thai-serif leading-[1.1] text-gold-400 drop-shadow-xl tracking-tight">
              {locale === "en" ? "Thai Textiles" : "ผ้าไทย"}
              <br />
              <span className="text-white">{locale === "en" ? "Stories of identity" : "เรื่องราวแห่งตัวตน"}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-[1.8] font-light max-w-md">
              {locale === "en" ? "Connect with meaningful beauty" : "เชื่อมโยงคุณสู่ความงดงามที่มีความหมาย"}
              <br />
              {locale === "en" ? "From heritage to your own style" : "จากภูมิปัญญา สู่สไตล์ที่เป็นคุณ"}
            </p>
            <div className="pt-6">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-300 to-gold-500 text-brand-950 font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] group"
              >
                {locale === "en" ? "Find your style" : "ค้นหาตัวตนของคุณ"}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Side: real featured product from the marketplace */}
          <div className="hidden lg:block relative justify-self-end w-full max-w-[380px]">
            <div className="bg-[#FAF6ED] rounded-[32px] p-10 shadow-2xl relative overflow-hidden text-center border border-white/50">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-bl-[100px]" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-900/5 rounded-tr-[100px]" />
              
              {featuredProduct && featuredImage ? (
                <>
                  <p className="text-xs font-bold tracking-[0.18em] text-gold-600 mb-3">{locale === "en" ? "FEATURED FROM VERIFIED STORES" : "สินค้าแนะนำจากร้านค้า"}</p>
                  <h2 className="text-[26px] font-bold thai-serif text-brand-900 mb-2 leading-tight line-clamp-2">{pick(featuredProduct.title_th, featuredProduct.title_en)}</h2>
                  <p className="text-sm text-brand-900/60 mb-6">{featuredProduct.community?.province ? (locale === "en" ? featuredProduct.community.province_en || featuredProduct.community.province : `จ.${featuredProduct.community.province}`) : "SanThai Marketplace"}</p>
                  <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-[6px] border-white shadow-xl">
                    <Image src={featuredImage} alt={pick(featuredProduct.title_th, featuredProduct.title_en)} fill sizes="300px" className="object-cover" />
                  </div>
                  <p className="text-xl thai-serif font-bold text-brand-900 mb-6">{locale === "en" ? `$${featuredProduct.price_usd.toLocaleString("en-US")} USD` : `฿${featuredProduct.price_thb.toLocaleString("th-TH")}`}</p>
                  <Link href={`/marketplace/${featuredProduct.id}`} className="flex items-center justify-between w-full px-6 py-4 bg-brand-900 text-white rounded-full hover:bg-brand-800 transition-colors shadow-lg">
                    <span className="font-medium text-sm w-full text-center pl-4">{locale === "en" ? "View this product" : "ดูสินค้าชิ้นนี้"}</span>
                    <ArrowRight size={18} className="text-gold-400" />
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-[28px] font-bold thai-serif text-brand-900 mb-3 leading-tight">{locale === "en" ? "Community fabric marketplace" : "ตลาดผ้าจากชุมชน"}</h2>
                  <p className="text-sm text-brand-900/60 mb-8 leading-relaxed">{locale === "en" ? "New products appear here as soon as verified stores publish them." : "สินค้าใหม่จะปรากฏที่นี่เมื่อร้านค้าเผยแพร่พร้อมรูปภาพ"}</p>
                  <Link href="/marketplace" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-brand-900 text-white rounded-full hover:bg-brand-800 transition-colors shadow-lg">
                    {locale === "en" ? "Browse marketplace" : "เลือกชมตลาดผ้า"} <ArrowRight size={18} className="text-gold-400" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES BAR ────────────────────────────────────────── */}
      <section className="relative z-30 max-w-[1400px] mx-auto px-6 -mt-8">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 lg:gap-2 py-6 border-b border-white/10">
          {[
            { icon: <Sparkles className="text-gold-400" size={24} strokeWidth={1.5} />, title: locale === "en" ? "Thai heritage" : "ภูมิปัญญาไทย", subtitle: locale === "en" ? "Passed down through generations" : "สืบสานจากรุ่นสู่รุ่น" },
            { icon: <div className="w-6 h-6 rounded-sm border border-gold-400 grid grid-cols-2 gap-[2px] p-[2px]"><div className="bg-gold-400/50 rounded-[1px]" /><div className="bg-gold-400 rounded-[1px]" /><div className="bg-gold-400 rounded-[1px]" /><div className="bg-gold-400/50 rounded-[1px]" /></div>, title: locale === "en" ? "Living craft" : "งานศิลป์ที่มีชีวิต", subtitle: locale === "en" ? "Woven with care and meaning" : "ทอด้วยใจ ใส่ด้วยความหมาย" },
            { icon: <div className="text-gold-400 flex"><div className="w-3 h-5 border-l-2 border-b-2 border-gold-400 rounded-bl-full" /><div className="w-3 h-5 border-r-2 border-t-2 border-gold-400 rounded-tr-full -ml-[2px] mt-1" /></div>, title: locale === "en" ? "Planet-friendly" : "เป็นมิตรต่อโลก", subtitle: locale === "en" ? "Better for you and the world" : "เลือกสิ่งที่ดีต่อคุณและโลก" },
            { icon: <div className="flex -space-x-1"><div className="w-4 h-4 rounded-full border border-gold-400 bg-brand-900" /><div className="w-4 h-4 rounded-full border border-gold-400 bg-brand-900" /><div className="w-4 h-4 rounded-full border border-gold-400 bg-brand-900" /></div>, title: locale === "en" ? "Community support" : "สนับสนุนชุมชน", subtitle: locale === "en" ? "Income for local makers" : "สร้างรายได้สู่ท้องถิ่น" },
            { icon: <ShieldCheck className="text-gold-400" size={24} strokeWidth={1.5} />, title: locale === "en" ? "Shop with confidence" : "ปลอดภัย มั่นใจ", subtitle: locale === "en" ? "Every order, protected" : "จากทุกการสั่งซื้อ" },
          ].map((feat, i) => (
            <div key={i} className="flex items-center gap-3">
              {feat.icon}
              <div>
                <h3 className="text-white text-[13px] font-bold">{feat.title}</h3>
                <p className="text-white/50 text-[10px]">{feat.subtitle}</p>
              </div>
              {i < 4 && <div className="hidden lg:block w-px h-6 bg-white/10 ml-8" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── FABRIC MARKETPLACE ──────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 mt-12 md:mt-16">
        <div className="bg-brand-50 rounded-[32px] p-6 md:p-10 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-end mb-8">
            <h2 className="text-xl md:text-2xl font-bold thai-serif text-brand-900 flex items-center gap-3">
              <span className="text-gold-400 text-2xl">❁</span>
              {locale === "en" ? "Marketplace: Thai textiles from communities across the country" : "ตลาดผ้า : รวมผ้าไทยทุกชนิดจากทั่วประเทศ"}
            </h2>
            <Link href="/marketplace" className="inline-flex items-center gap-2 rounded-full bg-brand-900 px-5 py-3 text-sm font-bold text-white hover:bg-brand-800 transition-colors">
              {locale === "en" ? "View all fabrics" : "ดูตลาดผ้าทั้งหมด"} <ArrowRight size={16} className="text-gold-400" />
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {products.map((product) => {
                const imageUrl = getProductImage(product)!;
                return (
                  <Link key={product.id} href={`/marketplace/${product.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-200/50 hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden bg-brand-100">
                      <Image src={imageUrl} alt={pick(product.title_th, product.title_en)} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-900 shadow-sm"><Heart size={16} /></span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold thai-serif text-brand-900 line-clamp-2 min-h-12">{pick(product.title_th, product.title_en)}</h3>
                      <p className="text-xs text-brand-900/55 mt-1.5">{product.community?.province ? (locale === "en" ? product.community.province_en || product.community.province : `จ.${product.community.province}`) : "SanThai Store"}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-brand-900 thai-serif">{locale === "en" ? `$${product.price_usd.toLocaleString("en-US")} USD` : `฿${product.price_thb.toLocaleString("th-TH")}`}</span>
                        <span className="text-xs font-semibold text-gold-600 group-hover:translate-x-1 transition-transform">{locale === "en" ? "View product →" : "ดูสินค้า →"}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-300 bg-white/70 px-6 py-12 text-center text-brand-900/65">
              <p className="font-bold text-brand-900">{locale === "en" ? "No published products with images yet" : "ยังไม่มีสินค้าที่เผยแพร่พร้อมรูปภาพ"}</p>
              <p className="mt-1 text-sm">{locale === "en" ? "Products will appear automatically when stores publish them." : "เมื่อร้านค้าเพิ่มสินค้าและรูปจาก Supabase สินค้าจะปรากฏในส่วนนี้อัตโนมัติ"}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER FEATURES ─────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 mt-12">
        <div className="flex flex-wrap justify-between items-center py-6 border-t border-white/10 text-white/80 gap-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-gold-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-white">{locale === "en" ? "Thailand-wide delivery" : "จัดส่งทั่วไทย"}</p>
              <p className="text-[10px] text-white/50">{locale === "en" ? "Fast and secure" : "รวดเร็ว ปลอดภัย"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-gold-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-white">{locale === "en" ? "Fabric care" : "การดูแลรักษาผ้า"}</p>
              <p className="text-[10px] text-white/50">{locale === "en" ? "Product-specific guidance" : "คำแนะนำเฉพาะสินค้า"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-gold-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-white">{locale === "en" ? "Secure payment" : "ชำระเงินปลอดภัย"}</p>
              <p className="text-[10px] text-white/50">{locale === "en" ? "Multiple options" : "หลากหลายช่องทาง"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-gold-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-white">{locale === "en" ? "Customer support" : "บริการลูกค้า"}</p>
              <p className="text-[10px] text-white/50">{locale === "en" ? "Here to help" : "พร้อมดูแลคุณ"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <div className="w-6 h-6 rounded-full bg-[#00B900] flex items-center justify-center text-white font-bold text-[8px]">
              LINE
            </div>
            <div>
              <p className="text-xs font-bold text-white">@santhai</p>
              <p className="text-[9px] text-white/50">{locale === "en" ? "Connect with us" : "เชื่อมต่อกับเรา"}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
