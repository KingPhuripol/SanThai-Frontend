"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Pencil, Trash2, X, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, ShoppingBag, Package, Plus, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { artisanApi, fabricsApi } from "@/lib/api";
import type { DashboardResponse, FabricItem } from "@/lib/types";
import { useArtisanSession } from "@/lib/useArtisanSession";
import { clearSession } from "@/lib/auth";

function StatCard({
  title,
  value,
  sub,
  icon,
  accent,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: ReactNode;
  accent?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-amber-100 shadow-sm p-5 flex gap-4 items-center ${accent ?? ""}`}>
      <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 text-brand-700">
        {icon}
      </div>
      <div>
        <p className="text-xs text-brand-400">{title}</p>
        <p className="text-xl font-extrabold text-brand-900 leading-tight">{value}</p>
        {sub && <p className="text-xs text-brand-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function ArtisanDashboardPage() {
  const router = useRouter();
  const { session, checked } = useArtisanSession();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingFabric, setEditingFabric] = useState<FabricItem | null>(null);
  const [editForm, setEditForm] = useState({ name_th: "", weave_technique: "", fiber_type: "" });
  const [editSaving, setEditSaving] = useState(false);

  const loadDashboard = () => {
    if (!session) return;
    artisanApi
      .getDashboard(session.artisan_id!)
      .then(setData)
      .catch(() => setData(null))
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

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-brand-400 gap-3">
        <p>ไม่สามารถโหลด Dashboard — ตรวจสอบ Backend</p>
        <Link href="/" className="text-gold-600 underline text-sm">
          กลับหน้าแรก
        </Link>
      </div>
    );
  }

  const { stats, fabrics, revenue_trend } = data;

  const chartData = revenue_trend.map((t) => ({
    name: t.month,
    รายได้: t.revenue_thb,
    ออเดอร์: t.orders,
  }));

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <div className="bg-brand-900 pt-28 pb-14 px-4 text-white">
        <div className="max-w-5xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-amber-300 text-sm">Dashboard ช่างทอ</p>
            <h1 className="text-2xl font-bold mt-1">{stats.artisan_name}</h1>
            <p className="text-amber-200 text-sm mt-0.5">{stats.community_name} · {stats.province}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/artisan/orders"
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
            >
              <Package size={15} />
              จัดการออเดอร์
            </Link>
            <Link
              href="/artisan/upload"
              className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-brand-950 text-sm font-bold px-4 py-2 rounded-full transition-colors"
            >
              <Plus size={15} />
              ลงผ้าใหม่
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
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-4">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <StatCard
            title="รายได้รวม"
            value={`฿${stats.total_revenue_thb.toLocaleString()}`}
            sub={`$${stats.total_revenue_usd.toFixed(0)} USD`}
            icon={<TrendingUp size={20} />}
          />
          <StatCard
            title="ออเดอร์ทั้งหมด"
            value={String(stats.total_orders)}
            sub="ออเดอร์"
            icon={<ShoppingBag size={20} />}
          />
          <StatCard
            title="สินค้าที่ขายอยู่"
            value={String(stats.active_products)}
            sub={`ลงทะเบียน ${stats.registered_fabrics} ลาย`}
            icon={<Package size={20} />}
          />
        </div>

        {/* Revenue chart */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 mb-6">
            <h2 className="font-bold text-brand-900 mb-4 text-sm">รายได้ย้อนหลัง 6 เดือน (บาท)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: number, name: string) => [
                    name === "รายได้" ? `฿${val.toLocaleString()}` : val,
                    name,
                  ]}
                />
                <Bar dataKey="รายได้" fill="#5c1e1e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Fabrics table */}
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-amber-50">
            <h2 className="font-bold text-brand-900 text-sm">ผ้าที่ลงทะเบียน</h2>
          </div>
          {fabrics.length === 0 ? (
            <div className="p-10 text-center text-brand-400 text-sm">
              ยังไม่มีผ้า —{" "}
              <Link href="/artisan/upload" className="text-gold-600 underline">
                ลงผ้าลายแรก
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-amber-50">
              {fabrics.map((f: FabricItem) => (
                <div
                  key={f.id}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-amber-50/40 transition-colors"
                >
                  {f.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.image_url}
                      alt={f.name_th}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brand-900 text-sm truncate">{f.name_th}</p>
                    <p className="text-xs text-brand-400">{f.weave_technique} · {f.fiber_type}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      f.ai_processed
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {f.ai_processed ? "AI แล้ว" : "รอ AI"}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingFabric(f);
                        setEditForm({ name_th: f.name_th, weave_technique: f.weave_technique || "", fiber_type: f.fiber_type || "" });
                      }}
                      className="text-xs text-brand-500 hover:text-brand-900 p-1 rounded hover:bg-amber-50 transition-colors"
                      title="แก้ไข"
                    >
                      <Pencil size={14} />
                    </button>
                    <Link
                      href={`/fabric/${f.id}`}
                      className="text-xs text-brand-500 hover:text-brand-900 underline shrink-0"
                    >
                      SanThai Passport
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Fabric Modal */}
      {editingFabric && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setEditingFabric(null)}
              className="absolute top-4 right-4 text-brand-400 hover:text-brand-900"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-brand-900 mb-4">แก้ไขข้อมูลผ้า</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-brand-700 mb-1 block">ชื่อสินค้า</label>
                <input
                  value={editForm.name_th}
                  onChange={(e) => setEditForm((f) => ({ ...f, name_th: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-700 mb-1 block">เทคนิคการทอ</label>
                <input
                  value={editForm.weave_technique}
                  onChange={(e) => setEditForm((f) => ({ ...f, weave_technique: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-700 mb-1 block">เส้นใย</label>
                <input
                  value={editForm.fiber_type}
                  onChange={(e) => setEditForm((f) => ({ ...f, fiber_type: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingFabric(null)}
                className="flex-1 py-2.5 rounded-full border border-amber-200 text-sm font-semibold text-brand-600 hover:bg-amber-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={async () => {
                  setEditSaving(true);
                  try {
                    const fd = new FormData();
                    fd.append("name_th", editForm.name_th);
                    fd.append("weave_technique", editForm.weave_technique);
                    fd.append("fiber_type", editForm.fiber_type);
                    await fabricsApi.update(editingFabric.id, fd);
                    setEditingFabric(null);
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
