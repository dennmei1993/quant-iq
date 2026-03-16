import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import DashboardPreview from "@/components/DashboardPreview"
import Footer from "@/components/Footer"

export default function Home() {

  return (

    <>
      <Hero />

      <section className="py-12 text-center">

        <h2 className="text-2xl font-semibold mb-4">
          Market Themes
        </h2>

        <p className="text-gray-600">
          Track the forces shaping global markets.
        </p>

      </section>

    </>

  )

}