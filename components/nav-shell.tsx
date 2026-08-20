"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/leads", label: "My Leads", icon: "◎" },
  { href: "/rescue", label: "Lead Rescue", icon: "↗" },
  { href: "/performance", label: "Performance", icon: "▥" },
  { href: "/support", label: "Support", icon: "?" },
];

function NavLink({ href, label, icon, mobile = false }: (typeof navItems)[number] & { mobile?: boolean }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link className={`${mobile ? "mobile-nav-link" : "nav-link"} ${active ? "is-active" : ""}`} href={href}>
      <span aria-hidden="true" className="nav-icon">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export function NavShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="LeadGuard home">
          <span className="brand-mark">LG</span>
          <span><strong>LeadGuard</strong><small>by abcstudio</small></span>
        </Link>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => <NavLink key={item.href} {...item} />)}
        </nav>
        <details className="account-menu">
          <summary>
            <span className="avatar">SL</span>
            <span><strong>Sarah Lee</strong><small>Owner</small></span>
            <span aria-hidden="true">⌃</span>
          </summary>
          <div className="account-popover">
            <Link href="/team">Team</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/settings">Settings</Link>
          </div>
        </details>
      </aside>
      <header className="mobile-header">
        <Link href="/" className="brand"><span className="brand-mark">LG</span><strong>LeadGuard</strong></Link>
        <details className="mobile-account">
          <summary aria-label="Open account menu" className="avatar">SL</summary>
          <div className="account-popover">
            <Link href="/team">Team</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/settings">Settings</Link>
          </div>
        </details>
      </header>
      <main className="main-content">{children}</main>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map((item) => <NavLink key={item.href} {...item} mobile />)}
      </nav>
    </div>
  );
}

