"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Package, TrendingUp, Scissors, LogOut, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { designerApi, productsApi } from "@/lib/api";
import { useDesignerSession } from "@/lib/useDesignerSession";
import { clearSession } from "@/lib/auth";

export default function DesignerDashboardPage() {
  const router = useRouter();
  const { session, checked } = useDesignerSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [editForm, setEditForm] = useState({ title_th: "", price_thb: "", category: "" });
  const [editSaving, setEditSaving] = useState(false);

  const loadDashboard = () => {
    if (!session) return;
    designerApi
      .getDashboard(session.user_id)
      .then(setData)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  if (!checked || (checked && session && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const stats = data?.stats || { total_revenue_thb: 0, total_orders: 0, active_products: 0, total_products: 0 };
  const products = data?.products || [];

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <div className="bg-brand-900 pt-28 pb-16 px-4 text-center text-white relative overflow-hidden">
        <h1 className="text-3xl font-bold mb-2 thai-serif">ดีไซเนอร์สตูดิโอ</h1>
        <p className="text-amber-200/80 text-sm">ยินดีต้อนรับ, {session.full_name}</p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Link
            href="/designer/orders"
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
          >
            <Package size={15} />
            จัดการออเดอร์
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white/80 text-sm font-bold px-4 py-2 rounded-full transition-colors"
          >
            <LogOut size={15} />
            ออกจากระบบ
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-2">
              <Package size={20} />
            </div>
            <p className="text-2xl font-bold text-brand-900">{stats.total_products}</p>
            <p className="text-xs text-brand-500">ผลงานทั้งหมด</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2">
              <TrendingUp size={20} />
            </div>
            <p className="text-2xl font-bold text-brand-900">฿{stats.total_revenue_thb.toLocaleString()}</p>
            <p className="text-xs text-brand-500">ยอดขายรวม</p>
          </div>
          <div className="col-span-2 bg-gradient-to-br from-gold-500 to-amber-400 p-5 rounded-2xl shadow-sm text-brand-950 flex items-center justify-between">
            <div>
              <h3 className="font-bold mb-1">สร้างสรรค์ผลงานใหม่</h3>
              <p className="text-xs opacity-80 max-w-[200px]">นำลายผ้าจากชุมชนมาต่อยอดเป็นแฟชั่นร่วมสมัย</p>
            </div>
            <Link
              href="/designer/upload"
              className="bg-brand-950 text-gold-400 p-3 rounded-full hover:bg-brand-900 transition-transform hover:scale-105"
            >
              <Plus size={24} />
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-900">ผลงานการออกแบบของคุณ</h2>
        </div>

        {products.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm flex flex-col"
              >
                <div className="h-48 bg-stone-100 relative">
                  {product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.images[0]} alt={product.title_th} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-300">
                      <Scissors size={32} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 text-brand-900 text-xs px-2 py-1 rounded-full font-semibold shadow-sm">
                    ฿{product.price_thb.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-brand-900 text-sm mb-1">{product.title_th}</h3>
                  <div className="flex justify-between items-center pt-3 border-t border-amber-50 mt-auto">
                    <span className="text-xs text-brand-400">หมวดหมู่: {product.category}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditProduct(product);
                          setEditForm({ title_th: product.title_th, price_thb: String(product.price_thb), category: product.category || "shirt" });
                        }}
                        className="text-brand-500 hover:text-brand-900 p-1 rounded hover:bg-amber-50 transition-colors"
                        title="แก้ไข"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm("ต้องการลบสินค้านี้หรือไม่?")) return;
                          try {
                            await productsApi.delete(product.id);
                            loadDashboard();
                          } catch {
                            alert("ลบไม่สำเร็จ");
                          }
                        }}
                        className="text-brand-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                        title="ลบ"
                      >
                        <Trash2 size={14} />
                      </button>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.is_active ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
                        {product.is_active ? "วางขายแล้ว" : "ปิดการขาย"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-amber-100 border-dashed">
            <p className="text-4xl mb-3">👗</p>
            <p className="text-brand-500 mb-4">คุณยังไม่มีผลงานออกแบบในระบบ</p>
            <Link
              href="/designer/upload"
              className="inline-block bg-brand-900 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-brand-800 transition-colors"
            >
              เริ่มต้นสร้างผลงาน
            </Link>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button onClick={() => setEditProduct(null)} className="absolute top-4 right-4 text-brand-400 hover:text-brand-900">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-brand-900 mb-4">แก้ไขสินค้า</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-brand-700 mb-1 block">ชื่อสินค้า</label>
                <input
                  value={editForm.title_th}
                  onChange={(e) => setEditForm((f) => ({ ...f, title_th: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-700 mb-1 block">ราคา (บาท)</label>
                <input
                  type="number"
                  value={editForm.price_thb}
                  onChange={(e) => setEditForm((f) => ({ ...f, price_thb: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-700 mb-1 block">หมวดหมู่</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
                >
                  <option value="shirt">เสื้อ / เสื้อคลุม</option>
                  <option value="skirt">กระโปรง</option>
                  <option value="dress">เดรส</option>
                  <option value="pants">กางเกง</option>
                  <option value="accessories">เครื่องประดับ / กระเป๋า</option>
                  <option value="shawl">ผ้าคลุมไหล่ / ผ้าพันคอ</option>
                  <option value="hat">หมวก</option>
                  <option value="shoes">รองเท้า</option>
                  <option value="home_decor">ของแต่งบ้าน</option>
                  <option value="fabric_roll">ผ้าผืน</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditProduct(null)} className="flex-1 py-2.5 rounded-full border border-amber-200 text-sm font-semibold text-brand-600 hover:bg-amber-50 transition-colors">
                ยกเลิก
              </button>
              <button
                onClick={async () => {
                  setEditSaving(true);
                  try {
                    const fd = new FormData();
                    fd.append("title_th", editForm.title_th);
                    fd.append("price_thb", editForm.price_thb);
                    fd.append("category", editForm.category);
                    await productsApi.update(editProduct.id, fd);
                    setEditProduct(null);
                    loadDashboard();
                  } catch {
                    alert("แก้ไขไม่สำเร็จ");
                  } finally {
                    setEditSaving(false);
                  }
                }}
                disabled={editSaving}
                className="flex-1 py-2.5 rounded-full bg-brand-900 text-white text-sm font-bold hover:bg-brand-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {editSaving && <Loader2 size={14} className="animate-spin" />}
                {editSaving ? "กำลังบันทึก…" : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
