import ThemeFilters from "@/components/ThemeFilters"
import ThemeMomentumTable from "@/components/ThemeMomentumTable"
import ThemeHeatmap from "@/components/ThemeHeatmap"
import ThemeTrendChart from "@/components/ThemeTrendChart"

export default function ThemesPage() {

  return (
    <main style={{maxWidth:1200,margin:"auto"}}>

      <h1>Theme Momentum Dashboard</h1>

      <ThemeFilters/>

      <ThemeMomentumTable/>

      <ThemeHeatmap/>

      <ThemeTrendChart/>

    </main>
  )
}

