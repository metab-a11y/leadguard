import type { Metadata } from "next";
import { NavShell } from "@/components/nav-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadGuard by abcstudio",
  description: "No Lead Left Behind — know who needs your attention today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body><NavShell>{children}</NavShell></body>
    </html>
  );
}
