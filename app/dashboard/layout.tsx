// app/dashboard/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // Atau cek cookie/session

    if (!isLoggedIn) {
      router.push("/login"); // Redirect kalau belum login
    }
  }, []);

  return <>{children}</>; // Render konten dashboard jika sudah login
}
