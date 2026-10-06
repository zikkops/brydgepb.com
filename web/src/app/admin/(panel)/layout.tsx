import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "../actions";
import { Logo } from "@/components/Logo";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

const NAV = [
  { href: "/admin", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Delivery" },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();
  return (
    <div className="flex flex-1 flex-col bg-cream-soft">
      <header className="bg-espresso text-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo className="w-24" />
            <span className="eyebrow !text-[10px] text-cream/60">Admin</span>
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-full px-3 py-2 hover:bg-cream/10">{n.label}</Link>
            ))}
            <Link href="/" className="rounded-full px-3 py-2 text-cream/60 hover:bg-cream/10">View site</Link>
          </nav>
          <form action={signOut} className="flex items-center gap-3 text-sm">
            <span className="text-cream/60">{admin.email}</span>
            <button className="underline underline-offset-4">Sign out</button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
