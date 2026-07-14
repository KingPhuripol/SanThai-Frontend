import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { fabricsApi } from "@/lib/api";
import ProvenanceTimeline from "@/components/ProvenanceTimeline";

interface Props {
  params: { id: string };
}

const REGION_LABELS: Record<string, string> = {
  north: "ภาคเหนือ", northeast: "ภาคอีสาน", central: "ภาคกลาง", south: "ภาคใต้",
};

const REGION_ACCENTS: Record<string, string> = {
  north: "#1a6b5a", northeast: "#8b1a1a", central: "#7a6010", south: "#1a3f8b",
};

// ─── SVG Spec Icons ─────────────────────────────────────────────────────────────

function IconWeave() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="2" width="4" height="4" stroke="currentColor" strokeWidth="1.1" />
      <rect x="10" y="2" width="4" height="4" stroke="currentColor" strokeWidth="1.1" />
      <rect x="6" y="6" width="4" height="4" stroke="currentColor" strokeWidth="1.1" />
      <rect x="2" y="10" width="4" height="4" stroke="currentColor" strokeWidth="1.1" />
      <rect x="10" y="10" width="4" height="4" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function IconDye() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 2C8 2 3 6 3 10C3 12.8 5.2 15 8 15C10.8 15 13 12.8 13 10C13 6 8 2 8 2Z"
        stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 10.5C5 10.5 6 9 8 9.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function IconFiber() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 4C4 1 8 3 8 8C8 13 12 15 14 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M2 8C4 6 7 7 8 10C9 13 12 14 14 12" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeDasharray="2 1" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 1C5.8 1 4 2.8 4 5C4 8.5 8 14 8 14C8 14 12 8.5 12 5C12 2.8 10.2 1 8 1Z"
        stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="5" r="1.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function IconCal() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <line x1="5" y1="1" x2="5" y2="5" stroke="currentColor" strokeWidth="1.1" />
      <line x1="11" y1="1" x2="11" y2="5" stroke="currentColor" strokeWidth="1.1" />
      <line x1="2" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 14C2 11 4.7 9 8 9C11.3 9 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Tag component ───────────────────────────────────────────────────────────────

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block text-[11px] px-2.5 py-0.5 border border-stone-200 text-stone-600 bg-white">
      {label}
    </span>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────────

export default async function LibraryDetailPage({ params }: Props) {
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

  const region = fabric.community?.region ?? "";
  const accent = REGION_ACCENTS[region] ?? "#52221a";
  const regionLabel = REGION_LABELS[region] ?? "";

  const imageUrl =
    fabric.image_url ||
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80";

  const storyTags = fabric.story_tags;

  const specs = [
    { Icon: IconWeave, label: "เทคนิคการทอ", value: fabric.weave_technique },
    { Icon: IconDye,   label: "วิธีการย้อมสี", value: fabric.dye_method },
    { Icon: IconFiber, label: "วัตถุดิบหลัก",  value: fabric.fiber_type },
  ].filter((s) => s.value);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Breadcrumb ──────────────────────────────────────────── */}
      <div className="border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-stone-400">
          <Link href="/library" className="hover:text-stone-700 transition-colors flex items-center gap-1">
            <ArrowLeft size={12} />
            ห้องสมุดลายผ้า
          </Link>
          <span>/</span>
          <span className="text-stone-600 truncate max-w-xs">{fabric.name_th}</span>
        </div>
      </div>

      {/* ── Main layout ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-0 min-h-[70vh]">

          {/* LEFT — Image (sticky) */}
          <div className="lg:sticky lg:top-[56px] lg:self-start lg:h-[calc(100vh-56px)] relative overflow-hidden bg-stone-100">
            <Image
              src={imageUrl}
              alt={fabric.name_th}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {/* Region badge */}
            {regionLabel && (
              <div
                className="absolute top-0 left-0 text-white text-[10px] font-semibold tracking-[0.15em] uppercase px-4 py-2"
                style={{ background: accent }}
              >
                {regionLabel}
              </div>
            )}
            {/* Usage rights badge */}
            <div className="absolute bottom-4 left-4">
              <span
                className={`text-[10px] font-medium tracking-wider uppercase px-3 py-1.5 backdrop-blur-sm ${
                  fabric.usage_rights === "commercial"
                    ? "bg-white/90 text-green-800"
                    : fabric.usage_rights === "personal"
                    ? "bg-white/90 text-sky-800"
                    : "bg-white/90 text-rose-800"
                }`}
              >
                {fabric.usage_rights === "commercial"
                  ? "อนุญาตใช้เชิงพาณิชย์"
                  : fabric.usage_rights === "personal"
                  ? "ใช้ส่วนตัวเท่านั้น"
                  : "สิทธิ์จำกัด"}
              </span>
            </div>
          </div>

          {/* RIGHT — Content */}
          <div className="py-12 lg:px-12">

            {/* Title block */}
            <div className="mb-8">
              <div
                className="w-8 h-0.5 mb-5"
                style={{ background: accent }}
              />
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 thai-serif leading-tight tracking-tight">
                {fabric.name_th}
              </h1>
              {fabric.name_en && (
                <p className="mt-2 text-stone-400 text-sm italic leading-relaxed">
                  {fabric.name_en}
                </p>
              )}
              {fabric.community && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-stone-500">
                  <IconPin />
                  <span>
                    {[fabric.community.name, fabric.community.province]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
              )}
              {fabric.ai_processed && (
                <div className="mt-3">
                  <span className="text-[10px] tracking-widest uppercase text-stone-400 border border-stone-200 px-2 py-0.5">
                    AI Verified
                  </span>
                </div>
              )}
            </div>

            {/* Specs — definition list style */}
            {specs.length > 0 && (
              <div className="mb-8">
                <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-stone-400 mb-4">
                  ข้อมูลสิ่งทอ
                </p>
                <dl className="divide-y divide-stone-100">
                  {specs.map(({ Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4 py-3">
                      <dt className="flex items-center gap-2 text-[11px] text-stone-400 uppercase tracking-wider w-32 flex-shrink-0 pt-0.5">
                        <span className="text-stone-400"><Icon /></span>
                        {label}
                      </dt>
                      <dd className="text-sm text-stone-800 leading-relaxed">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Cultural meaning */}
            {fabric.cultural_meaning_th && (
              <div className="mb-8">
                <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-stone-400 mb-4">
                  ความหมายทางวัฒนธรรม
                </p>
                <blockquote
                  className="border-l-2 pl-4 py-1"
                  style={{ borderColor: accent }}
                >
                  <p className="text-sm text-stone-700 leading-[1.9]">
                    {fabric.cultural_meaning_th}
                  </p>
                  {fabric.cultural_meaning_en && (
                    <p className="mt-3 text-xs text-stone-400 italic leading-relaxed">
                      {fabric.cultural_meaning_en}
                    </p>
                  )}
                </blockquote>
              </div>
            )}

            {/* Story tags */}
            {storyTags && (
              <div className="mb-8 space-y-4">
                {storyTags.occasions && storyTags.occasions.length > 0 && (
                  <div>
                    <p className="text-[10px] text-stone-400 tracking-widest uppercase mb-2">โอกาสใช้งาน</p>
                    <div className="flex flex-wrap gap-1.5">
                      {storyTags.occasions.map((o) => <Tag key={o} label={o} />)}
                    </div>
                  </div>
                )}
                {storyTags.symbolism && storyTags.symbolism.length > 0 && (
                  <div>
                    <p className="text-[10px] text-stone-400 tracking-widest uppercase mb-2">สัญลักษณ์</p>
                    <div className="flex flex-wrap gap-1.5">
                      {storyTags.symbolism.map((s) => <Tag key={s} label={s} />)}
                    </div>
                  </div>
                )}
                {storyTags.color_palette && storyTags.color_palette.length > 0 && (
                  <div>
                    <p className="text-[10px] text-stone-400 tracking-widest uppercase mb-2">โทนสี</p>
                    <div className="flex flex-wrap gap-1.5">
                      {storyTags.color_palette.map((c) => <Tag key={c} label={c} />)}
                    </div>
                  </div>
                )}
                {storyTags.cultural_tags && storyTags.cultural_tags.length > 0 && (
                  <div>
                    <p className="text-[10px] text-stone-400 tracking-widest uppercase mb-2">แท็ก</p>
                    <div className="flex flex-wrap gap-1.5">
                      {storyTags.cultural_tags.map((c) => <Tag key={c} label={c} />)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80"
              style={{ background: accent }}
            >
              <ShoppingBag size={15} />
              ดูในตลาดผ้า
            </Link>

          </div>
        </div>
      </div>

      {/* ── Artisan ──────────────────────────────────────────────── */}
      {fabric.artisan && (
        <div className="border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-stone-400 mb-6">
                ช่างทอ
              </p>
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-16 h-16 bg-stone-100 overflow-hidden flex items-center justify-center">
                  {fabric.artisan.avatar_url ? (
                    <Image
                      src={fabric.artisan.avatar_url}
                      alt={fabric.artisan.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-stone-400"><IconUser /></span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-stone-900 thai-serif text-lg leading-tight">
                    {fabric.artisan.name}
                  </p>
                  {fabric.community?.province && (
                    <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
                      <IconPin />
                      {fabric.community.province}
                    </p>
                  )}
                  {fabric.artisan.bio_th && (
                    <p className="mt-3 text-sm text-stone-600 leading-[1.85]">
                      {fabric.artisan.bio_th}
                    </p>
                  )}
                  {fabric.artisan.bio_en && (
                    <p className="mt-2 text-xs text-stone-400 italic leading-relaxed">
                      {fabric.artisan.bio_en}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Provenance ──────────────────────────────────────────── */}
      {provenance && provenance.events.length > 0 && (
        <div className="border-t border-stone-200 bg-stone-50">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-stone-400 mb-2">
              Provenance
            </p>
            <h2 className="text-xl font-bold text-stone-900 thai-serif mb-8">
              เส้นทางการผลิต
            </h2>
            <div className="max-w-2xl">
              <ProvenanceTimeline
                events={provenance.events}
                chainValid={provenance.chain_valid}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Meta ─────────────────────────────────────────────────── */}
      <div className="border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-6 text-[10px] text-stone-300 flex-wrap">
          <span className="flex items-center gap-1.5">
            <IconCal />
            บันทึกเมื่อ{" "}
            {new Date(fabric.created_at).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="tracking-widest uppercase">SanThai · Digital Heritage</span>
        </div>
      </div>

    </div>
  );
}
