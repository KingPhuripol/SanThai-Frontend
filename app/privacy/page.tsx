"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function PrivacyPage() {
  const { locale } = useLanguage();
  const copy = locale === "en" ? {
    title: "Privacy Notice", intro: "We collect account information such as your name, email, and store details to create accounts, provide marketplace services, contact you about orders, and keep the system secure.",
    sections: [["Transaction information", "When an order is made, we process information needed for payment, delivery, and customer support, such as buyer name, email, address, and order status."], ["Use and disclosure", "Data is used to provide services, prevent fraud, produce aggregate reports, and meet applicable obligations. We do not sell personal data."], ["Your rights and contact", "To request access, correction, or deletion of account data, contact SanThai using the registered email so we can verify your identity."], ["Document updates", "If we make a material update, we will publish the new version here and may ask for consent again before continued use."]], note: "This document is a draft and requires legal review before commercial launch.", back: "Back to registration",
  } : {
    title: "ประกาศความเป็นส่วนตัว", intro: "เราเก็บข้อมูลบัญชี เช่น ชื่อ อีเมล และข้อมูลร้านค้า เพื่อสร้างบัญชี ให้บริการซื้อขาย ติดต่อเรื่องคำสั่งซื้อ และดูแลความปลอดภัยของระบบ",
    sections: [["ข้อมูลการซื้อขาย", "เมื่อมีคำสั่งซื้อ เราเก็บข้อมูลที่จำเป็นต่อการชำระเงิน การจัดส่ง และการสนับสนุนลูกค้า เช่น ชื่อผู้ซื้อ อีเมล ที่อยู่ และสถานะคำสั่งซื้อ"], ["การใช้งานและการเปิดเผย", "ข้อมูลจะใช้เพื่อให้บริการ ป้องกันการทุจริต สรุปรายงานเชิงสถิติ และปฏิบัติตามภาระหน้าที่ที่เกี่ยวข้อง เราไม่ขายข้อมูลส่วนบุคคลเป็นสินค้า"], ["สิทธิและการติดต่อ", "หากต้องการขอเข้าถึง แก้ไข หรือลบข้อมูลบัญชี โปรดติดต่อทีมสานไทยพร้อมอีเมลที่ใช้สมัคร เพื่อให้เราตรวจสอบตัวตนก่อนดำเนินการ"], ["การปรับปรุงเอกสาร", "เมื่อมีการปรับปรุงสาระสำคัญ เราจะแสดงเวอร์ชันใหม่ ณ หน้านี้ และอาจขอความยินยอมอีกครั้งก่อนใช้งานต่อ"]], note: "เอกสารฉบับนี้เป็นร่างและต้องผ่านการตรวจทานทางกฎหมายก่อนเปิดให้บริการเชิงพาณิชย์", back: "กลับไปสมัครสมาชิก",
  };
  return <main className="min-h-screen bg-stone-50 px-4 pb-16 pt-28"><article className="mx-auto max-w-3xl rounded-3xl border border-amber-100 bg-white p-7 leading-relaxed text-brand-900 shadow-sm md:p-10"><p className="text-xs font-bold tracking-widest text-gold-600">SANTHAI · VERSION 2026-07-18</p><h1 className="mb-6 mt-2 text-3xl font-bold thai-serif">{copy.title}</h1><section className="space-y-4 text-sm"><p>{copy.intro}</p>{copy.sections.map(([title, body]) => <div key={title}><h2 className="text-lg font-bold">{title}</h2><p>{body}</p></div>)}</section><p className="mt-8 text-xs text-brand-900/50">{copy.note}</p><Link href="/register" className="mt-6 inline-block font-bold underline">{copy.back}</Link></article></main>;
}
