"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ChevronLeft } from "lucide-react";
import { authApi } from "@/lib/api";
import { saveSession } from "@/lib/auth";

const REGION_OPTIONS = [
  { value: "north", label: "ภาคเหนือ" },
  { value: "northeast", label: "ภาคอีสาน" },
  { value: "central", label: "ภาคกลาง" },
  { value: "south", label: "ภาคใต้" },
];

const ROLE_OPTIONS: { value: "artisan" | "designer" | "customer"; label: string }[] = [
  { value: "artisan", label: "ร้านค้า" },
  { value: "designer", label: "นักออกแบบ" },
  { value: "customer", label: "ลูกค้า" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    role: "artisan" as "artisan" | "designer" | "customer",
    email: "",
    password: "",
    full_name: "",
    community_name: "",
    province: "",
    region: "north",
    bio_th: "",
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const isArtisan = form.role === "artisan";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.full_name) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (isArtisan && (!form.community_name || !form.province)) {
      setError("กรุณากรอกข้อมูลชุมชนให้ครบถ้วน");
      return;
    }
    if (form.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const session = await authApi.register({
        role: form.role,
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        ...(isArtisan
          ? {
              community_name: form.community_name,
              province: form.province,
              region: form.region,
              bio_th: form.bio_th || undefined,
            }
          : {}),
      });
      saveSession(session);
      if (session.role === "artisan") {
        router.push("/artisan/dashboard");
      } else if (session.role === "designer") {
        router.push("/designer/dashboard");
      } else {
        router.push("/marketplace");
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center p-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden">
        <div className="bg-brand-900 p-8 text-center text-white relative">
          <Link
            href="/login"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200 hover:text-white"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold thai-serif">สมัครสมาชิก</h1>
          <p className="text-sm text-brand-200 mt-2">สานไทย · SanThai</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-900 mb-2">สมัครในฐานะ *</label>
            <div className="flex bg-stone-100 p-1 rounded-xl">
              {ROLE_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => set("role", r.value)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                    form.role === r.value
                      ? "bg-white text-brand-900 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-900 mb-1">ชื่อ-นามสกุล *</label>
            <input
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="เช่น สมศรี ใจดี"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-900 mb-1">อีเมล *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-900 mb-1">รหัสผ่าน *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="อย่างน้อย 6 ตัวอักษร"
            />
          </div>

          {isArtisan && (
            <>
              <div>
                <label className="block text-sm font-semibold text-brand-900 mb-1">ชื่อร้านค้า *</label>
                <input
                  value={form.community_name}
                  onChange={(e) => set("community_name", e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="เช่น ร้านผ้าทอบ้านโนนกอก"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-brand-900 mb-1">จังหวัด *</label>
                  <input
                    value={form.province}
                    onChange={(e) => set("province", e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="เช่น ขอนแก่น"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-900 mb-1">ภาค *</label>
                  <select
                    value={form.region}
                    onChange={(e) => set("region", e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {REGION_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-900 mb-1">แนะนำตัว (ไม่บังคับ)</label>
                <textarea
                  value={form.bio_th}
                  onChange={(e) => set("bio_th", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-stone-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  placeholder="เล่าเรื่องราวของคุณสั้นๆ..."
                />
              </div>
            </>
          )}

          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-brand-900 hover:bg-brand-800 text-white font-bold tracking-widest uppercase transition-colors rounded-xl shadow-md mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "กำลังสมัคร…" : "สมัครสมาชิก"}
          </button>

          <p className="text-xs text-center text-stone-400 mt-2">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="text-brand-700 font-semibold hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
