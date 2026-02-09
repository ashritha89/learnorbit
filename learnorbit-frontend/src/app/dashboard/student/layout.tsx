"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, decodeToken, logout } from "@/lib/auth";

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    const payload = decodeToken(token);
    const role = payload?.role;
    if (role !== "student") {
      // Redirect based on actual role
      if (role === "instructor") router.replace("/dashboard/instructor");
      else if (role === "admin") router.replace("/dashboard/admin");
      else logout();
    }
  }, [router]);

  return <>{children}</>;
}
