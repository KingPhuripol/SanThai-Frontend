"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Package, TrendingUp, ShoppingBag, Heart, LogOut } from "lucide-react";
import { adminApi } from "@/lib/api";
import { useAdminSession } from "@/lib/useAdminSession";
import { clearSession } from "@/lib/auth";

function StatCard({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 flex gap-4 items-center">
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const { session, checked } = useAdminSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    adminApi
      .getStats()
      .then(setStats)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
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

  if (!session || !stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-brand-900 py-10 px-4 text-white">
        <div className="max-w-5xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-amber-300 text-sm">Admin Dashboard</p>
            <h1 className="text-2xl font-bold mt-1">ภาพรวมแพลตฟอร์ม สานไทย</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/users"
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
            >
              <Users size={15} />
              ผู้ใช้งาน
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
            >
              <Package size={15} />
              ออเดอร์ทั้งหมด
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <StatCard
            title="รายได้รวมทั้งแพลตฟอร์ม"
            value={`฿${stats.total_revenue_thb.toLocaleString()}`}
            sub={`$${stats.total_revenue_usd.toFixed(0)} USD`}
            icon={<TrendingUp size={20} />}
          />
          <StatCard
            title="ออเดอร์สำเร็จ/กำลังดำเนินการ"
            value={String(stats.total_orders)}
            sub={`ยกเลิก/หมดเวลา ${stats.cancelled_orders} รายการ`}
            icon={<ShoppingBag size={20} />}
          />
          <StatCard
            title="ส่วนแบ่งชุมชนรวม (30%)"
            value={`฿${stats.total_community_share_thb.toLocaleString()}`}
            icon={<Heart size={20} />}
          />
          <StatCard
            title="ผู้ใช้งานทั้งหมด"
            value={String(stats.total_users)}
            sub={`ช่างทอ ${stats.users_by_role.artisan} · ดีไซเนอร์ ${stats.users_by_role.designer} · ลูกค้า ${stats.users_by_role.customer}`}
            icon={<Users size={20} />}
          />
          <StatCard
            title="สินค้าที่ลงขาย"
            value={String(stats.total_products)}
            icon={<Package size={20} />}
          />
          <StatCard
            title="ลายผ้าที่ลงทะเบียน"
            value={String(stats.total_fabrics)}
            icon={<Package size={20} />}
          />
        </div>
      </div>
    </div>
  );
}
