import Navbar from "@/components/Navbar"
import DashboardPreview from "@/components/DashboardPreview"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import Features from "@/components/Features"

import ThemesPreview from "@/components/ThemesPreview"
import MacroSignals from "@/components/MacroSignals"
import AssetsPreview from "@/components/AssetsPreview"

import ThemeHero from "@/components/ThemeHero"
import ThemeAssetGraph from "@/components/ThemeAssetGraph"
import MacroDrivers from "@/components/MacroDrivers"

export default function Home() {
  return (
    <main style={{maxWidth:1200, margin:"auto"}}>
      <Hero/>
      <ThemesPreview/>
      <MacroSignals/>
      <AssetsPreview/>
      <ThemeHero/>

      <MacroDrivers/>

      <ThemeAssetGraph/>
    </main>
  )
}