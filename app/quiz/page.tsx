"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { artisanApi } from "@/lib/api";
import type { Recommendation } from "@/lib/types";
import { useLanguage } from "@/components/LanguageProvider";

const COLOR_SWATCHES: Record<string, string[]> = {
  red_purple:  ["#8b1a1a", "#6b21a8"],
  gold_yellow: ["#d4af37", "#f59e0b"],
  blue_indigo: ["#1a3f8b", "#3730a3"],
  green_earth: ["#1a6b5a", "#713f12"],
  neutral:     ["#f5f0eb", "#d6d3d1"],
};

// ── 8 Hug Mom Character Personas ──────────────────────────────────────────────
const CHARACTERS = [
  {
    id: "nongIndigoDemo", name_th: "น้องครามมิ่งขวัญ", set_th: "ชุดเซ็ทมนต์ครามแห่งภูมิปัญญาไทย (Flagship Demo)", tag_th: "สุขุม / ประณีต / ทรงคุณค่า ย้อมครามธรรมชาติ",
    name_en: "Nong Khram Indigo", set_en: "Heritage Indigo Wisdom Set", tag_en: "Authentic / Refined / Heritage Indigo",
    desc_th: "สื่อถึงบุคลิกที่ลุ่มลึก สง่างาม และมีเอกลักษณ์เฉพาะตัว เปี่ยมด้วยเสน่ห์งานทอมือย้อมครามธรรมชาติ สอดประสานเรื่องราวภูมิปัญญาสานไทยสู่ยุคดิจิทัล (ชุดหลัก: ผ้าฝ้ายทอมือย้อมครามธรรมชาติ ลายดาวล้อมคราม)",
    desc_en: "Expresses calm depth, authentic wisdom and refined handwoven indigo charm.",
    image: "/demo/mascot.png",
    match: (g: string, f: boolean, s: boolean) => true,
  },
  {
    id: "nongPhu", name_th: "น้องภู", set_th: "ชุดเซ็ทสิริบารมีแห่งขุนเขา", tag_th: "สุขุม / ทางการ / ภูมิฐาน",
    name_en: "Nong Phu", set_en: "Mountain Majesty Set", tag_en: "Calm / Formal / Dignified",
    desc_th: "สะท้อนถึงความเป็นผู้นำที่หนักแน่นดั่งขุนเขา แต่เปี่ยมด้วยความเมตตาและรุ่งเรือง (ชุดหลัก: ผ้ายกทอง ลายพุ่มข้าวบิณฑ์ จ.สุรินทร์)",
    desc_en: "Reflects steady leadership like a mountain, full of elegance and prestige. (Main textile: Surin Gold Yok)",
    image: "/hug_mom_images/image1.png",
    match: (g: string, f: boolean, s: boolean) => g === "male" && f && s,
  },
  {
    id: "nongChot", name_th: "น้องโชติ", set_th: "ชุดเซ็ทโชติช่วงชัชวาล", tag_th: "ร่าเริงสดใส / ทางการ / มีชีวิตชีวา",
    name_en: "Nong Chot", set_en: "Radiant Sun Set", tag_en: "Cheerful / Formal / Lively",
    desc_th: "ได้รับแรงบันดาลใจจากแสงตะวันที่ส่องสว่าง สื่อถึงพลังงานบวกและความสำเร็จที่รุ่งโรจน์ (ชุดหลัก: ผ้าไหมมัดหมี่ ลายก้านต่อดอก จ.ขอนแก่น)",
    desc_en: "Inspired by glowing sunlight, conveying positive energy and vibrant success. (Main textile: Khon Kaen Mudmee Silk)",
    image: "/hug_mom_images/image2.png",
    match: (g: string, f: boolean, s: boolean) => g === "male" && f && !s,
  },
  {
    id: "nongKhram", name_th: "น้องคราม", set_th: "ชุดเซ็ทมนต์เสน่ห์แห่งคราม", tag_th: "สุขุม / สบายๆ / ทรงเสน่ห์",
    name_en: "Nong Khram", set_en: "Indigo Charm Set", tag_en: "Calm / Casual / Charming",
    desc_th: "สื่อถึงความสงบเย็นดั่งสายน้ำและความลุ่มลึกของปัญญา (ชุดหลัก: ผ้าฝ้ายย้อมคราม ลายโคม จ.สกลนคร)",
    desc_en: "Expresses tranquility like flowing streams and deep wisdom. (Main textile: Sakon Nakhon Indigo Cotton)",
    image: "/hug_mom_images/image3.png",
    match: (g: string, f: boolean, s: boolean) => g === "male" && !f && s,
  },
  {
    id: "nongThara", name_th: "น้องเมฆ / ธารา", set_th: "ชุดเซ็ทสายน้ำและสตรีทแวร์", tag_th: "ร่าเริงสดใส / สตรีท / สนุกสนาน",
    name_en: "Nong Thara", set_en: "River Flow Street Set", tag_en: "Vibrant / Streetwear / Fun",
    desc_th: "การนำผ้าไทยดั้งเดิมมาปรับสู่ Streetwear สื่อถึงความทันสมัยและความสนุกสนาน (ชุดหลัก: ผ้าลายน้ำไหล จ.น่าน)",
    desc_en: "Adapting traditional Thai woven patterns into modern streetwear. (Main textile: Nan Flowing Water Silk)",
    image: "/hug_mom_images/image4.png",
    match: (g: string, f: boolean, s: boolean) => g === "male" && !f && !s,
  },
  {
    id: "nongPrang", name_th: "น้องปราง", set_th: "ชุดเซ็ทกุดั่นรัญจวนจิต", tag_th: "สุขุม / ทางการ / ละเมียดละไม",
    name_en: "Nong Prang", set_en: "Gudan Charm Set", tag_en: "Calm / Formal / Elegant",
    desc_th: "สื่อถึงความงามที่นุ่มนวลแต่สง่างามและมีระเบียบแบบแผน (ชุดหลัก: ผ้าไทย ลายกุดั่นปรางรัญจวน)",
    desc_en: "Embodying soft yet majestic grace and refined traditions. (Main textile: Gudan Thai Silk)",
    image: "/hug_mom_images/image5.png",
    match: (g: string, f: boolean, s: boolean) => g !== "male" && f && s,
  },
  {
    id: "nongDara", name_th: "น้องดารา", set_th: "ชุดเซ็ทมณีดาราส่องแสง", tag_th: "ร่าเริงสดใส / ทางการ / โดดเด่น",
    name_en: "Nong Dara", set_en: "Starlight Jewel Set", tag_en: "Radiant / Formal / Bold",
    desc_th: "สื่อถึงความสดใสที่กระจายตัวประดุจแสงดาวในคืนที่รื่นเริง (ชุดหลัก: ผ้าไหมแพรวา ลายนาค ๑๒ แขน จ.กาฬสินธุ์)",
    desc_en: "Radiating joy and sparkle like starlight at a grand celebration. (Main textile: Kalasin Praewa Silk)",
    image: "/hug_mom_images/image6.png",
    match: (g: string, f: boolean, s: boolean) => g !== "male" && f && !s,
  },
  {
    id: "nongPhana", name_th: "น้องพนา", set_th: "ชุดเซ็ทพนาไลฟ์", tag_th: "สุขุม / ธรรมชาติ / เรียบหรู",
    name_en: "Nong Phana", set_en: "Forest Heritage Set", tag_en: "Calm / Natural / Quiet Luxury",
    desc_th: "สื่อถึงความสงบสุขที่ได้กลับคืนสู่ธรรมชาติและภูมิปัญญาดั้งเดิม (ชุดหลัก: ผ้าจกแม่แจ่ม จ.เชียงใหม่)",
    desc_en: "Connecting with peaceful nature and timeless handmade craft. (Main textile: Chiang Mai Mae Chaem Jok)",
    image: "/hug_mom_images/image7.png",
    match: (g: string, f: boolean, s: boolean) => g !== "male" && !f && s,
  },
  {
    id: "nongFah", name_th: "น้องฟ้า", set_th: "ชุดเซ็ทบานสะพรั่งกลางนภา", tag_th: "ร่าเริงสดใส / อิสระ / พลังบวก",
    name_en: "Nong Fah", set_en: "Sky Blossom Set", tag_en: "Cheerful / Free Spirit / Bright",
    desc_th: "ได้รับแรงบันดาลใจจากดอกไม้ริมทะเลและลมพัดโบก สื่อถึงความเป็นอิสระและพลังบวก (ชุดหลัก: ผ้าบาติกโบราณ ภาคใต้)",
    desc_en: "Inspired by seaside wild blossoms and gentle breezes. (Main textile: Southern Batik)",
    image: "/hug_mom_images/image8.png",
    match: (g: string, f: boolean, s: boolean) => g !== "male" && !f && !s,
  },
];

function getMatchingCharacter(answers: Record<string, string>) {
  if (answers.color === "blue_indigo" || !answers.gender) {
    return CHARACTERS[0];
  }
  const gender = answers.gender || "female";
  const occasion = answers.occasion || "casual";
  const isFormal = ["wedding", "ceremony", "formal"].includes(occasion);
  const personality = answers.personality || "classic";
  const isSukhum = ["classic", "minimal"].includes(personality);

  const matched = CHARACTERS.find((c) => c.match(gender, isFormal, isSukhum));
  return matched || CHARACTERS[0];
}


// ── image rotates per step ────────────────────────────────────────────────────
const STEP_IMAGES = [
  "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_amnat_charoen_01.jpg",
  "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_01.jpg",
  "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_amnat_charoen_046.jpg",
  "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_image_01.jpg",
  "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_image_02.jpg",
];

const STEPS = [
  {
    id: "gender", step: "01",
    question: "คุณเป็นใคร?",
    sub: "เพื่อแนะนำลายและรูปแบบผ้าที่เหมาะกับสไตล์คุณ",
    options: [
      { label: "ผู้หญิง",          value: "female" },
      { label: "ผู้ชาย",           value: "male" },
      { label: "ทุกเพศ / ไม่ระบุ", value: "unisex" },
    ],
  },
  {
    id: "lifestyle", step: "02",
    question: "ไลฟ์สไตล์การพักผ่อนที่คุณชอบมากที่สุด? (MBTI Vibe)",
    sub: "เลือกบรรยากาศที่สื่อถึงพลังในตัวคุณ",
    options: [
      { label: "🌿 ชอบอยู่เงียบๆ กับธรรมชาติและหนังสือเล่มโปรด (Introvert)", value: "nature" },
      { label: "✈️ ชอบออกเดินทาง ท่องเที่ยวพบเจอผู้คนใหม่ๆ (Extrovert)",       value: "travel" },
      { label: "🎨 ชอบทำกิจกรรมสร้างสรรค์ งานคราฟต์ งานศิลปะ (Intuitive)",    value: "creative" },
      { label: "🎉 ชอบเข้าสังคม สังสรรค์ ร่วมกิจกรรมกับเพื่อนฝูง (Social)",  value: "social" },
    ],
  },
  {
    id: "occasion", step: "03",
    question: "ต้องการผ้าไทยสำหรับโอกาสใดเป็นหลัก?",
    sub: "เลือกโอกาสที่ตรงกับความต้องการของคุณ",
    options: [
      { label: "💍 งานแต่งงาน / พิธีมงคลทรงเกียรติ", value: "wedding" },
      { label: "👔 ใส่ทำงาน / ประชุมทางการ",        value: "formal" },
      { label: "☕ ใส่ทั่วไป / ชีวิตประจำวันสุดชิล",  value: "casual" },
      { label: "🎁 ของขวัญทรงคุณค่า / ของที่ระลึก",  value: "gift" },
    ],
  },
  {
    id: "personality", step: "04",
    question: "สไตล์การแต่งกายที่คุณหลงรัก?",
    sub: "บุคลิกของคุณช่วยให้เราเลือกเอกลักษณ์ผ้าได้แม่นยำขึ้น",
    options: [
      { label: "✨ คลาสสิก / ดั้งเดิมทรงเสน่ห์", value: "classic" },
      { label: "🕶️ สตรีทแวร์ / โมเดิร์นร่วมสมัย", value: "modern" },
      { label: "🍃 มินิมอล / เรียบหรูดูดี",      value: "minimal" },
      { label: "🔥 สีสันสดใส / โดดเด่นสะดุดตา",   value: "bold" },
    ],
  },
  {
    id: "color", step: "05",
    question: "โทนสีผ้าไทยที่คุณรู้สึกชอบมากที่สุด?",
    sub: "สีครามธรรมชาติและโทนสีมงคลไทย",
    options: [
      { label: "💙 น้ำเงิน / ครามธรรมชาติ (Demo Special)", value: "blue_indigo", swatch: true },
      { label: "👑 ทอง / เหลืองอุไร",                      value: "gold_yellow", swatch: true },
      { label: "🍷 แดง / ม่วงสิริมงคล",                   value: "red_purple",  swatch: true },
      { label: "🌿 เขียว / ธรรมชาติ",                      value: "green_earth", swatch: true },
      { label: "🤍 ขาว / ครีม / เบจมินิมอล",                value: "neutral",     swatch: true },
    ],
  },
  {
    id: "values", step: "06",
    question: "คุณให้ความสำคัญกับสิ่งใดมากที่สุดเวลาเลือกผ้าไทย?",
    sub: "คุณค่าของผ้าไทยในมุมมองของคุณ",
    options: [
      { label: "📜 เรื่องราว ภูมิปัญญาย้อมครามและ SanThai Passport", value: "heritage" },
      { label: "🧵 สัมผัสนุ่มสบาย สวมใส่ง่าย ระบายอากาศดี",          value: "comfort" },
      { label: "💎 ลวดลายโดดเด่น ยอดเยี่ยมไม่ซ้ำใคร",                 value: "uniqueness" },
      { label: "🏷️ ความคุ้มค่า คุณภาพทอมือ 100%",                     value: "value" },
    ],
  },
];

const QUIZ_EN: Record<string, { question: string; sub: string; options: Record<string, string> }> = {
  gender: { question: "Who are you?", sub: "This helps us suggest suitable patterns and fabric styles.", options: { female: "Women", male: "Men", unisex: "Any gender / prefer not to say" } },
  occasion: { question: "What occasion is the textile for?", sub: "Choose the occasion that best matches your needs.", options: { wedding: "Wedding / auspicious ceremony", ceremony: "Memorial / important ceremony", formal: "Work / meeting", casual: "Everyday wear", gift: "Gift / souvenir" } },
  personality: { question: "Which style do you prefer?", sub: "Your style helps us choose patterns more precisely.", options: { classic: "Classic / traditional", modern: "Modern / contemporary", minimal: "Minimal / simple", bold: "Colourful / bold" } },
  color: { question: "Which colour palette do you prefer?", sub: "Colour informs the pattern and dye recommendation.", options: { red_purple: "Red / purple", gold_yellow: "Gold / yellow", blue_indigo: "Blue / indigo", green_earth: "Green / earth", neutral: "White / cream / beige" } },
  budget: { question: "What is your budget?", sub: "There is no wrong answer.", options: { "3000": "Up to ฿3,000", "6000": "฿3,000 – ฿6,000", "10000": "฿6,000 – ฿10,000", "0": "No limit" } },
};

export default function QuizPage() {
  const { locale, pick } = useLanguage();
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);

  const currentStep = STEPS[step];
  const englishStep = QUIZ_EN[currentStep.id];
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
      
      const demoRec: Recommendation = {
        fabric_id: 1,
        product_id: 1,
        name_th: "ผ้าฝ้ายทอมือย้อมครามธรรมชาติ ลายดาวล้อมคราม",
        name_en: "Handwoven Natural Indigo Cotton Fabric",
        province: "สกลนคร",
        artisan_name: "แม่บัวบาน ศรีวิเศษ",
        price_thb: 3800,
        price_usd: 110,
        match_score: 0.99,
        image_url: "/demo/fabric.png",
        reason: "ผ้าฝ้ายทอมือย้อมครามธรรมชาติโทนสีน้ำเงินลุ่มลึก ย้อมครามแท้จากภูมิปัญญาพื้นบ้าน ลายทอละเอียดประณีต แมตช์กับบุคลิกและตัวตนของคุณอย่างสมบูรณ์แบบ 10000%",
        cultural_meaning_th: "สื่อถึงความสงบ ลุ่มลึก และปัญญาของภูมิปัญญาย้อมครามสกลนคร",
      };

      const otherRecs = (recs.recommendations || []).filter(r => r.product_id !== 1);
      setResults([demoRec, ...otherRecs]);
    } catch {
      setResults([{
        fabric_id: 1,
        product_id: 1,
        name_th: "ผ้าฝ้ายทอมือย้อมครามธรรมชาติ ลายดาวล้อมคราม",
        name_en: "Handwoven Natural Indigo Cotton Fabric",
        province: "สกลนคร",
        artisan_name: "แม่บัวบาน ศรีวิเศษ",
        price_thb: 3800,
        price_usd: 110,
        match_score: 0.99,
        image_url: "/demo/fabric.png",
        reason: "ผ้าฝ้ายทอมือย้อมครามธรรมชาติโทนสีน้ำเงินลุ่มลึก ย้อมครามแท้จากภูมิปัญญาพื้นบ้าน ลายทอละเอียดประณีต แมตช์กับบุคลิกและตัวตนของคุณอย่างสมบูรณ์แบบ 10000%",
        cultural_meaning_th: "สื่อถึงความสงบ ลุ่มลึก และปัญญาของภูมิปัญญาย้อมครามสกลนคร",
      }]);
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
              {locale === "en" ? "AI is analysing" : "AI กำลังวิเคราะห์"}
            </p>
            <p className="mt-1.5 text-xs text-white/50">{locale === "en" ? "Usually takes under 10 seconds" : "ใช้เวลาไม่เกิน 10 วินาที"}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (results) {
    return (
      <div className="min-h-screen bg-brand-950 pt-[100px] pb-24 text-white">
        {/* Header */}
        <div className="border-b border-gold-400/20 bg-brand-900/60 backdrop-blur-md py-8">
          <div className="max-w-5xl mx-auto px-6 md:px-12 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-400 mb-1">
                STYLE RESULT · AI RECOMMENDATION
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-white thai-serif">
                {locale === "en" ? "Textiles for you" : "ผ้าที่เหมาะกับคุณ"}
              </h1>
              <p className="mt-2 text-sm text-white/70">
                {locale === "en" ? "AI selected textiles that suit your style and occasion." : "AI ได้เลือกลายผ้าที่ตรงกับบุคลิกและโอกาสของคุณ"}
              </p>
            </div>
            <button
              onClick={() => { setStep(0); setAnswers({}); setResults(null); }}
              className="px-5 py-2.5 rounded-full border border-gold-400/40 text-gold-300 hover:bg-gold-400/10 text-xs font-bold transition-all flex items-center gap-2"
            >
              <ArrowLeft size={14} /> {locale === "en" ? "Start quiz again" : "ทำ Quiz ใหม่"}
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 pt-10">
          {/* Matched Character Persona Card */}
          {(() => {
            const char = getMatchingCharacter(answers);
            return (
              <div className="mb-10 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 rounded-[32px] p-6 md:p-8 border border-gold-400/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="relative w-44 md:w-52 aspect-[3/4] shrink-0 rounded-2xl overflow-hidden border-2 border-gold-400/50 shadow-xl bg-brand-950">
                  <Image
                    src={char.image}
                    alt={locale === "en" ? char.name_en : char.name_th}
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 right-2 text-center text-[11px] font-bold text-gold-300 bg-brand-950/90 py-1 rounded-lg border border-gold-400/30">
                    {locale === "en" ? char.tag_en : char.tag_th}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <div className="inline-block px-3 py-1 bg-gold-400/20 text-gold-300 text-xs font-extrabold rounded-full border border-gold-400/30 mb-3">
                    ✨ YOUR MATCHED IDENTITY · คาแรกเตอร์ประจำตัวคุณ
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white thai-serif leading-tight">
                    {locale === "en" ? char.name_en : char.name_th} <span className="text-gold-400 text-xl font-normal block sm:inline">({locale === "en" ? char.set_en : char.set_th})</span>
                  </h2>
                  <p className="mt-3 text-sm text-brand-200 leading-relaxed">
                    {locale === "en" ? char.desc_en : char.desc_th}
                  </p>
                </div>
              </div>
            );
          })()}

          {results.length === 0 ? (
            <div className="py-20 text-center bg-[#FAF6ED] rounded-[24px] text-brand-900 shadow-xl border border-brand-200">
              <p className="text-4xl mb-3">🧵</p>
              <p className="font-bold text-lg">{locale === "en" ? "No matching textiles found." : "ยังไม่พบลายผ้าที่ตรงกัน"}</p>
              <button onClick={() => { setStep(0); setAnswers({}); setResults(null); }} className="mt-4 px-6 py-2.5 bg-brand-900 text-white text-xs font-bold rounded-full">
                {locale === "en" ? "Try again" : "ลองทำใหม่อีกครั้ง"}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {results.map((rec, i) => {
                const matchPct = Math.min(99, Math.round(rec.match_score > 1 ? rec.match_score : rec.match_score * 100));
                const imageUrl = rec.image_url || "https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric_image_01.jpg";
                return (
                  <div key={rec.fabric_id || i} className="bg-[#FAF6ED] rounded-[28px] p-6 md:p-8 shadow-2xl border border-gold-400/30 text-brand-950 hover:border-gold-400 transition-all flex flex-col md:flex-row gap-6 lg:gap-8 items-start relative overflow-hidden">
                    
                    {/* Rank Badge */}
                    <div className="absolute top-4 left-4 z-10 bg-brand-950 text-gold-400 text-xs font-extrabold px-3 py-1.5 rounded-full border border-gold-400/40 shadow-md">
                      #{i + 1} {locale === "en" ? "Best Match" : "ลายแนะนำ"}
                    </div>

                    {/* Image */}
                    <div className="relative w-full md:w-56 aspect-[4/3] md:aspect-[3/4] rounded-2xl overflow-hidden bg-brand-100 shrink-0 border border-brand-200 shadow-inner mt-6 md:mt-0">
                      <Image src={imageUrl} alt={pick(rec.name_th, rec.name_en)} fill className="object-cover" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between w-full">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-brand-950 thai-serif leading-tight">
                              {pick(rec.name_th, rec.name_en)}
                            </h3>
                            {rec.province && (
                              <p className="text-xs font-semibold text-brand-900/60 mt-1">
                                📍 จ.{rec.province} {rec.artisan_name ? `· โดย ${rec.artisan_name}` : ""}
                              </p>
                            )}
                          </div>

                          {/* Score Badge */}
                          <div className="bg-gradient-to-r from-gold-400 to-gold-500 text-brand-950 px-4 py-2 rounded-2xl shadow-md border border-gold-300 text-center shrink-0 w-fit">
                            <span className="text-2xl font-black thai-serif leading-none">{matchPct}%</span>
                            <span className="text-[10px] font-bold block uppercase tracking-wider text-brand-900/80">{locale === "en" ? "Match" : "ตรงกัน"}</span>
                          </div>
                        </div>

                        {/* AI Narrative Reason */}
                        <div className="bg-white/80 p-4 rounded-2xl border border-brand-200/60 mb-4">
                          <p className="text-xs font-bold text-brand-900/50 mb-1 flex items-center gap-1">
                            ✨ {locale === "en" ? "Why AI recommends this:" : "ทำไม AI ถึงแนะนำลายนี้:"}
                          </p>
                          <p className="text-sm text-brand-900 leading-relaxed">
                            {rec.reason || rec.cultural_meaning_th || "ลายผ้านี้มีเอกลักษณ์ที่เหมาะกับสไตล์และโอกาสที่คุณเลือกอย่างลงตัว"}
                          </p>
                        </div>

                        {rec.price_thb && (
                          <div className="text-xl font-extrabold text-brand-950 thai-serif mb-6">
                            {locale === "en" ? `$${(rec.price_thb / 35).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD` : `฿${rec.price_thb.toLocaleString()}`}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        {rec.product_id ? (
                          <Link
                            href={`/marketplace/${rec.product_id}`}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-900 text-white font-bold text-sm rounded-full hover:bg-brand-800 transition-all shadow-md"
                          >
                            {locale === "en" ? "View Product" : "ดูสินค้าชิ้นนี้"} <ArrowRight size={16} className="text-gold-400" />
                          </Link>
                        ) : null}
                        <Link
                          href={rec.fabric_id ? `/fabric/${rec.fabric_id}` : "/marketplace"}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-brand-900 text-brand-900 font-bold text-sm rounded-full hover:bg-brand-900 hover:text-white transition-all shadow-sm"
                        >
                          {locale === "en" ? "View Digital Passport" : "ดู SanThai Passport"}
                        </Link>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 text-sm font-bold text-gold-400 hover:text-gold-300 transition-colors underline underline-offset-4"
            >
              {locale === "en" ? "Explore Marketplace →" : "ดูตลาดผ้าไทยทั้งหมด →"}
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
          alt={locale === "en" ? "Thai textile pattern" : "ลายผ้าไทย"}
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
            {locale === "en" ? "SanThai — Thai handwoven textiles" : "สานไทย — ผ้าทอมือไทย"}
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
            {locale === "en" ? englishStep.question : currentStep.question}
          </h2>
          <p className="text-sm text-brand-200 leading-relaxed">{locale === "en" ? englishStep.sub : currentStep.sub}</p>
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
                    {locale === "en" ? englishStep.options[opt.value] || opt.label : opt.label}
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
            <ArrowLeft size={13} /> {locale === "en" ? "Back" : "ย้อนกลับ"}
          </button>
        )}
      </div>
    </div>
  );
}
