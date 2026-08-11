"use client";

import Link from "next/link";
import { MessageCircle, ShieldCheck, Heart, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const { locale, t } = useLanguage();

  return (
    <footer className="bg-brand-950 text-white border-t border-gold-400/20 pt-12 pb-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center text-gold-400">
                <svg viewBox="0 0 40 40" className="w-full h-full fill-current" aria-hidden>
                  <path d="M20 2 L26 12 L36 12 L28 20 L31 30 L20 24 L9 30 L12 20 L4 12 L14 12 Z" opacity="0.9" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gold-300 thai-serif tracking-wide">SanThai</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed font-light">
              {locale === "en"
                ? "SanThai connects authentic Thai textiles and artisanal craftsmanship with modern technology."
                : "แพลตฟอร์มเชื่อมโยงหัตถกรรมผ้าไทยและภูมิปัญญาท้องถิ่น สู่ตลาดยุคใหม่ด้วย AI และดิจิทัล"}
            </p>
            <div className="flex items-center gap-2 text-xs text-gold-400 bg-gold-400/10 px-3 py-1.5 rounded-full border border-gold-400/20 w-fit">
              <ShieldCheck size={14} />
              <span>SanThai Verified Community</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gold-300 thai-serif uppercase tracking-wider">
              {locale === "en" ? "Explore" : "สำรวจSanThai"}
            </h3>
            <ul className="space-y-2 text-sm text-white/75">
              <li>
                <Link href="/marketplace" className="hover:text-gold-300 transition-colors flex items-center gap-1">
                  {t("marketplace")} <ArrowUpRight size={12} className="opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-gold-300 transition-colors flex items-center gap-1">
                  {t("identity")} <ArrowUpRight size={12} className="opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/fabric-verification" className="hover:text-gold-300 transition-colors flex items-center gap-1">
                  {t("verifyFabric")} <ArrowUpRight size={12} className="opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-gold-300 transition-colors flex items-center gap-1">
                  {t("community")} <ArrowUpRight size={12} className="opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

          {/* For Artisans */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gold-300 thai-serif uppercase tracking-wider">
              {locale === "en" ? "For Artisans & Stores" : "สำหรับร้านค้าและช่างทอ"}
            </h3>
            <ul className="space-y-2 text-sm text-white/75">
              <li>
                <Link href="/store" className="hover:text-gold-300 transition-colors">
                  {locale === "en" ? "Store Management Portal" : "ศูนย์จัดการร้านค้า"}
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-gold-300 transition-colors">
                  {locale === "en" ? "Register as Artisan" : "สมัครเป็นร้านค้าทอมือ"}
                </Link>
              </li>
              <li>
                <Link href="/fabric-verification" className="hover:text-gold-300 transition-colors">
                  {locale === "en" ? "Apply for SanThai Passport" : "ขอรับ SanThai Passport"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Contacts */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gold-300 thai-serif uppercase tracking-wider">
              {locale === "en" ? "Connect Channels" : "ช่องทางติดต่อสานไทย"}
            </h3>
            
            {/* Facebook Page */}
            <div className="bg-white/5 border border-blue-500/30 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shrink-0 shadow-md">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div>
                  <p className="text-xs text-white/60 font-medium">Facebook Page</p>
                  <p className="text-sm font-bold text-white tracking-wide">เพจสานไทย</p>
                </div>
              </div>
              <a
                href="https://www.facebook.com/share/1BWToyNdim/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold rounded-xl transition-all shadow-md"
              >
                {locale === "en" ? "Visit Facebook Page" : "เข้าชม Facebook เพจสานไทย"}
              </a>
            </div>

            {/* Official LINE */}
            <div className="bg-white/5 border border-green-500/30 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#06C755] flex items-center justify-center text-white shrink-0 shadow-md">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-xs text-white/60 font-medium">LINE Official</p>
                  <p className="text-sm font-bold text-white tracking-wide">@956vdrxn</p>
                </div>
              </div>
              <a
                href="https://line.me/R/ti/p/@956vdrxn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold rounded-xl transition-all shadow-md"
              >
                <MessageCircle size={14} />
                {locale === "en" ? "Add LINE @956vdrxn" : "แอด LINE @956vdrxn"}
              </a>
            </div>
          </div>


        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} SanThai (สานไทย). All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart size={12} className="text-red-400 fill-current" />
            <span>for Thai Heritage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
