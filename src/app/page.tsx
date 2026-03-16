import Navbar from "@/components/Navbar"
import DashboardPreview from "@/components/DashboardPreview"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import ThemesPreview from "@/components/ThemesPreview"
import MacroSignals from "@/components/MacroSignals"
import AssetsPreview from "@/components/AssetsPreview"

export default function Home() {
  return (
    <main>
      <Hero/>
      <ThemesPreview/>
      <MacroSignals/>
      <AssetsPreview/>
    </main>
  )
}