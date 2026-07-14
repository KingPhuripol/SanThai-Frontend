import { ShieldCheck, ShieldAlert } from "lucide-react";
import type { ProvenanceEvent } from "@/lib/types";

const EVENT_CONFIG: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  raw_material: {
    label: "วัตถุดิบ",
    color: "text-amber-700",
    dot: "bg-amber-400",
  },
  dyeing: { label: "ย้อมสี", color: "text-blue-700", dot: "bg-blue-400" },
  weaving: { label: "การทอ", color: "text-purple-700", dot: "bg-purple-400" },
  finished: {
    label: "สำเร็จรูป",
    color: "text-green-700",
    dot: "bg-green-400",
  },
  listed: { label: "วางขาย", color: "text-gold-700", dot: "bg-gold-400" },
  sold: { label: "จำหน่ายแล้ว", color: "text-brand-700", dot: "bg-brand-600" },
};

interface ProvenanceTimelineProps {
  events: ProvenanceEvent[];
  chainValid: boolean;
}

export default function ProvenanceTimeline({
  events,
  chainValid,
}: ProvenanceTimelineProps) {
  return (
    <div>
      {/* Chain status */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-4 ${
          chainValid
            ? "bg-green-50 text-green-800 border border-green-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}
      >
        {chainValid ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
        {chainValid
          ? `ตรวจสอบแล้ว — Hash chain สมบูรณ์ (${events.length} เหตุการณ์)`
          : "คำเตือน: ไม่สามารถยืนยัน hash chain ได้"}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-3.5 top-0 bottom-0 w-px bg-amber-200" />

        <div className="space-y-4">
          {events.map((event, idx) => {
            const cfg = EVENT_CONFIG[event.event_type] || {
              label: event.event_type,
              color: "text-brand-700",
              dot: "bg-brand-400",
            };

            return (
              <div key={event.id} className="relative flex gap-4">
                {/* Dot */}
                <div
                  className={`relative z-10 mt-1 w-7 h-7 rounded-full ${cfg.dot} flex items-center justify-center shrink-0`}
                >
                  <span className="text-white text-xs font-bold">
                    {idx + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white border border-amber-100 rounded-xl p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-xs text-brand-400">
                      {new Date(event.timestamp).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-brand-800 font-medium">
                    {event.actor_name}
                  </p>
                  {event.location && (
                    <p className="text-xs text-brand-500 mt-0.5">
                      📍 {event.location}
                    </p>
                  )}
                  {event.description_th && (
                    <p className="text-xs text-brand-600 mt-1 leading-relaxed">
                      {event.description_th}
                    </p>
                  )}

                  {/* Hash */}
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-400 font-mono">
                    <span title="Block hash" className="truncate">
                      🔗 {event.hash}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
