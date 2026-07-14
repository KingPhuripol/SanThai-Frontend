"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productsApi } from "@/lib/api";
import { 
  ChevronLeft, 
  UploadCloud, 
  CheckCircle2, 
  Tag, 
  Info, 
  Award, 
  Palette,
  Ruler,
  Truck,
  Eye,
  Camera,
  X
} from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();

  // Basic Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    tags: [] as string[],
    certifications: [] as string[],
    peacockLevel: "",
    productType: "",
    preparationTime: "",
    
    // Details
    color: "",
    material: "",
    productionMethod: "",
    weight: "",
    
    // Media
    quantity: "",
    size: "",
    
    // Shipping
    shippingProvider: "",
    shippingCost: "",
    freeShipping: false
  });

  const [currentTag, setCurrentTag] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const predefinedTags = ["OTOP", "ผ้าไหมแท้", "งานทำมือ", "ย้อมสีธรรมชาติ", "ผ้าฝ้าย", "สีคราม", "ลายโบราณ"];
  const colorOptions = ["แดงดั่งเลือดนก (แดงสด)", "ครามธรรมชาติ (น้ำเงินเข้ม)", "เหลืองทอง (เหลืองดอกคูน)", "เขียวมะกอก", "ดำนิล", "ชมพูกลีบบัว", "ขาวมุก"];
  const materialOptions = ["ไหมแท้ 100%", "ฝ้ายแท้", "ไหมแกมฝ้าย", "ใยกัญชง", "เรยอน"];
  const methodOptions = ["มัดหมี่", "ขิด", "จก", "ยกดอก", "ทอขัดธรรมดา"];

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const toggleCert = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert) 
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.price || !formData.quantity) {
      alert("กรุณากรอกข้อมูลที่จำเป็น (ชื่อสินค้า, ราคา, จำนวน) ให้ครบถ้วน");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      // For Hackathon, hardcode fabric_id = 1 if none provided (as a fallback)
      fd.append("fabric_id", "1"); 
      fd.append("title_th", formData.title);
      fd.append("price_thb", formData.price);
      fd.append("stock", formData.quantity);
      
      let cat = "other";
      if (formData.material.includes("ไหม")) cat = "silk";
      else if (formData.material.includes("ฝ้าย")) cat = "cotton";
      fd.append("category", cat);
      
      // Pack extra details into description
      const extraDetails = `
${formData.description}
        
**รายละเอียดเพิ่มเติม:**
- ประเภทสินค้า: ${formData.productType === 'ready_to_ship' ? 'พร้อมจัดส่ง' : formData.productType === 'pre_order' ? 'พรีออเดอร์' : formData.productType === 'made_to_order' ? 'สั่งทำ' : '-'}
- ระยะเวลาจัดเตรียม: ${formData.preparationTime || '-'}
- สี: ${formData.color || '-'}
- วัสดุ: ${formData.material || '-'}
- วิธีทอ: ${formData.productionMethod || '-'}
- ขนาด: ${formData.size || '-'}
- น้ำหนัก: ${formData.weight ? formData.weight + ' กรัม' : '-'}
- Tags: ${formData.tags.join(', ')}
- นกยูงพระราชทาน: ${formData.peacockLevel === 'gold' ? 'สีทอง' : formData.peacockLevel === 'silver' ? 'สีเงิน' : formData.peacockLevel === 'blue' ? 'สีน้ำเงิน' : formData.peacockLevel === 'green' ? 'สีเขียว' : '-'}
- ขนส่ง: ${formData.shippingProvider} (ฟรี: ${formData.freeShipping ? 'ใช่' : 'ไม่ใช่'}, ค่าส่ง: ${formData.shippingCost})
      `.trim();
      
      fd.append("description_th", extraDetails);
      
      if (imageFile) {
        fd.append("image", imageFile);
      }
      
      await productsApi.upload(fd);
      alert("เพิ่มสินค้าสำเร็จ!");
      router.push("/store");
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-24 pb-32">
      
      {/* Sticky Header */}
      <div className="fixed top-20 left-0 w-full bg-white/80 backdrop-blur-md border-b border-brand-200/50 z-40">
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/store" className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-900 hover:bg-brand-100 transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-lg font-bold text-brand-950 thai-serif">เพิ่มสินค้าใหม่</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-bold text-brand-900 hover:bg-brand-50 rounded-full transition-colors">
              บันทึกแบบร่าง
            </button>
            <button className="px-6 py-2 bg-brand-900 text-white text-sm font-bold rounded-full shadow-md hover:bg-brand-800 transition-colors">
              เผยแพร่สินค้า
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 flex overflow-x-auto scrollbar-hide gap-6 border-t border-brand-100/50">
          {[
            { id: "section-1", num: 1, label: "ข้อมูลพื้นฐาน", icon: <Info size={16}/> },
            { id: "section-2", num: 2, label: "รายละเอียด", icon: <Palette size={16}/> },
            { id: "section-3", num: 3, label: "สื่อประกอบ", icon: <Camera size={16}/> },
            { id: "section-4", num: 4, label: "การจัดส่ง", icon: <Truck size={16}/> },
            { id: "section-5", num: 5, label: "พรีวิวตัวอย่าง", icon: <Eye size={16}/> },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.num);
                scrollToSection(tab.id);
              }}
              className={`flex items-center gap-2 py-3 text-[13px] font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.num 
                  ? "border-gold-400 text-brand-900" 
                  : "border-transparent text-brand-900/40 hover:text-brand-900/70"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 md:px-8 mt-16 space-y-8">
        
        {/* 1. ข้อมูลพื้นฐาน */}
        <section id="section-1" className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-brand-200/50 scroll-mt-48">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-900 font-bold">1</div>
            <h2 className="text-xl font-bold text-brand-950 thai-serif">ข้อมูลพื้นฐาน</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">ชื่อสินค้า <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="เช่น ผ้าไหมมัดหมี่ ลายขอพระราชทาน"
                className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">ประเภทสินค้า (Product Type) <span className="text-red-500">*</span></label>
              <select
                className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all bg-white appearance-none"
                value={formData.productType || ""}
                onChange={e => setFormData({...formData, productType: e.target.value})}
              >
                <option value="" disabled>เลือกประเภทสินค้า...</option>
                <option value="ready_to_ship">พร้อมจัดส่ง</option>
                <option value="pre_order">พรีออเดอร์</option>
                <option value="made_to_order">สั่งทำ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">ระยะเวลาการจัดเตรียมสินค้า (Preparation Time)</label>
              <input 
                type="text" 
                placeholder="เช่น 1-3 วัน, 2 สัปดาห์"
                className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                value={formData.preparationTime || ""}
                onChange={e => setFormData({...formData, preparationTime: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">คำอธิบายสินค้า</label>
              <textarea 
                rows={4}
                placeholder="เล่าเรื่องราว ความเป็นมา และแรงบันดาลใจในการทอผ้าผืนนี้..."
                className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all resize-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">Tags คุณสมบัติเด่น</label>
              
              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map(tag => (
                  <div key={tag} className="flex items-center gap-1 bg-brand-900 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                    <Tag size={12} className="text-gold-400" />
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-300 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Tag Input & Suggestions */}
              <div className="flex items-center gap-2 mb-3">
                <input 
                  type="text" 
                  placeholder="พิมพ์ Tag ใหม่แล้วกด Enter..."
                  className="flex-1 border border-brand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(currentTag);
                    }
                  }}
                />
                <button 
                  onClick={() => handleAddTag(currentTag)}
                  className="px-4 py-2.5 bg-brand-100 text-brand-900 rounded-xl text-sm font-bold hover:bg-brand-200 transition-colors"
                >
                  เพิ่ม Tag
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-brand-900/50 py-1.5">แนะนำ:</span>
                {predefinedTags.filter(t => !formData.tags.includes(t)).map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => handleAddTag(tag)}
                    className="bg-white border border-brand-200 text-brand-900/70 px-3 py-1.5 rounded-full text-xs font-medium hover:border-gold-400 hover:text-brand-900 transition-all"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Certification */}
            <div className="p-5 bg-gradient-to-r from-gold-400/10 to-transparent border border-gold-400/20 rounded-xl">
              <label className="block text-sm font-bold text-brand-950 mb-1 flex items-center gap-2">
                <Award size={18} className="text-gold-500" />
                เครื่องหมายรับรองตรานกยูงพระราชทาน
              </label>
              <p className="text-xs text-brand-900/60 mb-4">เพิ่มความน่าเชื่อถือให้กับสินค้าของคุณ (เลือกระดับของตรานกยูง)</p>
              
              <select
                className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all bg-white appearance-none"
                value={formData.peacockLevel || ""}
                onChange={e => {
                  const level = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    peacockLevel: level,
                    certifications: level ? ["นกยูงพระราชทาน"] : []
                  }));
                }}
              >
                <option value="">ไม่มีตรานกยูงพระราชทาน</option>
                <option value="gold">นกยูงสีทอง (Royal Thai Silk)</option>
                <option value="silver">นกยูงสีเงิน (Classic Thai Silk)</option>
                <option value="blue">นกยูงสีน้ำเงิน (Thai Silk)</option>
                <option value="green">นกยูงสีเขียว (Thai Silk Blend)</option>
              </select>
              {formData.peacockLevel && (
                <p className="text-xs text-brand-900/60 mt-3">ระบบจะขอให้คุณแนบเอกสารรับรองหลังจากการเผยแพร่สินค้า</p>
              )}
            </div>
          </div>
        </section>

        {/* 2. รายละเอียดสินค้า */}
        <section id="section-2" className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-brand-200/50 scroll-mt-48">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-900 font-bold">2</div>
            <h2 className="text-xl font-bold text-brand-950 thai-serif">รายละเอียดสินค้า</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">สี (Color)</label>
              <div className="relative">
                <input 
                  type="text" 
                  list="color-options"
                  placeholder="พิมพ์หรือเลือกสี..."
                  className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all bg-white"
                  value={formData.color}
                  onChange={e => setFormData({...formData, color: e.target.value})}
                />
                <datalist id="color-options">
                  {colorOptions.map(c => <option key={c} value={c} />)}
                </datalist>
                <p className="text-[11px] text-brand-900/50 mt-1.5 ml-1">พิมพ์เพื่อค้นหาสีจากระบบ หรือระบุสีของคุณเอง</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">วัสดุ (Material)</label>
              <div className="relative">
                <input 
                  type="text" 
                  list="material-options"
                  placeholder="เช่น ไหมแท้ 100%, ฝ้าย"
                  className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all bg-white"
                  value={formData.material}
                  onChange={e => setFormData({...formData, material: e.target.value})}
                />
                <datalist id="material-options">
                  {materialOptions.map(m => <option key={m} value={m} />)}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">วิธีการผลิต (Production Method)</label>
              <div className="relative">
                <input 
                  type="text" 
                  list="method-options"
                  placeholder="เช่น มัดหมี่, ขิด, ยก, จก"
                  className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all bg-white"
                  value={formData.productionMethod}
                  onChange={e => setFormData({...formData, productionMethod: e.target.value})}
                />
                <datalist id="method-options">
                  {methodOptions.map(m => <option key={m} value={m} />)}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">ราคา (บาท) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full border border-brand-200 rounded-xl pl-4 pr-16 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
                <div className="absolute right-0 top-0 h-full flex items-center pr-4 text-brand-900/50 font-bold bg-transparent pointer-events-none">
                  บาท
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">น้ำหนัก <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full border border-brand-200 rounded-xl pl-4 pr-16 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: e.target.value})}
                />
                <div className="absolute right-0 top-0 h-full flex items-center pr-4 text-brand-900/50 font-bold bg-transparent pointer-events-none">
                  กรัม
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. สื่อประกอบสินค้า */}
        <section id="section-3" className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-brand-200/50 scroll-mt-48">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-900 font-bold">3</div>
            <h2 className="text-xl font-bold text-brand-950 thai-serif">สื่อประกอบสินค้า</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">จำนวนสินค้า (คลัง)</label>
              <input 
                type="number" 
                placeholder="ระบุจำนวนชิ้น"
                className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">ไซส์ / ขนาด (กว้าง x ยาว)</label>
              <input 
                type="text" 
                placeholder="เช่น 100 x 200 ซม."
                className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                value={formData.size}
                onChange={e => setFormData({...formData, size: e.target.value})}
              />
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-bold text-brand-950 mb-2">รูปภาพสินค้า</label>
            <p className="text-xs text-brand-900/50 mb-4">แนะนำให้อัปโหลดภาพรวม (เห็นทั้งผืน) และภาพซูมรายละเอียด (ลายทอ, เนื้อผ้า) อย่างน้อย 3 ภาพ</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Primary Image Slot */}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="relative overflow-hidden aspect-[3/4] border-2 border-dashed border-gold-400 bg-gold-400/5 rounded-2xl flex flex-col items-center justify-center text-gold-500 hover:bg-gold-400/10 transition-colors group"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud size={24} />
                    </div>
                    <span className="text-sm font-bold mb-1">ภาพหลัก</span>
                    <span className="text-[10px] text-brand-900/40 font-medium">(เห็นเต็มผืน)</span>
                  </>
                )}
              </button>
              
              {/* Secondary Slots */}
              {[1, 2, 3].map((slot) => (
                <button key={slot} className="aspect-[3/4] border-2 border-dashed border-brand-200 bg-brand-50 rounded-2xl flex flex-col items-center justify-center text-brand-900/40 hover:bg-brand-100 hover:border-brand-300 transition-colors group">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    <Camera size={20} />
                  </div>
                  <span className="text-xs font-bold mb-1">ภาพเพิ่มเติม</span>
                  <span className="text-[10px] text-brand-900/40 font-medium text-center px-2">(เนื้อผ้า, ลายทอ)</span>
                </button>
              ))}

            </div>
          </div>
        </section>

        {/* 4. การจัดส่ง */}
        <section id="section-4" className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-brand-200/50 scroll-mt-48">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-900 font-bold">4</div>
            <h2 className="text-xl font-bold text-brand-950 thai-serif">การจัดส่ง</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">ผู้ให้บริการขนส่ง (Shipping Provider)</label>
              <select 
                className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all bg-white appearance-none"
                value={formData.shippingProvider}
                onChange={e => setFormData({...formData, shippingProvider: e.target.value})}
              >
                <option value="" disabled>เลือกผู้ให้บริการ...</option>
                <option value="thailand_post">ไปรษณีย์ไทย (Thailand Post)</option>
                <option value="kerry">Kerry Express</option>
                <option value="flash">Flash Express</option>
                <option value="jnt">J&T Express</option>
                <option value="other">อื่นๆ (ตกลงกับผู้ซื้อ)</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-brand-950 mb-2">ค่าจัดส่ง (บาท)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0"
                    disabled={formData.freeShipping}
                    className={`w-full border rounded-xl pl-4 pr-16 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all ${formData.freeShipping ? 'bg-brand-50 border-brand-100 text-brand-900/30' : 'bg-white border-brand-200'}`}
                    value={formData.freeShipping ? "0" : formData.shippingCost}
                    onChange={e => setFormData({...formData, shippingCost: e.target.value})}
                  />
                  <div className="absolute right-0 top-0 h-full flex items-center pr-4 text-brand-900/50 font-bold bg-transparent pointer-events-none">
                    บาท
                  </div>
                </div>
              </div>

              <div className="pt-2 sm:pt-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.freeShipping ? 'bg-gold-400' : 'bg-brand-200'}`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.freeShipping ? 'translate-x-6' : ''}`}></div>
                  </div>
                  <span className="text-sm font-bold text-brand-900">จัดส่งฟรี (Free Shipping)</span>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={formData.freeShipping}
                    onChange={e => setFormData({...formData, freeShipping: e.target.checked})}
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* 5. พรีวิวตัวอย่าง */}
        <section id="section-5" className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-brand-200/50 scroll-mt-48 relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-bl-[100px] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-900 flex items-center justify-center text-gold-400 font-bold">5</div>
            <h2 className="text-xl font-bold text-brand-950 thai-serif">พรีวิวตัวอย่าง</h2>
          </div>
          <p className="text-sm text-brand-900/60 mb-8 ml-11">สิ่งที่ลูกค้าจะเห็นเมื่อสินค้านี้ถูกเผยแพร่บนหน้าแพลตฟอร์ม</p>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Mock Product Card (Buyer view) */}
            <div className="w-full md:w-[320px] bg-white rounded-xl overflow-hidden shadow-xl border border-brand-100 flex-shrink-0">
              <div className="relative aspect-[4/3] bg-brand-50 flex items-center justify-center">
                <span className="text-brand-900/20 font-bold text-lg thai-serif">ภาพจำลองสินค้า</span>
                {formData.certifications.includes('นกยูงพระราชทาน') && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm border border-gold-400/20">
                    <Award size={14} className="text-gold-500" />
                    <span className="text-[10px] font-bold text-brand-900">รับรองโดยตรานกยูง</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h4 className="text-[15px] font-bold text-brand-900 truncate mb-1">
                  {formData.title || "ชื่อสินค้า (ยังไม่ได้ระบุ)"}
                </h4>
                <p className="text-xs text-brand-900/50 mb-3 truncate">
                  {formData.material ? `วัสดุ: ${formData.material}` : "วัสดุ: ไม่ระบุ"} 
                  {formData.productionMethod ? ` • ${formData.productionMethod}` : ""}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {formData.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-brand-50 text-brand-900/70 px-2 py-1 rounded text-[10px] font-medium border border-brand-100">
                      {tag}
                    </span>
                  ))}
                  {formData.tags.length > 3 && (
                    <span className="bg-brand-50 text-brand-900/70 px-2 py-1 rounded text-[10px] font-medium border border-brand-100">
                      +{formData.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-brand-100/50">
                  <span className="text-lg font-bold text-brand-900 thai-serif">
                    ฿{formData.price ? Number(formData.price).toLocaleString() : "0"}
                  </span>
                  <div className="flex gap-2">
                    {formData.freeShipping && (
                      <span className="text-[10px] font-bold text-[#00B900] bg-[#00B900]/10 px-2 py-1 rounded-full">
                        ส่งฟรี
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Information Verification */}
            <div className="flex-1 bg-brand-50 rounded-xl p-6 border border-brand-100">
              <h3 className="font-bold text-brand-900 mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#00B900]" />
                ข้อมูลที่พร้อมแสดงผล
              </h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-brand-900/50 w-24 flex-shrink-0">สี:</span>
                  <span className="font-medium text-brand-900">{formData.color || "-"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-900/50 w-24 flex-shrink-0">น้ำหนัก:</span>
                  <span className="font-medium text-brand-900">{formData.weight ? `${formData.weight} กรัม` : "-"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-900/50 w-24 flex-shrink-0">ขนาด:</span>
                  <span className="font-medium text-brand-900">{formData.size || "-"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-900/50 w-24 flex-shrink-0">คลังสินค้า:</span>
                  <span className="font-medium text-brand-900">{formData.quantity ? `${formData.quantity} ชิ้น` : "-"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-900/50 w-24 flex-shrink-0">ขนส่ง:</span>
                  <span className="font-medium text-brand-900">
                    {formData.shippingProvider === 'thailand_post' ? 'ไปรษณีย์ไทย' : 
                     formData.shippingProvider === 'kerry' ? 'Kerry Express' : 
                     formData.shippingProvider === 'flash' ? 'Flash Express' : 
                     formData.shippingProvider === 'jnt' ? 'J&T Express' : 
                     formData.shippingProvider === 'other' ? 'อื่นๆ' : '-'}
                  </span>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-3 ${isSubmitting ? 'bg-brand-400' : 'bg-brand-900 hover:bg-brand-800 hover:scale-105'} text-white font-bold rounded-full shadow-lg transition-all flex items-center gap-2`}
            >
              <CheckCircle2 size={18} className="text-gold-400" />
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการเพิ่มสินค้า"}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
