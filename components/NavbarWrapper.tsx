"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isLogin = pathname?.startsWith("/login");

  if (isDashboard || isLogin) return <>{children}</>; // Jangan tampilkan Navbar & Footer di dashboard

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4">{children}</main>
      <Footer />
    </>
  );
}
