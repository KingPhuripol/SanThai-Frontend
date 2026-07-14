"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, Session } from "./auth";

export function useCustomerSession() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== "customer") {
      router.replace("/login");
    } else {
      setSession(s);
    }
    setChecked(true);
  }, [router]);

  return { session, checked };
}
