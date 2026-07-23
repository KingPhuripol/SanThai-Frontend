"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  ShoppingBag,
  QrCode,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Star,
  Maximize2,
  Package,
  Award
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { productsApi } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { ReservationCountdown } from "@/components/ReservationCountdown";
import type { Product } from "@/lib/types";
import { trackEvent } from "@/components/TrafficTracker";
import { useLanguage } from "@/components/LanguageProvider";

export default function ProductDetailPage() {
  const { locale, pick, t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [ordering, setOrdering] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [email, setEmail] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [error, setError] = useState("");
  const [promptpayPayload, setPromptpayPayload] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [reservedUntil, setReservedUntil] = useState<string | null>(null);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("story");
  
  const isLoggedIn = !!getSession();

  useEffect(() => {
    productsApi
      .get(Number(id))
      .then(setProduct)
      .catch(() => setError(locale === "en" ? "Product not found" : "ไม่พบสินค้า"))
      .finally(() => setLoading(false));

    const s = getSession();
    if (s) {
      setBuyerName(s.full_name || "");
      setEmail(s.email || "");
    }
  }, [id]);

  useEffect(() => {
    if (product) trackEvent("product_view", { product_id: product.id });
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    try {
      const stored = localStorage.getItem("santhai_cart");
      let cartItems = [];
      if (stored) {
        cartItems = JSON.parse(stored);
      }
      const existing = cartItems.find((item: any) => item.id === product.id);
      if (existing) {
        existing.qty += qty;
      } else {
        cartItems.push({
          id: product.id,
          title_th: product.title_th,
          price_thb: product.price_thb,
          shipping_cost_thb: product.shipping_cost_thb || 0,
          free_shipping: Boolean(product.free_shipping),
          image_url: product.images?.[0] ?? product.fabric?.image_url ?? "",
          qty: qty,
        });
      }
      localStorage.setItem("santhai_cart", JSON.stringify(cartItems));
      trackEvent("add_to_cart", { product_id: product.id, metadata: { quantity: qty } });
      
      // Dispatch event to update navbar cart count
      window.dispatchEvent(new Event("santhai-cart-changed"));
      
      alert(locale === "en" ? "Added to cart." : "เพิ่มสินค้าลงในตะกร้าเรียบร้อยแล้ว!");
    } catch (e) {
      console.error("Failed to add to cart:", e);
    }
  };

  const handleOrder = async () => {
    if (!isLoggedIn) {
      router.push(`/login?next=/marketplace/${id}`);
      return;
    }
    if (!email || !buyerName) {
      setError(locale === "en" ? "Please enter your name and email." : "กรุณากรอกชื่อและอีเมล");
      return;
    }
    setOrdering(true);
    setError("");
    trackEvent("checkout_started", { product_id: Number(id), metadata: { quantity: qty } });
    try {
      const res = await productsApi.createOrder({
        product_id: Number(id),
        buyer_email: email,
        buyer_name: buyerName,
        quantity: qty,
      });
      setPromptpayPayload(res.promptpay_payload);
      setOrderId(res.id);
      setReservedUntil(res.reserved_until || null);
      setOrderDone(true);
      trackEvent("checkout_created", { product_id: Number(id), metadata: { order_id: res.id, total_thb: res.total_thb } });
    } catch {
      setError(locale === "en" ? "Unable to place the order. Please try again." : "ไม่สามารถสั่งซื้อได้ กรุณาลองใหม่");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-900 flex flex-col items-center justify-center text-white pt-20">
        <p className="text-5xl mb-4">🧵</p>
        <p className="text-xl">{locale === "en" ? "The product you requested was not found." : "ไม่พบสินค้าที่คุณค้นหา"}</p>
        <Link href="/marketplace" className="mt-6 px-6 py-3 bg-gold-400 text-brand-900 rounded-full font-bold hover:bg-gold-300 transition-colors">
          {locale === "en" ? "Back to marketplace" : "กลับไปตลาดผ้า"}
        </Link>
      </div>
    );
  }

  // Mocking extra images for the gallery if backend doesn't provide enough
  const productImages = product.images?.length ? product.images : [
    product.fabric?.image_url || "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_image_01.jpg",
    "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_amnat_charoen_01.jpg",
    "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_01.jpg",
    "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_image_02.jpg",
    "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_amnat_charoen_046.jpg",
  ];

  const mainImage = productImages[activeImageIndex];

  return (
    <div className="min-h-screen bg-brand-900 pb-20 pt-[80px]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/50 mb-6 font-medium">
          <Link href="/" className="hover:text-gold-300 transition-colors flex items-center gap-1"><ChevronLeft size={14}/> {t("home")}</Link>
          <span><ChevronRight size={14}/></span>
          <Link href="/marketplace" className="hover:text-gold-300 transition-colors">{t("marketplace")}</Link>
          <span><ChevronRight size={14}/></span>
          <Link href="/marketplace" className="hover:text-gold-300 transition-colors">ผ้าไหมมัดหมี่</Link>
          <span><ChevronRight size={14}/></span>
          <span className="text-white/90">{pick(product.title_th, product.title_en)}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          
          {/* Main Product Area */}
          <div className="bg-[#FAF6ED] rounded-[24px] p-6 lg:p-8 shadow-2xl">
            {orderDone ? (
              // Order Success State
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6 border-4 border-white shadow-lg">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-bold thai-serif text-brand-900 mb-2">สั่งซื้อสำเร็จ!</h2>
                <p className="text-brand-900/60 mb-8">กรุณาสแกน QR Code เพื่อชำระเงิน จำนวน ฿{(product.price_thb * qty).toLocaleString()}</p>
                
                {promptpayPayload && (
                  <div className="bg-white p-6 rounded-3xl border border-brand-200/50 shadow-sm inline-block mb-8 relative">
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gold-400 rounded-full flex items-center justify-center shadow-md">
                      <QrCode size={20} className="text-brand-950" />
                    </div>
                    <QRCodeSVG value={promptpayPayload} size={200} />
                  </div>
                )}

                {reservedUntil && (
                  <div className="w-full max-w-md mb-8">
                    <ReservationCountdown reservedUntil={reservedUntil} />
                  </div>
                )}

                {/* Slip Upload */}
                <div className="w-full max-w-md bg-white p-6 rounded-2xl border border-brand-200/50 text-left shadow-sm">
                  <p className="text-sm font-bold text-brand-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" /> แนบสลิปโอนเงิน
                  </p>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-brand-200 rounded-xl cursor-pointer hover:bg-brand-50 hover:border-gold-300 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-3 text-brand-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                      <p className="mb-2 text-sm text-brand-500"><span className="font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง</p>
                      <p className="text-xs text-brand-400">PNG, JPG (Max. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        if (!e.target.files?.[0]) return;
                        try {
                          const res = await productsApi.uploadSlip(orderId!, e.target.files[0]);
                          if (res.status === "success") {
                            alert("อัปโหลดสลิปสำเร็จ! ร้านค้าจะจัดส่งสินค้าให้คุณเร็วๆ นี้");
                            window.location.href = "/marketplace";
                          }
                        } catch (err) {
                          alert("เกิดข้อผิดพลาดในการอัปโหลดสลิป");
                        }
                      }}
                    />
                  </label>
                </div>

                <Link href="/marketplace" className="mt-8 text-brand-900/50 hover:text-brand-900 transition-colors underline text-sm">
                  หรือกลับไปช้อปต่อ (ยังไม่แนบสลิป)
                </Link>
              </div>
            ) : (
              // Normal Product Layout
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Image Gallery (Left) */}
                <div className="flex gap-4 md:w-1/2">
                  {/* Thumbnails */}
                  <div className="hidden sm:flex flex-col gap-3 w-20">
                    {productImages.map((img, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveImageIndex(i)}
                        className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${activeImageIndex === i ? 'border-brand-900 shadow-md' : 'border-transparent hover:border-brand-200'}`}
                      >
                        <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                  
                  {/* Main Image */}
                  <div className="relative flex-1 aspect-[3/4] md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden bg-brand-100 shadow-inner group">
                    <Image src={mainImage} alt={product.title_th} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
                    
                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-brand-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-2 rounded-xl flex flex-col items-center shadow-lg border border-white/20">
                      <span className="text-gold-400 mb-1">❁</span>
                      <span>งานทอมือ</span>
                      <span>100%</span>
                    </div>

                    {/* Nav Arrows */}
                    <button 
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-brand-900 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 shadow-md"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => setActiveImageIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-brand-900 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 shadow-md"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Expand icon */}
                    <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-brand-900 hover:bg-white transition-colors shadow-md">
                      <Maximize2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Product Info (Right) */}
                <div className="flex-1 flex flex-col">
                  
                  <div className="flex justify-between items-start mb-2">
                    <h1 className="text-[28px] md:text-[34px] font-bold text-brand-900 thai-serif leading-tight">
                      {pick(product.title_th, product.title_en)}
                    </h1>
                    <div className="flex gap-2">
                      <button className="w-10 h-10 rounded-full border border-brand-200 flex items-center justify-center text-brand-900/60 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors">
                        <Heart size={20} strokeWidth={1.5} />
                      </button>
                      <button className="w-10 h-10 rounded-full border border-brand-200 flex items-center justify-center text-brand-900/60 hover:text-brand-900 hover:border-brand-900 hover:bg-brand-50 transition-colors">
                        <Share2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-brand-900/60 mb-4">{locale === "en" ? "Thai textile from a verified store" : (product.title_en || "Mudmee Silk with Ancient Motif")}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-brand-900/60 mb-6">
                    <span>{locale === "en" ? "Product code" : "รหัสสินค้า"} {product.product_code || `ST-PRD-${(product.id).toString().padStart(6, '0')}`}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-brand-900">4.9</span>
                      <div className="flex text-gold-400">
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                      </div>
                      <span className="underline ml-1">(128 รีวิว)</span>
                    </div>
                  </div>

                  <div className="flex items-end gap-3 border-b border-brand-200/50 pb-6 mb-6">
                    <span className="text-[40px] font-extrabold text-brand-900 thai-serif leading-none tracking-tight">฿{product.price_thb.toLocaleString()}</span>
                    <span className="text-brand-900/50 mb-2">/ {product.sale_unit === "meter" ? (locale === "en" ? "metre" : "เมตร") : product.sale_unit === "roll" ? (locale === "en" ? "roll" : "ม้วน") : product.sale_unit === "set" ? (locale === "en" ? "set" : "ชุด") : (locale === "en" ? "piece" : "ผืน")}</span>
                    <span className={`ml-auto px-4 py-1.5 rounded-full text-xs font-bold ${product.stock > 0 ? "bg-[#E6F4EA] text-[#137333]" : "bg-red-50 text-red-600"}`}>
                      {product.stock > 0 ? (locale === "en" ? "In stock" : "มีสินค้า") : (locale === "en" ? "Sold out" : "สินค้าหมด")}
                    </span>
                  </div>

                  <p className="text-[15px] text-brand-900/80 leading-[1.8] mb-6">
                    {pick(product.description_th, product.description_en, locale === "en" ? "A Thai textile from a verified SanThai store." : "ผ้าไทยจากร้านค้าที่ผ่านการยืนยันโดย SanThai")}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    {[
                      { icon: "🌿", t: product.title_th?.includes("ฝ้าย") || product.description_th?.includes("ฝ้าย") ? (locale === "en" ? "100% Organic Cotton" : "ฝ้ายธรรมชาติ 100%") : (locale === "en" ? "100% Pure Silk" : "ไหมแท้ 100%") },
                      { icon: "🍃", t: locale === "en" ? "Natural Dye" : "ย้อมสีธรรมชาติ" },
                      { icon: "🧶", t: locale === "en" ? "Handwoven" : "ทอมือทุกผืน" },
                      { icon: "✨", t: locale === "en" ? "One of a kind" : "ผืนเดียวในโลก" }
                    ].map((b, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-brand-900/70">
                        <span className="text-base">{b.icon}</span> {b.t}
                      </div>
                    ))}
                  </div>

                  {/* SanThai Passport */}
                  {product.passport?.code && (
                    <Link href={`/passport/${product.passport.code}`} className="mb-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-brand-200 bg-white text-sm text-brand-900 font-medium hover:border-brand-900 transition-colors shadow-sm w-fit">
                      <QrCode size={16} className="text-brand-900/50" /> {locale === "en" ? "View SanThai Passport" : "ดู SanThai Passport · ตรวจสอบข้อมูลสินค้า"}
                    </Link>
                  )}

                  {/* Form */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-bold text-brand-900 mb-2">{locale === "en" ? "Dimensions" : "ขนาด / ความยาว"}</p>
                      <div className="rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm text-brand-900">{product.width_cm ? (locale === "en" ? `Width ${product.width_cm} cm` : `กว้าง ${product.width_cm} ซม.`) : (locale === "en" ? "Store-specified dimensions" : "ขนาดตามที่ร้านระบุ")}{product.length_cm ? (locale === "en" ? ` · Length ${product.length_cm} cm` : ` · ยาว ${product.length_cm} ซม.`) : ""}</div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-900 mb-2">{locale === "en" ? "Quantity" : "จำนวน"}</p>
                      <div className="flex items-center border border-brand-200 bg-white rounded-xl h-[46px] overflow-hidden">
                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex-1 text-brand-900/50 hover:bg-brand-50 hover:text-brand-900 transition-colors h-full flex items-center justify-center font-bold">
                          −
                        </button>
                        <span className="w-12 text-center text-sm font-semibold text-brand-900">{qty}</span>
                        <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="flex-1 text-brand-900/50 hover:bg-brand-50 hover:text-brand-900 transition-colors h-full flex items-center justify-center font-bold">
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Inline buyer details for quick checkout if logged in */}
                  {!isLoggedIn && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input type="text" placeholder="ชื่อผู้ซื้อ" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full px-4 py-3 text-sm rounded-xl border border-brand-200 focus:outline-none focus:border-brand-900 focus:ring-1 focus:ring-brand-900 bg-white" />
                      <input type="email" placeholder="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 text-sm rounded-xl border border-brand-200 focus:outline-none focus:border-brand-900 focus:ring-1 focus:ring-brand-900 bg-white" />
                    </div>
                  )}

                  {error && <p className="text-xs text-red-500 mb-4 bg-red-50 p-2 rounded-lg">{error}</p>}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <button 
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="flex items-center justify-center gap-2 border-2 border-brand-900 text-brand-900 font-bold py-3.5 rounded-2xl hover:bg-brand-900 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-brand-900 shadow-sm"
                    >
                      <ShoppingBag size={18} strokeWidth={2.5} />
                      {locale === "en" ? "Add to cart" : "เพิ่มลงตะกร้า"}
                    </button>
                    <button 
                      onClick={handleOrder}
                      disabled={ordering || product.stock === 0}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 text-brand-950 font-bold py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-[0_4px_15px_rgba(212,175,55,0.3)] disabled:opacity-50"
                    >
                      <span className="text-xl leading-none">⚡</span>
                      {ordering ? (locale === "en" ? "Processing…" : "กำลังดำเนินการ...") : (locale === "en" ? "Buy now" : "ซื้อเลย")}
                    </button>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-900/50">
                    <ShieldCheck size={14} className="text-green-600" /> {locale === "en" ? "Verified store · order updates include timestamps" : "ร้านค้ายืนยันแล้ว · สถานะคำสั่งซื้อจะแจ้งพร้อมเวลาในระบบ"}
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Artisan Profile */}
            <div className="bg-[#FAF6ED] rounded-[24px] p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-brand-900" />
              <div className="relative flex justify-center mb-4 mt-8">
                <div className="w-24 h-24 rounded-full border-4 border-[#FAF6ED] overflow-hidden bg-brand-200 relative shadow-lg">
                  <Image src="https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_image_01.jpg" alt="Artisan" fill sizes="96px" className="object-cover" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full border-2 border-[#FAF6ED] flex items-center justify-center text-white">
                    <CheckCircle2 size={12} strokeWidth={3} />
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-brand-900 flex items-center justify-center gap-1.5">
                  {product.artisan?.name || "ร้านค้า SanThai"} {product.artisan?.verified && <CheckCircle2 size={16} className="text-blue-500" fill="currentColor" />}
                </h3>
                <p className="text-sm text-brand-900/50 flex items-center justify-center gap-1 mt-1">
                  <MapPin size={12} className="text-gold-500" /> {product.community?.province ? `จ.${product.community.province}` : (product.artisan?.province ? `จ.${product.artisan.province}` : (locale === "en" ? "Thailand" : "ประเทศไทย"))}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 border-y border-brand-200/50 py-4 mb-6">
                <div className="text-center">
                  <p className="text-sm font-bold text-brand-900 flex items-center justify-center gap-1">4.9 <Star size={12} fill="#d4af37" className="text-gold-400" /></p>
                  <p className="text-[10px] text-brand-900/50">(256 รีวิว)</p>
                </div>
                <div className="text-center border-x border-brand-200/50">
                  <p className="text-sm font-bold text-brand-900">1,258</p>
                  <p className="text-[10px] text-brand-900/50">ยอดขายผืน</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-brand-900">3 ปี</p>
                  <p className="text-[10px] text-brand-900/50">เข้าร่วม</p>
                </div>
              </div>

              <Link href={product.artisan?.id ? `/storefront/${product.artisan.id}` : "/community"} className="flex items-center justify-center w-full py-3 bg-white border border-brand-200 rounded-xl text-sm font-bold text-brand-900 hover:border-brand-900 transition-colors mb-6 shadow-sm">
                ดูหน้าร้านค้า
              </Link>

              <div className="space-y-3">
                <Link 
                  href={product.artisan?.id ? `/storefront/${product.artisan.id}` : "/community"} 
                  className="flex items-center gap-3 text-xs font-medium text-brand-900/80 p-2.5 rounded-xl hover:bg-white transition-all shadow-sm group cursor-pointer border border-transparent hover:border-brand-200"
                >
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  <span>{product.artisan?.verified ? "ร้านค้าได้รับการยืนยัน" : "อยู่ระหว่างตรวจสอบร้านค้า"}</span>
                  <ChevronRight size={14} className="ml-auto opacity-50 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />
                </Link>

                <Link 
                  href={product.passport?.code ? `/passport/${product.passport.code}` : "/fabric-verification"} 
                  className="flex items-center gap-3 text-xs font-medium text-brand-900/80 p-2.5 rounded-xl hover:bg-white transition-all shadow-sm group cursor-pointer border border-transparent hover:border-brand-200"
                >
                  <Award size={16} className="text-gold-500 shrink-0" />
                  <span>{product.passport?.status === "verified" ? "Passport ตรวจสอบโดย SanThai" : "มี SanThai Passport"}</span>
                  <ChevronRight size={14} className="ml-auto opacity-50 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />
                </Link>

                <button 
                  onClick={() => {
                    setActiveTab("story");
                    const el = document.getElementById("bottom-tabs");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full text-left flex items-center gap-3 text-xs font-medium text-brand-900/80 p-2.5 rounded-xl hover:bg-white transition-all shadow-sm group cursor-pointer border border-transparent hover:border-brand-200"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-500 shrink-0"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                  <span>Story จากผู้สร้างสรรค์จริง</span>
                  <ChevronRight size={14} className="ml-auto opacity-50 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />
                </button>

                <button 
                  onClick={() => {
                    setActiveTab("details");
                    const el = document.getElementById("bottom-tabs");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full text-left flex items-center gap-3 text-xs font-medium text-brand-900/80 p-2.5 rounded-xl hover:bg-white transition-all shadow-sm group cursor-pointer border border-transparent hover:border-brand-200"
                >
                  <Package size={16} className="text-brand-500 shrink-0" />
                  <span>จัดส่งปลอดภัย</span>
                  <ChevronRight size={14} className="ml-auto opacity-50 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />
                </button>
              </div>
            </div>

            {/* Related Products */}
            <div className="bg-[#FAF6ED] rounded-[24px] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-brand-900 thai-serif">ผืนผ้าแนะนำสำหรับคุณ</h3>
                <Link href="/marketplace" className="text-[10px] text-brand-900/50 hover:text-brand-900 font-medium">ดูทั้งหมด</Link>
              </div>
              <div className="space-y-4">
                {[
                  { name: "ผ้าไหมมัดหมี่ลายโบราณ", price: "2,750", img: "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_amnat_charoen_01.jpg" },
                  { name: "ผ้าไหมแพรวา", price: "3,250", img: "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_01.jpg" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 group cursor-pointer">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 relative">
                      <Image src={item.img} alt={item.name} fill sizes="80px" className="object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-xs font-bold text-brand-900 line-clamp-2 leading-tight group-hover:text-gold-600 transition-colors">{item.name}</p>
                      <p className="text-sm font-bold text-brand-900 thai-serif mt-1">฿{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>

        {/* Bottom Details Tabs */}
        {!orderDone && (
          <div className="mt-8 bg-[#FAF6ED] rounded-[24px] overflow-hidden shadow-2xl">
            {/* Tab Headers */}
            <div className="flex overflow-x-auto bg-brand-900 text-white scrollbar-hide">
              {[
                { id: "story", label: locale === "en" ? "Fabric story" : "เรื่องราวของผืนผ้า" },
                { id: "details", label: locale === "en" ? "Product details" : "รายละเอียดสินค้า" },
                { id: "care", label: locale === "en" ? "Care instructions" : "การดูแลรักษา" },
                { id: "reviews", label: locale === "en" ? "Customer reviews (128)" : "รีวิวจากลูกค้า (128)" }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-8 py-5 text-sm font-bold transition-colors border-b-4 ${activeTab === tab.id ? "border-gold-400 text-gold-300 bg-brand-800" : "border-transparent text-white/60 hover:text-white hover:bg-brand-800/50"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="p-8 lg:p-12">
              {activeTab === "story" && (
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold text-brand-900 thai-serif mb-6 border-b border-brand-200/50 pb-4">เรื่องราวของผืนผ้า</h3>
                    <p className="text-xl text-brand-900/80 italic mb-6 thai-serif leading-relaxed">
                      {product.title_th?.includes("ดาวล้อมคราม") ? '"ลายดาวล้อมคราม... สัญลักษณ์แห่งภูมิปัญญาและมงคลชีวิต"' : product.title_th?.includes("มัดหมี่") ? '"ผ้ามัดหมี่... สัญลักษณ์แห่งภูมิปัญญาและสายใยผูกพัน"' : '"ลายดอกพิกุล... สัญลักษณ์แห่งความเจริญและความงดงาม"'}
                    </p>
                    <p className="text-sm text-brand-900/70 leading-[1.8] mb-10">
                      {product.fabric?.cultural_meaning_th || (product.title_th?.includes("ดาวล้อมคราม") ? "ลายดาวล้อมครามเป็นลวดลายมงคลสืบทอดจากภูมิปัญญาการทอมือผ้ามัดหมี่ย้อมคราม สะท้อนความพิถีพิถันของการเตรียมเส้นฝ้ายและการหมักสีครามธรรมชาติในท้องถิ่น" : product.description_th || `ลวดลายผ้าโบราณ สืบทอดจากผืนผ้าประจำถิ่น ทอขึ้นใหม่ด้วยภูมิปัญญาและความประณีตของช่างทอพื้นถิ่น ${product.community?.province ? `จ.${product.community.province}` : (product.artisan?.province ? `จ.${product.artisan.province}` : "")}`)}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { icon: "🍃", t: "แรงบันดาลใจ", st: "จากธรรมชาติ" },
                        { icon: "👵", t: "ภูมิปัญญา", st: "ท้องถิ่น" },
                        { icon: "⏳", t: "สืบทอด", st: "มากกว่า 100 ปี" },
                        { icon: "✨", t: "งานศิลป์", st: "ที่ใส่ได้จริง" },
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-brand-200/50 text-center shadow-sm">
                          <span className="text-2xl mb-2">{item.icon}</span>
                          <span className="text-[11px] font-bold text-brand-900">{item.t}</span>
                          <span className="text-[10px] text-brand-900/50">{item.st}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-brand-900 mb-6 flex items-center justify-between">
                      กระบวนการทอผ้า
                      <Link href={product.passport?.code ? `/passport/${product.passport.code}` : `/fabric/${product.fabric_id}`} className="text-xs font-medium text-brand-900/50 bg-white border border-brand-200 px-4 py-2 rounded-full hover:border-brand-900 transition-colors">ดูเบื้องหลังทั้งหมด</Link>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { img: "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_image_01.jpg", t: product.title_th?.includes("ฝ้าย") ? "1. คัดสรรเส้นฝ้าย" : "1. คัดสรรเส้นไหม" },
                        { img: "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_amnat_charoen.jpg", t: "2. ย้อมสีธรรมชาติ" },
                        { img: "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_image_02.jpg", t: "3. มัดหมี่ด้วยมือ" },
                        { img: "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_amnat_charoen_01.jpg", t: "4. ทอด้วยความประณีต" },
                      ].map((step, i) => (
                        <div key={i} className="group cursor-pointer">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-brand-100 mb-2">
                            <Image src={step.img} alt={step.t} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-brand-900/10 group-hover:bg-transparent transition-colors" />
                          </div>
                          <p className="text-[11px] font-bold text-brand-900 group-hover:text-gold-600 transition-colors">{step.t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "details" && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    [locale === "en" ? "Product code" : "รหัสสินค้า", product.product_code || `ST-PRD-${(product.id).toString().padStart(6, '0')}`],
                    [locale === "en" ? "Availability" : "สถานะสินค้า", product.product_type === "made_to_order" ? (locale === "en" ? "Made to order" : "สั่งทำ") : product.product_type === "pre_order" ? (locale === "en" ? "Pre-order" : "พรีออเดอร์") : (locale === "en" ? "Ready to ship" : "พร้อมจัดส่ง")],
                    [locale === "en" ? "Preparation time" : "ระยะเวลาจัดเตรียม", product.preparation_time || (locale === "en" ? "1-3 days" : "1-3 วัน")],
                    [locale === "en" ? "Sales unit" : "หน่วยขาย", product.sale_unit === "meter" ? (locale === "en" ? "Metre" : "เมตร") : product.sale_unit === "roll" ? (locale === "en" ? "Roll" : "ม้วน") : product.sale_unit === "set" ? (locale === "en" ? "Set" : "ชุด") : (locale === "en" ? "Piece" : "ผืน/ชิ้น")],
                    [locale === "en" ? "Dimensions" : "ขนาด", product.width_cm || product.length_cm ? `${product.width_cm || "-"} × ${product.length_cm || "-"} cm` : (locale === "en" ? "100 × 200 cm" : "กว้าง 100 ซม. × ยาว 200 ซม.")],
                    [locale === "en" ? "Weight" : "น้ำหนัก", product.weight_g ? `${product.weight_g} ${locale === "en" ? "g" : "กรัม"}` : (locale === "en" ? "350 g" : "350 กรัม")],
                    [locale === "en" ? "Material" : "วัสดุ/เส้นใย", product.fiber_composition || product.fabric?.fiber_type || (product.title_th?.includes("ฝ้าย") ? (locale === "en" ? "100% Organic Cotton" : "ฝ้ายธรรมชาติ 100%") : (locale === "en" ? "100% Silk" : "ไหมแท้ 100%"))],
                    [locale === "en" ? "Colour" : "สี", product.primary_color || (locale === "en" ? "Natural Indigo Blue" : "ครามธรรมชาติ (น้ำเงินเข้ม)")],
                    [locale === "en" ? "Pattern" : "ลวดลาย", product.pattern_name || product.fabric?.name_th || product.title_th],
                    [locale === "en" ? "Dye method" : "วิธีการย้อม", product.dye_method || product.fabric?.dye_method || (locale === "en" ? "Natural Dyeing" : "ย้อมสีธรรมชาติ")],
                    [locale === "en" ? "Texture" : "ผิวสัมผัส", product.texture || (locale === "en" ? "Soft & Smooth" : "นุ่ม ลื่น มีมิติ")],
                    [locale === "en" ? "Production method" : "วิธีผลิต", product.production_method || product.fabric?.weave_technique || (locale === "en" ? "Handwoven Mudmee" : "ทอมือมัดหมี่")],
                    [locale === "en" ? "Production origin" : "แหล่งผลิต", product.production_origin || (product.community ? `${product.community.name} จ.${product.community.province}` : (product.artisan?.province ? `จ.${product.artisan.province}` : (locale === "en" ? "Thailand" : "ประเทศไทย")))],
                  ].filter(([, value]) => value).map(([label, value]) => (
                    <div key={String(label)} className="rounded-xl border border-brand-200/60 bg-white p-4 shadow-sm hover:border-gold-300 transition-colors">
                      <p className="text-xs font-bold text-brand-900/50">{label}</p>
                      <p className="mt-1 font-bold text-brand-900">{value}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "care" && (
                <div className="max-w-2xl rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold thai-serif text-brand-900 mb-4">{locale === "en" ? "Care instructions" : "การดูแลรักษา"}</h3>
                  <p className="text-sm leading-7 text-brand-900/80 whitespace-pre-line">
                    {product.care_instructions || (locale === "en" ? "Hand wash cold with mild liquid soap. Do not bleach. Line dry in shade and iron on low setting." : "ซักมือด้วยน้ำเย็น ใช้น้ำยาซักผ้าอ่อน หลีกเลี่ยงการฟอกขาว ตากในที่ร่ม และรีดด้วยไฟอ่อนเพื่อถนอมผ้า")}
                  </p>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="flex flex-col items-center justify-center py-12 text-brand-900/40">
                  <Package size={48} className="mb-4 opacity-50" />
                  <p>{locale === "en" ? "This section is being prepared." : "กำลังเตรียมข้อมูลสำหรับหัวข้อนี้..."}</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
