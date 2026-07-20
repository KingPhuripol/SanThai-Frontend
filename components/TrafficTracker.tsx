"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analyticsApi } from "@/lib/api";

const KEY = "santhai_analytics_id";

function visitorId() {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function trackEvent(event_name: string, extra: { product_id?: number; metadata?: Record<string, unknown> } = {}) {
  if (typeof window === "undefined") return;
  analyticsApi.event({ event_name, path: window.location.pathname, anonymous_id: visitorId(), ...extra }).catch(() => undefined);
}

export default function TrafficTracker() {
  const pathname = usePathname();
  useEffect(() => {
    trackEvent("page_view");
  }, [pathname]);
  return null;
}
