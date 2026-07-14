import Link from "next/link";
import Image from "next/image";
import { MapPin, Layers, BadgeCheck } from "lucide-react";
import type { Product } from "@/lib/types";

interface FabricCardProps {
  product: Product;
}

const REGION_LABELS: Record<string, string> = {
  north: "ภาคเหนือ",
  northeast: "ภาคอีสาน",
  central: "ภาคกลาง",
  south: "ภาคใต้",
};

/** Tiny Thai diamond for card accents */
function CardDiamond({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden>
      <polygon
        points="5,0.5 9.5,5 5,9.5 0.5,5"
        fill="#d4af37"
        fillOpacity="0.7"
      />
      <polygon
        points="5,2.5 7.5,5 5,7.5 2.5,5"
        fill="#f5d98a"
        fillOpacity="0.6"
      />
    </svg>
  );
}

export default function FabricCard({ product }: FabricCardProps) {
  const imageUrl =
    product.images?.[0] ||
    product.fabric?.image_url ||
    `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80`;

  return (
    <Link href={`/marketplace/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-amber-100/80 thai-card-hover relative">
        {/* Thai Kanok woven top stripe */}
        <div className="relative h-2 w-full overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #8b1a1a 0%, #b8981e 20%, #d4af37 40%, #f5d98a 50%, #d4af37 60%, #b8981e 80%, #8b1a1a 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='8'%3E%3Cpolygon points='8%2C1 15%2C4 8%2C7 1%2C4' fill='none' stroke='%23fdf8f0' stroke-width='0.6' stroke-opacity='0.3'/%3E%3C/svg%3E\")",
              backgroundSize: "16px 8px",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
            }}
          />
        </div>

        {/* Image container */}
        <div className="relative h-52 overflow-hidden bg-stone-100 thai-stripe-bg">
          <Image
            src={imageUrl}
            alt={product.title_th}
            fill
            className="object-cover group-hover:scale-107 transition-transform duration-600"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Image overlay — subtle Thai pattern on hover */}
          <div className="absolute inset-0 thai-diamond-bg opacity-0 group-hover:opacity-20 transition-opacity duration-400" />

          {/* Badges */}
          {product.fabric?.usage_rights === "commercial" && (
            <div className="absolute top-2 right-2 bg-white/92 backdrop-blur-sm text-green-700 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <BadgeCheck size={10} />
              ใช้เชิงพาณิชย์ได้
            </div>
          )}

          {/* Digital ID badge with Thai diamond */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-brand-900/85 backdrop-blur-sm text-gold-400 text-xs font-medium px-2.5 py-1 rounded-full">
            <CardDiamond size={8} />
            Digital ID
          </div>

          {/* Region top-left chip — jade color */}
          {product.community?.region && (
            <div
              className="absolute top-2 left-2 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: "rgba(26,107,90,0.82)" }}
            >
              {REGION_LABELS[product.community.region] ||
                product.community.region}
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-4">
          <h3 className="font-bold text-brand-900 text-sm leading-snug line-clamp-2 thai-serif">
            {product.title_th}
          </h3>
          {product.title_en && (
            <p className="text-brand-400 text-[11px] mt-0.5 line-clamp-1 italic">
              {product.title_en}
            </p>
          )}

          {/* Separator */}
          <div
            className="my-2 h-px"
            style={{
              background:
                "linear-gradient(to right, rgba(212,175,55,0.3), transparent)",
            }}
          />

          {/* Meta */}
          <div className="space-y-1">
            {product.community?.province && (
              <div className="flex items-center gap-1.5 text-xs text-brand-500">
                <MapPin size={10} className="text-gold-600 flex-shrink-0" />
                <span>{product.community.province}</span>
              </div>
            )}
            {product.fabric?.weave_technique && (
              <div className="flex items-center gap-1.5 text-xs text-brand-500">
                <Layers size={10} className="text-gold-600 flex-shrink-0" />
                <span className="line-clamp-1">
                  {product.fabric.weave_technique}
                </span>
              </div>
            )}
          </div>

          {/* Occasion tags */}
          {product.fabric?.story_tags?.occasions?.length ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {product.fabric.story_tags.occasions.slice(0, 2).map((occ) => (
                <span
                  key={occ}
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200"
                >
                  <CardDiamond size={6} />
                  {occ}
                </span>
              ))}
            </div>
          ) : null}

          {/* Price row */}
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-base font-bold text-brand-900 thai-serif">
                ฿{product.price_thb.toLocaleString()}
              </p>
              <p className="text-[10px] text-brand-400">
                ${product.price_usd.toFixed(0)} USD
              </p>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                product.stock > 0
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {product.stock > 0 ? `เหลือ ${product.stock} ชิ้น` : "หมดแล้ว"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
