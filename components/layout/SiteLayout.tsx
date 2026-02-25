import Link from "next/link";
import EmailSignup from "../EmailSignup";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-white text-black min-h-screen flex flex-col">

      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            Quant IQ
          </Link>
          <nav className="hidden md:flex gap-8 text-sm text-gray-600">
            <Link href="/#risk">Global Risk</Link>
            <Link href="/#features">Features</Link>
            <Link href="/#approach">Approach</Link>
          </nav>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <EmailSignup />

      <footer className="py-8 text-center text-sm text-gray-500 border-t">
        © 2026 Quant IQ
      </footer>
    </main>
  );
}