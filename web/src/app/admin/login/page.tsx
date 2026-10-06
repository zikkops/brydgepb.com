import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/Logo";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm rounded-[2rem] bg-paper p-8">
        <Logo className="w-32 text-espresso" />
        <h1 className="display mt-6 text-2xl">Admin</h1>
        {isSupabaseConfigured ? (
          <LoginForm />
        ) : (
          <p className="mt-4 text-sm text-espresso-soft">Supabase isn&apos;t configured yet. Fill in web/.env.local first (see .env.example).</p>
        )}
      </div>
    </main>
  );
}
