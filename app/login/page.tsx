"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, User, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { saveSession } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const session = await authApi.login(username, password);
      saveSession(session);
      if (next && next.startsWith("/")) {
        router.push(next);
      } else if (session.role === "admin") {
        router.push("/admin/dashboard");
      } else if (session.role === "artisan") {
        router.push("/artisan/dashboard");
      } else if (session.role === "designer") {
        router.push("/designer/dashboard");
      } else {
        router.push("/marketplace");
      }
    } catch {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden">
        <div className="bg-brand-900 p-8 text-center text-white">
          <h1 className="text-3xl font-bold thai-serif">เข้าสู่ระบบ</h1>
          <p className="text-sm text-brand-200 mt-2">sacit Craft Marketplace · สานไทย</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <p className="text-xs text-center text-stone-400 -mt-2 mb-2">
            รองรับทุกบัญชี — ช่างทอผ้า / นักออกแบบ / ลูกค้า
          </p>

          <div>
            <label className="block text-sm font-semibold text-brand-900 mb-2">อีเมล</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm"
                placeholder="กรอกอีเมลของคุณ..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-900 mb-2">รหัสผ่าน</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm"
                placeholder="กรอกรหัสผ่าน..."
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-brand-900 hover:bg-brand-800 text-white font-bold tracking-widest uppercase transition-colors rounded-xl shadow-md mt-4 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
          </button>

          <p className="text-xs text-center text-stone-400 mt-4">
            ยังไม่มีบัญชี?{" "}
            <Link href="/register" className="text-brand-700 font-semibold hover:underline">
              สมัครสมาชิกที่นี่
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
