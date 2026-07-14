"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, ShieldOff, BadgeCheck } from "lucide-react";
import { adminApi } from "@/lib/api";
import { useAdminSession } from "@/lib/useAdminSession";

const ROLE_LABEL: Record<string, string> = {
  artisan: "ช่างทอผ้า",
  designer: "นักออกแบบ",
  customer: "ลูกค้า",
  admin: "แอดมิน",
};

const ROLE_FILTERS = [
  { value: "", label: "ทั้งหมด" },
  { value: "artisan", label: "ช่างทอผ้า" },
  { value: "designer", label: "นักออกแบบ" },
  { value: "customer", label: "ลูกค้า" },
];

export default function AdminUsersPage() {
  const { session, checked } = useAdminSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = (role: string) => {
    setLoading(true);
    adminApi
      .getUsers(role || undefined)
      .then(setUsers)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!session) return;
    fetchUsers(roleFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, roleFilter]);

  const handleVerify = async (artisanId: number) => {
    try {
      await adminApi.verifyArtisan(artisanId);
      fetchUsers(roleFilter);
    } catch {
      alert("ยืนยันตัวตนไม่สำเร็จ");
    }
  };

  const handleToggleSuspend = async (userId: string, isSuspended: boolean) => {
    const confirmMsg = isSuspended ? "ปลดระงับบัญชีนี้?" : "ระงับการใช้งานบัญชีนี้?";
    if (!confirm(confirmMsg)) return;
    try {
      if (isSuspended) {
        await adminApi.unsuspendUser(userId);
      } else {
        await adminApi.suspendUser(userId);
      }
      fetchUsers(roleFilter);
    } catch {
      alert("ดำเนินการไม่สำเร็จ");
    }
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
        <h1 className="text-3xl font-bold text-brand-950 thai-serif">จัดการผู้ใช้งาน</h1>
        <p className="text-brand-950/60 text-xs mt-2">ยืนยันตัวตนช่างทอ และระงับบัญชีที่ทำผิดกฎ</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-brand-900 hover:text-brand-700 transition-colors mb-6"
        >
          <ChevronLeft size={13} />
          กลับหน้า Dashboard
        </Link>

        <div className="flex gap-2 mb-4">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setRoleFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                roleFilter === f.value
                  ? "bg-brand-900 text-white"
                  : "bg-white border border-amber-200 text-brand-600 hover:bg-amber-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center p-10">
            <div className="w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-amber-100/50 shadow-sm">
            <p className="text-brand-600">ไม่มีผู้ใช้งานในหมวดนี้</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-50 text-brand-900">
                <tr>
                  <th className="px-4 py-3 font-semibold">ชื่อ</th>
                  <th className="px-4 py-3 font-semibold">อีเมล</th>
                  <th className="px-4 py-3 font-semibold">บทบาท</th>
                  <th className="px-4 py-3 font-semibold">สถานะ</th>
                  <th className="px-4 py-3 font-semibold">การกระทำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-4 py-4 font-semibold text-brand-950">{u.full_name}</td>
                    <td className="px-4 py-4 text-brand-600">{u.email}</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-semibold">
                        {ROLE_LABEL[u.role] || u.role}
                      </span>
                      {u.role === "artisan" && u.verified_at && (
                        <span className="ml-1 inline-flex items-center gap-0.5 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
                          <BadgeCheck size={11} /> ยืนยันแล้ว
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {u.is_suspended ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-semibold">
                          ถูกระงับ
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-semibold">
                          ปกติ
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        {u.role === "artisan" && !u.verified_at && u.artisan_id && (
                          <button
                            onClick={() => handleVerify(u.artisan_id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-brand-900 text-white rounded-lg text-xs font-bold hover:bg-brand-800 transition-colors"
                          >
                            <BadgeCheck size={12} />
                            ยืนยันตัวตน
                          </button>
                        )}
                        {u.role !== "admin" && (
                          <button
                            onClick={() => handleToggleSuspend(u.id, u.is_suspended)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              u.is_suspended
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                          >
                            {u.is_suspended ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}
                            {u.is_suspended ? "ปลดระงับ" : "ระงับ"}
                          </button>
                        )}
                      </div>
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
