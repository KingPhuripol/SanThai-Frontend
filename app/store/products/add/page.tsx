"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { fabricsApi, productsApi } from "@/lib/api";
import { useArtisanSession } from "@/lib/useArtisanSession";
import { StoreTermsGate } from "@/components/StoreTermsGate";
import type { FabricPattern } from "@/lib/types";
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

function AddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingProductId = Number(searchParams.get("edit")) || null;
  const { session, checked } = useArtisanSession();

  // Basic Form State
  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    fabricId: "",
    description: "",
    descriptionEn: "",
    price: "",
    tags: [] as string[],
    certifications: [] as string[],
    peacockLevel: "",
    productType: "",
    preparationTime: "",
    
    // Details
    colors: [] as string[],
    material: "",
    productionMethod: "",
    dyeMethod: "",
    patternName: "",
    texture: "",
    productionOrigin: "",
    careInstructions: "",
    weight: "",
    widthCm: "",
    lengthCm: "",
    saleUnit: "meter",
    
    // Media
    quantity: "",
    size: "",
    
    // Shipping
    shippingProvider: "",
    shippingCost: "",
    freeShipping: false
  });

  const [currentTag, setCurrentTag] = useState("");
  const [useAiDesc, setUseAiDesc] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageChecks, setImageChecks] = useState({ overall: false, detail: false, scale: false, origin: false });
  const [fabrics, setFabrics] = useState<FabricPattern[]>([]);
  const [loadingFabrics, setLoadingFabrics] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session?.artisan_id) return;
    fabricsApi.list({ artisan_id: session.artisan_id })
      .then(setFabrics)
      .catch(() => alert("ไม่สามารถโหลดรายการผ้าของร้านได้"))
      .finally(() => setLoadingFabrics(false));
  }, [session?.artisan_id]);

  useEffect(() => {
    if (!editingProductId || !session?.artisan_id) return;
    setLoadingProduct(true);
    productsApi.get(editingProductId)
      .then((product) => {
        if (product.artisan?.id !== session.artisan_id) throw new Error("forbidden");
        setFormData((current) => ({
          ...current,
          title: product.title_th || "",
          titleEn: product.title_en || "",
          fabricId: String(product.fabric_id || ""),
          description: product.description_th || "",
          descriptionEn: product.description_en || "",
          price: String(product.price_thb || ""),
          quantity: String(product.stock ?? ""),
          productType: product.product_type || "ready_to_ship",
          preparationTime: product.preparation_time || "",
          saleUnit: product.sale_unit || "meter",
          colors: product.primary_color ? product.primary_color.split(",").map((c: string) => c.trim()) : [],
          material: product.fiber_composition || "",
          productionMethod: product.production_method || "",
          dyeMethod: product.dye_method || "",
          patternName: product.pattern_name || "",
          texture: product.texture || "",
          productionOrigin: product.production_origin || "",
          careInstructions: product.care_instructions || "",
          weight: String(product.weight_g || ""),
          widthCm: String(product.width_cm || ""),
          lengthCm: String(product.length_cm || ""),
          shippingProvider: product.shipping_provider || "",
          shippingCost: String(product.shipping_cost_thb || ""),
          freeShipping: Boolean(product.free_shipping),
        }));
      })
      .catch(() => {
        alert("ไม่พบสินค้า หรือคุณไม่มีสิทธิ์แก้ไข");
        router.replace("/store/products");
      })
      .finally(() => setLoadingProduct(false));
  }, [editingProductId, router, session?.artisan_id]);

  useEffect(() => {
    const saved = localStorage.getItem("santhai_product_draft");
    if (!saved) return;
    try {
      setFormData(JSON.parse(saved));
    } catch {
      localStorage.removeItem("santhai_product_draft");
    }
  }, []);

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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleImages = (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files);
    if (selected.some((file) => !file.type.startsWith("image/"))) {
      alert("อัปโหลดได้เฉพาะไฟล์รูปภาพเท่านั้น");
      return;
    }
    if (selected.some((file) => file.size > 5 * 1024 * 1024)) {
      alert("รูปภาพแต่ละไฟล์ต้องมีขนาดไม่เกิน 5 MB");
      return;
    }
    setImageFiles((current) => {
      const next = [...current, ...selected].slice(0, 4);
      setImagePreviews(next.map((file) => URL.createObjectURL(file)));
      if (current.length + selected.length > 4) alert("อัปโหลดรูปสินค้าได้สูงสุด 4 รูป");
      return next;
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setImagePreviews((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSubmit = async (publish = true) => {
    if (!formData.title || !formData.price || !formData.quantity || (publish && !formData.productType)) {
      alert("กรุณากรอกข้อมูลที่จำเป็น (ชื่อสินค้า, ประเภทสินค้า, ราคา, จำนวน) ให้ครบถ้วน");
      return;
    }
    if (publish && (!formData.material || !formData.dyeMethod || !formData.patternName || !formData.texture || !formData.productionMethod || !formData.productionOrigin || !formData.careInstructions || !formData.widthCm || !formData.lengthCm)) {
      alert("ก่อนเผยแพร่ กรุณากรอกรายละเอียดผ้า แหล่งผลิต การดูแลรักษา และขนาดกว้าง/ยาวให้ครบถ้วน");
      return;
    }
    if (Number(formData.price) <= 0 || Number(formData.quantity) < 0 || !Number.isInteger(Number(formData.quantity))) {
      alert("ราคาต้องมากกว่า 0 และจำนวนสินค้าเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป");
      return;
    }
    if (publish && !editingProductId && imageFiles.length === 0) {
      alert("กรุณาอัปโหลดรูปสินค้าอย่างน้อย 1 รูป");
      return;
    }
    if (publish && !Object.values(imageChecks).every(Boolean)) {
      alert("ก่อนเผยแพร่ กรุณายืนยันรายการตรวจสอบรูปภาพสินค้าให้ครบ");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      if (formData.fabricId) fd.append("fabric_id", formData.fabricId);
      fd.append("title_th", formData.title);
      fd.append("title_en", formData.titleEn.trim());
      fd.append("price_thb", formData.price);
      if (formData.quantity) fd.append("stock", formData.quantity);
      fd.append("product_type", formData.productType || "ready_to_ship");
      fd.append("preparation_time", formData.preparationTime);
      fd.append("sale_unit", formData.saleUnit);
      if (formData.widthCm) fd.append("width_cm", formData.widthCm);
      if (formData.lengthCm) fd.append("length_cm", formData.lengthCm);
      if (formData.weight) fd.append("weight_g", formData.weight);
      fd.append("fiber_composition", formData.material);
      if (formData.colors.length > 0) fd.append("primary_color", formData.colors.join(", "));
      fd.append("dye_method", formData.dyeMethod);
      fd.append("pattern_name", formData.patternName);
      fd.append("texture", formData.texture);
      fd.append("production_method", formData.productionMethod);
      fd.append("production_origin", formData.productionOrigin);
      fd.append("care_instructions", formData.careInstructions);
      fd.append("shipping_provider", formData.shippingProvider);
      fd.append("shipping_cost_thb", formData.freeShipping ? "0" : (formData.shippingCost || "0"));
      fd.append("free_shipping", String(formData.freeShipping));
      fd.append("is_active", String(publish));
      
      let cat = "other";
      if (formData.material.includes("ไหม")) cat = "silk";
      else if (formData.material.includes("ฝ้าย")) cat = "cotton";
      fd.append("category", cat);
      
      // Narrative remains prose; product facts above are stored as typed fields.
      fd.append("description_th", formData.description.trim());
      fd.append("description_en", formData.descriptionEn.trim());
      
      imageFiles.forEach((file) => fd.append("images", file));
      
      if (editingProductId) {
        await productsApi.update(editingProductId, fd);
      } else {
        await productsApi.upload(fd);
      }
      localStorage.removeItem("santhai_product_draft");
      alert(publish ? (editingProductId ? "บันทึกและเผยแพร่สินค้าสำเร็จ!" : "เพิ่มสินค้าสำเร็จ!") : "บันทึกเป็นแบบร่างแล้ว");
      router.push("/store/products");
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!checked || !session || loadingProduct) {
    return <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-24 pb-32">
      
      {/* Sticky Header */}
      <div className="fixed top-20 left-0 w-full bg-white/80 backdrop-blur-md border-b border-brand-200/50 z-40">
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/store" className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-900 hover:bg-brand-100 transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-lg font-bold text-brand-950 thai-serif">{editingProductId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="px-4 py-2 text-sm font-bold text-brand-900 hover:bg-brand-50 rounded-full transition-colors">
              บันทึกแบบร่าง
            </button>
            <button onClick={() => handleSubmit(true)} disabled={isSubmitting} className="px-6 py-2 bg-brand-900 disabled:bg-brand-400 text-white text-sm font-bold rounded-full shadow-md hover:bg-brand-800 transition-colors">
              {isSubmitting ? "กำลังเผยแพร่..." : "เผยแพร่สินค้า"}
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
              <label className="block text-sm font-bold text-brand-950 mb-2">เลือกผ้าที่ใช้ทำสินค้า</label>
              <select
                className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all bg-white"
                value={formData.fabricId}
                onChange={e => setFormData({...formData, fabricId: e.target.value})}
                disabled={loadingFabrics || Boolean(editingProductId)}
              >
                <option value="">{loadingFabrics ? "กำลังโหลดผ้าของร้าน..." : "เลือกผ้าที่ลงทะเบียนไว้..."}</option>
                {fabrics.map((fabric) => (
                  <option key={fabric.id} value={fabric.id}>
                    {fabric.name_th}{fabric.weave_technique ? ` — ${fabric.weave_technique}` : ""}
                  </option>
                ))}
              </select>
              {!loadingFabrics && fabrics.length === 0 && (
                <p className="mt-2 text-xs text-amber-700">ยังไม่มีผ้าที่ลงทะเบียนไว้ <Link href="/artisan/upload" className="font-bold underline">เพิ่มผ้าก่อน</Link> แล้วกลับมาเพิ่มสินค้า</p>
              )}
            </div>

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
              <label className="block text-sm font-bold text-brand-950 mb-2">ชื่อสินค้า (English)</label>
              <input
                type="text"
                placeholder="e.g. Mudmee Silk — Dok Phikun Pattern"
                className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                value={formData.titleEn}
                onChange={e => setFormData({...formData, titleEn: e.target.value})}
              />
              <p className="mt-1 text-xs text-brand-900/50">ใช้แสดงผลเมื่อลูกค้าเลือกภาษา English (หากเว้นว่าง ระบบจะแสดงชื่อภาษาไทย)</p>
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-brand-950">คำอธิบายสินค้า</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[11px] font-bold text-brand-900/70">ใช้ AI ช่วยเขียนคำบรรยาย</span>
                  <div className={`relative w-8 h-4 rounded-full transition-colors ${useAiDesc ? 'bg-gold-400' : 'bg-brand-200'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${useAiDesc ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <input type="checkbox" className="hidden" checked={useAiDesc} onChange={e => setUseAiDesc(e.target.checked)} />
                </label>
              </div>
              <textarea 
                rows={4}
                placeholder="เล่าเรื่องราว ความเป็นมา และแรงบันดาลใจในการทอผ้าผืนนี้..."
                className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all resize-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">คำอธิบายสินค้า (English)</label>
              <textarea
                rows={4}
                placeholder="Describe the story, origin and craftsmanship in English..."
                className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all resize-none"
                value={formData.descriptionEn}
                onChange={e => setFormData({...formData, descriptionEn: e.target.value})}
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
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.colors.map(c => (
                  <div key={c} className="flex items-center gap-1 bg-brand-50 text-brand-900 px-3 py-1.5 rounded-full text-xs font-medium border border-brand-200">
                    <div className="w-2 h-2 rounded-full bg-brand-400"></div>
                    {c}
                    <button type="button" onClick={() => setFormData(prev => ({...prev, colors: prev.colors.filter(color => color !== c)}))} className="ml-1 hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  list="color-options"
                  placeholder="พิมพ์สีแล้วกด Enter..."
                  className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all bg-white"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val && !formData.colors.includes(val)) {
                        setFormData(prev => ({...prev, colors: [...prev.colors, val]}));
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                  onBlur={e => {
                    const val = e.currentTarget.value.trim();
                    if (val && !formData.colors.includes(val)) {
                      setFormData(prev => ({...prev, colors: [...prev.colors, val]}));
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <datalist id="color-options">
                  {colorOptions.map(c => <option key={c} value={c} />)}
                </datalist>
                <p className="text-[11px] text-brand-900/50 mt-1.5 ml-1">พิมพ์เพื่อค้นหาสีจากระบบ หรือระบุสีของคุณเอง สามารถใส่ได้หลายสี</p>
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
              <label className="block text-sm font-bold text-brand-950 mb-2">วิธีการย้อมสี</label>
              <input type="text" placeholder="เช่น ย้อมครามธรรมชาติ" className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all" value={formData.dyeMethod} onChange={e => setFormData({...formData, dyeMethod: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">ลวดลาย</label>
              <input type="text" placeholder="เช่น ลายดอกพิกุล" className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all" value={formData.patternName} onChange={e => setFormData({...formData, patternName: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">ผิวสัมผัส</label>
              <input type="text" placeholder="เช่น นุ่ม ลื่น มีมิติ" className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all" value={formData.texture} onChange={e => setFormData({...formData, texture: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-950 mb-2">แหล่งผลิต</label>
              <input type="text" placeholder="เช่น บ้านโนนกอก จ.ขอนแก่น" className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all" value={formData.productionOrigin} onChange={e => setFormData({...formData, productionOrigin: e.target.value})} />
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

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-brand-950 mb-2">การดูแลรักษา</label>
              <textarea rows={3} maxLength={500} placeholder="เช่น ซักมือด้วยน้ำเย็น ใช้น้ำยาซักผ้าอ่อน หลีกเลี่ยงการฟอกขาว และตากในที่ร่ม" className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all resize-none" value={formData.careInstructions} onChange={e => setFormData({...formData, careInstructions: e.target.value})} />
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
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-bold text-brand-950 mb-2">กว้าง (ซม.)</label>
                <input type="number" min="0" step="0.01" placeholder="100" className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all" value={formData.widthCm} onChange={e => setFormData({...formData, widthCm: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-950 mb-2">ยาว (ซม.)</label>
                <input type="number" min="0" step="0.01" placeholder="200" className="w-full border border-brand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all" value={formData.lengthCm} onChange={e => setFormData({...formData, lengthCm: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-950 mb-2">หน่วยขาย</label>
                <select className="w-full border border-brand-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all bg-white" value={formData.saleUnit} onChange={e => setFormData({...formData, saleUnit: e.target.value})}>
                  <option value="meter">เมตร</option>
                  <option value="piece">ผืน/ชิ้น</option>
                  <option value="roll">ม้วน</option>
                  <option value="set">ชุด</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-bold text-brand-950 mb-2">รูปภาพสินค้า</label>
            <p className="text-xs text-brand-900/50 mb-4">อัปโหลดอย่างน้อย 1 รูป สูงสุด 4 รูป (JPG, PNG หรือ WEBP ไฟล์ละไม่เกิน 5 MB)</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <input 
                type="file" 
                accept="image/*" 
                multiple
                className="hidden" 
                ref={fileInputRef} 
                onChange={(e) => {
                  handleImages(e.target.files);
                  e.currentTarget.value = "";
                }}
              />
              {[0, 1, 2, 3].map((slot) => (
                <div key={slot} className="relative aspect-[3/4]">
                  {imagePreviews[slot] ? (
                    <>
                      <img src={imagePreviews[slot]} alt={`รูปสินค้า ${slot + 1}`} className="absolute inset-0 w-full h-full rounded-2xl object-cover border border-brand-200" />
                      <button type="button" onClick={() => removeImage(slot)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 text-red-600 shadow flex items-center justify-center" aria-label="ลบรูป"><X size={15} /></button>
                      {slot === 0 && <span className="absolute bottom-2 left-2 bg-brand-900/85 text-white text-[10px] font-bold px-2 py-1 rounded-full">ภาพหลัก</span>}
                    </>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full h-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-colors group ${slot === 0 ? "border-gold-400 bg-gold-400/5 text-gold-500 hover:bg-gold-400/10" : "border-brand-200 bg-brand-50 text-brand-900/40 hover:bg-brand-100 hover:border-brand-300"}`}
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                        {slot === 0 ? <UploadCloud size={21} /> : <Camera size={20} />}
                      </div>
                      <span className="text-xs font-bold">{slot === 0 ? "ภาพหลัก" : "เพิ่มรูป"}</span>
                    </button>
                  )}
                </div>
              ))}

            </div>
            <fieldset className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
              <legend className="px-1 text-sm font-bold text-brand-950">ตรวจสอบรายละเอียดภาพก่อนเผยแพร่</legend>
              <p className="mt-1 text-xs text-brand-900/60">ยืนยันว่ารูปภาพให้ข้อมูลจริงแก่ผู้ซื้อ ไม่ใช้ภาพ AI เป็นหลักฐานความแท้ของผ้า</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {([
                  ["overall", "ภาพหลักเห็นผ้าหรือสินค้าชัดเจน สีไม่ผิดเพี้ยน"],
                  ["detail", "มีภาพระยะใกล้ที่เห็นลายและเนื้อผ้า"],
                  ["scale", "มีภาพบอกขนาด/สัดส่วนของสินค้า"],
                  ["origin", "ภาพและคำบรรยายตรงกับแหล่งผลิตที่ระบุ"],
                ] as const).map(([key, label]) => <label key={key} className="flex cursor-pointer items-start gap-2 rounded-xl bg-white/70 p-2.5 text-xs text-brand-900"><input type="checkbox" checked={imageChecks[key]} onChange={(event) => setImageChecks((current) => ({ ...current, [key]: event.target.checked }))} className="mt-0.5" /><span>{label}</span></label>)}
              </div>
            </fieldset>
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
                {imagePreviews[0] ? (
                  <img src={imagePreviews[0]} alt="พรีวิวรูปสินค้า" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <span className="text-brand-900/20 font-bold text-lg thai-serif">ภาพจำลองสินค้า</span>
                )}
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
                  <span className="font-medium text-brand-900">{formData.colors.length > 0 ? formData.colors.join(", ") : "-"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-900/50 w-24 flex-shrink-0">น้ำหนัก:</span>
                  <span className="font-medium text-brand-900">{formData.weight ? `${formData.weight} กรัม` : "-"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-900/50 w-24 flex-shrink-0">ขนาด:</span>
                  <span className="font-medium text-brand-900">{(formData.widthCm && formData.lengthCm) ? `${formData.widthCm} x ${formData.lengthCm} ซม.` : "-"}</span>
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
              onClick={() => handleSubmit(true)}
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

export default function AddProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full animate-spin" /></div>}>
      <StoreTermsGate><AddProductForm /></StoreTermsGate>
    </Suspense>
  );
}
