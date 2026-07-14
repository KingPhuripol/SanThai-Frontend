import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ChevronRight, ChevronLeft, ShieldCheck, ChevronDown, SlidersHorizontal, Sparkles } from "lucide-react";
import { productsApi, fabricsApi } from "@/lib/api";

async function getData() {
  try {
    const [products, fabrics] = await Promise.all([
      productsApi.list({ limit: 4 }),
      fabricsApi.list({ limit: 8 }),
    ]);
    return { products, fabrics };
  } catch {
    return { products: [], fabrics: [] };
  }
}

export default async function HomePage() {
  const { fabrics } = await getData();

  return (
    <div className="min-h-screen bg-brand-900 selection:bg-brand-300 selection:text-white pb-20 overflow-hidden">
      
      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <section className="relative w-full h-[90vh] min-h-[700px] flex items-center pt-10">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* We use a placeholder image; in reality, this would be the model in Thai silk */}
          <div className="absolute inset-0 bg-brand-900/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/80 to-transparent z-10 w-full lg:w-2/3" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/80 via-transparent to-brand-900 z-10" />
          <Image
            src="/uploads/thai_fabric_image.jpg"
            alt="Thai Silk"
            fill
            sizes="100vw"
            className="object-cover object-top opacity-70 scale-105"
            priority
          />
        </div>

        {/* Content Container */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Typography */}
          <div className="text-white space-y-6 max-w-xl">
            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold thai-serif leading-[1.1] text-gold-400 drop-shadow-xl tracking-tight">
              ผ้าไทย
              <br />
              <span className="text-white">เรื่องราวแห่งตัวตน</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-[1.8] font-light max-w-md">
              เชื่อมโยงคุณสู่ความงดงามที่มีความหมาย
              <br />
              จากภูมิปัญญา สู่สไตล์ที่เป็นคุณ
            </p>
            <div className="pt-6">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-300 to-gold-500 text-brand-950 font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] group"
              >
                ค้นหาตัวตนของคุณ
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Side: Quiz Card */}
          <div className="hidden lg:block relative justify-self-end w-full max-w-[380px]">
            <div className="bg-[#FAF6ED] rounded-[32px] p-10 shadow-2xl relative overflow-hidden text-center border border-white/50">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-bl-[100px]" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-900/5 rounded-tr-[100px]" />
              
              <h2 className="text-[28px] font-bold thai-serif text-brand-900 mb-2 leading-tight">ค้นหาตัวตนที่ใช่</h2>
              <p className="text-sm text-brand-900/60 mb-8 leading-relaxed">
                ผ่านแบบสอบถาม 5 นาที
                <br />เพื่อค้นหาผ้าที่สะท้อนตัวตนของคุณ
              </p>

              {/* Circle Avatar Image */}
              <div className="relative w-48 h-48 mx-auto mb-8 rounded-full overflow-hidden border-[6px] border-white shadow-xl">
                <Image
                  src="/uploads/thai_fabric_image_01.jpg"
                  alt="Quiz"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                />
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-brand-200 border-2 border-white overflow-hidden"><Image src="/uploads/thai_fabric_image_02.jpg" alt="User" width={28} height={28} className="object-cover h-full"/></div>
                  <div className="w-7 h-7 rounded-full bg-brand-300 border-2 border-white overflow-hidden"><Image src="/uploads/thai_fabric_01.jpg" alt="User" width={28} height={28} className="object-cover h-full"/></div>
                  <div className="w-7 h-7 rounded-full bg-brand-900 border-2 border-white overflow-hidden"><Image src="/uploads/thai_fabric_amnat_charoen.jpg" alt="User" width={28} height={28} className="object-cover h-full"/></div>
                </div>
                <p className="text-xs text-brand-900/50 font-medium">มีคนค้นพบตัวตนแล้ว 12,458 คน</p>
              </div>

              <Link
                href="/quiz"
                className="flex items-center justify-between w-full px-6 py-4 bg-brand-900 text-white rounded-full hover:bg-brand-800 transition-colors shadow-lg"
              >
                <span className="font-medium text-sm w-full text-center pl-4">เริ่มค้นหาตัวตนของคุณ</span>
                <ChevronRight size={18} className="text-gold-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES BAR ────────────────────────────────────────── */}
      <section className="relative z-30 max-w-[1400px] mx-auto px-6 -mt-8">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 lg:gap-2 py-6 border-b border-white/10">
          {[
            { icon: <Sparkles className="text-gold-400" size={24} strokeWidth={1.5} />, title: "ภูมิปัญญาไทย", subtitle: "สืบสานจากรุ่นสู่รุ่น" },
            { icon: <div className="w-6 h-6 rounded-sm border border-gold-400 grid grid-cols-2 gap-[2px] p-[2px]"><div className="bg-gold-400/50 rounded-[1px]" /><div className="bg-gold-400 rounded-[1px]" /><div className="bg-gold-400 rounded-[1px]" /><div className="bg-gold-400/50 rounded-[1px]" /></div>, title: "งานศิลป์ที่มีชีวิต", subtitle: "ทอด้วยใจ ใส่ด้วยความหมาย" },
            { icon: <div className="text-gold-400 flex"><div className="w-3 h-5 border-l-2 border-b-2 border-gold-400 rounded-bl-full" /><div className="w-3 h-5 border-r-2 border-t-2 border-gold-400 rounded-tr-full -ml-[2px] mt-1" /></div>, title: "เป็นมิตรต่อโลก", subtitle: "เลือกสิ่งที่ดีต่อคุณและโลก" },
            { icon: <div className="flex -space-x-1"><div className="w-4 h-4 rounded-full border border-gold-400 bg-brand-900" /><div className="w-4 h-4 rounded-full border border-gold-400 bg-brand-900" /><div className="w-4 h-4 rounded-full border border-gold-400 bg-brand-900" /></div>, title: "สนับสนุนชุมชน", subtitle: "สร้างรายได้สู่ท้องถิ่น" },
            { icon: <ShieldCheck className="text-gold-400" size={24} strokeWidth={1.5} />, title: "ปลอดภัย มั่นใจ", subtitle: "จากทุกการสั่งซื้อ" },
          ].map((feat, i) => (
            <div key={i} className="flex items-center gap-3">
              {feat.icon}
              <div>
                <h3 className="text-white text-[13px] font-bold">{feat.title}</h3>
                <p className="text-white/50 text-[10px]">{feat.subtitle}</p>
              </div>
              {i < 4 && <div className="hidden lg:block w-px h-6 bg-white/10 ml-8" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── FABRIC MARKETPLACE ──────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 mt-12 md:mt-16">
        <div className="bg-brand-50 rounded-[32px] p-6 md:p-10 shadow-2xl">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold thai-serif text-brand-900 flex items-center gap-3">
              <span className="text-gold-400 text-2xl">❁</span>
              ตลาดผ้า : รวมผ้าไทยทุกชนิดจากทั่วประเทศ
            </h2>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col xl:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-900/40" size={18} />
              <input 
                type="text" 
                placeholder="ค้นหาผ้า หรือเรื่องราว..." 
                className="w-full bg-white border border-brand-200 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 shadow-sm"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide flex-1">
              {[
                { label: "ประเภทผ้า", icon: true },
                { label: "เทคนิคการทอ" },
                { label: "สี" },
                { label: "ช่วงราคา" },
                { label: "แหล่งผลิต" }
              ].map((filter, i) => (
                <button key={i} className="flex-shrink-0 flex items-center gap-2 bg-white border border-brand-200 px-4 py-2.5 rounded-full text-[13px] text-brand-900/70 hover:border-brand-900 hover:bg-brand-100 transition-colors shadow-sm">
                  {filter.icon && <span className="text-gold-400">❁</span>}
                  {filter.label}
                  <ChevronDown size={14} className="opacity-40" />
                </button>
              ))}
              
              <button className="flex-shrink-0 flex items-center gap-2 bg-brand-200/50 px-5 py-2.5 rounded-full text-[13px] font-medium text-brand-900 hover:bg-brand-300 transition-colors ml-auto xl:ml-2">
                ตัวกรอง <SlidersHorizontal size={14} />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-wrap gap-2">
              {["ผ้าไหม", "ผ้าฝ้าย", "ผ้าย้อมคราม", "ผ้าทอมือ", "ผ้ามัดหมี่", "ผ้าลายโบราณ", "ผ้าไทยร่วมสมัย", "Sustainable"].map((tag) => (
                <span key={tag} className="bg-brand-100/70 text-brand-900/60 px-3 py-1.5 rounded-full text-[11px] font-medium cursor-pointer hover:bg-brand-200 transition-colors">
                  # {tag}
                </span>
              ))}
            </div>
            <Link href="/marketplace" className="hidden md:flex items-center gap-1 text-[13px] font-medium text-brand-900/60 hover:text-brand-900">
              ดูทั้งหมด <ChevronRight size={14} />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="relative group/carousel">
            {/* Nav Buttons for Carousel */}
            <button className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-900 text-white rounded-full flex items-center justify-center shadow-lg z-10 hover:bg-brand-800 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
              <ChevronLeft size={20} />
            </button>
            <button className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-900 text-white rounded-full flex items-center justify-center shadow-lg z-10 hover:bg-brand-800 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
              <ChevronRight size={20} />
            </button>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "ผ้าไหมมัดหมี่ลายโบราณ", loc: "จ.สุรินทร์", price: "2,850", img: "/uploads/thai_fabric_amnat_charoen_01.jpg" },
                { name: "ผ้าย้อมครามธรรมชาติ", loc: "จ.สกลนคร", price: "1,650", img: "/uploads/thai_fabric_01.jpg" },
                { name: "ผ้ามัดหมี่ลายดอกแก้ว", loc: "จ.อุบลราชธานี", price: "2,150", img: "/uploads/thai_fabric_amnat_charoen_046.jpg" },
                { name: "ผ้าไหมแพรวา", loc: "จ.กาฬสินธุ์", price: "3,250", img: "/uploads/thai_fabric_amnat_charoen.jpg" },
                { name: "ผ้าทอมือยกดอก", loc: "จ.เชียงใหม่", price: "2,450", img: "/uploads/thai_fabric_image_01.jpg" },
                { name: "ผ้าขิดลายโบราณ", loc: "จ.อำนาจเจริญ", price: "1,950", img: "/uploads/thai_fabric_image_02.jpg" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm border border-brand-200/50 group cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={item.img} alt={item.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <button className="absolute top-2 right-2 p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors">
                      <Heart size={14} />
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="text-[13px] font-bold text-brand-900 truncate mb-1" title={item.name}>{item.name}</h4>
                    <p className="text-[10px] text-brand-900/50 mb-3">{item.loc}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm font-bold text-brand-900 thai-serif">฿{item.price}</span>
                      <button className="text-brand-900/20 hover:text-red-500 transition-colors">
                        <Heart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-8">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-900/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-900/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-900" />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-900/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-900/20" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER FEATURES ─────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 mt-12">
        <div className="flex flex-wrap justify-between items-center py-6 border-t border-white/10 text-white/80 gap-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-gold-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-white">จัดส่งทั่วไทย</p>
              <p className="text-[10px] text-white/50">รวดเร็ว ปลอดภัย</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-gold-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-white">คืนสินค้าได้ง่าย</p>
              <p className="text-[10px] text-white/50">ภายใน 7 วัน</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-gold-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-white">ชำระเงินปลอดภัย</p>
              <p className="text-[10px] text-white/50">หลากหลายช่องทาง</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-gold-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-white">บริการลูกค้า</p>
              <p className="text-[10px] text-white/50">พร้อมดูแลคุณ</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <div className="w-6 h-6 rounded-full bg-[#00B900] flex items-center justify-center text-white font-bold text-[8px]">
              LINE
            </div>
            <div>
              <p className="text-xs font-bold text-white">@santhai</p>
              <p className="text-[9px] text-white/50">เชื่อมต่อกับเรา</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
