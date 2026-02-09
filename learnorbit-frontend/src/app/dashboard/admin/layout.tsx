"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, decodeToken, logout } from "@/lib/auth";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    const payload = decodeToken(token);
    const role = payload?.role;
    if (role !== "admin") {
      if (role === "student") router.replace("/dashboard/student");
      else if (role === "instructor") router.replace("/dashboard/instructor");
      else logout();
    }
  }, [router]);

  return <>{children}</>;
}
