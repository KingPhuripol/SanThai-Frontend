import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  MapPin,
  Layers,
  Droplets,
  User,
  ShieldCheck,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { fabricsApi, productsApi } from "@/lib/api";
import ProvenanceTimeline from "@/components/ProvenanceTimeline";

interface Props {
  params: { id: string };
}

export default async function FabricDigitalIDPage({ params }: Props) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  let fabric, provenance;
  try {
    [fabric, provenance] = await Promise.all([
      fabricsApi.get(id),
      fabricsApi.getProvenance(id),
    ]);
  } catch {
    notFound();
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3006");
  const qrUrl = `${appUrl}/fabric/${id}`;

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Back nav */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-900"
        >
          <ArrowLeft size={15} />
          กลับตลาดผ้า
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-4 grid lg:grid-cols-5 gap-6">
        {/* Left column — Image + QR */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-stone-200 aspect-square shadow-md">
            <Image
              src={
                fabric.image_url ||
                `https://shqgmstbrwkxycyellgn.supabase.co/storage/v1/object/public/santhai/seed-migration/2026-07-18/thai_fabric.jpg`
              }
              alt={fabric.name_th}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          </div>

          {/* QR Code card */}
          <div className="bg-white rounded-2xl border border-amber-100 p-4 text-center shadow-sm">
            <p className="text-xs text-brand-400 mb-2 font-medium uppercase tracking-wide">
              SanThai Passport — ตรวจสอบข้อมูลผ้า
            </p>
            <div className="flex justify-center">
              <QRCodeSVG
                value={qrUrl}
                size={140}
                bgColor="#ffffff"
                fgColor="#2e1008"
                level="M"
                includeMargin
              />
            </div>
            <p className="text-xs text-brand-400 mt-2 font-mono break-all">
              {qrUrl}
            </p>
          </div>
        </div>

        {/* Right column — Details */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header card */}
          <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
            {/* AI badge */}
            {fabric.ai_processed && (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full mb-3">
                <ShieldCheck size={12} />
                ตรวจสอบโดย AI แล้ว
              </div>
            )}

            <h1 className="text-2xl font-bold text-brand-900">
              {fabric.name_th}
            </h1>
            {fabric.name_en && (
              <p className="text-brand-400 mt-0.5">{fabric.name_en}</p>
            )}

            {/* Meta row */}
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-brand-600">
              {fabric.community?.province && (
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  {fabric.community.province}
                </div>
              )}
              {fabric.weave_technique && (
                <div className="flex items-center gap-1">
                  <Layers size={14} />
                  {fabric.weave_technique}
                </div>
              )}
              {fabric.dye_method && (
                <div className="flex items-center gap-1">
                  <Droplets size={14} />
                  {fabric.dye_method}
                </div>
              )}
            </div>
          </div>

          {/* Artisan card */}
          {fabric.artisan && (
            <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <User size={22} className="text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-brand-900">
                    {fabric.artisan.name}
                  </p>
                  {fabric.community && (
                    <p className="text-xs text-brand-500">
                      {fabric.community.name} · {fabric.community.province}
                    </p>
                  )}
                  {fabric.artisan.bio_th && (
                    <p className="text-sm text-brand-600 mt-2 leading-relaxed">
                      {fabric.artisan.bio_th}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Cultural meaning */}
          {(fabric.cultural_meaning_th || fabric.cultural_meaning_en) && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
              <h3 className="font-semibold text-amber-900 mb-2">
                ความหมายทางวัฒนธรรม
              </h3>
              {fabric.cultural_meaning_th && (
                <p className="text-sm text-amber-800 leading-relaxed">
                  {fabric.cultural_meaning_th}
                </p>
              )}
              {fabric.cultural_meaning_en && (
                <p className="text-sm text-amber-700 mt-2 leading-relaxed italic">
                  {fabric.cultural_meaning_en}
                </p>
              )}
            </div>
          )}

          {/* Story tags */}
          {fabric.story_tags && (
            <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
              <h3 className="font-semibold text-brand-900 mb-3">ข้อมูล AI</h3>
              <div className="space-y-2">
                {fabric.story_tags.occasions?.length ? (
                  <div>
                    <p className="text-xs text-brand-400 mb-1">
                      โอกาสที่เหมาะสม
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {fabric.story_tags.occasions.map((o) => (
                        <span
                          key={o}
                          className="text-xs px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200"
                        >
                          {o}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {fabric.story_tags.cultural_tags?.length ? (
                  <div>
                    <p className="text-xs text-brand-400 mb-1">แท็กวัฒนธรรม</p>
                    <div className="flex flex-wrap gap-1">
                      {fabric.story_tags.cultural_tags.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 bg-blue-50 text-blue-800 rounded-full border border-blue-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Usage rights */}
          <div
            className={`rounded-2xl p-4 text-sm font-medium border ${
              fabric.usage_rights === "commercial"
                ? "bg-green-50 border-green-200 text-green-800"
                : fabric.usage_rights === "restricted"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-yellow-50 border-yellow-200 text-yellow-800"
            }`}
          >
            สิทธิ์การใช้งาน:{" "}
            {fabric.usage_rights === "commercial"
              ? "⚖️ อนุญาตใช้เชิงพาณิชย์"
              : fabric.usage_rights === "restricted"
                ? "🔒 จำกัดการใช้งาน"
                : "👤 ใช้ส่วนตัวเท่านั้น"}
          </div>

          {/* CTA button */}
          <Link
            href={`/marketplace/${id}`}
            className="flex items-center justify-center gap-2 w-full bg-brand-900 hover:bg-gold-600 text-white font-semibold py-3.5 rounded-2xl transition-colors shadow-md"
          >
            <ShoppingBag size={18} />
            ดูรายละเอียดและสั่งซื้อ
          </Link>
        </div>
      </div>

      {/* Provenance section */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-brand-900 mb-4">
            🔗 Blockchain Provenance
          </h2>
          <ProvenanceTimeline
            events={provenance.events}
            chainValid={provenance.chain_valid}
          />
        </div>
      </div>
    </div>
  );
}
