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

export default function ProductDetailPage() {
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
      .catch(() => setError("ไม่พบสินค้า"))
      .finally(() => setLoading(false));

    const s = getSession();
    if (s) {
      setBuyerName(s.full_name || "");
      setEmail(s.email || "");
    }
  }, [id]);

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
          image_url: product.images?.[0] ?? product.fabric?.image_url ?? "",
          qty: qty,
        });
      }
      localStorage.setItem("santhai_cart", JSON.stringify(cartItems));
      
      // Dispatch event to update navbar cart count
      window.dispatchEvent(new Event("santhai-cart-changed"));
      
      alert("เพิ่มสินค้าลงในตะกร้าเรียบร้อยแล้ว!");
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
      setError("กรุณากรอกชื่อและอีเมล");
      return;
    }
    setOrdering(true);
    setError("");
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
    } catch {
      setError("ไม่สามารถสั่งซื้อได้ กรุณาลองใหม่");
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
        <p className="text-xl">ไม่พบสินค้าที่คุณค้นหา</p>
        <Link href="/marketplace" className="mt-6 px-6 py-3 bg-gold-400 text-brand-900 rounded-full font-bold hover:bg-gold-300 transition-colors">
          กลับไปตลาดผ้า
        </Link>
      </div>
    );
  }

  // Mocking extra images for the gallery if backend doesn't provide enough
  const productImages = product.images?.length ? product.images : [
    product.fabric?.image_url || "/uploads/thai_fabric_image_01.jpg",
    "/uploads/thai_fabric_amnat_charoen_01.jpg",
    "/uploads/thai_fabric_01.jpg",
    "/uploads/thai_fabric_image_02.jpg",
    "/uploads/thai_fabric_amnat_charoen_046.jpg",
  ];

  const mainImage = productImages[activeImageIndex];

  return (
    <div className="min-h-screen bg-brand-900 pb-20 pt-[80px]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/50 mb-6 font-medium">
          <Link href="/" className="hover:text-gold-300 transition-colors flex items-center gap-1"><ChevronLeft size={14}/> หน้าหลัก</Link>
          <span><ChevronRight size={14}/></span>
          <Link href="/marketplace" className="hover:text-gold-300 transition-colors">ตลาดผ้า</Link>
          <span><ChevronRight size={14}/></span>
          <Link href="/marketplace" className="hover:text-gold-300 transition-colors">ผ้าไหมมัดหมี่</Link>
          <span><ChevronRight size={14}/></span>
          <span className="text-white/90">{product.title_th}</span>
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
                      {product.title_th}
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
                  
                  <p className="text-sm text-brand-900/60 mb-4">{product.title_en || "Mudmee Silk with Ancient Motif"}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-brand-900/60 mb-6">
                    <span>รหัสสินค้า ST-MM-{(product.id).toString().padStart(5, '0')}</span>
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
                    <span className="text-brand-900/50 mb-2">/ ผืน</span>
                    <span className={`ml-auto px-4 py-1.5 rounded-full text-xs font-bold ${product.stock > 0 ? "bg-[#E6F4EA] text-[#137333]" : "bg-red-50 text-red-600"}`}>
                      {product.stock > 0 ? "มีสินค้า" : "สินค้าหมด"}
                    </span>
                  </div>

                  <p className="text-[15px] text-brand-900/80 leading-[1.8] mb-6">
                    {product.description_th || "ผ้าไหมมัดหมี่ทอมือ ลวดลายโบราณอันเป็นสัญลักษณ์แห่งความเจริญ ทอด้วยเส้นไหมแท้ 100% ย้อมสีธรรมชาติ ให้สัมผัสนุ่ม ละมุน สวมใส่ง่าย เหมาะสำหรับตัดชุดไทย ชุดออกงาน หรือสะสม"}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    {[{icon: "🌿", t: "ไหมแท้ 100%"}, {icon: "🍃", t: "ย้อมสีธรรมชาติ"}, {icon: "🧶", t: "ทอมือทุกผืน"}, {icon: "✨", t: "ผืนเดียวในโลก"}].map((b, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-brand-900/70">
                        <span className="text-base">{b.icon}</span> {b.t}
                      </div>
                    ))}
                  </div>

                  {/* Digital ID link */}
                  {product.fabric_id && (
                    <Link href={`/fabric/${product.fabric_id}`} className="mb-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-brand-200 bg-white text-sm text-brand-900 font-medium hover:border-brand-900 transition-colors shadow-sm w-fit">
                      <QrCode size={16} className="text-brand-900/50" /> ดู Digital ID · ตรวจสอบ Provenance
                    </Link>
                  )}

                  {/* Form */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-bold text-brand-900 mb-2">ขนาด / ความยาว</p>
                      <div className="relative">
                        <select className="w-full appearance-none bg-white border border-brand-200 rounded-xl px-4 py-3 text-sm text-brand-900 focus:outline-none focus:border-brand-900 focus:ring-1 focus:ring-brand-900">
                          <option>1 ผืน (2 เมตร)</option>
                          <option>2 ผืน (4 เมตร)</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-900/50 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-900 mb-2">จำนวน</p>
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
                      เพิ่มลงตะกร้า
                    </button>
                    <button 
                      onClick={handleOrder}
                      disabled={ordering || product.stock === 0}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 text-brand-950 font-bold py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-[0_4px_15px_rgba(212,175,55,0.3)] disabled:opacity-50"
                    >
                      <span className="text-xl leading-none">⚡</span>
                      {ordering ? "กำลังดำเนินการ..." : "ซื้อเลย"}
                    </button>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-900/50">
                    <ShieldCheck size={14} className="text-green-600" /> รับประกันความพึงพอใจ 100% คืนสินค้าได้ภายใน 7 วัน
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
                  <Image src="/uploads/thai_fabric_image_01.jpg" alt="Artisan" fill sizes="96px" className="object-cover" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full border-2 border-[#FAF6ED] flex items-center justify-center text-white">
                    <CheckCircle2 size={12} strokeWidth={3} />
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-brand-900 flex items-center justify-center gap-1.5">
                  เรือนไหม by แม่คำปั้น <CheckCircle2 size={16} className="text-blue-500" fill="currentColor" />
                </h3>
                <p className="text-sm text-brand-900/50 flex items-center justify-center gap-1 mt-1">
                  <MapPin size={12} className="text-gold-500" /> {product.community?.province || "จ.อุบลราชธานี"}
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

              <Link href="#" className="flex items-center justify-center w-full py-3 bg-white border border-brand-200 rounded-xl text-sm font-bold text-brand-900 hover:border-brand-900 transition-colors mb-6 shadow-sm">
                ดูหน้าร้านค้า
              </Link>

              <div className="space-y-3">
                {[
                  { icon: <CheckCircle2 size={16} className="text-green-500" />, t: "ผู้ขายได้รับการยืนยัน" },
                  { icon: <Award size={16} className="text-gold-500" />, t: "สินค้าทุกชิ้นทอมือจริง" },
                  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-500"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>, t: "Story จากผู้สร้างสรรค์จริง" },
                  { icon: <Package size={16} className="text-brand-500" />, t: "จัดส่งปลอดภัย" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-medium text-brand-900/70 p-2 rounded-lg hover:bg-white transition-colors cursor-default">
                    {item.icon} {item.t} <ChevronRight size={14} className="ml-auto opacity-30" />
                  </div>
                ))}
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
                  { name: "ผ้าไหมมัดหมี่ลายโบราณ", price: "2,750", img: "/uploads/thai_fabric_amnat_charoen_01.jpg" },
                  { name: "ผ้าไหมแพรวา", price: "3,250", img: "/uploads/thai_fabric_01.jpg" }
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
                { id: "story", label: "เรื่องราวของผืนผ้า" },
                { id: "details", label: "รายละเอียดสินค้า" },
                { id: "care", label: "การดูแลรักษา" },
                { id: "reviews", label: "รีวิวจากลูกค้า (128)" },
                { id: "shipping", label: "จัดส่งและคืนสินค้า" }
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
                      "ดอกพิกุล... สัญลักษณ์แห่งความเจริญและความงดงาม"
                    </p>
                    <p className="text-sm text-brand-900/70 leading-[1.8] mb-10">
                      ลวดลายดอกพิกุลโบราณ สืบทอดจากผืนผ้าโบราณในวังหลวง ทอขึ้นใหม่ด้วยภูมิปัญญาและความประณีตของช่างทอพื้นถิ่น จ.อุบลราชธานี ทุกผืนคือการเชื่อมโยงอดีตสู่ปัจจุบันและอนาคต
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
                      <Link href="#" className="text-xs font-medium text-brand-900/50 bg-white border border-brand-200 px-4 py-2 rounded-full hover:border-brand-900 transition-colors">ดูเบื้องหลังทั้งหมด</Link>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { img: "/uploads/thai_fabric_image_01.jpg", t: "1. คัดสรรเส้นไหม" },
                        { img: "/uploads/thai_fabric_amnat_charoen.jpg", t: "2. ย้อมสีธรรมชาติ" },
                        { img: "/uploads/thai_fabric_image_02.jpg", t: "3. มัดหมี่ด้วยมือ" },
                        { img: "/uploads/thai_fabric_amnat_charoen_01.jpg", t: "4. ทอด้วยความประณีต" },
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
              
              {activeTab !== "story" && (
                <div className="flex flex-col items-center justify-center py-12 text-brand-900/40">
                  <Package size={48} className="mb-4 opacity-50" />
                  <p>กำลังเตรียมข้อมูลสำหรับหัวข้อนี้...</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
