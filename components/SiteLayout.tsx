import Link from "next/link";
import EmailSignup from "./EmailSignup";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-white text-black min-h-screen flex flex-col">

      {/* Navbar */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Quant IQ
          </Link>

          <nav className="hidden md:flex gap-8 text-sm text-gray-600">
            <Link href="/#risk" className="hover:text-black">
              Global Risk
            </Link>
            <Link href="/#features" className="hover:text-black">
              Features
            </Link>
            <Link href="/#approach" className="hover:text-black">
              Approach
            </Link>
            <Link href="/#early" className="hover:text-black">
              Early Access
            </Link>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <div className="flex-1">{children}</div>

      {/* Email Capture */}
      <EmailSignup />

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 border-t">
        © 2026 Quant IQ. All rights reserved.
      </footer>
    </main>
  );
}