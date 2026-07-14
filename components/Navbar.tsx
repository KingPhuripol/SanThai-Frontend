"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Search, ShoppingBag, Heart, User } from "lucide-react";
import { clearSession, getSession, Session, SESSION_CHANGED_EVENT } from "@/lib/auth";

const CART_KEY = "santhai_cart";
const CART_CHANGED_EVENT = "santhai-cart-changed";

function getCartCount(): number {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return 0;
    const items = JSON.parse(raw);
    return Array.isArray(items) ? items.reduce((sum: number, i: any) => sum + (i.qty || 1), 0) : 0;
  } catch { return 0; }
}

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setSession(getSession());
    setCartCount(getCartCount());
    const onSessionChanged = () => setSession(getSession());
    const onCartChanged = () => setCartCount(getCartCount());
    const onStorageChanged = (e: StorageEvent) => {
      if (e.key === CART_KEY) setCartCount(getCartCount());
    };
    window.addEventListener(SESSION_CHANGED_EVENT, onSessionChanged);
    window.addEventListener(CART_CHANGED_EVENT, onCartChanged);
    window.addEventListener("storage", onStorageChanged);
    const interval = setInterval(onCartChanged, 2000);
    return () => {
      window.removeEventListener(SESSION_CHANGED_EVENT, onSessionChanged);
      window.removeEventListener(CART_CHANGED_EVENT, onCartChanged);
      window.removeEventListener("storage", onStorageChanged);
      clearInterval(interval);
    };
  }, []);

  const baseLinks = [
    { href: "/", label: "หน้าหลัก" },
    { href: "/quiz", label: "ค้นหาตัวตน" },
    { href: "/marketplace", label: "ตลาดผ้า" },
    { href: "/library", label: "ห้องสมุดผ้า" },
    { href: "/community", label: "ชุมชนผู้สร้างสรรค์" },
    { href: "/about", label: "เกี่ยวกับเรา" },
  ];

  // Dynamic links based on role
  const roleLinks = [];
  if (session?.role === "artisan" || session?.role === "designer") {
    roleLinks.push({ href: "/store", label: "การจัดการร้านค้า" });
  }
  roleLinks.push({ href: "/fabric-verification", label: "ตรวจสอบผ้า" });

  const allLinks = [...baseLinks, ...roleLinks];

  return (
    <nav className="absolute top-0 w-full z-50 bg-brand-900/40 border-b border-white/10 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Decorative Logo Icon */}
          <div className="relative w-10 h-10 flex flex-col items-center justify-center text-gold-400">
            <svg viewBox="0 0 40 40" className="w-full h-full fill-current" aria-hidden>
              <path d="M20 2 L26 12 L36 12 L28 20 L31 30 L20 24 L9 30 L12 20 L4 12 L14 12 Z" opacity="0.9" />
              <path d="M20 8 L24 14 L30 14 L25 19 L27 25 L20 21 L13 25 L15 19 L10 14 L16 14 Z" opacity="0.6" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gold-300 thai-serif leading-none tracking-wide">
              SanThai
            </span>
            <span className="text-[11px] text-white/80 font-medium tracking-widest mt-1">
              ผ้าไทย ใส่ได้ทุกตัวตน
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/80">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-gold-300 transition-colors pb-1 border-b-2 ${
                link.href === "/" ? "border-gold-400 text-white font-bold" : "border-transparent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-6">
          <button className="hidden sm:flex text-white hover:text-gold-300 transition-colors">
            <Search size={20} strokeWidth={1.5} />
          </button>
          
          <Link href="/wishlist" className="hidden sm:flex text-white hover:text-gold-300 transition-colors">
            <Heart size={20} strokeWidth={1.5} />
          </Link>
          
          <Link href="/cart" className="relative flex text-white hover:text-gold-300 transition-colors">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 flex items-center justify-center bg-gold-500 text-brand-950 text-[9px] font-bold rounded-full border border-brand-900">
                {cartCount}
              </span>
            )}
            {cartCount === 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 flex items-center justify-center bg-white/20 text-white text-[9px] font-bold rounded-full border border-brand-900">
                0
              </span>
            )}
          </Link>

          {/* User Profile / Avatar */}
          {session ? (
            <div className="relative group ml-2">
              <div className="block rounded-full overflow-hidden border border-gold-300/30 w-8 h-8 cursor-pointer">
                <div className="w-full h-full bg-brand-800 flex items-center justify-center text-gold-300 text-xs font-bold">
                  {session.full_name.charAt(0)}
                </div>
              </div>
              <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border border-brand-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="px-4 py-2 border-b border-brand-100 mb-1">
                  <p className="text-sm font-bold text-brand-900 truncate">{session.full_name}</p>
                  <p className="text-xs text-brand-900/60 truncate">{session.role === 'customer' ? 'ผู้ซื้อ' : session.role === 'artisan' ? 'ช่างทอ' : session.role === 'designer' ? 'นักออกแบบ' : 'ผู้ดูแลระบบ'}</p>
                </div>
                <button
                  onClick={() => {
                    clearSession();
                    setSession(null);
                    router.push("/");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-brand-50 transition-colors"
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="ml-2 block rounded-full overflow-hidden border border-gold-300/30 w-8 h-8">
              <img src="/uploads/thai_fabric_image_01.jpg" alt="User Profile" className="w-full h-full object-cover" />
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white hover:text-gold-300 transition-colors ml-2"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-brand-900/95 backdrop-blur-md border-t border-white/10 px-6 py-6 space-y-4 text-sm font-medium text-white/90">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block hover:text-gold-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-white/10" />
          <Link href="/cart" onClick={() => setOpen(false)} className="block hover:text-gold-300 transition-colors">
            ตะกร้าสินค้า ({cartCount})
          </Link>
          {session ? (
            <button
              onClick={() => {
                clearSession();
                setSession(null);
                setOpen(false);
                router.push("/");
              }}
              className="block w-full text-left text-red-400 hover:text-red-300 transition-colors"
            >
              ออกจากระบบ
            </button>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="block text-gold-400 hover:text-gold-300 transition-colors">
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
