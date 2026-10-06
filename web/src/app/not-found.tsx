import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="display text-[clamp(6rem,25vw,14rem)] text-almond">404</p>
      <h1 className="display text-4xl">This bar&apos;s been eaten.</h1>
      <p className="mt-3 text-espresso-soft">The page you&apos;re looking for isn&apos;t here.</p>
      <Link href="/" className="btn btn-dark mt-8">Back home</Link>
    </main>
  );
}
