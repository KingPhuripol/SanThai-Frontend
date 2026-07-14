"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ChevronLeft, Image as ImageIcon } from "lucide-react";
import { adminApi, API_URL } from "@/lib/api";
import { useAdminSession } from "@/lib/useAdminSession";

export default function AdminOrdersPage() {
  const { session, checked } = useAdminSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    adminApi
      .getOrders()
      .then(setOrders)
      .catch((err) => console.error("Error loading orders:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!session) return;
    fetchOrders();
  }, [session]);

  const handleUpdateStatus = async (orderId: number) => {
    const status = prompt(
      "ระบุสถานะใหม่ (pending / processing / shipped / cancelled):",
      "shipped"
    );
    if (!status) return;
    let trackingNumber: string | null = "";
    let courier = "";
    if (status === "shipped") {
      trackingNumber = prompt("หมายเลขพัสดุ (Tracking Number):") || "";
      courier = prompt("ผู้ให้บริการขนส่ง:", "Kerry Express") || "";
    }

    try {
      await adminApi.updateOrderStatus(orderId, {
        status,
        tracking_number: trackingNumber || undefined,
        courier: courier || undefined,
      });
      alert("อัปเดตสถานะสำเร็จ!");
      fetchOrders();
    } catch (e) {
      alert("อัปเดตสถานะไม่สำเร็จ: " + e);
    }
  };

  const getSlipUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_URL}${url}`;
  };

  if (!checked || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-white border-b border-brand-200 py-10 px-4 text-center">
        <h1 className="text-3xl font-bold text-brand-950 thai-serif">ออเดอร์ทั้งระบบ</h1>
        <p className="text-brand-950/60 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
          ดูและแก้ไขสถานะออเดอร์จากช่างทอ/ดีไซเนอร์ทุกคนในแพลตฟอร์ม
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-brand-900 hover:text-brand-700 transition-colors mb-6"
        >
          <ChevronLeft size={13} />
          กลับหน้า Dashboard
        </Link>

        {loading ? (
          <div className="flex justify-center p-10">
            <div className="w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-amber-100/50 shadow-sm">
            <Package size={48} className="mx-auto text-brand-300 mb-4" />
            <p className="text-brand-600">ยังไม่มีรายการสั่งซื้อในระบบ</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-50 text-brand-900">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order ID</th>
                  <th className="px-4 py-3 font-semibold">สินค้า</th>
                  <th className="px-4 py-3 font-semibold">ลูกค้า</th>
                  <th className="px-4 py-3 font-semibold">ยอดชำระ</th>
                  <th className="px-4 py-3 font-semibold">สลิปการโอน</th>
                  <th className="px-4 py-3 font-semibold">สถานะ</th>
                  <th className="px-4 py-3 font-semibold">การกระทำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs text-brand-500">#{o.id}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-brand-950">{o.product_title}</p>
                      <p className="text-xs text-brand-500">จำนวน: {o.quantity} ชิ้น</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-brand-950">{o.buyer_name}</p>
                      <p className="text-xs text-brand-500">{o.buyer_email}</p>
                    </td>
                    <td className="px-4 py-4 font-bold text-brand-900">฿{o.total_thb.toLocaleString()}</td>
                    <td className="px-4 py-4 text-center">
                      {o.slip_url ? (
                        <a href={getSlipUrl(o.slip_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold hover:bg-green-100">
                          <ImageIcon size={12} />
                          ดูสลิป
                        </a>
                      ) : (
                        <span className="text-xs text-stone-400">ยังไม่แนบ</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {o.status === "pending" ? (
                        <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded-md text-xs font-semibold">รอชำระเงิน</span>
                      ) : o.status === "processing" ? (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-semibold">เตรียมจัดส่ง</span>
                      ) : o.status === "cancelled" ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-semibold">ยกเลิก</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold inline-block w-fit">จัดส่งแล้ว</span>
                          <span className="text-[10px] text-brand-500 font-mono">{o.tracking_number}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleUpdateStatus(o.id)}
                        className="px-3 py-1.5 bg-brand-900 text-white rounded-lg text-xs font-bold hover:bg-brand-800 transition-colors"
                      >
                        แก้สถานะ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
