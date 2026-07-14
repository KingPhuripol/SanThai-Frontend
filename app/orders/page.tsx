"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package, Image as ImageIcon } from "lucide-react";
import { getSession } from "@/lib/auth";
import { ordersApi, API_URL, productsApi } from "@/lib/api";
import { ReservationCountdown } from "@/components/ReservationCountdown";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  pending: { label: "รอชำระเงิน", className: "bg-stone-100 text-stone-600" },
  processing: { label: "เตรียมจัดส่ง", className: "bg-amber-100 text-amber-700" },
  shipped: { label: "จัดส่งแล้ว", className: "bg-green-100 text-green-700" },
  cancelled: { label: "ยกเลิก (หมดเวลาชำระเงิน)", className: "bg-red-100 text-red-700" },
};

export default function MyOrdersPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    ordersApi
      .my()
      .then(setOrders)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login?next=/orders");
      return;
    }
    setChecked(true);
    fetchOrders();
  }, [router]);

  const getSlipUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_URL}${url}`;
  };

  const handleUploadSlip = async (orderId: number, file: File) => {
    try {
      await productsApi.uploadSlip(orderId, file);
      fetchOrders();
    } catch {
      alert("อัปโหลดสลิปไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-white border-b border-brand-200 py-10 px-4 text-center">
        <h1 className="text-3xl font-bold text-brand-950 thai-serif">คำสั่งซื้อของฉัน</h1>
        <p className="text-brand-950/60 text-xs mt-2">ติดตามสถานะการจอง การชำระเงิน และการจัดส่ง</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-brand-900 hover:text-brand-700 transition-colors mb-6"
        >
          <ChevronLeft size={13} />
          กลับตลาดผ้าไทย
        </Link>

        {loading ? (
          <div className="flex justify-center p-10">
            <div className="w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-amber-100/50 shadow-sm">
            <Package size={48} className="mx-auto text-brand-300 mb-4" />
            <p className="text-brand-600">คุณยังไม่มีคำสั่งซื้อ</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const statusInfo = STATUS_LABEL[o.status] || STATUS_LABEL.pending;
              return (
                <div key={o.id} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl bg-stone-100 overflow-hidden shrink-0 flex items-center justify-center text-brand-300">
                        {o.product_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={o.product_image} alt={o.product_title} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={22} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-brand-950 text-sm truncate">{o.product_title}</p>
                        <p className="text-xs text-brand-500">
                          #{o.id} · จำนวน {o.quantity} ชิ้น · ฿{o.total_thb.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-md font-semibold shrink-0 ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {o.status === "pending" && o.reserved_until && (
                    <div className="mt-3">
                      <ReservationCountdown reservedUntil={o.reserved_until} />
                      <label className="mt-3 flex items-center justify-center gap-2 border-2 border-dashed border-amber-300 rounded-xl p-3 cursor-pointer hover:bg-amber-50 transition-colors text-xs text-brand-600">
                        <ImageIcon size={14} />
                        แนบสลิปโอนเงิน
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleUploadSlip(o.id, e.target.files[0])}
                        />
                      </label>
                    </div>
                  )}

                  {o.status === "processing" && (
                    <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      แนบสลิปแล้ว รอผู้ขายตรวจสอบและจัดส่งสินค้า
                      {o.slip_url && (
                        <>
                          {" "}
                          <a
                            href={getSlipUrl(o.slip_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-semibold"
                          >
                            ดูสลิปที่แนบ
                          </a>
                        </>
                      )}
                    </p>
                  )}

                  {o.status === "shipped" && (
                    <p className="mt-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                      จัดส่งแล้วโดย {o.courier || "ผู้ให้บริการขนส่ง"}
                      {o.tracking_number && <> · เลขพัสดุ: <span className="font-mono">{o.tracking_number}</span></>}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
