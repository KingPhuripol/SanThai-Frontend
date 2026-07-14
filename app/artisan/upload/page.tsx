"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { fabricsApi, productsApi } from "@/lib/api";
import { useArtisanSession } from "@/lib/useArtisanSession";

type FormData = {
  name_th: string;
  name_en: string;
  weave_technique: string;
  weave_technique_custom: string;
  dye_method: string;
  fiber_types: string[];
  cultural_meaning_th: string;
  story_th: string;
  usage_rights: string;
  images: File[];
  price_thb: string;
  stock: string;
  description_th: string;
};

const WEAVE_OPTIONS = [
  "มัดหมี่",
  "ขิด",
  "จก",
  "ยกดอก",
  "ทอมือ",
  "ปาเต๊ะ",
  "บาติก",
  "อื่น ๆ",
];
const DYE_OPTIONS = ["สีธรรมชาติ", "สีครามธรรมชาติ", "สีเคมี", "สีผสม"];
const FIBER_OPTIONS = ["ไหม", "ฝ้าย", "ใยกัญชง", "ใยสับปะรด", "ใยบัว", "ผ้าฝ้ายอินทรีย์"];
const RIGHTS_OPTIONS = ["สาธารณะ", "เชิงพาณิชย์", "ห้ามดัดแปลง", "สงวนสิทธิ์"];

const STEPS = [
  "ข้อมูลสินค้า",
  "เทคนิคและวัตถุดิบ",
  "เรื่องราวและภาพ",
  "ราคาและจำนวน",
  "ยืนยัน",
];

export default function ArtisanUploadPage() {
  const router = useRouter();
  const { session, checked } = useArtisanSession();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [partialFabricId, setPartialFabricId] = useState<number | null>(null);
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>({
    name_th: "",
    name_en: "",
    weave_technique: "",
    weave_technique_custom: "",
    dye_method: "",
    fiber_types: [],
    cultural_meaning_th: "",
    story_th: "",
    usage_rights: "เชิงพาณิชย์",
    images: [],
    price_thb: "",
    stock: "1",
    description_th: "",
  });

  const set = (key: keyof FormData, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleFiber = (fiber: string) =>
    setForm((f) => ({
      ...f,
      fiber_types: f.fiber_types.includes(fiber)
        ? f.fiber_types.filter((ft) => ft !== fiber)
        : [...f.fiber_types, fiber],
    }));

  const getWeaveTechnique = () =>
    form.weave_technique === "อื่น ๆ" ? form.weave_technique_custom : form.weave_technique;

  const canNext = () => {
    if (step === 0) return form.name_th.trim() !== "";
    if (step === 1) {
      const hasWeave = form.weave_technique !== "" && (form.weave_technique !== "อื่น ๆ" || form.weave_technique_custom.trim() !== "");
      return hasWeave && form.fiber_types.length > 0;
    }
    if (step === 2)
      return form.cultural_meaning_th.trim() !== "" && form.images.length > 0;
    if (step === 3)
      return form.price_thb.trim() !== "" && Number(form.price_thb) > 0;
    return true;
  };

  const createListing = async (fabricId: number) => {
    const pfd = new FormData();
    pfd.append("fabric_id", String(fabricId));
    pfd.append("title_th", form.name_th);
    pfd.append("price_thb", form.price_thb);
    pfd.append("stock", form.stock || "1");
    pfd.append("category", "fabric_roll");
    if (form.description_th) pfd.append("description_th", form.description_th);
    form.images.forEach((img) => pfd.append("images", img));

    const productRes = await productsApi.upload(pfd);
    setCreatedProductId(productRes.id);
    setPartialFabricId(null);
    setDone(true);
  };

  const handleRetryListing = async () => {
    if (partialFabricId === null) return;
    setSubmitting(true);
    setError("");
    try {
      await createListing(partialFabricId);
    } catch {
      setError("สร้างรายการขายไม่สำเร็จอีกครั้ง กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    let fabricId: number;
    try {
      const fd = new FormData();
      fd.append("name_th", form.name_th);
      fd.append("name_en", form.name_en);
      fd.append("weave_technique", getWeaveTechnique());
      fd.append("dye_method", form.dye_method);
      fd.append("fiber_type", form.fiber_types.join(", "));
      fd.append("cultural_meaning_th", form.cultural_meaning_th);
      fd.append("story_th", form.story_th);
      fd.append("usage_rights", form.usage_rights);
      form.images.forEach((img) => fd.append("images", img));
      const fabricRes = await fabricsApi.upload(fd);
      fabricId = fabricRes.id;
    } catch {
      setError("อัปโหลดผ้าไม่สำเร็จ กรุณาลองใหม่");
      setSubmitting(false);
      return;
    }

    try {
      await createListing(fabricId);
    } catch {
      setPartialFabricId(fabricId);
      setError(
        "สร้างลายผ้าสำเร็จ แต่สร้างรายการขายไม่สำเร็จ — กดปุ่มด้านล่างเพื่อลองสร้างรายการขายอีกครั้ง (ไม่ต้องอัปโหลดผ้าใหม่)"
      );
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
        <h2 className="text-2xl font-bold text-brand-900">ลงขายสำเร็จ!</h2>
        <p className="text-brand-500 text-sm text-center max-w-xs">
          ผ้าและสินค้าของคุณถูกสร้างแล้ว พร้อมขายทันที — AI จะเติมเรื่องราว
          Story Tags และ Provenance เพิ่มเติมในพื้นหลัง
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full">
          <Loader2 size={13} className="animate-spin" />
          AI กำลังประมวลผลเรื่องราวเพิ่มเติม…
        </div>
        <div className="flex gap-3 mt-2">
          {createdProductId && (
            <button
              onClick={() => router.push(`/marketplace/${createdProductId}`)}
              className="bg-gold-500 hover:bg-gold-400 text-brand-950 px-6 py-2.5 rounded-full text-sm font-bold transition-colors"
            >
              ดูสินค้าของฉัน
            </button>
          )}
          <button
            onClick={() => router.push("/artisan/dashboard")}
            className="bg-brand-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-800 transition-colors"
          >
            ไป Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="max-w-xl mx-auto px-4 pt-10">
        {/* Header */}
        <h1 className="text-2xl font-bold text-brand-900 mb-1">
          ลงทะเบียนสินค้าใหม่และลงขาย
        </h1>
        <p className="text-sm text-brand-400 mb-8">
          กรอกข้อมูล ตั้งราคา แล้วสินค้าจะขึ้นขายในตลาดทันที — AI จะช่วยจัดการเรื่องราว
          ค่าสี และ Provenance ให้โดยอัตโนมัติ
        </p>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-1 flex-1">
              <div
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                  i < step
                    ? "bg-brand-900 text-white"
                    : i === step
                      ? "bg-gold-500 text-brand-950"
                      : "bg-amber-100 text-brand-400"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs hidden sm:block ${
                  i === step ? "text-brand-800 font-medium" : "text-brand-400"
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 mx-1 ${i < step ? "bg-brand-900" : "bg-amber-100"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: ข้อมูลลายผ้า */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="text-xs text-brand-500 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
              กำลังลงทะเบียนในนามของ: <span className="font-semibold text-brand-900">{session.artisan_name || session.full_name}</span>
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-700 mb-1 block">
                ชื่อสินค้า (ภาษาไทย) *
              </label>
              <input
                value={form.name_th}
                onChange={(e) => set("name_th", e.target.value)}
                placeholder="เช่น ผ้าไหมมัดหมี่ลายดอกแก้ว"
                className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-700 mb-1 block">
                ชื่อสินค้า (ภาษาอังกฤษ)
              </label>
              <input
                value={form.name_en}
                onChange={(e) => set("name_en", e.target.value)}
                placeholder="e.g. Crystal Flower Silk"
                className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>
        )}

        {/* Step 1: เทคนิค */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-brand-700 mb-2 block">
                เทคนิคการทอ * <span className="text-xs text-brand-400 font-normal">(เลือกหลักได้ 1 อย่าง)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {WEAVE_OPTIONS.map((w) => (
                  <button
                    key={w}
                    onClick={() => set("weave_technique", w)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                      form.weave_technique === w
                        ? "bg-brand-900 text-white border-brand-900"
                        : "border-amber-200 text-brand-600 hover:bg-amber-50"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
              {form.weave_technique === "อื่น ๆ" && (
                <input
                  value={form.weave_technique_custom}
                  onChange={(e) => set("weave_technique_custom", e.target.value)}
                  placeholder="พิมพ์เทคนิคการทอที่ใช้…"
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-700 mb-2 block">
                วิธีการย้อม
              </label>
              <div className="flex flex-wrap gap-2">
                {DYE_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => set("dye_method", d)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                      form.dye_method === d
                        ? "bg-brand-900 text-white border-brand-900"
                        : "border-amber-200 text-brand-600 hover:bg-amber-50"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-700 mb-2 block">
                เส้นใย * <span className="text-xs text-brand-400 font-normal">(เลือกได้หลายอย่าง)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {FIBER_OPTIONS.map((f) => (
                  <button
                    key={f}
                    onClick={() => toggleFiber(f)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                      form.fiber_types.includes(f)
                        ? "bg-brand-900 text-white border-brand-900"
                        : "border-amber-200 text-brand-600 hover:bg-amber-50"
                    }`}
                  >
                    {form.fiber_types.includes(f) ? "✓ " : ""}{f}
                  </button>
                ))}
              </div>
              {form.fiber_types.length > 0 && (
                <p className="text-xs text-brand-500 mt-1.5">เลือกแล้ว: {form.fiber_types.join(", ")}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: เรื่องราว + ภาพ */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-brand-700 mb-1 block">
                ความหมายทางวัฒนธรรม *
              </label>
              <textarea
                value={form.cultural_meaning_th}
                onChange={(e) => set("cultural_meaning_th", e.target.value)}
                rows={3}
                placeholder="เช่น ลายนี้สื่อถึงความอุดมสมบูรณ์ของข้าว…"
                className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-700 mb-1 block">
                เรื่องราวเพิ่มเติม (AI จะช่วยขยาย)
              </label>
              <textarea
                value={form.story_th}
                onChange={(e) => set("story_th", e.target.value)}
                rows={3}
                placeholder="เพิ่มเรื่องราวภูมิหลังที่คุณอยากบอกเล่า…"
                className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-700 mb-1 block">
                สิทธิ์การใช้งาน
              </label>
              <div className="flex flex-wrap gap-2">
                {RIGHTS_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => set("usage_rights", r)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                      form.usage_rights === r
                        ? "bg-brand-900 text-white border-brand-900"
                        : "border-amber-200 text-brand-600 hover:bg-amber-50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-700 mb-2 block">
                ภาพถ่ายสินค้า * <span className="text-xs text-brand-400 font-normal">(1-10 รูป, หลายมุมมอง)</span>
              </label>
              {form.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`preview-${idx}`}
                        className="w-20 h-20 rounded-xl object-cover border border-amber-200"
                      />
                      <button
                        type="button"
                        onClick={() => set("images", form.images.filter((_, i) => i !== idx))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {form.images.length < 10 && (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-amber-300 rounded-2xl p-6 cursor-pointer hover:bg-amber-50 transition-colors">
                  <Upload size={28} className="text-brand-400" />
                  <span className="text-sm text-brand-500">
                    คลิกเพื่ออัปโหลดภาพ ({form.images.length}/10)
                  </span>
                  <span className="text-xs text-brand-400">
                    JPG, PNG (ไม่เกิน 10MB ต่อรูป)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const allowed = 10 - form.images.length;
                      set("images", [...form.images, ...files.slice(0, allowed)]);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {/* Step 3: ราคาและจำนวน */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-brand-700 mb-1 block">
                ราคา (บาท) *
              </label>
              <input
                type="number"
                min={1}
                value={form.price_thb}
                onChange={(e) => set("price_thb", e.target.value)}
                placeholder="เช่น 1500"
                className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-700 mb-1 block">
                จำนวนที่มีขาย
              </label>
              <input
                type="number"
                min={1}
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="1"
                className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-700 mb-1 block">
                รายละเอียดเพิ่มเติมสำหรับผู้ซื้อ (ไม่บังคับ)
              </label>
              <textarea
                value={form.description_th}
                onChange={(e) => set("description_th", e.target.value)}
                rows={2}
                placeholder="เช่น ขนาดผ้า วิธีดูแลรักษา…"
                className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
              />
            </div>
            <div className="text-xs text-brand-500 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
              หมวดหมู่: ผ้าพร้อมขาย (ผ้าผืน)
            </div>
          </div>
        )}

        {/* Step 4: Preview + confirm */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 space-y-3">
            <h3 className="font-bold text-brand-900 mb-3">
              ตรวจสอบข้อมูลก่อนส่ง
            </h3>
            {[
              { label: "ชื่อสินค้า", value: form.name_th },
              { label: "เทคนิคการทอ", value: getWeaveTechnique() },
              { label: "เส้นใย", value: form.fiber_types.join(", ") },
              { label: "การย้อม", value: form.dye_method },
              { label: "สิทธิ์", value: form.usage_rights },
              { label: "ราคา", value: form.price_thb ? `฿${Number(form.price_thb).toLocaleString()}` : "—" },
              { label: "จำนวน", value: form.stock || "1" },
              { label: "ภาพถ่าย", value: `${form.images.length} รูป` },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-brand-500">{row.label}</span>
                <span className="font-medium text-brand-900">
                  {row.value || "—"}
                </span>
              </div>
            ))}
            <div className="text-sm">
              <span className="text-brand-500">ความหมาย</span>
              <p className="mt-1 text-brand-700 text-xs leading-relaxed line-clamp-3">
                {form.cultural_meaning_th}
              </p>
            </div>
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.images.map((img, idx) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={idx}
                    src={URL.createObjectURL(img)}
                    alt={`preview-${idx}`}
                    className="rounded-xl w-20 h-20 object-cover"
                  />
                ))}
              </div>
            )}
            <div className="pt-2 text-xs text-amber-600 bg-amber-50 rounded-xl p-3 flex items-start gap-2">
              <span>✨</span>
              <span>
                หลังจากส่งข้อมูล ผ้าและสินค้าจะถูกสร้างพร้อมขายทันที AI จะสร้าง Story
                Tags, Embedding และ Blockchain Provenance ให้โดยอัตโนมัติ
              </span>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        {partialFabricId !== null && (
          <button
            onClick={handleRetryListing}
            disabled={submitting}
            className="w-full mt-3 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors disabled:opacity-60"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            ลองสร้างรายการขายอีกครั้ง
          </button>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 gap-3">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-800"
            >
              <ChevronLeft size={15} />
              ย้อนกลับ
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="flex items-center gap-1.5 bg-brand-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-800 transition-colors disabled:opacity-50"
            >
              ถัดไป
              <ChevronRight size={15} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || partialFabricId !== null}
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-brand-950 px-8 py-2.5 rounded-full text-sm font-bold transition-colors disabled:opacity-60"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {submitting ? "กำลังอัปโหลด…" : "ส่งข้อมูลและลงขาย"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
