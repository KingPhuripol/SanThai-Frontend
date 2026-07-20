"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

const sections = {
  th: [
    ["การสมัครและร้านค้า", "SanThai เปิดร้านค้าแบบคำเชิญและตรวจสอบก่อนเผยแพร่สินค้า ร้านค้าต้องให้ข้อมูลชุมชน ผู้มีอำนาจ และข้อมูลรับเงินตามที่ทีม SanThai ร้องขอ พร้อมยอมรับข้อตกลงฉบับร้านค้าก่อนเริ่มจัดการสินค้า"],
    ["สถานะของ SanThai", "SanThai เป็นแพลตฟอร์มตัวกลางเพื่ออำนวยความสะดวกในการซื้อขายระหว่างร้านค้าและผู้ซื้อ ไม่ใช่ผู้ผลิตหรือเจ้าของสินค้าที่ร้านค้านำเสนอ เว้นแต่มีการระบุเป็นอย่างอื่นอย่างชัดเจน"],
    ["ข้อมูลสินค้าและระยะเวลา", "ร้านค้ารับรองความถูกต้องของแหล่งผลิต เทคนิคการผลิต วัตถุดิบ ราคา สต็อก และระยะเวลาจัดเตรียมสินค้า หากมีความล่าช้าต้องแจ้งผ่านระบบก่อนถึงกำหนด"],
    ["การชำระเงินและข้อพิพาท", "รายละเอียดค่าคอมมิชชัน รอบโอนเงิน การยกเลิก คืนเงิน และระงับข้อพิพาท ให้เป็นไปตามเงื่อนไขล่าสุดที่ SanThai แจ้งแก่ร้านค้า"],
    ["ทรัพย์สินทางปัญญาและข้อมูลส่วนบุคคล", "ลวดลายและภูมิปัญญายังคงเป็นสิทธิของผู้สร้างสรรค์หรือชุมชนต้นทาง SanThai ใช้ข้อมูลส่วนบุคคลเท่าที่จำเป็นต่อการให้บริการ และไม่แสดงข้อมูล KYC หรือข้อมูลรับเงินใน SanThai Passport"],
    ["SanThai Passport และ AI", "Passport แสดงข้อมูลสินค้าที่ร้านค้าและ SanThai บันทึกไว้ตามระดับสถานะการตรวจสอบ การสแกนภาพและภาพที่สร้างด้วย AI มีไว้เพื่อค้นหารายการหรือแสดงตัวอย่าง ไม่ใช่คำรับรองความแท้ คุณภาพ สีจริง หรือสิทธิในลวดลาย"],
  ],
  en: [
    ["Registration and stores", "SanThai admits stores by invitation and verifies them before products can be published. Stores must provide their community, authorised representative, and payout information when requested, and accept the Store Terms before managing products."],
    ["SanThai’s role", "SanThai is a marketplace platform that facilitates transactions between stores and buyers. It is not the maker or owner of a store’s listed goods unless clearly stated otherwise."],
    ["Product information and timing", "Stores are responsible for the accuracy of production origin, production methods, materials, pricing, stock, and preparation times. Delays must be communicated through the platform before the stated deadline."],
    ["Payments and disputes", "Commission, payout cycles, cancellations, refunds, and dispute resolution follow the latest terms communicated by SanThai to stores."],
    ["Intellectual property and personal data", "Patterns and traditional knowledge remain the property of their creators or source communities. SanThai uses personal data only as necessary to provide the service, and never displays KYC or payout details in a SanThai Passport."],
    ["SanThai Passport and AI", "A Passport displays information recorded by the store and SanThai at its stated verification level. Image scanning and AI-generated imagery are for discovery or illustration only; they do not certify authenticity, quality, actual colour, or pattern rights."],
  ],
} as const;

export default function TermsPage() {
  const { locale } = useLanguage();
  return <main className="min-h-screen bg-stone-50 px-4 pb-16 pt-28"><article className="mx-auto max-w-3xl rounded-3xl border border-amber-100 bg-white p-7 leading-relaxed text-brand-900 shadow-sm md:p-10"><p className="text-xs font-bold tracking-widest text-gold-600">SANTHAI · STORE TERMS · VERSION 2026-07-18-store-v1</p><h1 className="mt-2 text-3xl font-bold thai-serif">{locale === "en" ? "Terms of Service" : "ข้อกำหนดการใช้บริการ"}</h1><p className="mt-4 text-sm leading-7 text-brand-900/70">{locale === "en" ? "A summary of SanThai service terms and in-platform acceptance. Invited stores must accept this version before adding or publishing products." : "เอกสารสรุปสำหรับการใช้งาน SanThai และการยอมรับผ่านระบบ ร้านค้าที่ได้รับคำเชิญจะต้องยอมรับเวอร์ชันนี้ก่อนเพิ่มหรือเผยแพร่สินค้า"}</p><div className="mt-8 space-y-7">{sections[locale].map(([title, body]) => <section key={title}><h2 className="text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-7 text-brand-900/70">{body}</p></section>)}</div><div className="mt-8 rounded-2xl bg-amber-50 p-4 text-xs leading-6 text-amber-900">{locale === "en" ? "This is a demo-formatted Terms of Service used for in-platform acceptance. Legal approval is required before commercial launch." : "เอกสารนี้จัดรูปแบบตาม Terms of Service ที่ได้รับสำหรับเดโมและการยอมรับในระบบ ต้องให้ฝ่ายกฎหมายอนุมัติข้อความฉบับใช้งานจริงก่อนเปิดรับธุรกรรมเชิงพาณิชย์"}</div><Link href="/register" className="mt-7 inline-block text-sm font-bold underline">{locale === "en" ? "Back to registration" : "กลับไปสมัครสมาชิก"}</Link></article></main>;
}
