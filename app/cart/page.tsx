"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, ChevronLeft } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { productsApi } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { ReservationCountdown } from "@/components/ReservationCountdown";
import { trackEvent } from "@/components/TrafficTracker";
import { useLanguage } from "@/components/LanguageProvider";

interface CartItem {
  id: number;
  title_th: string;
  title_en?: string;
  price_thb: number;
  shipping_cost_thb?: number;
  free_shipping?: boolean;
  image_url: string;
  qty: number;
}

export default function CartPage() {
  const { locale, pick } = useLanguage();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [promptpayPayload, setPromptpayPayload] = useState("");
  const [orderIds, setOrderIds] = useState<number[]>([]);
  const [reservedUntil, setReservedUntil] = useState<string | null>(null);
  const [checkoutSummary, setCheckoutSummary] = useState<{ subtotal: number; shipping: number; total: number } | null>(null);
  const isLoggedIn = !!getSession();

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      router.push("/login?next=/cart");
      return;
    }
    if (!email || !buyerName) {
      setError(locale === "en" ? "Please enter your name and email." : "กรุณากรอกชื่อและอีเมล");
      return;
    }
    setOrdering(true);
    setError("");
    trackEvent("checkout_started", { metadata: { items: items.length } });
    try {
      const payload = {
        buyer_name: buyerName,
        buyer_email: email,
        buyer_address: "-",
        items: items.map(item => ({ product_id: item.id, quantity: item.qty }))
      };
      const res = await productsApi.checkoutCart(payload);
      setPromptpayPayload(res.promptpay_payload);
      setOrderIds(res.order_ids);
      setReservedUntil(res.reserved_until || null);
      setCheckoutSummary({ subtotal: res.subtotal_thb, shipping: res.shipping_thb, total: res.total_thb });
      setOrderDone(true);
      trackEvent("checkout_created", { metadata: { order_ids: res.order_ids, total_thb: res.total_thb } });
    } catch {
      setError(locale === "en" ? "We could not create your order. Please try again." : "ไม่สามารถสั่งซื้อได้ กรุณาลองใหม่");
    } finally {
      setOrdering(false);
    }
  };

  useEffect(() => {
    // Read cart items from local storage
    try {
      const stored = localStorage.getItem("santhai_cart");
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart items:", e);
    } finally {
      setLoading(false);
    }

    const s = getSession();
    if (s) {
      setBuyerName(s.full_name || "");
      setEmail(s.email || "");
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("santhai_cart", JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to save cart items:", e);
    }
  };

  const removeItem = (id: number) => {
    const filtered = items.filter((item) => item.id !== id);
    saveCart(filtered);
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    const updated = items.map((item) => (item.id === id ? { ...item, qty } : item));
    saveCart(updated);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price_thb * item.qty, 0);
  const shipping = items.reduce((acc, item) => acc + (item.free_shipping ? 0 : (item.shipping_cost_thb || 0)), 0);
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50 pb-24">
      {/* Hero Badge */}
      <div className="bg-white border-b border-brand-200 py-10 px-4 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-300"></span>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand-900">
            SanThai Craft Marketplace
          </p>
        </div>
        <h1 className="text-3xl font-bold text-brand-950 Noto Noto-serif-thai thai-serif">
          {locale === "en" ? "Your cart" : "ตะกร้าสินค้าของคุณ"}
        </h1>
        <p className="text-brand-950/60 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
          {locale === "en" ? "Premium Thai craft from verified makers." : "รายการหัตถกรรมไทยคุณภาพพรีเมียมจากมือช่างฝีมือผู้สร้างสรรค์อย่างเป็นทางการ"}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-brand-900 hover:text-brand-700 transition-colors mb-6"
        >
          <ChevronLeft size={13} />
          {locale === "en" ? "Back to marketplace" : "กลับตลาดผ้าไทย"}
        </Link>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-amber-100/50 shadow-sm max-w-md mx-auto mt-6">
            <div className="w-16 h-16 bg-silk-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={28} className="text-brand-900" />
            </div>
            <h2 className="text-lg font-bold text-brand-950 thai-serif">
              {locale === "en" ? "Your cart is empty" : "ตะกร้าสินค้าว่างเปล่า"}
            </h2>
            <p className="text-xs text-brand-950/50 leading-relaxed mt-2">
              {locale === "en" ? "Browse premium craft textiles and support Thai weavers directly." : "คุณยังไม่มีสินค้าในตะกร้า เริ่มต้นเลือกชมลวดลายหัตถศิลป์ระดับพรีเมียมและร่วมสนับสนุนช่างทอไทยได้ทันที"}
            </p>
            <Link
              href="/marketplace"
              className="mt-8 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-brand-800 transition-colors shadow-md rounded-none w-full"
            >
              {locale === "en" ? "Browse textiles" : "เลือกซื้อผ้าไทย"} <ArrowRight size={14} className="text-brand-300" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-amber-100/50 shadow-sm flex items-center gap-4 transition-all hover:shadow-md"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-brand-100">
                    <img
                      src={item.image_url || "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric.jpg"}
                      alt={pick(item.title_th, item.title_en)}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-brand-950 thai-serif truncate">
                      {pick(item.title_th, item.title_en)}
                    </h3>
                    <p className="text-xs font-bold text-brand-900 mt-1">
                      ฿{item.price_thb.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-silk-100 hover:bg-silk-200 text-brand-950 text-xs transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-brand-950">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-silk-100 hover:bg-silk-200 text-brand-950 text-xs transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-brand-400 hover:text-red-500 transition-colors"
                    title={locale === "en" ? "Remove item" : "ลบรายการ"}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-amber-100/50 shadow-sm">
              <h3 className="text-sm font-bold text-brand-950 thai-serif border-b border-brand-100 pb-4">
                {locale === "en" ? "Order summary" : "สรุปคำสั่งซื้อ"}
              </h3>

              <div className="space-y-3 mt-4 text-xs">
                <div className="flex justify-between text-brand-950/60">
                  <span>{locale === "en" ? `Items (${items.reduce((acc, item) => acc + item.qty, 0)})` : `ยอดรวมสินค้า (${items.reduce((acc, item) => acc + item.qty, 0)} ชิ้น)`}</span>
                  <span>{locale === "en" ? `$${(subtotal / 35).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `฿${subtotal.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-brand-950/60 pb-3 border-b border-brand-100">
                  <span>{locale === "en" ? "Shipping" : "ค่าจัดส่ง"}</span>
                  <span className={shipping > 0 ? "font-bold text-brand-900" : "text-green-600 font-bold"}>{shipping > 0 ? (locale === "en" ? `$${(shipping / 35).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `฿${shipping.toLocaleString()}`) : (locale === "en" ? "Free" : "ฟรี")}</span>
                </div>
                <div className="flex justify-between text-brand-950 font-bold text-sm pt-2">
                  <span>{locale === "en" ? "Total" : "ยอดชำระสุทธิ"}</span>
                  <span className="text-brand-900">{locale === "en" ? `$${((checkoutSummary?.total ?? total) / 35).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `฿${(checkoutSummary?.total ?? total).toLocaleString()}`}</span>
                </div>
              </div>

              {!orderDone ? (
                <div className="mt-6 space-y-3">
                  <input
                    type="text"
                    placeholder={locale === "en" ? "Buyer name" : "ชื่อผู้ซื้อ"}
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                  <input
                    type="email"
                    placeholder={locale === "en" ? "Email" : "อีเมล"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <button
                    onClick={handleCheckout}
                    disabled={ordering || items.length === 0}
                    className="w-full py-4 bg-brand-900 hover:bg-brand-800 text-white text-[11px] font-bold tracking-widest uppercase transition-colors shadow-md rounded-none flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {ordering ? (locale === "en" ? "Processing…" : "กำลังดำเนินการ...") : isLoggedIn ? (locale === "en" ? "Proceed to payment" : "ดำเนินการชำระเงิน") : (locale === "en" ? "Log in to order" : "เข้าสู่ระบบเพื่อสั่งซื้อ")} <ArrowRight size={14} className="text-brand-300" />
                  </button>
                </div>
              ) : (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-5 text-center flex flex-col items-center">
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="font-bold text-green-800">{locale === "en" ? "Order created!" : "สั่งซื้อสำเร็จ!"}</p>
                  <p className="text-sm text-green-600 mt-1 mb-4">
                    {locale === "en" ? "Scan the QR Code to pay." : "กรุณาสแกน QR Code เพื่อชำระเงิน"}
                  </p>
                  {promptpayPayload && (
                    <div className="bg-white p-4 rounded-xl border border-green-200 inline-block">
                      <QRCodeSVG value={promptpayPayload} size={150} />
                    </div>
                  )}
                  <p className="text-xs text-brand-500 mt-3">
                    {locale === "en" ? `(Pay $${((checkoutSummary?.total ?? total) / 35).toLocaleString(undefined, { maximumFractionDigits: 0 })})` : `(ชำระเงิน ฿${(checkoutSummary?.total ?? total).toLocaleString()})`}
                  </p>

                  {reservedUntil && (
                    <div className="mt-4 w-full">
                      <ReservationCountdown reservedUntil={reservedUntil} />
                    </div>
                  )}

                  {/* Slip Upload */}
                  <div className="mt-6 w-full pt-6 border-t border-green-200 text-left">
                    <p className="text-sm font-bold text-brand-900 mb-2">{locale === "en" ? "Upload payment slip" : "แนบสลิปโอนเงิน"}</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (!e.target.files?.[0] || orderIds.length === 0) return;
                        try {
                          // Upload slip for all created orders in batch
                          await Promise.all(orderIds.map(id => productsApi.uploadSlip(id, e.target.files![0])));
                          alert(locale === "en" ? "Payment slip uploaded. The store will prepare your order shortly." : "อัปโหลดสลิปสำเร็จ! ร้านค้าจะจัดส่งสินค้าให้คุณเร็วๆ นี้");
                          saveCart([]); // Clear cart
                          window.location.href = "/marketplace";
                        } catch (err) {
                          alert(locale === "en" ? "Could not upload the payment slip." : "เกิดข้อผิดพลาดในการอัปโหลดสลิป");
                        }
                      }}
                      className="block w-full text-sm text-brand-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] text-brand-950/40 uppercase tracking-widest font-semibold">
                <ShieldCheck size={12} className="text-green-600" />
                {locale === "en" ? "Secure payment and verified maker records" : "รับประกันการชำระเงินปลอดภัยและระบบจดทะเบียนช่างทอ"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
