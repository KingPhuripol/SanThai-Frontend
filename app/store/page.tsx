"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Store, 
  Settings, 
  Users, 
  Award, 
  TrendingUp, 
  Package, 
  Plus, 
  ChevronRight,
  Lock,
  MessageSquare
} from "lucide-react";
import { getSession, Session } from "@/lib/auth";
import { useLanguage } from "@/components/LanguageProvider";

export default function StoreDashboardPage() {
  const { locale } = useLanguage();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s || (s.role !== "artisan" && s.role !== "designer")) {
      router.push("/login");
    } else {
      setSession(s);
    }
  }, [router]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-24 pb-20 selection:bg-brand-300 selection:text-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-900 flex items-center justify-center text-gold-400 text-2xl font-bold border-2 border-gold-400/30">
              {session.full_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-brand-950 thai-serif">{locale === "en" ? "Store management" : "การจัดการร้านค้า"}</h1>
              <p className="text-brand-900/60 text-sm">{locale === "en" ? "Welcome, " : "ยินดีต้อนรับ, "}{session.full_name}</p>
            </div>
          </div>
          <Link
            href="/store/products/add"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-900 to-brand-800 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-brand-900/20 hover:scale-105 transition-transform"
          >
            <Plus size={20} className="text-gold-400" />
            {locale === "en" ? "Add product" : "เพิ่มสินค้าใหม่"}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Settings & Status) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Store Settings */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-brand-200/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
                  <Settings size={20} className="text-brand-900/60" />
                  {locale === "en" ? "Store settings" : "ตั้งค่าร้านค้า"}
                </h2>
                <button className="text-brand-900/40 hover:text-brand-900 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="bg-brand-50 p-4 rounded-xl flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-brand-900">{locale === "en" ? "Store members (weavers)" : "สมาชิกในร้าน (ช่างทอ)"}</span>
                  <span className="text-xs font-bold bg-brand-200 text-brand-900 px-2 py-1 rounded-full">3 {locale === "en" ? "people" : "คน"}</span>
                </div>
                <button className="text-[13px] text-brand-900/60 flex items-center gap-1 hover:text-brand-900 transition-colors mt-2">
                  <Users size={14} /> {locale === "en" ? "Manage members" : "จัดการสมาชิก"}
                </button>
              </div>
            </div>

            {/* Store Status (Locked for now) */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-brand-200/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-900/40 mb-2">
                  <Lock size={24} />
                </div>
                <span className="text-sm font-medium text-brand-900/60">{locale === "en" ? "Store tier system (coming soon)" : "ระบบการจัดระดับร้านค้า (เร็วๆ นี้)"}</span>
              </div>
              <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2 mb-4">
                <Store size={20} className="text-brand-900/60" />
                {locale === "en" ? "Store status" : "สถานะร้านค้า"}
              </h2>
              <div className="h-24 bg-brand-50 rounded-xl"></div>
            </div>
            
          </div>

          {/* Right Column (Overview & Orders) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Business Overview */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-brand-200/50">
              <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-brand-900/60" />
                {locale === "en" ? "Business overview" : "ภาพรวมธุรกิจ"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Reward Box */}
                <div className="bg-gradient-to-br from-gold-400/10 to-gold-400/5 border border-gold-400/20 rounded-xl p-5 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-gold-400/20 rounded-full blur-xl group-hover:bg-gold-400/30 transition-all"></div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gold-500 shadow-sm">
                      <Award size={20} />
                    </div>
                    <h3 className="font-bold text-brand-900">Rewards</h3>
                  </div>
                  <p className="text-xs text-brand-900/60 leading-relaxed mb-4">
                    {locale === "en" ? "Earn points from sales and strong reviews to unlock benefits (in development)." : "สะสมคะแนนจากการขายและรีวิวที่ดี เพื่อปลดล็อกสิทธิพิเศษ (ฟีเจอร์กำลังพัฒนา)"}
                  </p>
                  <div className="h-2 w-full bg-brand-900/5 rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-gold-400"></div>
                  </div>
                </div>

                {/* Insight Box */}
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-900 shadow-sm">
                      <MessageSquare size={20} />
                    </div>
                    <h3 className="font-bold text-brand-900">Insights & News</h3>
                  </div>
                  <p className="text-xs text-brand-900/60 leading-relaxed mb-4">
                    {locale === "en" ? "Follow news, sales guidance, and Thai textile market trends (in development)." : "ติดตามข่าวสาร คำแนะนำการเพิ่มยอดขาย และเทรนด์ตลาดผ้าไทยจากทีมงาน (ฟีเจอร์กำลังพัฒนา)"}
                  </p>
                  <button className="text-[13px] font-bold text-brand-900 flex items-center gap-1 hover:gap-2 transition-all">
                    {locale === "en" ? "View all" : "ดูทั้งหมด"} <ChevronRight size={14} />
                  </button>
                </div>

              </div>
            </div>

            {/* Manage Products */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-brand-200/50 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
                  <Package size={20} className="text-brand-900/60" />
                  {locale === "en" ? "Manage store products" : "จัดการสินค้าของร้าน"}
                </h2>
                <Link href="/store/products" className="text-[13px] font-bold text-brand-900 hover:text-brand-700 transition-colors flex items-center gap-1">
                  {locale === "en" ? "View all products" : "ดูสินค้าทั้งหมด"} <ChevronRight size={14} />
                </Link>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Link href="/store/products/add" className="bg-brand-50 hover:bg-brand-100 transition-colors p-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-brand-100 text-brand-900">
                  <Plus size={24} />
                  <span className="text-sm font-bold">{locale === "en" ? "Add product" : "เพิ่มสินค้าใหม่"}</span>
                </Link>
                <Link href="/store/products" className="bg-brand-50 hover:bg-brand-100 transition-colors p-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-brand-100 text-brand-900">
                  <Settings size={24} />
                  <span className="text-sm font-bold">{locale === "en" ? "Edit / delete products" : "แก้ไข / ลบ สินค้า"}</span>
                </Link>
              </div>
            </div>

            {/* Manage Orders */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-brand-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
                  <TrendingUp size={20} className="text-brand-900/60" />
                  {locale === "en" ? "Manage recent orders" : "จัดการคำสั่งซื้อล่าสุด"}
                </h2>
                <button className="text-[13px] font-bold text-brand-900 hover:text-brand-700 transition-colors">
                  {locale === "en" ? "View all orders" : "ดูออเดอร์ทั้งหมด"}
                </button>
              </div>

              {/* Empty state for orders */}
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center text-brand-900/30 mb-4">
                  <Package size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-brand-900 font-bold mb-1">{locale === "en" ? "No orders yet" : "ยังไม่มีคำสั่งซื้อ"}</h3>
                <p className="text-sm text-brand-900/50 max-w-[250px]">
                  {locale === "en" ? "Orders will appear here when customers make purchases." : "เมื่อมีลูกค้าสั่งซื้อสินค้า รายการออเดอร์จะแสดงที่นี่"}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
