"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { artisanApi } from "@/lib/api";
import type { Recommendation } from "@/lib/types";

const COLOR_SWATCHES: Record<string, string[]> = {
  red_purple:  ["#8b1a1a", "#6b21a8"],
  gold_yellow: ["#d4af37", "#f59e0b"],
  blue_indigo: ["#1a3f8b", "#3730a3"],
  green_earth: ["#1a6b5a", "#713f12"],
  neutral:     ["#f5f0eb", "#d6d3d1"],
};

// ── image rotates per step ────────────────────────────────────────────────────
const STEP_IMAGES = [
  "/uploads/thai_fabric_amnat_charoen_01.jpg",
  "/uploads/thai_fabric_01.jpg",
  "/uploads/thai_fabric_amnat_charoen_046.jpg",
  "/uploads/thai_fabric_image_01.jpg",
  "/uploads/thai_fabric_image_02.jpg",
];

const STEPS = [
  {
    id: "gender", step: "01",
    question: "คุณเป็นใคร?",
    sub: "เพื่อแนะนำลายและรูปแบบผ้าที่เหมาะสม",
    options: [
      { label: "ผู้หญิง",          value: "female" },
      { label: "ผู้ชาย",           value: "male" },
      { label: "ทุกเพศ / ไม่ระบุ", value: "unisex" },
    ],
  },
  {
    id: "occasion", step: "02",
    question: "ต้องการผ้าสำหรับโอกาสใด?",
    sub: "เลือกโอกาสที่ตรงกับความต้องการของคุณ",
    options: [
      { label: "งานแต่งงาน / พิธีมงคล",     value: "wedding" },
      { label: "งานศพ / วันสำคัญ",           value: "ceremony" },
      { label: "ใส่ทำงาน / ประชุม",          value: "formal" },
      { label: "ใส่ทั่วไป / ชีวิตประจำวัน",  value: "casual" },
      { label: "ของขวัญ / ของที่ระลึก",       value: "gift" },
    ],
  },
  {
    id: "personality", step: "03",
    question: "สไตล์ที่คุณชอบ?",
    sub: "บุคลิกของคุณช่วยให้เราเลือกลายได้แม่นยำขึ้น",
    options: [
      { label: "คลาสสิก / ดั้งเดิม",  value: "classic" },
      { label: "โมเดิร์น / ร่วมสมัย", value: "modern" },
      { label: "มินิมอล / เรียบง่าย", value: "minimal" },
      { label: "สีสัน / โดดเด่น",     value: "bold" },
    ],
  },
  {
    id: "color", step: "04",
    question: "โทนสีที่คุณชอบ?",
    sub: "สีมีผลต่อการแนะนำลายและเทคนิคการย้อม",
    options: [
      { label: "แดง / ม่วง",       value: "red_purple",  swatch: true },
      { label: "ทอง / เหลือง",     value: "gold_yellow", swatch: true },
      { label: "น้ำเงิน / คราม",   value: "blue_indigo", swatch: true },
      { label: "เขียว / ธรรมชาติ", value: "green_earth", swatch: true },
      { label: "ขาว / ครีม / เบจ", value: "neutral",     swatch: true },
    ],
  },
  {
    id: "budget", step: "05",
    question: "งบประมาณของคุณ?",
    sub: "ไม่มีคำตอบที่ผิดถูก",
    options: [
      { label: "ไม่เกิน ฿3,000",    value: "3000" },
      { label: "฿3,000 – ฿6,000",  value: "6000" },
      { label: "฿6,000 – ฿10,000", value: "10000" },
      { label: "ไม่จำกัดงบ",        value: "0" },
    ],
  },
];

export default function QuizPage() {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);

  const currentStep = STEPS[step];
  const isLastStep  = step === STEPS.length - 1;

  const selectOption = (value: string) => {
    const updated = { ...answers, [currentStep.id]: value };
    setAnswers(updated);
    if (isLastStep) submit(updated);
    else setStep(step + 1);
  };

  const submit = async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    try {
      const budgetValue = parseInt(finalAnswers.budget || "0", 10);
      const budget_thb = budgetValue === 0 ? 1000000 : budgetValue;
      const recs = await artisanApi.getRecommendations({
        occasion: finalAnswers.occasion || "",
        personality: finalAnswers.personality || "",
        preferred_color: finalAnswers.color || "",
        budget_thb: budget_thb,
        gender: finalAnswers.gender || "unisex",
      });
      setResults(recs.recommendations);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white grid lg:grid-cols-2">
        {/* Left — image stays */}
        <div className="relative bg-stone-100 hidden lg:block">
          <Image src={STEP_IMAGES[step % STEP_IMAGES.length]} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-stone-900/20" />
        </div>
        {/* Right — loading */}
        <div className="flex flex-col items-center justify-center gap-6 px-8 py-20">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-stone-900 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-gold-400">
              AI กำลังวิเคราะห์
            </p>
            <p className="mt-1.5 text-xs text-white/50">ใช้เวลาไม่เกิน 10 วินาที</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (results) {
    return (
      <div className="min-h-screen bg-brand-900 pt-[80px] pb-24">
        <div className="border-b border-white/10">
          <div className="max-w-5xl mx-auto px-8 md:px-16 py-10 flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold-500 mb-3">
                Style Result
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white thai-serif">
                ผ้าที่เหมาะกับคุณ
              </h1>
              <p className="mt-2 text-sm text-brand-200">
                AI ได้เลือกลายผ้าที่ตรงกับบุคลิกและโอกาสของคุณ
              </p>
            </div>
            <button
              onClick={() => { setStep(0); setAnswers({}); setResults(null); }}
              className="text-sm text-brand-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={13} /> ทำ Quiz ใหม่
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 md:px-16 pt-10">
          {results.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-stone-400 text-sm">ยังไม่มีผ้าที่ตรงกัน — ลองรัน seed ก่อน</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {results.map((rec, i) => (
                <div key={rec.fabric_id} className="py-8 grid grid-cols-[2rem_1fr] gap-4 items-start">
                  <span className="text-[11px] font-semibold text-stone-300 tracking-widest pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="grid md:grid-cols-[140px_1fr] gap-6 items-start">
                    {rec.image_url && (
                      <div className="relative w-full aspect-[3/4] bg-stone-100 overflow-hidden">
                        <Image src={rec.image_url} alt={rec.name_th} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-stone-900 thai-serif leading-snug">
                            {rec.name_th}
                          </h3>
                          <p className="text-xs text-stone-400 mt-0.5 tracking-wider uppercase">
                            {rec.name_en}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-3xl font-black text-stone-900 leading-none">
                            {Math.round(rec.match_score * 100)}
                            <span className="text-sm font-normal text-stone-400">%</span>
                          </p>
                          <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">ตรงกัน</p>
                        </div>
                      </div>
                      <div className="mt-3 mb-4 h-px w-full bg-stone-100 relative">
                        <div
                          className="absolute top-0 left-0 h-full bg-stone-900 transition-all duration-700"
                          style={{ width: `${Math.round(rec.match_score * 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-stone-600 leading-[1.85]">{rec.reason}</p>
                      {rec.price_thb && (
                        <p className="mt-3 text-sm font-bold text-stone-900">
                          ฿{rec.price_thb.toLocaleString()}
                        </p>
                      )}
                      <div className="mt-4 flex gap-3">
                        {rec.product_id && (
                          <Link
                            href={`/marketplace/${rec.product_id}`}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 text-white text-xs font-medium hover:bg-stone-700 transition-colors"
                          >
                            ดูสินค้า <ArrowRight size={12} />
                          </Link>
                        )}
                        <Link
                          href={`/library/${rec.fabric_id}`}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-stone-300 text-stone-600 text-xs font-medium hover:border-stone-500 transition-colors"
                        >
                          Digital ID
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-10 pt-8 border-t border-stone-100">
            <Link
              href="/library"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors underline underline-offset-4"
            >
              ดูห้องสมุดลายทั้งหมด →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz — 2-column split ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-[80px] grid lg:grid-cols-2 bg-brand-900">

      {/* ── LEFT: Fabric image panel ────────────────────────────── */}
      <div className="relative bg-stone-900 hidden lg:block">
        <Image
          key={step}
          src={STEP_IMAGES[step % STEP_IMAGES.length]}
          alt="ลายผ้าไทย"
          fill
          className="object-cover opacity-80 transition-opacity duration-700"
          priority
        />
        {/* Dark gradient bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent" />

        {/* Bottom-left info */}
        <div className="absolute bottom-10 left-10 right-10">
          <div className="flex items-center gap-3 mb-4">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`h-px flex-1 transition-all duration-500 ${
                  i < step ? "bg-amber-400" : i === step ? "bg-white" : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <p className="text-white/50 text-[10px] tracking-widest uppercase">
            Style Quiz · {step + 1} of {STEPS.length}
          </p>
          <p className="text-white text-lg font-semibold thai-serif mt-1">
            สานไทย — ผ้าทอมือไทย
          </p>
        </div>
      </div>

      {/* ── RIGHT: Question panel ───────────────────────────────── */}
      <div className="flex flex-col justify-center px-8 md:px-14 lg:px-16 py-16">

        {/* Mobile step dots */}
        <div className="flex items-center gap-2 mb-10 lg:hidden">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-px flex-1 transition-all duration-500 ${
                i < step ? "bg-amber-500" : i === step ? "bg-stone-900" : "bg-stone-200"
              }`}
            />
          ))}
          <span className="text-[11px] text-stone-400 ml-2 flex-shrink-0">{step + 1}/{STEPS.length}</span>
        </div>

        {/* Step label */}
        <div className="mb-8">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold-500 mb-4">
            Style Quiz · {currentStep.step}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white thai-serif leading-tight mb-3">
            {currentStep.question}
          </h2>
          <p className="text-sm text-brand-200 leading-relaxed">{currentStep.sub}</p>
        </div>

        {/* Options */}
        <div className="border-t border-white/20">
          {currentStep.options.map((opt) => {
            const isSelected = answers[currentStep.id] === opt.value;
            const swatches = "swatch" in opt && opt.swatch ? COLOR_SWATCHES[opt.value] : null;
            return (
              <button
                key={opt.value}
                onClick={() => selectOption(opt.value)}
                className={`w-full text-left flex items-center justify-between border-b border-white/20 py-5 group transition-all duration-150 ${
                  isSelected ? "bg-white/10 px-4 -mx-4 rounded-xl" : "hover:pl-2"
                }`}
              >
                <div className="flex items-center gap-4">
                  {swatches && (
                    <div className="flex gap-1 flex-shrink-0">
                      {swatches.map((color) => (
                        <div
                          key={color}
                          className="w-3.5 h-3.5"
                          style={{ background: color, border: isSelected ? "none" : "1px solid #4a5568" }}
                        />
                      ))}
                    </div>
                  )}
                  <span
                    className={`text-[15px] font-medium thai-serif transition-colors ${
                      isSelected ? "text-gold-400" : "text-white"
                    }`}
                  >
                    {opt.label}
                  </span>
                </div>
                <ArrowRight
                  size={15}
                  className={`flex-shrink-0 transition-all duration-150 ${
                    isSelected
                      ? "text-gold-400"
                      : "text-white/30 group-hover:text-white group-hover:translate-x-0.5"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Back */}
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-8 flex items-center gap-1.5 text-sm text-brand-300 hover:text-white transition-colors self-start"
          >
            <ArrowLeft size={13} /> ย้อนกลับ
          </button>
        )}
      </div>
    </div>
  );
}
