"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ReservationCountdown({ reservedUntil }: { reservedUntil: string }) {
  const target = new Date(reservedUntil).getTime();
  const [remaining, setRemaining] = useState(() => target - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(target - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  const expired = remaining <= 0;

  return (
    <div
      className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border ${
        expired
          ? "bg-red-50 border-red-200 text-red-600"
          : "bg-amber-50 border-amber-200 text-amber-700"
      }`}
    >
      <Clock size={13} />
      {expired
        ? "หมดเวลาชำระเงินแล้ว การจองอาจถูกยกเลิก"
        : `กรุณาชำระเงินภายใน ${formatRemaining(remaining)} มิฉะนั้นการจองจะถูกยกเลิกอัตโนมัติ`}
    </div>
  );
}
