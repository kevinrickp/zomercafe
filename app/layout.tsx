import "./globals.css";
import { ReactNode } from "react";
import NavbarWrapper from "@/components/NavbarWrapper";

export const metadata = {
  title: "Zomer Cafe",
  description: "Enjoy cozy vibes and delicious food.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavbarWrapper>{children}</NavbarWrapper>
      </body>
    </html>
  );
}
