import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import DashboardPreview from "@/components/DashboardPreview"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">
        Quant IQ
      </h1>

      <p className="mt-4 text-gray-500">
        AI-powered market intelligence
      </p>
    </main>
  );
}