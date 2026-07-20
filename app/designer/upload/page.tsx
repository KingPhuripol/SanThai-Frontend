"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle2, Loader2, ChevronLeft, Sparkles } from "lucide-react";
import { productsApi, fabricsApi, designerApi } from "@/lib/api";
import type { FabricPattern } from "@/lib/types";
import Link from "next/link";
import { useDesignerSession } from "@/lib/useDesignerSession";

const GARMENT_STYLES = [
  { value: "shirt", label: "เสื้อเชิ้ต / เสื้อคลุม" },
  { value: "dress", label: "ชุดเดรส" },
  { value: "skirt", label: "กระโปรง" },
  { value: "pants", label: "กางเกง" },
  { value: "accessories", label: "เครื่องประดับ / กระเป๋า" },
  { value: "shawl", label: "ผ้าคลุมไหล่ / ผ้าพันคอ" },
  { value: "hat", label: "หมวก" },
  { value: "shoes", label: "รองเท้า" },
  { value: "home_decor", label: "ของแต่งบ้าน" },
  { value: "other", label: "อื่นๆ" },
];

export default function DesignerUploadPage() {
  const router = useRouter();
  const { session, checked } = useDesignerSession();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [fabrics, setFabrics] = useState<FabricPattern[]>([]);

  const [garmentStyle, setGarmentStyle] = useState("shirt");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [genError, setGenError] = useState("");
  const [sourceProduct, setSourceProduct] = useState<any>(null);

  const [form, setForm] = useState({
    title_th: "",
    price_thb: "",
    category: "shirt",
    fabric_id: "",
    image: null as File | null,
  });

  useEffect(() => {
    fabricsApi.list().then(setFabrics).catch(console.error);
  }, []);

  useEffect(() => {
    if (!form.fabric_id) {
      setSourceProduct(null);
      return;
    }
    productsApi.list().then((products) => {
      setSourceProduct(products.find((product: any) => Number(product.fabric_id) === Number(form.fabric_id)) || null);
    }).catch(() => setSourceProduct(null));
  }, [form.fabric_id]);

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleGenerateImage = async () => {
    if (!form.fabric_id) {
      setGenError("กรุณาเลือกลายผ้าก่อน");
      return;
    }
    setGeneratingImage(true);
    setGenError("");
    try {
      const res = await designerApi.generateFashionImage(Number(form.fabric_id), garmentStyle);
      setGeneratedImageUrl(res.image_url);
      set("category", garmentStyle); // keep listing category consistent with what was generated
      set("image", null); // AI image takes priority over any manually-chosen file
    } catch {
      setGenError("สร้างภาพไม่สำเร็จ กรุณาลองใหม่ หรืออัปโหลดภาพเองด้านล่าง");
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title_th || !form.price_thb || !form.fabric_id || !(form.image || generatedImageUrl)) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน (ต้องมีภาพสินค้า — สร้างด้วย AI หรืออัปโหลดเอง)");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("title_th", form.title_th);
      fd.append("price_thb", form.price_thb);
      fd.append("category", form.category);
      fd.append("fabric_id", form.fabric_id);
      if (generatedImageUrl) {
        fd.append("image_url", generatedImageUrl);
      } else if (form.image) {
        fd.append("image", form.image);
      }

      await productsApi.upload(fd);
      setDone(true);
    } catch {
      setError("อัปโหลดไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  if (!checked || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
        <CheckCircle2 size={56} className="text-green-500" />
        <h2 className="text-2xl font-bold text-brand-900">เพิ่มผลงานสำเร็จ!</h2>
        <p className="text-brand-500 text-sm text-center max-w-xs">
          ผลงานของคุณถูกผูกกับลายผ้าของชุมชนและพร้อมวางขายแล้ว
        </p>
        <button
          onClick={() => router.push("/designer/dashboard")}
          className="mt-4 bg-brand-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-800 transition-colors"
        >
          กลับไป Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="max-w-xl mx-auto px-4 pt-8">
        <Link href="/designer/dashboard" className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-800 mb-6 w-fit">
          <ChevronLeft size={16} />
          ย้อนกลับ
        </Link>
        
        <h1 className="text-2xl font-bold text-brand-900 mb-2">อัปโหลดผลงานออกแบบ</h1>
        <p className="text-sm text-brand-500 mb-8">
          สร้างสินค้าใหม่และเลือก "ลายผ้าต้นทาง" เพื่อผูกผลงานของคุณกับชุมชนผู้ผลิต
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
          <div>
            <label className="text-sm font-semibold text-brand-700 mb-1 block">ชื่อสินค้า (ภาษาไทย) *</label>
            <input
              value={form.title_th}
              onChange={(e) => set("title_th", e.target.value)}
              placeholder="เช่น เสื้อคลุมผ้าไหมมัดหมี่ร่วมสมัย"
              className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-brand-700 mb-1 block">ราคา (บาท) *</label>
              <input
                type="number"
                value={form.price_thb}
                onChange={(e) => set("price_thb", e.target.value)}
                placeholder="เช่น 1500"
                className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-700 mb-1 block">หมวดหมู่</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
              >
                <option value="shirt">เสื้อ / เสื้อคลุม</option>
                <option value="skirt">กระโปรง</option>
                <option value="dress">เดรส</option>
                <option value="pants">กางเกง</option>
                <option value="accessories">เครื่องประดับ / กระเป๋า</option>
              </select>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <label className="text-sm font-semibold text-brand-800 mb-2 block">
              เลือกลายผ้าของชุมชน (Fabric Source) *
            </label>
            <select
              value={form.fabric_id}
              onChange={(e) => set("fabric_id", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
            >
              <option value="" disabled>-- เลือกลายผ้า --</option>
              {fabrics.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name_th} ({f.community?.name || "ไม่ระบุชุมชน"})
                </option>
              ))}
            </select>
            <p className="text-xs text-amber-700 mt-2">
              * การเลือกลายผ้า จะทำให้หน้าสินค้าของคุณเชื่อมโยงกับเรื่องราวและ Provenance ของช่างทอโดยอัตโนมัติ
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-amber-50 p-4 rounded-xl border border-purple-200">
            <label className="text-sm font-semibold text-brand-800 mb-2 block flex items-center gap-1.5">
              <Sparkles size={15} className="text-purple-600" />
              สร้างภาพชุดด้วย AI (ไม่บังคับ)
            </label>
            <div className="flex gap-2">
              <select
                value={garmentStyle}
                onChange={(e) => setGarmentStyle(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
              >
                {GARMENT_STYLES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={generatingImage || !form.fabric_id}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 shrink-0"
              >
                {generatingImage ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                {generatingImage ? "กำลังสร้าง…" : "สร้างภาพ"}
              </button>
            </div>
            {genError && <p className="text-xs text-red-500 mt-2">{genError}</p>}
            {generatedImageUrl && (
              <div className="relative mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedImageUrl}
                  alt="AI generated preview"
                  className="w-full max-h-72 object-cover rounded-xl border border-purple-200"
                />
                {sourceProduct && <Link href={`/marketplace/${sourceProduct.id}`} className="absolute bottom-3 left-3 rounded-full bg-brand-900/95 px-3 py-2 text-xs font-bold text-white shadow-lg hover:bg-brand-800">ผ้าต้นทาง · ดูสินค้า</Link>}
                <p className="text-xs text-purple-700 mt-1.5">
                  ✓ จะใช้ภาพนี้เป็นรูปสินค้า — สร้างใหม่ได้ถ้ายังไม่พอใจ {sourceProduct ? "· ปุ่มบนภาพพาไปยังผ้าต้นทาง" : ""}
                </p>
                <p className="mt-1 text-[11px] text-brand-900/55">ภาพนี้เป็นภาพตัวอย่างจาก AI โดยใช้รูปผ้าอ้างอิง ไม่ใช่การรับรองคุณสมบัติของผ้า</p>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-700 mb-2 block">
              หรืออัปโหลดภาพถ่ายชุดเอง {generatedImageUrl ? "" : "*"}
            </label>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-amber-300 rounded-2xl p-6 cursor-pointer hover:bg-amber-50 transition-colors">
              {form.image ? (
                <>
                  <span className="text-brand-900 font-medium">เลือกไฟล์แล้ว</span>
                  <span className="text-xs text-brand-500">{form.image.name}</span>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-brand-400" />
                  <span className="text-sm text-brand-500">คลิกเพื่ออัปโหลดภาพผลงาน</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  set("image", e.target.files?.[0] ?? null);
                  if (e.target.files?.[0]) setGeneratedImageUrl(null);
                }}
              />
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-white py-3.5 rounded-full text-sm font-bold transition-colors disabled:opacity-60 mt-4"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "กำลังบันทึก…" : "อัปโหลดขึ้นร้านค้า"}
          </button>
        </form>
      </div>
    </div>
  );
}
