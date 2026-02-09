"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, decodeToken, logout } from "@/lib/auth";

export default function InstructorDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    const payload = decodeToken(token);
    const role = payload?.role;
    if (role !== "instructor") {
      if (role === "student") router.replace("/dashboard/student");
      else if (role === "admin") router.replace("/dashboard/admin");
      else logout();
    }
  }, [router]);

  return <>{children}</>;
}
