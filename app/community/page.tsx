"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin, Users, Heart, Star, ArrowRight } from "lucide-react";

export default function CommunityPage() {
  const communities = [
    {
      id: 1,
      name: "กลุ่มทอผ้าไหมมัดหมี่บ้านดงบัง",
      province: "ขอนแก่น",
      members: 45,
      rating: 4.9,
      image: "/uploads/thai_fabric_image_01.jpg",
      description: "สืบทอดภูมิปัญญาการมัดหมี่ด้วยสีธรรมชาติ ลวดลายเป็นเอกลักษณ์เฉพาะตัว",
      tags: ["ย้อมสีธรรมชาติ", "ไหมแท้ 100%"]
    },
    {
      id: 2,
      name: "ชุมชนทอผ้าไหมแพรวา",
      province: "กาฬสินธุ์",
      members: 120,
      rating: 5.0,
      image: "/uploads/thai_fabric_amnat_charoen_01.jpg",
      description: "ราชินีแห่งไหมไทย ถักทอด้วยความประณีตระดับงานศิลปะชั้นสูง",
      tags: ["ผ้าตีนจก", "งานละเอียด"]
    },
    {
      id: 3,
      name: "กลุ่มแม่บ้านทอผ้าสีธรรมชาติ",
      province: "สุรินทร์",
      members: 32,
      rating: 4.8,
      image: "/uploads/thai_fabric_01.jpg",
      description: "โดดเด่นเรื่องการใช้สีจากเปลือกไม้และใบไม้ในท้องถิ่น อนุรักษ์สิ่งแวดล้อม",
      tags: ["สีเปลือกไม้", "รักษ์โลก"]
    },
    {
      id: 4,
      name: "กลุ่มทอผ้าฝ้ายเข็นมือ",
      province: "เชียงใหม่",
      members: 58,
      rating: 4.7,
      image: "/uploads/thai_fabric_image_02.jpg",
      description: "งานทอมือสไตล์ล้านนาประยุกต์ เหมาะสำหรับไลฟ์สไตล์คนรุ่นใหม่",
      tags: ["ผ้าฝ้าย", "ทอมือ"]
    },
    {
      id: 5,
      name: "วิสาหกิจชุมชนทอผ้าตีนจก",
      province: "สุโขทัย",
      members: 75,
      rating: 4.9,
      image: "/uploads/thai_fabric_amnat_charoen_046.jpg",
      description: "ลวดลายโบราณที่สืบทอดมากว่า 200 ปี เน้นความปราณีตและสีสันสดใส",
      tags: ["ลายโบราณ", "ตีนจก"]
    },
    {
      id: 6,
      name: "กลุ่มทอผ้ามัดก่าน",
      province: "น่าน",
      members: 24,
      rating: 4.8,
      image: "/uploads/thai_fabric_amnat_charoen.jpg",
      description: "ผ้าทอชนเผ่าที่มีเรื่องราวและวิถีชีวิตแฝงอยู่ในทุกลายเส้น",
      tags: ["ลวดลายชนเผ่า", "ย้อมคราม"]
    }
  ];

  return (
    <div className="min-h-screen bg-brand-900 pb-24 pt-[80px]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/50 mb-10 font-medium">
          <Link href="/" className="hover:text-gold-300 transition-colors">หน้าหลัก</Link>
          <span><ChevronRight size={14}/></span>
          <span className="text-white/90">ชุมชนผู้สร้างสรรค์</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white thai-serif leading-tight mb-4">
              ชุมชน<span className="text-gold-400">ผู้สร้างสรรค์</span>
            </h1>
            <p className="text-brand-200 text-lg leading-relaxed">
              ทำความรู้จักและสนับสนุนกลุ่มช่างทอผ้าจากทั่วประเทศไทย 
              ผู้สืบทอดภูมิปัญญาท้องถิ่นและศิลปะการทอผ้าที่ส่งผ่านจากรุ่นสู่รุ่น
            </p>
          </div>
          <Link 
            href="/marketplace" 
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all whitespace-nowrap"
          >
            เลือกซื้อสินค้าชุมชน <ArrowRight size={16} />
          </Link>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {communities.map((community) => (
            <div key={community.id} className="bg-[#FAF6ED] rounded-[24px] overflow-hidden shadow-xl group hover:-translate-y-2 transition-transform duration-300">
              
              {/* Image Section */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image 
                  src={community.image} 
                  alt={community.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" />
                
                {/* Location Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-brand-900/80 backdrop-blur-md rounded-lg text-white text-xs font-bold border border-white/20">
                  <MapPin size={14} className="text-gold-400" />
                  จ.{community.province}
                </div>
                
                {/* Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 bg-white/90 rounded-full text-brand-900 text-xs font-bold shadow-md">
                  <Star size={12} fill="#d4af37" className="text-gold-500" />
                  {community.rating}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-brand-900 thai-serif mb-2 line-clamp-1">
                  {community.name}
                </h2>
                <p className="text-brand-900/60 text-sm leading-[1.7] mb-6 line-clamp-2">
                  {community.description}
                </p>

                <div className="flex items-center gap-4 text-xs font-medium text-brand-900/50 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} /> สมาชิก {community.members} คน
                  </div>
                  <div className="flex items-center gap-1.5 text-gold-600 bg-gold-50 px-2 py-1 rounded-md">
                    <Heart size={14} /> ผู้ติดตาม 1.2k
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {community.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white border border-brand-200 text-brand-900/70 text-[10px] font-bold rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link 
                  href="#" 
                  className="block w-full py-3.5 bg-brand-900 hover:bg-brand-800 text-white text-center rounded-xl text-sm font-bold transition-colors"
                >
                  เยี่ยมชมร้านค้าชุมชน
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-20 bg-brand-800 border border-white/10 rounded-[32px] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/uploads/thai_fabric_image.jpg')] bg-cover bg-center opacity-5 mix-blend-overlay" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white thai-serif mb-4">อยากร่วมเป็นส่วนหนึ่งของ SanThai?</h2>
            <p className="text-brand-200 mb-8 max-w-2xl mx-auto">
              หากคุณเป็นช่างทอผ้า กลุ่มแม่บ้าน หรือวิสาหกิจชุมชนที่กำลังมองหาช่องทางจัดจำหน่าย 
              และต้องการเพิ่มมูลค่าให้ผลงานด้วยเทคโนโลยี Digital ID
            </p>
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-400 hover:bg-gold-300 text-brand-950 font-bold rounded-full transition-colors shadow-lg"
            >
              ลงทะเบียนเป็นผู้ขาย
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
