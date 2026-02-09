"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, decodeToken, logout } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    const payload = decodeToken(token);
    const role = payload?.role;
    if (!role) {
      logout();
      return;
    }
    // Allow any authenticated role to access the generic dashboard route
  }, [router]);

  return <>{children}</>;
}
