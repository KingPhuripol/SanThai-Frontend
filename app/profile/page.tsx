"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Mail, Lock, Store, AlertCircle, CheckCircle2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { getSession, saveSession, Session } from "@/lib/auth";
import { useLanguage } from "@/components/LanguageProvider";

export default function ProfilePage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    community_name: "",
  });

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.push("/login");
    } else {
      setSession(s);
      setForm({
        full_name: s.full_name || "",
        email: s.email || "",
        password: "",
        community_name: s.artisan_name || "",
      });
      setLoading(false);
    }
  }, [router]);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email) {
      setError(locale === "en" ? "Name and email are required." : "กรุณากรอกชื่อและอีเมล");
      return;
    }

    if (session?.role === "artisan" && !form.community_name) {
      setError(locale === "en" ? "Store name is required." : "กรุณากรอกชื่อร้านค้า");
      return;
    }

    if (form.password && form.password.length < 6) {
      setError(locale === "en" ? "Password must contain at least 6 characters." : "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: any = {
        full_name: form.full_name,
        email: form.email,
      };
      
      if (form.password) {
        payload.password = form.password;
      }
      
      if (session?.role === "artisan") {
        payload.community_name = form.community_name;
      }

      const updatedSession = await authApi.updateProfile(payload);
      saveSession(updatedSession);
      setSession(updatedSession);
      
      setForm(f => ({ ...f, password: "" }));
      setSuccess(locale === "en" ? "Profile updated successfully." : "อัปเดตข้อมูลสำเร็จ");
    } catch (err: any) {
      setError(err?.response?.data?.detail || (locale === "en" ? "Failed to update profile." : "ไม่สามารถอัปเดตข้อมูลได้"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-brand-900" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="bg-brand-900 text-white p-8">
          <h1 className="text-2xl font-bold thai-serif">{locale === "en" ? "Profile Settings" : "ตั้งค่าบัญชี"}</h1>
          <p className="mt-2 text-sm text-brand-200">
            {locale === "en" ? "Update your personal and account information." : "แก้ไขข้อมูลส่วนตัวและข้อมูลบัญชีของคุณ"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 text-green-600 text-sm">
              <CheckCircle2 size={18} />
              <p>{success}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-brand-900 mb-2">
              {locale === "en" ? "Full Name" : "ชื่อ-นามสกุล"}
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-900 mb-2">
              {locale === "en" ? "Email Address" : "อีเมล"}
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {session?.role === "artisan" && (
            <div>
              <label className="block text-sm font-semibold text-brand-900 mb-2">
                {locale === "en" ? "Store Name" : "ชื่อร้านค้า"}
              </label>
              <div className="relative">
                <Store size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  value={form.community_name}
                  onChange={(e) => set("community_name", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-brand-900 mb-2">
              {locale === "en" ? "New Password" : "รหัสผ่านใหม่"}
              <span className="text-stone-400 font-normal ml-2">
                {locale === "en" ? "(Leave blank to keep current)" : "(เว้นว่างไว้หากไม่ต้องการเปลี่ยน)"}
              </span>
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-sm font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              {locale === "en" ? "Cancel" : "ยกเลิก"}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-brand-900 hover:bg-brand-800 rounded-xl transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {locale === "en" ? "Save Changes" : "บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
