"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, Sparkles, ShieldCheck, Globe2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-900 pb-20 pt-[80px]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/50 mb-10 font-medium">
          <Link href="/" className="hover:text-gold-300 transition-colors">หน้าหลัก</Link>
          <span><ChevronRight size={14}/></span>
          <span className="text-white/90">เกี่ยวกับเรา</span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white thai-serif leading-tight mb-6">
            สานไทย <br />
            <span className="text-gold-400 text-3xl md:text-4xl mt-2 block">ถักทอภูมิปัญญาไทย สู่โลกดิจิทัล</span>
          </h1>
          <p className="text-lg text-brand-200 leading-relaxed">
            เราคือแพลตฟอร์มที่มุ่งมั่นยกระดับผ้าทอมือไทยและงานหัตถกรรมพื้นบ้าน 
            ด้วยการผสานเทคโนโลยี AI และ Blockchain เพื่อสร้างความโปร่งใส 
            เชื่อมต่อช่างทอสู่ตลาดสากล และอนุรักษ์มรดกทางวัฒนธรรมให้คงอยู่ตลอดไป
          </p>
        </div>

        {/* Main Image */}
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[32px] overflow-hidden shadow-2xl mb-24 border border-white/10">
          <Image 
            src="/uploads/thai_fabric_image_01.jpg" 
            alt="Thai Weaving" 
            fill 
            className="object-cover" 
            priority
          />
          <div className="absolute inset-0 bg-brand-900/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/20 to-transparent" />
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-24">
          <div className="bg-[#FAF6ED] rounded-[32px] p-10 lg:p-14 shadow-xl">
            <div className="w-16 h-16 bg-gold-400 rounded-2xl flex items-center justify-center text-brand-900 mb-8 shadow-lg">
              <Sparkles size={32} />
            </div>
            <h2 className="text-3xl font-bold text-brand-900 thai-serif mb-4">พันธกิจของเรา (Mission)</h2>
            <p className="text-brand-900/70 leading-[1.8] text-lg">
              สร้างพื้นที่ที่ช่างทอผ้าไทยสามารถกำหนดราคาผลงานของตนเองได้อย่างเป็นธรรม 
              บอกเล่าเรื่องราวเบื้องหลังเส้นด้ายทุกเส้น และส่งมอบงานศิลป์ที่ทรงคุณค่า
              สู่มือผู้บริโภคที่หลงใหลในความงามแห่งอัตลักษณ์ไทยโดยตรง
            </p>
          </div>
          
          <div className="bg-brand-800 rounded-[32px] p-10 lg:p-14 shadow-xl border border-white/5">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-gold-400 mb-8 shadow-lg">
              <Globe2 size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white thai-serif mb-4">วิสัยทัศน์ (Vision)</h2>
            <p className="text-brand-200 leading-[1.8] text-lg">
              ผลักดันให้ "ผ้าไทย" กลายเป็น Soft Power ที่ได้รับการยอมรับในระดับโลก 
              ผ่านนวัตกรรมที่น่าเชื่อถือ (Digital ID) และการออกแบบที่ตอบโจทย์วิถีชีวิตยุคใหม่ 
              เพื่อให้ภูมิปัญญานี้เติบโตได้อย่างยั่งยืน
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white thai-serif text-center mb-12">สิ่งที่เราให้ความสำคัญ</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: <Heart size={28} />, 
                title: "Fair Trade", 
                desc: "ค้าขายอย่างเป็นธรรม รายได้ส่งตรงถึงมือช่างทอและชุมชนโดยไม่ผ่านคนกลางที่เอารัดเอาเปรียบ" 
              },
              { 
                icon: <ShieldCheck size={28} />, 
                title: "Provenance", 
                desc: "ตรวจสอบแหล่งที่มาได้ 100% ผ่านระบบ Digital ID และ Blockchain มั่นใจได้ว่าเป็นของแท้" 
              },
              { 
                icon: <Sparkles size={28} />, 
                title: "Modern Heritage", 
                desc: "นำลวดลายโบราณมาประยุกต์และนำเสนอในมุมมองใหม่ ให้เข้ากับแฟชั่นและไลฟ์สไตล์ปัจจุบัน" 
              }
            ].map((value, idx) => (
              <div key={idx} className="bg-brand-800/50 backdrop-blur-sm border border-white/10 rounded-[24px] p-8 hover:bg-brand-800 transition-colors">
                <div className="text-gold-400 mb-6">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3 thai-serif">{value.title}</h3>
                <p className="text-brand-300 leading-relaxed text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-10">
          <Link href="/marketplace" className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-gold-400 to-gold-500 text-brand-950 font-bold rounded-full hover:opacity-90 transition-all shadow-[0_4px_15px_rgba(212,175,55,0.3)] text-lg">
            ร่วมสนับสนุนชุมชนทอผ้า
          </Link>
        </div>

      </div>
    </div>
  );
}
